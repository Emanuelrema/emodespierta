"use client";

import { useState, useEffect } from "react";
import { GameWrapper } from "@/components/game/GameWrapper";
import { PersonaCard } from "@/components/gallery/persona-card";
import type { Persona } from "@/types";

const STORAGE_KEY = "emodespierta-unlocked";

interface AppGateProps {
  personas: Persona[];
}

/**
 * AppGate — Client component that determines what to show:
 *   - If the game has been completed (localStorage) → Gallery
 *   - Otherwise → Minigame (required to unlock the gallery)
 *
 * Renders null during hydration to avoid SSR mismatch on localStorage reads.
 */
export function AppGate({ personas }: AppGateProps) {
  const [unlocked, setUnlocked] = useState<boolean | null>(null); // null = loading

  useEffect(() => {
    console.log("AppGate useEffect mounting");
    try {
      // Allow force-resetting the game state via URL parameter (e.g. http://localhost:3000/?reset=true)
      if (typeof window !== "undefined" && window.location.search.includes("reset=true")) {
        localStorage.clear();
        console.log("Game state force-reset via URL parameter");
      }
      
      const stored = localStorage.getItem(STORAGE_KEY);
      console.log("AppGate storage check:", stored);
      setUnlocked(stored === "true");
    } catch (e) {
      console.warn("Storage access failed, defaulting to locked", e);
      setUnlocked(false);
    }
  }, []);

  function handleUnlock() {
    try {
      localStorage.setItem(STORAGE_KEY, "true");
    } catch (e) {
      console.warn("Storage write failed", e);
    }
    setUnlocked(true);
  }

  console.log("AppGate rendering, unlocked state:", unlocked);

  // While checking localStorage, show nothing (avoids flash)
  if (unlocked === null) {
    console.log("AppGate returning null (loading)");
    return null;
  }

  if (!unlocked) {
    return <GameWrapper onUnlock={handleUnlock} />;
  }

  return (
    <div className="space-y-16 py-16 animate-in fade-in duration-700">
      {/* Gallery header */}
      <div className="text-center max-w-2xl mx-auto space-y-4 px-6">
        <h1 className="text-4xl sm:text-6xl font-heading tracking-tight leading-tight text-white select-none text-glitch">
          💌 Mensajes para Emo
        </h1>
        <p className="text-sm sm:text-base text-muted-foreground font-sans max-w-lg mx-auto leading-relaxed">
          Un rincón especial de recuerdos, música y palabras dedicadas con cariño para celebrar tu día. Abre cada sobre para descubrir su contenido.
        </p>
      </div>

      {/* Persona cards */}
      <div className="flex flex-col gap-12 max-w-2xl mx-auto px-6 pb-20">
        {personas.map((persona) => (
          <PersonaCard key={persona.id} persona={persona} />
        ))}
      </div>
    </div>
  );
}
