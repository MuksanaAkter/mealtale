"use client";
import Link from "next/link";
import Image from "next/image";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "motion/react";
import {
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  Check,
  Leaf,
  Menu,
  Minus,
  Plus,
  ShieldCheck,
  Sparkles,
  Wheat,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Brand } from "./ui/brand";
import { api } from "@/lib/api/client";
import { KingdomBook } from "./landing/kingdom-book";
import { KingdomPreview } from "./landing/kingdom-preview";
import { chapters } from "./landing/chapters";
import styles from "./landing/landing.module.css";

const questions = [
  {
    question: "What exactly is MealTale?",
    answer:
      "A thoughtful home for your pantry, recipes, shopping lists, and weekly meals — wrapped in a little fantasy. You’re the Kitchen Keeper; MealTale helps you care for the ingredients you already have.",
  },
  {
    question: "Do I need to be an experienced cook?",
    answer:
      "Not at all. The cookbook includes approachable recipes with ingredients, quantities, timing, and step-by-step instructions. Start with what’s in your kitchen and discover a little possibility.",
  },
  {
    question: "How does it know what I can cook?",
    answer:
      "MealTale matches recipe ingredient names and quantities against your pantry, converts compatible units, and leaves expired ingredients out. It’s transparent ingredient matching — not an AI guess.",
  },
  {
    question: "Can I explore before creating an account?",
    answer:
      "Yes. Choose “Take a look around” to enter a private demo kingdom with sample ingredients, recipes, a market list, and a meal plan. Or create your own account and choose a fresh start.",
  },
];

export default function Landing() {
  const reduced = useReducedMotion();
  const { scrollY, scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });
  const drift = useTransform(scrollY, [0, 1000], [0, 180]);
  const mist = useTransform(scrollY, [0, 800], [0, -90]);
  const router = useRouter();
  const [chapter, setChapter] = useState(1);
  const [menu, setMenu] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [openQuestion, setOpenQuestion] = useState<number | null>(0);
  const reveal = {
    initial: { opacity: 0, y: reduced ? 0 : 26 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, amount: 0.15 },
    transition: { duration: reduced ? 0 : 0.65 },
  };
  useEffect(() => {
    if (!menu) return;
    const close = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenu(false);
    };
    window.addEventListener("keydown", close);
    return () => window.removeEventListener("keydown", close);
  }, [menu]);
  async function demo() {
    if (busy) return;
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
    <main className={styles.home} id="top">
      <motion.div
        className={styles.readingProgress}
        style={{ scaleX: reduced ? 0 : progress }}
        aria-hidden="true"
      />
      <header className={styles.header}>
        <div className={styles.headerInner}>
          <Brand />
          <nav className={styles.desktopNav} aria-label="Main navigation">
            <a href="#story">The story</a>
            <a href="#kingdom">Your kingdom</a>
            <a href="#journey">The journey</a>
          </nav>
          <div className={styles.headerActions}>
            <Link href="/login" className={styles.signIn}>
              Sign in
            </Link>
            <Link href="/register" className={styles.navCta}>
              Begin your story <ArrowUpRight size={15} />
            </Link>
            <button
              className={styles.menuToggle}
              aria-label={menu ? "Close menu" : "Open menu"}
              aria-expanded={menu}
              aria-controls={menu ? "landing-navigation" : undefined}
              onClick={() => setMenu(!menu)}
            >
              {menu ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
        <AnimatePresence>
          {menu && (
            <motion.nav
              id="landing-navigation"
              className={styles.mobileNav}
              aria-label="Mobile navigation"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
            >
              <a href="#story" onClick={() => setMenu(false)}>
                The story <ArrowUpRight size={16} />
              </a>
              <a href="#kingdom" onClick={() => setMenu(false)}>
                Your kingdom <ArrowUpRight size={16} />
              </a>
              <a href="#journey" onClick={() => setMenu(false)}>
                The journey <ArrowUpRight size={16} />
              </a>
              <Link href="/register">
                Become a Keeper <ArrowRight size={16} />
              </Link>
            </motion.nav>
          )}
        </AnimatePresence>
      </header>
      <section className={styles.hero}>
        <motion.div
          className={styles.landscape}
          style={{ y: reduced ? 0 : drift }}
        >
          <Image
            src="/backgrounds/enchanted-meal-kitchen-v3.png"
            alt="An enchanted kitchen with steaming vegetable soup, fresh ingredients, pantry jars, and an open cookbook"
            fill
            priority
            sizes="100vw"
          />
        </motion.div>
        <div className={styles.heroVeil} />
        <div className={styles.heroGrain} aria-hidden="true" />
        <motion.div
          className={styles.heroMist}
          style={{ y: reduced ? 0 : mist }}
          aria-hidden="true"
        />
        <div className={styles.fireflies} aria-hidden="true">
          {Array.from({ length: 18 }, (_, i) => (
            <i
              key={i}
              style={{
                left: `${4 + i * 5.2}%`,
                top: `${25 + (i % 6) * 11}%`,
                animationDelay: `${i * 0.7}s`,
                animationDuration: `${7 + (i % 4) * 2}s`,
              }}
            />
          ))}
        </div>
        <div className={styles.heroInner}>
          <motion.div {...reveal} className={styles.heroCopy}>
            <div className={styles.heroEyebrow}>
              <span className={styles.eyebrowStar}>✧</span> GOOD FOOD. LESS
              WASTE. EVERYDAY MAGIC. <span className={styles.eyebrowLine} />
            </div>
            <h1>
              Your kitchen.
              <br />A world of
              <br />
              <em>possibility.</em>
              <span className={styles.headingSparkle} aria-hidden="true">
                ✧
              </span>
            </h1>
            <p>
              A home for your ingredients. A story in every recipe.
              <br className={styles.desktopBreak} /> A little less waste — and a
              little more wonder.
            </p>
            <div className={styles.heroButtons}>
              <Link href="/register" className={styles.primaryButton}>
                <span>Enter the Kingdom</span>
                <ArrowUpRight size={19} />
              </Link>
              <button
                className={styles.demoButton}
                onClick={demo}
                disabled={busy}
              >
                <span className={styles.playIcon}>
                  <ArrowRight size={15} />
                </span>
                {busy ? "Opening the gates…" : "Take a look around"}
              </button>
            </div>
            {error && (
              <p className={styles.error} role="alert">
                {error}
              </p>
            )}
            <div className={styles.heroTrust}>
              <div className={styles.miniCrest}>
                <Wheat size={19} />
              </div>
              <div>
                <strong>For the Keeper within you.</strong>
                <span>
                  No perfect pantry required. Just a little curiosity.
                </span>
              </div>
            </div>
          </motion.div>
          <motion.div
            className={styles.heroScene}
            initial={{ opacity: 0, y: reduced ? 0 : 35 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: reduced ? 0 : 1, delay: 0.25 }}
          >
            <KingdomBook chapter={chapter} select={setChapter} />
          </motion.div>
        </div>
        <div className={styles.heroFoot}>
          <a href="#story">
            <span className={styles.scrollCircle}>
              <ArrowDown size={15} />
            </span>
            SCROLL TO UNFOLD THE STORY
          </a>
          <span>
            A QUIETER KITCHEN. <em>A richer everyday.</em>
          </span>
          <span className={styles.heroCoordinates}>
            EST. IN EVERYDAY MAGIC <span>✧</span>
          </span>
        </div>
      </section>
      <section
        className={styles.promiseStrip}
        aria-label="The MealTale promise"
      >
        <span>
          <Leaf size={19} /> Less waste, more wonder
        </span>
        <i>✧</i>
        <span>
          <BookOpen size={19} /> Cook what’s already possible
        </span>
        <i>✧</i>
        <span>
          <ShieldCheck size={19} /> Your little corner of the kingdom
        </span>
      </section>
      <section className={styles.story} id="story">
        <div className={styles.sectionNumber}>
          I <span>THE BEGINNING</span>
        </div>
        <div className={styles.storyGrid}>
          <motion.div className={styles.storyVisual} {...reveal}>
            <div className={styles.storyRing} />
            <div className={styles.storyArch}>
              <Image
                src="/backgrounds/enchanted-meal-kitchen-v3.png"
                alt="A royal kitchen filled with fresh vegetables, warm bread, cooking pots, and a recipe book"
                fill
                sizes="(max-width: 760px) 90vw, 45vw"
              />
              <div className={styles.storyArchVeil} />
              <span>
                THE ROYAL KITCHEN
                <br />
                <em>Waiting for its next chapter.</em>
              </span>
            </div>
            <div className={styles.storySeal}>
              <Wheat size={25} />
              <span>
                GOOD THINGS
                <br />
                BEGIN HERE
              </span>
            </div>
            <div className={styles.storyIngredient}>
              <Image
                src="/illustrations/herbs.svg"
                alt="Fresh garden herbs"
                width={100}
                height={70}
              />
              <span>
                A little care.
                <br />
                <strong>A world of difference.</strong>
              </span>
            </div>
            <span className={styles.storySideNote}>
              THE MAGIC WAS HERE ALL ALONG
            </span>
          </motion.div>
          <motion.div className={styles.storyCopy} {...reveal}>
            <span className={styles.kicker}>
              <span /> ONCE UPON A KITCHEN
            </span>
            <h2>
              Not an empty
              <br />
              cupboard.
              <br />
              <em>An unwritten story.</em>
            </h2>
            <p>
              Hidden beyond the ancient forest is a kitchen waiting to come
              alive again. Its shelves hold forgotten treasures. Its cookbook is
              full of possibility.
            </p>
            <p>All it needs is a Keeper.</p>
            <p>
              Someone to see a handful of herbs as tomorrow’s dinner. To give a
              little care to what’s already there. To make the everyday feel a
              little extraordinary.
            </p>
            <div className={styles.storySignature}>
              <span>That someone is you.</span>
              <Sparkles size={21} />
            </div>
            <Link href="/register" className={styles.editorialLink}>
              Write your first chapter <ArrowUpRight size={19} />
            </Link>
          </motion.div>
        </div>
      </section>
      <section className={styles.explore} id="kingdom">
        <div className={styles.sectionNumber}>
          II <span>YOUR LITTLE WORLD</span>
        </div>
        <motion.div className={styles.exploreHeading} {...reveal}>
          <span className={styles.kicker}>
            FOUR CORNERS. ONE THOUGHTFUL KITCHEN.
          </span>
          <h2>
            A whole kingdom.
            <br />
            <em>Beautifully connected.</em>
          </h2>
          <p>Everything you need, with a little room for wonder.</p>
        </motion.div>
        <div className={styles.explorerGrid}>
          <div
            className={styles.featureNavigation}
            role="group"
            aria-label="Explore kingdom features"
          >
            {chapters.map((c, i) => (
              <button
                key={c.id}
                aria-pressed={chapter === i}
                onClick={() => setChapter(i)}
                className={chapter === i ? styles.featureSelected : ""}
              >
                <span className={styles.featureIndex}>{c.number}</span>
                <span className={styles.featureNavContent}>
                  <span className={styles.featureNavTitle}>
                    <c.icon size={19} />
                    {c.name}
                  </span>
                  <AnimatePresence initial={false}>
                    {chapter === i && (
                      <motion.span
                        className={styles.featureDescription}
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: reduced ? 0 : 0.25 }}
                      >
                        {c.description}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </span>
                <ArrowUpRight size={18} />
              </button>
            ))}
            <Link href="/register" className={styles.editorialLink}>
              Make this kingdom yours <ArrowRight size={17} />
            </Link>
          </div>
          <motion.div className={styles.previewPerspective} {...reveal}>
            <div className={styles.previewGlow} />
            <AnimatePresence mode="wait">
              <motion.div
                key={chapter}
                initial={{
                  opacity: 0,
                  y: reduced ? 0 : 12,
                  rotateX: reduced ? 0 : 3,
                }}
                animate={{ opacity: 1, y: 0, rotateX: 0 }}
                exit={{ opacity: 0, y: reduced ? 0 : -10 }}
                transition={{ duration: reduced ? 0 : 0.25 }}
              >
                <KingdomPreview chapter={chapter} />
              </motion.div>
            </AnimatePresence>
            <div className={styles.previewCaption}>
              <span>✧</span>
              <p>{chapters[chapter].heading}</p>
              <span>✧</span>
            </div>
          </motion.div>
        </div>
      </section>
      <section className={styles.journey} id="journey">
        <div className={styles.journeyStars} aria-hidden="true">
          ✧<span>✦</span>✧
        </div>
        <div className={styles.sectionNumber}>
          III <span>THE EVERYDAY RITUAL</span>
        </div>
        <motion.div className={styles.journeyHeading} {...reveal}>
          <span className={styles.kicker}>
            SMALL STEPS. LOVELY POSSIBILITIES.
          </span>
          <h2>
            A little rhythm.
            <br />
            <em>A lot less rush.</em>
          </h2>
        </motion.div>
        <div className={styles.journeySteps}>
          {[
            {
              number: "01",
              icon: Leaf,
              title: "Gather your treasures.",
              text: "Start with what’s already in your kitchen. Every little ingredient counts.",
              detail: "A home for the good things",
            },
            {
              number: "02",
              icon: BookOpen,
              title: "Discover the possibilities.",
              text: "Find a recipe, gather what’s missing, and give the week a little shape.",
              detail: "A spark for your next meal",
            },
            {
              number: "03",
              icon: Wheat,
              title: "Make a little magic.",
              text: "Cook, share, and savor. Less forgotten food. More moments worth keeping.",
              detail: "A story around the table",
            },
          ].map(({ icon: Icon, ...step }) => (
            <motion.article
              key={step.number}
              className={styles.journeyStep}
              {...reveal}
            >
              <div key="number" className={styles.journeyStepTop}>
                <span>{step.number}</span>
                <i />
                <Icon size={23} />
              </div>
              <h3 key="title">{step.title}</h3>
              <p key="copy">{step.text}</p>
              <span key="detail" className={styles.journeyDetail}>
                {step.detail} <Check size={13} />
              </span>
            </motion.article>
          ))}
        </div>
      </section>
      <section className={styles.careSection}>
        <motion.div className={styles.careCard} {...reveal}>
          <div className={styles.careArt}>
            <Image
              src="/images/kingdom/keepers-table-v3.png"
              alt="A nourishing bowl of soup with garden vegetables, fresh bread, herbs, and an illustrated cookbook"
              width={600}
              height={450}
            />
            <div className={styles.careArtBadge}>
              <Leaf size={20} />
              <span>
                NOTHING GOOD,
                <br />
                FORGOTTEN.
              </span>
            </div>
          </div>
          <div className={styles.careCopy}>
            <span className={styles.kicker}>
              A SMALL KINDNESS TO YOUR KINGDOM
            </span>
            <h2>
              Good for your table.
              <br />
              <em>A little gentler on the world.</em>
            </h2>
            <p>
              A handful of spinach saved. A meal made from what you have. A
              shopping list with just enough. They’re small things — until they
              become your everyday.
            </p>
            <Link href="/register" className={styles.editorialLink}>
              Start with a little care <ArrowUpRight size={18} />
            </Link>
          </div>
        </motion.div>
      </section>
      <section className={styles.faq}>
        <div>
          <span className={styles.kicker}>
            A FEW THINGS, BEFORE YOU WANDER IN
          </span>
          <h2>
            A curious Keeper
            <br />
            <em>asks good questions.</em>
          </h2>
          <span className={styles.faqOrnament}>──── ✧ ────</span>
        </div>
        <div className={styles.faqList}>
          {questions.map((q, i) => (
            <div className={styles.faqItem} key={q.question}>
              <h3>
                <button
                  aria-expanded={openQuestion === i}
                  aria-controls={
                    openQuestion === i ? `keeper-answer-${i}` : undefined
                  }
                  onClick={() => setOpenQuestion(openQuestion === i ? null : i)}
                >
                  {q.question}
                  {openQuestion === i ? (
                    <Minus size={17} />
                  ) : (
                    <Plus size={17} />
                  )}
                </button>
              </h3>
              <AnimatePresence initial={false}>
                {openQuestion === i && (
                  <motion.div
                    id={`keeper-answer-${i}`}
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: reduced ? 0 : 0.25 }}
                  >
                    <p>{q.answer}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </section>
      <section className={styles.finalCta}>
        <Image
          src="/backgrounds/enchanted-meal-kitchen-v3.png"
          alt=""
          fill
          sizes="100vw"
        />
        <div className={styles.finalVeil} />
        <motion.div {...reveal} className={styles.finalInner}>
          <div className={styles.finalCrest}>
            <Wheat size={32} />
          </div>
          <span className={styles.kicker}>
            THE NEXT CHAPTER HAS YOUR NAME ON IT
          </span>
          <h2>
            Your kingdom
            <br />
            <em>is calling.</em>
          </h2>
          <p>
            A thoughtful pantry. A table full of possibilities.
            <br />A little more magic in your every day.
          </p>
          <Link href="/register" className={styles.primaryButton}>
            Become a Kitchen Keeper <ArrowUpRight size={19} />
          </Link>
          <span className={styles.finalNote}>
            <ShieldCheck size={13} /> A little curiosity is all you need.
          </span>
        </motion.div>
        <div className={styles.finalSideText} aria-hidden="true">
          LET SOMETHING GOOD BEGIN
        </div>
      </section>
      <footer className={styles.footer}>
        <div className={styles.footerMain}>
          <Brand />
          <p>
            A thoughtful kitchen.
            <br />A little everyday magic.
          </p>
          <nav aria-label="Footer navigation">
            <a href="#story">Our story</a>
            <a href="#kingdom">Your kingdom</a>
            <Link href="/login">Sign in</Link>
          </nav>
          <a href="#top" className={styles.backTop}>
            Back to the beginning <ArrowUpRight size={16} />
          </a>
        </div>
        <div className={styles.footerBottom}>
          <span>
            © {new Date().getFullYear()} MealTale. Crafted with care.
          </span>
          <span>
            LESS WASTE. <i>MORE WONDER.</i>
            <Leaf size={13} />
          </span>
          <span>The enchanted kitchen.</span>
        </div>
      </footer>
    </main>
  );
}
