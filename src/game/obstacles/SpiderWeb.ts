import { ObstacleBase, type PlayerState } from "./ObstacleBase";
import type { Renderer } from "../core/Renderer";

/** Speed multiplier applied while inside the web */
const SLOW_FACTOR = 0.35;

/**
 * SpiderWeb — A semi-transparent area that slows the player.
 * Does NOT deal damage. Only reduces horizontal speed.
 *
 * Placeholder visual:
 *   · Dark purple transparent background
 *   · Diagonal crosshatch lines (web strands)
 *   · Tiny "WEB" debug label
 *
 * ╔══════════════════════════════════════════╗
 * ║  TO REPLACE WITH PIXEL ART:             ║
 * ║  1. Load your web sprite in BootScene.  ║
 * ║  2. Override renderSprite().            ║
 * ║  3. Set this.hasSprite = true.          ║
 * ║  The sprite should tile horizontally    ║
 * ║  if the web is wider than one tile.     ║
 * ╚══════════════════════════════════════════╝
 */
export class SpiderWeb extends ObstacleBase {
  constructor(x: number, y: number, w: number, h: number) {
    super(x, y, w, h);
    // Uncomment when sprite is ready:
    // this.hasSprite = true;
  }

  /** Reduce horizontal speed while player is inside */
  applyEffect(player: PlayerState): void {
    player.slowFactor = Math.min(player.slowFactor, SLOW_FACTOR);
  }

  protected renderPlaceholder(renderer: Renderer, elapsed: number): void {
    const { x, y, w, h } = this;

    // Breathing opacity
    const alpha = 0.18 + 0.06 * Math.sin(elapsed * 1.8);

    // Fill
    renderer.fillRect(x, y, w, h, `rgba(88,28,135,${alpha.toFixed(2)})`);

    // Border
    renderer.strokeRect(x, y, w, h, "rgba(139,92,246,0.5)", 1);

    // Diagonal web strands (//)
    const ctx = renderer.ctx;
    ctx.save();
    ctx.strokeStyle = `rgba(139,92,246,${(alpha * 1.4).toFixed(2)})`;
    ctx.lineWidth = 1;
    ctx.beginPath();
    const step = 10;
    for (let i = -h; i <= w; i += step) {
      ctx.moveTo(x + i,     y + h);
      ctx.lineTo(x + i + h, y);
    }
    // Diagonal web strands (\\)
    for (let i = -h; i <= w; i += step) {
      ctx.moveTo(x + i,     y);
      ctx.lineTo(x + i + h, y + h);
    }
    ctx.stroke();
    ctx.restore();

    // Debug label
    renderer.fillText(
      "WEB",
      x + w / 2, y + h / 2 + 3,
      "rgba(167,139,250,0.6)",
      "7px 'Courier New', monospace",
      "center"
    );
  }
}
