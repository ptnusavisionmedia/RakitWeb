import Link from "next/link";
import { StudentShell } from "@/components/Shell";
import { PagePreview } from "@/components/PagePreview";
import { CodePreview } from "@/components/CodePreview";
import { classMeta, getLesson, lessonsOf } from "@/lib/curriculum";
import { getProgress, getWork } from "@/lib/db";
import { pagesOf, type Files } from "@/lib/starter";
import type { VisualDoc } from "@/lib/page";
import { Ikon } from "@/components/Deco";
import { Stat, Status } from "@/components/Status";

export const dynamic = "force-dynamic";

export default function BelajarPage() {
  return (
    <StudentShell>
      {(s) => {
        const meta = classMeta(s.level);
        const lessons = lessonsOf(s.level);
        const p = getProgress(s.id, s.level);
        const started = !!p && (p.last > 0 || p.completed.length > 0);
        const curNo = p && p.last > 0 ? p.last : 1;
        const cur = getLesson(s.level, curNo)!;
        const work = getWork(s.id, s.level);
        const done = new Set(p?.completed ?? []);
        const pct = Math.round((done.size / cur.total) * 100);
        return (
          <div className="flex flex-col gap-8">
            <section aria-labelledby="hari-ini" className="kartu grid overflow-hidden !rounded-[18px] lg:grid-cols-[minmax(0,1fr)_minmax(0,460px)]">
              <div className="pita flex flex-col !rounded-none p-6 !shadow-none sm:p-9">
                <p className="label-kecil">Kelas {s.level} · {meta.project}</p>
                <p className="mt-6 inline-flex w-fit items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold ring-1 ring-white/15"><Ikon name="jam" size={14} />Pertemuan {cur.no} dari {cur.total} · {cur.minutes} menit</p>
                <h1 id="hari-ini" className="mt-4 text-[1.85rem] sm:text-[2.35rem] sm:leading-[1.12]">{cur.title}</h1>
                <p className="redup mt-3 max-w-xl text-[1.02rem]">{cur.task}</p>

                <div className="mt-7 flex flex-wrap items-center gap-4">
                  <Link href={`/belajar/${cur.no}`} className="tombol !min-h-12 !px-7">
                    {started ? "Lanjutkan belajar" : "Mulai belajar"}
                  </Link>
                  {started && <span className="redup flex items-center gap-1.5 text-sm"><Ikon name="cek" size={16} />Pekerjaanmu tersimpan.</span>}
                </div>

                <div className="mt-auto pt-8">
                  <div className="flex items-baseline justify-between text-sm">
                    <span className="font-semibold">{done.size} dari {cur.total} pertemuan selesai</span>
                    <span className="redup">{pct}%</span>
                  </div>
                  <div className="mt-2 h-2 overflow-hidden rounded-full bg-white/15" role="progressbar" aria-valuemin={0} aria-valuemax={cur.total} aria-valuenow={done.size} aria-label="Pertemuan selesai">
                    <div className="isi-bar h-full rounded-full bg-white" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              </div>

              <figure className="flex flex-col bg-kertas-2/60 p-5 sm:p-6">
                <figcaption className="mb-3 flex items-center justify-between gap-3"><span className="label-kecil">Karyamu sekarang</span><Status status={work.status} /></figcaption>
                <div className="bingkai">
                  {work.kind === "visual" ? (
                    <div className="max-h-[320px] overflow-hidden p-1">
                      <PagePreview doc={work.content as VisualDoc} compact />
                    </div>
                  ) : (
                    <div className="h-[300px]">
                      <CodePreview files={work.content as Files} pages={pagesOf(s.level)} controls={false} />
                    </div>
                  )}
                </div>
              </figure>
            </section>

            <div className="berurutan grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <Stat icon="cek" label="Selesai" value={`${done.size} / ${cur.total}`} note="pertemuan" />
              <Stat icon="target" label="Sedang dikerjakan" value={`Pertemuan ${cur.no}`} note={started ? "terakhir dibuka" : "mulai di sini"} />
              <Stat icon="jam" label="Durasi" value={`${cur.minutes} menit`} note="setiap pertemuan" />
              <Stat icon={meta.mode === "visual" ? "susun" : "kode"} label="Ruang praktik" value={meta.mode === "visual" ? "Editor visual" : "Editor kode"} note={meta.mode === "visual" ? "susun blok halaman" : "HTML, CSS, JavaScript"} />
            </div>

            <section aria-labelledby="urutan">
              <div className="mb-4 flex items-baseline justify-between gap-4">
                <h2 id="urutan" className="text-xl">Urutan pertemuan</h2>
                <p className="text-sm text-tinta-2">{cur.total} pertemuan × {cur.minutes} menit</p>
              </div>
              <ol className="berurutan grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {lessons.map((l) => {
                  const isCur = l.no === cur.no;
                  const isDone = done.has(l.no);
                  return (
                    <li key={l.id}>
                      <Link
                        href={`/belajar/${l.no}`}
                        aria-current={isCur ? "step" : undefined}
                        className={`kartu angkat relative flex h-full flex-col gap-3 overflow-hidden p-4 ${isCur ? "!border-kobalt ring-1 ring-kobalt" : ""}`}
                      >
                        <span className="flex items-center justify-between gap-2">
                          <span className={`grid h-8 w-8 shrink-0 place-items-center rounded-lg font-judul text-sm font-bold ${isDone ? "bg-kobalt text-white" : isCur ? "bg-kobalt-muda text-kobalt-tua" : "bg-tinta/5 text-tinta-2"}`}>{isDone ? "✓" : l.no}</span>
                          <span className={`text-xs font-semibold ${isDone || isCur ? "text-kobalt" : "text-tinta-2"}`}>
                            {isDone ? "Selesai" : isCur ? (started ? "Terakhir dibuka" : "Mulai di sini") : `${l.minutes} menit`}
                          </span>
                        </span>
                        <span className="font-judul text-[.95rem] font-semibold leading-snug">{l.title}</span>
                        <span className="mt-auto truncate text-xs text-tinta-2">{l.topic}</span>
                        {(isDone || isCur) && <span aria-hidden="true" className={`absolute inset-x-0 bottom-0 h-1 ${isDone ? "bg-kobalt" : "bg-kobalt/30"}`} />}
                      </Link>
                    </li>
                  );
                })}
              </ol>
            </section>
          </div>
        );
      }}
    </StudentShell>
  );
}
