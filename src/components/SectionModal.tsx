"use client";

import { useEffect, useState, useCallback } from "react";
import { bus, EVENTS } from "@/game/eventBus";
import {
  ABOUT,
  CARDS,
  CONTACT,
  CV,
  PROJECTS,
  SECTIONS,
  TECHNOLOGIES,
  UNDER_THE_HOOD,
  type SectionId,
} from "@/data/sections";

export default function SectionModal() {
  const [openId, setOpenId] = useState<SectionId | null>(null);

  const close = useCallback(() => {
    setOpenId(null);
    bus.emit(EVENTS.RESUME_INPUT);
  }, []);

  useEffect(() => {
    const unsub = bus.on<SectionId>(EVENTS.OPEN_SECTION, (id) => {
      if (!id) return;
      setOpenId(id);
      bus.emit(EVENTS.PAUSE_INPUT);
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    if (!openId) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [openId, close]);

  if (!openId) return null;

  const section = SECTIONS.find((s) => s.id === openId)!;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/55 px-3 pb-3 pt-10 sm:items-center sm:p-6"
      onClick={close}
    >
      <div
        className="relative w-full max-w-2xl overflow-hidden rounded-md border-2 border-zinc-900 bg-[#fdf6e3] shadow-[6px_6px_0_0_rgba(0,0,0,0.7)]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Title bar — pixel-art style */}
        <div
          className="flex items-center justify-between border-b-2 border-zinc-900 px-4 py-2 font-mono text-sm uppercase tracking-wider"
          style={{
            backgroundColor: section.buildingColor,
            color: "#fdf6e3",
            textShadow: "1px 1px 0 rgba(0,0,0,0.4)",
          }}
        >
          <span>▸ {section.label}</span>
          <button
            onClick={close}
            className="grid h-6 w-6 place-items-center rounded-sm border border-black/40 bg-white/20 leading-none transition-colors hover:bg-white/40"
            aria-label="Close"
          >
            ×
          </button>
        </div>

        {/* Body */}
        <div className="max-h-[70vh] overflow-y-auto px-5 py-5 font-mono text-[13px] leading-relaxed text-zinc-900 sm:px-7 sm:py-6 sm:text-sm">
          <SectionBody id={openId} />
        </div>

        {/* Footer hint */}
        <div className="flex items-center justify-between border-t-2 border-zinc-900 bg-[#f1e4bb] px-4 py-2 font-mono text-[11px] text-zinc-700">
          <span>esc · close</span>
          <span>walk · WASD / arrows</span>
        </div>
      </div>
    </div>
  );
}

function SectionBody({ id }: { id: SectionId }) {
  switch (id) {
    case "technologies":
      return (
        <div className="space-y-3">
          {TECHNOLOGIES.map((t) => (
            <div key={t.name} className="border-l-2 border-zinc-900 pl-3">
              <div className="text-zinc-900 font-bold">{t.name}</div>
              <div className="text-zinc-700">{t.description}</div>
            </div>
          ))}
        </div>
      );

    case "about":
      return (
        <div className="space-y-4">
          <h2 className="text-lg font-bold leading-snug text-zinc-900">
            {ABOUT.headline}
          </h2>
          <div className="flex gap-4 text-xs text-zinc-700">
            <span>📍 {ABOUT.location}</span>
            <span>⏳ {ABOUT.experience}</span>
          </div>
          {ABOUT.body.map((p, i) => (
            <p key={i} className="text-zinc-800">
              {p}
            </p>
          ))}
        </div>
      );

    case "cv":
      return (
        <ol className="space-y-4">
          {CV.map((c) => (
            <li key={c.year + c.company} className="border-l-2 border-zinc-900 pl-3">
              <div className="flex items-baseline gap-2">
                <span className="rounded-sm bg-zinc-900 px-1.5 py-0.5 text-[11px] text-amber-100">
                  {c.year}
                </span>
                <span className="font-bold">{c.company}</span>
              </div>
              <div className="text-zinc-700">{c.role}</div>
              <ul className="mt-1 list-disc pl-5 text-xs text-zinc-700">
                {c.highlights.map((h) => (
                  <li key={h}>{h}</li>
                ))}
              </ul>
            </li>
          ))}
        </ol>
      );

    case "cards":
      return (
        <div className="grid gap-3 sm:grid-cols-2">
          {CARDS.map((c) => (
            <div
              key={c.title}
              className="border-2 border-zinc-900 bg-white p-3 shadow-[3px_3px_0_0_rgba(0,0,0,0.7)]"
            >
              <div className="mb-1 text-sm font-bold text-zinc-900">{c.title}</div>
              <div className="text-xs text-zinc-700">{c.body}</div>
            </div>
          ))}
        </div>
      );

    case "projects":
      return (
        <div className="space-y-4">
          {PROJECTS.map((p) => (
            <div key={p.name} className="border-l-2 border-zinc-900 pl-3">
              <div className="flex items-baseline gap-2">
                <span className="font-bold text-zinc-900">{p.name}</span>
                {p.url && (
                  <a
                    href={p.url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs text-blue-700 underline"
                  >
                    visit ↗
                  </a>
                )}
              </div>
              <div className="text-zinc-700">{p.description}</div>
              <div className="mt-1 flex flex-wrap gap-1 text-[11px]">
                {p.stack.map((s) => (
                  <span
                    key={s}
                    className="rounded-sm border border-zinc-900 bg-amber-100 px-1.5 py-0.5"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      );

    case "contact":
      return (
        <div className="space-y-3">
          <p className="text-zinc-800">{CONTACT.note}</p>
          <div className="space-y-1">
            <div>
              <span className="font-bold">email:</span>{" "}
              <a className="text-blue-700 underline" href={`mailto:${CONTACT.email}`}>
                {CONTACT.email}
              </a>
            </div>
            <div>
              <span className="font-bold">linkedin:</span>{" "}
              <a
                className="text-blue-700 underline"
                href={CONTACT.linkedin}
                target="_blank"
                rel="noreferrer"
              >
                {CONTACT.linkedin}
              </a>
            </div>
          </div>
        </div>
      );

    case "under-the-hood":
      return (
        <div className="space-y-4">
          {UNDER_THE_HOOD.map((u) => (
            <div key={u.title} className="border-l-2 border-zinc-900 pl-3">
              <div className="font-bold text-zinc-900">{u.title}</div>
              <p className="text-zinc-700">{u.body}</p>
            </div>
          ))}
        </div>
      );
  }
}
