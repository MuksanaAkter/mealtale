"use client";
import { type FormEvent } from "react";
import { ShieldCheck, Bell, UserRound, Leaf } from "lucide-react";
import { useKingdom } from "./provider";
export function SettingsView() {
  const { data, mutate, busy } = useKingdom();
  async function save(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const name = new FormData(e.currentTarget).get("name");
    await mutate(
      "profile",
      "PATCH",
      { name },
      "Your Keeper profile has been updated.",
    );
  }
  return (
    <>
      <div className="page-heading">
        <div>
          <span className="eyebrow">MAKE THIS LITTLE KINGDOM YOURS</span>
          <h1>
            Keeper <em>Settings.</em>
          </h1>
          <p>A few thoughtful details for a kitchen that feels like you.</p>
        </div>
      </div>
      <div className="settings-grid">
        <section className="panel">
          <h2>
            <UserRound size={20} /> Your Keeper profile
          </h2>
          <div className="settings-avatar avatar">
            {data.user.name.charAt(0).toUpperCase()}
          </div>
          <form className="stack-form" onSubmit={save}>
            <label>
              Your name
              <input
                key={data.user.name}
                name="name"
                defaultValue={data.user.name}
                minLength={2}
                maxLength={60}
                required
              />
            </label>
            <label>
              Email address
              <input value={data.user.email} readOnly type="email" />
              <small className="muted">
                Your sign-in email. Email changes are not currently supported.
              </small>
            </label>
            <button className="button button-forest" disabled={busy}>
              Save your profile
            </button>
          </form>
        </section>
        <div>
          <section className="panel">
            <h2>
              <Bell size={20} /> Freshness Guardian
            </h2>
            <p>
              In-app alerts appear when an ingredient has three days or less
              remaining. Expired food is flagged separately and excluded from
              recipe matches.
            </p>
            <div className="settings-note">
              <Leaf size={17} />
              <span>
                Alerts refresh when your pantry is opened or updated. Email and
                push notifications are not enabled.
              </span>
            </div>
          </section>
          <section className="panel">
            <h2>
              <ShieldCheck size={20} /> A kingdom of your own
            </h2>
            <p>
              Passwords are salted and hashed. Your account uses a private,
              HTTP-only session cookie that expires after seven days.
            </p>
            <p>
              Your pantry, shopping lists, meal plans, and activity are scoped
              to your account. Demo kingdoms are private accounts with sample
              pantry data.
            </p>
          </section>
        </div>
      </div>
    </>
  );
}
