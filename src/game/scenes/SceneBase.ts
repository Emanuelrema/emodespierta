import { Renderer } from "../core/Renderer";
import { InputManager } from "../core/InputManager";

/**
 * SceneBase — Abstract base class for all game scenes.
 * Every scene receives the renderer and input manager from the Game.
 */
export abstract class SceneBase {
  protected renderer: Renderer;
  protected input: InputManager;

  constructor(renderer: Renderer, input: InputManager) {
    this.renderer = renderer;
    this.input = input;
  }

  /** Called once when the scene is first loaded. */
  abstract create(): void;

  /**
   * Called every frame with the time delta in seconds.
   * @param delta — seconds since last frame (capped at 0.1s to prevent spiral-of-death on tab focus)
   */
  abstract update(delta: number): void;

  /** Called every frame after update. Draw everything here. */
  abstract render(): void;

  /** Called when the scene is being removed. Clean up timers, refs, etc. */
  destroy(): void {
    // Default: no-op. Subclasses override if needed.
  }
}
