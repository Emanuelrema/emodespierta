import type { Renderer } from "../core/Renderer";

// ─── Player state exposed to obstacles ───────────────────────────────────────

/**
 * PlayerState — Mutable slice of player state that obstacles can read and modify.
 * Obstacles receive this every frame via applyEffect().
 */
export interface PlayerState {
  vx: number;
  vy: number;
  health: number;
  maxHealth: number;
  /** True while the player is in post-hit invincibility frames. */
  invincible: boolean;
  /**
   * Speed multiplier applied this frame (1.0 = normal, 0.35 = webbed).
   * Reset to 1.0 at the start of each update tick.
   * Obstacles set this to a lower value when the player overlaps them.
   */
  slowFactor: number;
}

// ─── ObstacleBase ────────────────────────────────────────────────────────────

/**
 * ObstacleBase — Abstract base for every obstacle in the game.
 *
 * ╔══════════════════════════════════════════════════════════════════╗
 * ║  HOW TO REPLACE A PLACEHOLDER WITH FINAL PIXEL ART             ║
 * ║                                                                  ║
 * ║  1. Load your sprite PNG in BootScene (AssetLoader).           ║
 * ║  2. Override  renderSprite(renderer, elapsed)  in the subclass. ║
 * ║  3. Set  this.hasSprite = true  in the subclass constructor.   ║
 * ║  4. Delete renderPlaceholder() from the subclass.              ║
 * ║                                                                  ║
 * ║  The obstacle's size (x, y, w, h) stays the same —            ║
 * ║  only the visual rendering changes.                            ║
 * ╚══════════════════════════════════════════════════════════════════╝
 */
export abstract class ObstacleBase {
  readonly x: number;
  readonly y: number;
  readonly w: number;
  readonly h: number;

  /**
   * Set this to TRUE in the subclass constructor when final pixel art is ready.
   * Switches from renderPlaceholder() to renderSprite() automatically.
   */
  protected hasSprite = false;

  constructor(x: number, y: number, w: number, h: number) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
  }

  // ── Lifecycle ─────────────────────────────────────────────────────────────

  /**
   * Optional per-frame update (animated obstacles override this).
   * @param _delta — seconds since last frame
   * @param _elapsed — total elapsed seconds since scene start
   */
  update(_delta: number, _elapsed: number): void {
    // Default: static obstacle, no update needed.
  }

  /**
   * Master render method — routes to sprite OR placeholder automatically.
   * Do NOT override this method. Override renderSprite() or renderPlaceholder().
   */
  render(renderer: Renderer, elapsed: number): void {
    if (this.hasSprite) {
      this.renderSprite(renderer, elapsed);
    } else {
      this.renderPlaceholder(renderer, elapsed);
    }
  }

  // ── To be implemented by subclasses ───────────────────────────────────────

  /**
   * Draw the FINAL pixel art sprite.
   * Override this when the artwork is ready, then set hasSprite = true.
   * Example:
   *   ctx.drawImage(mySprite, this.x, this.y, this.w, this.h);
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  protected renderSprite(_renderer: Renderer, _elapsed: number): void {
    // TODO: implement with ctx.drawImage(sprite, this.x, this.y, this.w, this.h)
  }

  /**
   * Draw the PLACEHOLDER (geometric shapes).
   * This is what renders until the pixel art replaces it.
   * Include a tiny debug label so it's easy to identify during development.
   */
  protected abstract renderPlaceholder(renderer: Renderer, elapsed: number): void;

  /**
   * Apply this obstacle's effect to the player when they overlap.
   * Called every frame the player is inside the obstacle's bounds.
   * @param player — mutable player state (modify in-place)
   */
  abstract applyEffect(player: PlayerState): void;

  // ── Utilities ─────────────────────────────────────────────────────────────

  /** AABB overlap test with a player-sized rect */
  overlaps(rx: number, ry: number, rw: number, rh: number): boolean {
    return (
      rx      < this.x + this.w &&
      rx + rw > this.x          &&
      ry      < this.y + this.h &&
      ry + rh > this.y
    );
  }
}
