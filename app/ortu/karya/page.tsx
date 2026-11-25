import { Ikon, IkonKotak } from "@/components/Deco";
import { ParentShell } from "@/components/Shell";
import { PageHead, Status } from "@/components/Status";
import { WorkView } from "@/components/WorkView";
import { classMeta } from "@/lib/curriculum";
import { ago, tgl } from "@/lib/format";

export const dynamic = "force-dynamic";

export default function OrtuKarya() {
  return (
    <ParentShell>
      {({ child, level, work }) => {
        const meta = classMeta(level);
        const name = child.nickname.replace(/ \(demo\)$/, "");
        // Tampilkan versi yang dilihat guru bila sudah dikirim, selain itu draf terbaru.
        const shown = work?.published ?? work?.submitted ?? work?.content;
        const label = work?.status === "published" ? "Versi yang tampil di galeri kelas" : work?.submitted ? "Versi yang dikirim ke guru" : "Draf terbaru";
        const when = work?.status === "published" ? work.publishedAt : work?.submitted ? work.submittedAt : work?.updatedAt;
        return (
          <div className="flex flex-col gap-8">
            <PageHead icon="galeri" eyebrow="Karya" title={meta.project} desc={`Karya ${name} untuk kelas ${level}. Halaman ini hanya untuk dilihat, tidak bisa diubah.`} right={<Status status={work?.status} />} />
            {work && shown ? (
              <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
                <section aria-label="Pratinjau karya">
                  <div className="mb-2 flex flex-wrap items-baseline justify-between gap-2">
                    <p className="label-kecil">{label}</p>
                    <p className="text-sm text-tinta-2">{tgl(when)} · {ago(when)}</p>
                  </div>
                  <WorkView kind={work.kind} content={shown} level={level} height={520} showCode />
                </section>
                <aside className="flex flex-col gap-4">
                  {work.comment && (
                    <div className="kartu border-l-4 !border-l-kobalt p-5">
                      <p className="label-kecil mb-1.5">Komentar guru · {ago(work.comment.at)}</p>
                      <p className="leading-snug">{work.comment.text}</p>
                    </div>
                  )}
                  <div className="kartu p-5">
                    <h2 className="flex items-center gap-2 text-base"><Ikon name="kunci" size={18} className="text-kobalt" />Privasi karya</h2>
                    <p className="mt-2 text-sm text-tinta-2">Karya hanya dilihat Anda dan guru. Teman sekelas baru bisa melihatnya jika guru menampilkannya di galeri kelas.</p>
                  </div>
                  <div className="kartu p-5">
                    <h2 className="text-base">Ingin mencoba di rumah?</h2>
                    <p className="mt-2 text-sm text-tinta-2">Di pratinjau, klik tautan atau tombol seperti pada website biasa. Anak sudah belajar menguji karyanya sendiri.</p>
                  </div>
                </aside>
              </div>
            ) : (
              <div className="kartu flex flex-col items-center px-6 py-14 text-center">
                <IkonKotak name="galeri" />
                <p className="mt-3 font-judul text-lg font-bold">Belum ada karya</p>
                <p className="mt-1 max-w-md text-sm text-tinta-2">Karya {name} akan tampil di sini setelah ia mulai mengerjakan.</p>
              </div>
            )}
          </div>
        );
      }}
    </ParentShell>
  );
}
