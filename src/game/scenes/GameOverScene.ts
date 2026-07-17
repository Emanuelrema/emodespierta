import { Renderer } from "../core/Renderer";
import { InputManager } from "../core/InputManager";
import { SceneBase } from "./SceneBase";
import { EventBus } from "../core/EventBus";

/**
 * GameOverScene — Shown when the player loses.
 * (Currently a placeholder since there's no damage mechanic yet.)
 * Emits "game:over" so React can show a retry button.
 */
export class GameOverScene extends SceneBase {
  private elapsed = 0;
  private signalled = false;

  create(): void {
    this.elapsed = 0;
    this.signalled = false;
  }

  update(delta: number): void {
    this.elapsed += delta;
    if (this.elapsed > 0.5 && !this.signalled) {
      this.signalled = true;
      EventBus.emit("game:over");
    }
  }

  render(): void {
    const { width, height } = this.renderer;
    this.renderer.clear("#04040c");

    const alpha = Math.min(1, this.elapsed * 2);
    this.renderer.setAlpha(alpha);

    this.renderer.fillText(
      "GAME OVER",
      width / 2, height / 2 - 20,
      "#ff003c",
      `bold ${Math.round(height * 0.07)}px 'Courier New', monospace`,
      "center"
    );
    this.renderer.fillText(
      "Inténtalo de nuevo",
      width / 2, height / 2 + 24,
      "rgba(255,255,255,0.6)",
      `${Math.round(height * 0.025)}px 'Courier New', monospace`,
      "center"
    );

    this.renderer.setAlpha(1);
  }
}
