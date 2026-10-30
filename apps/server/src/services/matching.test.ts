import assert from "node:assert/strict";
import test from "node:test";
import { matchRecipe, convertQuantity } from "./matching.ts";
const now = new Date("2026-10-30T12:00:00Z");
test("matching converts units, combines stock, and excludes expired or incompatible quantities", () => {
  const stock = [
    { name: " Spinach ", quantity: 0.1, unit: "kg", expiresAt: "2026-11-01" },
    { name: "spinach", quantity: 50, unit: "g", expiresAt: "2026-10-30" },
    { name: "Spinach", quantity: 2, unit: "kg", expiresAt: "2026-10-29" },
    { name: "Spinach", quantity: 50, unit: "pcs", expiresAt: "2026-11-01" },
  ];
  const match = matchRecipe(
    stock,
    [
      { name: "Spinach", quantity: 200, unit: "g" },
      { name: "Salt", quantity: 3, unit: "g" },
    ],
    now,
  );
  assert.deepEqual(match.missing, [
    { name: "Spinach", quantity: 50, unit: "g" },
    { name: "Salt", quantity: 3, unit: "g" },
  ]);
  assert.equal(match.matchPercent, 0);
  assert.equal(
    matchRecipe(stock, [{ name: "Spinach", quantity: 150, unit: "g" }], now)
      .matchPercent,
    100,
  );
  assert.equal(convertQuantity(250, "ml", "l"), 0.25);
  assert.equal(convertQuantity(1, "pcs", "g"), null);
});
