import { addLog, addParentNote, canTeachStudent, createStudent, getRoom, roomForLevel, roomForTeacher, seesAllClasses, type User, getUser, getWorkById, gradeComponent, gradeLesson, makeReport, moveStudent, reportsForClass, reviewWork, sendReport } from "@/lib/db";
import { fail, json, readJson, teacherOrNull } from "@/lib/api";
import type { ClassLevel } from "@/lib/curriculum/types";

/** Kelas tujuan: guru kelas selalu kelasnya sendiri; koordinator/admin wajib menyebut roomId (atau tingkat lama). */
function targetRoom(t: User, b: Record<string, unknown>) {
  if (!seesAllClasses(t)) return roomForTeacher(t);
  if (typeof b.roomId === "string") return getRoom(b.roomId);
  const lv = Number(b.level);
  return Number.isInteger(lv) && lv >= 1 && lv <= 6 ? roomForLevel(lv as ClassLevel) : undefined;
}

export async function POST(req: Request) {
  const t = await teacherOrNull();
  if (!t) return fail("Khusus guru.", 403);
  const b = await readJson(req);
  if (!b) return fail("Permintaan tidak valid.");
  switch (b.action) {
    case "create-student": {
      // Guru kelas hanya menambah siswa ke kelasnya sendiri.
      const room = targetRoom(t, b);
      if (!room) return fail("Kelas tidak valid.");
      const r = createStudent({ nickname: String(b.nickname ?? ""), avatar: String(b.avatar ?? "a1"), roomId: room.id, pin: String(b.pin ?? "") });
      if (r.ok) addLog(t, "Tambah siswa", `${String(b.nickname ?? "").trim()} (${r.username}) ke [${room.name}]`);
      return r.ok ? json(r) : fail(r.error);
    }
    case "move": {
      if (!seesAllClasses(t)) return fail("Pindah kelas dilakukan oleh koordinator.", 403);
      const to = targetRoom(t, b);
      if (!to) return fail("Siswa atau kelas tidak valid.");
      const s = getUser(String(b.id ?? ""));
      if (!moveStudent(String(b.id ?? ""), to.id)) return fail("Siswa atau kelas tidak valid.");
      addLog(t, "Pindah kelas", `${s?.nickname} (${s?.username}) ke [${to.name}]`);
      return json({ ok: true });
    }
    case "review": {
      const action = b.reviewAction === "publish" ? "publish" : b.reviewAction === "revise" ? "revise" : null;
      if (!action) return fail("Tindakan tidak valid.");
      const w = getWorkById(String(b.workId ?? ""));
      if (!w) return fail("Karya tidak ditemukan.", 404);
      const owner = getUser(w.userId);
      if (!owner || !canTeachStudent(t, owner)) return fail("Karya ini bukan dari kelas Anda.", 403);
      const r = reviewWork(w.id, action, String(b.comment ?? ""));
      return r.ok ? json({ ok: true }) : fail(r.error ?? "Gagal.");
    }
    case "parent-note": {
      const s = getUser(String(b.studentId ?? ""));
      if (s && !canTeachStudent(t, s)) return fail("Siswa ini bukan di kelas Anda.", 403);
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
      const st = getUser(String(b.studentId));
      if (r.ok && st) addLog(t, "Kirim rapor", `${st.nickname} (${st.username})`);
      return r.ok ? json({ ok: true }) : fail(r.error ?? "Gagal.");
    }
    case "class-reports": {
      const room = targetRoom(t, b);
      if (!room) return fail("Kelas tidak valid.");
      const mode = b.mode === "send" ? "send" : "make";
      const res = reportsForClass(t, room.id, mode);
      if (mode === "send" && res.ok.length) addLog(t, "Kirim rapor kelas", `[${room.name}]: ${res.ok.join(", ")}`);
      return json({ ok: true, done: res.ok, skipped: res.skipped });
    }
    default:
      return fail("Tindakan tidak dikenal.");
  }
}
