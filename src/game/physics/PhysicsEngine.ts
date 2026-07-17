/**
 * PhysicsEngine — Axis-Aligned Bounding Box (AABB) collision resolution.
 * Separated into two independent passes (X then Y) to prevent corner-stuck bugs.
 *
 * This engine is stateless — it operates on a plain body object each frame.
 */

export const GRAVITY = 900;       // px/s²
export const MAX_FALL_SPEED = 620; // px/s terminal velocity

export interface Rect {
  x: number;
  y: number;
  w: number;
  h: number;
}

export interface PhysicsBody extends Rect {
  vx: number;
  vy: number;
  grounded: boolean;
}

function overlaps(body: PhysicsBody, solid: Rect): boolean {
  return (
    body.x         < solid.x + solid.w &&
    body.x + body.w > solid.x          &&
    body.y         < solid.y + solid.h &&
    body.y + body.h > solid.y
  );
}

export class PhysicsEngine {
  /**
   * Integrate one physics step for a single body against a list of solid rects.
   * Mutates the body object in-place.
   */
  static step(body: PhysicsBody, solids: Rect[], delta: number): void {
    // 1. Apply gravity (only when airborne)
    if (!body.grounded) {
      body.vy = Math.min(body.vy + GRAVITY * delta, MAX_FALL_SPEED);
    }

    // 2. Reset grounded flag — will be re-set during Y collision pass
    body.grounded = false;

    // ── X PASS ──────────────────────────────────────────────────
    body.x += body.vx * delta;

    for (const solid of solids) {
      if (!overlaps(body, solid)) continue;

      if (body.vx > 0) {
        body.x = solid.x - body.w;
      } else if (body.vx < 0) {
        body.x = solid.x + solid.w;
      }
      body.vx = 0;
    }

    // ── Y PASS ──────────────────────────────────────────────────
    body.y += body.vy * delta;

    for (const solid of solids) {
      if (!overlaps(body, solid)) continue;

      if (body.vy >= 0) {
        // Landing on top of platform
        body.y = solid.y - body.h;
        body.vy = 0;
        body.grounded = true;
      } else {
        // Hitting underside of platform
        body.y = solid.y + solid.h;
        body.vy = 0;
      }
    }
  }
}
