/**
 * InputManager — Keyboard input handler for the game.
 * Tracks which keys are currently held down (not just pressed once).
 * Also handles arrow keys, WASD, and action keys.
 * Must be attached and detached to the window via init() / destroy().
 */
export type Direction = "up" | "down" | "left" | "right";

export class InputManager {
  private keys: Set<string> = new Set();
  private boundKeyDown: (e: KeyboardEvent) => void;
  private boundKeyUp: (e: KeyboardEvent) => void;

  constructor() {
    this.boundKeyDown = this.onKeyDown.bind(this);
    this.boundKeyUp = this.onKeyUp.bind(this);
  }

  init(): void {
    window.addEventListener("keydown", this.boundKeyDown);
    window.addEventListener("keyup", this.boundKeyUp);
  }

  destroy(): void {
    window.removeEventListener("keydown", this.boundKeyDown);
    window.removeEventListener("keyup", this.boundKeyUp);
    this.keys.clear();
  }

  private onKeyDown(e: KeyboardEvent): void {
    // Prevent page scrolling from arrow keys + space while game is focused
    if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", " "].includes(e.key)) {
      e.preventDefault();
    }
    this.keys.add(e.key.toLowerCase());
  }

  private onKeyUp(e: KeyboardEvent): void {
    this.keys.delete(e.key.toLowerCase());
  }

  isDown(key: string): boolean {
    return this.keys.has(key.toLowerCase());
  }

  // Convenience helpers for movement
  isMovingUp(): boolean {
    return this.isDown("arrowup") || this.isDown("w");
  }

  isMovingDown(): boolean {
    return this.isDown("arrowdown") || this.isDown("s");
  }

  isMovingLeft(): boolean {
    return this.isDown("arrowleft") || this.isDown("a");
  }

  isMovingRight(): boolean {
    return this.isDown("arrowright") || this.isDown("d");
  }

  isActionPressed(): boolean {
    return this.isDown("enter") || this.isDown(" ") || this.isDown("z");
  }

  /** Jump — Space, W, or ArrowUp */
  isJumpPressed(): boolean {
    return this.isDown(" ") || this.isDown("w") || this.isDown("arrowup");
  }
}
