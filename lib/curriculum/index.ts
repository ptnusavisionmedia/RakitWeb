import { CLASSES, classMeta, type ClassLevel, type Lesson } from "./types";
import { K13 } from "./k13";
import { K46 } from "./k46";

export * from "./types";

function timing(minutes: number, opening: string, demo: string, task: string, reflect: string) {
  const [a, b, c] = minutes === 60 ? [8, 12, 32] : [10, 15, 55];
  const d = minutes - a - b - c;
  return [
    { label: "Pembukaan", minutes: a, note: opening },
    { label: "Demonstrasi singkat", minutes: b, note: demo },
    { label: "Praktik", minutes: c, note: task },
    { label: "Refleksi", minutes: d, note: reflect },
  ];
}

function build(): Lesson[] {
  const out: Lesson[] = [];
  for (const c of CLASSES) {
    const idx = c.level - 1;
    if (c.mode === "visual") {
      K13.forEach((t, i) => {
        const v = t.v[idx];
        out.push({
          id: `k${c.level}-${String(i + 1).padStart(2, "0")}`,
          level: c.level, no: i + 1, total: c.meetings, minutes: c.minutes,
          title: v.title, goal: v.goal, example: v.example, task: v.task, steps: v.steps, success: v.success,
          topic: t.topic,
          timing: timing(c.minutes, t.opening, t.demo, `Siswa mengerjakan: ${v.task}`, t.reflect),
          guide: [
            ...t.guide,
            c.level === 1 ? "Kelas 1: bacakan petunjuk satu per satu dan dampingi anak agar cukup menunjuk, mengeklik, atau mengetuk." : c.level === 2 ? "Kelas 2: dorong anak menulis satu kalimat pendek sendiri; contoh kalimat boleh diubah." : "Kelas 3: minta anak menjelaskan alasan pilihannya dengan kata-kata sendiri.",
          ],
          activity: v.activity,
        });
      });
    } else {
      const k = c.level - 4;
      K46.forEach((t, i) => {
        const v = t.v[k];
        const no = i + 1;
        out.push({
          id: `k${c.level}-${String(no).padStart(2, "0")}`,
          level: c.level, no, total: c.meetings, minutes: c.minutes,
          title: v.title, goal: v.goal, example: v.example, task: v.task, steps: v.steps, success: v.success,
          topic: t.topic,
          timing: timing(c.minutes, t.opening, t.demo, `Siswa mengerjakan: ${v.task}`, t.reflect),
          guide: [
            ...t.guide,
            c.level === 4 ? "Kelas 4: siswa memakai kode awal pendek dan mengganti baris bertanda UBAH." : c.level === 5 ? "Kelas 5: beri satu contoh, lalu minta siswa membuat bagian berikutnya sendiri." : "Kelas 6: siswa membuka petunjuk bertahap hanya saat dibutuhkan; fokus pada target hasil.",
          ],
          tabs: no < 6 ? ["html"] : no < 12 ? ["html", "css"] : ["html", "css", "js"],
          snippet: v.snippet,
          target: v.target,
          hints: v.hints,
          tool: t.tools,
        });
      });
    }
  }
  return out;
}

export const ALL_LESSONS: Lesson[] = build();

export function lessonsOf(level: number): Lesson[] {
  return ALL_LESSONS.filter((l) => l.level === level);
}
export function getLesson(level: number, no: number): Lesson | undefined {
  return ALL_LESSONS.find((l) => l.level === level && l.no === no);
}
export { classMeta };
export type { ClassLevel };
