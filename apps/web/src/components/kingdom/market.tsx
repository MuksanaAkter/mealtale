"use client";
import { useState, type FormEvent } from "react";
import Link from "next/link";
import {
  Plus,
  ShoppingBasket,
  Trash2,
  Check,
  ArrowRight,
  ShoppingBag,
} from "lucide-react";
import { useKingdom } from "./provider";
import { Modal, Empty } from "../ui/common";
import { categories } from "@/lib/types";
export function Market() {
  const { data, mutate, busy } = useKingdom();
  const [selected, setSelected] = useState("");
  const [modal, setModal] = useState<"list" | "item" | null>(null);
  const list = data.lists.find((l) => l.id === selected) ?? data.lists[0];
  const purchased = list?.items.filter((i) => i.purchased).length ?? 0;
  async function save(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const values = Object.fromEntries(new FormData(e.currentTarget));
    const ok =
      modal === "list"
        ? await mutate("lists", "POST", values, "A new market quest begins.")
        : list &&
          (await mutate(
            `lists/${list.id}/items`,
            "POST",
            { ...values, quantity: Number(values.quantity) },
            "Added to your market quest.",
          ));
    if (ok) setModal(null);
  }
  return (
    <>
      <div className="page-heading">
        <div>
          <span className="eyebrow">
            GATHER WHAT’S MISSING. LEAVE THE REST.
          </span>
          <h1>
            Market <em>Quests.</em>
          </h1>
          <p>
            A thoughtful little list for your next adventure beyond the kitchen.
          </p>
        </div>
        <button
          className="button button-forest"
          onClick={() => setModal("list")}
        >
          <Plus size={17} /> New market list
        </button>
      </div>
      <div className="market-layout">
        <aside className="panel market-lists">
          <span className="eyebrow">YOUR QUESTS</span>
          {data.lists.map((l) => (
            <button
              className={l.id === list?.id ? "active" : ""}
              key={l.id}
              onClick={() => setSelected(l.id)}
            >
              <ShoppingBasket size={18} />
              <span>
                {l.name}
                <small>
                  {l.items.filter((i) => !i.purchased).length} things to gather
                </small>
              </span>
            </button>
          ))}
          <div className="market-tip">
            <ShoppingBag size={27} />
            <h3>A quest from your cookbook</h3>
            <p>
              Missing something for a recipe? Add exactly what you need from its
              recipe page.
            </p>
            <Link href="/ancient-cookbook" className="inline-link">
              Find a recipe <ArrowRight size={15} />
            </Link>
          </div>
        </aside>
        <section className="panel quest-panel">
          {list ? (
            <>
              <div className="panel-heading">
                <div>
                  <span className="eyebrow">
                    A LITTLE PURPOSE TO YOUR SHOPPING
                  </span>
                  <h2>{list.name}</h2>
                </div>
                <button
                  className="icon-button"
                  disabled={busy}
                  aria-label="Delete this shopping list"
                  onClick={() => {
                    if (
                      window.confirm(
                        `Delete “${list.name}” and its shopping items?`,
                      )
                    )
                      void mutate(
                        `lists/${list.id}`,
                        "DELETE",
                        {},
                        "Market list removed.",
                      );
                  }}
                >
                  <Trash2 size={17} />
                </button>
              </div>
              <div className="quest-progress">
                <span>
                  {purchased} of {list.items.length} treasures gathered
                </span>
                <div>
                  <i
                    style={{
                      width: `${list.items.length ? (purchased / list.items.length) * 100 : 0}%`,
                    }}
                  />
                </div>
              </div>
              {Array.from(new Set(list.items.map((i) => i.category))).map(
                (cat) => (
                  <div className="shopping-group" key={cat}>
                    <h3>{cat}</h3>
                    {list.items
                      .filter((i) => i.category === cat)
                      .map((item) => (
                        <div
                          className={`shopping-row ${item.purchased ? "purchased" : ""}`}
                          key={item.id}
                        >
                          <button
                            className="check-box"
                            disabled={busy}
                            aria-label={`${item.purchased ? "Mark unpurchased" : "Mark purchased"} ${item.name}`}
                            onClick={() =>
                              void mutate(
                                `shopping-items/${item.id}`,
                                "PATCH",
                                { purchased: !item.purchased },
                                item.purchased
                                  ? "Item returned to the quest."
                                  : "Another treasure gathered!",
                              )
                            }
                          >
                            {item.purchased && <Check size={16} />}
                          </button>
                          <strong>{item.name}</strong>
                          <input
                            key={`${item.id}-${item.quantity}`}
                            aria-label={`Quantity of ${item.name}`}
                            type="number"
                            min="0.001"
                            max="1000000"
                            step="any"
                            defaultValue={item.quantity}
                            disabled={busy}
                            onBlur={(e) => {
                              const quantity = Number(e.target.value);
                              if (quantity > 0 && quantity !== item.quantity)
                                void mutate(
                                  `shopping-items/${item.id}`,
                                  "PATCH",
                                  { quantity },
                                  "Shopping quantity updated.",
                                );
                              else e.target.value = String(item.quantity);
                            }}
                          />
                          <span>{item.unit}</span>
                          <button
                            className="icon-button"
                            disabled={busy}
                            aria-label={`Remove ${item.name}`}
                            onClick={() =>
                              void mutate(
                                `shopping-items/${item.id}`,
                                "DELETE",
                                {},
                                "Item removed from the list.",
                              )
                            }
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      ))}
                  </div>
                ),
              )}
              {!list.items.length && (
                <Empty
                  title="A blank scroll, a new adventure"
                  text="Add ingredients yourself, or gather what’s missing from a recipe."
                />
              )}
              <button
                className="button button-outline full"
                onClick={() => setModal("item")}
              >
                <Plus size={17} /> Add something to gather
              </button>
              <p className="shopping-footnote">
                Checking an item marks it purchased. Add it to the Royal Vault
                with its actual quantity and expiry when you get home.
              </p>
            </>
          ) : (
            <Empty
              title="Every adventure needs a little list"
              text="Create your first market quest, then add the things your kitchen needs."
            >
              <button
                className="button button-forest"
                onClick={() => setModal("list")}
              >
                Create a market list
              </button>
            </Empty>
          )}
        </section>
      </div>
      {modal && (
        <Modal
          title={
            modal === "list"
              ? "Name your next adventure"
              : "Something for your market quest"
          }
          close={() => setModal(null)}
        >
          <form onSubmit={save} className="stack-form">
            <label>
              {modal === "list" ? "List name" : "Ingredient name"}
              <input
                name="name"
                required
                maxLength={100}
                placeholder={
                  modal === "list"
                    ? "e.g. Saturday village market"
                    : "e.g. Butter"
                }
              />
            </label>
            {modal === "item" && (
              <div className="form-grid">
                <label className="span-two">
                  Category
                  <select name="category">
                    {categories.map((c) => (
                      <option key={c}>{c}</option>
                    ))}
                  </select>
                </label>
                <label>
                  Quantity
                  <input
                    type="number"
                    name="quantity"
                    required
                    min="0.001"
                    max="1000000"
                    step="any"
                    defaultValue={1}
                  />
                </label>
                <label>
                  Unit
                  <select name="unit">
                    {["g", "kg", "ml", "l", "pcs"].map((u) => (
                      <option key={u}>{u}</option>
                    ))}
                  </select>
                </label>
              </div>
            )}
            <button className="button button-forest" disabled={busy}>
              <Plus size={17} />
              {modal === "list" ? "Create my quest" : "Add to the list"}
            </button>
          </form>
        </Modal>
      )}
    </>
  );
}
