"use client";
import Image from "next/image";
import { useState } from "react";
import { Clock3, Users, Check, ShoppingBasket, ChefHat } from "lucide-react";
import { Modal } from "../ui/common";
import type { Recipe } from "@/lib/types";
import { useKingdom } from "./provider";
export function RecipeDetail({
  recipe: original,
  close,
}: {
  recipe: Recipe;
  close: () => void;
}) {
  const { data, mutate, busy } = useKingdom();
  const recipe = data.recipes.find((r) => r.id === original.id) ?? original;
  const [listId, setListId] = useState(data.lists[0]?.id ?? "");
  return (
    <Modal title={recipe.name} close={close}>
      <Image
        className="detail-image"
        src={recipe.image}
        width={650}
        height={290}
        alt={recipe.name}
      />
      <p className="detail-description">{recipe.description}</p>
      <div className="detail-meta">
        <span>
          <Clock3 size={16} />
          {recipe.duration} minutes
        </span>
        <span>
          <Users size={16} />
          {recipe.servings} servings
        </span>
        <span>✧ {recipe.difficulty}</span>
      </div>
      <h3>The ingredients</h3>
      <p className="muted">
        Exact ingredient names and convertible quantities are matched. Expired
        stock is excluded; no AI is used.
      </p>
      <ul className="detail-ingredients">
        {recipe.ingredients.map((i) => {
          const missing = recipe.missing.find((m) => m.name === i.name);
          return (
            <li key={i.name}>
              <span>
                {!missing ? (
                  <Check size={16} />
                ) : (
                  <span className="missing-dot" />
                )}
                {i.name}
              </span>
              <span>
                {i.quantity} {i.unit}
                {missing && (
                  <small>
                    Need {missing.quantity} {missing.unit}
                  </small>
                )}
              </span>
            </li>
          );
        })}
      </ul>
      <h3>A little kitchen magic</h3>
      <ol className="recipe-steps">
        {recipe.instructions.map((step, i) => (
          <li key={step}>
            <span>{i + 1}</span>
            <p>{step}</p>
          </li>
        ))}
      </ol>
      <div className="detail-action">
        {recipe.missing.length ? (
          <>
            <label>
              Send missing ingredients to
              <select
                value={listId}
                onChange={(e) => setListId(e.target.value)}
              >
                <option value="" disabled>
                  Choose a market list
                </option>
                {data.lists.map((l) => (
                  <option value={l.id} key={l.id}>
                    {l.name}
                  </option>
                ))}
              </select>
            </label>
            {!data.lists.length && (
              <p className="muted">Create a list in Market Quests first.</p>
            )}
            <button
              className="button button-forest"
              disabled={busy || !listId}
              onClick={() =>
                void mutate(
                  `recipes/${recipe.id}/shopping`,
                  "POST",
                  { listId },
                  "Missing ingredients added to your market quest.",
                )
              }
            >
              <ShoppingBasket size={17} /> Add missing ingredients
            </button>
          </>
        ) : (
          <button
            className="button button-forest"
            disabled={busy}
            onClick={() => {
              if (
                window.confirm(
                  `Mark ${recipe.name} as cooked? This will deduct its ingredients from your pantry.`,
                )
              )
                void mutate(
                  `recipes/${recipe.id}/cook`,
                  "POST",
                  {},
                  "A feast well made! Your pantry and ledger are updated.",
                );
            }}
          >
            <ChefHat size={18} /> Mark as cooked · update pantry
          </button>
        )}
      </div>
    </Modal>
  );
}
