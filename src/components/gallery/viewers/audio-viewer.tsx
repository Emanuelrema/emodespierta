"use client";

import React, { useRef, useState, useEffect } from "react";
import { PixelIcon } from "@/components/ui/pixel-icon";
import { playClickSound, playHoverSound } from "@/lib/sounds";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface AudioViewerProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  audioUrl: string;
  sender: string;
}

export function AudioViewer({ isOpen, onClose, title, audioUrl, sender }: AudioViewerProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState("0:00");
  const [duration, setDuration] = useState("0:00");

  // Reset playback when modal is toggled
  useEffect(() => {
    if (!isOpen && audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  }, [isOpen]);

  const togglePlay = () => {
    playClickSound();
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleTimeUpdate = () => {
    if (!audioRef.current) return;
    const current = audioRef.current.currentTime;
    const total = audioRef.current.duration || 0;
    if (total > 0) {
      setProgress((current / total) * 100);
    }
    setCurrentTime(formatTime(current));
  };

  const handleLoadedMetadata = () => {
    if (!audioRef.current) return;
    setDuration(formatTime(audioRef.current.duration));
  };

  const handleAudioEnded = () => {
    setIsPlaying(false);
    setProgress(0);
    setCurrentTime("0:00");
  };

  const formatTime = (secs: number) => {
    const minutes = Math.floor(secs / 60);
    const seconds = Math.floor(secs % 60);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  const handleProgressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!audioRef.current) return;
    const newProgress = parseFloat(e.target.value);
    const total = audioRef.current.duration || 0;
    audioRef.current.currentTime = (newProgress / 100) * total;
    setProgress(newProgress);
  };

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

          {/* Audio Container */}
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.95 }}
            className="relative z-10 w-full max-w-md overflow-hidden border-4 border-border bg-card pixel-border p-6 shadow-2xl flex flex-col items-center gap-6"
          >
            {/* Close */}
            <div className="absolute top-4 right-4">
              <button
                className="h-8 w-8 flex items-center justify-center border-2 border-border text-foreground hover:border-primary hover:text-primary transition-colors focus:outline-none cursor-pointer"
                onClick={handleClose}
                onMouseEnter={playHoverSound}
                aria-label="Cerrar audio"
              >
                <PixelIcon name="close" size={14} />
              </button>
            </div>

            <audio
              ref={audioRef}
              src={audioUrl}
              onTimeUpdate={handleTimeUpdate}
              onLoadedMetadata={handleLoadedMetadata}
              onEnded={handleAudioEnded}
            />

            {/* Vocal Icon Header */}
            <div className="mt-4 flex flex-col items-center gap-2 text-center select-none">
              <div className="flex h-16 w-16 items-center justify-center border-2 border-border bg-zinc-950/60 text-primary">
                <PixelIcon name="audio" size={32} />
              </div>
              <div>
                <span className="text-[10px] font-heading font-bold uppercase tracking-widest text-primary">Mensaje de Voz</span>
                <h3 className="text-lg font-heading font-bold mt-1 text-white">{title}</h3>
                <p className="text-xs text-muted-foreground font-sans">De parte de: {sender}</p>
              </div>
            </div>

            {/* Simulated Voice Waveform */}
            <div className="w-full flex justify-center items-center h-12 gap-[3px] px-4 select-none">
              {Array.from({ length: 24 }).map((_, i) => (
                <motion.div
                  key={i}
                  animate={
                    isPlaying
                      ? { height: [8, Math.random() * 32 + 8, 8] }
                      : { height: 8 }
                  }
                  transition={
                    isPlaying
                      ? {
                          duration: 1 + Math.random(),
                          repeat: Infinity,
                          ease: "easeInOut",
                        }
                      : {}
                  }
                  className="w-1.5 bg-primary/45"
                  style={{ height: 8 }}
                />
              ))}
            </div>

            {/* Controls & Progress bar */}
            <div className="w-full space-y-4">
              {/* Slider */}
              <div className="space-y-1">
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="0.1"
                  value={progress}
                  onChange={handleProgressChange}
                  className="w-full h-2 bg-muted border border-border appearance-none cursor-pointer accent-primary"
                />
                <div className="flex items-center justify-between text-[10px] font-sans font-semibold text-muted-foreground">
                  <span>{currentTime}</span>
                  <span>{duration}</span>
                </div>
              </div>

              {/* Play Button */}
              <div className="flex justify-center">
                <button
                  onClick={togglePlay}
                  onMouseEnter={playHoverSound}
                  className="h-14 w-14 border-4 border-border hover:border-primary bg-card text-primary flex items-center justify-center cursor-pointer transition-all hover:scale-105 select-none pixel-border glow-spider"
                  aria-label={isPlaying ? "Pausar" : "Reproducir"}
                >
                  <PixelIcon name={isPlaying ? "pause" : "play"} size={20} />
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
