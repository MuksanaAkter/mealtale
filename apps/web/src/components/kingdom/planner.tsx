"use client";
import { useState, type FormEvent } from "react";
import Image from "next/image";
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  CalendarDays,
  Trash2,
  ListChecks,
} from "lucide-react";
import { useKingdom } from "./provider";
import { Modal } from "../ui/common";
import { RecipeDetail } from "./recipe-detail";
import { dayKey, prettyDate, type Recipe } from "@/lib/types";
export function Planner() {
  const { data, mutate, busy } = useKingdom();
  const [offset, setOffset] = useState(0);
  const [cell, setCell] = useState<{ date: string; slot: string } | null>(null);
  const [selected, setSelected] = useState<Recipe | null>(null);
  const [requirements, setRequirements] = useState(false);
  const monday = new Date();
  monday.setHours(12, 0, 0, 0);
  monday.setDate(monday.getDate() - ((monday.getDay() + 6) % 7) + offset * 7);
  const days = Array.from({ length: 7 }, (_, index) => {
    const d = new Date(monday);
    d.setDate(d.getDate() + index);
    return d;
  });
  const keys = days.map((d) => dayKey(d));
  const weekMeals = data.meals.filter((m) =>
    keys.includes(m.date.slice(0, 10)),
  );
  const weekly = new Map<
    string,
    { name: string; quantity: number; unit: string }
  >();
  for (const meal of weekMeals)
    for (const ingredient of data.recipes.find((r) => r.id === meal.recipeId)
      ?.ingredients ?? []) {
      const key = `${ingredient.name}:${ingredient.unit}`;
      const previous = weekly.get(key);
      weekly.set(key, {
        ...ingredient,
        quantity: ingredient.quantity + (previous?.quantity ?? 0),
      });
    }
  async function save(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!cell) return;
    const recipeId = new FormData(e.currentTarget).get("recipeId");
    if (
      await mutate(
        "meals",
        "POST",
        { ...cell, recipeId },
        "A little something to look forward to. Your meal is planned.",
      )
    )
      setCell(null);
  }
  return (
    <>
      <div className="page-heading">
        <div>
          <span className="eyebrow">MAKE ROOM FOR SOMETHING DELICIOUS</span>
          <h1>
            The Royal <em>Feast.</em>
          </h1>
          <p>A week of little moments worth gathering around.</p>
        </div>
        <button
          className="button button-forest"
          onClick={() => setRequirements(true)}
        >
          <ListChecks size={17} /> This week’s ingredients
        </button>
      </div>
      <div className="planner-toolbar">
        <div>
          <CalendarDays size={19} />
          <h2>
            {prettyDate(keys[0])} — {prettyDate(keys[6])}
          </h2>
          <span className="badge badge-green">
            {weekMeals.length} meals planned
          </span>
        </div>
        <div>
          <button
            className="icon-button"
            aria-label="Previous week"
            onClick={() => setOffset(offset - 1)}
          >
            <ChevronLeft size={20} />
          </button>
          <button
            className="button button-outline small"
            onClick={() => setOffset(0)}
          >
            This week
          </button>
          <button
            className="icon-button"
            aria-label="Next week"
            onClick={() => setOffset(offset + 1)}
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>
      <div className="planner-scroll">
        <div className="planner-grid">
          <div className="planner-corner">A seat at the table</div>
          {days.map((day, index) => (
            <div
              key={keys[index]}
              className={`planner-day ${keys[index] === dayKey() ? "is-today" : ""}`}
            >
              <span>
                {day.toLocaleDateString("en-US", { weekday: "short" })}
              </span>
              <strong>{day.getDate()}</strong>
            </div>
          ))}
          {["Breakfast", "Lunch", "Dinner"].map((slot) => (
            <div className="planner-slot-row" key={slot}>
              <div className="planner-slot-label">
                <span>
                  {slot === "Breakfast" ? "☀" : slot === "Lunch" ? "◈" : "☾"}
                </span>
                {slot}
              </div>
              {keys.map((date) => {
                const meal = weekMeals.find(
                  (m) => m.date.slice(0, 10) === date && m.slot === slot,
                );
                const recipe = data.recipes.find(
                  (r) => r.id === meal?.recipeId,
                );
                return (
                  <div className="planner-cell" key={date}>
                    {meal && recipe ? (
                      <div className="planned-meal">
                        <button
                          className="planned-recipe"
                          onClick={() => setSelected(recipe)}
                        >
                          <Image
                            src={recipe.image}
                            alt=""
                            width={160}
                            height={100}
                          />
                          <strong>{recipe.name}</strong>
                          <small>
                            {recipe.duration} min · {recipe.servings} servings
                          </small>
                        </button>
                        <div className="planned-actions">
                          <button
                            aria-label={`Change ${slot} on ${date}`}
                            onClick={() => setCell({ date, slot })}
                          >
                            Change
                          </button>
                          <button
                            disabled={busy}
                            className="icon-button"
                            aria-label={`Remove ${slot} on ${date}`}
                            onClick={() =>
                              void mutate(
                                `meals/${meal.id}`,
                                "DELETE",
                                {},
                                "Meal removed from your plan.",
                              )
                            }
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </div>
                    ) : (
                      <button
                        className="add-meal"
                        onClick={() => setCell({ date, slot })}
                        aria-label={`Plan ${slot} on ${date}`}
                      >
                        <Plus size={18} />
                        <span>Plan a little magic</span>
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
      <p className="planner-note">
        ✧ Each recipe is planned for its listed servings. Open a meal to view
        its ingredients, or mark it cooked to update your pantry.
      </p>
      {cell && (
        <Modal
          title={`${cell.slot} · ${prettyDate(cell.date)}`}
          close={() => setCell(null)}
        >
          <form className="stack-form" onSubmit={save}>
            <label>
              Choose something delicious
              <select
                name="recipeId"
                required
                defaultValue={
                  weekMeals.find(
                    (m) =>
                      m.date.slice(0, 10) === cell.date && m.slot === cell.slot,
                  )?.recipeId ?? ""
                }
              >
                <option value="" disabled>
                  Open the cookbook…
                </option>
                {data.recipes.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.name} · {r.duration} min
                  </option>
                ))}
              </select>
            </label>
            <button className="button button-forest" disabled={busy}>
              Save to the royal table <Plus size={17} />
            </button>
          </form>
        </Modal>
      )}
      {requirements && (
        <Modal
          title="Ingredients for the week"
          close={() => setRequirements(false)}
        >
          <p className="muted">
            Total recipe requirements for {weekMeals.length} planned meals,
            before subtracting your current pantry stock.
          </p>
          {weekly.size ? (
            <ul className="detail-ingredients">
              {[...weekly.values()].map((i) => (
                <li key={`${i.name}:${i.unit}`}>
                  <span>{i.name}</span>
                  <strong>
                    {Number(i.quantity.toFixed(2))} {i.unit}
                  </strong>
                </li>
              ))}
            </ul>
          ) : (
            <p>
              No meals planned this week. Add a little inspiration to your
              calendar first.
            </p>
          )}
        </Modal>
      )}
      {selected && (
        <RecipeDetail recipe={selected} close={() => setSelected(null)} />
      )}
    </>
  );
}
