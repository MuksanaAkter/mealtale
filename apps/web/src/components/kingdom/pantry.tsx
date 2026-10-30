"use client";
import { useState, type FormEvent } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import {
  Plus,
  Search,
  SlidersHorizontal,
  Pencil,
  Trash2,
  Check,
  Leaf,
  LayoutGrid,
  List,
} from "lucide-react";
import { useKingdom } from "./provider";
import { Empty, Modal } from "../ui/common";
import {
  categories,
  type Ingredient,
  freshness,
  expiryDays,
  dayKey,
  prettyDate,
  number,
} from "@/lib/types";
export function Pantry() {
  const { data, mutate, busy } = useKingdom();
  const params = useSearchParams();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [status, setStatus] = useState(
    params.get("freshness") === "soon" ? "Needs care" : "All",
  );
  const [sort, setSort] = useState("expiry");
  const [mode, setMode] = useState("grid");
  const [editing, setEditing] = useState<Ingredient | "new" | null>(
    params.get("add") ? "new" : null,
  );
  const items = data.ingredients
    .filter(
      (i) =>
        i.name.toLowerCase().includes(search.toLowerCase()) &&
        (category === "All" || i.category === category) &&
        (status === "All" ||
          (status === "Needs care"
            ? expiryDays(i.expiresAt) <= 3
            : freshness(i.expiresAt) === status)),
    )
    .sort((a, b) =>
      sort === "name"
        ? a.name.localeCompare(b.name)
        : sort === "recent"
          ? b.createdAt.localeCompare(a.createdAt)
          : a.expiresAt.localeCompare(b.expiresAt),
    );
  async function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!editing) return;
    const values = Object.fromEntries(new FormData(event.currentTarget));
    const input = { ...values, quantity: Number(values.quantity) };
    if (
      await mutate(
        editing === "new" ? "ingredients" : `ingredients/${editing.id}`,
        editing === "new" ? "POST" : "PATCH",
        input,
        editing === "new"
          ? "A new treasure tucked into your vault."
          : "Ingredient updated with care.",
      )
    )
      setEditing(null);
  }
  async function remove(
    item: Ingredient,
    action: "removed" | "consumed" | "wasted",
  ) {
    const prompt =
      action === "consumed"
        ? `Mark all ${number(item.quantity)} ${item.unit} of ${item.name} as used?`
        : action === "wasted"
          ? `Record ${item.name} as wasted and remove it?`
          : `Remove ${item.name} from your vault?`;
    if (window.confirm(prompt))
      await mutate(
        `ingredients/${item.id}`,
        "DELETE",
        { action },
        action === "consumed"
          ? "Ingredient enjoyed. Your ledger is updated."
          : action === "wasted"
            ? "Waste recorded honestly in your kingdom ledger."
            : "Ingredient removed.",
      );
  }
  const item = editing && editing !== "new" ? editing : null;
  return (
    <>
      <div className="page-heading">
        <div>
          <span className="eyebrow">A HOME FOR EVERY INGREDIENT</span>
          <h1>
            The Royal <em>Vault.</em>
          </h1>
          <p>Your everyday treasures, kept fresh and full of possibility.</p>
        </div>
        <button
          className="button button-forest"
          onClick={() => setEditing("new")}
        >
          <Plus size={17} /> Add ingredient
        </button>
      </div>
      <div className="pantry-summary">
        <span>
          <Leaf size={16} />
          <strong>{data.ingredients.length}</strong> ingredients tucked away
        </span>
        <span className="fresh-dot">
          <strong>
            {
              data.ingredients.filter((i) => freshness(i.expiresAt) === "Fresh")
                .length
            }
          </strong>{" "}
          fresh & happy
        </span>
        <span className="care-dot">
          <strong>
            {
              data.ingredients.filter((i) => expiryDays(i.expiresAt) <= 3)
                .length
            }
          </strong>{" "}
          could use a little care
        </span>
      </div>
      <div className="toolbar">
        <label className="search-box">
          <Search size={17} />
          <input
            aria-label="Search ingredients"
            placeholder="Find a little treasure…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </label>
        <label className="select-control">
          <SlidersHorizontal size={15} />
          <select
            aria-label="Freshness filter"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            {["All", "Fresh", "Needs care", "Expired"].map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
        </label>
        <select
          aria-label="Sort ingredients"
          value={sort}
          onChange={(e) => setSort(e.target.value)}
        >
          <option value="expiry">Soonest expiry</option>
          <option value="name">Name A–Z</option>
          <option value="recent">Recently added</option>
        </select>
        <div className="view-toggle">
          <button
            className={mode === "grid" ? "active" : ""}
            onClick={() => setMode("grid")}
            aria-label="Grid view"
          >
            <LayoutGrid size={17} />
          </button>
          <button
            className={mode === "list" ? "active" : ""}
            onClick={() => setMode("list")}
            aria-label="List view"
          >
            <List size={17} />
          </button>
        </div>
      </div>
      <div className="filter-chips">
        {["All", ...categories].map((c) => (
          <button
            className={c === category ? "active" : ""}
            onClick={() => setCategory(c)}
            key={c}
          >
            {c}
            {c === "All" && <span>{data.ingredients.length}</span>}
          </button>
        ))}
      </div>
      <div className={`pantry-grid ${mode === "list" ? "list-mode" : ""}`}>
        {items.map((i) => (
          <article className="ingredient-card" key={i.id}>
            <div className="ingredient-picture">
              <Image src={i.image} alt={i.name} width={300} height={190} />
              <span
                className={`badge ${freshness(i.expiresAt) === "Fresh" ? "badge-green" : freshness(i.expiresAt) === "Expired" ? "badge-red" : "badge-rust"}`}
              >
                {freshness(i.expiresAt)}
              </span>
            </div>
            <div className="ingredient-content">
              <small className="ingredient-category">
                {i.category} · {i.location}
              </small>
              <h3>{i.name}</h3>
              <div className="ingredient-quantity">
                {number(i.quantity)} <span>{i.unit}</span>
              </div>
              <p className="expiry-detail">
                {expiryDays(i.expiresAt) < 0 ? "Expired" : "Best before"}{" "}
                <strong>{prettyDate(i.expiresAt)}</strong>
              </p>
              <div className="ingredient-actions">
                <button
                  onClick={() => setEditing(i)}
                  aria-label={`Edit ${i.name}`}
                >
                  <Pencil size={14} /> Edit
                </button>
                <button
                  disabled={busy}
                  onClick={() =>
                    void remove(
                      i,
                      expiryDays(i.expiresAt) < 0 ? "wasted" : "consumed",
                    )
                  }
                >
                  <Check size={14} />
                  {expiryDays(i.expiresAt) < 0 ? "Record waste" : "Used it"}
                </button>
                <button
                  disabled={busy}
                  aria-label={`Delete ${i.name}`}
                  onClick={() => void remove(i, "removed")}
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>
      {!items.length && (
        <Empty
          title={
            data.ingredients.length
              ? "No treasures found"
              : "Your vault is waiting"
          }
          text={
            data.ingredients.length
              ? "Try another search or filter."
              : "Start with what’s in your kitchen. Every ingredient counts."
          }
        >
          <button
            className="button button-forest"
            onClick={() => setEditing("new")}
          >
            <Plus size={17} /> Add your first ingredient
          </button>
        </Empty>
      )}
      {editing && (
        <Modal
          title={
            item ? `Care for ${item.name}` : "A new treasure for your vault"
          }
          close={() => setEditing(null)}
        >
          <form onSubmit={save} className="stack-form">
            <div className="form-grid">
              <label className="span-two">
                Ingredient name
                <input
                  name="name"
                  required
                  maxLength={100}
                  defaultValue={item?.name}
                  placeholder="e.g. Mushrooms"
                />
              </label>
              <label>
                Category
                <select
                  name="category"
                  defaultValue={item?.category ?? "Vegetables"}
                >
                  {categories.map((c) => (
                    <option key={c}>{c}</option>
                  ))}
                </select>
              </label>
              <label>
                Storage
                <select
                  name="location"
                  defaultValue={item?.location ?? "Fridge"}
                >
                  {["Fridge", "Freezer", "Pantry"].map((s) => (
                    <option key={s}>{s}</option>
                  ))}
                </select>
              </label>
              <label>
                Quantity
                <input
                  name="quantity"
                  type="number"
                  min="0.001"
                  max="1000000"
                  step="any"
                  defaultValue={item?.quantity ?? 1}
                  required
                />
              </label>
              <label>
                Unit
                <select name="unit" defaultValue={item?.unit ?? "g"}>
                  {["g", "kg", "ml", "l", "pcs"].map((u) => (
                    <option key={u}>{u}</option>
                  ))}
                </select>
              </label>
              <label>
                Purchased on
                <input
                  name="purchasedAt"
                  type="date"
                  defaultValue={item?.purchasedAt.slice(0, 10) ?? dayKey()}
                  required
                />
              </label>
              <label>
                Best before
                <input
                  name="expiresAt"
                  type="date"
                  defaultValue={item?.expiresAt.slice(0, 10)}
                  required
                />
              </label>
              <label className="span-two">
                Illustration
                <select
                  name="image"
                  defaultValue={item?.image ?? "/illustrations/vegetables.svg"}
                >
                  {[
                    ["vegetables", "Garden vegetables"],
                    ["apples", "Orchard fruit"],
                    ["dairy", "Dairy & eggs"],
                    ["ingredients", "Pantry essentials"],
                    ["mushrooms", "Woodland mushrooms"],
                    ["herbs", "Fresh herbs"],
                    ["roast", "Meat & seafood"],
                  ].map(([key, label]) => (
                    <option value={`/illustrations/${key}.svg`} key={key}>
                      {label}
                    </option>
                  ))}
                </select>
              </label>
            </div>
            <button className="button button-forest" disabled={busy}>
              {busy
                ? "Saving your treasure…"
                : item
                  ? "Save ingredient"
                  : "Add to the Royal Vault"}
              <Plus size={16} />
            </button>
          </form>
        </Modal>
      )}
    </>
  );
}
