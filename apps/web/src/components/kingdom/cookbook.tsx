"use client";
import { useState } from "react";
import { Search, BookOpen, Sparkles } from "lucide-react";
import { useKingdom } from "./provider";
import { RecipeCard } from "./recipe-card";
import { RecipeDetail } from "./recipe-detail";
import { Empty } from "../ui/common";
import { type Recipe, expiryDays } from "@/lib/types";
export function Cookbook() {
  const { data } = useKingdom();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All recipes");
  const [category, setCategory] = useState("All categories");
  const [selected, setSelected] = useState<Recipe | null>(null);
  const urgent = data.ingredients
    .filter((i) => expiryDays(i.expiresAt) >= 0 && expiryDays(i.expiresAt) <= 3)
    .map((i) => i.name.toLowerCase());
  const items = data.recipes
    .filter(
      (r) =>
        r.name.toLowerCase().includes(search.toLowerCase()) &&
        (category === "All categories" || r.category === category) &&
        (filter === "All recipes" ||
          (filter === "Ready to cook"
            ? !r.missing.length
            : filter === "A few things away"
              ? r.missing.length > 0 && r.missing.length <= 2
              : filter === "Save my ingredients"
                ? r.ingredients.some((i) =>
                    urgent.includes(i.name.toLowerCase()),
                  )
                : r.favorite)),
    )
    .sort((a, b) => b.matchPercent - a.matchPercent);
  return (
    <>
      <div className="page-heading">
        <div>
          <span className="eyebrow">OLD PAGES. NEW POSSIBILITIES.</span>
          <h1>
            The Ancient <em>Cookbook.</em>
          </h1>
          <p>
            A little inspiration, made from the good things you already have.
          </p>
        </div>
        <div className="heading-emblem">
          <BookOpen size={34} />
        </div>
      </div>
      <div className="info-banner">
        <Sparkles size={20} />
        <p>
          <strong>Your pantry is the secret ingredient.</strong> Recipes are
          matched by ingredient name and quantity, with expired food left out.
        </p>
        <span>
          {data.recipes.filter((r) => !r.missing.length).length} ready to cook
        </span>
      </div>
      <div className="toolbar">
        <label className="search-box">
          <Search size={17} />
          <input
            aria-label="Search recipes"
            placeholder="Find your next little masterpiece…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </label>
        <select
          aria-label="Recipe category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          {["All categories", "Breakfast", "Soups", "Mains", "Salads"].map(
            (c) => (
              <option key={c}>{c}</option>
            ),
          )}
        </select>
      </div>
      <div className="filter-chips">
        {[
          "All recipes",
          "Ready to cook",
          "A few things away",
          "Save my ingredients",
          "Favorites",
        ].map((f) => (
          <button
            className={filter === f ? "active" : ""}
            onClick={() => setFilter(f)}
            key={f}
          >
            {f}
          </button>
        ))}
      </div>
      <div className="recipe-grid cookbook-grid">
        {items.map((r) => (
          <RecipeCard key={r.id} recipe={r} open={() => setSelected(r)} />
        ))}
      </div>
      {!items.length && (
        <Empty
          title="A new page is waiting"
          text="Try another filter, add pantry ingredients, or save a few favorites."
        />
      )}
      {selected && (
        <RecipeDetail recipe={selected} close={() => setSelected(null)} />
      )}
    </>
  );
}
