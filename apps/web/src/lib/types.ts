export const categories = [
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
export type Category = (typeof categories)[number];
export type Ingredient = {
  id: string;
  name: string;
  category: Category;
  quantity: number;
  unit: string;
  image: string;
  purchasedAt: string;
  expiresAt: string;
  location: string;
  createdAt: string;
};
export type RecipeIngredient = { name: string; quantity: number; unit: string };
export type Recipe = {
  id: string;
  name: string;
  description: string;
  image: string;
  category: string;
  duration: number;
  difficulty: string;
  servings: number;
  ingredients: RecipeIngredient[];
  instructions: string[];
  missing: RecipeIngredient[];
  matchPercent: number;
  favorite: boolean;
};
export type ShoppingItem = {
  id: string;
  name: string;
  category: string;
  quantity: number;
  unit: string;
  purchased: boolean;
};
export type ShoppingList = { id: string; name: string; items: ShoppingItem[] };
export type Meal = { id: string; date: string; slot: string; recipeId: string };
export type Activity = {
  id: string;
  name: string;
  category: string;
  action: string;
  quantity: number;
  unit: string;
  createdAt: string;
};
export type KingdomState = {
  user: { id: string; name: string; email: string; createdAt: string };
  ingredients: Ingredient[];
  recipes: Recipe[];
  lists: ShoppingList[];
  meals: Meal[];
  notifications: {
    id: string;
    message: string;
    read: boolean;
    createdAt: string;
  }[];
  activities: Activity[];
};
export function dayKey(date = new Date()) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}
export function expiryDays(value: string) {
  const today = new Date(dayKey());
  return Math.round(
    (new Date(value.slice(0, 10)).getTime() - today.getTime()) / 86400000,
  );
}
export function freshness(value: string) {
  const days = expiryDays(value);
  return days < 0 ? "Expired" : days <= 3 ? "Expiring soon" : "Fresh";
}
export function prettyDate(value: string) {
  return new Date(`${value.slice(0, 10)}T12:00:00`).toLocaleDateString(
    "en-US",
    { month: "short", day: "numeric" },
  );
}
export function number(value: number) {
  return Number(value.toFixed(2)).toLocaleString("en-US");
}
