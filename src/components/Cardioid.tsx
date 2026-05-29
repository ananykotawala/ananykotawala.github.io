"use client";

import { useEffect, useRef } from "react";

declare global {
  interface Window {
    Cardioid?: {
      mount: (
        el: HTMLElement | string,
        opts?: { ink?: string },
      ) => { start: () => void; stop: () => void; resize: () => void } | null;
    };
  }
}

function inkForTheme(): string {
  return document.documentElement.classList.contains("dark")
    ? "#ffffff"
    : "#000000";
}

export function Cardioid({ className }: { className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let ctrl: { start: () => void; stop: () => void } | null = null;

    const mount = () => {
      if (!window.Cardioid || !el) return;
      ctrl?.stop();
      ctrl = window.Cardioid.mount(el, { ink: inkForTheme() });
    };

    if (window.Cardioid) {
      mount();
    } else {
      const t = window.setInterval(() => {
        if (window.Cardioid) {
          mount();
          window.clearInterval(t);
        }
      }, 50);
      window.setTimeout(() => window.clearInterval(t), 5000);
    }

    const obs = new MutationObserver(mount);
    obs.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => {
      obs.disconnect();
      ctrl?.stop();
    };
  }, []);

  return (
    <canvas
      ref={ref}
      data-cardioid
      className={className}
      style={{ width: "100%", aspectRatio: "1 / 1", display: "block" }}
      aria-hidden="true"
    />
  );
}
