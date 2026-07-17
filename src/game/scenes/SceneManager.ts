import { Renderer } from "../core/Renderer";
import { InputManager } from "../core/InputManager";
import { SceneBase } from "./SceneBase";
import { EventBus } from "../core/EventBus";

type SceneFactory = (renderer: Renderer, input: InputManager) => SceneBase;

/**
 * SceneManager — Handles transitions between game scenes.
 * Scenes are registered by name and instantiated lazily.
 * A fade overlay is drawn during transitions.
 */
export class SceneManager {
  private renderer: Renderer;
  private input: InputManager;
  private scenes: Map<string, SceneFactory> = new Map();
  private current: SceneBase | null = null;
  private currentName = "";

  // Fade transition state
  private fadeAlpha = 0;
  private fadeDirection: "in" | "out" | "none" = "none";
  private fadeSpeed = 3; // alpha units per second
  private pendingScene: string | null = null;

  constructor(renderer: Renderer, input: InputManager) {
    this.renderer = renderer;
    this.input = input;
  }

  register(name: string, factory: SceneFactory): void {
    this.scenes.set(name, factory);
  }

  start(name: string): void {
    this.switchTo(name);
  }

  switchTo(name: string): void {
    if (this.currentName === name) return;

    if (this.current) {
      // Start fade-out, then switch when complete
      this.fadeDirection = "out";
      this.pendingScene = name;
    } else {
      this.loadScene(name);
      this.fadeDirection = "in";
    }
  }

  private loadScene(name: string): void {
    this.current?.destroy();
    const factory = this.scenes.get(name);
    if (!factory) throw new Error(`Scene "${name}" not registered`);
    this.current = factory(this.renderer, this.input);
    this.currentName = name;
    this.current.create();
    EventBus.emit("scene:change", name);
  }

  update(delta: number): void {
    // Handle fade transition
    if (this.fadeDirection === "out") {
      this.fadeAlpha = Math.min(1, this.fadeAlpha + this.fadeSpeed * delta);
      if (this.fadeAlpha >= 1 && this.pendingScene) {
        this.loadScene(this.pendingScene);
        this.pendingScene = null;
        this.fadeDirection = "in";
      }
    } else if (this.fadeDirection === "in") {
      this.fadeAlpha = Math.max(0, this.fadeAlpha - this.fadeSpeed * delta);
      if (this.fadeAlpha <= 0) {
        this.fadeDirection = "none";
      }
    }

    this.current?.update(delta);
  }

  render(): void {
    this.current?.render();

    // Draw fade overlay on top of everything
    if (this.fadeAlpha > 0) {
      this.renderer.setAlpha(this.fadeAlpha);
      this.renderer.fillRect(0, 0, this.renderer.width, this.renderer.height, "#04040c");
      this.renderer.setAlpha(1);
    }
  }
}
