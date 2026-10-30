import type { Prisma } from "@prisma/client";
import { db } from "../lib/db.ts";
import { recipes } from "../../prisma/catalog.ts";

export async function seedRecipes() {
  for (const recipe of recipes) {
    const { ingredients, ...fields } = recipe;
    await db.recipe.upsert({
      where: { id: recipe.id },
      create: { ...fields, ingredients: { create: ingredients } },
      update: {
        ...fields,
        ingredients: { deleteMany: {}, create: ingredients },
      },
    });
  }
}
export async function seedPantry(
  userId: string,
  transaction?: Prisma.TransactionClient,
) {
  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);
  const date = (days: number) => new Date(today.getTime() + days * 86400000);
  const items = [
    {
      name: "Spinach",
      category: "Vegetables",
      quantity: 150,
      unit: "g",
      days: 2,
      location: "Fridge",
    },
    {
      name: "Mushrooms",
      category: "Vegetables",
      quantity: 250,
      unit: "g",
      days: 3,
      location: "Fridge",
    },
    {
      name: "Tomatoes",
      category: "Vegetables",
      quantity: 500,
      unit: "g",
      days: 6,
      location: "Fridge",
    },
    {
      name: "Carrots",
      category: "Vegetables",
      quantity: 600,
      unit: "g",
      days: 10,
      location: "Fridge",
    },
    {
      name: "Pasta",
      category: "Grains",
      quantity: 500,
      unit: "g",
      days: 180,
      location: "Pantry",
    },
    {
      name: "Basil",
      category: "Spices",
      quantity: 30,
      unit: "g",
      days: 2,
      location: "Fridge",
    },
    {
      name: "Olive oil",
      category: "Other",
      quantity: 500,
      unit: "ml",
      days: 120,
      location: "Pantry",
    },
    {
      name: "Salt",
      category: "Spices",
      quantity: 250,
      unit: "g",
      days: 365,
      location: "Pantry",
    },
    {
      name: "Eggs",
      category: "Dairy",
      quantity: 6,
      unit: "pcs",
      days: 9,
      location: "Fridge",
    },
    {
      name: "Milk",
      category: "Dairy",
      quantity: 500,
      unit: "ml",
      days: 1,
      location: "Fridge",
    },
    {
      name: "Rice",
      category: "Grains",
      quantity: 1000,
      unit: "g",
      days: 200,
      location: "Pantry",
    },
    {
      name: "Apples",
      category: "Fruits",
      quantity: 4,
      unit: "pcs",
      days: 8,
      location: "Pantry",
    },
  ];
  const populate = async (tx: Prisma.TransactionClient) => {
    for (const { days, ...item } of items) {
      await tx.ingredient.create({
        data: {
          ...item,
          userId,
          purchasedAt: date(-2),
          expiresAt: date(days),
          image: `/illustrations/${item.category === "Vegetables" ? "vegetables" : item.category === "Fruits" ? "apples" : item.category === "Dairy" ? "dairy" : "ingredients"}.svg`,
        },
      });
      await tx.inventoryActivity.create({
        data: {
          userId,
          name: item.name,
          category: item.category,
          quantity: item.quantity,
          unit: item.unit,
          action: "added",
        },
      });
    }
    await tx.shoppingList.create({
      data: {
        userId,
        name: "The next market adventure",
        items: {
          create: [
            { name: "Butter", category: "Dairy", quantity: 200, unit: "g" },
            { name: "Bread", category: "Grains", quantity: 8, unit: "pcs" },
          ],
        },
      },
    });
    await tx.mealPlan.create({
      data: { userId, recipeId: "forest-soup", date: today, slot: "Dinner" },
    });
  };
  if (transaction) await populate(transaction);
  else await db.$transaction(populate);
}
