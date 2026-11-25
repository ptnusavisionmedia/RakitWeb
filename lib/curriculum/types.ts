export type ClassLevel = 1 | 2 | 3 | 4 | 5 | 6;

export type ClassMeta = {
  level: ClassLevel;
  project: string;
  tagline: string;
  meetings: number;
  minutes: number;
  mode: "visual" | "code";
};

export const CLASSES: ClassMeta[] = [
  { level: 1, project: "Tentang Aku: Ini Hobiku", tagline: "Pilih gambar, warna, dan kalimat, lalu susun satu halaman.", meetings: 8, minutes: 60, mode: "visual" },
  { level: 2, project: "Tentang Aku: Cerita Kecilku", tagline: "Tiga bagian cerita: Halo!, Hobiku, dan Kesukaanku.", meetings: 8, minutes: 60, mode: "visual" },
  { level: 3, project: "Tentang Aku: Jelajahi Halamanku", tagline: "Sketsa, galeri, dan menu yang menuju bagian halaman.", meetings: 8, minutes: 60, mode: "visual" },
  { level: 4, project: "Website Hobiku", tagline: "Website pribadi dengan nama samaran, daftar hobi, jadwal, dan kuis.", meetings: 16, minutes: 90, mode: "code" },
  { level: 5, project: "Klub Hobi di Sekolah Impian", tagline: "Dua halaman sekolah fiktif dengan kartu klub dan kuis.", meetings: 16, minutes: 90, mode: "code" },
  { level: 6, project: "Website Sekolah Rancanganku", tagline: "Tiga halaman, navigasi konsisten, tampilan ponsel, dan kuis berskor.", meetings: 16, minutes: 90, mode: "code" },
];

export const classMeta = (l: number): ClassMeta => CLASSES[Math.min(6, Math.max(1, l)) - 1];
export const isLevel = (n: unknown): n is ClassLevel => typeof n === "number" && Number.isInteger(n) && n >= 1 && n <= 6;

export type QuizQ = { q: string; options: string[]; answer: number; ok: string; no: string };
export type SafeItem = { text: string; safe: boolean; why: string };
export type PartTarget = { part: "judul" | "gambar" | "tombol" | "menu" | "teks"; prompt: string };

export type Activity =
  | { type: "quiz"; items: QuizQ[] }
  | { type: "browser"; level: 1 | 2 | 3; missions: string[] }
  | { type: "safe"; items: SafeItem[] }
  | { type: "parts"; targets: PartTarget[] }
  | { type: "sketch"; level: 1 | 2 | 3; checklist: string[] }
  | { type: "editor"; step: 6 | 7 | 8 };

export type Snippet = { file: string; code: string; at?: "top" | "end" };

export type Lesson = {
  id: string; // "k5-03"
  level: ClassLevel;
  no: number;
  total: number;
  minutes: number;
  title: string;
  goal: string; // "Hari ini aku bisa ..."
  example: string;
  task: string; // satu kalimat tugas
  steps: string[];
  success: string[];
  topic: string; // judul topik baku pertemuan
  // tampilan guru
  timing: { label: string; minutes: number; note: string }[];
  guide: string[];
  // kelas 1-3
  activity?: Activity;
  // kelas 4-6
  tabs?: ("html" | "css" | "js")[];
  snippet?: Snippet[];
  target?: string;
  hints?: string[];
  tool?: "privacy" | "linkcheck" | "present";
};
