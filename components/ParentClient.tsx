"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { post } from "@/lib/client";

type Kid = { id: string; name: string; level: number; className?: string };

/** Pemilih anak di bagian atas semua halaman orang tua. */
export function ChildBar({ kids, selectedId }: { kids: Kid[]; selectedId: string }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  if (kids.length === 0) return null;
  return (
    <div className="mb-6 flex flex-wrap items-center gap-x-4 gap-y-2 rounded-xl border border-tinta/10 bg-white px-4 py-2.5">
      <span className="label-kecil">Memantau</span>
      {kids.length > 1 ? (
        <select
          aria-label="Pilih anak"
          className="isian !min-h-9 !w-auto !py-1 text-sm font-semibold"
          value={selectedId}
          disabled={busy}
          onChange={async (e) => {
            setBusy(true);
            await post("/api/parent", { action: "pilih", childId: e.target.value });
            setBusy(false);
            router.refresh();
          }}
        >
          {kids.map((k) => (
            <option key={k.id} value={k.id}>{k.name} · {k.className ?? `Kelas ${k.level}`}</option>
          ))}
        </select>
      ) : (
        <span className="font-semibold">{kids[0].name} · {kids[0].className ?? `Kelas ${kids[0].level}`}</span>
      )}
      <Link href="/ortu/kelas" className="tautan ml-auto text-sm">Tambah anak atau cari kelas →</Link>
    </div>
  );
}

/** Formulir kode orang tua untuk menghubungkan satu anak dari hasil pencarian. */
export function LinkChild({ studentId, name }: { studentId: string; name: string }) {
  const router = useRouter();
  const [code, setCode] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  return (
    <form
      className="flex flex-wrap items-center gap-2"
      onSubmit={async (e) => {
        e.preventDefault();
        setBusy(true);
        setErr("");
        const r = await post("/api/parent", { action: "hubungkan", studentId, code });
        setBusy(false);
        if (r.ok) {
          router.push("/ortu");
          router.refresh();
        } else setErr(r.error ?? "Gagal menghubungkan.");
      }}
    >
      <label htmlFor={`kode-${studentId}`} className="sr-only">Kode orang tua untuk {name}</label>
      <input
        id={`kode-${studentId}`}
        className="isian !min-h-10 !w-36 !py-1 font-mono uppercase tracking-widest"
        placeholder="KODE"
        maxLength={6}
        autoComplete="off"
        value={code}
        onChange={(e) => setCode(e.target.value.replace(/[^a-zA-Z0-9]/g, "").toUpperCase())}
      />
      <button type="submit" className="tombol tombol-kecil" disabled={busy || code.length !== 6}>Hubungkan</button>
      {err && <p role="alert" className="w-full text-sm font-semibold text-salah-tua">{err}</p>}
    </form>
  );
}

export function UnlinkButton({ childId, name }: { childId: string; name: string }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  return (
    <button
      type="button"
      className="tombol-2 tombol-kecil"
      disabled={busy}
      aria-label={`Lepas ${name} dari akun`}
      onClick={async () => {
        if (!window.confirm(`Lepas ${name} dari akun Anda? Anda bisa menghubungkannya lagi dengan kode.`)) return;
        setBusy(true);
        await post("/api/parent", { action: "lepas", childId });
        setBusy(false);
        router.refresh();
      }}
    >
      Lepas
    </button>
  );
}
