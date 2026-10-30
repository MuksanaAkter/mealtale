"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Leaf,
  BookOpen,
  Hourglass,
  ShoppingBasket,
  ArrowRight,
  Plus,
  Sparkles,
  CalendarDays,
  ArrowUpRight,
  CircleCheck,
} from "lucide-react";
import { useKingdom } from "./provider";
import { RecipeCard } from "./recipe-card";
import { RecipeDetail } from "./recipe-detail";
import { Empty } from "../ui/common";
import { expiryDays, prettyDate, type Recipe } from "@/lib/types";
export function Overview() {
  const { data } = useKingdom();
  const [selected, setSelected] = useState<Recipe | null>(null);
  const expiring = data.ingredients.filter((i) => expiryDays(i.expiresAt) <= 3);
  const ready = data.recipes.filter((r) => !r.missing.length);
  const shopping = data.lists
    .flatMap((l) => l.items)
    .filter((i) => !i.purchased).length;
  const urgentNames = expiring
    .filter((i) => expiryDays(i.expiresAt) >= 0)
    .map((i) => i.name.toLowerCase());
  const recommended = [...data.recipes]
    .sort((a, b) => {
      const score = (r: Recipe) =>
        r.ingredients.filter((i) => urgentNames.includes(i.name.toLowerCase()))
          .length *
          25 +
        r.matchPercent;
      return score(b) - score(a);
    })
    .slice(0, 3);
  const stats = [
    {
      title: "Treasures in your vault",
      value: data.ingredients.length,
      note: "ingredients, full of possibility",
      icon: Leaf,
      color: "green",
    },
    {
      title: "Ready for a little magic",
      value: ready.length,
      note: "recipes you can cook right now",
      icon: BookOpen,
      color: "gold",
    },
    {
      title: "A little care needed",
      value: expiring.length,
      note: "ingredients to use or review",
      icon: Hourglass,
      color: "rust",
    },
    {
      title: "On your market list",
      value: shopping,
      note: "things for your next adventure",
      icon: ShoppingBasket,
      color: "sage",
    },
  ];
  return (
    <>
      <div className="page-heading">
        <div>
          <span className="eyebrow">YOUR DAILY DOSE OF KITCHEN MAGIC</span>
          <h1>
            Welcome home, <em>{data.user.name.split(" ")[0]}.</em>
          </h1>
          <p>
            A fresh day. A full pantry of possibilities. What will you make?
          </p>
        </div>
        <Link href="/royal-vault?add=1" className="button button-forest">
          <Plus size={17} /> Add an ingredient
        </Link>
      </div>
      <section className="stats-grid">
        {stats.map(({ icon: Icon, ...s }) => (
          <div className="stat-card" key={s.title}>
            <div className="stat-top">
              <span>{s.title}</span>
              <div className={`stat-icon ${s.color}`}>
                <Icon size={19} />
              </div>
            </div>
            <strong>{s.value.toString().padStart(2, "0")}</strong>
            <small>{s.note}</small>
          </div>
        ))}
      </section>
      <section className="overview-split">
        <div className="welcome-banner">
          <Image
            src="/backgrounds/enchanted-kitchen.png"
            alt="Sunset over the enchanted kingdom"
            fill
            sizes="65vw"
          />
          <div className="banner-shade" />
          <div className="banner-copy">
            <span className="eyebrow">
              <Sparkles size={13} /> YOUR KITCHEN, YOUR STORY
            </span>
            <h2>
              Something wonderful
              <br />
              is already in your <em>pantry.</em>
            </h2>
            <p>
              Let a few simple ingredients become
              <br />
              the best part of your day.
            </p>
            <Link href="/ancient-cookbook" className="button button-gold small">
              Find your next recipe <ArrowRight size={16} />
            </Link>
          </div>
        </div>
        <div className="panel guardian-panel">
          <div className="panel-heading">
            <h2>
              <Hourglass size={18} /> Freshness Guardian
            </h2>
            <span className="badge badge-rust">
              {expiring.length} to review
            </span>
          </div>
          <p className="muted">A little attention goes a long way.</p>
          <div className="freshness-list">
            {expiring.slice(0, 3).map((item) => (
              <Link href="/royal-vault?freshness=soon" key={item.id}>
                <Image src={item.image} alt="" width={42} height={42} />
                <span>
                  <strong>{item.name}</strong>
                  <small>
                    {item.quantity} {item.unit} · {item.location}
                  </small>
                </span>
                <span
                  className={`expiry-label ${expiryDays(item.expiresAt) < 0 ? "danger" : ""}`}
                >
                  {expiryDays(item.expiresAt) < 0
                    ? "Expired"
                    : expiryDays(item.expiresAt) === 0
                      ? "Today"
                      : `${expiryDays(item.expiresAt)} day${expiryDays(item.expiresAt) === 1 ? "" : "s"}`}
                </span>
              </Link>
            ))}
            {!expiring.length && (
              <div className="guardian-clear">
                <CircleCheck size={28} />
                <p>Everything is looking fresh.</p>
              </div>
            )}
          </div>
          <Link href="/royal-vault?freshness=soon" className="inline-link">
            Look after your ingredients <ArrowRight size={15} />
          </Link>
        </div>
      </section>
      <section>
        <div className="section-row">
          <div>
            <span className="eyebrow">FROM YOUR PANTRY, WITH LOVE</span>
            <h2>A little inspiration for your table</h2>
          </div>
          <Link href="/ancient-cookbook" className="inline-link">
            Open the cookbook <ArrowRight size={16} />
          </Link>
        </div>
        <div className="recipe-grid">
          {recommended.map((r) => (
            <RecipeCard key={r.id} recipe={r} open={() => setSelected(r)} />
          ))}
        </div>
      </section>
      <section className="overview-bottom">
        <div className="panel">
          <div className="panel-heading">
            <h2>
              <CalendarDays size={19} /> On the royal table
            </h2>
            <Link
              href="/royal-feast"
              className="icon-button"
              aria-label="Open meal planner"
            >
              <ArrowUpRight size={18} />
            </Link>
          </div>
          {data.meals
            .filter(
              (m) =>
                m.date.slice(0, 10) >= new Date().toISOString().slice(0, 10),
            )
            .slice(0, 3)
            .map((meal) => {
              const recipe = data.recipes.find((r) => r.id === meal.recipeId);
              return (
                recipe && (
                  <button
                    key={meal.id}
                    className="meal-row"
                    onClick={() => setSelected(recipe)}
                  >
                    <span className="date-tile">{prettyDate(meal.date)}</span>
                    <Image src={recipe.image} alt="" width={60} height={44} />
                    <span>
                      <small>{meal.slot}</small>
                      <strong>{recipe.name}</strong>
                    </span>
                    <ArrowUpRight size={16} />
                  </button>
                )
              );
            })}
          {!data.meals.length && (
            <Empty
              title="A table waiting to be set"
              text="Add your first meal in the Royal Feast Planner."
            />
          )}
        </div>
        <div className="panel">
          <div className="panel-heading">
            <h2>
              <Leaf size={18} /> The latest in your kingdom
            </h2>
            <Link href="/analytics" className="inline-link">
              Your ledger <ArrowRight size={14} />
            </Link>
          </div>
          <div className="activity-list">
            {data.activities.slice(0, 4).map((a) => (
              <div key={a.id}>
                <span className={`activity-dot ${a.action}`} />
                <p>
                  <strong>{a.name}</strong>{" "}
                  {a.action === "added"
                    ? "found a home in your vault"
                    : a.action === "consumed"
                      ? "became part of a lovely meal"
                      : a.action === "wasted"
                        ? "was recorded as food waste"
                        : `was ${a.action}`}
                  <small>
                    {a.quantity} {a.unit} · {prettyDate(a.createdAt)}
                  </small>
                </p>
              </div>
            ))}
            {!data.activities.length && (
              <p className="muted">
                Your story starts with your first ingredient.
              </p>
            )}
          </div>
        </div>
      </section>
      {selected && (
        <RecipeDetail recipe={selected} close={() => setSelected(null)} />
      )}
    </>
  );
}
