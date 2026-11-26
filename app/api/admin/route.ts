import { startSession } from "@/lib/auth";
import { addLog, adminCreateUser, adminDeleteUser, adminLink, adminNewCode, adminResetProgress, adminResetSecret, adminUnlink, adminUpdateUser, getUser, homeFor, resetAllData } from "@/lib/db";
import { adminOrNull, fail, json, readJson } from "@/lib/api";

export async function POST(req: Request) {
  try {
    return await handle(req);
  } catch (e) {
    console.error("admin route", e);
    return fail("Terjadi kesalahan di server. Muat ulang halaman lalu coba lagi.", 500);
  }
}

const who = (id: string) => {
  const u = getUser(id);
  return u ? `${u.nickname} (${u.username})` : id;
};

async function handle(req: Request) {
  const a = await adminOrNull();
  if (!a) return fail("Khusus admin.", 403);
  const b = await readJson(req);
  if (!b) return fail("Permintaan tidak valid.");
  const id = String(b.id ?? "");
  switch (b.action) {
    case "create": {
      const r = adminCreateUser({ role: String(b.role ?? ""), nickname: String(b.nickname ?? ""), username: String(b.username ?? ""), secret: String(b.secret ?? ""), level: b.level, avatar: String(b.avatar ?? "") });
      if (!r.ok) return fail(r.error);
      addLog(a, "Tambah pengguna", `${r.user.nickname} (${r.user.username}) sebagai ${r.user.role}`);
      return json({ ok: true, id: r.user.id, username: r.user.username });
    }
    case "update": {
      const r = adminUpdateUser(a, id, { nickname: b.nickname, username: b.username, level: b.level, avatar: b.avatar });
      if (!r.ok) return fail(r.error);
      addLog(a, "Ubah pengguna", who(id));
      return json({ ok: true });
    }
    case "secret": {
      const r = adminResetSecret(a, id, String(b.secret ?? ""));
      if (!r.ok) return fail(r.error);
      addLog(a, "Atur ulang kata sandi", who(id));
      return json({ ok: true });
    }
    case "delete": {
      const r = adminDeleteUser(a, id);
      if (!r.ok) return fail(r.error);
      addLog(a, "Hapus pengguna", r.name);
      return json({ ok: true, redirect: "/admin/pengguna" });
    }
    case "link":
    case "unlink": {
      const sid = String(b.studentId ?? "");
      const r = b.action === "link" ? adminLink(id, sid) : adminUnlink(id, sid);
      if (!r.ok) return fail(r.error);
      addLog(a, b.action === "link" ? "Hubungkan anak" : "Lepas anak", `${who(id)} ↔ ${who(sid)}`);
      return json({ ok: true });
    }
    case "reset-progress": {
      const r = adminResetProgress(id);
      if (!r.ok) return fail(r.error);
      addLog(a, "Kosongkan progres siswa", who(id));
      return json({ ok: true });
    }
    case "new-code": {
      const r = adminNewCode(id);
      if (!r.ok) return fail(r.error);
      addLog(a, "Buat kode orang tua baru", who(id));
      return json({ ok: true, code: r.code });
    }
    case "impersonate": {
      const u = getUser(id);
      if (!u) return fail("Pengguna tidak ditemukan.", 404);
      if (u.role === "admin") return fail("Tidak dapat masuk sebagai admin lain.", 403);
      if (u.role === "student" && !u.level) return fail("Siswa ini belum punya kelas.");
      addLog(a, "Lihat sebagai pengguna", who(id));
      await startSession(u.id, a.id);
      return json({ ok: true, redirect: homeFor(u) });
    }
    case "reset-all": {
      if (b.confirm !== "PULIHKAN") return fail("Ketik PULIHKAN untuk mengonfirmasi.");
      resetAllData();
      // Admin yang dibuat sendiri hilang setelah pemulihan: kembalikan ke halaman awal.
      const still = getUser(a.id);
      addLog(still ?? null, "Pulihkan data contoh", `oleh ${a.nickname} (${a.username})`);
      return json({ ok: true, redirect: still ? "/admin" : "/" });
    }
    default:
      return fail("Tindakan tidak dikenal.");
  }
}
