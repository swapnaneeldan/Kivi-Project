"use client";

import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

type Season = "spring" | "summer" | "autumn" | "winter";

const seasonalScenes: Record<Season, { src: string; alt: string }> = {
  spring: { src: "/images/kivi-hero-spring.png", alt: "Pixel-art kiwi beneath a blossoming spring tree and moon" },
  summer: { src: "/images/kivi-hero-summer.png", alt: "Pixel-art kiwi beneath a lush summer tree at blue hour" },
  autumn: { src: "/images/kivi-hero-autumn.png", alt: "Pixel-art kiwi beneath an autumn tree and moon" },
  winter: { src: "/images/kivi-hero-winter.png", alt: "Pixel-art kiwi beneath a snowy winter tree and moon" },
};

const seasons: Season[] = ["spring", "summer", "autumn", "winter"];
interface KiwiHeroWidgetProps {
  wordCount: number;
}

export function KiwiHeroWidget({ wordCount }: KiwiHeroWidgetProps) {
  const [season, setSeason] = useState<Season>("spring");
  const scene = seasonalScenes[season];

  useEffect(() => {
    const nextSceneIndex = Number(window.sessionStorage.getItem("kivi-seasonal-scene-index") ?? "0") % seasons.length;
    window.sessionStorage.setItem("kivi-seasonal-scene-index", String((nextSceneIndex + 1) % seasons.length));
    const frame = window.requestAnimationFrame(() => setSeason(seasons[nextSceneIndex]));
    return () => window.cancelAnimationFrame(frame);
  }, []);

  return (
    <section className="kivi-kiwi-widget" aria-label={`${wordCount.toLocaleString()} words took flight today`}>
      <AnimatePresence mode="wait">
        <motion.div key={season} className="kivi-kiwi-widget__scene" initial={{ opacity: 0, scale: 1.025 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: .985 }} transition={{ duration: .55, ease: "easeOut" }}>
          <Image src={scene.src} alt={scene.alt} fill priority sizes="(max-width: 1024px) 100vw, 38vw" />
        </motion.div>
      </AnimatePresence>
      <div className="kivi-kiwi-widget__copy">
        <strong key={wordCount}>{wordCount.toLocaleString()}</strong>
        <span>he can&apos;t fly. your words can.</span>
        <small>words took flight today</small>
      </div>
    </section>
  );
}
