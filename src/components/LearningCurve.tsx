"use client";

import { useEffect, useRef } from "react";

/**
 * Continuously-redrawn curve reading as either an RL training reward curve
 * or a price walk. Restrained, slow, monochrome. Tracks current text color
 * via getComputedStyle on the canvas element so it respects light/dark mode.
 */
export function LearningCurve({
  width = 280,
  height = 200,
}: {
  width?: number;
  height?: number;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr = window.devicePixelRatio || 1;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.scale(dpr, dpr);

    const PAD_X = 16;
    const PAD_Y = 14;
    const W = width - PAD_X * 2;
    const H = height - PAD_Y * 2;
    const N = 160; // sample points
    const TAU = 50; // convergence speed
    const NOISE = 0.08;

    let raf = 0;
    let cycleStart = performance.now();

    // Generate a noisy convergent curve once per cycle:  y = 1 - exp(-t/tau) + noise
    // The "noise" is smooth — band-limited via cumulative sum of small steps.
    function makeCurve() {
      const ys = new Float32Array(N);
      let drift = 0;
      for (let i = 0; i < N; i++) {
        const t = i / (N - 1);
        const base = 1 - Math.exp(-(t * N) / TAU);
        drift += (Math.random() - 0.5) * 0.04;
        drift *= 0.97;
        const n = drift + (Math.random() - 0.5) * NOISE;
        ys[i] = Math.max(0, Math.min(1, base + n));
      }
      return ys;
    }

    let curve = makeCurve();
    let nextCurve = makeCurve();

    const CYCLE = 6500; // ms per full draw + hold
    const DRAW = 3500;
    const HOLD = 1500;
    const FADE = 1500;

    function frame(now: number) {
      const elapsed = now - cycleStart;
      ctx!.clearRect(0, 0, width, height);

      // Pick color based on theme. Reading computed style isn't reliable
      // with Tailwind 4 oklch() values, so we detect .dark directly.
      const isDark = document.documentElement.classList.contains("dark");
      const rgb = isDark ? "228, 228, 231" : "24, 24, 27";

      // Subtle grid (very faint)
      ctx!.strokeStyle = `rgba(${rgb}, 0.07)`;
      ctx!.lineWidth = 1;
      for (let g = 0; g <= 4; g++) {
        const y = PAD_Y + (H * g) / 4;
        ctx!.beginPath();
        ctx!.moveTo(PAD_X, y);
        ctx!.lineTo(PAD_X + W, y);
        ctx!.stroke();
      }
      // baseline
      ctx!.strokeStyle = `rgba(${rgb}, 0.25)`;
      ctx!.beginPath();
      ctx!.moveTo(PAD_X, PAD_Y + H);
      ctx!.lineTo(PAD_X + W, PAD_Y + H);
      ctx!.stroke();
      ctx!.beginPath();
      ctx!.moveTo(PAD_X, PAD_Y);
      ctx!.lineTo(PAD_X, PAD_Y + H);
      ctx!.stroke();

      // How far along the draw are we?
      let progress: number;
      let alpha = 1;
      if (elapsed < DRAW) {
        progress = elapsed / DRAW;
      } else if (elapsed < DRAW + HOLD) {
        progress = 1;
      } else if (elapsed < DRAW + HOLD + FADE) {
        progress = 1;
        alpha = 1 - (elapsed - DRAW - HOLD) / FADE;
      } else {
        // restart with next curve
        cycleStart = now;
        curve = nextCurve;
        nextCurve = makeCurve();
        progress = 0;
      }

      const drawUntil = Math.floor(progress * N);

      ctx!.lineWidth = 1.5;
      ctx!.strokeStyle = `rgba(${rgb}, ${0.85 * alpha})`;
      ctx!.lineJoin = "round";
      ctx!.beginPath();
      for (let i = 0; i <= drawUntil; i++) {
        const x = PAD_X + (W * i) / (N - 1);
        const y = PAD_Y + H - curve[i] * H;
        if (i === 0) ctx!.moveTo(x, y);
        else ctx!.lineTo(x, y);
      }
      ctx!.stroke();

      // Leading dot at the draw head
      if (drawUntil > 0 && drawUntil < N) {
        const x = PAD_X + (W * drawUntil) / (N - 1);
        const y = PAD_Y + H - curve[drawUntil] * H;
        ctx!.fillStyle = `rgba(${rgb}, ${alpha})`;
        ctx!.beginPath();
        ctx!.arc(x, y, 2, 0, Math.PI * 2);
        ctx!.fill();
      }

      raf = requestAnimationFrame(frame);
    }

    raf = requestAnimationFrame(frame);

    return () => cancelAnimationFrame(raf);
  }, [width, height]);

  return (
    <canvas
      ref={canvasRef}
      style={{ width, height }}
      className="text-zinc-900 dark:text-zinc-100"
      aria-hidden="true"
    />
  );
}
