import { startSession } from "@/lib/auth";
import { addLog, adminCreateUser, adminDeleteUser, adminLink, adminNewCode, adminResetProgress, adminResetSecret, adminUnlink, adminUpdateUser, createRoom, deleteRoom, getRoom, getUser, homeFor, moveRoomStudents, resetAllData, updateRoom } from "@/lib/db";
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
      const r = adminCreateUser({ role: String(b.role ?? ""), nickname: String(b.nickname ?? ""), username: String(b.username ?? ""), secret: String(b.secret ?? ""), roomId: b.roomId, avatar: String(b.avatar ?? "") });
      if (!r.ok) return fail(r.error);
      addLog(a, "Tambah pengguna", `${r.user.nickname} (${r.user.username}) sebagai ${r.user.role}${r.user.classId ? ` di [${getRoom(r.user.classId)?.name}]` : ""}`);
      return json({ ok: true, id: r.user.id, username: r.user.username });
    }
    case "update": {
      const r = adminUpdateUser(a, id, { nickname: b.nickname, username: b.username, roomId: b.roomId, avatar: b.avatar });
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
    case "room-create": {
      const r = createRoom({ name: b.name, level: b.level, teacherId: b.teacherId });
      if (!r.ok) return fail(r.error);
      addLog(a, "Tambah kelas", `[${r.room.name}] tingkat ${r.room.level}`);
      return json({ ok: true, id: r.room.id, redirect: `/admin/kelas/${r.room.id}` });
    }
    case "room-update": {
      const before = getRoom(id)?.name;
      const r = updateRoom(id, { name: b.name, level: b.level, teacherId: b.teacherId });
      if (!r.ok) return fail(r.error);
      const after = getRoom(id)?.name;
      addLog(a, "Ubah kelas", before && before !== after ? `[${before}] menjadi [${after}]` : `[${after}]`);
      return json({ ok: true });
    }
    case "room-delete": {
      const r = deleteRoom(id);
      if (!r.ok) return fail(r.error);
      addLog(a, "Hapus kelas", `[${r.name}]`);
      return json({ ok: true, redirect: "/admin/kelas" });
    }
    case "room-move": {
      const to = String(b.to ?? "");
      const r = moveRoomStudents(id, to);
      if (!r.ok) return fail(r.error);
      addLog(a, "Pindahkan siswa satu kelas", `${r.moved} siswa dari [${getRoom(id)?.name}] ke [${getRoom(to)?.name}]`);
      return json({ ok: true, moved: r.moved });
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
