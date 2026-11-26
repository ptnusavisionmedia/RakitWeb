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

export function CreateUser({ defaultRole = "student" }: { defaultRole?: string }) {
  const router = useRouter();
  const { busy, msg, setMsg, run } = useAct();
  const [role, setRole] = useState(defaultRole);
  const [nickname, setNickname] = useState("");
  const [username, setUsername] = useState("");
  const [secret, setSecret] = useState("");
  const [level, setLevel] = useState("1");
  const student = role === "student";
  return (
    <form
      className="kartu overflow-hidden"
      onSubmit={async (e) => {
        e.preventDefault();
        const r = await run({ action: "create", role, nickname, username, secret, level: role === "student" || role === "teacher" ? Number(level) : 0 });
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
              <select id="cu-level" className="isian mt-1" value={level} onChange={(e) => setLevel(e.target.value)}>
                {role === "teacher" && <option value="0">Koordinator (semua kelas)</option>}
                {[1, 2, 3, 4, 5, 6].map((n) => <option key={n} value={n}>Kelas {n}</option>)}
              </select>
            </div>
          )}
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-3 border-t border-tinta/10 bg-kertas-2/50 px-6 py-4">
        <button type="submit" className="tombol" disabled={busy || !nickname.trim() || (student ? secret.length !== 4 : secret.length < 6 || username.length < 3)}>
          Tambah pengguna
        </button>
        <Pesan msg={msg} />
      </div>
    </form>
  );
}

export function EditUser({ id, role, nickname, username, level, demo }: { id: string; role: string; nickname: string; username: string; level?: number; demo?: boolean }) {
  const { busy, msg, run } = useAct();
  const [nick, setNick] = useState(nickname);
  const [user, setUser] = useState(username);
  const [lv, setLv] = useState(String(level ?? 0));
  const hasLevel = role === "student" || role === "teacher";
  const changed = nick !== nickname || user !== username || (hasLevel && lv !== String(level ?? 0));
  return (
    <form
      className="kartu overflow-hidden"
      onSubmit={(e) => {
        e.preventDefault();
        run({ action: "update", id, nickname: nick, username: user, level: hasLevel ? Number(lv) : undefined }, "Perubahan tersimpan.");
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
              <select id="eu-level" className="isian mt-1" value={lv} onChange={(e) => setLv(e.target.value)}>
                {role === "teacher" && <option value="0">Koordinator (semua kelas)</option>}
                {[1, 2, 3, 4, 5, 6].map((n) => <option key={n} value={n}>Kelas {n}</option>)}
              </select>
            </div>
          )}
        </div>
        {role === "student" && lv !== String(level ?? 0) && <p className="catatan mt-4 text-sm">Pindah kelas: siswa mulai dari pertemuan 1 di kelas baru. Progres kelas lama tetap tersimpan.</p>}
      </div>
      <div className="flex flex-wrap items-center gap-3 border-t border-tinta/10 bg-kertas-2/50 px-6 py-4">
        <button type="submit" className="tombol" disabled={busy || !changed || !nick.trim()}>Simpan perubahan</button>
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
