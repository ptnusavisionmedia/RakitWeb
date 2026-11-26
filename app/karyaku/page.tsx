import Link from "next/link";
import { Monogram } from "@/components/Monogram";
import { StudentShell } from "@/components/Shell";
import { PageHead, Status } from "@/components/Status";
import { SubmitButton, WorkView } from "@/components/WorkView";
import { classMeta } from "@/lib/curriculum";
import { gallery, getProgress, getWork, roomOf } from "@/lib/db";
import { ago } from "@/lib/format";
import { Ikon, IkonKotak } from "@/components/Deco";

export const dynamic = "force-dynamic";

export default function KaryakuPage() {
  return (
    <StudentShell>
      {(s) => {
        const meta = classMeta(s.level);
        const w = getWork(s.id, s.level);
        const p = getProgress(s.id, s.level);
        const resume = `/belajar/${p && p.last > 0 ? p.last : 1}`;
        const changed = w.submittedAt && w.updatedAt > w.submittedAt;
        const room = roomOf(s);
        const roomName = room?.name ?? `kelas ${s.level}`;
        const pub = gallery(s.level, room?.id);
        return (
          <div className="flex flex-col gap-8">
            <PageHead
              icon="galeri"
              eyebrow={`Proyek kelas ${s.level}`}
              title={meta.project}
              desc={
                <span className="flex flex-wrap items-center gap-x-3 gap-y-1">
                  <Status status={w.status} testid="status" />
                  {changed && w.status !== "draft" && <span className="text-sm">Ada perubahan sejak dikirim</span>}
                </span>
              }
              right={
                <>
                  {w.status === "draft" && (
                    <>
                      <Link href={resume} className="tombol-2">Lanjutkan belajar</Link>
                      <SubmitButton />
                    </>
                  )}
                  {w.status === "submitted" && <Link href={resume} className="tombol">Lanjutkan belajar</Link>}
                  {w.status === "revision" && (
                    <>
                      <SubmitButton label="Kirim lagi ke guru" primary={false} />
                      <Link href={resume} className="tombol">Perbaiki karyaku</Link>
                    </>
                  )}
                  {w.status === "published" && (
                    <>
                      {changed && <SubmitButton label="Kirim versi baru" primary={false} />}
                      <a href="#galeri" className="tombol">Lihat galeri kelas</a>
                    </>
                  )}
                </>
              }
            />

            <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_340px]">
              <section className="flex flex-col gap-5">
                {w.comment && (
                  <blockquote className="anim-pop kartu border-l-4 !border-l-kobalt p-5" data-testid="komentar">
                    <p className="label-kecil mb-1.5">Komentar guru · {ago(w.comment.at)}</p>
                    <p className="text-[1.02rem] font-medium leading-snug">{w.comment.text}</p>
                  </blockquote>
                )}
                <figure>
                  <figcaption className="label-kecil mb-2">Karyamu</figcaption>
                  <WorkView kind={w.kind} content={w.content} level={s.level} height={460} />
                </figure>
              </section>

              <aside id="galeri" aria-labelledby="galeri-judul" className="scroll-mt-24">
                <div className="mb-3 flex items-baseline justify-between">
                  <h2 id="galeri-judul" className="text-lg">Galeri {roomName}</h2>
                  <span className="text-sm text-tinta-2">{pub.length} karya</span>
                </div>
                {pub.length === 0 ? (
                  <div className="kartu flex flex-col items-center px-5 py-9 text-center"><IkonKotak name="galeri" /><p className="mt-3 font-judul font-bold">Belum ada karya di galeri</p><p className="mt-1 text-sm text-tinta-2">Karya yang ditampilkan guru akan muncul di sini, hanya untuk anggota kelas.</p></div>
                ) : (
                  <ul className="berurutan kartu divide-y divide-tinta/10 overflow-hidden">
                    {pub.map(({ work, user }) => (
                      <li key={work.id}>
                        <Link href={`/karyaku/galeri/${work.id}`} className="baris flex items-center gap-3 px-4 py-3">
                          <Monogram name={user.nickname} size={36} />
                          <span className="min-w-0 flex-1 leading-tight">
                            <span className="block truncate font-semibold">{user.nickname.replace(/ \(demo\)$/, "")}</span>
                            <span className="text-xs text-tinta-2">Dipublikasikan {ago(work.publishedAt)}</span>
                          </span>
                          <span className="tautan">Lihat</span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
                <p className="mt-3 flex items-center gap-1.5 text-xs text-tinta-2"><Ikon name="kunci" size={14} />Galeri hanya bisa dibuka oleh anggota {roomName}.</p>
              </aside>
            </div>
          </div>
        );
      }}
    </StudentShell>
  );
}
