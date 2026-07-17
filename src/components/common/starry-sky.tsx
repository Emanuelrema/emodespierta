"use client";

import React, { useEffect, useRef } from "react";

export function StarrySky() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Stars data
    const stars: { x: number; y: number; size: number; alpha: number; speed: number }[] = [];
    const starCount = Math.floor((width * height) / 8000); // density

    for (let i = 0; i < starCount; i++) {
      stars.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * 1.5 + 0.5,
        alpha: Math.random(),
        speed: 0.01 + Math.random() * 0.02,
      });
    }

    // Floating particles (dust/sparks)
    const particles: {
      x: number;
      y: number;
      size: number;
      color: string;
      vx: number;
      vy: number;
      alpha: number;
      life: number;
    }[] = [];
    const particleCount = 40;

    const particleColors = [
      "rgba(255, 0, 60, 0.4)", // Spider red
      "rgba(139, 92, 246, 0.35)", // Purple
      "rgba(255, 230, 0, 0.3)", // Yellow
      "rgba(10, 30, 100, 0.5)", // Deep blue
    ];

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * 3 + 1,
        color: particleColors[Math.floor(Math.random() * particleColors.length)],
        vx: (Math.random() - 0.5) * 0.3,
        vy: -0.1 - Math.random() * 0.4,
        alpha: Math.random() * 0.5 + 0.2,
        life: Math.random() * 100 + 50,
      });
    }

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener("resize", handleResize);

    // Render loop
    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // 1. Draw starry night gradient background base
      const gradient = ctx.createRadialGradient(
        width / 2,
        height / 2,
        10,
        width / 2,
        height / 2,
        Math.max(width, height)
      );
      gradient.addColorStop(0, "#08061c"); // deep summer night sky center
      gradient.addColorStop(0.6, "#04040a"); // dark edge
      gradient.addColorStop(1, "#010103");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);

      // 2. Draw stars with twinkling alpha
      for (let i = 0; i < stars.length; i++) {
        const s = stars[i];
        s.alpha += s.speed;
        if (s.alpha > 1 || s.alpha < 0) {
          s.speed = -s.speed;
        }
        ctx.fillStyle = `rgba(255, 255, 255, ${Math.max(0.1, Math.min(1, s.alpha))})`;
        ctx.fillRect(s.x, s.y, s.size, s.size);
      }

      // 3. Draw and update particles
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;

        // Reset particle if it drifts off screen or dies
        p.life -= 0.5;
        if (p.y < -10 || p.life <= 0) {
          p.x = Math.random() * width;
          p.y = height + 10;
          p.life = Math.random() * 100 + 50;
          p.vy = -0.1 - Math.random() * 0.4;
          p.vx = (Math.random() - 0.5) * 0.3;
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha * (p.life / 100);
        ctx.fill();
        ctx.globalAlpha = 1.0;
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="fixed inset-0 w-full h-full overflow-hidden pointer-events-none z-0">
      <canvas ref={canvasRef} className="block w-full h-full" />
      
      {/* Subtle Corner Spiderwebs */}
      <svg
        className="absolute top-0 left-0 w-44 h-44 text-border/20 pointer-events-none select-none"
        viewBox="0 0 100 100"
        fill="none"
        stroke="currentColor"
        strokeWidth="0.5"
      >
        <path d="M0,0 L100,0 M0,0 L0,100" />
        <path d="M0,0 L70,70" />
        <path d="M0,15 Q15,15 15,0" />
        <path d="M0,30 Q30,30 30,0" />
        <path d="M0,45 Q45,45 45,0" />
        <path d="M0,60 Q60,60 60,0" />
        <path d="M0,75 Q75,75 75,0" />
        <line x1="0" y1="0" x2="35" y2="85" strokeWidth="0.3" />
        <line x1="0" y1="0" x2="85" y2="35" strokeWidth="0.3" />
        <path d="M0,22 C12,22 22,12 22,0" />
        <path d="M0,40 C22,40 40,22 40,0" />
        <path d="M0,58 C32,58 58,32 58,0" />
      </svg>

      <svg
        className="absolute top-0 right-0 w-44 h-44 text-border/20 pointer-events-none select-none scale-x-[-1]"
        viewBox="0 0 100 100"
        fill="none"
        stroke="currentColor"
        strokeWidth="0.5"
      >
        <path d="M0,0 L100,0 M0,0 L0,100" />
        <path d="M0,0 L70,70" />
        <path d="M0,15 Q15,15 15,0" />
        <path d="M0,30 Q30,30 30,0" />
        <path d="M0,45 Q45,45 45,0" />
        <path d="M0,60 Q60,60 60,0" />
        <path d="M0,75 Q75,75 75,0" />
        <line x1="0" y1="0" x2="35" y2="85" strokeWidth="0.3" />
        <line x1="0" y1="0" x2="85" y2="35" strokeWidth="0.3" />
        <path d="M0,22 C12,22 22,12 22,0" />
        <path d="M0,40 C22,40 40,22 40,0" />
        <path d="M0,58 C32,58 58,32 58,0" />
      </svg>
    </div>
  );
}
