"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { post } from "@/lib/client";

type Msg = { ok: boolean; t: string } | null;

export function PrintButton() {
  return (
    <button type="button" className="tombol-2" onClick={() => window.print()}>
      Cetak atau simpan sebagai PDF
    </button>
  );
}

function useSave() {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<Msg>(null);
  const run = async (body: unknown, okText: string) => {
    setBusy(true);
    setMsg(null);
    const r = await post("/api/teacher", body);
    setBusy(false);
    if (r.ok) {
      setMsg({ ok: true, t: okText });
      router.refresh();
    } else setMsg({ ok: false, t: r.error ?? "Gagal menyimpan." });
    return r;
  };
  return { busy, msg, run, setMsg };
}

const Note = ({ msg }: { msg: Msg }) => (msg ? <p role={msg.ok ? "status" : "alert"} className={`text-sm font-semibold ${msg.ok ? "text-kobalt" : "text-salah-tua"}`}>{msg.t}</p> : null);

/** Nilai guru untuk satu pertemuan. Kosongkan nilai untuk memakai nilai otomatis. */
export function LessonGrade({ studentId, no, auto, score, note }: { studentId: string; no: number; auto: number | null; score?: number; note?: string }) {
  const { busy, msg, run } = useSave();
  const [v, setV] = useState(score === undefined ? "" : String(score));
  const [n, setN] = useState(note ?? "");
  const invalid = v !== "" && !(Number.isInteger(Number(v)) && Number(v) >= 0 && Number(v) <= 100);
  return (
    <form
      className="flex flex-wrap items-end gap-3"
      onSubmit={(e) => {
        e.preventDefault();
        void run({ action: "grade-lesson", studentId, no, score: v === "" ? null : Number(v), note: n }, v === "" ? "Memakai nilai otomatis." : "Nilai tersimpan.");
      }}
    >
      <div>
        <label htmlFor={`nl-${no}`} className="label-kecil">Nilai guru (0–100)</label>
        <input id={`nl-${no}`} inputMode="numeric" className="isian mt-1 !w-28" placeholder={auto === null ? "kosong" : `otomatis ${auto}`} value={v} maxLength={3} onChange={(e) => setV(e.target.value.replace(/\D/g, ""))} aria-invalid={invalid} />
      </div>
      <div className="min-w-[200px] flex-1">
        <label htmlFor={`nn-${no}`} className="label-kecil">Catatan (opsional)</label>
        <input id={`nn-${no}`} className="isian mt-1" maxLength={300} value={n} onChange={(e) => setN(e.target.value)} />
      </div>
      <button type="submit" className="tombol tombol-kecil" disabled={busy || invalid}>Simpan</button>
      <Note msg={msg} />
    </form>
  );
}

/** Nilai karya proyek atau sikap dan keaktifan. */
export function ComponentGrade({ studentId, kind, score, note, disabledReason }: { studentId: string; kind: "karya" | "sikap"; score?: number; note?: string; disabledReason?: string }) {
  const { busy, msg, run } = useSave();
  const [v, setV] = useState(score === undefined ? "" : String(score));
  const [n, setN] = useState(note ?? "");
  const invalid = v !== "" && !(Number.isInteger(Number(v)) && Number(v) >= 0 && Number(v) <= 100);
  return (
    <form
      className="flex flex-wrap items-end gap-3"
      onSubmit={(e) => {
        e.preventDefault();
        void run({ action: "grade-component", studentId, kind, score: v === "" ? null : Number(v), note: n }, v === "" ? "Nilai dihapus." : "Nilai tersimpan.");
      }}
    >
      <div>
        <label htmlFor={`k-${kind}`} className="label-kecil">Nilai (0–100)</label>
        <input id={`k-${kind}`} inputMode="numeric" className="isian mt-1 !w-28" value={v} maxLength={3} disabled={!!disabledReason} onChange={(e) => setV(e.target.value.replace(/\D/g, ""))} aria-invalid={invalid} />
      </div>
      <div className="min-w-[200px] flex-1">
        <label htmlFor={`kn-${kind}`} className="label-kecil">Catatan untuk rapor (opsional)</label>
        <input id={`kn-${kind}`} className="isian mt-1" maxLength={300} value={n} disabled={!!disabledReason} onChange={(e) => setN(e.target.value)} />
      </div>
      <button type="submit" className="tombol tombol-kecil" disabled={busy || invalid || !!disabledReason}>Simpan</button>
      {disabledReason && <p className="w-full text-sm text-tinta-2">{disabledReason}</p>}
      <Note msg={msg} />
    </form>
  );
}

/** Membuat draf rapor satu siswa lalu mengirimkannya. */
export function ReportActions({ studentId, status, catatan, ready }: { studentId: string; status: "belum" | "draf" | "terkirim" | "diperbarui"; catatan: string; ready: boolean }) {
  const { busy, msg, run } = useSave();
  const [c, setC] = useState(catatan);
  return (
    <div className="flex flex-col gap-3">
      <div>
        <label htmlFor="cat-rapor" className="label-kecil">Catatan wali kelas untuk rapor</label>
        <textarea id="cat-rapor" className="isian mt-1 min-h-24" maxLength={500} value={c} onChange={(e) => setC(e.target.value)} placeholder="Contoh: Ananda aktif bertanya dan senang membantu teman." />
        <p className="mt-1 text-xs text-tinta-2">{c.length}/500</p>
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <button type="button" className="tombol-2" disabled={busy || !ready} onClick={() => run({ action: "make-report", studentId, catatan: c }, status === "belum" ? "Rapor dibuat. Periksa pratinjau di bawah." : "Rapor diperbarui dari nilai terbaru.")}>
          {status === "belum" ? "Buat rapor otomatis" : "Perbarui rapor dari nilai terbaru"}
        </button>
        <button
          type="button"
          className="tombol"
          disabled={busy || status === "belum" || status === "terkirim"}
          onClick={() => {
            if (window.confirm("Kirim rapor ini ke siswa dan orang tua yang terhubung?")) void run({ action: "send-report", studentId }, "Rapor terkirim ke siswa dan orang tua.");
          }}
        >
          {status === "diperbarui" ? "Kirim ulang rapor" : status === "terkirim" ? "Sudah terkirim" : "Kirim rapor"}
        </button>
      </div>
      {!ready && <p className="text-sm text-tinta-2">Lengkapi dulu nilai pertemuan, nilai karya, dan nilai sikap.</p>}
      <Note msg={msg} />
    </div>
  );
}

/** Membuat atau mengirim rapor seluruh siswa di kelas sekaligus. */
export function ClassReportActions({ roomId }: { roomId: string }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [res, setRes] = useState<{ done: string[]; skipped: string[]; mode: "make" | "send" } | null>(null);
  const [err, setErr] = useState("");
  const go = async (mode: "make" | "send") => {
    if (mode === "send" && !window.confirm("Kirim semua rapor yang sudah dibuat ke siswa dan orang tua masing-masing?")) return;
    setBusy(true);
    setErr("");
    const r = await post<{ ok: boolean; error?: string; done?: string[]; skipped?: string[] }>("/api/teacher", { action: "class-reports", roomId, mode });
    setBusy(false);
    if (r.ok) {
      setRes({ done: r.done ?? [], skipped: r.skipped ?? [], mode });
      router.refresh();
    } else setErr(r.error ?? "Gagal.");
  };
  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap gap-3">
        <button type="button" className="tombol-2" disabled={busy} onClick={() => go("make")}>Buat rapor semua siswa</button>
        <button type="button" className="tombol" disabled={busy} onClick={() => go("send")}>Kirim semua rapor</button>
      </div>
      {err && <p role="alert" className="text-sm font-semibold text-salah-tua">{err}</p>}
      {res && (
        <div role="status" className="catatan text-sm">
          <p className="font-semibold">{res.mode === "make" ? `${res.done.length} rapor dibuat atau diperbarui.` : `${res.done.length} rapor terkirim.`}</p>
          {res.skipped.length > 0 && (
            <ul className="mt-1 list-disc pl-5 text-tinta-2">
              {res.skipped.map((s) => <li key={s}>{s}</li>)}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
