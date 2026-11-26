"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { post } from "@/lib/client";

type Res = { ok: boolean; error?: string; redirect?: string; username?: string; id?: string; code?: string };
type Msg = { ok: boolean; t: string } | null;

/** Menjalankan satu tindakan admin dan menyegarkan halaman. */
function useAct() {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<Msg>(null);
  const run = async (body: Record<string, unknown>, okText?: string, url = "/api/admin") => {
    setBusy(true);
    setMsg(null);
    const r = await post<Res>(url, body);
    setBusy(false);
    if (!r.ok) {
      setMsg({ ok: false, t: r.error ?? "Gagal. Coba lagi." });
      return r;
    }
    if (okText) setMsg({ ok: true, t: okText });
    if (r.redirect) {
      router.push(r.redirect);
    }
    router.refresh();
    return r;
  };
  return { busy, msg, setMsg, run };
}

function Pesan({ msg }: { msg: Msg }) {
  if (!msg) return null;
  return <span role={msg.ok ? "status" : "alert"} className={`text-sm font-semibold ${msg.ok ? "text-benar-tua" : "text-salah-tua"}`}>{msg.t}</span>;
}

export function BackToAdmin() {
  const { busy, msg, run } = useAct();
  return (
    <span className="flex items-center gap-3">
      <Pesan msg={msg} />
      <button type="button" className="tombol tombol-kecil" disabled={busy} onClick={() => run({ action: "kembali-admin" }, undefined, "/api/session")}>
        Kembali ke admin
      </button>
    </span>
  );
}

const ROLES = [
  { v: "student", t: "Siswa" },
  { v: "teacher", t: "Guru" },
  { v: "parent", t: "Orang tua" },
  { v: "admin", t: "Admin" },
];

type RoomOpt = { id: string; name: string; level: number };

/** Pilihan kelas yang dikelompokkan per tingkat. */
function RoomSelect({ id, value, onChange, rooms, coordinator }: { id: string; value: string; onChange: (v: string) => void; rooms: RoomOpt[]; coordinator?: boolean }) {
  const levels = [...new Set(rooms.map((r) => r.level))];
  return (
    <select id={id} className="isian mt-1" value={value} onChange={(e) => onChange(e.target.value)}>
      {coordinator && <option value="">Koordinator (semua kelas)</option>}
      {!coordinator && !value && <option value="">Pilih kelas…</option>}
      {levels.map((lv) => (
        <optgroup key={lv} label={`Tingkat ${lv}`}>
          {rooms.filter((r) => r.level === lv).map((r) => <option key={r.id} value={r.id}>{r.name}</option>)}
        </optgroup>
      ))}
    </select>
  );
}

export function CreateUser({ defaultRole = "student", rooms, defaultRoom = "" }: { defaultRole?: string; rooms: RoomOpt[]; defaultRoom?: string }) {
  const router = useRouter();
  const { busy, msg, setMsg, run } = useAct();
  const [role, setRole] = useState(defaultRole);
  const [nickname, setNickname] = useState("");
  const [username, setUsername] = useState("");
  const [secret, setSecret] = useState("");
  const [roomId, setRoomId] = useState(defaultRoom || rooms[0]?.id || "");
  const student = role === "student";
  return (
    <form
      className="kartu overflow-hidden"
      onSubmit={async (e) => {
        e.preventDefault();
        const r = await run({ action: "create", role, nickname, username, secret, roomId: role === "student" || role === "teacher" ? roomId : "" });
        if (r.ok) {
          setMsg({ ok: true, t: `Akun dibuat. Nama masuk: ${r.username}.` });
          setNickname("");
          setUsername("");
          setSecret("");
          router.refresh();
        }
      }}
    >
      <div className="p-6">
        <h2 className="text-lg">Tambah pengguna</h2>
        <p className="mt-1 text-sm text-tinta-2">Siswa memakai PIN 4 angka. Guru, orang tua, dan admin memakai kata sandi minimal 6 karakter.</p>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          <div>
            <label htmlFor="cu-role" className="label-kecil">Peran</label>
            <select id="cu-role" className="isian mt-1" value={role} onChange={(e) => { setRole(e.target.value); setSecret(""); }}>
              {ROLES.map((r) => <option key={r.v} value={r.v}>{r.t}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor="cu-nick" className="label-kecil">Nama panggilan</label>
            <input id="cu-nick" className="isian mt-1" maxLength={20} value={nickname} onChange={(e) => setNickname(e.target.value)} />
          </div>
          <div>
            <label htmlFor="cu-user" className="label-kecil">Nama masuk{student ? " (boleh kosong)" : ""}</label>
            <input id="cu-user" className="isian mt-1" maxLength={20} autoComplete="off" value={username} onChange={(e) => setUsername(e.target.value.toLowerCase())} placeholder={student ? "dibuat otomatis" : "huruf kecil"} />
          </div>
          <div>
            <label htmlFor="cu-secret" className="label-kecil">{student ? "PIN 4 angka" : "Kata sandi"}</label>
            <input
              id="cu-secret"
              className="isian mt-1"
              type={student ? "text" : "password"}
              inputMode={student ? "numeric" : undefined}
              autoComplete="new-password"
              maxLength={student ? 4 : 64}
              value={secret}
              onChange={(e) => setSecret(student ? e.target.value.replace(/\D/g, "") : e.target.value)}
            />
          </div>
          {(role === "student" || role === "teacher") && (
            <div>
              <label htmlFor="cu-level" className="label-kecil">Kelas</label>
              <RoomSelect id="cu-level" value={roomId} onChange={setRoomId} rooms={rooms} coordinator={role === "teacher"} />
            </div>
          )}
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-3 border-t border-tinta/10 bg-kertas-2/50 px-6 py-4">
        <button type="submit" className="tombol" disabled={busy || !nickname.trim() || (student ? secret.length !== 4 || !roomId : secret.length < 6 || username.length < 3)}>
          Tambah pengguna
        </button>
        <Pesan msg={msg} />
      </div>
    </form>
  );
}

export function EditUser({ id, role, nickname, username, roomId, rooms, demo }: { id: string; role: string; nickname: string; username: string; roomId?: string; rooms: RoomOpt[]; demo?: boolean }) {
  const { busy, msg, run } = useAct();
  const [nick, setNick] = useState(nickname);
  const [user, setUser] = useState(username);
  const [room, setRoom] = useState(roomId ?? "");
  const hasLevel = role === "student" || role === "teacher";
  const changed = nick !== nickname || user !== username || (hasLevel && room !== (roomId ?? ""));
  const target = rooms.find((r) => r.id === room);
  const current = rooms.find((r) => r.id === roomId);
  return (
    <form
      className="kartu overflow-hidden"
      onSubmit={(e) => {
        e.preventDefault();
        run({ action: "update", id, nickname: nick, username: user, roomId: hasLevel ? room : undefined }, "Perubahan tersimpan.");
      }}
    >
      <div className="p-6">
        <h2 className="text-lg">Data akun</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          <div>
            <label htmlFor="eu-nick" className="label-kecil">Nama panggilan</label>
            <input id="eu-nick" className="isian mt-1" maxLength={20} value={nick} onChange={(e) => setNick(e.target.value)} />
          </div>
          <div>
            <label htmlFor="eu-user" className="label-kecil">Nama masuk</label>
            <input id="eu-user" className="isian mt-1" maxLength={20} disabled={demo} value={user} onChange={(e) => setUser(e.target.value.toLowerCase())} />
          </div>
          {hasLevel && (
            <div>
              <label htmlFor="eu-level" className="label-kecil">Kelas</label>
              <RoomSelect id="eu-level" value={room} onChange={setRoom} rooms={rooms} coordinator={role === "teacher"} />
            </div>
          )}
        </div>
        {role === "student" && target && current && target.id !== current.id && (
          <p className="catatan mt-4 text-sm">
            {target.level === current.level ? "Pindah ke kelas lain di tingkat yang sama: progres, karya, dan nilai ikut pindah." : `Pindah ke tingkat ${target.level}: siswa mulai dari pertemuan 1 di materi tingkat ini. Progres tingkat lama tetap tersimpan.`}
          </p>
        )}
        {role === "teacher" && room !== (roomId ?? "") && !room && <p className="catatan mt-4 text-sm">Koordinator dapat melihat dan mengelola semua kelas.</p>}
      </div>
      <div className="flex flex-wrap items-center gap-3 border-t border-tinta/10 bg-kertas-2/50 px-6 py-4">
        <button type="submit" className="tombol" disabled={busy || !changed || !nick.trim() || (role === "student" && !room)}>Simpan perubahan</button>
        <Pesan msg={msg} />
      </div>
    </form>
  );
}

export function ResetSecret({ id, role }: { id: string; role: string }) {
  const { busy, msg, run } = useAct();
  const [secret, setSecret] = useState("");
  const student = role === "student";
  return (
    <form
      className="kartu p-6"
      onSubmit={async (e) => {
        e.preventDefault();
        const r = await run({ action: "secret", id, secret }, student ? "PIN baru tersimpan." : "Kata sandi baru tersimpan.");
        if (r.ok) setSecret("");
      }}
    >
      <h2 className="text-lg">{student ? "Atur ulang PIN" : "Atur ulang kata sandi"}</h2>
      <p className="mt-1 text-sm text-tinta-2">Berikan {student ? "PIN" : "kata sandi"} baru langsung kepada pemilik akun.</p>
      <div className="mt-4 flex flex-wrap items-end gap-3">
        <div className="w-full max-w-xs">
          <label htmlFor="rs-secret" className="label-kecil">{student ? "PIN baru (4 angka)" : "Kata sandi baru"}</label>
          <input
            id="rs-secret"
            className="isian mt-1"
            type={student ? "text" : "password"}
            inputMode={student ? "numeric" : undefined}
            autoComplete="new-password"
            maxLength={student ? 4 : 64}
            value={secret}
            onChange={(e) => setSecret(student ? e.target.value.replace(/\D/g, "") : e.target.value)}
          />
        </div>
        <button type="submit" className="tombol-2" disabled={busy || (student ? secret.length !== 4 : secret.length < 6)}>Simpan</button>
      </div>
      <p className="mt-2 min-h-5"><Pesan msg={msg} /></p>
    </form>
  );
}

/** Tombol satu klik dengan konfirmasi opsional. */
export function ActionButton({ body, label, confirm, okText, tone = "2", className = "" }: { body: Record<string, unknown>; label: string; confirm?: string; okText?: string; tone?: "1" | "2" | "bahaya"; className?: string }) {
  const { busy, msg, run } = useAct();
  const cls = tone === "1" ? "tombol" : tone === "bahaya" ? "tombol-2 !border-salah/40 !text-salah-tua hover:!bg-salah-muda" : "tombol-2";
  return (
    <span className={`inline-flex flex-wrap items-center gap-3 ${className}`}>
      <button
        type="button"
        className={`${cls} tombol-kecil`}
        disabled={busy}
        onClick={() => {
          if (confirm && !window.confirm(confirm)) return;
          run(body, okText);
        }}
      >
        {label}
      </button>
      <Pesan msg={msg} />
    </span>
  );
}

export function LinkStudent({ parentId, students }: { parentId: string; students: { id: string; name: string; level: number }[] }) {
  const { busy, msg, run } = useAct();
  const [sid, setSid] = useState("");
  if (students.length === 0) return <p className="text-sm text-tinta-2">Tidak ada siswa lain untuk dihubungkan.</p>;
  return (
    <form
      className="flex flex-wrap items-end gap-3"
      onSubmit={async (e) => {
        e.preventDefault();
        const r = await run({ action: "link", id: parentId, studentId: sid }, "Anak terhubung.");
        if (r.ok) setSid("");
      }}
    >
      <div className="w-full max-w-xs">
        <label htmlFor="ls-student" className="label-kecil">Hubungkan anak</label>
        <select id="ls-student" className="isian mt-1" value={sid} onChange={(e) => setSid(e.target.value)}>
          <option value="">Pilih siswa…</option>
          {students.map((s) => <option key={s.id} value={s.id}>{s.name} · Kelas {s.level}</option>)}
        </select>
      </div>
      <button type="submit" className="tombol-2" disabled={busy || !sid}>Hubungkan</button>
      <Pesan msg={msg} />
    </form>
  );
}

export function ResetAll() {
  const { busy, msg, run } = useAct();
  const [text, setText] = useState("");
  return (
    <form
      className="flex flex-wrap items-end gap-3"
      onSubmit={(e) => {
        e.preventDefault();
        if (!window.confirm("Semua akun, progres, karya, nilai, rapor, dan log akan kembali ke data contoh awal. Lanjutkan?")) return;
        run({ action: "reset-all", confirm: text }, "Data contoh dipulihkan.");
      }}
    >
      <div className="w-full max-w-xs">
        <label htmlFor="ra-text" className="label-kecil">Ketik PULIHKAN untuk mengonfirmasi</label>
        <input id="ra-text" className="isian mt-1" autoComplete="off" value={text} onChange={(e) => setText(e.target.value)} />
      </div>
      <button type="submit" className="tombol-2 !border-salah/40 !text-salah-tua hover:!bg-salah-muda" disabled={busy || text !== "PULIHKAN"}>Pulihkan data contoh</button>
      <Pesan msg={msg} />
    </form>
  );
}

type TeacherOpt = { id: string; name: string; className?: string };
const teacherLabel = (t: TeacherOpt) => `${t.name}${t.className ? ` (kini ${t.className})` : " (koordinator)"}`;

export function CreateRoom({ teachers }: { teachers: TeacherOpt[] }) {
  const { busy, msg, run } = useAct();
  const [name, setName] = useState("");
  const [level, setLevel] = useState("1");
  const [teacherId, setTeacherId] = useState("");
  return (
    <form
      className="kartu overflow-hidden"
      onSubmit={(e) => {
        e.preventDefault();
        run({ action: "room-create", name, level: Number(level), teacherId });
      }}
    >
      <div className="p-6">
        <h2 className="text-lg">Tambah kelas</h2>
        <p className="mt-1 text-sm text-tinta-2">Contoh: “Kelas 2B”. Materi dan proyek mengikuti tingkat yang dipilih. Siswa dan wali kelas bisa ditempatkan sesudahnya.</p>
        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          <div>
            <label htmlFor="cr-name" className="label-kecil">Nama kelas</label>
            <input id="cr-name" className="isian mt-1" maxLength={30} value={name} onChange={(e) => setName(e.target.value)} placeholder="Kelas 2B" />
          </div>
          <div>
            <label htmlFor="cr-level" className="label-kecil">Tingkat (materi)</label>
            <select id="cr-level" className="isian mt-1" value={level} onChange={(e) => setLevel(e.target.value)}>
              {[1, 2, 3, 4, 5, 6].map((n) => <option key={n} value={n}>Tingkat {n}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor="cr-teacher" className="label-kecil">Wali kelas (opsional)</label>
            <select id="cr-teacher" className="isian mt-1" value={teacherId} onChange={(e) => setTeacherId(e.target.value)}>
              <option value="">Nanti saja</option>
              {teachers.map((t) => <option key={t.id} value={t.id}>{teacherLabel(t)}</option>)}
            </select>
          </div>
        </div>
        {teacherId && <p className="catatan mt-4 text-sm">Guru yang dipilih dipindahkan menjadi wali kelas baru ini.</p>}
      </div>
      <div className="flex flex-wrap items-center gap-3 border-t border-tinta/10 bg-kertas-2/50 px-6 py-4">
        <button type="submit" className="tombol" disabled={busy || name.trim().length < 2}>Tambah kelas</button>
        <Pesan msg={msg} />
      </div>
    </form>
  );
}

export function RoomSettings({ id, name, level, hasStudents, teachers }: { id: string; name: string; level: number; hasStudents: boolean; teachers: TeacherOpt[] }) {
  const { busy, msg, run } = useAct();
  const [n, setN] = useState(name);
  const [lv, setLv] = useState(String(level));
  const [teacherId, setTeacherId] = useState("");
  const changed = n.trim() !== name || lv !== String(level) || !!teacherId;
  return (
    <form
      className="kartu overflow-hidden"
      onSubmit={async (e) => {
        e.preventDefault();
        const r = await run({ action: "room-update", id, name: n, level: Number(lv), teacherId }, "Kelas diperbarui.");
        if (r.ok) setTeacherId("");
      }}
    >
      <div className="p-6">
        <h2 className="text-lg">Pengaturan kelas</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          <div>
            <label htmlFor="rs-name" className="label-kecil">Nama kelas</label>
            <input id="rs-name" className="isian mt-1" maxLength={30} value={n} onChange={(e) => setN(e.target.value)} />
          </div>
          <div>
            <label htmlFor="rs-level" className="label-kecil">Tingkat (materi)</label>
            <select id="rs-level" className="isian mt-1" value={lv} disabled={hasStudents} onChange={(e) => setLv(e.target.value)}>
              {[1, 2, 3, 4, 5, 6].map((x) => <option key={x} value={x}>Tingkat {x}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor="rs-teacher" className="label-kecil">Tambah wali kelas</label>
            <select id="rs-teacher" className="isian mt-1" value={teacherId} onChange={(e) => setTeacherId(e.target.value)}>
              <option value="">Pilih guru…</option>
              {teachers.map((t) => <option key={t.id} value={t.id}>{teacherLabel(t)}</option>)}
            </select>
          </div>
        </div>
        {hasStudents && <p className="mt-3 text-xs text-tinta-2">Tingkat terkunci karena kelas sudah punya siswa.</p>}
      </div>
      <div className="flex flex-wrap items-center gap-3 border-t border-tinta/10 bg-kertas-2/50 px-6 py-4">
        <button type="submit" className="tombol" disabled={busy || !changed || n.trim().length < 2}>Simpan</button>
        <Pesan msg={msg} />
      </div>
    </form>
  );
}

export function MoveRoom({ id, targets }: { id: string; targets: { id: string; name: string }[] }) {
  const { busy, msg, run } = useAct();
  const [to, setTo] = useState("");
  if (targets.length === 0) return <p className="text-sm text-tinta-2">Belum ada kelas lain di tingkat yang sama. Tambah kelas baru untuk memindahkan siswa.</p>;
  return (
    <form
      className="flex flex-wrap items-end gap-3"
      onSubmit={async (e) => {
        e.preventDefault();
        if (!window.confirm("Pindahkan semua siswa kelas ini ke kelas tujuan? Progres, karya, dan nilai ikut pindah.")) return;
        const r = await run({ action: "room-move", id, to });
        if (r.ok) setTo("");
      }}
    >
      <div className="w-full max-w-xs">
        <label htmlFor="mr-to" className="label-kecil">Pindahkan semua siswa ke</label>
        <select id="mr-to" className="isian mt-1" value={to} onChange={(e) => setTo(e.target.value)}>
          <option value="">Pilih kelas…</option>
          {targets.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
        </select>
      </div>
      <button type="submit" className="tombol-2" disabled={busy || !to}>Pindahkan</button>
      <Pesan msg={msg} />
    </form>
  );
}
