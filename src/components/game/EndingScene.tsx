"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ENDING_CONFIG } from "@/game/endingConfig";
import { BackgroundStars } from "./BackgroundStars";
import { TypewriterText } from "./TypewriterText";
import { Fireworks } from "./Fireworks";
import { Cake } from "./Cake";
import { Confetti } from "./Confetti";
import { BirthdayMessage } from "./BirthdayMessage";
import { OpenGiftButton } from "./OpenGiftButton";
import {
  AudioManager,
  playFireworkSFX,
  playConfettiSFX,
  playCakeSFX,
  playClickSFX,
  playTransitionSFX,
} from "./AudioManager";

/**
 * Transition Phases:
 *   1. FADE_OUT_MINIGAME - Fade out canvas, pitch black.
 *   2. SILENCE - Pitch black, absolute silence for 1s.
 *   3. TYPEWRITER - Slowly display emotional messages.
 *   4. TRANSITION_PAUSE - Keep text for 2s, prepare music/night transition.
 *   5. CELEBRATION - Starry sky gradient, music fade-in, fireworks, cake, birthday text, confetti.
 *   6. UNLOCKING - Clicked gift button, final fade out.
 */
type Phase =
  | "FADE_OUT_MINIGAME"
  | "SILENCE"
  | "TYPEWRITER"
  | "TRANSITION_PAUSE"
  | "CELEBRATION"
  | "UNLOCKING";

interface EndingSceneProps {
  onUnlock: () => void;
}

export function EndingScene({ onUnlock }: EndingSceneProps) {
  const [phase, setPhase] = useState<Phase>("FADE_OUT_MINIGAME");
  const [playMusic, setPlayMusic] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    if (phase === "FADE_OUT_MINIGAME") {
      // 1. Fade out minigame automatically takes 2s
      const timer = setTimeout(() => {
        setPhase("SILENCE");
      }, 2000);
      return () => clearTimeout(timer);
    }

    if (phase === "SILENCE") {
      // 2. Black silence for 1s
      const timer = setTimeout(() => {
        setPhase("TYPEWRITER");
      }, 1000);
      return () => clearTimeout(timer);
    }

    if (phase === "TRANSITION_PAUSE") {
      // 3. Pause for 2s before celebration starts
      const timer = setTimeout(() => {
        playTransitionSFX();
        setPhase("CELEBRATION");
      }, 2000);
      return () => clearTimeout(timer);
    }

    if (phase === "CELEBRATION") {
      // 4. Start background music
      setPlayMusic(true);

      // 5. Trigger confetti and play sound
      setShowConfetti(true);
      playConfettiSFX();

      // 6. Play cake arrival sound shortly after animation completes
      const cakeTimer = setTimeout(() => {
        playCakeSFX();
      }, 700);

      // Stop confetti after 5 seconds (temporary effect)
      const confettiTimer = setTimeout(() => {
        setShowConfetti(false);
      }, 5500);

      return () => {
        clearTimeout(cakeTimer);
        clearTimeout(confettiTimer);
      };
    }
  }, [phase]);

  function handleTypewriterComplete() {
    setPhase("TRANSITION_PAUSE");
  }

  function handleOpenGift() {
    playClickSFX();
    playTransitionSFX();
    setPhase("UNLOCKING");

    // Wait for the final slow fade-out transition before unlocking
    setTimeout(() => {
      onUnlock();
    }, 1500);
  }

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center overflow-hidden"
      style={{
        background:
          phase === "FADE_OUT_MINIGAME" || phase === "SILENCE" || phase === "TYPEWRITER"
            ? "#030209"
            : ENDING_CONFIG.theme.backgroundGradient,
        transition: "background 2.5s ease-in-out",
      }}
    >
      {/* ── Background sound & music controller ── */}
      <AudioManager playMusic={playMusic} />

      {/* ── Starry Night Backdrop (Celebration Phase) ── */}
      {phase === "CELEBRATION" && <BackgroundStars />}

      {/* ── Fireworks (Celebration Phase) ── */}
      {phase === "CELEBRATION" && <Fireworks onExplode={playFireworkSFX} />}

      {/* ── Confetti Blast (Celebration Phase, temporary) ── */}
      {showConfetti && <Confetti />}

      {/* ── Main Content Area ── */}
      <div className="relative z-10 w-full max-w-4xl px-6 flex flex-col items-center justify-center space-y-6">
        <AnimatePresence mode="wait">
          {/* Phase 3: Typewriter introduction */}
          {phase === "TYPEWRITER" && (
            <motion.div
              key="typewriter-screen"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 1.0 }}
              className="w-full"
            >
              <TypewriterText
                lines={ENDING_CONFIG.texts.typewriterLines}
                onComplete={handleTypewriterComplete}
              />
            </motion.div>
          )}

          {/* Phase 4: Transition Pause */}
          {phase === "TRANSITION_PAUSE" && (
            <motion.div
              key="pause-screen"
              initial={{ opacity: 1 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.8 }}
              className="text-center font-mono text-base md:text-lg text-purple-200/80 leading-relaxed"
            >
              {ENDING_CONFIG.texts.typewriterLines[ENDING_CONFIG.texts.typewriterLines.length - 1]}
            </motion.div>
          )}

          {/* Phase 5: Birthday Celebration */}
          {phase === "CELEBRATION" && (
            <motion.div
              key="celebration-screen"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.2 }}
              className="flex flex-col items-center justify-center space-y-6"
            >
              {/* Animated Cake */}
              <Cake />

              {/* Congratulations message */}
              <BirthdayMessage />

              {/* Final big gift CTA button */}
              <OpenGiftButton onClick={handleOpenGift} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── Final overlay screen transitions ── */}
      {phase === "FADE_OUT_MINIGAME" && (
        <motion.div
          initial={{ opacity: 1 }}
          animate={{ opacity: 0 }}
          transition={{ duration: 2.0 }}
          className="absolute inset-0 z-50 bg-[#030209] pointer-events-none"
        />
      )}

      {phase === "UNLOCKING" && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2, ease: "easeInOut" }}
          className="absolute inset-0 z-50 bg-[#030209] pointer-events-none"
        />
      )}
    </div>
  );
}
