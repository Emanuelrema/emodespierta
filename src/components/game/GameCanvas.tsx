"use client";

import { useRef } from "react";
import { useGame } from "@/game/hooks/useGame";

/**
 * GameCanvas — The raw <canvas> element that the game engine renders into.
 * This component is intentionally minimal: it owns the canvas ref and
 * passes it to useGame(). All visual styling is done by the parent wrapper.
 */
export function GameCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useGame(canvasRef);

  return (
    <canvas
      ref={canvasRef}
      id="emodespierta-game-canvas"
      style={{
        display: "block",
        width: "100%",
        height: "100%",
        imageRendering: "pixelated",
        cursor: "default",
      }}
      aria-label="EmoDespierta Minijuego"
    />
  );
}
