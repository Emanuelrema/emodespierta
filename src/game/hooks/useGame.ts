"use client";

import { useEffect, useRef } from "react";
import { Game } from "../core/Game";

/**
 * The game's internal (logical) resolution.
 * CSS scales the canvas element to fill its container while this stays fixed.
 * `image-rendering: pixelated` on the canvas element keeps edges crisp.
 */
export const GAME_WIDTH = 760;
export const GAME_HEIGHT = 475;

/**
 * useGame — Mounts and destroys the Game engine on a canvas element.
 * Sets a fixed logical resolution and lets CSS handle display scaling.
 */
export function useGame(canvasRef: React.RefObject<HTMLCanvasElement | null>) {
  const gameRef = useRef<Game | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Fixed logical resolution — CSS will scale via width:100% + aspect-ratio
    canvas.width = GAME_WIDTH;
    canvas.height = GAME_HEIGHT;

    const game = new Game(canvas);
    gameRef.current = game;
    game.start();

    return () => {
      game.stop();
      gameRef.current = null;
    };
  }, [canvasRef]);

  return gameRef;
}
