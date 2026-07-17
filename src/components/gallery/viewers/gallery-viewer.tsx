"use client";

import React, { useState } from "react";
import { PixelIcon } from "@/components/ui/pixel-icon";
import { playClickSound, playHoverSound } from "@/lib/sounds";
import { motion, AnimatePresence } from "framer-motion";

interface GalleryViewerProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  images: string[];
}

export function GalleryViewer({ isOpen, onClose, title, images = [] }: GalleryViewerProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    playClickSound();
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    playClickSound();
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const handleClose = () => {
    playClickSound();
    onClose();
  };

  if (images.length === 0) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="absolute inset-0 bg-[#04040c]/90 backdrop-blur-sm"
          />

          {/* Lightbox Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className="relative z-10 w-full max-w-3xl max-h-[90vh] flex flex-col items-center justify-between border-4 border-border bg-card pixel-border p-6"
          >
            {/* Header / Info bar */}
            <div className="w-full flex items-center justify-between pb-3 border-b-4 border-border select-none mb-4">
              <div>
                <h3 className="text-sm font-heading font-bold text-white uppercase tracking-wider">{title}</h3>
                <p className="text-[10px] font-sans font-semibold text-primary mt-0.5">
                  {currentIndex + 1} de {images.length}
                </p>
              </div>
              <button
                className="h-8 w-8 flex items-center justify-center border-2 border-border text-foreground hover:border-primary hover:text-primary transition-colors focus:outline-none cursor-pointer"
                onClick={handleClose}
                onMouseEnter={playHoverSound}
                aria-label="Cerrar galería"
              >
                <PixelIcon name="close" size={14} />
              </button>
            </div>

            {/* Main Image View */}
            <div className="relative flex-1 w-full h-[50vh] flex items-center justify-center group select-none">
              {/* Left Nav Button */}
              <button
                onClick={handlePrev}
                onMouseEnter={playHoverSound}
                className="absolute left-2 z-20 flex h-10 w-12 items-center justify-center border-2 border-border bg-card font-heading font-bold text-lg text-white hover:border-primary hover:text-primary transition-all focus:outline-none cursor-pointer"
                aria-label="Imagen anterior"
              >
                &lt;
              </button>

              {/* Image Frame */}
              <div className="w-full h-full p-2 flex items-center justify-center">
                <AnimatePresence mode="wait">
                  <motion.img
                    key={currentIndex}
                    src={images[currentIndex]}
                    initial={{ opacity: 0, scale: 0.97 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.97 }}
                    transition={{ duration: 0.2 }}
                    className="max-w-full max-h-full object-contain border-2 border-border shadow-2xl"
                    alt={`Imagen ${currentIndex + 1}`}
                  />
                </AnimatePresence>
              </div>

              {/* Right Nav Button */}
              <button
                onClick={handleNext}
                onMouseEnter={playHoverSound}
                className="absolute right-2 z-20 flex h-10 w-12 items-center justify-center border-2 border-border bg-card font-heading font-bold text-lg text-white hover:border-primary hover:text-primary transition-all focus:outline-none cursor-pointer"
                aria-label="Siguiente imagen"
              >
                &gt;
              </button>
            </div>

            {/* Thumbnail Navigation Indicators */}
            <div className="w-full flex items-center justify-center gap-2 mt-4 overflow-x-auto py-2 scrollbar-none">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    playClickSound();
                    setCurrentIndex(idx);
                  }}
                  onMouseEnter={playHoverSound}
                  className={`relative h-10 w-14 overflow-hidden border-2 transition-all shrink-0 cursor-pointer ${
                    idx === currentIndex
                      ? "border-primary scale-105"
                      : "border-border opacity-50 hover:opacity-100"
                  }`}
                >
                  <img src={img} className="h-full w-full object-cover" alt="miniatura" />
                </button>
              ))}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
