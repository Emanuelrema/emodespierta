import { Renderer } from "../core/Renderer";
import { InputManager } from "../core/InputManager";
import { SceneBase } from "./SceneBase";
import { EventBus } from "../core/EventBus";

/**
 * VictoryScene — Shown after the player collects all 5 letters.
 * Displays the completed word "EMILY" with dramatic animation,
 * then signals React to show the password input overlay.
 */
export class VictoryScene extends SceneBase {
  private elapsed = 0;
  private letterRevealTimers: number[] = [0, 0, 0, 0, 0];
  private readonly LETTERS = ["E", "M", "I", "L", "Y"] as const;
  private readonly COLORS = ["#ff003c", "#ffe600", "#8b5cf6", "#22d3ee", "#f97316"] as const;
  private signalledReact = false;
  private particles: Array<{
    x: number; y: number; vx: number; vy: number;
    color: string; life: number; size: number;
  }> = [];

  create(): void {
    this.elapsed = 0;
    this.letterRevealTimers = [0, 0, 0, 0, 0];
    this.signalledReact = false;
    this.spawnConfetti();
  }

  private spawnConfetti(): void {
    const { width, height } = this.renderer;
    for (let i = 0; i < 80; i++) {
      this.particles.push({
        x: Math.random() * width,
        y: Math.random() * height * 0.3,
        vx: (Math.random() - 0.5) * 60,
        vy: 40 + Math.random() * 80,
        color: ["#ff003c", "#ffe600", "#8b5cf6", "#22d3ee", "#f97316"][i % 5],
        life: 3 + Math.random() * 2,
        size: 3 + Math.random() * 4,
      });
    }
  }

  update(delta: number): void {
    this.elapsed += delta;

    // Stagger reveal of each letter
    for (let i = 0; i < 5; i++) {
      const targetTime = i * 0.25;
      if (this.elapsed > targetTime) {
        this.letterRevealTimers[i] = Math.min(1, this.letterRevealTimers[i] + delta * 4);
      }
    }

    // Update confetti
    for (const p of this.particles) {
      p.x += p.vx * delta;
      p.y += p.vy * delta;
      p.vy += 20 * delta; // gravity
      p.life -= delta;
    }
    this.particles = this.particles.filter((p) => p.life > 0);

    // Signal React to show password input after letters are all revealed
    if (this.elapsed > 2.5 && !this.signalledReact) {
      this.signalledReact = true;
      EventBus.emit("game:victory");
    }
  }

  render(): void {
    const { width, height } = this.renderer;
    this.renderer.clear("#04040c");

    // Dark overlay fade in
    const alpha = Math.min(0.85, this.elapsed * 2);
    this.renderer.setAlpha(alpha);
    this.renderer.fillRect(0, 0, width, height, "#04040c");
    this.renderer.setAlpha(1);

    // Confetti
    for (const p of this.particles) {
      const a = Math.min(1, p.life / 2);
      this.renderer.setAlpha(a);
      this.renderer.fillRect(p.x, p.y, p.size, p.size, p.color);
    }
    this.renderer.setAlpha(1);

    // "¡LO LOGRASTE!" header
    const headerAlpha = Math.min(1, Math.max(0, this.elapsed - 0.2) * 3);
    this.renderer.setAlpha(headerAlpha);
    this.renderer.fillText(
      "¡LO LOGRASTE!",
      width / 2, height / 2 - 70,
      "#ffffff",
      `bold ${Math.round(height * 0.04)}px 'Courier New', monospace`,
      "center"
    );
    this.renderer.setAlpha(1);

    // Animated letter reveal
    const spacing = 52;
    const totalW = 5 * spacing;
    const startX = (width - totalW) / 2 + spacing / 2;
    const cy = height / 2 - 10;

    this.LETTERS.forEach((letter, i) => {
      const t = this.letterRevealTimers[i];
      if (t <= 0) return;

      const scale = 0.5 + t * 0.5; // scale from 50% to 100%
      const lx = startX + i * spacing;
      const boxSize = Math.round(36 * scale);
      const color = this.COLORS[i];

      this.renderer.setAlpha(t);
      this.renderer.fillRectGlow(
        lx - boxSize / 2, cy - boxSize / 2,
        boxSize, boxSize,
        `${color}22`, color, 18
      );
      this.renderer.strokeRect(lx - boxSize / 2, cy - boxSize / 2, boxSize, boxSize, color, 2);
      this.renderer.fillText(letter, lx, cy + 7 * scale, color, `bold ${Math.round(18 * scale)}px 'Courier New', monospace`, "center");
      this.renderer.setAlpha(1);
    });

    // Subtitle prompt (appears after all letters are shown)
    const subAlpha = Math.min(1, Math.max(0, this.elapsed - 2) * 2);
    this.renderer.setAlpha(subAlpha);
    this.renderer.fillText(
      "Ingresa la contraseña para continuar ↓",
      width / 2, height / 2 + 60,
      "rgba(255,255,255,0.7)",
      `${Math.round(height * 0.022)}px 'Courier New', monospace`,
      "center"
    );
    this.renderer.setAlpha(1);
  }
}
