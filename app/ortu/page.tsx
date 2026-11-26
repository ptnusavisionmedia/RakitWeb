import Link from "next/link";
import { Ikon } from "@/components/Deco";
import { Monogram } from "@/components/Monogram";
import { ParentShell } from "@/components/Shell";
import { Stat, Status } from "@/components/Status";
import { classMeta, getLesson } from "@/lib/curriculum";
import { sentReports } from "@/lib/db";
import { ago, hariLalu, tgl } from "@/lib/format";
import { pesanSorotan, sisaJam, TANYA, TIPS } from "@/lib/ortu";

export const dynamic = "force-dynamic";

export default function OrtuRingkasan() {
  return (
    <ParentShell>
      {({ child, level, className, progress, work, notes, teacherName }, parent) => {
        const meta = classMeta(level);
        const name = child.nickname.replace(/ \(demo\)$/, "");
        const done = progress?.completed.length ?? 0;
        const pct = Math.round((done / meta.meetings) * 100);
        const last = progress && progress.last > 0 ? getLesson(level, progress.last) : undefined;
        const hari = hariLalu(progress?.lastAt);
        const sorot = pesanSorotan(work?.status, name, progress ? hari : 0);
        const latest = notes[0];
        return (
          <div className="flex flex-col gap-8">
            <header className="pita px-6 py-7 sm:px-8 sm:py-8">
              <div className="flex flex-wrap items-center gap-5">
                <Monogram name={name} size={64} />
                <div className="min-w-[min(100%,14rem)] flex-1">
                  <p className="label-kecil">Halo, {parent.nickname}</p>
                  <h1 className="mt-1 text-[1.75rem] sm:text-[2rem]">Perkembangan {name}</h1>
                  <p className="redup mt-1">{className} · {meta.project} · Wali kelas {teacherName}</p>
                </div>
                <div className="flex w-full flex-col items-start gap-1.5 sm:w-auto sm:items-end">
                  <span className="label-kecil">Status karya</span>
                  <Status status={work?.status} />
                </div>
              </div>
              <div className="mt-6">
                <div className="flex items-baseline justify-between text-sm">
                  <span className="font-semibold">{done} dari {meta.meetings} pertemuan selesai</span>
                  <span className="redup">{pct}%</span>
                </div>
                <div className="mt-2 h-2 overflow-hidden rounded-full bg-white/15" role="progressbar" aria-valuemin={0} aria-valuemax={meta.meetings} aria-valuenow={done} aria-label="Pertemuan selesai">
                  <div className="isi-bar h-full rounded-full bg-white" style={{ width: `${pct}%` }} />
                </div>
              </div>
            </header>

            {sentReports(child.id).length > 0 && (
              <Link href="/ortu/rapor" className="kartu angkat flex flex-wrap items-center gap-4 border-l-4 !border-l-benar p-5">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-benar-muda text-benar-tua"><Ikon name="cek" /></span>
                <span className="min-w-[min(100%,13rem)] flex-1 leading-snug">
                  <span className="block font-judul text-lg font-bold">Rapor {name} sudah tersedia</span>
                  <span className="text-sm text-tinta-2">Lihat nilai akhir, rincian, dan catatan wali kelas.</span>
                </span>
                <span className="tautan">Buka rapor →</span>
              </Link>
            )}

            <section aria-labelledby="sorotan" className="kartu flex items-start gap-4 border-l-4 !border-l-kobalt p-5">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-kobalt-muda text-kobalt"><Ikon name="target" /></span>
              <div>
                <p className="label-kecil">Yang perlu Anda ketahui</p>
                <h2 id="sorotan" className="mt-1 text-lg">{sorot.judul}</h2>
                <p className="mt-1 text-tinta-2">{sorot.isi}</p>
              </div>
            </section>

            <div className="berurutan grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <Stat icon="cek" label="Pertemuan selesai" value={`${done} / ${meta.meetings}`} note={`${pct}% dari kursus`} />
              <Stat icon="buku" label="Terakhir dipelajari" value={last ? `Pertemuan ${last.no}` : "Belum mulai"} note={progress?.lastAt ? `dibuka ${ago(progress.lastAt)}` : "belum ada aktivitas"} />
              <Stat icon="jam" label="Durasi pertemuan" value={`${meta.minutes} menit`} note={`${meta.meetings} pertemuan`} />
              <Stat icon="kelas" label="Perkiraan sisa" value={`± ${sisaJam(meta, done)} jam`} note={`${meta.meetings - done} pertemuan lagi`} />
            </div>

            <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,420px)]">
              <section className="kartu p-6" aria-labelledby="sedang">
                <p className="label-kecil">Sedang dipelajari</p>
                {last ? (
                  <>
                    <h2 id="sedang" className="mt-1 text-xl">{last.title}</h2>
                    <p className="catatan mt-3 font-semibold">{last.goal}</p>
                    <p className="mt-3 text-tinta-2">{last.example}</p>
                    <h3 className="mt-6 flex items-center gap-2 text-base"><Ikon name="komentar" size={18} className="text-kobalt" />Ajak {name} bercerita</h3>
                    <ul className="mt-2 flex flex-col gap-2">
                      {TANYA[meta.mode].map((q) => (
                        <li key={q} className="flex gap-3 rounded-lg bg-kertas-2/70 px-3 py-2.5">
                          <span aria-hidden="true" className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-kobalt" />
                          <span>{q}</span>
                        </li>
                      ))}
                    </ul>
                  </>
                ) : (
                  <p id="sedang" className="mt-2 text-tinta-2">{name} belum memulai pertemuan pertama.</p>
                )}
                <div className="mt-6 flex flex-wrap gap-3">
                  <Link href="/ortu/perkembangan" className="tombol-2">Lihat semua pertemuan</Link>
                  <Link href="/ortu/karya" className="tombol-2">Lihat karya</Link>
                </div>
              </section>

              <section className="kartu flex flex-col p-6" aria-labelledby="catatan-terbaru">
                <p className="label-kecil">Catatan terbaru dari guru</p>
                {latest ? (
                  <>
                    <h2 id="catatan-terbaru" className="mt-1 text-lg">{latest.kind === "catatan" ? "Catatan untuk orang tua" : latest.kind === "perbaikan" ? "Masukan untuk karya" : "Karya dipublikasikan"}</h2>
                    <blockquote className="mt-3 border-l-2 border-kobalt pl-4 leading-relaxed">{latest.text}</blockquote>
                    <p className="mt-3 text-sm text-tinta-2">{tgl(latest.at)} · {ago(latest.at)}</p>
                  </>
                ) : (
                  <p id="catatan-terbaru" className="mt-2 text-tinta-2">Belum ada catatan dari guru. Catatan akan muncul di sini.</p>
                )}
                <Link href="/ortu/catatan" className="tautan mt-auto pt-5">Baca semua catatan →</Link>
              </section>
            </div>

            <section aria-labelledby="tips" className="kartu p-6">
              <h2 id="tips" className="flex items-center gap-2 text-lg"><Ikon name="kirim" size={20} className="text-kobalt" />Cara mendampingi di rumah</h2>
              <ol className="berurutan mt-4 grid gap-4 sm:grid-cols-2">
                {TIPS.map((t, i) => (
                  <li key={t} className="flex gap-3">
                    <span aria-hidden="true" className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-kobalt-muda font-judul text-sm font-bold text-kobalt-tua">{i + 1}</span>
                    <span className="text-tinta-2">{t}</span>
                  </li>
                ))}
              </ol>
            </section>
          </div>
        );
      }}
    </ParentShell>
  );
}
