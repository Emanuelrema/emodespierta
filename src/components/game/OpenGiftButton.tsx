"use client";

import { motion } from "framer-motion";
import { ENDING_CONFIG } from "@/game/endingConfig";

interface OpenGiftButtonProps {
  onClick: () => void;
}

/**
 * OpenGiftButton — Huge button triggering the final transition to the Gallery.
 * Includes:
 *   - Pulse keyframe entry.
 *   - Scaling and elevation on hover.
 *   - Neon pink glow tailing the theme.
 */
export function OpenGiftButton({ onClick }: OpenGiftButtonProps) {
  const { buttonLabel } = ENDING_CONFIG.texts;
  const { buttonBgColor, buttonGlowColor } = ENDING_CONFIG.theme;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.85, y: 15 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{
        type: "spring",
        stiffness: 80,
        damping: 12,
        delay: 2.2, // Appears after cake and messages have settled
      }}
      className="flex justify-center mt-6"
    >
      <motion.button
        onClick={onClick}
        whileHover={{
          scale: 1.06,
          y: -4,
          boxShadow: `0 0 25px ${buttonGlowColor}, 0 5px 15px rgba(0,0,0,0.4)`,
        }}
        whileTap={{ scale: 0.97, y: 0 }}
        style={{
          backgroundColor: buttonBgColor,
          borderColor: "rgba(255, 255, 255, 0.25)",
        }}
        className="relative group px-10 py-5 text-base sm:text-lg font-heading tracking-wider text-white border-2 rounded-none cursor-pointer overflow-hidden transition-shadow select-none shadow-[0_0_12px_rgba(255,0,96,0.2)] focus:outline-none"
      >
        {/* Glow overlay shine */}
        <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
        
        {/* Button content */}
        <span className="relative z-10 flex items-center gap-2">
          {buttonLabel}
        </span>
      </motion.button>
    </motion.div>
  );
}
