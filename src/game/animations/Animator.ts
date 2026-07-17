/**
 * Animator — Placeholder animation state machine.
 * No sprite sheets — uses squash & stretch on geometric shapes.
 *
 * States: idle | run | jump | fall | land
 *
 * Returns a `DrawInfo` object each frame that the renderer uses
 * to draw the player with the correct dimensions and color.
 */

export type AnimState = "idle" | "run" | "jump" | "fall" | "land";

export interface DrawInfo {
  /** Width of the drawn body rectangle */
  w: number;
  /** Height of the drawn body rectangle */
  h: number;
  /** Vertical offset from foot position (negative = shift up) */
  offsetY: number;
  /** Fill color of the body */
  color: string;
  /** Glow color for shadow */
  glowColor: string;
  /**
   * Eye positions relative to the TOP-LEFT of the draw rect.
   * Each element is {dx, dy} in pixels.
   */
  eyes: Array<{ dx: number; dy: number }>;
  /**
   * Optional leg rectangles relative to BOTTOM-LEFT of draw rect.
   * Only non-empty in the 'run' state.
   */
  legs: Array<{ dx: number; dy: number; w: number; h: number }>;
}

/** Base player proportions (the "rest" size) */
const BASE_W = 16;
const BASE_H = 22;

export class Animator {
  state: AnimState = "idle";
  facing: 1 | -1 = 1; // 1 = right, -1 = left
  timer = 0;
  private landTimer = 0;

  /**
   * Called every frame. Updates internal state based on physics state.
   *
   * @param vx — current horizontal velocity
   * @param vy — current vertical velocity
   * @param grounded — whether the body is on the ground this frame
   * @param wasGrounded — whether grounded last frame (for land detection)
   * @param delta — seconds since last frame
   */
  update(
    vx: number,
    vy: number,
    grounded: boolean,
    wasGrounded: boolean,
    delta: number
  ): void {
    this.timer += delta;

    // Update facing direction (only when actually moving)
    if (Math.abs(vx) > 5) {
      this.facing = vx > 0 ? 1 : -1;
    }

    // Land flash: trigger a brief squash animation on touchdown
    if (!wasGrounded && grounded) {
      this.landTimer = 0.1; // 100ms land squash
    }
    if (this.landTimer > 0) {
      this.landTimer = Math.max(0, this.landTimer - delta);
    }

    // State priority: land > airborne > move > idle
    if (this.landTimer > 0) {
      this.state = "land";
    } else if (!grounded) {
      this.state = vy < -30 ? "jump" : "fall";
    } else if (Math.abs(vx) > 5) {
      this.state = "run";
    } else {
      this.state = "idle";
    }
  }

  /** Returns the draw info for the current frame. */
  getDrawInfo(): DrawInfo {
    const t = this.timer;
    const f = this.facing; // 1=right, -1=left

    switch (this.state) {
      // ─────────────────────────────────────────
      case "idle": {
        // Gentle breathing: subtle oscillation in height
        const breathe = Math.sin(t * 1.8) * 0.8;
        const w = BASE_W;
        const h = BASE_H + breathe;
        return {
          w, h,
          offsetY: -breathe * 0.5,
          color: "#c084fc",
          glowColor: "#8b5cf6",
          eyes: eyesFor(w, h, f),
          legs: [],
        };
      }

      // ─────────────────────────────────────────
      case "run": {
        // Forward lean: slightly wider, shorter, with alternating legs
        const phase = Math.sin(t * 14); // run cycle
        const bob = phase * 1.5;
        const w = BASE_W + 2;
        const h = BASE_H - 2;
        const legH1 = 5 + (phase > 0 ? 3 : 0); // front leg longer
        const legH2 = 5 + (phase < 0 ? 3 : 0); // back leg longer

        // Legs positioned to the left or right based on facing
        const legDx1 = f === 1 ? 2 : w - 7;   // leading leg
        const legDx2 = f === 1 ? w - 7 : 2;   // trailing leg

        return {
          w, h,
          offsetY: bob,
          color: "#a855f7",
          glowColor: "#8b5cf6",
          eyes: eyesFor(w, h, f),
          legs: [
            { dx: legDx1, dy: 0, w: 5, h: legH1 },
            { dx: legDx2, dy: 0, w: 5, h: legH2 },
          ],
        };
      }

      // ─────────────────────────────────────────
      case "jump": {
        // Stretch tall and thin — "going up" compression
        const w = BASE_W - 4;
        const h = BASE_H + 7;
        return {
          w, h,
          offsetY: -5,
          color: "#ddd6fe",
          glowColor: "#8b5cf6",
          eyes: eyesFor(w, h, f),
          legs: [],
        };
      }

      // ─────────────────────────────────────────
      case "fall": {
        // Wide and flatter — "falling" spread
        const w = BASE_W + 5;
        const h = BASE_H - 3;
        return {
          w, h,
          offsetY: 2,
          color: "#9333ea",
          glowColor: "#8b5cf6",
          eyes: eyesFor(w, h, f),
          legs: [],
        };
      }

      // ─────────────────────────────────────────
      case "land": {
        // Very squashed wide — impact flash (yellow glow)
        const landProgress = 1 - this.landTimer / 0.1; // 0→1 as land fades
        const w = BASE_W + 10 * (1 - landProgress);
        const h = BASE_H - 8 * (1 - landProgress);
        return {
          w, h,
          offsetY: 6 * (1 - landProgress),
          color: "#ffe600",
          glowColor: "#ffe600",
          eyes: eyesFor(w, h, f),
          legs: [],
        };
      }
    }
  }
}

/**
 * Calculate eye positions based on body dimensions and facing direction.
 * Eyes are returned as {dx, dy} relative to draw rect top-left.
 */
function eyesFor(
  w: number,
  h: number,
  facing: 1 | -1
): Array<{ dx: number; dy: number }> {
  const eyeY = h * 0.32;
  // Eyes cluster toward the front face
  if (facing === 1) {
    return [
      { dx: w * 0.52, dy: eyeY },
      { dx: w * 0.76, dy: eyeY },
    ];
  } else {
    return [
      { dx: w * 0.24, dy: eyeY },
      { dx: w * 0.48, dy: eyeY },
    ];
  }
}
