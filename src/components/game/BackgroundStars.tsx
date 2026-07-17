"use client";

import { useEffect, useRef } from "react";

interface Star {
  x: number;
  y: number;
  size: number;
  speed: number;
  brightness: number;
  phase: number;
}

/**
 * BackgroundStars — Smooth animated starry sky with floating embers/particles.
 * Uses a Canvas element for smooth 60fps rendering without DOM overhead.
 */
export function BackgroundStars() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let stars: Star[] = [];
    const starCount = 65;

    function resize() {
      if (!canvas) return;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initStars();
    }

    function initStars() {
      if (!canvas) return;
      stars = Array.from({ length: starCount }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 1.8 + 0.5,
        speed: Math.random() * 0.08 + 0.02,
        brightness: Math.random() * 0.5 + 0.5,
        phase: Math.random() * Math.PI * 2,
      }));
    }

    window.addEventListener("resize", resize);
    resize();

    let lastTime = performance.now();

    function loop(time: number) {
      if (!canvas || !ctx) return;

      const delta = (time - lastTime) / 1000;
      lastTime = time;

      // Clear with dark sky background
      ctx.fillStyle = "#030209";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw starry night gradient
      const grad = ctx.createLinearGradient(0, 0, 0, canvas.height);
      grad.addColorStop(0, "rgba(2, 2, 5, 0.95)");
      grad.addColorStop(0.5, "rgba(8, 7, 30, 0.9)");
      grad.addColorStop(1, "rgba(13, 10, 45, 0.95)");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Render stars
      for (const s of stars) {
        // Move stars slowly down/left
        s.y += s.speed * 60 * delta;
        if (s.y > canvas.height) {
          s.y = 0;
          s.x = Math.random() * canvas.width;
        }

        s.phase += delta * 1.5;
        const alpha = Math.max(0.2, Math.min(1, s.brightness + Math.sin(s.phase) * 0.35));

        ctx.fillStyle = `rgba(255, 255, 255, ${alpha.toFixed(2)})`;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
        ctx.fill();

        // Optional star glow
        if (s.size > 1.8) {
          ctx.fillStyle = `rgba(139, 92, 246, ${(alpha * 0.15).toFixed(2)})`;
          ctx.beginPath();
          ctx.arc(s.x, s.y, s.size * 4, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      animId = requestAnimationFrame(loop);
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
        zIndex: 0,
        pointerEvents: "none",
        width: "100%",
        height: "100%",
      }}
    />
  );
}
