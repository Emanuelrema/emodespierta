import { Renderer } from "../core/Renderer";
import { InputManager } from "../core/InputManager";
import { SceneBase } from "./SceneBase";
import { EventBus } from "../core/EventBus";

/**
 * BootScene — Splash screen shown while the game initializes.
 * Displays the EmoDespierta logo + "PRESS ANY KEY" prompt.
 * After a short pause, automatically transitions to the WorldScene.
 */
export class BootScene extends SceneBase {
  private elapsed = 0;
  private readonly AUTO_START_DELAY = 1.2; // seconds
  private alpha = 0;
  private dotCount = 0;
  private dotTimer = 0;

  constructor(renderer: Renderer, input: InputManager) {
    super(renderer, input);
  }

  create(): void {
    this.elapsed = 0;
    this.alpha = 0;
  }

  update(delta: number): void {
    this.elapsed += delta;

    // Fade in over 0.5 seconds
    this.alpha = Math.min(1, this.elapsed / 0.5);

    // Animate the dots
    this.dotTimer += delta;
    if (this.dotTimer > 0.4) {
      this.dotTimer = 0;
      this.dotCount = (this.dotCount + 1) % 4;
    }

    // Auto-advance to world after delay
    if (this.elapsed >= this.AUTO_START_DELAY) {
      EventBus.emit("scene:boot-complete");
    }
  }

  render(): void {
    const { width, height } = this.renderer;
    this.renderer.clear("#04040c");

    this.renderer.setAlpha(this.alpha);

    // Background stars (static, seeded)
    this.renderStars();

    // Central title
    this.renderer.fillText(
      "EMO",
      width / 2, height / 2 - 28,
      "#ff003c",
      `bold ${Math.round(height * 0.1)}px 'Courier New', monospace`,
      "center"
    );
    this.renderer.fillText(
      "DESPIERTA",
      width / 2, height / 2 + 10,
      "#ffe600",
      `bold ${Math.round(height * 0.05)}px 'Courier New', monospace`,
      "center"
    );

    // Loading dots
    const dots = ".".repeat(this.dotCount);
    this.renderer.fillText(
      `Cargando${dots}`,
      width / 2, height / 2 + 50,
      "rgba(255,255,255,0.5)",
      `${Math.round(height * 0.025)}px 'Courier New', monospace`,
      "center"
    );

    this.renderer.setAlpha(1);
  }

  private renderStars(): void {
    // Deterministic "random" stars using a simple seed
    const starData = [
      [0.1, 0.2], [0.3, 0.05], [0.5, 0.15], [0.7, 0.08], [0.9, 0.22],
      [0.15, 0.7], [0.4, 0.8], [0.6, 0.65], [0.85, 0.75], [0.25, 0.45],
      [0.55, 0.55], [0.75, 0.4], [0.08, 0.88], [0.92, 0.12], [0.48, 0.92],
    ];
    const { width, height } = this.renderer;
    starData.forEach(([rx, ry], i) => {
      const size = i % 3 === 0 ? 2 : 1;
      this.renderer.fillRect(
        rx * width, ry * height,
        size, size,
        "rgba(255,255,255,0.6)"
      );
    });
  }
}
