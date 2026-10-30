"use client";
import Image from "next/image";
import { Heart, Clock3, ArrowUpRight, Leaf } from "lucide-react";
import type { Recipe } from "@/lib/types";
import { useKingdom } from "./provider";
export function RecipeCard({
  recipe,
  open,
}: {
  recipe: Recipe;
  open: () => void;
}) {
  const { mutate, busy } = useKingdom();
  return (
    <article className="recipe-card">
      <button
        className="recipe-cover"
        onClick={open}
        aria-label={`View ${recipe.name}`}
      >
        <Image src={recipe.image} alt={recipe.name} width={400} height={260} />
        <span className="recipe-category">{recipe.category}</span>
      </button>
      <button
        className={`favorite-button ${recipe.favorite ? "is-favorite" : ""}`}
        disabled={busy}
        aria-label={`${recipe.favorite ? "Unfavorite" : "Favorite"} ${recipe.name}`}
        onClick={() =>
          void mutate(
            `recipes/${recipe.id}/favorite`,
            "POST",
            { favorite: !recipe.favorite },
            recipe.favorite
              ? "Removed from your favorites."
              : "A new favorite, tucked into your cookbook.",
          )
        }
      >
        <Heart size={17} fill={recipe.favorite ? "currentColor" : "none"} />
      </button>
      <div className="recipe-info">
        <div className="recipe-meta">
          <span>
            <Clock3 size={13} />
            {recipe.duration} min
          </span>
          <span>✧ {recipe.difficulty}</span>
        </div>
        <button onClick={open} className="recipe-name">
          <h3>{recipe.name}</h3>
          <ArrowUpRight size={17} />
        </button>
        <p>{recipe.description}</p>
        <div
          className={`match-line ${recipe.missing.length === 0 ? "ready" : ""}`}
        >
          <Leaf size={14} />
          {recipe.missing.length
            ? `${recipe.missing.length} ingredient${recipe.missing.length > 1 ? "s" : ""} away from magic`
            : "Your pantry has everything"}
        </div>
      </div>
    </article>
  );
}
