"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CLASSES } from "@/lib/curriculum/types";
import { post } from "@/lib/client";

export function MoveStudent({ id, level, nickname }: { id: string; level: number; nickname: string }) {
  const router = useRouter();
  const [to, setTo] = useState(level);
  const [busy, setBusy] = useState(false);
  return (
    <span className="flex items-center gap-2">
      <select aria-label={`Kelas baru untuk ${nickname}`} className="isian !min-h-9 !w-28 !py-1 text-sm" value={to} onChange={(e) => setTo(Number(e.target.value))}>
        {CLASSES.map((c) => <option key={c.level} value={c.level}>Kelas {c.level}</option>)}
      </select>
      <button
        type="button"
        className="tombol-2 tombol-kecil"
        disabled={busy || to === level}
        onClick={async () => {
          setBusy(true);
          await post("/api/teacher", { action: "move", id, level: to });
          setBusy(false);
          router.refresh();
        }}
      >
        Pindahkan
      </button>
    </span>
  );
}

export function AddStudent({ level }: { level: number }) {
  const router = useRouter();
  const [nick, setNick] = useState("");
  const [pin, setPin] = useState("");
  const [av, setAv] = useState("a1");
  const [msg, setMsg] = useState<{ ok: boolean; t: string } | null>(null);
  return (
    <form
      className="kartu overflow-hidden"
      onSubmit={async (e) => {
        e.preventDefault();
        const r = await post<{ ok: boolean; error?: string; username?: string }>("/api/teacher", { action: "create-student", nickname: nick, pin, avatar: av, level });
        if (r.ok) {
          setMsg({ ok: true, t: `Siswa ditambahkan ke kelas ${level}. Nama masuk: ${r.username} · PIN sesuai yang Anda isi.` });
          setNick("");
          setPin("");
          router.refresh();
        } else setMsg({ ok: false, t: r.error ?? "Gagal menambah siswa." });
      }}
    >
      <div className="p-6">
      <h3 className="text-lg">Tambah siswa ke kelas {level}</h3>
      <p className="mt-1 text-sm text-tinta-2">Siswa baru mulai dari pertemuan 1. Nama masuk dibuat otomatis dari nama panggilan.</p>
      <div className="mt-4 flex flex-wrap gap-4">
        <div className="min-w-[180px] max-w-sm flex-1">
          <label htmlFor="nick" className="label-kecil">Nama panggilan</label>
          <input id="nick" className="isian mt-1" value={nick} maxLength={20} onChange={(e) => setNick(e.target.value)} />
        </div>
        <div className="w-32">
          <label htmlFor="pin" className="label-kecil">PIN 4 angka</label>
          <input id="pin" inputMode="numeric" pattern="\d{4}" maxLength={4} className="isian mt-1" value={pin} onChange={(e) => setPin(e.target.value.replace(/\D/g, ""))} />
        </div>
      </div>
      </div>
      <div className="flex flex-wrap items-center gap-3 border-t border-tinta/10 bg-kertas-2/50 px-6 py-4">
        <button type="submit" className="tombol" disabled={!nick.trim() || pin.length !== 4}>Tambah siswa</button>
        {msg && <span role="status" className={`text-sm font-semibold ${msg.ok ? "text-kobalt" : "text-tinta"}`}>{msg.t}</span>}
      </div>
    </form>
  );
}

export function ReviewForm({ workId, status, initialComment }: { workId: string; status: string; initialComment?: string }) {
  const router = useRouter();
  const [text, setText] = useState(initialComment ?? "");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ ok: boolean; t: string } | null>(null);
  const act = async (reviewAction: "revise" | "publish") => {
    setBusy(true);
    const r = await post("/api/teacher", { action: "review", workId, reviewAction, comment: text });
    setBusy(false);
    if (r.ok) {
      setMsg({ ok: true, t: reviewAction === "revise" ? "Permintaan perbaikan terkirim ke siswa." : "Karya ditampilkan di galeri kelas." });
      router.refresh();
    } else setMsg({ ok: false, t: r.error ?? "Gagal." });
  };
  return (
    <div className="kartu p-5">
      <label htmlFor="komentar" className="font-judul text-lg font-bold">Satu komentar yang mudah ditindaklanjuti</label>
      <textarea
        id="komentar"
        className="isian mt-3 min-h-32"
        maxLength={400}
        placeholder="Contoh: Tombol Hobi sudah terlihat. Coba klik dan periksa apakah halaman berpindah ke bagian yang benar."
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <p className="mt-1 text-sm text-tinta-2">Sebut apa yang sudah baik, lalu satu hal yang bisa dicoba siswa. Status sekarang: {status}.</p>
      <div className="mt-4 grid grid-cols-2 gap-3">
        <button type="button" className="tombol-2" disabled={busy || !text.trim()} onClick={() => act("revise")}>Minta perbaikan</button>
        <button type="button" className="tombol" disabled={busy} onClick={() => act("publish")}>Tampilkan di galeri</button>
      </div>
      {msg && <p role="status" className={`mt-3 text-sm font-semibold ${msg.ok ? "text-kobalt" : "text-tinta"}`}>{msg.t}</p>}
    </div>
  );
}

export function ParentNoteForm({ studentId, name }: { studentId: string; name: string }) {
  const router = useRouter();
  const [text, setText] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ ok: boolean; t: string } | null>(null);
  const send = async () => {
    setBusy(true);
    const r = await post("/api/teacher", { action: "parent-note", studentId, text });
    setBusy(false);
    if (r.ok) {
      setText("");
      setMsg({ ok: true, t: "Catatan terkirim. Orang tua bisa melihatnya di halaman Catatan Guru." });
      router.refresh();
    } else setMsg({ ok: false, t: r.error ?? "Gagal." });
  };
  return (
    <div className="kartu p-5">
      <label htmlFor="catatan-ortu" className="font-judul text-lg font-bold">Catatan untuk orang tua {name}</label>
      <textarea
        id="catatan-ortu"
        className="isian mt-3 min-h-24"
        maxLength={500}
        placeholder="Contoh: Minggu ini sudah paham memilih warna. Di rumah, minta ia menceritakan halaman buatannya."
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <button type="button" className="tombol-2 mt-3" disabled={busy || !text.trim()} onClick={send}>Kirim ke orang tua</button>
      {msg && <p role="status" className={`mt-3 text-sm font-semibold ${msg.ok ? "text-kobalt" : "text-tinta"}`}>{msg.t}</p>}
    </div>
  );
}
