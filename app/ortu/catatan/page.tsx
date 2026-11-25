import { Ikon, IkonKotak } from "@/components/Deco";
import { ParentShell } from "@/components/Shell";
import { PageHead } from "@/components/Status";
import { ago, tgl } from "@/lib/format";
import { PRIVASI } from "@/lib/ortu";

export const dynamic = "force-dynamic";

const JENIS = {
  catatan: { icon: "komentar", judul: "Catatan untuk orang tua" },
  perbaikan: { icon: "susun", judul: "Masukan untuk karya" },
  galeri: { icon: "galeri", judul: "Karya dipublikasikan" },
} as const;

export default function OrtuCatatan() {
  return (
    <ParentShell>
      {({ child, notes }) => {
        const name = child.nickname.replace(/ \(demo\)$/, "");
        return (
          <div className="flex flex-col gap-8">
            <PageHead icon="komentar" eyebrow="Catatan Guru" title={`Catatan untuk ${name}`} desc="Catatan langsung dari guru kelas, dari yang terbaru. Masukan untuk karya anak juga tercatat di sini." />
            <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_340px]">
              {notes.length === 0 ? (
                <div className="kartu flex flex-col items-center px-6 py-14 text-center">
                  <IkonKotak name="komentar" />
                  <p className="mt-3 font-judul text-lg font-bold">Belum ada catatan</p>
                  <p className="mt-1 max-w-md text-sm text-tinta-2">Catatan dari guru akan muncul di sini begitu guru menulisnya.</p>
                </div>
              ) : (
                <ol className="berurutan relative flex flex-col gap-4" aria-label="Riwayat catatan guru">
                  {notes.map((n, i) => {
                    const j = JENIS[n.kind];
                    return (
                      <li key={n.at + i} className="relative flex gap-4">
                        <span className="relative z-10 grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-kobalt-muda text-kobalt ring-4 ring-kertas"><Ikon name={j.icon} /></span>
                        {i < notes.length - 1 && <span aria-hidden="true" className="absolute left-5 top-10 -bottom-4 w-px bg-tinta/15" />}
                        <article className="kartu min-w-0 flex-1 p-5">
                          <div className="flex flex-wrap items-baseline justify-between gap-x-3">
                            <h2 className="text-base">{j.judul}</h2>
                            <p className="text-xs text-tinta-2">{tgl(n.at)} · {ago(n.at)}</p>
                          </div>
                          <p className="mt-2 leading-relaxed">{n.text}</p>
                        </article>
                      </li>
                    );
                  })}
                </ol>
              )}

              <aside className="flex flex-col gap-4 lg:sticky lg:top-24 lg:self-start">
                <section className="kartu p-5" aria-labelledby="privasi">
                  <h2 id="privasi" className="flex items-center gap-2 text-base"><Ikon name="kunci" size={18} className="text-kobalt" />Keamanan dan privasi</h2>
                  <ul className="mt-3 flex flex-col gap-3 text-sm text-tinta-2">
                    {PRIVASI.map((p) => (
                      <li key={p} className="flex gap-2.5"><span aria-hidden="true" className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-kobalt" /><span>{p}</span></li>
                    ))}
                  </ul>
                </section>
                <section className="kartu p-5">
                  <h2 className="text-base">Ingin menghubungi guru?</h2>
                  <p className="mt-2 text-sm text-tinta-2">Sampaikan pertanyaan atau kabar penting kepada guru kelas melalui sekolah. Catatan di halaman ini hanya satu arah, dari guru kepada orang tua.</p>
                </section>
              </aside>
            </div>
          </div>
        );
      }}
    </ParentShell>
  );
}
