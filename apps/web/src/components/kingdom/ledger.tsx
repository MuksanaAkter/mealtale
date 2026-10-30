"use client";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  CartesianGrid,
  Legend,
} from "recharts";
import { Leaf, Utensils, Recycle, ScrollText } from "lucide-react";
import { useKingdom } from "./provider";
import { categories, prettyDate, number } from "@/lib/types";
import { Empty } from "../ui/common";
const colors = [
  "#355b43",
  "#c6a66a",
  "#a56843",
  "#7c9582",
  "#b7ba84",
  "#775c43",
  "#b8a88c",
  "#536b65",
  "#d1b98b",
];
export function Ledger() {
  const { data } = useKingdom();
  const consumed = data.activities.filter((a) => a.action === "consumed");
  const waste = data.activities.filter((a) => a.action === "wasted");
  const distribution = categories
    .map((name) => ({
      name,
      value: data.ingredients.filter((i) => i.category === name).length,
    }))
    .filter((v) => v.value);
  const monthly = Array.from({ length: 6 }, (_, index) => {
    const date = new Date();
    date.setDate(1);
    date.setMonth(date.getMonth() - 5 + index);
    const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
    const acts = data.activities.filter((a) => a.createdAt.startsWith(key));
    return {
      month: date.toLocaleDateString("en-US", { month: "short" }),
      Added: acts.filter((a) => a.action === "added").length,
      Enjoyed: acts.filter((a) => a.action === "consumed").length,
      Wasted: acts.filter((a) => a.action === "wasted").length,
    };
  });
  const frequent = Array.from(new Set(consumed.map((a) => a.name)))
    .map((name) => ({
      name,
      uses: consumed.filter((a) => a.name === name).length,
    }))
    .sort((a, b) => b.uses - a.uses)
    .slice(0, 5);
  const wasteByUnit = Array.from(new Set(waste.map((a) => a.unit))).map(
    (unit) => ({
      unit,
      value: waste
        .filter((a) => a.unit === unit)
        .reduce((s, a) => s + a.quantity, 0),
    }),
  );
  return (
    <>
      <div className="page-heading">
        <div>
          <span className="eyebrow">SMALL CHOICES. A STORY WORTH KEEPING.</span>
          <h1>
            The Kingdom <em>Ledger.</em>
          </h1>
          <p>
            A thoughtful look at what comes in, what gets enjoyed, and what can
            be saved.
          </p>
        </div>
        <div className="heading-emblem">
          <ScrollText size={33} />
        </div>
      </div>
      <div className="stats-grid">
        {[
          {
            title: "Ingredients in your vault",
            value: data.ingredients.length,
            note: "current pantry entries",
            icon: Leaf,
          },
          {
            title: "Ingredients enjoyed",
            value: consumed.length,
            note: "recorded consumption events",
            icon: Utensils,
          },
          {
            title: "Food waste recorded",
            value: waste.length,
            note: "discarded ingredient entries",
            icon: Recycle,
          },
          {
            title: "Your kitchen’s story",
            value: data.activities.length,
            note: "inventory activity records",
            icon: ScrollText,
          },
        ].map(({ icon: Icon, ...s }) => (
          <div className="stat-card" key={s.title}>
            <div className="stat-top">
              <span>{s.title}</span>
              <div className="stat-icon green">
                <Icon size={18} />
              </div>
            </div>
            <strong>{s.value.toString().padStart(2, "0")}</strong>
            <small>{s.note}</small>
          </div>
        ))}
      </div>
      <div className="analytics-grid">
        <div className="panel">
          <div className="panel-heading">
            <h2>Seasons of kitchen activity</h2>
            <span className="badge">Last 6 months</span>
          </div>
          <p className="muted">
            Number of inventory events. Quantities of unlike units are never
            added together.
          </p>
          <div
            className="chart-container"
            role="img"
            aria-label="Monthly inventory events: added, enjoyed, and wasted"
          >
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={monthly} barGap={3}>
                <CartesianGrid vertical={false} stroke="#e7e5d9" />
                <XAxis
                  dataKey="month"
                  tickLine={false}
                  axisLine={false}
                  tick={{ fontSize: 11 }}
                />
                <YAxis
                  allowDecimals={false}
                  tickLine={false}
                  axisLine={false}
                  width={25}
                  tick={{ fontSize: 11 }}
                />
                <Tooltip
                  contentStyle={{
                    borderRadius: 8,
                    borderColor: "#dcd6c4",
                    fontSize: 12,
                  }}
                />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Bar dataKey="Added" fill="#355b43" radius={[3, 3, 0, 0]} />
                <Bar dataKey="Enjoyed" fill="#c6a66a" radius={[3, 3, 0, 0]} />
                <Bar dataKey="Wasted" fill="#b97859" radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="panel">
          <h2>A little of everything</h2>
          <p className="muted">Current ingredient entries by category</p>
          {distribution.length ? (
            <>
              <div
                className="chart-container"
                role="img"
                aria-label={distribution
                  .map((d) => `${d.name}: ${d.value}`)
                  .join(", ")}
              >
                <ResponsiveContainer width="100%" height={225}>
                  <PieChart>
                    <Pie
                      data={distribution}
                      dataKey="value"
                      nameKey="name"
                      innerRadius={62}
                      outerRadius={90}
                      paddingAngle={4}
                      stroke="none"
                    >
                      {distribution.map((v, i) => (
                        <Cell key={v.name} fill={colors[i % colors.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="chart-legend">
                {distribution.map((d, i) => (
                  <span key={d.name}>
                    <i style={{ background: colors[i % colors.length] }} />
                    {d.name}
                    <strong>{d.value}</strong>
                  </span>
                ))}
              </div>
            </>
          ) : (
            <Empty
              title="A fresh page"
              text="Add ingredients to see your pantry’s balance."
            />
          )}
        </div>
        <div className="panel">
          <h2>Your most-loved ingredients</h2>
          <p className="muted">
            Ranked by recorded times used, including cooked recipes.
          </p>
          {frequent.length ? (
            <div className="frequent-list">
              {frequent.map((f, i) => (
                <div key={f.name}>
                  <span>0{i + 1}</span>
                  <strong>{f.name}</strong>
                  <small>
                    {f.uses} use{f.uses > 1 ? "s" : ""}
                  </small>
                </div>
              ))}
            </div>
          ) : (
            <Empty
              title="Your tastes are still unfolding"
              text="Mark ingredients as used or cook a recipe to start your story."
            />
          )}
        </div>
        <div className="panel">
          <h2>Honest care for your kingdom</h2>
          <p className="muted">
            Waste is only recorded when you explicitly discard an ingredient.
            Deleting an item alone does not count as waste.
          </p>
          <div className="waste-summary">
            <Recycle size={35} />
            <strong>{waste.length}</strong>
            <span>discarded entries</span>
          </div>
          <p className="waste-quantities">
            {wasteByUnit.length
              ? wasteByUnit
                  .map((w) => `${number(w.value)} ${w.unit}`)
                  .join(" · ")
              : "No food waste has been recorded yet."}
          </p>
        </div>
      </div>
      <section className="panel ledger-history">
        <h2>Notes from your kitchen</h2>
        <div className="table-scroll">
          <table>
            <thead>
              <tr>
                <th>Ingredient</th>
                <th>Activity</th>
                <th>Quantity</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {data.activities.slice(0, 20).map((a) => (
                <tr key={a.id}>
                  <td>{a.name}</td>
                  <td>
                    <span
                      className={`badge ${a.action === "wasted" ? "badge-rust" : "badge-green"}`}
                    >
                      {a.action}
                    </span>
                  </td>
                  <td>
                    {number(a.quantity)} {a.unit}
                  </td>
                  <td>{prettyDate(a.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {!data.activities.length && (
          <p className="muted">Your first ingredient starts the story.</p>
        )}
        <p className="muted">
          Charts use the latest {data.activities.length} activity records (up to
          2,000 per account).
        </p>
      </section>
    </>
  );
}
