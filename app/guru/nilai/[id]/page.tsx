import Link from "next/link";
import { notFound } from "next/navigation";
import { ComponentGrade, LessonGrade, ReportActions } from "@/components/GradeForms";
import { Monogram } from "@/components/Monogram";
import { ReportView } from "@/components/ReportView";
import { TeacherShell } from "@/components/Shell";
import { Stat, Status } from "@/components/Status";
import { reportStatus, studentSheet } from "@/lib/db";
import { ago } from "@/lib/format";
import { predikat } from "@/lib/nilai";

export const dynamic = "force-dynamic";

const STATUS_RAPOR = { belum: "Belum dibuat", draf: "Draf, belum dikirim", terkirim: "Sudah terkirim", diperbarui: "Diperbarui, belum dikirim ulang" } as const;

export default async function GuruNilaiSiswa({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return (
    <TeacherShell>
      {(t) => {
        const sh = studentSheet(t, id);
        if (!sh) notFound();
        const status = reportStatus(sh.report);
        const submitted = !!sh.work?.submitted;
        const ready = sh.final !== null;
        return (
          <div className="flex flex-col gap-8">
            <div>
              <Link href={`/guru/nilai?c=${sh.roomId}`} className="tautan">← Rekap nilai {sh.className}</Link>
              <div className="mt-5 flex flex-wrap items-center gap-4 border-b border-tinta/10 pb-6">
                <Monogram name={sh.name} size={52} />
                <div className="min-w-0 flex-1">
                  <h1 className="text-2xl">{sh.name}</h1>
                  <p className="text-sm text-tinta-2">{sh.className} · {sh.done} dari {sh.total} pertemuan selesai · Kode orang tua <code className="font-mono font-bold tracking-widest text-kobalt-tua">{sh.parentCode}</code></p>
                </div>
                <span className="pil pil-biru">Rapor: {STATUS_RAPOR[status]}</span>
              </div>
            </div>

            <div className="berurutan grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <Stat icon="buku" label="Tugas pertemuan" value={sh.tugas ?? "–"} note="rata-rata · bobot 40%" />
              <Stat icon="galeri" label="Karya proyek" value={sh.karya?.score ?? "–"} note="dari guru · bobot 40%" />
              <Stat icon="cek" label="Sikap dan keaktifan" value={sh.sikap?.score ?? "–"} note="dari guru · bobot 20%" />
              <Stat icon="target" label="Nilai akhir" value={sh.final === null ? "–" : `${sh.final} (${predikat(sh.final).p})`} note={sh.final === null ? "lengkapi nilai" : predikat(sh.final).label} />
            </div>

            <section aria-labelledby="rekap">
              <h2 id="rekap" className="text-lg">Rekap tugas per pertemuan</h2>
              <p className="mb-3 mt-1 text-sm text-tinta-2">Buka satu pertemuan untuk melihat jawaban siswa dan memberi nilai. Nilai guru menggantikan nilai otomatis.</p>
              <ul className="berurutan kartu divide-y divide-tinta/10 overflow-hidden">
                {sh.rows.map((r) => (
                  <li key={r.no}>
                    <details className="group">
                      <summary className="baris flex cursor-pointer list-none flex-wrap items-center gap-x-4 gap-y-1 px-5 py-3.5 [&::-webkit-details-marker]:hidden">
                        <span className={`grid h-9 w-9 shrink-0 place-items-center rounded-lg font-judul text-sm font-bold ${r.done ? "bg-kobalt text-white" : "bg-tinta/5 text-tinta-2"}`}>{r.no}</span>
                        <span className="min-w-[180px] flex-1 leading-tight">
                          <span className="block font-semibold">{r.title}</span>
                          <span className="text-sm text-tinta-2">{r.done ? `Selesai · dikerjakan ${ago(r.result?.at)}` : "Belum diselesaikan"}</span>
                        </span>
                        <span className="text-sm text-tinta-2">Otomatis: <b className="text-tinta">{r.auto ?? "–"}</b></span>
                        <span className="text-sm text-tinta-2">Nilai: <b className="font-judul text-base text-tinta">{r.score ?? "–"}</b>{r.result?.teacherScore !== undefined && <span className="ml-1 text-xs font-bold text-kobalt">guru</span>}</span>
                        <span aria-hidden="true" className="text-tinta-2 transition-transform group-open:rotate-90">›</span>
                      </summary>
                      <div className="flex flex-col gap-5 border-t border-tinta/10 bg-kertas-2/40 px-5 py-5">
                        {!r.done && <p className="text-tinta-2">Siswa belum menyelesaikan pertemuan ini, jadi belum bisa dinilai.</p>}
                        {r.result?.items && r.result.items.length > 0 && (
                          <div>
                            <p className="label-kecil mb-2">Jawaban latihan</p>
                            <ul className="flex flex-col gap-1.5">
                              {r.result.items.map((it, i) => (
                                <li key={i} className={`flex items-start gap-3 rounded-lg border px-3 py-2 ${it.ok ? "border-benar/30 bg-benar-muda/60" : "border-salah/30 bg-salah-muda/60"}`}>
                                  <span aria-hidden="true" className={`mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full text-xs font-bold text-white ${it.ok ? "bg-benar" : "bg-salah"}`}>{it.ok ? "✓" : "✕"}</span>
                                  <span className="min-w-0 text-sm"><span className="font-semibold">{it.q}</span><span className="block text-tinta-2">{it.a}</span></span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                        {r.result?.checks && (
                          <div>
                            <p className="label-kecil mb-2">Misi atau daftar periksa</p>
                            <ul className="flex flex-col gap-1 text-sm">{r.result.checks.map((c) => <li key={c.t}>{c.done ? "✓" : "○"} {c.t}</li>)}</ul>
                          </div>
                        )}
                        {r.result?.self && (
                          <div>
                            <p className="label-kecil mb-2">Tanda berhasil menurut siswa</p>
                            <ul className="flex flex-col gap-1 text-sm">{r.result.self.map((c) => <li key={c.t}>{c.done ? "✓" : "○"} {c.t}</li>)}</ul>
                          </div>
                        )}
                        {r.done && !r.result && <p className="text-sm text-tinta-2">Tidak ada data jawaban yang tercatat untuk pertemuan ini. Anda tetap bisa memberi nilai.</p>}
                        {r.done && <LessonGrade studentId={id} no={r.no} auto={r.auto} score={r.result?.teacherScore} note={r.result?.teacherNote} />}
                      </div>
                    </details>
                  </li>
                ))}
              </ul>
            </section>

            <div className="grid gap-6 lg:grid-cols-2">
              <section className="kartu p-6" aria-labelledby="nilai-karya">
                <h2 id="nilai-karya" className="text-lg">Nilai karya proyek</h2>
                <p className="mb-4 mt-1 flex flex-wrap items-center gap-2 text-sm text-tinta-2">Status karya: <Status status={sh.work?.status} />{sh.work?.submitted && <Link href={`/guru/tinjau/${sh.work.id}`} className="tautan">Buka karya →</Link>}</p>
                <ComponentGrade studentId={id} kind="karya" score={sh.karya?.score} note={sh.karya?.note} disabledReason={submitted ? undefined : "Siswa belum mengirim karya, jadi belum bisa dinilai."} />
              </section>
              <section className="kartu p-6" aria-labelledby="nilai-sikap">
                <h2 id="nilai-sikap" className="text-lg">Nilai sikap dan keaktifan</h2>
                <p className="mb-4 mt-1 text-sm text-tinta-2">Penilaian guru atas kerja sama, ketekunan, dan keaktifan siswa di kelas.</p>
                <ComponentGrade studentId={id} kind="sikap" score={sh.sikap?.score} note={sh.sikap?.note} />
              </section>
            </div>

            <section className="kartu p-6" aria-labelledby="rapor">
              <h2 id="rapor" className="text-lg">Rapor</h2>
              <p className="mb-4 mt-1 text-sm text-tinta-2">Status: {STATUS_RAPOR[status]}. Rapor yang terkirim hanya dilihat siswa ini dan orang tua yang terhubung dengannya.</p>
              <ReportActions key={sh.report?.data.generatedAt ?? "baru"} studentId={id} status={status} catatan={sh.report?.data.catatan ?? ""} ready={ready} />
            </section>

            {sh.report && <ReportView data={sh.report.data} name={sh.name} level={sh.level} preview />}
          </div>
        );
      }}
    </TeacherShell>
  );
}
