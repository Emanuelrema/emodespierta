"use client";

import { motion } from "framer-motion";
import { ENDING_CONFIG } from "@/game/endingConfig";

/**
 * BirthdayMessage — Large, elegant typography with smooth delay fades.
 * Displays "Feliz Cumpleaños Emily" in pixelify style with Spider-Verse neon glow colors.
 */
export function BirthdayMessage() {
  const { birthdayTitle, birthdaySubtitle } = ENDING_CONFIG.texts;
  const { titleColor, subtitleColor } = ENDING_CONFIG.theme;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.25,
        delayChildren: 0.6,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 15, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring" as const, damping: 12, stiffness: 60 },
    },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="text-center space-y-4 max-w-xl px-4 select-none"
    >
      {/* Title with retro glitched spider-verse-like glow styling */}
      <motion.h2
        variants={itemVariants}
        style={{ color: titleColor }}
        className="text-3xl sm:text-5xl font-heading tracking-tight leading-tight text-white drop-shadow-[0_0_20px_rgba(255,0,96,0.35)]"
      >
        {birthdayTitle}
      </motion.h2>

      {/* Elegant subtitling */}
      <motion.p
        variants={itemVariants}
        style={{ color: subtitleColor }}
        className="text-xs sm:text-sm md:text-base font-sans font-light tracking-wide max-w-md mx-auto leading-relaxed"
      >
        {birthdaySubtitle}
      </motion.p>
    </motion.div>
  );
}
