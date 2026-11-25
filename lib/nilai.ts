import type { Lesson } from "./curriculum/types";

/** Hasil satu pertemuan yang dikerjakan siswa. Nilai otomatis dihitung server dari jawaban mentah. */
export type LessonResult = {
  at: string;
  /** Nilai otomatis 0-100 dari latihan di aplikasi. */
  score?: number;
  /** Jawaban per butir latihan. */
  items?: { q: string; a: string; ok: boolean }[];
  /** Daftar misi atau daftar periksa pada latihan. */
  checks?: { t: string; done: boolean }[];
  /** Daftar "Tanda berhasil" yang dicentang siswa sendiri. */
  self?: { t: string; done: boolean }[];
  /** Nilai dan catatan dari guru. Nilai guru menggantikan nilai otomatis. */
  teacherScore?: number;
  teacherNote?: string;
};
export type Grade = { score: number; note?: string; at: string };

export const BOBOT = { tugas: 40, karya: 40, sikap: 20 } as const;

const ratio = (a?: { done: boolean }[]) => (a && a.length ? Math.round((100 * a.filter((x) => x.done).length) / a.length) : null);
/** Nilai otomatis: nilai latihan, atau persentase misi, atau persentase tanda berhasil. */
export const lessonAuto = (r?: LessonResult): number | null => (!r ? null : r.score ?? ratio(r.checks) ?? ratio(r.self));
export const lessonFinal = (r?: LessonResult): number | null => (r?.teacherScore !== undefined ? r.teacherScore : lessonAuto(r));

export function predikat(n: number): { p: "A" | "B" | "C" | "D"; label: string } {
  if (n >= 90) return { p: "A", label: "Sangat Baik" };
  if (n >= 80) return { p: "B", label: "Baik" };
  if (n >= 70) return { p: "C", label: "Cukup" };
  return { p: "D", label: "Perlu Bimbingan" };
}

export const clampScore = (n: unknown): number | null => {
  const v = typeof n === "number" ? n : typeof n === "string" && n.trim() !== "" ? Number(n) : NaN;
  return Number.isFinite(v) && v >= 0 && v <= 100 ? Math.round(v) : null;
};

export function termLabel(d = new Date()): string {
  const y = d.getFullYear();
  return d.getMonth() + 1 >= 7 ? `Semester Ganjil ${y}/${y + 1}` : `Semester Genap ${y - 1}/${y}`;
}

const pts = (tries: number) => (tries <= 1 ? 1 : tries === 2 ? 0.5 : 0.25);
const intIn = (n: unknown, lo: number, hi: number) => (typeof n === "number" && Number.isInteger(n) && n >= lo && n <= hi ? n : null);

/**
 * Menyusun hasil latihan dari jawaban mentah siswa. Jenis latihan dan kunci jawaban diambil dari kurikulum
 * di server, bukan dari kiriman siswa, sehingga nilai tidak bisa dikarang dari peramban.
 */
export function buildActivityResult(lesson: Lesson, raw: unknown): Pick<LessonResult, "score" | "items" | "checks"> | null {
  const a = lesson.activity;
  const r = raw && typeof raw === "object" ? (raw as Record<string, unknown>) : null;
  if (!a || !r) return null;
  if (a.type === "quiz") {
    const tries = Array.isArray(r.tries) ? r.tries : null;
    if (!tries || tries.length !== a.items.length) return null;
    const t = tries.map((x) => intIn(x, 1, 50));
    if (t.some((x) => x === null)) return null;
    const n = t as number[];
    return {
      score: Math.round((100 * n.reduce((s, x) => s + pts(x), 0)) / a.items.length),
      items: a.items.map((q, i) => ({ q: q.q, a: n[i] === 1 ? "Benar pada percobaan pertama" : `Benar setelah ${n[i]} percobaan`, ok: n[i] === 1 })),
    };
  }
  if (a.type === "safe") {
    const picks = Array.isArray(r.picks) ? r.picks : null;
    if (!picks || picks.length !== a.items.length || picks.some((p) => typeof p !== "boolean")) return null;
    const ok = a.items.map((it, i) => picks[i] === it.safe);
    return {
      score: Math.round((100 * ok.filter(Boolean).length) / a.items.length),
      items: a.items.map((it, i) => ({ q: it.text, a: picks[i] ? "Dijawab: aman dipajang" : "Dijawab: jangan dipajang", ok: ok[i] })),
    };
  }
  if (a.type === "parts") {
    const wrong = Array.isArray(r.wrong) ? r.wrong : null;
    if (!wrong || wrong.length !== a.targets.length) return null;
    const w = wrong.map((x) => intIn(x, 0, 50));
    if (w.some((x) => x === null)) return null;
    const n = w as number[];
    return {
      score: Math.round((100 * n.reduce((s, x) => s + pts(x + 1), 0)) / a.targets.length),
      items: a.targets.map((t, i) => ({ q: t.prompt, a: n[i] === 0 ? "Tepat pada ketukan pertama" : `${n[i]} kali salah ketuk`, ok: n[i] === 0 })),
    };
  }
  if (a.type === "browser" || a.type === "sketch") {
    const labels = a.type === "browser" ? a.missions : a.checklist;
    const done = Array.isArray(r.checks) ? r.checks : null;
    if (!done || done.length !== labels.length || done.some((d) => typeof d !== "boolean")) return null;
    const checks = labels.map((t, i) => ({ t, done: done[i] as boolean }));
    return { checks, score: ratio(checks) ?? 0 };
  }
  return null;
}

/** Hasil "tanda berhasil" yang dicentang siswa saat menyelesaikan pertemuan. */
export function buildSelf(lesson: Lesson, raw: unknown): { t: string; done: boolean }[] | null {
  if (!Array.isArray(raw) || raw.length !== lesson.success.length || raw.some((d) => typeof d !== "boolean")) return null;
  return lesson.success.map((t, i) => ({ t, done: raw[i] as boolean }));
}
