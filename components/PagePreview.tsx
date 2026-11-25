"use client";

import { useId } from "react";
import { Art, colorOf, artLabel } from "@/lib/art";
import type { VisualDoc } from "@/lib/page";

export function PagePreview({ doc, className = "", compact = false }: { doc: VisualDoc; className?: string; compact?: boolean }) {
  const uid = useId().replace(/:/g, "");
  const c = colorOf(doc.color);
  const go = (target: string) => {
    const el = document.getElementById(`${uid}-${target}`);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };
  const art = compact ? 52 : 96;
  return (
    <div
      className={`rounded-2xl p-4 sm:p-6 ${className}`}
      style={{ background: c.bg, color: c.ink, fontFamily: "var(--font-teks)" }}
      data-testid="page-preview"
    >
      {doc.blocks.map((b) => {
        switch (b.type) {
          case "title":
            return (
              <h1 key={b.id} className="mb-3 text-center font-judul font-bold" style={{ color: c.strong, fontSize: compact ? "1.1rem" : "clamp(1.5rem,4vw,2.1rem)" }}>
                {b.text || "Judul halaman"}
              </h1>
            );
          case "avatar":
          case "icon":
            return (
              <div key={b.id} className="my-2 flex justify-center">
                <Art id={b.art} size={art} />
                <span className="sr-only">{artLabel(b.art)}</span>
              </div>
            );
          case "text":
            return (
              <p key={b.id} className="my-2 text-center" style={{ fontSize: compact ? "0.85rem" : "1.2rem" }}>
                {b.text}
              </p>
            );
          case "section":
            return (
              <section key={b.id} id={`${uid}-${b.id}`} className="my-3 rounded-2xl bg-white/70 p-3 sm:p-4" style={{ scrollMarginTop: 12 }}>
                <h2 className="mb-1 font-judul font-bold" style={{ color: c.strong, fontSize: compact ? "0.95rem" : "1.35rem" }}>
                  {b.heading || "Bagian"}
                </h2>
                <div className="flex items-center gap-3">
                  <Art id={b.art} size={compact ? 40 : 72} />
                  <p style={{ fontSize: compact ? "0.8rem" : "1.05rem" }}>{b.text}</p>
                </div>
              </section>
            );
          case "gallery":
            return (
              <section key={b.id} id={`${uid}-${b.id}`} className="my-3">
                <h2 className="mb-1 font-judul font-bold" style={{ color: c.strong, fontSize: compact ? "0.95rem" : "1.35rem" }}>
                  Galeri
                </h2>
                <div className="grid grid-cols-3 gap-2">
                  {b.arts.map((a, i) => (
                    <div key={i} className="flex items-center justify-center rounded-xl bg-white/80 p-2">
                      <Art id={a} size={compact ? 36 : 72} />
                    </div>
                  ))}
                </div>
              </section>
            );
          case "menu":
            return (
              <nav key={b.id} aria-label="Menu halaman" className="mb-3 flex flex-wrap justify-center gap-2">
                {b.items.length === 0 && <span className="text-sm opacity-60">Menu masih kosong</span>}
                {b.items.map((it, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => go(it.target)}
                    className="rounded-full px-4 py-1.5 font-judul text-sm font-bold text-white"
                    style={{ background: c.strong, minHeight: compact ? 28 : 40 }}
                  >
                    {it.label || "Menu"}
                  </button>
                ))}
              </nav>
            );
        }
      })}
    </div>
  );
}
