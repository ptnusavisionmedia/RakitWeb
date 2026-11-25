import { tgl } from "@/lib/format";
import { BOBOT, predikat } from "@/lib/nilai";
import type { ReportData } from "@/lib/db";
import { PrintButton } from "./GradeForms";

const tone = (p: string) => (p === "A" ? "bg-benar-muda text-benar-tua" : p === "B" ? "bg-kobalt-muda text-kobalt-tua" : p === "C" ? "bg-[#fbf3e1] text-tinta" : "bg-salah-muda text-salah-tua");

/** Tampilan rapor yang sama untuk guru (pratinjau), siswa, dan orang tua. */
export function ReportView({ data, name, level, sentAt, preview }: { data: ReportData; name: string; level: number; sentAt?: string; preview?: boolean }) {
  const rows: [string, number, number, string | undefined][] = [
    ["Tugas pertemuan", data.tugas, BOBOT.tugas, `Rata-rata ${data.lessons.length} pertemuan yang diselesaikan`],
    ["Karya proyek", data.karya, BOBOT.karya, data.karyaNote],
    ["Sikap dan keaktifan", data.sikap, BOBOT.sikap, data.sikapNote],
  ];
  return (
    <article className="kertas-rapor kartu overflow-hidden" aria-label={`Rapor ${name}`}>
      <header className="pita !rounded-none px-6 py-6 !shadow-none sm:px-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="label-kecil">Rapor Belajar · RakitWeb</p>
            <h1 className="mt-1 text-[1.75rem]">{name}</h1>
            <p className="redup mt-1">Kelas {level} · {data.project}</p>
            <p className="redup">{data.term}</p>
          </div>
          <div className="text-right">
            <p className="label-kecil">Nilai akhir</p>
            <p className="font-judul text-[3rem] font-extrabold leading-none">{data.final}</p>
            <span className={`mt-2 inline-block rounded-full px-3 py-1 text-sm font-extrabold ${tone(data.predikat)}`}>{data.predikat} · {data.label}</span>
          </div>
        </div>
        {preview && <p className="no-print mt-4 rounded-lg bg-white/10 px-3 py-2 text-sm">Pratinjau untuk guru. Siswa dan orang tua baru melihatnya setelah rapor dikirim.</p>}
      </header>

      <div className="p-6 sm:p-8">
        <h2 className="text-lg">Rincian nilai</h2>
        <div className="mt-3 overflow-x-auto">
          <table className="w-full min-w-[460px] border-collapse text-left">
            <thead>
              <tr className="border-b-2 border-tinta/20 text-sm text-tinta-2">
                <th scope="col" className="py-2 pr-3 font-semibold">Komponen</th>
                <th scope="col" className="px-3 py-2 text-right font-semibold">Bobot</th>
                <th scope="col" className="px-3 py-2 text-right font-semibold">Nilai</th>
                <th scope="col" className="py-2 pl-3 font-semibold">Predikat</th>
              </tr>
            </thead>
            <tbody>
              {rows.map(([t, v, w, note]) => (
                <tr key={t} className="border-b border-tinta/10 align-top">
                  <td className="py-3 pr-3"><span className="font-semibold">{t}</span>{note && <span className="block text-sm text-tinta-2">{note}</span>}</td>
                  <td className="px-3 py-3 text-right tabular-nums">{w}%</td>
                  <td className="px-3 py-3 text-right font-judul text-lg font-bold tabular-nums">{v}</td>
                  <td className="py-3 pl-3"><span className={`rounded-full px-2.5 py-0.5 text-xs font-extrabold ${tone(predikat(v).p)}`}>{predikat(v).p} · {predikat(v).label}</span></td>
                </tr>
              ))}
              <tr className="bg-kertas-2/60">
                <th scope="row" className="py-3 pr-3 font-judul font-bold">Nilai akhir</th>
                <td className="px-3 py-3 text-right tabular-nums">100%</td>
                <td className="px-3 py-3 text-right font-judul text-xl font-extrabold tabular-nums">{data.final}</td>
                <td className="py-3 pl-3"><span className={`rounded-full px-2.5 py-0.5 text-xs font-extrabold ${tone(data.predikat)}`}>{data.predikat} · {data.label}</span></td>
              </tr>
            </tbody>
          </table>
        </div>

        <h2 className="mt-8 text-lg">Ketuntasan belajar</h2>
        <p className="mt-1 text-tinta-2">{data.done} dari {data.total} pertemuan selesai ({Math.round((100 * data.done) / data.total)}%).</p>
        {data.lessons.length > 0 && (
          <ul className="mt-3 grid gap-x-6 gap-y-1.5 sm:grid-cols-2" aria-label="Nilai per pertemuan">
            {data.lessons.map((l) => (
              <li key={l.no} className="flex items-baseline justify-between gap-3 border-b border-tinta/10 py-1.5 text-sm">
                <span className="min-w-0 truncate">{l.no}. {l.title}</span>
                <span className="font-semibold tabular-nums">{l.score ?? "–"}</span>
              </li>
            ))}
          </ul>
        )}

        <h2 className="mt-8 text-lg">Deskripsi capaian</h2>
        <p className="mt-1 leading-relaxed">{data.deskripsi}</p>

        {data.catatan && (
          <>
            <h2 className="mt-8 text-lg">Catatan wali kelas</h2>
            <blockquote className="mt-2 border-l-4 border-kobalt bg-kobalt-muda/50 px-4 py-3 leading-relaxed">{data.catatan}</blockquote>
          </>
        )}

        <div className="mt-10 flex flex-wrap items-end justify-between gap-6 text-sm">
          <p className="text-tinta-2">{sentAt ? `Dikirim ${tgl(sentAt)}` : `Dibuat ${tgl(data.generatedAt)}`}</p>
          <div className="text-center">
            <p className="text-tinta-2">Wali kelas</p>
            <div className="h-12" aria-hidden="true" />
            <p className="border-t border-tinta/40 px-6 pt-1 font-semibold">{data.teacherName}</p>
          </div>
        </div>
        <div className="no-print mt-6"><PrintButton /></div>
      </div>
    </article>
  );
}
