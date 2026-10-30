"use client";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ArrowRight, ArrowLeft, Eye, EyeOff, ShieldCheck } from "lucide-react";
import { Brand } from "./ui/brand";
import { api } from "@/lib/api/client";
const schema = z.object({
  name: z.string().max(60),
  email: z.email("Enter a valid email"),
  password: z.string().min(10, "Use at least 10 characters").max(128),
  starter: z.boolean(),
});
type Fields = z.infer<typeof schema>;
export function AuthForm({ register: signup = false }: { register?: boolean }) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [visible, setVisible] = useState(false);
  const [demoBusy, setDemoBusy] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<Fields>({
    resolver: zodResolver(schema),
    defaultValues: { name: "", email: "", password: "", starter: true },
  });
  async function submit(values: Fields) {
    setError("");
    if (signup && values.name.trim().length < 2) {
      setError("Tell us your name (at least 2 characters).");
      return;
    }
    try {
      await api(`auth/${signup ? "register" : "login"}`, "POST", values);
      router.push("/dashboard");
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Please try again");
    }
  }
  async function demo() {
    setDemoBusy(true);
    setError("");
    try {
      await api("auth/demo", "POST");
      router.push("/dashboard");
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Please try again");
      setDemoBusy(false);
    }
  }
  return (
    <main className="auth-page">
      <section className="auth-scene">
        <Image
          src="/backgrounds/enchanted-kitchen.png"
          alt="The warm, candlelit kitchen of MealTale"
          fill
          priority
          sizes="55vw"
        />
        <div className="auth-shade" />
        <Brand />
        <div className="auth-quote">
          <span className="eyebrow">A NEW CHAPTER BEGINS</span>
          <h1>
            Every great story
            <br />
            starts in the <em>kitchen.</em>
          </h1>
          <p>Yours is waiting to be written.</p>
          <span className="ornament">──── ✧ ────</span>
        </div>
      </section>
      <section className="auth-content">
        <Link href="/" className="back-link">
          <ArrowLeft size={16} /> Back to the kingdom
        </Link>
        <div className="auth-card">
          <span className="eyebrow">WELCOME, KITCHEN KEEPER</span>
          <h2>{signup ? "Begin your story." : "Welcome home."}</h2>
          <p>
            {signup
              ? "A little care. A little creativity. A kingdom of possibilities."
              : "Your pantry, your recipes, your little corner of magic."}
          </p>
          <form onSubmit={handleSubmit(submit)} className="stack-form">
            {signup && (
              <label>
                Your keeper name
                <input
                  {...register("name")}
                  autoComplete="name"
                  placeholder="What shall we call you?"
                  required
                  minLength={2}
                />
              </label>
            )}
            <label>
              Email address
              <input
                {...register("email")}
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
              />
              {errors.email && (
                <small className="form-error">{errors.email.message}</small>
              )}
            </label>
            <label>
              Password
              <div className="password-input">
                <input
                  {...register("password")}
                  type={visible ? "text" : "password"}
                  autoComplete={signup ? "new-password" : "current-password"}
                  placeholder="At least 10 characters"
                />
                <button
                  type="button"
                  onClick={() => setVisible(!visible)}
                  aria-label={visible ? "Hide password" : "Show password"}
                >
                  {visible ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password && (
                <small className="form-error">{errors.password.message}</small>
              )}
            </label>
            {signup && (
              <label className="checkbox-label">
                <input type="checkbox" {...register("starter")} />
                <span>
                  Start with a sample pantry so I can explore.
                  <small>You can edit or remove every sample ingredient.</small>
                </span>
              </label>
            )}
            {error && (
              <p className="form-error" role="alert">
                {error}
              </p>
            )}
            <button
              disabled={isSubmitting || demoBusy}
              className="button button-forest"
            >
              {isSubmitting
                ? "Opening the gates…"
                : signup
                  ? "Create my kingdom"
                  : "Enter my kingdom"}
              <ArrowRight size={18} />
            </button>
          </form>
          <div className="auth-divider">
            <span />
            or explore first
            <span />
          </div>
          <button
            className="button button-outline full"
            onClick={demo}
            disabled={demoBusy || isSubmitting}
          >
            {demoBusy
              ? "Preparing your kingdom…"
              : "Explore a private demo kingdom"}
          </button>
          <p className="auth-switch">
            {signup ? "Already a Keeper?" : "Your first visit?"}{" "}
            <Link href={signup ? "/login" : "/register"}>
              {signup ? "Sign in" : "Begin your story"}
            </Link>
          </p>
          <div className="secure-note">
            <ShieldCheck size={15} /> Your pantry stays yours. Always.
          </div>
        </div>
      </section>
    </main>
  );
}
