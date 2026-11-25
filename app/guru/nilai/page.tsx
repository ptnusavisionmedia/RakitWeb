import Link from "next/link";
import { ClassTabs } from "@/components/ClassTabs";
import { ClassReportActions } from "@/components/GradeForms";
import { Monogram } from "@/components/Monogram";
import { TeacherShell } from "@/components/Shell";
import { PageHead, Stat } from "@/components/Status";
import { isLevel } from "@/lib/curriculum";
import { classSheet, type ReportStatus } from "@/lib/db";
import { predikat, termLabel } from "@/lib/nilai";

export const dynamic = "force-dynamic";

const STATUS: Record<ReportStatus, [string, string]> = {
  belum: ["Belum dibuat", "pil"],
  draf: ["Draf", "pil pil-tinta"],
  terkirim: ["Terkirim", "pil pil-isi"],
  diperbarui: ["Kirim ulang", "pil pil-biru"],
};
const val = (n: number | null | undefined) => (n === null || n === undefined ? <span className="text-tinta-2">–</span> : n);

export default async function GuruNilai({ searchParams }: { searchParams: Promise<{ k?: string }> }) {
  const sp = await searchParams;
  const k = Number(sp.k ?? 1);
  return (
    <TeacherShell wide>
      {(t) => {
        const level = t.level ?? (isLevel(k) ? k : 1);
        const sheet = classSheet(t, level)!;
        const sent = sheet.rows.filter((r) => r.status === "terkirim").length;
        const ready = sheet.rows.filter((r) => r.sh.final !== null).length;
        return (
          <div className="flex flex-col gap-8">
            <PageHead icon="buku" eyebrow="Nilai dan Rapor" title={`Rekap nilai Kelas ${level}`} desc={`${termLabel()} · nilai akhir = tugas pertemuan 40% + karya 40% + sikap 20%`} right={t.level ? <span className="pil pil-isi">{t.nickname}</span> : <ClassTabs base="/guru/nilai" current={level} />} />

            <div className="berurutan grid gap-4 sm:grid-cols-3">
              <Stat icon="kelas" label="Siswa" value={sheet.rows.length} note="di kelas ini" />
              <Stat icon="cek" label="Nilai lengkap" value={`${ready} / ${sheet.rows.length}`} note="siap dibuatkan rapor" />
              <Stat icon="kirim" label="Rapor terkirim" value={`${sent} / ${sheet.rows.length}`} note="sudah diterima siswa dan orang tua" />
            </div>

            <section className="kartu p-6" aria-labelledby="aksi-rapor">
              <h2 id="aksi-rapor" className="text-lg">Rapor kelas</h2>
              <p className="mb-4 mt-1 text-sm text-tinta-2">Rapor dibuat otomatis dari nilai pertemuan, nilai karya, dan nilai sikap. Rapor hanya dikirim ke siswa dan orang tua yang terhubung dengan siswa itu.</p>
              <ClassReportActions level={level} />
            </section>

            <section aria-labelledby="nilai-siswa">
              <h2 id="nilai-siswa" className="mb-3 text-lg">Nilai setiap siswa</h2>
              {sheet.rows.length === 0 ? (
                <p className="kartu p-6 text-tinta-2">Belum ada siswa di kelas ini.</p>
              ) : (
                <div className="kartu overflow-x-auto">
                  <table className="w-full min-w-[760px] border-collapse text-left">
                    <thead>
                      <tr className="border-b border-tinta/10 bg-kertas-2/50 text-sm text-tinta-2">
                        <th scope="col" className="px-5 py-3 font-semibold">Siswa</th>
                        <th scope="col" className="px-3 py-3 font-semibold">Selesai</th>
                        <th scope="col" className="px-3 py-3 text-right font-semibold">Tugas</th>
                        <th scope="col" className="px-3 py-3 text-right font-semibold">Karya</th>
                        <th scope="col" className="px-3 py-3 text-right font-semibold">Sikap</th>
                        <th scope="col" className="px-3 py-3 text-right font-semibold">Akhir</th>
                        <th scope="col" className="px-3 py-3 font-semibold">Rapor</th>
                        <th scope="col" className="px-5 py-3"><span className="sr-only">Buka</span></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-tinta/10">
                      {sheet.rows.map(({ user, sh, status }) => (
                        <tr key={user.id} className="baris">
                          <td className="px-5 py-3">
                            <Link href={`/guru/nilai/${user.id}`} className="flex items-center gap-3">
                              <Monogram name={user.nickname} size={34} />
                              <span className="font-semibold">{sh.name}</span>
                            </Link>
                          </td>
                          <td className="px-3 py-3 tabular-nums">{sh.done}/{sh.total}</td>
                          <td className="px-3 py-3 text-right tabular-nums">{val(sh.tugas)}</td>
                          <td className="px-3 py-3 text-right tabular-nums">{val(sh.karya?.score)}</td>
                          <td className="px-3 py-3 text-right tabular-nums">{val(sh.sikap?.score)}</td>
                          <td className="px-3 py-3 text-right font-judul font-bold tabular-nums">{sh.final === null ? <span className="font-normal text-tinta-2">–</span> : `${sh.final} (${predikat(sh.final).p})`}</td>
                          <td className="px-3 py-3"><span className={STATUS[status][1]}>{STATUS[status][0]}</span></td>
                          <td className="px-5 py-3 text-right"><Link href={`/guru/nilai/${user.id}`} className="tautan whitespace-nowrap">Nilai →</Link></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </section>

            <section aria-labelledby="rekap-pertemuan">
              <h2 id="rekap-pertemuan" className="text-lg">Rekap tugas per pertemuan</h2>
              <p className="mb-3 mt-1 text-sm text-tinta-2">Angka adalah nilai pertemuan (nilai guru bila ada, jika tidak nilai otomatis). Tanda “✓” berarti selesai tanpa nilai, “–” berarti belum selesai.</p>
              <div className="kartu overflow-x-auto">
                <table className="w-full border-collapse text-center text-sm">
                  <thead>
                    <tr className="border-b border-tinta/10 bg-kertas-2/50 text-tinta-2">
                      <th scope="col" className="sticky left-0 bg-kertas-2 px-4 py-2.5 text-left font-semibold">Siswa</th>
                      {sheet.lessons.map((l) => <th key={l.no} scope="col" className="min-w-[40px] px-1.5 py-2.5 font-semibold" title={l.title}>{l.no}</th>)}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-tinta/10">
                    {sheet.rows.map(({ user, sh, cells }) => (
                      <tr key={user.id}>
                        <th scope="row" className="sticky left-0 whitespace-nowrap bg-white px-4 py-2 text-left font-semibold"><Link href={`/guru/nilai/${user.id}`} className="hover:underline">{sh.name}</Link></th>
                        {cells.map((c) => (
                          <td key={c.no} className={`px-1.5 py-2 tabular-nums ${!c.done ? "text-tinta/30" : c.score === null ? "text-kobalt" : c.teacher ? "font-bold text-kobalt-tua" : ""}`}>{!c.done ? "–" : c.score === null ? "✓" : c.score}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="mt-2 text-xs text-tinta-2">Angka tebal biru: nilai dari guru.</p>
            </section>
          </div>
        );
      }}
    </TeacherShell>
  );
}
