"use client";
import Image from "next/image";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
  useSpring,
} from "motion/react";
import { ArrowUpRight, Leaf, Sparkles, Wheat } from "lucide-react";
import type { PointerEvent } from "react";
import { chapters } from "./chapters";
import styles from "./landing.module.css";

export function KingdomBook({
  chapter,
  select,
}: {
  chapter: number;
  select: (index: number) => void;
}) {
  const reduced = useReducedMotion();
  const rotateX = useSpring(7, { stiffness: 90, damping: 24 });
  const rotateY = useSpring(-17, { stiffness: 90, damping: 24 });
  const item = chapters[chapter];
  function move(event: PointerEvent<HTMLDivElement>) {
    if (reduced || event.pointerType !== "mouse") return;
    const rect = event.currentTarget.getBoundingClientRect();
    rotateX.set(7 - ((event.clientY - rect.top) / rect.height - 0.5) * 13);
    rotateY.set(-17 + ((event.clientX - rect.left) / rect.width - 0.5) * 23);
  }
  function reset() {
    rotateX.set(7);
    rotateY.set(-17);
  }
  return (
    <div className={styles.bookShowcase}>
      <div
        className={styles.bookStage}
        onPointerMove={move}
        onPointerLeave={reset}
      >
        <div className={styles.orbit} aria-hidden="true">
          <span>✧</span>
          <span>✧</span>
          <span>✧</span>
          <span>✧</span>
        </div>
        <div className={styles.orbitInner} aria-hidden="true" />
        <div className={styles.bookAura} aria-hidden="true" />
        <div className={styles.bookFloat}>
          <motion.div
            className={styles.book}
            style={{
              rotateX: reduced ? 0 : rotateX,
              rotateY: reduced ? -12 : rotateY,
            }}
            aria-hidden="true"
          >
            <div className={styles.bookBack} />
            <div className={styles.bookPages} />
            <div className={styles.bookSpine}>
              <Wheat size={18} />
              <span>MEALTALE</span>
              <Wheat size={18} />
            </div>
            <div className={styles.bookCover}>
              <div className={styles.coverBorder} />
              <span className={`${styles.coverCorner} ${styles.cornerTL}`} />
              <span className={`${styles.coverCorner} ${styles.cornerTR}`} />
              <span className={`${styles.coverCorner} ${styles.cornerBL}`} />
              <span className={`${styles.coverCorner} ${styles.cornerBR}`} />
              <div className={styles.coverMark}>
                <Wheat size={20} />
                <span>FROM THE KEEPER’S COLLECTION</span>
              </div>
              <AnimatePresence mode="wait">
                <motion.div
                  key={item.id}
                  className={styles.coverContents}
                  initial={{ opacity: 0, y: reduced ? 0 : 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: reduced ? 0 : -8 }}
                  transition={{ duration: 0.24 }}
                >
                  <div className={styles.coverTitle}>
                    <span>{item.cover}</span>
                    <strong>{item.subtitle}</strong>
                  </div>
                  <div className={styles.coverWindow}>
                    <Image
                      src="/images/kingdom/keepers-table-v3.png"
                      alt=""
                      fill
                      sizes="250px"
                    />
                    <div className={styles.coverWindowShade} />
                    <item.icon size={30} strokeWidth={1} />
                  </div>
                  <div className={styles.coverMotto}>
                    A little care.
                    <br />
                    <em>A little everyday magic.</em>
                  </div>
                </motion.div>
              </AnimatePresence>
              <div className={styles.coverBottom}>
                <span>✧</span>
                <small>CHAPTER {item.number}</small>
                <span>✧</span>
              </div>
            </div>
            <div className={styles.bookBookmark} />
          </motion.div>
        </div>
        <div
          className={`${styles.floatingNote} ${styles.noteFresh}`}
          aria-hidden="true"
        >
          <span className={styles.noteIcon}>
            <Leaf size={21} />
          </span>
          <div>
            <small>A LITTLE LESS WASTE</small>
            <strong>Freshness, looked after.</strong>
          </div>
          <i />
        </div>
        <div
          className={`${styles.floatingNote} ${styles.noteRecipe}`}
          aria-hidden="true"
        >
          <div className={styles.noteFood}>
            <Image
              src="/images/kingdom/keepers-table-v3.png"
              alt=""
              fill
              sizes="64px"
            />
          </div>
          <div>
            <small>A LITTLE MORE POSSIBILITY</small>
            <strong>{item.short}, reimagined.</strong>
          </div>
          <ArrowUpRight size={17} />
        </div>
        <span className={styles.stageStarOne} aria-hidden="true">
          ✦
        </span>
        <span className={styles.stageStarTwo} aria-hidden="true">
          ✧
        </span>
      </div>
      <div
        className={styles.chapterSelector}
        role="group"
        aria-label="Preview kingdom chapters"
      >
        {chapters.map((c, index) => (
          <button
            key={c.id}
            onClick={() => select(index)}
            aria-pressed={chapter === index}
            aria-label={`Preview ${c.name}`}
            className={chapter === index ? styles.chapterActive : ""}
          >
            <c.icon size={16} />
            <span>{c.number}</span>
          </button>
        ))}
      </div>
      <p className={styles.bookCaption} aria-live="polite">
        <Sparkles size={12} />
        <span>{item.note}</span>
        <span className={styles.pointerHint}>· move to discover</span>
      </p>
    </div>
  );
}
