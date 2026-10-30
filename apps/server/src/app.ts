import {
  createServer,
  type IncomingMessage,
  type ServerResponse,
} from "node:http";
import { z } from "zod";
import { Prisma } from "@prisma/client";
import { db } from "./lib/db.ts";
import {
  hashPassword,
  verifyPassword,
  newToken,
  tokenHash,
} from "./lib/security.ts";
import {
  matchRecipe,
  canonical,
  convertQuantity,
} from "./services/matching.ts";
import { seedPantry } from "./services/starter.ts";

const categories = [
  "Vegetables",
  "Fruits",
  "Dairy",
  "Meat",
  "Seafood",
  "Grains",
  "Spices",
  "Beverages",
  "Other",
] as const;
const quantity = z.number().finite().positive().max(1000000);
const unit = z.enum(["g", "kg", "ml", "l", "pcs"]);
const date = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/)
  .refine((s) => {
    const d = new Date(s);
    return !Number.isNaN(d.getTime()) && d.toISOString().slice(0, 10) === s;
  }, "Enter a valid date");
const itemSchema = z.object({
  name: z.string().trim().min(1).max(100),
  category: z.enum(categories),
  quantity,
  unit,
});
const ingredientSchema = itemSchema
  .extend({
    purchasedAt: date,
    expiresAt: date,
    location: z.enum(["Fridge", "Freezer", "Pantry"]),
    image: z
      .string()
      .regex(/^\/illustrations\/[a-z-]+\.svg$/)
      .default("/illustrations/ingredients.svg"),
  })
  .refine(
    (v) => v.expiresAt >= v.purchasedAt,
    "Expiry must be on or after purchase",
  );
const signupSchema = z.object({
  name: z.string().trim().min(2).max(60),
  email: z
    .string()
    .trim()
    .email()
    .max(254)
    .transform((v) => v.toLowerCase()),
  password: z.string().min(10).max(128),
  starter: z.boolean().default(false),
});
const cookieName = "mealtale_session";
const attempts = new Map<string, { count: number; reset: number }>();
class HttpError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}
async function body(req: IncomingMessage): Promise<unknown> {
  if (!req.headers["content-type"]?.includes("application/json"))
    throw new HttpError(415, "Use application/json");
  const chunks: Buffer[] = [];
  let size = 0;
  for await (const chunk of req) {
    const bytes = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk);
    size += bytes.length;
    if (size > 32768) throw new HttpError(413, "Request is too large");
    chunks.push(bytes);
  }
  try {
    return JSON.parse(Buffer.concat(chunks).toString("utf8"));
  } catch {
    throw new HttpError(400, "Invalid JSON");
  }
}
function send(res: ServerResponse, status: number, data: unknown) {
  res.writeHead(status, {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store",
    "X-Content-Type-Options": "nosniff",
  });
  res.end(JSON.stringify(data));
}
function setCookie(res: ServerResponse, value: string, maxAge = 604800) {
  res.setHeader(
    "Set-Cookie",
    `${cookieName}=${value}; HttpOnly; SameSite=Lax; Path=/; Max-Age=${maxAge}${process.env.NODE_ENV === "production" || process.env.WEB_ORIGIN?.startsWith("https://") ? "; Secure" : ""}`,
  );
}
async function session(req: IncomingMessage) {
  const raw = req.headers.cookie
    ?.split(";")
    .map((s) => s.trim())
    .find((s) => s.startsWith(`${cookieName}=`))
    ?.slice(cookieName.length + 1);
  if (!raw || !/^[a-f0-9]{64}$/.test(raw))
    throw new HttpError(401, "Your kingdom awaits. Please sign in.");
  const found = await db.session.findUnique({
    where: { id: tokenHash(raw) },
    include: { user: true },
  });
  if (!found || found.expiresAt < new Date())
    throw new HttpError(401, "Session expired. Please sign in again.");
  return found;
}
async function createSession(res: ServerResponse, userId: string) {
  const token = newToken();
  await db.session.deleteMany({ where: { expiresAt: { lt: new Date() } } });
  await db.session.create({
    data: {
      id: tokenHash(token),
      userId,
      expiresAt: new Date(Date.now() + 604800000),
    },
  });
  setCookie(res, token);
}
function limit(req: IncomingMessage) {
  const now = Date.now();
  for (const [key, value] of attempts)
    if (value.reset < now) attempts.delete(key);
  const key = req.socket.remoteAddress ?? "local";
  const previous = attempts.get(key) ?? { count: 0, reset: now + 900000 };
  if (++previous.count > 40)
    throw new HttpError(429, "Too many attempts. Try again in 15 minutes.");
  attempts.set(key, previous);
}
async function state(userId: string) {
  const [user, ingredients, recipes, favorites, lists, meals, activities] =
    await Promise.all([
      db.user.findUniqueOrThrow({
        where: { id: userId },
        select: { id: true, name: true, email: true, createdAt: true },
      }),
      db.ingredient.findMany({
        where: { userId },
        orderBy: { expiresAt: "asc" },
      }),
      db.recipe.findMany({
        include: { ingredients: true },
        orderBy: { name: "asc" },
      }),
      db.favoriteRecipe.findMany({ where: { userId } }),
      db.shoppingList.findMany({
        where: { userId },
        include: { items: { orderBy: { name: "asc" } } },
        orderBy: { createdAt: "asc" },
      }),
      db.mealPlan.findMany({ where: { userId }, orderBy: { date: "asc" } }),
      db.inventoryActivity.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" },
        take: 2000,
      }),
    ]);
  const today = new Date(new Date().toISOString().slice(0, 10));
  for (const ingredient of ingredients) {
    const days = Math.ceil(
      (ingredient.expiresAt.getTime() - today.getTime()) / 86400000,
    );
    if (days <= 3) {
      const key = `${ingredient.id}:${ingredient.expiresAt.toISOString()}:${days < 0 ? "expired" : "soon"}`;
      const message =
        days < 0
          ? `${ingredient.name} has expired. Review it in the Royal Vault.`
          : `${ingredient.name} ${days === 0 ? "expires today" : `expires in ${days} day${days > 1 ? "s" : ""}`}. A little kitchen magic can save it.`;
      await db.notification.upsert({
        where: { userId_key: { userId, key } },
        create: { userId, key, message },
        update: { message },
      });
    }
  }
  const notifications = await db.notification.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    take: 30,
  });
  return {
    user,
    ingredients,
    recipes: recipes.map((r) => ({
      ...r,
      ...matchRecipe(ingredients, r.ingredients),
      favorite: favorites.some((f) => f.recipeId === r.id),
    })),
    lists,
    meals,
    notifications,
    activities,
  };
}
async function handle(req: IncomingMessage, res: ServerResponse) {
  const path = new URL(req.url ?? "/", "http://localhost").pathname;
  const method = req.method;
  if (method === "GET" && path === "/health")
    return send(res, 200, { status: "ok", service: "mealtale-server" });
  if (!path.startsWith("/api/")) throw new HttpError(404, "Not found");
  if (method !== "GET") {
    const origin = req.headers.origin;
    const allowed = (process.env.WEB_ORIGIN ?? "http://localhost:3000").split(
      ",",
    );
    if (origin && !allowed.includes(origin))
      throw new HttpError(403, "This origin is not allowed");
  }
  if (path === "/api/auth/register" && method === "POST") {
    limit(req);
    const input = signupSchema.parse(await body(req));
    const user = await db.user.create({
      data: {
        name: input.name,
        email: input.email,
        passwordHash: hashPassword(input.password),
      },
    });
    if (input.starter) await seedPantry(user.id);
    await createSession(res, user.id);
    return send(res, 201, { ok: true });
  }
  if (path === "/api/auth/login" && method === "POST") {
    limit(req);
    const input = signupSchema
      .pick({ email: true, password: true })
      .parse(await body(req));
    const user = await db.user.findUnique({ where: { email: input.email } });
    const fallback = "0123456789abcdef0123456789abcdef:" + "0".repeat(128);
    const valid = verifyPassword(
      input.password,
      user?.passwordHash ?? fallback,
    );
    if (!user || !valid)
      throw new HttpError(401, "Email or password is incorrect");
    await createSession(res, user.id);
    return send(res, 200, { ok: true });
  }
  if (path === "/api/auth/demo" && method === "POST") {
    limit(req);
    const user = await db.user.create({
      data: {
        name: "Rowan",
        email: `keeper-${newToken().slice(0, 20)}@demo.mealtale.local`,
        passwordHash: hashPassword(newToken()),
      },
    });
    await seedPantry(user.id);
    await createSession(res, user.id);
    return send(res, 201, { ok: true });
  }
  const current = await session(req);
  const userId = current.userId;
  if (path === "/api/auth/logout" && method === "POST") {
    await db.session.delete({ where: { id: current.id } });
    setCookie(res, "", 0);
    return send(res, 200, { ok: true });
  }
  if (path === "/api/state" && method === "GET")
    return send(res, 200, await state(userId));
  if (path === "/api/profile" && method === "PATCH") {
    const input = z
      .object({ name: z.string().trim().min(2).max(60) })
      .parse(await body(req));
    await db.user.update({ where: { id: userId }, data: input });
    return send(res, 200, { ok: true });
  }
  if (path === "/api/ingredients" && method === "POST") {
    const input = ingredientSchema.parse(await body(req));
    await db.$transaction(async (tx) => {
      await tx.ingredient.create({
        data: {
          ...input,
          userId,
          purchasedAt: new Date(input.purchasedAt),
          expiresAt: new Date(input.expiresAt),
        },
      });
      await tx.inventoryActivity.create({
        data: {
          userId,
          name: input.name,
          category: input.category,
          quantity: input.quantity,
          unit: input.unit,
          action: "added",
        },
      });
    });
    return send(res, 201, { ok: true });
  }
  const ingredientId = path.match(/^\/api\/ingredients\/([^/]+)$/)?.[1];
  if (ingredientId && (method === "PATCH" || method === "DELETE")) {
    const item = await db.ingredient.findFirst({
      where: { id: ingredientId, userId },
    });
    if (!item) throw new HttpError(404, "Ingredient not found");
    if (method === "PATCH") {
      const input = ingredientSchema.parse(await body(req));
      await db.$transaction(async (tx) => {
        await tx.ingredient.updateMany({
          where: { id: ingredientId, userId },
          data: {
            ...input,
            purchasedAt: new Date(input.purchasedAt),
            expiresAt: new Date(input.expiresAt),
          },
        });
        await tx.inventoryActivity.create({
          data: {
            userId,
            name: input.name,
            category: input.category,
            quantity: input.quantity,
            unit: input.unit,
            action: "edited",
          },
        });
      });
    } else {
      const { action } = z
        .object({ action: z.enum(["removed", "consumed", "wasted"]) })
        .parse(await body(req));
      await db.$transaction(async (tx) => {
        const deleted = await tx.ingredient.deleteMany({
          where: { id: ingredientId, userId },
        });
        if (deleted.count)
          await tx.inventoryActivity.create({
            data: {
              userId,
              name: item.name,
              category: item.category,
              quantity: item.quantity,
              unit: item.unit,
              action,
            },
          });
      });
    }
    return send(res, 200, { ok: true });
  }
  const recipeAction = path.match(
    /^\/api\/recipes\/([^/]+)\/(favorite|shopping|cook)$/,
  );
  if (recipeAction && method === "POST") {
    const recipe = await db.recipe.findUnique({
      where: { id: recipeAction[1] },
      include: { ingredients: true },
    });
    if (!recipe) throw new HttpError(404, "Recipe not found");
    const action = recipeAction[2];
    if (action === "favorite") {
      const input = z.object({ favorite: z.boolean() }).parse(await body(req));
      if (input.favorite)
        await db.favoriteRecipe.upsert({
          where: { userId_recipeId: { userId, recipeId: recipe.id } },
          create: { userId, recipeId: recipe.id },
          update: {},
        });
      else
        await db.favoriteRecipe.deleteMany({
          where: { userId, recipeId: recipe.id },
        });
    }
    if (action === "shopping") {
      const { listId } = z
        .object({ listId: z.string() })
        .parse(await body(req));
      const list = await db.shoppingList.findFirst({
        where: { id: listId, userId },
      });
      if (!list) throw new HttpError(404, "Shopping list not found");
      const stock = await db.ingredient.findMany({ where: { userId } });
      const { missing } = matchRecipe(stock, recipe.ingredients);
      await db.$transaction(async (tx) => {
        for (const item of missing) {
          const existing = await tx.shoppingListItem.findFirst({
            where: {
              listId,
              name: { equals: item.name, mode: "insensitive" },
              unit: item.unit,
              purchased: false,
            },
          });
          if (existing)
            await tx.shoppingListItem.update({
              where: { id: existing.id },
              data: { quantity: Math.max(existing.quantity, item.quantity) },
            });
          else
            await tx.shoppingListItem.create({
              data: { ...item, listId, category: "Other" },
            });
        }
      });
    }
    if (action === "cook") {
      await db.$transaction(
        async (tx) => {
          const stock = await tx.ingredient.findMany({
            where: { userId },
            orderBy: { expiresAt: "asc" },
          });
          if (matchRecipe(stock, recipe.ingredients).missing.length)
            throw new HttpError(
              409,
              "Your pantry is missing ingredients for this recipe",
            );
          const today = new Date(new Date().toISOString().slice(0, 10));
          for (const required of recipe.ingredients) {
            let remaining = required.quantity;
            for (const item of stock.filter(
              (i) =>
                canonical(i.name) === canonical(required.name) &&
                i.expiresAt >= today,
            )) {
              const available = convertQuantity(
                item.quantity,
                item.unit,
                required.unit,
              );
              if (available === null || remaining <= 0) continue;
              const used = Math.min(remaining, available);
              const usedInStockUnit = convertQuantity(
                used,
                required.unit,
                item.unit,
              )!;
              const left = Math.max(0, item.quantity - usedInStockUnit);
              if (left < 0.00001)
                await tx.ingredient.delete({ where: { id: item.id } });
              else
                await tx.ingredient.update({
                  where: { id: item.id },
                  data: { quantity: Math.round(left * 1000) / 1000 },
                });
              await tx.inventoryActivity.create({
                data: {
                  userId,
                  name: item.name,
                  category: item.category,
                  action: "consumed",
                  quantity: usedInStockUnit,
                  unit: item.unit,
                },
              });
              remaining -= used;
            }
          }
        },
        { isolationLevel: Prisma.TransactionIsolationLevel.Serializable },
      );
    }
    return send(res, 200, { ok: true });
  }
  if (path === "/api/lists" && method === "POST") {
    const input = z
      .object({ name: z.string().trim().min(1).max(100) })
      .parse(await body(req));
    const list = await db.shoppingList.create({ data: { ...input, userId } });
    return send(res, 201, { id: list.id });
  }
  const listMatch = path.match(/^\/api\/lists\/([^/]+)(\/items)?$/);
  if (listMatch && (method === "POST" || method === "DELETE")) {
    const list = await db.shoppingList.findFirst({
      where: { id: listMatch[1], userId },
    });
    if (!list) throw new HttpError(404, "Shopping list not found");
    if (method === "DELETE" && !listMatch[2])
      await db.shoppingList.delete({ where: { id: list.id } });
    else if (method === "POST" && listMatch[2])
      await db.shoppingListItem.create({
        data: { ...itemSchema.parse(await body(req)), listId: list.id },
      });
    else throw new HttpError(405, "Method not allowed");
    return send(res, 200, { ok: true });
  }
  const shoppingId = path.match(/^\/api\/shopping-items\/([^/]+)$/)?.[1];
  if (shoppingId && (method === "PATCH" || method === "DELETE")) {
    const where = { id: shoppingId, list: { userId } };
    if (!(await db.shoppingListItem.findFirst({ where })))
      throw new HttpError(404, "Shopping item not found");
    if (method === "DELETE") await db.shoppingListItem.deleteMany({ where });
    else {
      const input = z
        .object({
          purchased: z.boolean().optional(),
          quantity: quantity.optional(),
        })
        .refine((v) => Object.keys(v).length > 0)
        .parse(await body(req));
      await db.shoppingListItem.updateMany({ where, data: input });
    }
    return send(res, 200, { ok: true });
  }
  if (path === "/api/meals" && method === "POST") {
    const input = z
      .object({
        recipeId: z.string(),
        date,
        slot: z.enum(["Breakfast", "Lunch", "Dinner"]),
      })
      .parse(await body(req));
    if (!(await db.recipe.findUnique({ where: { id: input.recipeId } })))
      throw new HttpError(404, "Recipe not found");
    const mealDate = new Date(input.date);
    await db.mealPlan.upsert({
      where: { userId_date_slot: { userId, date: mealDate, slot: input.slot } },
      create: { ...input, userId, date: mealDate },
      update: { recipeId: input.recipeId },
    });
    return send(res, 201, { ok: true });
  }
  const mealId = path.match(/^\/api\/meals\/([^/]+)$/)?.[1];
  if (mealId && method === "DELETE") {
    const deleted = await db.mealPlan.deleteMany({
      where: { id: mealId, userId },
    });
    if (!deleted.count) throw new HttpError(404, "Meal not found");
    return send(res, 200, { ok: true });
  }
  if (path === "/api/notifications/read" && method === "POST") {
    await db.notification.updateMany({
      where: { userId },
      data: { read: true },
    });
    return send(res, 200, { ok: true });
  }
  throw new HttpError(404, "Not found");
}
export function createApp() {
  return createServer((req, res) => {
    void handle(req, res).catch((error: unknown) => {
      if (error instanceof HttpError)
        return send(res, error.status, { error: error.message });
      if (error instanceof z.ZodError)
        return send(res, 400, {
          error: error.issues.map((i) => i.message).join(". "),
        });
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === "P2002")
          return send(res, 409, {
            error:
              "This record already exists. Try signing in if you have an account.",
          });
        if (error.code === "P2034")
          return send(res, 409, {
            error:
              "Your pantry changed during this action. Refresh and try again.",
          });
      }
      console.error(
        error instanceof Error ? error.message : "Unknown server error",
      );
      send(res, 500, {
        error: "The kitchen is temporarily unavailable. Please try again.",
      });
    });
  });
}
