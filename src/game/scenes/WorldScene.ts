import { Renderer } from "../core/Renderer";
import { InputManager } from "../core/InputManager";
import { SceneBase } from "./SceneBase";
import { EventBus } from "../core/EventBus";
import { PhysicsEngine, type Rect } from "../physics/PhysicsEngine";
import { Animator } from "../animations/Animator";
import { ObstacleBase, type PlayerState } from "../obstacles/ObstacleBase";
import { SpiderWeb } from "../obstacles/SpiderWeb";
import { SpikeTrap } from "../obstacles/SpikeTrap";

// ─── Fixed game resolution ────────────────────────────────────────────────────

const GAME_W = 760;
const GAME_H = 475;

// ─── Player constants ─────────────────────────────────────────────────────────

const PLAYER_W    = 16;
const PLAYER_H    = 22;
const PLAYER_SPEED = 165;   // px/s horizontal (before slow factor)
const JUMP_VEL    = -580;   // px/s upward
const COYOTE_TIME = 0.083;  // seconds — grace after walking off ledge
const JUMP_BUFFER = 0.083;  // seconds — input remembered before landing

const INVINCIBLE_DURATION = 1.5; // seconds of post-hit invincibility
const MAX_HEALTH = 3;

// ─── World layout ─────────────────────────────────────────────────────────────
//
//                        [I]
//               ──────────────────
//    [E]                               [M]
//  ───────────                      ───────────
//       [L]                               [Y]
//    ────────                          ────────
//  ══════════════════════════════════════════ GROUND
//

const GROUND: Rect = { x: 0, y: 430, w: GAME_W, h: 45 };

interface Platform extends Rect { accentColor: string; }
const PLATFORMS: Platform[] = [
  { x: 30,  y: 370, w: 110, h: 12, accentColor: "#22d3ee" }, // L  (far left low)
  { x: 110, y: 295, w: 130, h: 12, accentColor: "#ff003c" }, // E  (left mid)
  { x: 300, y: 210, w: 160, h: 12, accentColor: "#8b5cf6" }, // I  (center high)
  { x: 520, y: 295, w: 130, h: 12, accentColor: "#ffe600" }, // M  (right mid)
  { x: 620, y: 370, w: 110, h: 12, accentColor: "#f97316" }, // Y  (far right low)
];
const ALL_SOLIDS: Rect[] = [GROUND, ...PLATFORMS];

// ─── Obstacle layout ──────────────────────────────────────────────────────────
//
// SpikeTrap positions sit ON the ground surface (y = GROUND.y - trap height).
// SpiderWeb positions sit just above the low platforms.

const OBSTACLE_DEFS = {
  spikes: [
    // Three spikes across the ground — gaps force the player to jump
    { x: 190, y: 414, w: 60, h: 16 },  // left of center
    { x: 340, y: 414, w: 80, h: 16 },  // center (widest — most dangerous)
    { x: 490, y: 414, w: 60, h: 16 },  // right of center
  ],
  webs: [
    // Webs hover just above the low platforms — player is slowed collecting L & Y
    { x: 30,  y: 352, w: 110, h: 24 }, // above L platform
    { x: 620, y: 352, w: 110, h: 24 }, // above Y platform
  ],
} as const;

// ─── Letter collectibles ──────────────────────────────────────────────────────

const PASSWORD_LETTERS = ["E", "M", "I", "L", "Y"] as const;
type PasswordLetter = (typeof PASSWORD_LETTERS)[number];

const LETTER_COLORS: Record<PasswordLetter, string> = {
  E: "#ff003c", M: "#ffe600", I: "#8b5cf6", L: "#22d3ee", Y: "#f97316",
};

const LETTER_SIZE   = 20;
const COLLECT_DIST  = 22;

interface LetterCollectible {
  letter: PasswordLetter;
  cx: number; cy: number;
  collected: boolean;
  glowColor: string;
  floatOffset: number;
}

function makeLetters(): LetterCollectible[] {
  return [
    { letter: "E", cx: 175, cy: 262, collected: false, glowColor: "#ff003c", floatOffset: 0 },
    { letter: "M", cx: 585, cy: 262, collected: false, glowColor: "#ffe600", floatOffset: Math.PI * 0.4 },
    { letter: "I", cx: 380, cy: 177, collected: false, glowColor: "#8b5cf6", floatOffset: Math.PI * 0.8 },
    { letter: "L", cx: 85,  cy: 337, collected: false, glowColor: "#22d3ee", floatOffset: Math.PI * 1.2 },
    { letter: "Y", cx: 675, cy: 337, collected: false, glowColor: "#f97316", floatOffset: Math.PI * 1.6 },
  ];
}

// ─── Particle ─────────────────────────────────────────────────────────────────

interface Particle {
  x: number; y: number;
  vx: number; vy: number;
  life: number; maxLife: number;
  color: string; size: number;
}

// ─── WorldScene ───────────────────────────────────────────────────────────────

/**
 * WorldScene — Side-scrolling platformer.
 *
 * Movement:  A/D or ←/→ to run, W/↑/Space to jump.
 * Obstacles: SpikeTrap (damage), SpiderWeb (slow).
 * Objective: Collect all 5 letters E·M·I·L·Y.
 */
export class WorldScene extends SceneBase {

  // ── Player physics ────────────────────────────────────────────────────────
  private px = 0; private py = 0;
  private pvx = 0; private pvy = 0;
  private pGrounded = false;
  private pWasGrounded = false;

  // ── Player health & obstacles ─────────────────────────────────────────────
  private pHealth = MAX_HEALTH;
  private pInvincible = false;
  private pInvincibleTimer = 0;
  private pSlowFactor = 1.0;

  // ── Jump mechanics ────────────────────────────────────────────────────────
  private coyoteTimer = 0;
  private jumpBufferTimer = 0;
  private jumpWasHeld = false;

  // ── Animation ─────────────────────────────────────────────────────────────
  private animator = new Animator();

  // ── Obstacles ─────────────────────────────────────────────────────────────
  private obstacles: ObstacleBase[] = [];

  // ── Letters & collectibles ────────────────────────────────────────────────
  private letters: LetterCollectible[] = [];
  private collectedLetters = new Set<PasswordLetter>();
  private particles: Particle[] = [];

  // ── Misc ──────────────────────────────────────────────────────────────────
  private elapsed = 0;
  private toast: { text: string; timer: number } | null = null;
  private readonly TOAST_DUR = 2.5;
  private victoryFired = false;

  constructor(renderer: Renderer, input: InputManager) {
    super(renderer, input);
  }

  // ── Lifecycle ─────────────────────────────────────────────────────────────

  create(): void {
    this.elapsed = 0;
    this.particles = [];
    this.collectedLetters = new Set();
    this.toast = null;
    this.victoryFired = false;

    // Player spawn above ground
    this.px = 80;
    this.py = GROUND.y - PLAYER_H - 1;
    this.pvx = 0; this.pvy = 0;
    this.pGrounded = true; this.pWasGrounded = true;
    this.pHealth = MAX_HEALTH;
    this.pInvincible = false; this.pInvincibleTimer = 0;
    this.pSlowFactor = 1.0;
    this.coyoteTimer = 0;
    this.jumpBufferTimer = 0;
    this.jumpWasHeld = false;

    this.animator = new Animator();
    this.letters = makeLetters();

    // Build obstacles
    this.obstacles = [
      ...OBSTACLE_DEFS.spikes.map((d) => new SpikeTrap(d.x, d.y, d.w, d.h)),
      ...OBSTACLE_DEFS.webs.map((d)   => new SpiderWeb(d.x, d.y, d.w, d.h)),
    ];
  }

  // ── Update ────────────────────────────────────────────────────────────────

  update(delta: number): void {
    this.elapsed += delta;

    // Reset slow factor; obstacles re-apply every frame
    this.pSlowFactor = 1.0;

    this.updateObstacles(delta);
    this.updatePlayer(delta);
    this.updateLetters(delta);
    this.updateParticles(delta);
    this.updateToast(delta);
    this.checkVictory();
    this.checkGameOver();
  }

  // ── Obstacle system ───────────────────────────────────────────────────────

  private updateObstacles(delta: number): void {
    // Build a mutable PlayerState snapshot
    const ps: PlayerState = {
      vx: this.pvx,
      vy: this.pvy,
      health: this.pHealth,
      maxHealth: MAX_HEALTH,
      invincible: this.pInvincible,
      slowFactor: this.pSlowFactor,
    };

    for (const obs of this.obstacles) {
      obs.update(delta, this.elapsed);

      // Check AABB overlap with player
      if (obs.overlaps(this.px, this.py, PLAYER_W, PLAYER_H)) {
        obs.applyEffect(ps);
      }
    }

    // Write back mutated state
    this.pHealth     = ps.health;
    this.pSlowFactor = ps.slowFactor;

    // Trigger invincibility window if obstacle caused a damage
    if (ps.invincible && !this.pInvincible) {
      this.pInvincible = true;
      this.pInvincibleTimer = INVINCIBLE_DURATION;
      this.spawnHurtParticles();
    }

    // Tick down invincibility timer
    if (this.pInvincible) {
      this.pInvincibleTimer -= delta;
      if (this.pInvincibleTimer <= 0) {
        this.pInvincible = false;
        this.pInvincibleTimer = 0;
      }
    }
  }

  // ── Player movement ───────────────────────────────────────────────────────

  private updatePlayer(delta: number): void {
    this.pWasGrounded = this.pGrounded;

    // Horizontal input — apply slow factor from obstacles
    let moveX = 0;
    if (this.input.isMovingLeft())  moveX -= 1;
    if (this.input.isMovingRight()) moveX += 1;
    this.pvx = moveX * PLAYER_SPEED * this.pSlowFactor;

    // Jump input — detect first press only (not hold)
    const jumpHeld = this.input.isJumpPressed();
    if (jumpHeld && !this.jumpWasHeld) {
      this.jumpBufferTimer = JUMP_BUFFER;
    }
    this.jumpWasHeld = jumpHeld;
    this.jumpBufferTimer = Math.max(0, this.jumpBufferTimer - delta);

    // Coyote time
    if (this.pGrounded) {
      this.coyoteTimer = COYOTE_TIME;
    } else {
      this.coyoteTimer = Math.max(0, this.coyoteTimer - delta);
    }

    // Execute jump
    if (this.jumpBufferTimer > 0 && this.coyoteTimer > 0) {
      this.pvy = JUMP_VEL;
      this.coyoteTimer   = 0;
      this.jumpBufferTimer = 0;
    }

    // Physics step
    const body = {
      x: this.px, y: this.py,
      w: PLAYER_W, h: PLAYER_H,
      vx: this.pvx, vy: this.pvy,
      grounded: this.pGrounded,
    };
    PhysicsEngine.step(body, ALL_SOLIDS, delta);
    this.px = body.x; this.py = body.y;
    this.pvx = body.vx; this.pvy = body.vy;
    this.pGrounded = body.grounded;

    // World bounds
    if (this.px < 0)                    { this.px = 0;                    this.pvx = 0; }
    if (this.px + PLAYER_W > GAME_W)    { this.px = GAME_W - PLAYER_W;    this.pvx = 0; }
    if (this.py + PLAYER_H > GAME_H)    { this.py = GAME_H - PLAYER_H;    this.pvy = 0; this.pGrounded = true; }

    // Animator
    this.animator.update(
      this.pvx, this.pvy,
      this.pGrounded, this.pWasGrounded,
      delta
    );
  }

  // ── Letters ───────────────────────────────────────────────────────────────

  private updateLetters(delta: number): void {
    const cx = this.px + PLAYER_W / 2;
    const cy = this.py + PLAYER_H / 2;

    for (const letter of this.letters) {
      if (letter.collected) continue;
      const fy = letter.cy + Math.sin(this.elapsed * 2 + letter.floatOffset) * 4;
      const dx = cx - letter.cx;
      const dy = cy - fy;
      if (Math.sqrt(dx * dx + dy * dy) < COLLECT_DIST) {
        this.collectLetter(letter);
      }
    }
  }

  private collectLetter(letter: LetterCollectible): void {
    letter.collected = true;
    this.collectedLetters.add(letter.letter);
    this.spawnParticles(letter.cx, letter.cy, letter.glowColor, 20);
    this.toast = {
      text: `✨ "${letter.letter}" encontrada!  ${this.collectedLetters.size}/5`,
      timer: this.TOAST_DUR,
    };
    EventBus.emit("letter:collect", letter.letter, this.collectedLetters.size);
  }

  // ── Particles ─────────────────────────────────────────────────────────────

  private spawnParticles(cx: number, cy: number, color: string, count: number): void {
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2 + Math.random() * 0.4;
      const speed = 50 + Math.random() * 90;
      this.particles.push({
        x: cx, y: cy,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 30,
        life: 0.5 + Math.random() * 0.4,
        maxLife: 1, color,
        size: 2 + Math.random() * 3,
      });
    }
  }

  private spawnHurtParticles(): void {
    const cx = this.px + PLAYER_W / 2;
    const cy = this.py + PLAYER_H / 2;
    for (let i = 0; i < 12; i++) {
      const angle = (i / 12) * Math.PI * 2;
      const speed = 40 + Math.random() * 60;
      this.particles.push({
        x: cx, y: cy,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 0.4 + Math.random() * 0.3,
        maxLife: 1, color: "#ff003c",
        size: 2 + Math.random() * 2,
      });
    }
  }

  private updateParticles(delta: number): void {
    for (const p of this.particles) {
      p.x  += p.vx * delta;
      p.y  += p.vy * delta;
      p.vy += 200 * delta;
      p.vx *= 0.95;
      p.life -= delta;
    }
    this.particles = this.particles.filter((p) => p.life > 0);
  }

  private updateToast(delta: number): void {
    if (!this.toast) return;
    this.toast.timer -= delta;
    if (this.toast.timer <= 0) this.toast = null;
  }

  private checkVictory(): void {
    if (!this.victoryFired && this.collectedLetters.size === PASSWORD_LETTERS.length) {
      this.victoryFired = true;
      EventBus.emit("scene:victory");
    }
  }

  private checkGameOver(): void {
    if (this.pHealth <= 0) {
      EventBus.emit("scene:gameover");
    }
  }

  // ── Render ────────────────────────────────────────────────────────────────

  render(): void {
    this.renderer.clear("#04040c");
    this.renderBackground();
    this.renderObstacles();
    this.renderPlatforms();
    this.renderLetters();
    this.renderParticles();
    this.renderPlayer();
    this.renderHUD();
    this.renderToast();
  }

  private renderBackground(): void {
    const stars: [number, number][] = [
      [48,22],[152,18],[310,40],[480,12],[620,30],
      [90,160],[250,130],[420,90],[570,145],[720,80],
      [30,260],[200,290],[380,240],[540,270],[700,250],
    ];
    for (let i = 0; i < stars.length; i++) {
      const [sx, sy] = stars[i]!;
      const t = 0.35 + 0.3 * Math.sin(this.elapsed * 1.8 + i * 1.1);
      this.renderer.fillRect(sx, sy, 1, 1, `rgba(255,255,255,${t.toFixed(2)})`);
    }

    const ctx = this.renderer.ctx;
    ctx.strokeStyle = "rgba(139,92,246,0.05)";
    ctx.lineWidth = 1;
    for (let x = 0; x < GAME_W; x += 40) {
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, GAME_H); ctx.stroke();
    }
    for (let y = 0; y < GAME_H; y += 40) {
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(GAME_W, y); ctx.stroke();
    }

    // Ground surface
    this.renderer.fillRectGlow(0, GROUND.y, GAME_W, 2, "rgba(139,92,246,0.5)", "#8b5cf6", 8);
    this.renderer.fillRect(0, GROUND.y, GAME_W, GROUND.h, "#08060f");
  }

  private renderObstacles(): void {
    for (const obs of this.obstacles) {
      obs.render(this.renderer, this.elapsed);
    }
  }

  private renderPlatforms(): void {
    for (const plat of PLATFORMS) {
      this.renderer.fillRect(plat.x, plat.y, plat.w, plat.h, "#0e0b1e");
      this.renderer.fillRectGlow(plat.x, plat.y, plat.w, 2, `${plat.accentColor}80`, plat.accentColor, 6);
      this.renderer.strokeRect(plat.x, plat.y, plat.w, plat.h, `${plat.accentColor}30`, 1);
    }
  }

  private renderLetters(): void {
    const t = this.elapsed;
    for (const letter of this.letters) {
      if (letter.collected) continue;
      const fy = letter.cy + Math.sin(t * 2 + letter.floatOffset) * 4;
      const lx = letter.cx - LETTER_SIZE / 2;
      const ly = fy - LETTER_SIZE / 2;
      const pulse = 0.15 + 0.08 * Math.sin(t * 3 + letter.floatOffset);
      this.renderer.fillRectGlow(lx, ly, LETTER_SIZE, LETTER_SIZE,
        `${letter.glowColor}${Math.round(pulse * 255).toString(16).padStart(2, "0")}`,
        letter.glowColor, 14
      );
      this.renderer.strokeRect(lx, ly, LETTER_SIZE, LETTER_SIZE, letter.glowColor, 1);
      this.renderer.fillText(letter.letter, letter.cx, fy + 5, letter.glowColor,
        "bold 12px 'Courier New', monospace", "center");
    }
  }

  private renderParticles(): void {
    for (const p of this.particles) {
      this.renderer.setAlpha(Math.max(0, p.life / p.maxLife));
      this.renderer.fillRect(p.x - p.size/2, p.y - p.size/2, p.size, p.size, p.color);
    }
    this.renderer.setAlpha(1);
  }

  private renderPlayer(): void {
    // Flicker while invincible (hide every other frame at ~20Hz)
    if (this.pInvincible && Math.sin(this.elapsed * 22) < 0) return;

    const info = this.animator.getDrawInfo();
    const drawX = Math.round(this.px + (PLAYER_W - info.w) / 2);
    const drawY = Math.round(this.py + PLAYER_H - info.h + info.offsetY);

    // Body
    this.renderer.fillRectGlow(drawX, drawY, info.w, info.h, info.color, info.glowColor, 10);

    // Eyes
    for (const eye of info.eyes) {
      this.renderer.fillRect(drawX + eye.dx - 1.5, drawY + eye.dy - 1.5, 3, 3, "#ffffff");
    }

    // Legs (run state only)
    for (const leg of info.legs) {
      this.renderer.fillRect(drawX + leg.dx, drawY + info.h + leg.dy, leg.w, leg.h, info.color);
    }

    // Ground dust while running
    if (this.animator.state === "run" && this.pGrounded) {
      const dustA = 0.2 + 0.15 * Math.sin(this.elapsed * 14);
      this.renderer.setAlpha(dustA);
      this.renderer.fillRect(drawX - 4, this.py + PLAYER_H - 1, info.w + 8, 3, info.glowColor);
      this.renderer.setAlpha(1);
    }
  }

  private renderHUD(): void {
    // ── Password tracker (top center) ──────────────────────────────────────
    const SPACING = 32;
    const totalW = PASSWORD_LETTERS.length * SPACING;
    const startX = GAME_W / 2 - totalW / 2 + SPACING / 2;
    const HUD_Y = 10;

    this.renderer.fillRect(startX - 20, HUD_Y - 6, totalW + 8, 24, "rgba(4,4,12,0.85)");
    this.renderer.strokeRect(startX - 20, HUD_Y - 6, totalW + 8, 24, "rgba(139,92,246,0.25)", 1);

    for (let i = 0; i < PASSWORD_LETTERS.length; i++) {
      const letter = PASSWORD_LETTERS[i]!;
      const lx = startX + i * SPACING;
      const isCollected = this.collectedLetters.has(letter);
      const col = LETTER_COLORS[letter];
      if (isCollected) {
        this.renderer.fillRectGlow(lx - 8, HUD_Y - 2, 16, 16, `${col}18`, col, 8);
        this.renderer.fillText(letter, lx, HUD_Y + 10, col, "bold 11px 'Courier New', monospace", "center");
      } else {
        this.renderer.fillText(letter, lx, HUD_Y + 10, "rgba(255,255,255,0.18)", "bold 11px 'Courier New', monospace", "center");
      }
    }

    // ── Health bar (top left) ───────────────────────────────────────────────
    const heartX = 10;
    const heartY = 10;
    for (let i = 0; i < MAX_HEALTH; i++) {
      const filled = i < this.pHealth;
      const hx = heartX + i * 18;

      if (filled) {
        // Filled heart — red glow
        const pulse = this.pInvincible
          ? 0.6 + 0.4 * Math.sin(this.elapsed * 20)
          : 1;
        this.renderer.setAlpha(pulse);
        this.renderer.fillRectGlow(hx, heartY, 14, 14, "#ff003c", "#ff003c", 8);
        this.renderer.fillText("♥", hx + 7, heartY + 11, "#ff003c", "11px sans-serif", "center");
        this.renderer.setAlpha(1);
      } else {
        // Empty heart — faded
        this.renderer.fillText("♡", hx + 7, heartY + 11, "rgba(255,0,60,0.25)", "11px sans-serif", "center");
      }
    }

    // ── Animator debug state (top right, very subtle) ──────────────────────
    this.renderer.fillText(
      this.animator.state,
      GAME_W - 8, HUD_Y + 10,
      "rgba(255,255,255,0.12)",
      "8px 'Courier New', monospace",
      "right"
    );

    // ── Controls hint (bottom center) ─────────────────────────────────────
    this.renderer.fillText(
      "← → mover  |  ↑ / W / Espacio  saltar",
      GAME_W / 2, GAME_H - 8,
      "rgba(255,255,255,0.22)",
      "9px 'Courier New', monospace",
      "center"
    );
  }

  private renderToast(): void {
    if (!this.toast) return;
    const t = this.toast.timer;
    const alpha = Math.min(1, Math.min(t / 0.3, (this.TOAST_DUR - t + 0.3) / 0.3));
    this.renderer.setAlpha(alpha);
    const TW = 270;
    const TX = (GAME_W - TW) / 2;
    const TY = GAME_H - 56;
    this.renderer.fillRect(TX, TY, TW, 26, "rgba(4,4,12,0.92)");
    this.renderer.strokeRect(TX, TY, TW, 26, "#ffe60070", 1);
    this.renderer.fillText(this.toast.text, GAME_W / 2, TY + 17,
      "#ffe600", "11px 'Courier New', monospace", "center");
    this.renderer.setAlpha(1);
  }
}
