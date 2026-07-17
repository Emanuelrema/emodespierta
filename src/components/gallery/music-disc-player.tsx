"use client";

import React, { useRef, useState, useEffect } from "react";
import { PixelIcon } from "@/components/ui/pixel-icon";
import { playVinylSound, playClickSound, playHoverSound } from "@/lib/sounds";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface MusicDiscPlayerProps {
  musicUrl: string;
  musicTitle: string;
  artistName: string;
  themeColor: string;
}

export function MusicDiscPlayer({ musicUrl, musicTitle, artistName, themeColor }: MusicDiscPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, []);

  const togglePlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
      playVinylSound(); // Sound effect of needle hitting vinyl
    }
    setIsPlaying(!isPlaying);
  };

  const handleEnded = () => {
    setIsPlaying(false);
  };

  return (
    <div className="flex flex-col items-center sm:flex-row gap-6 p-6 border-4 border-border bg-card pixel-border max-w-md mx-auto w-full">
      <audio ref={audioRef} src={musicUrl} onEnded={handleEnded} />

      {/* Vinyl Record Visual */}
      <div className="relative shrink-0 cursor-pointer" onClick={togglePlay} onMouseEnter={playHoverSound}>
        <motion.div
          animate={isPlaying ? { rotate: 360 } : { rotate: 0 }}
          transition={isPlaying ? { duration: 12, repeat: Infinity, ease: "linear" } : { duration: 0.5 }}
          className="relative w-28 h-28 rounded-full bg-zinc-950 shadow-xl border-4 border-zinc-900 flex items-center justify-center select-none vinyl-grooves"
        >
          {/* Center Label (Spider Logo) */}
          <div className="w-12 h-12 rounded-full border-2 border-primary bg-zinc-900 flex items-center justify-center text-primary glow-spider">
            <PixelIcon name="spider" size={20} />
          </div>

          {/* Center Hole */}
          <div className="absolute w-2 h-2 rounded-full bg-[#04040c] border border-zinc-950" />
        </motion.div>

        {/* Small arm styling indicator */}
        <motion.div 
          animate={isPlaying ? { rotate: 25 } : { rotate: 0 }}
          transition={{ type: "spring", stiffness: 100 }}
          className="absolute -top-1 -right-2 w-6 h-10 border-l-2 border-t-2 border-primary rounded-tl-md origin-top-left pointer-events-none" 
        />
      </div>

      {/* Title & Control Text */}
      <div className="flex-1 min-w-0 text-center sm:text-left flex flex-col gap-3">
        <div>
          <span className="text-[10px] font-heading uppercase tracking-widest text-primary font-bold">Tema de Fondo</span>
          <h4 className="text-base font-heading font-bold truncate mt-0.5 text-white">{musicTitle}</h4>
          <p className="text-xs text-muted-foreground font-sans truncate">Por {artistName}</p>
        </div>

        {/* Toggle Play Button */}
        <div>
          <button
            onClick={togglePlay}
            onMouseEnter={playHoverSound}
            className={cn(
              "flex items-center gap-2 border-2 px-4 py-1.5 text-xs font-heading uppercase tracking-wider transition-colors cursor-pointer",
              isPlaying 
                ? "bg-primary/20 text-primary border-primary glow-spider" 
                : "bg-card text-foreground border-border hover:border-primary hover:text-primary"
            )}
          >
            <PixelIcon name={isPlaying ? "pause" : "play"} size={12} />
            {isPlaying ? "Pausar Música" : "Escuchar"}
          </button>
        </div>
      </div>
    </div>
  );
}
