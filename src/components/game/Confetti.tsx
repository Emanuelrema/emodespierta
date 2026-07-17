"use client";

import { useEffect, useRef } from "react";

interface ConfettiPiece {
  x: number;
  y: number;
  vx: number;
  vy: number;
  rotation: number;
  rotationSpeed: number;
  color: string;
  w: number;
  h: number;
  swayPhase: number;
  swaySpeed: number;
}

const CONFETTI_COLORS = [
  "#ff0055", "#ffe600", "#8b5cf6", "#22d3ee", "#f97316", "#ffffff"
];

/**
 * Confetti — Drops falling, swaying confetti pieces from the top.
 * Auto-terminates spawning after 5 seconds, letting existing pieces fall off.
 */
export function Confetti() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let pieces: ConfettiPiece[] = [];
    let spawnActive = true;
    let elapsed = 0;

    function resize() {
      if (!canvas) return;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }

    function createPiece(startX?: number, startY?: number): ConfettiPiece {
      return {
        x: startX ?? Math.random() * (canvas?.width ?? 800),
        y: startY ?? -15,
        vx: (Math.random() - 0.5) * 80,
        vy: 100 + Math.random() * 120,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 4,
        color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)]!,
        w: 5 + Math.random() * 6,
        h: 8 + Math.random() * 6,
        swayPhase: Math.random() * Math.PI * 2,
        swaySpeed: 2 + Math.random() * 3,
      };
    }

    window.addEventListener("resize", resize);
    resize();

    // Populate initial batch
    if (canvas) {
      for (let i = 0; i < 40; i++) {
        pieces.push(createPiece(Math.random() * canvas.width, Math.random() * canvas.height * 0.7));
      }
    }

    let lastTime = performance.now();

    function loop(time: number) {
      if (!canvas || !ctx) return;

      const delta = (time - lastTime) / 1000;
      lastTime = time;
      elapsed += delta;

      // Stop spawning new confetti after 5 seconds
      if (elapsed > 5.0) {
        spawnActive = false;
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Spawn new pieces
      if (spawnActive && pieces.length < 90) {
        pieces.push(createPiece());
      }

      // Update and draw pieces
      for (const p of pieces) {
        // Sway horizontally
        p.swayPhase += p.swaySpeed * delta;
        const sway = Math.sin(p.swayPhase) * 40;

        p.y += p.vy * delta;
        p.x += (p.vx + sway) * delta;
        p.rotation += p.rotationSpeed * delta;

        // Wrap around sides
        if (p.x < -20) p.x = canvas.width + 20;
        else if (p.x > canvas.width + 20) p.x = -20;

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
        ctx.restore();
      }

      // Filter pieces that fell off screen
      pieces = pieces.filter((p) => p.y < canvas.height + 20);

      if (pieces.length > 0 || spawnActive) {
        animId = requestAnimationFrame(loop);
      }
    }

    animId = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "absolute",
        inset: 0,
        zIndex: 2,
        pointerEvents: "none",
        width: "100%",
        height: "100%",
      }}
    />
  );
}
