"use client";

import { useEffect, useState } from "react";
import { EventBus } from "../core/EventBus";

type PasswordLetter = "E" | "M" | "I" | "L" | "Y";

export interface GameState {
  scene: string;
  collectedLetters: PasswordLetter[];
  isVictory: boolean;
  isGameOver: boolean;
}

const INITIAL_STATE: GameState = {
  scene: "boot",
  collectedLetters: [],
  isVictory: false,
  isGameOver: false,
};

/**
 * useGameState — Subscribes to EventBus events and exposes reactive game state to React.
 * This is the ONLY way React components should read game state.
 * The game engine never imports React.
 */
export function useGameState(): GameState {
  const [state, setState] = useState<GameState>(INITIAL_STATE);

  useEffect(() => {
    const unsubs: Array<() => void> = [];

    unsubs.push(
      EventBus.on("scene:change", (name) => {
        setState((prev) => ({ ...prev, scene: name as string }));
      })
    );

    unsubs.push(
      EventBus.on("letter:collect", (letter, count) => {
        setState((prev) => ({
          ...prev,
          collectedLetters: [...prev.collectedLetters, letter as PasswordLetter],
        }));
      })
    );

    unsubs.push(
      EventBus.on("game:victory", () => {
        setState((prev) => ({ ...prev, isVictory: true }));
      })
    );

    unsubs.push(
      EventBus.on("game:over", () => {
        setState((prev) => ({ ...prev, isGameOver: true }));
      })
    );

    unsubs.push(
      EventBus.on("game:restart", () => {
        setState({ ...INITIAL_STATE, scene: "world" });
      })
    );

    return () => unsubs.forEach((u) => u());
  }, []);

  return state;
}
