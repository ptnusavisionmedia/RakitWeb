import Link from "next/link";
import { notFound } from "next/navigation";
import { TeacherShell } from "@/components/Shell";
import { classMeta, getLesson } from "@/lib/curriculum";

export const dynamic = "force-dynamic";

const ACT: Record<string, string> = {
  quiz: "Pilihan ganda singkat dengan umpan balik",
  browser: "Simulasi peramban (alamat web, Kembali, Maju)",
  safe: "Pilah kartu informasi: aman atau jangan dipajang",
  parts: "Ketuk bagian halaman (judul, gambar, tombol, menu)",
  sketch: "Sketsa contoh yang ditiru di kertas",
  editor: "Editor visual “Tentang Aku”",
};

export default async function GuruMateriItem({ params }: { params: Promise<{ kelas: string; no: string }> }) {
  const { kelas, no } = await params;
  return (
    <TeacherShell>
      {(t) => {
        const l = getLesson(Number(kelas), Number(no));
        if (!l || (t.level && l.level !== t.level)) notFound();
        const meta = classMeta(l.level);
        return (
          <article className="mx-auto flex max-w-4xl flex-col gap-6">
            <Link href={`/guru/materi?k=${l.level}`} className="tautan">← Materi kelas {l.level}</Link>
            <header className="pita px-6 py-7 sm:px-8">
              <p className="label-kecil">Kelas {l.level} · Pertemuan {l.no} dari {l.total} · {l.minutes} menit</p>
              <h1 className="mt-1.5 text-[1.75rem] sm:text-[2rem]">{l.title}</h1>
              <p className="redup mt-2">Topik baku: {l.topic}. Proyek: {meta.project}.</p>
            </header>

            <section className="kartu p-6">
              <h2 className="label-kecil mb-1">Hari ini aku bisa…</h2>
              <p className="catatan text-lg font-semibold">{l.goal}</p>
              <h2 className="label-kecil mb-1.5 mt-6">Contoh konkret</h2>
              <p>{l.example}</p>
              <h2 className="label-kecil mb-1.5 mt-6">Kegiatan praktik</h2>
              <p className="font-semibold">{l.task}</p>
              <ol className="mt-2 list-decimal space-y-1 pl-5 marker:font-semibold marker:text-kobalt">{l.steps.map((s) => <li key={s}>{s}</li>)}</ol>
              <h2 className="label-kecil mb-1.5 mt-6">Tanda keberhasilan yang dapat diamati</h2>
              <ul className="list-disc space-y-1 pl-5 marker:text-kobalt">{l.success.map((s) => <li key={s}>{s}</li>)}</ul>
            </section>

            <section>
              <h2 className="label-kecil mb-2">Pembagian waktu</h2>
              <div className="kartu overflow-x-auto"><table className="w-full border-collapse text-left text-[.95rem]">
                <thead>
                  <tr className="bg-kertas-2/50"><th className="label-kecil px-5 py-2.5">Bagian</th><th className="label-kecil px-5 py-2.5">Menit</th><th className="label-kecil px-5 py-2.5">Catatan pendampingan</th></tr>
                </thead>
                <tbody>
                  {l.timing.map((t) => (
                    <tr key={t.label} className="border-t border-tinta/10 align-top">
                      <td className="whitespace-nowrap px-5 py-3 font-semibold">{t.label}</td>
                      <td className="px-5 py-3 tabular-nums">{t.minutes}</td>
                      <td className="px-5 py-3 text-tinta-2">{t.note}</td>
                    </tr>
                  ))}
                  <tr className="border-t border-tinta/15 bg-kertas-2/50 font-semibold"><td className="px-5 py-3">Total</td><td className="px-5 py-3 tabular-nums">{l.timing.reduce((a, t) => a + t.minutes, 0)}</td><td className="px-5 py-3" /></tr>
                </tbody>
              </table></div>
            </section>

            <section className="kartu p-6">
              <h2 className="label-kecil mb-1">Catatan pendampingan</h2>
              <ul className="list-disc space-y-1.5 pl-5 marker:text-kobalt">{l.guide.map((g) => <li key={g}>{g}</li>)}</ul>
            </section>

            <section className="kartu p-6">
              <h2 className="label-kecil mb-1">Ruang praktik siswa</h2>
              {l.activity ? (
                <p>{ACT[l.activity.type]}{l.activity.type === "editor" ? `, tahap alat ${l.activity.step === 6 ? "menyusun" : l.activity.step === 7 ? "gambar dan warna" : "memperlihatkan karya"}` : ""}.</p>
              ) : (
                <p>Editor HTML{l.tabs?.includes("css") ? ", CSS" : ""}{l.tabs?.includes("js") ? ", dan JavaScript" : ""} dengan pratinjau terisolasi. Tab: {l.tabs?.join(", ")}.</p>
              )}
              {l.tool && <p className="mt-1">Alat bantu: {l.tool === "privacy" ? "pemeriksa privasi" : l.tool === "linkcheck" ? "pemeriksa tautan, gambar, dan privasi" : "panel presentasi + kirim ke guru"}.</p>}
              {l.target && <p className="mt-2 catatan"><b>Target hasil:</b> {l.target}</p>}
              {l.hints && <ol className="mt-2 list-decimal pl-6">{l.hints.map((h) => <li key={h}>Petunjuk bertahap: {h}</li>)}</ol>}
              {l.snippet?.map((s) => (
                <div key={s.file + s.code.slice(0, 30)} className="mt-3">
                  <p className="font-kode text-sm font-bold">Kode awal → {s.file}</p>
                  <pre className="mt-1 max-h-72 overflow-auto rounded-xl bg-tinta p-4 font-kode text-[12.5px] leading-[1.6] text-[#e8edf7]">{s.code}</pre>
                </div>
              ))}
            </section>

            <nav className="flex justify-between gap-3 border-t border-tinta/10 pt-6">
              {l.no > 1 ? <Link className="tombol-2" href={`/guru/materi/${l.level}/${l.no - 1}`}>← Pertemuan {l.no - 1}</Link> : <span />}
              {l.no < l.total ? <Link className="tombol-2" href={`/guru/materi/${l.level}/${l.no + 1}`}>Pertemuan {l.no + 1} →</Link> : <span />}
            </nav>
          </article>
        );
      }}
    </TeacherShell>
  );
}
