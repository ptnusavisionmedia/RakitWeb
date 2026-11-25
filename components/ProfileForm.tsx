"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { post } from "@/lib/client";

export function ProfileForm({ nickname, avatar, demo }: { nickname: string; avatar: string; demo: boolean }) {
  const router = useRouter();
  const [name, setName] = useState(nickname);
  const [msg, setMsg] = useState<string | null>(null);

  const save = async () => {
    const r = await post("/api/profile", { nickname: name, avatar });
    setMsg(r.ok ? "Profil tersimpan." : (r.error ?? "Belum tersimpan."));
    router.refresh();
  };
  const logout = async () => {
    const r = await post<{ redirect?: string }>("/api/session", { action: "logout" });
    router.push(r.redirect ?? "/");
    router.refresh();
  };
  return (
    <>
      <section className="kartu overflow-hidden">
        <div className="p-6">
          <h2 className="text-lg">Nama panggilan</h2>
          <p className="mt-1 text-sm text-tinta-2">Nama ini tampil di galeri kelas. Pakai nama panggilan, bukan nama lengkap.</p>
          <label htmlFor="panggilan" className="sr-only">Nama panggilan</label>
          <input id="panggilan" className="isian mt-4 max-w-sm" value={name} maxLength={20} onChange={(e) => setName(e.target.value)} />
        </div>
        <div className="flex flex-wrap items-center gap-3 border-t border-tinta/10 bg-kertas-2/50 px-6 py-4">
          <button type="button" className="tombol" disabled={!name.trim() || name === nickname} onClick={save}>Simpan profil</button>
          {msg && <span role="status" className="text-sm font-semibold text-kobalt">{msg}</span>}
        </div>
      </section>

      <section className="kartu divide-y divide-tinta/10">
        {demo && (
          <>
            <div className="flex flex-wrap items-center justify-between gap-4 p-6">
              <div>
                <h2 className="text-base">Ganti kelas demo</h2>
                <p className="text-sm text-tinta-2">Keluar lalu pilih jalur kelas lain untuk dicoba.</p>
              </div>
              <button
                type="button"
                className="tombol-2"
                onClick={async () => {
                  await post("/api/session", { action: "logout" });
                  window.location.href = "/?demo=siswa";
                }}
              >
                Ganti kelas demo
              </button>
            </div>
            <div className="flex flex-wrap items-center justify-between gap-4 p-6">
              <div>
                <h2 className="text-base">Mulai demo dari awal</h2>
                <p className="text-sm text-tinta-2">Progres dan karya demo kelas ini akan dihapus.</p>
              </div>
              <button
                type="button"
                className="tombol-2"
                onClick={async () => {
                  if (!window.confirm("Mulai demo dari awal? Progres dan karya demo kelas ini akan dihapus.")) return;
                  await post("/api/profile", { action: "reset-demo" });
                  router.push("/belajar");
                  router.refresh();
                }}
              >
                Mulai demo dari awal
              </button>
            </div>
          </>
        )}
        <div className="flex flex-wrap items-center justify-between gap-4 p-6">
          <div>
            <h2 className="text-base">Keluar</h2>
            <p className="text-sm text-tinta-2">Pekerjaanmu tetap tersimpan dan bisa dilanjutkan saat masuk lagi.</p>
          </div>
          <button type="button" className="tombol-2" onClick={logout}>Keluar</button>
        </div>
      </section>
    </>
  );
}
