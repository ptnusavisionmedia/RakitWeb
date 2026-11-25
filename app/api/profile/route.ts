import { resetDemo, updateProfile } from "@/lib/db";
import { ART } from "@/lib/art";
import { fail, json, readJson, studentOrNull } from "@/lib/api";

export async function POST(req: Request) {
  const s = await studentOrNull();
  if (!s) return fail("Silakan masuk dulu.", 401);
  const b = await readJson(req);
  if (!b) return fail("Permintaan tidak valid.");
  if (b.action === "reset-demo") {
    if (!s.demo) return fail("Hanya untuk akun demo.", 403);
    resetDemo(s.id, s.level);
    return json({ ok: true });
  }
  const avatar = typeof b.avatar === "string" && /^a[1-6]$/.test(b.avatar) && ART[b.avatar] ? b.avatar : s.avatar;
  updateProfile(s.id, String(b.nickname ?? ""), avatar);
  return json({ ok: true });
}
