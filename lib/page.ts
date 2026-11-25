import type { ClassLevel } from "./curriculum/types";
import { COLORS, HOBBIES, AVATARS } from "./art";

export type Block =
  | { id: string; type: "title"; text: string }
  | { id: string; type: "avatar"; art: string }
  | { id: string; type: "icon"; art: string }
  | { id: string; type: "text"; text: string }
  | { id: string; type: "section"; heading: string; art: string; text: string }
  | { id: string; type: "gallery"; arts: string[] }
  | { id: string; type: "menu"; items: { label: string; target: string }[] };

export type VisualDoc = { color: string; blocks: Block[]; reflection?: string; friendTested?: boolean };

export const SENTENCES_K1 = ["Aku senang sekali dengan hobiku.", "Hobiku membuatku bahagia.", "Aku berlatih setiap hari.", "Aku ingin hebat di hobiku.", "Aku berhobi bersama temanku."];
export const EXAMPLE_K2: Record<string, string[]> = {
  "s-halo": ["Halo! Namaku {nama}.", "Halo, teman-teman!", "Selamat datang di halamanku."],
  "s-hobiku": ["Hobiku bermain bola.", "Aku suka menggambar.", "Hobiku mendengarkan musik."],
  "s-kesukaanku": ["Warna kesukaanku biru.", "Makanan kesukaanku bakso.", "Hewan kesukaanku kucing."],
};
export const REFLECTIONS = [
  "Aku memilih warna ini karena aku menyukainya.",
  "Aku memilih gambar ini karena cocok dengan hobiku.",
  "Aku menaruh bagian ini di atas karena paling penting.",
  "Aku memilih kalimat ini karena mudah dibaca.",
];

let n = 0;
export const bid = () => `b${Date.now().toString(36)}${(n++).toString(36)}${Math.random().toString(36).slice(2, 5)}`;

export function defaultDoc(level: ClassLevel, nick: string): VisualDoc {
  if (level === 1) {
    return {
      color: "biru",
      blocks: [
        { id: "title", type: "title", text: `Ini Hobiku — ${nick}` },
        { id: "avatar", type: "avatar", art: "a1" },
        { id: "icon", type: "icon", art: "bola" },
        { id: "kalimat", type: "text", text: SENTENCES_K1[0] },
      ],
    };
  }
  if (level === 2) {
    return {
      color: "biru",
      blocks: [
        { id: "title", type: "title", text: "Cerita Kecilku" },
        { id: "s-halo", type: "section", heading: "Halo!", art: "a2", text: `Halo! Namaku ${nick}.` },
        { id: "s-hobiku", type: "section", heading: "Hobiku", art: "gambar", text: "Aku suka menggambar." },
        { id: "s-kesukaanku", type: "section", heading: "Kesukaanku", art: "buku", text: "Warna kesukaanku biru." },
      ],
    };
  }
  return {
    color: "biru",
    blocks: [
      { id: "title", type: "title", text: "Jelajahi Halamanku" },
      { id: "menu", type: "menu", items: [] },
      { id: "s-perkenalan", type: "section", heading: "Perkenalan", art: "a3", text: `Halo! Aku ${nick}.` },
      { id: "s-hobi", type: "section", heading: "Hobi", art: "sepeda", text: "Hobiku bersepeda di akhir pekan." },
      { id: "galeri", type: "gallery", arts: ["sepeda", "tanaman", "musik"] },
    ],
  };
}

const str = (v: unknown, max = 200) => (typeof v === "string" ? v.slice(0, max) : "");
const ARTS: string[] = [...HOBBIES, ...AVATARS];
const art = (v: unknown, fallback: string) => (typeof v === "string" && ARTS.includes(v) ? v : fallback);

/** Membersihkan dokumen visual dari klien (dipakai di sisi server). */
export function sanitizeDoc(raw: unknown): VisualDoc | null {
  if (!raw || typeof raw !== "object") return null;
  const r = raw as Record<string, unknown>;
  const color = COLORS.some((c) => c.id === r.color) ? (r.color as string) : "biru";
  if (!Array.isArray(r.blocks) || r.blocks.length > 20) return null;
  const blocks: Block[] = [];
  const ids = new Set<string>();
  for (const b of r.blocks as Record<string, unknown>[]) {
    if (!b || typeof b !== "object") return null;
    const id = str(b.id, 40) || bid();
    if (ids.has(id)) return null;
    ids.add(id);
    switch (b.type) {
      case "title": blocks.push({ id, type: "title", text: str(b.text, 80) }); break;
      case "text": blocks.push({ id, type: "text", text: str(b.text, 200) }); break;
      case "avatar": blocks.push({ id, type: "avatar", art: art(b.art, "a1") }); break;
      case "icon": blocks.push({ id, type: "icon", art: art(b.art, "bola") }); break;
      case "section": blocks.push({ id, type: "section", heading: str(b.heading, 40), art: art(b.art, "bola"), text: str(b.text, 200) }); break;
      case "gallery": blocks.push({ id, type: "gallery", arts: (Array.isArray(b.arts) ? b.arts : []).slice(0, 6).map((a) => art(a, "bola")) }); break;
      case "menu": blocks.push({ id, type: "menu", items: (Array.isArray(b.items) ? b.items : []).slice(0, 8).map((i) => ({ label: str((i as Record<string, unknown>)?.label, 30), target: str((i as Record<string, unknown>)?.target, 40) })) }); break;
      default: return null;
    }
  }
  return { color, blocks, reflection: str(r.reflection, 200) || undefined, friendTested: r.friendTested === true ? true : undefined };
}
