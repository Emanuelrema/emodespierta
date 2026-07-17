"use client";

import { motion } from "framer-motion";
import { ENDING_CONFIG } from "@/game/endingConfig";

/**
 * Cake — Renders either a custom cake image or a highly detailed, animated
 * vector pixel-art style SVG cake with glowing candles that flicker.
 * Slides up and bounces on entrance.
 */
export function Cake() {
  const customImg = ENDING_CONFIG.assets.cakeImageUrl;

  const animationProps = {
    initial: { y: 220, opacity: 0, scale: 0.8 },
    animate: { y: 0, opacity: 1, scale: 1 },
    transition: {
      type: "spring" as const,
      damping: 15,
      stiffness: 70,
      delay: 0.4,
    },
  };

  return (
    <motion.div
      {...animationProps}
      className="flex flex-col items-center justify-center select-none"
      style={{ filter: "drop-shadow(0 10px 20px rgba(139, 92, 246, 0.15))" }}
    >
      {customImg ? (
        // Custom user cake image
        <img
          src={customImg}
          alt="Pastel de cumpleaños"
          className="w-48 h-48 object-contain animate-bounce duration-[4s]"
        />
      ) : (
        // Styled SVG vector cake
        <svg
          width="180"
          height="180"
          viewBox="0 0 100 100"
          className="w-40 h-40 md:w-48 md:h-48"
        >
          {/* Cake Stand */}
          <ellipse cx="50" cy="85" rx="36" ry="6" fill="#1e1b4b" stroke="#8b5cf6" strokeWidth="1.5" />
          <path d="M 44 85 L 42 93 L 58 93 L 56 85 Z" fill="#312e81" stroke="#8b5cf6" strokeWidth="1.5" />
          <ellipse cx="50" cy="93" rx="18" ry="3" fill="#1e1b4b" />

          {/* Tier 1 (Bottom Cake Layer) */}
          <rect x="22" y="55" width="56" height="25" rx="3" fill="#ff003c" stroke="#ff003c" strokeWidth="1" />
          {/* Frosting design bottom */}
          <path d="M 22 62 Q 29 65 36 62 Q 43 65 50 62 Q 57 65 64 62 Q 71 65 78 62" fill="none" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" />
          <rect x="23" y="56" width="54" height="2" fill="rgba(255,255,255,0.25)" />

          {/* Tier 2 (Top Cake Layer) */}
          <rect x="32" y="32" width="36" height="24" rx="2" fill="#ffe600" stroke="#ffe600" strokeWidth="1" />
          {/* Frosting design top */}
          <path d="M 32 39 Q 36.5 42 41 39 Q 45.5 42 50 39 Q 54.5 42 59 39 Q 63.5 42 68 39" fill="none" stroke="#ff003c" strokeWidth="2" strokeLinecap="round" />
          <rect x="33" y="33" width="34" height="2" fill="rgba(255,255,255,0.4)" />

          {/* Sparkles / Sprinkles decoration */}
          <circle cx="28" cy="72" r="1" fill="#ffe600" />
          <circle cx="38" cy="68" r="1.2" fill="#22d3ee" />
          <circle cx="48" cy="74" r="1" fill="#ffe600" />
          <circle cx="62" cy="70" r="1.3" fill="#8b5cf6" />
          <circle cx="70" cy="73" r="1" fill="#ffe600" />
          <circle cx="42" cy="48" r="1" fill="#ff003c" />
          <circle cx="58" cy="46" r="1.2" fill="#22d3ee" />
          <circle cx="50" cy="50" r="1" fill="#8b5cf6" />

          {/* Center Candle */}
          <rect x="48.5" y="14" width="3" height="18" rx="1" fill="#8b5cf6" stroke="#22d3ee" strokeWidth="0.5" />
          {/* Flame with flickering animation class */}
          <path
            d="M 50 4 Q 47 9 50 14 Q 53 9 50 4 Z"
            fill="#ffe600"
            className="animate-pulse"
            style={{
              transformOrigin: "50% 14%",
              filter: "drop-shadow(0 0 5px #ffe600)",
            }}
          />
          <path
            d="M 50 7 Q 48.5 10 50 14 Q 51.5 10 50 7 Z"
            fill="#ff003c"
          />

          {/* Left Candle */}
          <rect x="38.5" y="19" width="3" height="14" rx="1" fill="#22d3ee" stroke="#8b5cf6" strokeWidth="0.5" />
          <path
            d="M 40 10 Q 37.5 14 40 19 Q 42.5 14 40 10 Z"
            fill="#ffe600"
            className="animate-pulse"
            style={{
              transformOrigin: "40% 19%",
              filter: "drop-shadow(0 0 4px #ffe600)",
              animationDelay: "0.2s",
            }}
          />

          {/* Right Candle */}
          <rect x="58.5" y="19" width="3" height="14" rx="1" fill="#22d3ee" stroke="#8b5cf6" strokeWidth="0.5" />
          <path
            d="M 60 10 Q 57.5 14 60 19 Q 62.5 14 60 10 Z"
            fill="#ffe600"
            className="animate-pulse"
            style={{
              transformOrigin: "60% 19%",
              filter: "drop-shadow(0 0 4px #ffe600)",
              animationDelay: "0.4s",
            }}
          />
        </svg>
      )}
    </motion.div>
  );
}
