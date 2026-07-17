import { ObstacleBase, type PlayerState } from "./ObstacleBase";
import type { Renderer } from "../core/Renderer";

/** Pixels per spike tooth */
const SPIKE_TOOTH_W = 10;
/** Height of the spike tips above the base rect */
const SPIKE_TIP_H = 10;

/**
 * SpikeTrap — Contact obstacle that deals 1 heart of damage.
 * Player becomes invincible for 1.5s after being hit.
 * Does NOT block movement — player passes through but gets hurt.
 *
 * Placeholder visual:
 *   · Dark red base rectangle
 *   · Row of pulsing red triangular spikes across the top
 *   · Tiny "SPIKE" debug label
 *
 * ╔════════════════════════════════════════════╗
 * ║  TO REPLACE WITH PIXEL ART:               ║
 * ║  1. Load your spikes sprite in BootScene. ║
 * ║  2. Override renderSprite().              ║
 * ║  3. Set this.hasSprite = true.            ║
 * ║  The sprite should tile horizontally      ║
 * ║  across the full width of the trap.       ║
 * ╚════════════════════════════════════════════╝
 */
export class SpikeTrap extends ObstacleBase {
  constructor(x: number, y: number, w: number, h: number) {
    super(x, y, w, h);
    // Uncomment when sprite is ready:
    // this.hasSprite = true;
  }

  /** Deal 1 heart of damage if player is not invincible */
  applyEffect(player: PlayerState): void {
    if (!player.invincible) {
      player.health = Math.max(0, player.health - 1);
      player.invincible = true; // WorldScene resets this after the cooldown
    }
  }

  protected renderPlaceholder(renderer: Renderer, elapsed: number): void {
    const { x, y, w, h } = this;

    const baseY = y + SPIKE_TIP_H;
    const baseH = h - SPIKE_TIP_H;

    // Base rectangle
    renderer.fillRect(x, baseY, w, baseH, "#180808");
    renderer.strokeRect(x, baseY, w, baseH, "rgba(239,68,68,0.3)", 1);

    // Pulsing spike glow
    const glow = 0.7 + 0.3 * Math.sin(elapsed * 4);
    const ctx = renderer.ctx;
    ctx.save();
    ctx.fillStyle   = `rgba(239,68,68,${glow.toFixed(2)})`;
    ctx.strokeStyle = `rgba(255,120,120,${glow.toFixed(2)})`;
    ctx.lineWidth = 1;

    const count = Math.floor(w / SPIKE_TOOTH_W);
    for (let i = 0; i < count; i++) {
      const sx = x + i * SPIKE_TOOTH_W;
      ctx.beginPath();
      ctx.moveTo(sx,                    y + SPIKE_TIP_H); // bottom-left
      ctx.lineTo(sx + SPIKE_TOOTH_W / 2, y);              // tip
      ctx.lineTo(sx + SPIKE_TOOTH_W,    y + SPIKE_TIP_H); // bottom-right
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
    }
    ctx.restore();

    // Debug label
    if (baseH > 8) {
      renderer.fillText(
        "SPIKE",
        x + w / 2, baseY + baseH / 2 + 3,
        "rgba(239,68,68,0.4)",
        "7px 'Courier New', monospace",
        "center"
      );
    }
  }
}
