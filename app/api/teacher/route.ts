import { addLog, addParentNote, canTeach, createStudent, getUser, getWorkById, gradeComponent, gradeLesson, makeReport, moveStudent, reportsForClass, reviewWork, sendReport } from "@/lib/db";
import { isLevel } from "@/lib/curriculum/types";
import { fail, json, readJson, teacherOrNull } from "@/lib/api";

export async function POST(req: Request) {
  const t = await teacherOrNull();
  if (!t) return fail("Khusus guru.", 403);
  const b = await readJson(req);
  if (!b) return fail("Permintaan tidak valid.");
  switch (b.action) {
    case "create-student": {
      // Guru kelas hanya menambah siswa ke kelasnya sendiri.
      const level = t.level ?? Number(b.level);
      if (!isLevel(level)) return fail("Kelas tidak valid.");
      const r = createStudent({ nickname: String(b.nickname ?? ""), avatar: String(b.avatar ?? "a1"), level, pin: String(b.pin ?? "") });
      return r.ok ? json(r) : fail(r.error);
    }
    case "move": {
      if (t.level) return fail("Pindah kelas dilakukan oleh koordinator.", 403);
      return moveStudent(String(b.id ?? ""), Number(b.level)) ? json({ ok: true }) : fail("Siswa atau kelas tidak valid.");
    }
    case "review": {
      const action = b.reviewAction === "publish" ? "publish" : b.reviewAction === "revise" ? "revise" : null;
      if (!action) return fail("Tindakan tidak valid.");
      const w = getWorkById(String(b.workId ?? ""));
      if (!w) return fail("Karya tidak ditemukan.", 404);
      if (!canTeach(t, w.level)) return fail("Karya ini bukan dari kelas Anda.", 403);
      const r = reviewWork(w.id, action, String(b.comment ?? ""));
      return r.ok ? json({ ok: true }) : fail(r.error ?? "Gagal.");
    }
    case "parent-note": {
      const s = getUser(String(b.studentId ?? ""));
      if (s?.level && !canTeach(t, s.level)) return fail("Siswa ini bukan di kelas Anda.", 403);
      const r = addParentNote(t, String(b.studentId ?? ""), String(b.text ?? ""));
      return r.ok ? json({ ok: true }) : fail(r.error ?? "Gagal.");
    }
    case "grade-lesson": {
      const r = gradeLesson(t, String(b.studentId ?? ""), Number(b.no), b.score ?? null, b.note);
      return r.ok ? json({ ok: true }) : fail(r.error ?? "Gagal.");
    }
    case "grade-component": {
      const kind = b.kind === "karya" ? "karya" : b.kind === "sikap" ? "sikap" : null;
      if (!kind) return fail("Jenis nilai tidak dikenal.");
      const r = gradeComponent(t, String(b.studentId ?? ""), kind, b.score ?? null, b.note);
      return r.ok ? json({ ok: true }) : fail(r.error ?? "Gagal.");
    }
    case "make-report": {
      const r = makeReport(t, String(b.studentId ?? ""), typeof b.catatan === "string" ? b.catatan : undefined);
      return r.ok ? json({ ok: true }) : fail(r.error);
    }
    case "send-report": {
      const r = sendReport(t, String(b.studentId ?? ""));
      if (r.ok) addLog(t, "Kirim rapor", getUser(String(b.studentId))?.nickname ?? "");
      return r.ok ? json({ ok: true }) : fail(r.error ?? "Gagal.");
    }
    case "class-reports": {
      const level = t.level ?? Number(b.level);
      if (!isLevel(level)) return fail("Kelas tidak valid.");
      const mode = b.mode === "send" ? "send" : "make";
      const res = reportsForClass(t, level, mode);
      if (mode === "send" && res.ok.length) addLog(t, "Kirim rapor kelas", `Kelas ${level}: ${res.ok.join(", ")}`);
      return json({ ok: true, done: res.ok, skipped: res.skipped });
    }
    default:
      return fail("Tindakan tidak dikenal.");
  }
}
