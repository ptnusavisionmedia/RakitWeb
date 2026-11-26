import { endSession, impersonator, startSession } from "@/lib/auth";
import { addLog, demoAdmin, demoParent, demoStudent, demoTeacher, homeFor, login, registerParent } from "@/lib/db";
import { isLevel } from "@/lib/curriculum/types";
import { fail, json, readJson } from "@/lib/api";

export async function POST(req: Request) {
  try {
    return await handle(req);
  } catch (e) {
    console.error("session route", e);
    return fail("Terjadi kesalahan di server. Muat ulang halaman lalu coba lagi.", 500);
  }
}

async function handle(req: Request) {
  const b = await readJson(req);
  if (!b) return fail("Permintaan tidak valid.");
  switch (b.action) {
    case "demo-student": {
      const level = Number(b.level);
      if (!isLevel(level)) return fail("Pilih kelas 1 sampai 6.");
      const u = demoStudent(level);
      await startSession(u.id);
      return json({ ok: true, redirect: "/belajar" });
    }
    case "demo-parent": {
      await startSession(demoParent().id);
      return json({ ok: true, redirect: "/ortu" });
    }
    case "demo-teacher": {
      const level = Number(b.level);
      if (!isLevel(level)) return fail("Pilih kelas yang diajar.");
      await startSession(demoTeacher(level).id);
      return json({ ok: true, redirect: "/guru" });
    }
    case "demo-admin": {
      if (process.env.DISABLE_DEMO_ADMIN === "1") return fail("Demo admin dimatikan di server ini.", 403);
      const u = demoAdmin();
      await startSession(u.id);
      addLog(u, "Masuk", "Mencoba sebagai admin demo");
      return json({ ok: true, redirect: "/admin" });
    }
    case "register-parent": {
      const r = registerParent({ nickname: String(b.nickname ?? ""), username: String(b.username ?? ""), secret: String(b.secret ?? ""), code: String(b.code ?? "") });
      if (!r.ok) return fail(r.error);
      await startSession(r.user.id);
      addLog(r.user, "Pendaftaran orang tua", `${r.user.nickname} (${r.user.username})`);
      return json({ ok: true, redirect: "/ortu" });
    }
    case "login": {
      const u = login(String(b.username ?? ""), String(b.secret ?? ""));
      if (!u) return fail("Nama masuk atau kata sandi belum cocok.", 401);
      await startSession(u.id);
      if (u.role !== "student") addLog(u, "Masuk", `${u.nickname} (${u.username})`);
      return json({ ok: true, redirect: homeFor(u) });
    }
    case "kembali-admin": {
      const a = await impersonator();
      if (!a) return fail("Sesi ini bukan sesi admin.", 403);
      await startSession(a.id);
      return json({ ok: true, redirect: "/admin/pengguna" });
    }
    case "logout": {
      await endSession();
      return json({ ok: true, redirect: "/" });
    }
    default:
      return fail("Tindakan tidak dikenal.");
  }
}
