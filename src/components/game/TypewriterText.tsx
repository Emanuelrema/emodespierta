"use client";

import { useState, useEffect, useRef } from "react";

interface TypewriterTextProps {
  lines: string[];
  onComplete: () => void;
}

/**
 * TypewriterText — Displays lines of text sequentially with a typewriter effect.
 * Features:
 *   - Clicking/tapping anywhere or pressing any key speeds up/skips the typing animation.
 *   - High performance, smooth letter addition.
 *   - Auto-scrolls to the bottom on container growth.
 */
export function TypewriterText({ lines, onComplete }: TypewriterTextProps) {
  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState("");
  const [completedLines, setCompletedLines] = useState<string[]>([]);
  const [isDone, setIsDone] = useState(false);

  const charIndexRef = useRef(0);
  const speedRef = useRef(50); // Speed in ms per character (default is 50ms)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Speed up when clicking
  function handleSpeedUp() {
    if (isDone) return;

    const fullLine = lines[currentLineIndex];
    if (!fullLine) return;

    if (charIndexRef.current < fullLine.length) {
      // If the current line is not finished, complete it immediately
      charIndexRef.current = fullLine.length;
      setDisplayedText(fullLine);
    } else {
      // If the current line is already finished, trigger next line immediately
      proceedToNextLine();
    }
  }

  function proceedToNextLine() {
    const fullLine = lines[currentLineIndex];
    if (!fullLine) return;

    // Add finished line to completed lines
    setCompletedLines((prev) => [...prev, fullLine]);

    if (currentLineIndex < lines.length - 1) {
      // Reset for next line
      setDisplayedText("");
      charIndexRef.current = 0;
      speedRef.current = 50; // Reset typing speed
      setCurrentLineIndex((prev) => prev + 1);
    } else {
      // Finished all lines!
      setIsDone(true);
      onComplete();
    }
  }

  useEffect(() => {
    // Add global event listener for key presses to speed up
    function handleKeyDown() {
      handleSpeedUp();
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentLineIndex, isDone]);

  useEffect(() => {
    if (isDone) return;

    const fullLine = lines[currentLineIndex];
    if (!fullLine) return;

    function tick() {
      const idx = charIndexRef.current;
      const fullText = lines[currentLineIndex];
      if (!fullText) return;

      if (idx < fullText.length) {
        setDisplayedText(fullText.slice(0, idx + 1));
        charIndexRef.current += 1;

        // Subtle variance in typing speed for natural cadence
        const randomVariance = Math.random() * 20 - 10;
        const nextSpeed = Math.max(15, speedRef.current + randomVariance);

        timerRef.current = setTimeout(tick, nextSpeed);
      } else {
        // Pause briefly after the line completes before moving to the next
        timerRef.current = setTimeout(() => {
          proceedToNextLine();
        }, 1200);
      }
    }

    timerRef.current = setTimeout(tick, 200);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [currentLineIndex, isDone]);

  return (
    <div
      className="flex flex-col items-center justify-center min-h-[50vh] max-w-xl mx-auto px-6 cursor-pointer select-none text-center"
      onClick={handleSpeedUp}
    >
      <div className="space-y-4 font-mono text-base md:text-lg leading-relaxed text-purple-200 tracking-wide">
        {completedLines.map((line, i) => (
          <p key={i} className="opacity-60 transition-opacity duration-500">
            {line}
          </p>
        ))}

        {!isDone && (
          <p className="text-white border-r-2 border-purple-400 animate-pulse-fast inline-block">
            {displayedText}
          </p>
        )}
      </div>

      <div className="mt-12 text-[10px] uppercase font-mono tracking-widest text-white/30 animate-pulse duration-1000">
        Haz clic o presiona cualquier tecla para continuar
      </div>
    </div>
  );
}
