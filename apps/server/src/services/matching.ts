export type Stock = {
  name: string;
  quantity: number;
  unit: string;
  expiresAt: Date | string;
};
export type Requirement = { name: string; quantity: number; unit: string };
export function canonical(name: string) {
  return name.toLowerCase().trim().replace(/\s+/g, " ");
}
const units: Record<string, { base: string; factor: number }> = {
  kg: { base: "g", factor: 1000 },
  g: { base: "g", factor: 1 },
  l: { base: "ml", factor: 1000 },
  ml: { base: "ml", factor: 1 },
};
export function available(
  stock: Stock[],
  requirement: Requirement,
  now = new Date(),
) {
  const start = new Date(now.toISOString().slice(0, 10));
  const wanted = units[requirement.unit] ?? {
    base: requirement.unit,
    factor: 1,
  };
  return stock
    .filter(
      (item) =>
        canonical(item.name) === canonical(requirement.name) &&
        new Date(item.expiresAt) >= start,
    )
    .reduce((sum, item) => {
      const unit = units[item.unit] ?? { base: item.unit, factor: 1 };
      return unit.base === wanted.base
        ? sum + (item.quantity * unit.factor) / wanted.factor
        : sum;
    }, 0);
}
export function matchRecipe(
  stock: Stock[],
  requirements: Requirement[],
  now = new Date(),
) {
  const missing = requirements
    .map((item) => ({
      name: item.name,
      unit: item.unit,
      quantity: Math.max(
        0,
        Math.round((item.quantity - available(stock, item, now)) * 1000) / 1000,
      ),
    }))
    .filter((item) => item.quantity > 0);
  return {
    missing,
    matchPercent: requirements.length
      ? Math.round(
          ((requirements.length - missing.length) / requirements.length) * 100,
        )
      : 100,
  };
}
export function convertQuantity(quantity: number, from: string, to: string) {
  const a = units[from] ?? { base: from, factor: 1 };
  const b = units[to] ?? { base: to, factor: 1 };
  return a.base === b.base ? (quantity * a.factor) / b.factor : null;
}
