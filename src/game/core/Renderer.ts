/**
 * Renderer — Thin abstraction over the canvas 2D context.
 * Centralises all drawing calls so scenes don't touch the canvas directly.
 * All coordinates are in world-space unless noted as screen-space.
 */
export class Renderer {
  readonly canvas: HTMLCanvasElement;
  readonly ctx: CanvasRenderingContext2D;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Could not get 2D canvas context");
    this.ctx = ctx;
    // Crisp pixel rendering — essential for the pixel-art aesthetic
    this.ctx.imageSmoothingEnabled = false;
  }

  get width(): number { return this.canvas.width; }
  get height(): number { return this.canvas.height; }

  clear(color = "#04040c"): void {
    this.ctx.fillStyle = color;
    this.ctx.fillRect(0, 0, this.width, this.height);
  }

  fillRect(
    x: number, y: number,
    w: number, h: number,
    color: string
  ): void {
    this.ctx.fillStyle = color;
    this.ctx.fillRect(Math.round(x), Math.round(y), w, h);
  }

  strokeRect(
    x: number, y: number,
    w: number, h: number,
    color: string,
    lineWidth = 2
  ): void {
    this.ctx.strokeStyle = color;
    this.ctx.lineWidth = lineWidth;
    this.ctx.strokeRect(Math.round(x) + 0.5, Math.round(y) + 0.5, w - 1, h - 1);
  }

  fillText(
    text: string,
    x: number, y: number,
    color: string,
    font = "bold 14px 'Courier New', monospace",
    align: CanvasTextAlign = "left"
  ): void {
    this.ctx.fillStyle = color;
    this.ctx.font = font;
    this.ctx.textAlign = align;
    this.ctx.fillText(text, Math.round(x), Math.round(y));
    this.ctx.textAlign = "left"; // reset
  }

  /**
   * Draw a glowing rectangle — used for collectibles and player.
   * The glow is simulated with a shadowBlur (resets after drawing).
   */
  fillRectGlow(
    x: number, y: number,
    w: number, h: number,
    color: string,
    glowColor: string,
    glowBlur = 12
  ): void {
    this.ctx.shadowColor = glowColor;
    this.ctx.shadowBlur = glowBlur;
    this.fillRect(x, y, w, h, color);
    this.ctx.shadowBlur = 0;
    this.ctx.shadowColor = "transparent";
  }

  /**
   * Save/restore context state for transformed drawing.
   */
  save(): void { this.ctx.save(); }
  restore(): void { this.ctx.restore(); }

  translate(x: number, y: number): void {
    this.ctx.translate(Math.round(x), Math.round(y));
  }

  setAlpha(alpha: number): void {
    this.ctx.globalAlpha = alpha;
  }
}
