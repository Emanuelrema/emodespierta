"use client";

import React, { useState, useEffect } from "react";
import { PixelIcon } from "@/components/ui/pixel-icon";
import { playPaperSound, playClickSound, playHoverSound } from "@/lib/sounds";
import { motion, AnimatePresence } from "framer-motion";

interface LetterViewerProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  text: string;
  sender: string;
}

// Typewriter text wrapper component
function Typewriter({ text, speed = 20 }: { text: string; speed?: number }) {
  const [displayed, setDisplayed] = useState("");

  useEffect(() => {
    let index = 0;
    setDisplayed("");
    const interval = setInterval(() => {
      setDisplayed((prev) => prev + text.charAt(index));
      index++;
      if (index >= text.length) {
        clearInterval(interval);
      }
    }, speed);

    return () => clearInterval(interval);
  }, [text, speed]);

  return <p className="font-sans text-sm sm:text-base leading-relaxed text-stone-850 whitespace-pre-line italic">{displayed}</p>;
}

export function LetterViewer({ isOpen, onClose, title, text, sender }: LetterViewerProps) {
  useEffect(() => {
    if (isOpen) {
      playPaperSound(); // Sound when sheet falls open
    }
  }, [isOpen]);

  const handleClose = () => {
    playPaperSound();
    setTimeout(() => {
      onClose();
    }, 100);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="absolute inset-0 bg-[#04040c]/85 backdrop-blur-sm"
          />

          {/* Letter Container (Falling Sheet of Paper) */}
          <motion.div
            initial={{ y: "-100vh", opacity: 0, rotate: -8 }}
            animate={{ 
              y: 0, 
              opacity: 1, 
              rotate: 0,
              transition: {
                type: "spring",
                damping: 14,
                stiffness: 100
              } 
            }}
            exit={{ 
              y: "100vh", 
              opacity: 0, 
              rotate: 8,
              transition: { duration: 0.5, ease: "easeIn" }
            }}
            className="relative z-10 w-full max-w-lg overflow-hidden border-4 border-amber-900/40 paper-texture shadow-2xl p-8 sm:p-10 max-h-[85vh] flex flex-col my-8 select-none"
          >
            {/* Close button (Pixel Art X) */}
            <div className="absolute top-4 right-4">
              <button
                className="h-8 w-8 flex items-center justify-center border-2 border-amber-900/30 text-amber-950 hover:bg-amber-900/10 transition-colors focus:outline-none cursor-pointer"
                onClick={handleClose}
                onMouseEnter={playHoverSound}
                aria-label="Cerrar carta"
              >
                <PixelIcon name="close" size={14} />
              </button>
            </div>

            {/* Letter Layout */}
            <div className="flex-1 overflow-y-auto pr-2 mt-4 space-y-6 scrollbar-thin">
              <div className="border-b border-amber-900/20 pb-4 text-center">
                <span className="text-[10px] font-heading font-bold uppercase tracking-widest text-amber-900/80">Recuerdo Escrito</span>
                <h3 className="text-xl font-heading font-bold mt-1 text-amber-950">{title}</h3>
              </div>

              {/* Body text with typewriter effect */}
              <div className="pl-4 border-l-2 border-amber-900/30">
                <Typewriter text={text} />
              </div>

              <div className="text-right pt-4 font-heading text-md font-bold text-amber-900">
                — De parte de: {sender}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
