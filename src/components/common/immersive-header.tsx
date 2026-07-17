"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { PixelIcon } from "@/components/ui/pixel-icon";
import { playClickSound, playHoverSound, getMuteState, setMuteState } from "@/lib/sounds";

export function ImmersiveHeader() {
  const [muted, setMuted] = useState(false);

  useEffect(() => {
    setMuted(getMuteState());
  }, []);

  const toggleMuted = () => {
    const newState = !muted;
    setMuted(newState);
    setMuteState(newState);
    if (!newState) {
      // Play a quick test click if unmuted
      setTimeout(() => playClickSound(), 50);
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-background/40 backdrop-blur-md border-b border-border/50 transition-all duration-300">
      <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link 
          href="/" 
          className="flex items-center gap-2 group cursor-pointer"
          onMouseEnter={playHoverSound}
          onClick={playClickSound}
        >
          <div className="flex h-8 w-8 items-center justify-center bg-primary text-white shadow-md shadow-primary/20 group-hover:scale-105 transition-transform duration-300 image-rendering-pixelated">
            <PixelIcon name="spider" size={18} />
          </div>
          <span className="font-heading font-bold text-xl tracking-tight text-white group-hover:text-primary transition-colors duration-300">
            🕷️💌 EmoDespierta
          </span>
        </Link>

        <div className="flex items-center gap-4">
          {/* Retro Pixel Art Sound Control */}
          <button
            onClick={toggleMuted}
            onMouseEnter={playHoverSound}
            className="flex h-10 w-10 items-center justify-center border-2 border-border bg-card text-foreground hover:border-primary hover:text-primary focus:outline-none transition-colors cursor-pointer"
            title={muted ? "Activar Sonido" : "Silenciar"}
            aria-label={muted ? "Activar Sonido" : "Silenciar"}
          >
            <PixelIcon name={muted ? "sound-off" : "sound-on"} size={20} />
          </button>
        </div>
      </div>
    </header>
  );
}
