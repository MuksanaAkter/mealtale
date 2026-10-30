import assert from "node:assert/strict";
import test from "node:test";
import { once } from "node:events";
import type { AddressInfo } from "node:net";
import { createApp } from "./app.ts";
import { db } from "./lib/db.ts";
import { randomBytes } from "node:crypto";
import { verifyPassword } from "./lib/security.ts";

type State = {
  user: { id: string; name: string };
  ingredients: { id: string; name: string; quantity: number }[];
  recipes: { id: string; favorite: boolean; missing: unknown[] }[];
  lists: {
    id: string;
    items: { id: string; name: string; purchased: boolean; quantity: number }[];
  }[];
  meals: { id: string; recipeId: string }[];
  activities: { action: string; name: string }[];
};
test(
  "database-backed authentication, pantry, recipe, lists, meals, and ownership",
  { skip: !process.env.DATABASE_URL },
  async (t) => {
    const server = createApp();
    const created: string[] = [];
    server.listen(0, "127.0.0.1");
    await once(server, "listening");
    t.after(async () => {
      await db.user.deleteMany({ where: { id: { in: created } } });
      await new Promise<void>((resolve) => server.close(() => resolve()));
      await db.$disconnect();
    });
    const base = `http://127.0.0.1:${(server.address() as AddressInfo).port}`;
    async function call(
      path: string,
      method = "GET",
      value?: unknown,
      cookie = "",
    ) {
      return fetch(`${base}/api/${path}`, {
        method,
        headers: {
          "Content-Type": "application/json",
          cookie,
          origin: "http://localhost:3000",
        },
        ...(method === "GET" ? {} : { body: JSON.stringify(value ?? {}) }),
      });
    }
    async function state(cookie: string) {
      const response = await call("state", "GET", undefined, cookie);
      assert.equal(response.status, 200);
      return response.json() as Promise<State>;
    }
    assert.equal((await call("state")).status, 401);
    assert.equal(
      (
        await call("auth/register", "POST", {
          name: "Test",
          email: "invalid",
          password: "short",
        })
      ).status,
      400,
    );
    const email = `test-${randomBytes(8).toString("hex")}@example.local`;
    const password = "A-strong-test-password-42";
    const registration = await call("auth/register", "POST", {
      name: "Test Keeper",
      email,
      password,
      starter: true,
    });
    assert.equal(registration.status, 201);
    const cookie = registration.headers.getSetCookie()[0].split(";")[0];
    assert.match(registration.headers.getSetCookie()[0], /HttpOnly/);
    let data = await state(cookie);
    created.push(data.user.id);
    assert.equal(data.ingredients.length, 12);
    const user = await db.user.findUniqueOrThrow({
      where: { id: data.user.id },
    });
    assert.notEqual(user.passwordHash, password);
    assert.ok(verifyPassword(password, user.passwordHash));
    assert.equal(
      (
        await call("auth/login", "POST", {
          email,
          password: "an-incorrect-password",
        })
      ).status,
      401,
    );
    assert.equal(
      (await call("auth/login", "POST", { email, password })).status,
      200,
    );
    const otherRegistration = await call("auth/register", "POST", {
      name: "Other Keeper",
      email: `other-${email}`,
      password,
      starter: false,
    });
    const otherCookie = otherRegistration.headers
      .getSetCookie()[0]
      .split(";")[0];
    const other = await state(otherCookie);
    created.push(other.user.id);
    assert.equal(other.ingredients.length, 0);
    const ingredient = {
      name: "Test carrots",
      category: "Vegetables",
      quantity: 500,
      unit: "g",
      purchasedAt: "2026-10-01",
      expiresAt: "2026-12-01",
      location: "Fridge",
      image: "/illustrations/vegetables.svg",
    };
    assert.equal(
      (
        await call(
          "ingredients",
          "POST",
          { ...ingredient, quantity: -1 },
          cookie,
        )
      ).status,
      400,
    );
    assert.equal(
      (
        await call(
          "ingredients",
          "POST",
          { ...ingredient, expiresAt: "2026-02-31" },
          cookie,
        )
      ).status,
      400,
    );
    assert.equal(
      (await call("ingredients", "POST", ingredient, cookie)).status,
      201,
    );
    data = await state(cookie);
    const item = data.ingredients.find((i) => i.name === ingredient.name)!;
    assert.ok(item);
    assert.equal(
      (
        await call(
          `ingredients/${item.id}`,
          "PATCH",
          { ...ingredient, quantity: 250 },
          otherCookie,
        )
      ).status,
      404,
    );
    assert.equal(
      (
        await call(
          `ingredients/${item.id}`,
          "PATCH",
          { ...ingredient, quantity: 250 },
          cookie,
        )
      ).status,
      200,
    );
    assert.equal(
      (await state(cookie)).ingredients.find((i) => i.id === item.id)?.quantity,
      250,
    );
    assert.equal(
      (
        await call(
          `ingredients/${item.id}`,
          "DELETE",
          { action: "wasted" },
          cookie,
        )
      ).status,
      200,
    );
    assert.ok(
      (await state(cookie)).activities.some(
        (a) => a.name === ingredient.name && a.action === "wasted",
      ),
    );
    assert.equal(
      (
        await call(
          "recipes/forest-soup/favorite",
          "POST",
          { favorite: true },
          cookie,
        )
      ).status,
      200,
    );
    assert.equal(
      (await state(cookie)).recipes.find((r) => r.id === "forest-soup")
        ?.favorite,
      true,
    );
    assert.equal(
      (await call("recipes/forest-soup/cook", "POST", {}, cookie)).status,
      200,
    );
    data = await state(cookie);
    assert.equal(
      data.ingredients.find((i) => i.name === "Mushrooms")?.quantity,
      50,
    );
    assert.ok(data.activities.some((a) => a.action === "consumed"));
    const list = data.lists[0];
    assert.equal(
      (
        await call(
          `lists/${list.id}/items`,
          "POST",
          { name: "Oats", category: "Grains", quantity: 100, unit: "g" },
          otherCookie,
        )
      ).status,
      404,
    );
    assert.equal(
      (
        await call(
          "recipes/mushroom-toast/shopping",
          "POST",
          { listId: list.id },
          cookie,
        )
      ).status,
      200,
    );
    data = await state(cookie);
    const shopping = data.lists[0].items[0];
    assert.equal(
      (
        await call(
          `shopping-items/${shopping.id}`,
          "PATCH",
          { purchased: true, quantity: 2 },
          otherCookie,
        )
      ).status,
      404,
    );
    assert.equal(
      (
        await call(
          `shopping-items/${shopping.id}`,
          "PATCH",
          { purchased: true, quantity: 2 },
          cookie,
        )
      ).status,
      200,
    );
    assert.equal(
      (await call(`shopping-items/${shopping.id}`, "DELETE", {}, cookie))
        .status,
      200,
    );
    const plan = { recipeId: "forest-soup", date: "2026-11-04", slot: "Lunch" };
    assert.equal((await call("meals", "POST", plan, cookie)).status, 201);
    assert.equal(
      (
        await call(
          "meals",
          "POST",
          { ...plan, recipeId: "golden-pasta" },
          cookie,
        )
      ).status,
      201,
    );
    data = await state(cookie);
    const meal = data.meals.find((m) => m.recipeId === "golden-pasta")!;
    assert.equal(
      (await call(`meals/${meal.id}`, "DELETE", {}, otherCookie)).status,
      404,
    );
    assert.equal(
      (await call(`meals/${meal.id}`, "DELETE", {}, cookie)).status,
      200,
    );
    assert.equal(
      (await call("profile", "PATCH", { name: "Keeper Renamed" }, cookie))
        .status,
      200,
    );
    assert.equal((await state(cookie)).user.name, "Keeper Renamed");
    assert.equal(
      (await call("notifications/read", "POST", {}, cookie)).status,
      200,
    );
    assert.equal((await call("auth/logout", "POST", {}, cookie)).status, 200);
    assert.equal((await call("state", "GET", undefined, cookie)).status, 401);
  },
);
