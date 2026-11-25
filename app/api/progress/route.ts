import { completeLesson, recordActivity, visitLesson } from "@/lib/db";
import { fail, json, readJson, studentOrNull } from "@/lib/api";

export async function POST(req: Request) {
  const s = await studentOrNull();
  if (!s) return fail("Silakan masuk dulu.", 401);
  const b = await readJson(req);
  const no = Number(b?.no);
  if (!b || !Number.isInteger(no)) return fail("Permintaan tidak valid.");
  if (b.action === "complete") completeLesson(s.id, s.level, no, b.self);
  else if (b.action === "result") {
    if (!recordActivity(s.id, s.level, no, b.data)) return fail("Hasil latihan tidak valid.");
  } else visitLesson(s.id, s.level, no);
  return json({ ok: true });
}
