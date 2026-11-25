import { getWork, saveWork, submitWork } from "@/lib/db";
import { fail, json, readJson, studentOrNull } from "@/lib/api";

// Simpan draf otomatis milik siswa yang sedang masuk (kelas dari sesi, bukan dari klien).
export async function PUT(req: Request) {
  const s = await studentOrNull();
  if (!s) return fail("Silakan masuk dulu.", 401);
  const b = await readJson(req);
  if (!b || !("content" in b)) return fail("Permintaan tidak valid.");
  if (!saveWork(s.id, s.level, b.content)) return fail("Karya tidak dapat disimpan.");
  const w = getWork(s.id, s.level);
  return json({ ok: true, updatedAt: w.updatedAt, status: w.status });
}

export async function POST(req: Request) {
  const s = await studentOrNull();
  if (!s) return fail("Silakan masuk dulu.", 401);
  const b = await readJson(req);
  if (!b) return fail("Permintaan tidak valid.");
  if (b.content !== undefined && !saveWork(s.id, s.level, b.content)) return fail("Karya tidak dapat disimpan.");
  const w = submitWork(s.id, s.level);
  return json({ ok: true, status: w.status });
}
