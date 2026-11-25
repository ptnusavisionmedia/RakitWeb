import type { CSSProperties } from "react";

const INK = "#14223f";
const S = `stroke="${INK}" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"`;

export type ArtInfo = { label: string; inner: string };

const face = (skin: string, hair: string, bg: string, style: number) => {
  const hairs = [
    `<path d="M24 54c-2-22 10-32 26-32s28 10 26 32c-6-12-14-16-26-16s-20 4-26 16z" fill="${hair}" ${S}/>`,
    `<circle cx="50" cy="20" r="10" fill="${hair}" ${S}/><path d="M25 52c0-18 10-28 25-28s25 10 25 28c-6-10-14-14-25-14s-19 4-25 14z" fill="${hair}" ${S}/>`,
    `<path d="M22 62c-6-26 6-42 28-42s34 16 28 42c-2-14-8-24-28-24s-26 10-28 24z" fill="${hair}" ${S}/>`,
    `<path d="M24 48c2-16 12-26 26-26s24 10 26 26z" fill="${hair}" ${S}/><rect x="20" y="46" width="60" height="8" rx="4" fill="${hair}" ${S}/>`,
  ];
  return `<circle cx="50" cy="50" r="46" fill="${bg}"/><circle cx="50" cy="56" r="25" fill="${skin}" ${S}/>${hairs[style]}<circle cx="41" cy="58" r="3" fill="${INK}"/><circle cx="59" cy="58" r="3" fill="${INK}"/><path d="M43 68q7 7 14 0" fill="none" ${S}/>`;
};

export const AVATARS = ["a1", "a2", "a3", "a4", "a5", "a6"] as const;
export const HOBBIES = ["bola", "musik", "gambar", "buku", "masak", "tanaman", "renang", "sepeda"] as const;

export const ART: Record<string, ArtInfo> = {
  a1: { label: "Kiko", inner: face("#f2c29b", "#3b2a20", "#cfe3ff", 0) },
  a2: { label: "Mira", inner: face("#e9b189", "#1f1a2e", "#ffe0e8", 1) },
  a3: { label: "Bima", inner: face("#c98f66", "#1a1a1a", "#d8f2de", 3) },
  a4: { label: "Sari", inner: face("#f5d0b0", "#8a4b1d", "#fff0c2", 2) },
  a5: { label: "Dodo", inner: face("#b57a52", "#2a1d14", "#e6dcff", 0) },
  a6: { label: "Luna", inner: face("#f0bd96", "#5a2d1a", "#ffd9c2", 1) },
  bola: {
    label: "Bola",
    inner: `<circle cx="50" cy="50" r="38" fill="#fff" ${S}/><polygon points="50,34 64,44 59,60 41,60 36,44" fill="${INK}"/><path d="M50 34V14M64 44l17-6M59 60l10 15M41 60L31 75M36 44L19 38" fill="none" ${S}/>`,
  },
  musik: {
    label: "Musik",
    inner: `<circle cx="50" cy="50" r="42" fill="#ffe27a"/><path d="M42 68V30l24-6v38" fill="none" ${S}/><ellipse cx="36" cy="69" rx="9" ry="7" fill="${INK}"/><ellipse cx="60" cy="63" rx="9" ry="7" fill="${INK}"/>`,
  },
  gambar: {
    label: "Menggambar",
    inner: `<path d="M50 12C28 12 12 28 12 50s16 38 36 38c8 0 10-6 6-11-4-5-1-12 7-12h12c10 0 15-6 15-14C88 28 72 12 50 12z" fill="#ffd9a8" ${S}/><circle cx="32" cy="44" r="6" fill="#e5484d"/><circle cx="48" cy="30" r="6" fill="#0047ab"/><circle cx="66" cy="36" r="6" fill="#1d9a5b"/><circle cx="30" cy="64" r="6" fill="#f5b50a"/>`,
  },
  buku: {
    label: "Membaca",
    inner: `<path d="M50 28C40 20 26 20 14 24v52c12-4 26-4 36 4 10-8 24-8 36-4V24C74 20 60 20 50 28z" fill="#e4edfb" ${S}/><path d="M50 28v52" fill="none" ${S}/><path d="M24 38c8-2 16-1 20 2M24 50c8-2 16-1 20 2M76 38c-8-2-16-1-20 2M76 50c-8-2-16-1-20 2" fill="none" stroke="#0047ab" stroke-width="3" stroke-linecap="round"/>`,
  },
  masak: {
    label: "Memasak",
    inner: `<path d="M22 46h56v22a16 16 0 0 1-16 16H38a16 16 0 0 1-16-16z" fill="#f08a4b" ${S}/><path d="M16 46h68M12 58h10M78 58h10" fill="none" ${S}/><path d="M38 36c-4-6 4-8 0-14M54 36c-4-6 4-8 0-14M68 36c-4-6 4-8 0-14" fill="none" stroke="#4a5878" stroke-width="3" stroke-linecap="round"/>`,
  },
  tanaman: {
    label: "Berkebun",
    inner: `<path d="M32 62h36l-5 24H37z" fill="#c9733a" ${S}/><path d="M50 62V34" fill="none" ${S}/><path d="M50 48C36 48 30 38 30 26c12 0 20 6 20 22z" fill="#3fae6a" ${S}/><path d="M50 42C60 42 70 36 70 24c-12 0-20 6-20 18z" fill="#6fcf8a" ${S}/>`,
  },
  renang: {
    label: "Berenang",
    inner: `<circle cx="50" cy="50" r="42" fill="#d3e8ff"/><circle cx="40" cy="38" r="8" fill="#f2b88a" ${S}/><path d="M46 44l22 6" fill="none" ${S}/><path d="M14 62c9-8 18-8 27 0s18 8 27 0 14-6 18-3M14 76c9-8 18-8 27 0s18 8 27 0 14-6 18-3" fill="none" stroke="#0047ab" stroke-width="4" stroke-linecap="round"/>`,
  },
  sepeda: {
    label: "Bersepeda",
    inner: `<circle cx="28" cy="64" r="16" fill="none" ${S}/><circle cx="72" cy="64" r="16" fill="none" ${S}/><path d="M28 64l14-26h22l8 26M42 38l12 26H28M38 30h12M62 38l-4-10h10" fill="none" stroke="#0047ab" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>`,
  },
};

export const artLabel = (id: string) => ART[id]?.label ?? "Gambar";

export function Art({ id, size = 64, className, style }: { id: string; size?: number | string; className?: string; style?: CSSProperties }) {
  const a = ART[id] ?? ART.bola;
  return (
    <svg viewBox="0 0 100 100" width={size} height={size} className={className} style={style} aria-hidden="true" dangerouslySetInnerHTML={{ __html: a.inner }} />
  );
}

export function artSvg(id: string): string | null {
  const a = ART[id];
  if (!a) return null;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">${a.inner}</svg>`;
}
export function artUri(id: string): string | null {
  const s = artSvg(id);
  return s ? `data:image/svg+xml;utf8,${encodeURIComponent(s)}` : null;
}

export const COLORS = [
  { id: "biru", name: "Biru", bg: "#e4edfb", strong: "#0047ab", ink: "#14223f" },
  { id: "kuning", name: "Kuning", bg: "#fff3c4", strong: "#8a5a00", ink: "#2d2305" },
  { id: "hijau", name: "Hijau", bg: "#dcf3e2", strong: "#17683a", ink: "#0f2a1a" },
  { id: "merah", name: "Merah muda", bg: "#ffe0e6", strong: "#a3203f", ink: "#341019" },
  { id: "jingga", name: "Jingga", bg: "#ffe4cf", strong: "#a84a0c", ink: "#321a08" },
  { id: "lila", name: "Lila", bg: "#ebe3ff", strong: "#5a37b0", ink: "#20153f" },
] as const;
export const colorOf = (id: string) => COLORS.find((c) => c.id === id) ?? COLORS[0];
