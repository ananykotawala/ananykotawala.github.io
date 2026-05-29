"use client";

import { useEffect, useRef, useState } from "react";
import { bus, EVENTS } from "@/game/eventBus";

export default function PhaserGame() {
  const containerRef = useRef<HTMLDivElement>(null);
  const gameRef = useRef<unknown>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      const [PhaserMod, { createWorldScene }] = await Promise.all([
        import("phaser"),
        import("@/game/createWorldScene"),
      ]);
      if (cancelled || !containerRef.current) return;

      const Phaser = (PhaserMod as unknown as { default: typeof import("phaser") }).default ?? PhaserMod;
      const WorldScene = createWorldScene(Phaser);

      const game = new Phaser.Game({
        type: Phaser.AUTO,
        parent: containerRef.current,
        backgroundColor: "#6db04a",
        pixelArt: true,
        antialias: false,
        scale: {
          mode: Phaser.Scale.RESIZE,
          autoCenter: Phaser.Scale.CENTER_BOTH,
          width: containerRef.current.clientWidth,
          height: containerRef.current.clientHeight,
        },
        physics: {
          default: "arcade",
          arcade: {
            gravity: { x: 0, y: 0 },
            debug: false,
          },
        },
        scene: [WorldScene],
      });

      gameRef.current = game;
      // Expose to window for debug/verify scripts.
      if (typeof window !== "undefined") {
        (window as unknown as { __game: unknown }).__game = game;
      }
    })();

    const unsub = bus.on(EVENTS.GAME_READY, () => setReady(true));

    return () => {
      cancelled = true;
      unsub();
      const g = gameRef.current as { destroy?: (removeCanvas: boolean) => void } | null;
      g?.destroy?.(true);
      gameRef.current = null;
    };
  }, []);

  return (
    <>
      <div
        ref={containerRef}
        className="absolute inset-0 bg-[#6db04a]"
        aria-label="Pixel-art world canvas"
      />
      {!ready && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-[#1a1a1a] text-zinc-100">
          <div className="flex flex-col items-center gap-3 font-mono text-sm">
            <div className="h-8 w-8 animate-pulse rounded-sm bg-amber-200" />
            <div>Loading world…</div>
          </div>
        </div>
      )}
    </>
  );
}
