"use client";
import Link from "next/link";
import Image from "next/image";
import { motion, useReducedMotion } from "motion/react";
import {
  ArrowRight,
  ArrowUpRight,
  Leaf,
  BookOpen,
  ShoppingBasket,
  CalendarDays,
  Sparkles,
  Wheat,
  ShieldCheck,
  ChevronDown,
} from "lucide-react";
import { Brand } from "./ui/brand";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api/client";
const features = [
  {
    number: "01",
    title: "The Royal Vault",
    text: "A home for every ingredient. Keep your treasures fresh, and nothing forgotten.",
    icon: Leaf,
    image: "vegetables",
  },
  {
    number: "02",
    title: "The Ancient Cookbook",
    text: "Good food is already in your kitchen. Discover what your pantry can become.",
    icon: BookOpen,
    image: "soup",
  },
  {
    number: "03",
    title: "Market Quests",
    text: "Gather only what you need. Turn a little shopping into a grand adventure.",
    icon: ShoppingBasket,
    image: "ingredients",
  },
  {
    number: "04",
    title: "The Royal Feast",
    text: "Make room for meals worth sharing. Plan a delicious week, one day at a time.",
    icon: CalendarDays,
    image: "roast",
  },
];
export default function Landing() {
  const reduce = useReducedMotion();
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const reveal = {
    initial: { opacity: 0, y: reduce ? 0 : 24 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.7 },
  };
  async function demo() {
    setBusy(true);
    setError("");
    try {
      await api("auth/demo", "POST");
      router.push("/dashboard");
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Please try again");
      setBusy(false);
    }
  }
  return (
    <main className="landing">
      <header className="landing-header">
        <Brand />
        <nav aria-label="Main navigation">
          <a href="#story">Our story</a>
          <a href="#kingdom">The kingdom</a>
          <a href="#journey">How it works</a>
        </nav>
        <div className="header-actions">
          <Link href="/login" className="login-link">
            Sign in
          </Link>
          <Link className="button button-gold small" href="/register">
            Begin your story <ArrowUpRight size={15} />
          </Link>
        </div>
      </header>
      <section className="hero">
        <Image
          src="/backgrounds/enchanted-kitchen.png"
          alt="A candlelit royal kitchen overlooking an enchanted castle and misty mountains"
          fill
          priority
          sizes="100vw"
          className="hero-art"
        />
        <div className="hero-shade" />
        <div className="embers" aria-hidden="true">
          {Array.from({ length: 12 }, (_, i) => (
            <i
              key={i}
              style={{ left: `${8 + i * 7}%`, animationDelay: `${i * 0.8}s` }}
            />
          ))}
        </div>
        <motion.div {...reveal} className="hero-copy">
          <div className="hero-kicker">
            <span /> FOR THE KEEPER WITHIN YOU
          </div>
          <h1>
            A little magic.
            <br />A better <em>kitchen.</em>
          </h1>
          <p>
            Beyond the everyday, a kingdom awaits.
            <br className="desktop-break" /> Gather your ingredients. Discover
            their stories.
            <br className="desktop-break" /> Turn what you have into something
            wonderful.
          </p>
          <div className="hero-actions">
            <Link href="/register" className="button button-gold">
              Enter the Kingdom <ArrowRight size={18} />
            </Link>
            <button onClick={demo} disabled={busy} className="text-button">
              {busy ? "Opening the gates…" : "Take a look around"}{" "}
              <ArrowUpRight size={17} />
            </button>
          </div>
          {error && (
            <p className="form-error" role="alert">
              {error}
            </p>
          )}
          <div className="hero-note">
            <Wheat size={15} />
            <span>
              Less waste. More wonder. A kitchen that feels like home.
            </span>
          </div>
        </motion.div>
        <div className="hero-caption">
          <span>THE KINGDOM OF MEALTALE</span>
          <small>
            Where everyday ingredients become extraordinary stories.
          </small>
        </div>
        <a href="#story" className="scroll-cue" aria-label="Discover the story">
          <ChevronDown size={20} />
        </a>
      </section>
      <div className="values-strip">
        <span>
          <Leaf size={17} /> Keep good things fresh
        </span>
        <i>✧</i>
        <span>
          <BookOpen size={17} /> Cook with what you have
        </span>
        <i>✧</i>
        <span>
          <ShieldCheck size={17} /> Leave a little less behind
        </span>
      </div>
      <section id="story" className="story-section section-wrap">
        <motion.div {...reveal} className="story-art">
          <div className="art-arch">
            <Image
              src="/backgrounds/enchanted-kitchen.png"
              alt="An ancient cookbook and herbs in the forgotten royal kitchen"
              fill
              sizes="(max-width: 760px) 90vw, 40vw"
            />
          </div>
          <div className="story-seal">
            <Wheat size={26} />
            <span>
              EVERY INGREDIENT
              <br />
              HAS A STORY
            </span>
          </div>
        </motion.div>
        <motion.div {...reveal} className="story-copy">
          <span className="eyebrow">ONCE UPON A KITCHEN</span>
          <h2>
            Some kingdoms are
            <br />
            built around a <em>table.</em>
          </h2>
          <div className="ornament">──── ✧ ────</div>
          <p>
            Hidden beyond the ancient forest lies a kitchen waiting to come
            alive again. Its shelves hold forgotten treasures. Its recipe book
            is full of possibility.
          </p>
          <p>And its next chapter? That’s where you come in.</p>
          <p>
            As the new <strong>Kitchen Keeper</strong>, you’ll bring a little
            order, a little care, and a whole lot of wonder to everyday cooking.
          </p>
          <Link href="/register" className="inline-link">
            Your story begins here <ArrowRight size={17} />
          </Link>
        </motion.div>
      </section>
      <section id="kingdom" className="kingdom-section section-wrap">
        <motion.div {...reveal} className="section-heading">
          <span className="eyebrow">FOUR CORNERS. ENDLESS POSSIBILITIES.</span>
          <h2>
            A whole kingdom.
            <br />
            <em>Right in your kitchen.</em>
          </h2>
          <p>Thoughtful tools for a simpler, more delicious everyday.</p>
        </motion.div>
        <div className="feature-grid">
          {features.map(({ icon: Icon, ...feature }) => (
            <motion.article
              {...reveal}
              key={feature.number}
              className="feature-card"
            >
              <div key="art" className="feature-art">
                <Image
                  src={`/illustrations/${feature.image}.svg`}
                  alt={feature.title}
                  width={300}
                  height={210}
                />
                <span>{feature.number}</span>
              </div>
              <div key="content" className="feature-content">
                <Icon size={23} />
                <h3>{feature.title}</h3>
                <p>{feature.text}</p>
                <Link href="/register" aria-label={`Explore ${feature.title}`}>
                  <ArrowUpRight size={21} />
                </Link>
              </div>
            </motion.article>
          ))}
        </div>
      </section>
      <section id="journey" className="journey-section">
        <div className="section-wrap">
          <div className="section-heading">
            <span className="eyebrow">
              SMALL STEPS. A LITTLE EVERYDAY MAGIC.
            </span>
            <h2>
              Your adventure, <em>beautifully simple.</em>
            </h2>
          </div>
          <div className="journey-grid">
            {[
              [
                "I",
                "Gather your treasures",
                "Add the ingredients already in your kitchen.",
              ],
              [
                "II",
                "Discover the possibilities",
                "Find recipes that make the most of what you have.",
              ],
              [
                "III",
                "Make a little magic",
                "Plan your meals, gather what’s missing, and cook.",
              ],
              [
                "IV",
                "Care for your kingdom",
                "Keep food fresh and celebrate less waste.",
              ],
            ].map(([n, title, text]) => (
              <motion.div {...reveal} key={n}>
                <span key="number" className="step-number">
                  {n}
                </span>
                <h3 key="title">{title}</h3>
                <p key="text">{text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      <section className="final-cta">
        <Sparkles size={29} />
        <span className="eyebrow">THE NEXT CHAPTER IS YOURS</span>
        <h2>
          Your kingdom <em>awaits.</em>
        </h2>
        <p>
          A thoughtful pantry. A table full of possibilities.
          <br />
          And a little more magic in your every day.
        </p>
        <Link href="/register" className="button button-gold">
          Become a Kitchen Keeper <ArrowRight size={18} />
        </Link>
        <small>Free to explore. Made for the way you cook.</small>
      </section>
      <footer className="landing-footer">
        <Brand />
        <p>Good food. Less waste. A story worth keeping.</p>
        <a href="#story">Back to the story ↑</a>
        <small>
          © {new Date().getFullYear()} MealTale. Crafted with a little magic.
        </small>
      </footer>
    </main>
  );
}
