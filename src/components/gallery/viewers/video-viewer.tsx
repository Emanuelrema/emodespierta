"use client";

import React, { useRef, useEffect } from "react";
import { PixelIcon } from "@/components/ui/pixel-icon";
import { playClickSound, playHoverSound } from "@/lib/sounds";
import { motion, AnimatePresence } from "framer-motion";

interface VideoViewerProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  videoUrl: string;
}

export function VideoViewer({ isOpen, onClose, title, videoUrl }: VideoViewerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  // Pause video when modal closes
  useEffect(() => {
    if (!isOpen && videoRef.current) {
      videoRef.current.pause();
    }
  }, [isOpen]);

  const handleClose = () => {
    playClickSound();
    onClose();
  };

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

          {/* Video Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className="relative z-10 w-full max-w-2xl overflow-hidden border-4 border-border bg-card pixel-border flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b-4 border-border bg-zinc-950/60 select-none">
              <h3 className="text-sm font-heading font-bold text-white uppercase tracking-wider">{title}</h3>
              <button
                className="h-8 w-8 flex items-center justify-center border-2 border-border text-foreground hover:border-primary hover:text-primary transition-colors focus:outline-none cursor-pointer"
                onClick={handleClose}
                onMouseEnter={playHoverSound}
                aria-label="Cerrar video"
              >
                <PixelIcon name="close" size={14} />
              </button>
            </div>

            {/* Video Player */}
            <div className="relative aspect-video bg-black flex items-center justify-center border-t-2 border-border/10">
              <video
                ref={videoRef}
                src={videoUrl}
                controls
                autoPlay
                className="w-full h-full object-contain"
              />
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
