import { Ikon } from "@/components/Deco";
import { ParentShell } from "@/components/Shell";
import { PageHead } from "@/components/Status";
import { classMeta, lessonsOf } from "@/lib/curriculum";
import { ago } from "@/lib/format";

export const dynamic = "force-dynamic";

export default function OrtuPerkembangan() {
  return (
    <ParentShell>
      {({ child, level, progress }) => {
        const meta = classMeta(level);
        const name = child.nickname.replace(/ \(demo\)$/, "");
        const lessons = lessonsOf(level);
        const done = new Set(progress?.completed ?? []);
        const current = progress && progress.last > 0 && !done.has(progress.last) ? progress.last : lessons.find((l) => !done.has(l.no))?.no;
        const pct = Math.round((done.size / meta.meetings) * 100);
        return (
          <div className="flex flex-col gap-8">
            <PageHead
              icon="buku"
              eyebrow="Perkembangan"
              title={`Perjalanan belajar ${name}`}
              desc={`${done.size} dari ${meta.meetings} pertemuan selesai (${pct}%). ${progress?.lastAt ? `Terakhir belajar ${ago(progress.lastAt)}.` : "Belum ada aktivitas belajar."}`}
              right={
                <span className="flex items-center gap-4 text-sm">
                  <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-white" />Selesai</span>
                  <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-white/50 ring-2 ring-white" />Sedang</span>
                  <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-white/20" />Belum</span>
                </span>
              }
            />

            <ol className="berurutan flex flex-col gap-3" aria-label="Daftar pertemuan">
              {lessons.map((l) => {
                const isDone = done.has(l.no);
                const isCur = l.no === current;
                return (
                  <li key={l.id} className={`kartu flex gap-4 p-5 ${isCur ? "!border-kobalt ring-1 ring-kobalt" : ""} ${!isDone && !isCur ? "bg-white/60" : ""}`}>
                    <span className={`grid h-11 w-11 shrink-0 place-items-center rounded-xl font-judul text-base font-bold ${isDone ? "bg-kobalt text-white" : isCur ? "bg-kobalt-muda text-kobalt-tua" : "bg-tinta/5 text-tinta-2"}`}>
                      {isDone ? <Ikon name="cek" size={22} className="text-white" /> : l.no}
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                        <h2 className="text-base">Pertemuan {l.no}: {l.title}</h2>
                        <span className={`pil ${isDone ? "pil-isi" : isCur ? "pil-biru" : ""}`}>{isDone ? "Selesai" : isCur ? "Sedang dipelajari" : "Belum dimulai"}</span>
                        <span className="text-xs text-tinta-2">{l.minutes} menit</span>
                      </div>
                      {isDone ? (
                        <p className="mt-1.5 text-tinta-2"><b className="text-tinta">Sudah bisa:</b> {l.goal}</p>
                      ) : isCur ? (
                        <p className="mt-1.5 text-tinta-2"><b className="text-tinta">Tujuan:</b> {l.goal}</p>
                      ) : (
                        <p className="mt-1.5 text-sm text-tinta-2">Topik: {l.topic}</p>
                      )}
                    </div>
                  </li>
                );
              })}
            </ol>
          </div>
        );
      }}
    </ParentShell>
  );
}
