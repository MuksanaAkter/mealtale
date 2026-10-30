export const kingdom = {
  name: "MealTale",
  keeperTitle: "Kitchen Keeper",
  tagline: "Every ingredient has a story. Every meal is a little magic.",
} as const;

export const kingdomFeatures = [
  { title: "Royal Vault", href: "/royal-vault", description: "Keep ingredients, quantities, and expiry dates in your royal pantry." },
  { title: "Ancient Cookbook", href: "/ancient-cookbook", description: "Discover recipes using the ingredients already in your vault." },
  { title: "Market Quest", href: "/market-quest", description: "Turn missing ingredients into a shopping quest." },
  { title: "Royal Feast", href: "/royal-feast", description: "Plan meals and bring your kingdom to the table." },
] as const;
