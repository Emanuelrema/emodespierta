import { Renderer } from "./Renderer";
import { InputManager } from "./InputManager";
import { EventBus } from "./EventBus";
import { SceneManager } from "../scenes/SceneManager";
import { BootScene } from "../scenes/BootScene";
import { WorldScene } from "../scenes/WorldScene";
import { VictoryScene } from "../scenes/VictoryScene";
import { GameOverScene } from "../scenes/GameOverScene";

/**
 * Game — The main orchestrator.
 * Owns the game loop (requestAnimationFrame), renderer, input, and scene manager.
 * Created and destroyed by the useGame() React hook.
 */
export class Game {
  private renderer: Renderer;
  private input: InputManager;
  private sceneManager: SceneManager;
  private rafId: number | null = null;
  private lastTime: number | null = null;
  private isRunning = false;

  constructor(canvas: HTMLCanvasElement) {
    this.renderer = new Renderer(canvas);
    this.input = new InputManager();
    this.sceneManager = new SceneManager(this.renderer, this.input);

    // Register all scenes
    this.sceneManager.register("boot", (r, i) => new BootScene(r, i));
    this.sceneManager.register("world", (r, i) => new WorldScene(r, i));
    this.sceneManager.register("victory", (r, i) => new VictoryScene(r, i));
    this.sceneManager.register("gameover", (r, i) => new GameOverScene(r, i));

    // Wire up scene transitions via EventBus
    this.setupEventListeners();
  }

  private setupEventListeners(): void {
    EventBus.on("scene:boot-complete", () => {
      this.sceneManager.switchTo("world");
    });

    EventBus.on("scene:victory", () => {
      this.sceneManager.switchTo("victory");
    });

    EventBus.on("scene:gameover", () => {
      this.sceneManager.switchTo("gameover");
    });

    EventBus.on("game:restart", () => {
      this.sceneManager.switchTo("world");
    });
  }

  start(): void {
    if (this.isRunning) return;
    this.isRunning = true;
    this.input.init();
    this.sceneManager.start("boot");
    this.rafId = requestAnimationFrame(this.loop.bind(this));
  }

  stop(): void {
    this.isRunning = false;
    if (this.rafId !== null) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
    this.input.destroy();
    EventBus.clear();
    this.lastTime = null;
  }

  private loop(timestamp: number): void {
    if (!this.isRunning) return;

    if (this.lastTime === null) this.lastTime = timestamp;
    // Cap delta to 100ms to prevent spiral-of-death on tab switch
    const delta = Math.min((timestamp - this.lastTime) / 1000, 0.1);
    this.lastTime = timestamp;

    this.sceneManager.update(delta);
    this.sceneManager.render();

    this.rafId = requestAnimationFrame(this.loop.bind(this));
  }

  /** Resize the canvas when the container changes size */
  resize(width: number, height: number): void {
    this.renderer.canvas.width = width;
    this.renderer.canvas.height = height;
  }
}
