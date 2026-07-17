"use client";

import { useEffect, useRef } from "react";

interface FireworkParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  size: number;
  life: number;
  maxLife: number;
  alpha: number;
  gravity: number;
}

interface Rocket {
  x: number;
  y: number;
  tx: number;
  ty: number;
  vy: number;
  color: string;
  size: number;
  active: boolean;
}

interface FireworksProps {
  onExplode?: () => void;
}

const FIREWORK_COLORS = [
  "#ff0055", // Spider-Verse pink-red
  "#ffe600", // Yellow
  "#8b5cf6", // Purple
  "#22d3ee", // Cyan
  "#f97316", // Orange
  "#10b981", // Emerald
];

/**
 * Fireworks — Renders high performance, elegant firework explosions using HTML5 Canvas.
 * Spawns launches and explosions periodically, with particles fading and falling.
 * Triggers sound callback on detonation.
 */
export function Fireworks({ onExplode }: FireworksProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let particles: FireworkParticle[] = [];
    let rockets: Rocket[] = [];
    let launchTimer = 0;

    function resize() {
      if (!canvas) return;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }

    function createExplosion(x: number, y: number, color: string) {
      // Elegant soft explosions: fewer particles with longer decay
      const pCount = 50 + Math.floor(Math.random() * 30);
      for (let i = 0; i < pCount; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 150 + 40;
        const maxLife = 1.0 + Math.random() * 0.8;

        particles.push({
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          color,
          size: Math.random() * 2.2 + 0.8,
          life: maxLife,
          maxLife,
          alpha: 1.0,
          gravity: 50 + Math.random() * 40,
        });
      }

      // Play sound
      if (onExplode) onExplode();
    }

    function launchRocket() {
      if (!canvas) return;
      const startX = Math.random() * (canvas.width * 0.6) + canvas.width * 0.2;
      const targetX = startX + (Math.random() - 0.5) * 80;
      const targetY = Math.random() * (canvas.height * 0.4) + canvas.height * 0.15;
      const color = FIREWORK_COLORS[Math.floor(Math.random() * FIREWORK_COLORS.length)]!;

      rockets.push({
        x: startX,
        y: canvas.height,
        tx: targetX,
        ty: targetY,
        vy: -250 - Math.random() * 180,
        color,
        size: 2.5,
        active: true,
      });
    }

    window.addEventListener("resize", resize);
    resize();

    let lastTime = performance.now();

    function loop(time: number) {
      if (!canvas || !ctx) return;

      const delta = (time - lastTime) / 1000;
      lastTime = time;

      // Draw semi-transparent overlay to create trails
      ctx.fillStyle = "rgba(3, 2, 9, 0.22)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Periodically launch rockets
      launchTimer += delta;
      if (launchTimer > 1.8 + Math.random() * 1.5) {
        launchRocket();
        launchTimer = 0;
      }

      // Update rockets
      for (const r of rockets) {
        if (!r.active) continue;

        r.y += r.vy * delta;
        // Float slightly towards target x
        r.x += (r.tx - r.x) * 3 * delta;

        // Draw rocket trail
        ctx.fillStyle = r.color;
        ctx.beginPath();
        ctx.arc(r.x, r.y, r.size, 0, Math.PI * 2);
        ctx.fill();

        // Check if target reached
        if (r.y <= r.ty || r.vy >= 0) {
          r.active = false;
          createExplosion(r.x, r.y, r.color);
        }
      }
      rockets = rockets.filter((r) => r.active);

      // Update particles
      for (const p of particles) {
        p.x += p.vx * delta;
        p.y += p.vy * delta;
        p.vy += p.gravity * delta; // gravity pull
        p.vx *= 0.96; // air drag
        p.life -= delta;
        p.alpha = Math.max(0, p.life / p.maxLife);

        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();

        // Drawing a secondary sparkle glow
        if (p.size > 1.5 && Math.random() > 0.4) {
          ctx.fillStyle = "#ffffff";
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size * 0.5, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      ctx.globalAlpha = 1.0; // reset
      particles = particles.filter((p) => p.life > 0);

      animId = requestAnimationFrame(loop);
    }

    animId = requestAnimationFrame(loop);

    // Launch initial firework
    launchRocket();

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animId);
    };
  }, [onExplode]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "absolute",
        inset: 0,
        zIndex: 1,
        pointerEvents: "none",
        width: "100%",
        height: "100%",
      }}
    />
  );
}
