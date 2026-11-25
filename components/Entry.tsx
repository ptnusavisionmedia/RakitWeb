"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CLASSES } from "@/lib/curriculum/types";
import { post } from "@/lib/client";
import { Ikon, IkonKotak, JendelaKode } from "./Deco";
import { Reveal } from "./Reveal";

const FITUR: [string, string, string][] = [
  ["buku", "Pelajaran terstruktur", "Setiap pertemuan punya tujuan, contoh konkret, langkah praktik, dan tanda berhasil yang bisa diamati."],
  ["susun", "Editor visual kelas 1–3", "Siswa menyusun halaman “Tentang Aku” dari blok, memilih gambar dan warna, lalu melihat hasilnya."],
  ["kode", "Editor kode kelas 4–6", "HTML, CSS, dan JavaScript dengan pratinjau langsung yang terisolasi. Tab baru muncul saat sudah diajarkan."],
  ["komentar", "Tinjauan guru", "Guru memberi satu komentar yang bisa ditindaklanjuti, meminta perbaikan, atau menampilkan karya."],
  ["galeri", "Galeri khusus kelas", "Karya yang dipublikasikan hanya terlihat oleh anggota kelas yang sama."],
  ["kunci", "Aman untuk anak", "Hanya nama panggilan. Ada pemeriksa privasi sebelum karya dikirim."],
];

const ALUR: [string, string, string][] = [
  ["buku", "Belajar", "Siswa membuka pertemuan terakhir dan melanjutkan pekerjaan yang tersimpan."],
  ["kode", "Berlatih", "Karya dikerjakan di editor dan tersimpan otomatis sebagai draf."],
  ["kirim", "Kirim ke guru", "Guru meninjau, lalu memberi komentar atau meminta perbaikan."],
  ["galeri", "Tampil di galeri", "Karya yang lolos tampil di galeri kelas."],
];

type Mode = "home" | "siswa" | "guru" | "daftar";

/** Dua kelas contoh yang berisi siswa, karya, dan catatan lengkap untuk demo guru. */
const DEMO_GURU = [{ level: 2, nama: "Bu Rina" }, { level: 5, nama: "Pak Andi" }];

export function Entry({ initialMode }: { initialMode: Mode }) {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>(initialMode);
  const [username, setUsername] = useState("");
  const [secret, setSecret] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [reg, setReg] = useState({ nickname: "", username: "", secret: "", code: "" });

  const go = async (body: Record<string, unknown>) => {
    setBusy(true);
    setErr(null);
    const r = await post("/api/session", body);
    if (r.ok && r.redirect) {
      router.push(r.redirect);
      router.refresh();
    } else {
      setErr(r.error ?? "Belum bisa masuk.");
      setBusy(false);
    }
  };

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <div className="pita !rounded-none">
        <header className="mx-auto flex max-w-[1360px] items-center gap-6 px-6 py-5">
          <span className="flex items-center gap-2 font-judul text-[1.05rem] font-extrabold tracking-tight">
            <span aria-hidden="true" className="grid h-7 w-7 place-items-center rounded-lg bg-white font-kode text-[11px] font-bold text-kobalt">&lt;/&gt;</span>
            <span>RakitWeb</span>
          </span>
          <nav aria-label="Bagian halaman" className="ml-auto hidden items-center gap-6 text-sm font-semibold text-white/75 sm:flex">
            <a href="#jalur" className="hover:text-white">Jalur kelas</a>
            <a href="#fitur" className="hover:text-white">Fitur</a>
            <a href="#alur" className="hover:text-white">Alur karya</a>
          </nav>
        </header>
        <div className="mx-auto grid max-w-[1360px] gap-12 px-6 pb-20 pt-8 lg:grid-cols-[1fr_400px] lg:pb-24 lg:pt-14">
          <div className="berurutan">
            <p className="inline-flex w-fit items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold ring-1 ring-white/15">
              <span className="h-1.5 w-1.5 rounded-full bg-white" />Kursus pemrograman web untuk SD
            </p>
            <h1 className="mt-5 max-w-2xl text-4xl sm:text-[3.25rem] sm:leading-[1.08]">Belajar membuat website, dari kelas 1 sampai kelas 6.</h1>
            <p className="redup mt-5 max-w-xl text-lg">
              Siswa mengerjakan pelajaran, berlatih di editor, dan menyimpan karya dalam satu platform. Guru mengelola kelas, menyiapkan materi, dan memberi umpan balik atas setiap karya.
            </p>
            <dl className="mt-10 grid max-w-xl grid-cols-3 gap-6 border-t border-white/15 pt-6">
              {[["72", "pertemuan terstruktur"], ["6", "jalur kelas"], ["3", "langkah guru: kelas, materi, tinjau"]].map(([n, t]) => (
                <div key={t}>
                  <dt className="font-judul text-3xl font-bold">{n}</dt>
                  <dd className="redup mt-1 text-sm">{t}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="anim-pop self-start rounded-2xl bg-white p-6 text-tinta shadow-[0_30px_70px_-25px_rgba(0,0,0,.6)] sm:p-7">
            {mode === "home" ? (
              <>
                <h2 className="text-xl">Masuk</h2>
                <p className="mt-1 text-sm text-tinta-2">Gunakan akun siswa, orang tua, atau guru. Atau coba mode demo.</p>
                <form
                  className="mt-5 flex flex-col gap-3"
                  onSubmit={(e) => {
                    e.preventDefault();
                    void go({ action: "login", username, secret });
                  }}
                >
                  <div>
                    <label htmlFor="nama-masuk" className="text-sm font-semibold">Nama masuk</label>
                    <input id="nama-masuk" className="isian mt-1" autoComplete="username" value={username} onChange={(e) => setUsername(e.target.value)} />
                  </div>
                  <div>
                    <label htmlFor="sandi" className="text-sm font-semibold">PIN atau kata sandi</label>
                    <input id="sandi" type="password" className="isian mt-1" autoComplete="current-password" value={secret} onChange={(e) => setSecret(e.target.value)} />
                  </div>
                  <button type="submit" className="tombol mt-1 !bg-kobalt !text-white" disabled={busy || !username || !secret}>Masuk</button>
                </form>
                <button type="button" className="mt-3 w-full text-center text-sm font-semibold text-kobalt hover:underline" onClick={() => { setErr(null); setMode("daftar"); }}>Orang tua baru? Daftar dengan kode dari anak</button>
                <div className="my-5 flex items-center gap-3 text-xs font-semibold uppercase tracking-wider text-tinta-2"><span className="h-px flex-1 bg-tinta/15" />Mode demo<span className="h-px flex-1 bg-tinta/15" /></div>
                <div className="flex flex-col gap-2.5">
                  <button type="button" className="tombol-2 !justify-between !border-tinta/20 !bg-white !text-tinta" onClick={() => setMode("siswa")}>
                    <span className="flex items-center gap-2.5"><Ikon name="buku" className="text-kobalt" />Coba sebagai siswa</span><span aria-hidden="true" className="text-tinta-2">→</span>
                  </button>
                  <button type="button" className="tombol-2 !justify-between !border-tinta/20 !bg-white !text-tinta" disabled={busy} onClick={() => go({ action: "demo-parent" })}>
                    <span className="flex items-center gap-2.5"><Ikon name="jam" className="text-kobalt" />Coba sebagai orang tua</span><span aria-hidden="true" className="text-tinta-2">→</span>
                  </button>
                  <button type="button" className="tombol-2 !justify-between !border-tinta/20 !bg-white !text-tinta" onClick={() => setMode("guru")}>
                    <span className="flex items-center gap-2.5"><Ikon name="kelas" className="text-kobalt" />Coba sebagai guru</span><span aria-hidden="true" className="text-tinta-2">→</span>
                  </button>
                </div>
              </>
            ) : mode === "daftar" ? (
              <>
                <button type="button" className="text-sm font-semibold text-kobalt hover:underline" onClick={() => { setErr(null); setMode("home"); }}>← Kembali</button>
                <h2 className="mt-2 text-xl">Daftar orang tua</h2>
                <p className="mt-1 text-sm text-tinta-2">Kode orang tua ada di halaman Profil anak, atau minta kepada guru kelasnya. Anak lain bisa ditambahkan nanti lewat menu Cari Kelas.</p>
                <form
                  className="mt-4 flex flex-col gap-3"
                  onSubmit={(e) => {
                    e.preventDefault();
                    void go({ action: "register-parent", ...reg });
                  }}
                >
                  <div>
                    <label htmlFor="reg-kode" className="text-sm font-semibold">Kode orang tua dari anak</label>
                    <input id="reg-kode" className="isian mt-1 font-mono uppercase tracking-widest" maxLength={6} autoComplete="off" value={reg.code} onChange={(e) => setReg({ ...reg, code: e.target.value.replace(/[^a-zA-Z0-9]/g, "").toUpperCase() })} />
                  </div>
                  <div>
                    <label htmlFor="reg-nama" className="text-sm font-semibold">Nama panggilan Anda</label>
                    <input id="reg-nama" className="isian mt-1" maxLength={20} autoComplete="nickname" value={reg.nickname} onChange={(e) => setReg({ ...reg, nickname: e.target.value })} />
                  </div>
                  <div>
                    <label htmlFor="reg-user" className="text-sm font-semibold">Nama masuk</label>
                    <input id="reg-user" className="isian mt-1" maxLength={20} autoComplete="username" value={reg.username} onChange={(e) => setReg({ ...reg, username: e.target.value.toLowerCase() })} />
                  </div>
                  <div>
                    <label htmlFor="reg-sandi" className="text-sm font-semibold">Kata sandi (minimal 6 karakter)</label>
                    <input id="reg-sandi" type="password" className="isian mt-1" autoComplete="new-password" value={reg.secret} onChange={(e) => setReg({ ...reg, secret: e.target.value })} />
                  </div>
                  <button type="submit" className="tombol mt-1 !bg-kobalt !text-white" disabled={busy || reg.code.length !== 6 || !reg.nickname.trim() || reg.username.length < 3 || reg.secret.length < 6}>Daftar dan masuk</button>
                </form>
              </>
            ) : (
              <>
                <button type="button" className="text-sm font-semibold text-kobalt hover:underline" onClick={() => setMode("home")}>← Kembali</button>
                <h2 className="mt-2 text-xl">{mode === "guru" ? "Pilih kelas yang Anda ajar" : "Pilih kelas"}</h2>
                <p className="mb-4 mt-1 text-sm text-tinta-2">{mode === "guru" ? "Setiap guru hanya melihat siswa, karya, dan materi di kelasnya sendiri." : "Bandingkan jalur kelas 1–6. Siswa sungguhan langsung masuk ke kelas dari guru."}</p>
                <ul className="divide-y divide-tinta/10 rounded-xl border border-tinta/15">
                  {CLASSES.filter((c) => mode !== "guru" || DEMO_GURU.some((g) => g.level === c.level)).map((c) => (
                    <li key={c.level}>
                      <button type="button" disabled={busy} className="flex w-full items-center gap-3 px-3 py-2.5 text-left hover:bg-kobalt-muda" onClick={() => go({ action: mode === "guru" ? "demo-teacher" : "demo-student", level: c.level })}>
                        <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-kobalt font-judul text-sm font-bold text-white">{c.level}</span>
                        <span className="leading-tight">
                          <span className="block font-semibold">Kelas {c.level}</span>
                          <span className="text-sm text-tinta-2">{mode === "guru" ? `${DEMO_GURU.find((g) => g.level === c.level)?.nama} · ${c.project}` : c.project}</span>
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
              </>
            )}
            {err && <p role="alert" className="mt-3 rounded-lg bg-kobalt-muda px-3 py-2 text-sm font-semibold text-tinta">{err}</p>}
          </div>
        </div>
      </div>

      {/* Jalur kelas */}
      <section id="jalur" className="mx-auto max-w-[1360px] scroll-mt-8 px-6 py-16 sm:py-20">
        <p className="label-kecil !text-kobalt">Jalur kelas</p>
        <div className="mt-2 flex flex-wrap items-end justify-between gap-4">
          <h2 className="max-w-xl text-3xl">Satu proyek untuk setiap kelas, dengan tugas yang berbeda.</h2>
          <p className="max-w-sm text-tinta-2">Kelas 1–3 menyusun halaman secara visual. Kelas 4–6 menulis kode sungguhan.</p>
        </div>
        <Reveal><ul className="berurutan mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {CLASSES.map((c) => (
            <li key={c.level}>
              <button type="button" disabled={busy} onClick={() => go({ action: "demo-student", level: c.level })} className="kartu angkat flex h-full w-full flex-col p-5 text-left">
                <span className="flex items-center justify-between">
                  <span className="grid h-11 w-11 place-items-center rounded-xl bg-tinta font-judul text-lg font-bold text-white">{c.level}</span>
                  <span className="pil pil-biru">{c.mode === "visual" ? "Editor visual" : "Editor kode"}</span>
                </span>
                <span className="mt-5 text-sm font-semibold text-kobalt">Kelas {c.level}</span>
                <span className="font-judul text-lg font-bold leading-snug">{c.project}</span>
                <span className="mb-4 mt-1.5 text-sm text-tinta-2">{c.tagline}</span>
                <span className="mt-auto flex items-center gap-4 border-t border-tinta/10 pt-4 text-sm text-tinta-2">
                  <span className="flex items-center gap-1.5"><Ikon name="buku" size={16} />{c.meetings} pertemuan</span>
                  <span className="flex items-center gap-1.5"><Ikon name="jam" size={16} />{c.minutes} menit</span>
                  <span className="ml-auto font-semibold text-kobalt">Coba →</span>
                </span>
              </button>
            </li>
          ))}
        </ul></Reveal>
      </section>

      {/* Fitur */}
      <section id="fitur" className="scroll-mt-8 border-y border-tinta/10 bg-white">
        <div className="mx-auto grid max-w-[1360px] items-center gap-14 px-6 py-16 sm:py-20 lg:grid-cols-[minmax(0,460px)_1fr]">
          <Reveal className="pb-8 pr-6"><div>
            <p className="label-kecil !text-kobalt">Fitur</p>
            <h2 className="mt-2 text-3xl">Ruang praktik yang langsung menunjukkan hasilnya.</h2>
            <p className="mt-3 text-tinta-2">Kode di kiri, hasil di kanan. Setiap perubahan tampil seketika, sehingga siswa melihat hubungan antara yang ditulis dan yang muncul.</p>
            <JendelaKode className="mt-8" />
          </div></Reveal>
          <Reveal delay={150}><ul className="grid gap-x-8 gap-y-7 sm:grid-cols-2">
            {FITUR.map(([ic, t, d]) => (
              <li key={t} className="flex gap-4">
                <IkonKotak name={ic} />
                <div>
                  <h3 className="text-base">{t}</h3>
                  <p className="mt-1 text-sm text-tinta-2">{d}</p>
                </div>
              </li>
            ))}
          </ul></Reveal>
        </div>
      </section>

      {/* Alur */}
      <section id="alur" className="mx-auto max-w-[1360px] scroll-mt-8 px-6 py-16 sm:py-20">
        <p className="label-kecil !text-kobalt">Alur karya</p>
        <h2 className="mt-2 max-w-xl text-3xl">Dari draf sampai tampil di galeri kelas.</h2>
        <Reveal><ol className="berurutan mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {ALUR.map(([ic, t, d], i) => (
            <li key={t} className="kartu relative p-5">
              <span className="flex items-center justify-between">
                <IkonKotak name={ic} />
                <span className="font-judul text-3xl font-bold text-tinta/10">0{i + 1}</span>
              </span>
              <h3 className="mt-4 text-base">{t}</h3>
              <p className="mt-1 text-sm text-tinta-2">{d}</p>
            </li>
          ))}
        </ol></Reveal>

        <Reveal><div className="pita mt-14 flex flex-wrap items-center justify-between gap-6 px-7 py-8 sm:px-10">
          <div>
            <h2 className="text-2xl">Lihat langsung cara kerjanya.</h2>
            <p className="redup mt-1">Mode demo tidak memerlukan akun. Progres demo bisa diulang dari awal kapan saja.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button type="button" className="tombol" disabled={busy} onClick={() => { setMode("siswa"); window.scrollTo({ top: 0, behavior: "smooth" }); }}>Coba sebagai siswa</button>
            <button type="button" className="tombol-2" disabled={busy} onClick={() => { setMode("guru"); window.scrollTo({ top: 0, behavior: "smooth" }); }}>Coba sebagai guru</button>
            <button type="button" className="tombol-2" disabled={busy} onClick={() => go({ action: "demo-parent" })}>Coba sebagai orang tua</button>
          </div>
        </div></Reveal>
      </section>

      <footer className="border-t border-tinta/10 bg-white">
        <div className="mx-auto flex max-w-[1360px] flex-wrap items-center justify-between gap-2 px-6 py-6 text-sm text-tinta-2">
          <span className="font-judul font-bold text-tinta">Rakit<span className="text-kobalt">Web</span></span>
          <span>Kursus membuat website untuk kelas 1–6 SD</span>
        </div>
      </footer>
    </div>
  );
}
