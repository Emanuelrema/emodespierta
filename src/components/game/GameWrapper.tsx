"use client";

import { useRef, useEffect } from "react";
import { GameCanvas } from "./GameCanvas";
import { useGameState } from "@/game/hooks/useGameState";
import { EventBus } from "@/game/core/EventBus";
import { EndingScene } from "./EndingScene";

/**
 * GameWrapper — Full game section embedded in the page.
 *
 * Contains:
 *   1. The <GameCanvas /> — pixel-art game
 *   2. Victory overlay  — triggers EndingScene for transition
 *   3. Game Over overlay — retry button on death
 *   4. Mobile controls  — platformer D-pad + jump button
 */
export function GameWrapper({ onUnlock }: { onUnlock: () => void }) {
  const gameState = useGameState();

  // Automatically trigger victory scene if cheat parameter is present
  useEffect(() => {
    if (typeof window !== "undefined" && window.location.search.includes("cheat=victory")) {
      const t = setTimeout(() => {
        EventBus.emit("scene:victory"); // switches canvas scene to victory
        EventBus.emit("game:victory");  // triggers react ending scene
      }, 1000);
      return () => clearTimeout(t);
    }
  }, []);

  // Expose a helper to easily trigger victory/ending scene from browser console
  if (typeof window !== "undefined") {
    (window as any).triggerVictory = () => {
      EventBus.emit("scene:victory"); 
      EventBus.emit("game:victory");  
    };
  }

  function handleRetry() {
    EventBus.emit("game:restart");
  }

  // If victory is achieved, render the emotional transition scene
  if (gameState.isVictory) {
    return <EndingScene onUnlock={onUnlock} />;
  }

  return (
    <section
      id="emodespierta-game"
      className="game-wrapper"
      aria-label="Minijuego EmoDespierta"
    >
      {/* Title */}
      <div className="game-header">
        <p className="game-subtitle">
          🔑 Encuentra <strong>E · M · I · L · Y</strong> — esquiva trampas y telarañas
        </p>
      </div>

      {/* Canvas */}
      <div className="game-canvas-container">
        <GameCanvas />

        {/* Game Over overlay */}
        {gameState.isGameOver && (
          <div className="game-overlay game-overlay--gameover">
            <button id="game-retry-btn" onClick={handleRetry} className="game-retry-btn">
              ↩ Intentar de nuevo
            </button>
          </div>
        )}
      </div>

      {/* ── Mobile Controls ─────────────────────────────────────────────────
          Hidden on desktop (≥640px). Layout:
            Left section:   [←]  [→]
            Right section:       [JUMP]
      ──────────────────────────────────────────────────────────────────── */}
      <div className="game-controls" role="group" aria-label="Controles táctiles">
        {/* Movement buttons */}
        <div className="game-controls__move">
          <TouchBtn keyCode="ArrowLeft"  label="←" className="game-btn game-btn--move" />
          <TouchBtn keyCode="ArrowRight" label="→" className="game-btn game-btn--move" />
        </div>

        {/* Jump button — separate, large, right side */}
        <div className="game-controls__action">
          <TouchBtn keyCode=" " label="↑" className="game-btn game-btn--jump" />
        </div>
      </div>
    </section>
  );
}

// ─── Touch Button ─────────────────────────────────────────────────────────────

interface TouchBtnProps {
  keyCode: string;
  label: string;
  className: string;
}

/**
 * TouchBtn — fires repeated keyboard events while held.
 * Uses pointer events (works with both touch and mouse).
 */
function TouchBtn({ keyCode, label, className }: TouchBtnProps) {
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  function fireKey(code: string, type: "keydown" | "keyup") {
    window.dispatchEvent(new KeyboardEvent(type, { key: code, bubbles: true }));
  }

  function startHold() {
    fireKey(keyCode, "keydown");
    intervalRef.current = setInterval(() => fireKey(keyCode, "keydown"), 60);
  }

  function endHold() {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    fireKey(keyCode, "keyup");
  }

  return (
    <button
      className={className}
      onPointerDown={startHold}
      onPointerUp={endHold}
      onPointerLeave={endHold}
      onPointerCancel={endHold}
      aria-label={`Botón ${label}`}
    >
      {label}
    </button>
  );
}
