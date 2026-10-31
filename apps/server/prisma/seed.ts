import { db } from "../src/lib/db.ts";
import { hashPassword } from "../src/lib/security.ts";
import { seedPantry, seedRecipes } from "../src/services/starter.ts";

const demoAccounts = [
  {
    name: "Rowan Greenleaf",
    email: "rowan@demo.mealtale.local",
    favorites: ["forest-soup", "keepers-salad"],
  },
  {
    name: "Willow Hearthwood",
    email: "willow@demo.mealtale.local",
    favorites: ["mushroom-toast", "apple-porridge"],
  },
  {
    name: "Ember Ashford",
    email: "ember@demo.mealtale.local",
    favorites: ["golden-pasta", "feast-chicken"],
  },
];
const seedDemos =
  process.argv.includes("--demo") || process.env.SEED_DEMO_ACCOUNTS === "true";

try {
  await seedRecipes();
  console.log("Seeded 8 shared kingdom recipes.");
  if (seedDemos) {
    for (const account of demoAccounts) {
      const created = await db.$transaction(async (tx) => {
        const existing = await tx.user.findUnique({
          where: { email: account.email },
        });
        if (existing) return false;
        const user = await tx.user.create({
          data: {
            name: account.name,
            email: account.email,
            passwordHash: hashPassword("Keeper@12345"),
          },
        });
        await seedPantry(user.id, tx);
        await tx.favoriteRecipe.createMany({
          data: account.favorites.map((recipeId) => ({
            userId: user.id,
            recipeId,
          })),
        });
        return true;
      });
      console.log(
        `${created ? "Created" : "Preserved existing account:"} ${account.email}`,
      );
    }
    console.log(
      "Demo accounts are ready. Login details are documented in README.md; existing passwords and pantry data are unchanged.",
    );
  }
} finally {
  await db.$disconnect();
}
