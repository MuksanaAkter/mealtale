"use client";
import Image from "next/image";
import {
  Check,
  Clock3,
  Leaf,
  Plus,
  ShoppingBasket,
  Utensils,
} from "lucide-react";
import { useState } from "react";
import styles from "./landing.module.css";
export function KingdomPreview({ chapter }: { chapter: number }) {
  const [gathered, setGathered] = useState([false, true, false]);
  return (
    <div className={styles.previewBoard}>
      <div className={styles.previewTop}>
        <div className={styles.windowDots}>
          <i />
          <i />
          <i />
        </div>
        <span>YOUR ENCHANTED KITCHEN</span>
        <Leaf size={14} />
      </div>
      {chapter === 0 && (
        <div className={styles.pantryPreview}>
          <div className={styles.previewHeading}>
            <div>
              <span>THE LITTLE THINGS, LOOKED AFTER</span>
              <h4>Your everyday treasures.</h4>
            </div>
            <span className={styles.previewRound}>
              <Leaf size={20} />
            </span>
          </div>
          <div className={styles.previewPantryGrid}>
            {[
              {
                name: "Garden spinach",
                image: "herbs",
                amount: "150 g",
                note: "A little care needed",
                fresh: false,
              },
              {
                name: "Woodland mushrooms",
                image: "mushrooms",
                amount: "250 g",
                note: "Fresh & flourishing",
                fresh: true,
              },
              {
                name: "Orchard apples",
                image: "apples",
                amount: "4 pieces",
                note: "Fresh & flourishing",
                fresh: true,
              },
            ].map((item) => (
              <div key={item.name} className={styles.miniIngredient}>
                <Image
                  src={`/illustrations/${item.image}.svg`}
                  width={200}
                  height={155}
                  alt={item.name}
                />
                <div>
                  <span
                    className={item.fresh ? styles.miniFresh : styles.miniSoon}
                  >
                    {item.note}
                  </span>
                  <h5>{item.name}</h5>
                  <p>
                    {item.amount}
                    <span>In your vault</span>
                  </p>
                </div>
              </div>
            ))}
          </div>
          <div className={styles.previewHint}>
            <span>
              <Leaf size={14} /> Nothing good, forgotten.
            </span>
            <span>Small acts. Real magic. ✧</span>
          </div>
        </div>
      )}
      {chapter === 1 && (
        <div className={styles.cookbookPreview}>
          <div className={styles.previewHeading}>
            <div>
              <span>FROM YOUR PANTRY, WITH LOVE</span>
              <h4>A little inspiration.</h4>
            </div>
            <span className={styles.previewRound}>
              <Utensils size={20} />
            </span>
          </div>
          <div className={styles.miniRecipes}>
            {[
              { name: "Forest Harvest Soup", image: "soup", time: "30 min" },
              { name: "Golden Garden Pasta", image: "pasta", time: "25 min" },
            ].map((item) => (
              <div key={item.name}>
                <Image
                  src={`/illustrations/${item.image}.svg`}
                  width={300}
                  height={190}
                  alt={item.name}
                />
                <div>
                  <span>
                    <Clock3 size={12} />
                    {item.time} · Easy
                  </span>
                  <h5>{item.name}</h5>
                  <p>
                    <Check size={12} /> Matched to your pantry
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      {chapter === 2 && (
        <div className={styles.marketPreview}>
          <div className={styles.previewHeading}>
            <div>
              <span>GATHER ONLY WHAT YOU NEED</span>
              <h4>A Saturday market quest.</h4>
            </div>
            <span className={styles.previewRound}>
              <ShoppingBasket size={20} />
            </span>
          </div>
          <div className={styles.miniProgress}>
            <span>
              {gathered.filter(Boolean).length} of 3 treasures gathered
            </span>
            <div>
              <i
                style={{
                  width: `${(gathered.filter(Boolean).length / 3) * 100}%`,
                }}
              />
            </div>
          </div>
          {[
            { name: "Fresh sourdough", amount: "1 loaf" },
            { name: "Golden butter", amount: "200 g" },
            { name: "Garden basil", amount: "1 bunch" },
          ].map((item, index) => (
            <button
              key={item.name}
              className={`${styles.miniShoppingRow} ${gathered[index] ? styles.miniPurchased : ""}`}
              aria-pressed={gathered[index]}
              onClick={() =>
                setGathered((state) =>
                  state.map((v, i) => (i === index ? !v : v)),
                )
              }
            >
              <span className={styles.miniCheckbox}>
                {gathered[index] && <Check size={13} />}
              </span>
              <strong>{item.name}</strong>
              <small>{item.amount}</small>
            </button>
          ))}
          <div className={styles.previewHint}>
            <span>Try ticking a little treasure above.</span>
            <span>✧</span>
          </div>
        </div>
      )}
      {chapter === 3 && (
        <div className={styles.feastPreview}>
          <div className={styles.previewHeading}>
            <div>
              <span>SOMETHING TO LOOK FORWARD TO</span>
              <h4>A week around the table.</h4>
            </div>
            <span className={styles.previewRound}>
              <Utensils size={20} />
            </span>
          </div>
          <div className={styles.miniWeek}>
            {[
              {
                day: "MON",
                title: "A fresh beginning",
                name: "Keeper’s Green Bowl",
                image: "salad",
              },
              {
                day: "TUE",
                title: "Something comforting",
                name: "Forest Harvest Soup",
                image: "soup",
              },
              {
                day: "WED",
                title: "A little celebration",
                name: "Sunday Castle Roast",
                image: "roast",
              },
            ].map((item) => (
              <div key={item.day}>
                <span>{item.day}</span>
                <small>{item.title}</small>
                <div>
                  <Image
                    src={`/illustrations/${item.image}.svg`}
                    width={190}
                    height={130}
                    alt={item.name}
                  />
                  <h5>{item.name}</h5>
                  <p>Dinner · Made with care</p>
                </div>
                <span className={styles.miniMealLabel}>
                  <Plus size={12} /> Room for a little magic
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
      <div className={styles.previewBottom}>
        <span className={styles.liveDot} />
        <span>ILLUSTRATIVE PREVIEW</span>
        <span>Your real pantry starts with you.</span>
      </div>
    </div>
  );
}
