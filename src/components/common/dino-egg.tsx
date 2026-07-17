"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PixelIcon } from "@/components/ui/pixel-icon";
import { playConfettiSound, playFireworksSound, playClickSound, playHoverSound } from "@/lib/sounds";

export function DinoEgg() {
  const [stage, setStage] = useState<"hidden" | "peeking" | "clicked">("hidden");
  const [bubbleText, setBubbleText] = useState("¡Psst! Emo...");

  useEffect(() => {
    // Every 40 seconds, there is a chance the dino will peek
    const interval = setInterval(() => {
      if (stage === "hidden") {
        const chance = Math.random();
        if (chance > 0.4) {
          // 60% chance to peek
          setStage("peeking");
          setBubbleText("¡Psst! Emo...");
          
          // Auto hide after 8 seconds if not clicked
          setTimeout(() => {
            setStage((current) => (current === "peeking" ? "hidden" : current));
          }, 8000);
        }
      }
    }, 35000);

    return () => clearInterval(interval);
  }, [stage]);

  const handleDinoClick = () => {
    if (stage === "clicked") return;

    setStage("clicked");
    setBubbleText("¡FELIZ CUMPLE EMO! 🦖🎂");
    
    // Play sounds
    playClickSound();
    setTimeout(() => {
      playConfettiSound();
      playFireworksSound();
    }, 150);

    // Auto close after 5 seconds
    setTimeout(() => {
      setStage("hidden");
    }, 5000);
  };

  return (
    <div className="fixed bottom-0 right-4 z-50 pointer-events-none select-none">
      <AnimatePresence>
        {stage !== "hidden" && (
          <motion.div
            initial={{ y: 120, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 120, opacity: 0 }}
            transition={{ type: "spring", damping: 15 }}
            className="flex flex-col items-end pointer-events-auto cursor-pointer"
            onClick={handleDinoClick}
            onMouseEnter={playHoverSound}
          >
            {/* Bubble Dialogue */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-card border-2 border-primary text-foreground px-3 py-1.5 font-heading text-xs uppercase mb-1 mr-2 relative pixel-border shadow-md"
            >
              {bubbleText}
              {/* Arrow for dialogue bubble */}
              <div className="absolute right-6 -bottom-2.5 w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[8px] border-t-primary" />
              <div className="absolute right-[25px] -bottom-[7px] w-0 h-0 border-l-[5px] border-l-transparent border-r-[5px] border-r-transparent border-t-[7px] border-t-card" />
            </motion.div>

            {/* Dinosaur Body */}
            <div className="relative p-1">
              <motion.div
                animate={
                  stage === "clicked"
                    ? {
                        y: [0, -30, 0, -20, 0],
                        rotate: [0, -10, 10, -5, 0],
                        scale: [1, 1.2, 1.2, 1],
                      }
                    : {
                        y: [0, -4, 0],
                        rotate: [0, 2, -2, 0],
                      }
                }
                transition={
                  stage === "clicked"
                    ? { duration: 1.5 }
                    : { repeat: Infinity, duration: 2.5, ease: "easeInOut" }
                }
                className="w-16 h-16 text-emerald-400 hover:text-emerald-300 drop-shadow-[0_0_10px_rgba(52,211,153,0.3)] transition-colors"
              >
                <PixelIcon name="dino" size={64} />
              </motion.div>

              {/* Sparkles / Confetti animation in stage === "clicked" */}
              {stage === "clicked" && (
                <div className="absolute inset-0 pointer-events-none">
                  {Array.from({ length: 15 }).map((_, i) => {
                    const angle = (i / 15) * Math.PI * 2;
                    const distance = 80 + Math.random() * 80;
                    return (
                      <motion.div
                        key={i}
                        initial={{ x: 32, y: 32, scale: 1, opacity: 1 }}
                        animate={{
                          x: 32 + Math.cos(angle) * distance,
                          y: 32 + Math.sin(angle) * distance,
                          scale: [1, 0],
                          opacity: [1, 0],
                        }}
                        transition={{ duration: 1.2, ease: "easeOut" }}
                        className="absolute w-2 h-2"
                        style={{
                          backgroundColor: [
                            "#ff003c", // spider red
                            "#ffe600", // yellow
                            "#8b5cf6", // purple
                            "#38bdf8", // blue
                            "#34d399", // green
                          ][i % 5],
                          imageRendering: "pixelated",
                        }}
                      />
                    );
                  })}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
