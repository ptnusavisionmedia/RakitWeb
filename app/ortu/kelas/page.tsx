import Link from "next/link";
import { IkonKotak } from "@/components/Deco";
import { Monogram } from "@/components/Monogram";
import { LinkChild, UnlinkButton } from "@/components/ParentClient";
import { ParentPlain } from "@/components/Shell";
import { PageHead } from "@/components/Status";
import { isLevel } from "@/lib/curriculum";
import { classDirectory, demoCodes, searchStudents } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function OrtuCariKelas({ searchParams }: { searchParams: Promise<{ k?: string; q?: string }> }) {
  const sp = await searchParams;
  const kNum = Number(sp.k);
  const level = isLevel(kNum) ? kNum : undefined;
  const q = (sp.q ?? "").slice(0, 30);
  return (
    <ParentPlain>
      {({ parent, kids }) => {
        const dir = classDirectory();
        const chosen = level ? dir.find((c) => c.level === level) : undefined;
        const linked = new Set(kids.map((k) => k.id));
        const results = searchStudents(q, level);
        const searched = q.trim().length > 0;
        const href = (k?: number) => `/ortu/kelas${k ? `?k=${k}` : ""}`;
        return (
          <div className="flex flex-col gap-8">
            <PageHead icon="kelas" eyebrow="Cari Kelas" title="Temukan kelas anak Anda" desc="Satu akun bisa memantau anak di kelas mana pun. Pilih kelas, cari nama anak, lalu hubungkan dengan kode orang tua." />

            <section aria-labelledby="pilih-kelas">
              <h2 id="pilih-kelas" className="mb-3 text-lg">1. Pilih kelas</h2>
              <ul className="berurutan grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {dir.map((c) => (
                  <li key={c.level}>
                    <Link href={level === c.level ? href() : href(c.level)} aria-current={level === c.level ? "true" : undefined} className={`kartu angkat flex h-full gap-4 p-4 ${level === c.level ? "!border-kobalt ring-2 ring-kobalt" : ""}`}>
                      <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-kobalt font-judul text-xl font-bold text-white">{c.level}</span>
                      <span className="min-w-0 leading-snug">
                        <span className="block font-judul font-bold">Kelas {c.level}</span>
                        <span className="block truncate text-sm text-tinta-2">{c.project}</span>
                        <span className="mt-1 block text-sm"><b>{c.teacher}</b> · {c.students} siswa</span>
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
              {chosen && (
                <div className="catatan mt-3">
                  <b>Kelas {chosen.level}</b> diampu <b>{chosen.teacher}</b>. {chosen.mode === "visual" ? "Anak menyusun halaman dengan editor visual." : "Anak menulis HTML, CSS, dan JavaScript."} {chosen.meetings} pertemuan × {chosen.minutes} menit, {chosen.students} siswa terdaftar.
                </div>
              )}
            </section>

            <section aria-labelledby="cari-anak">
              <h2 id="cari-anak" className="mb-3 text-lg">2. Cari nama anak {chosen ? `di kelas ${chosen.level}` : "di semua kelas"}</h2>
              <form method="get" action="/ortu/kelas" className="kartu flex flex-wrap items-end gap-3 p-4">
                {level && <input type="hidden" name="k" value={level} />}
                <div className="min-w-[220px] flex-1">
                  <label htmlFor="cari" className="label-kecil">Nama panggilan anak</label>
                  <input id="cari" name="q" className="isian mt-1" defaultValue={q} maxLength={30} placeholder="Contoh: Mira" autoComplete="off" />
                </div>
                <button type="submit" className="tombol">Cari</button>
                {searched && <Link href={href(level)} className="tautan pb-3">Hapus pencarian</Link>}
              </form>

              {searched && q.trim().length < 2 && <p className="mt-3 text-sm text-tinta-2">Ketik minimal 2 huruf agar hasil lebih tepat.</p>}
              {searched && q.trim().length >= 2 && (
                results.length === 0 ? (
                  <div className="kartu mt-3 flex flex-col items-center px-6 py-10 text-center">
                    <IkonKotak name="kelas" />
                    <p className="mt-3 font-judul text-lg font-bold">Tidak ada anak bernama “{q}”</p>
                    <p className="mt-1 max-w-md text-sm text-tinta-2">Periksa ejaan, atau coba pilih kelas lain. Anda juga bisa meminta guru memastikan nama panggilan anak.</p>
                  </div>
                ) : (
                  <ul className="berurutan kartu mt-3 divide-y divide-tinta/10 overflow-hidden" aria-label="Hasil pencarian">
                    {results.map((r) => (
                      <li key={r.id} className="flex flex-wrap items-center gap-x-4 gap-y-3 px-5 py-4">
                        <Monogram name={r.name} size={40} />
                        <span className="min-w-[140px] flex-1 leading-tight">
                          <span className="block font-semibold">{r.name}</span>
                          <span className="text-sm text-tinta-2">Kelas {r.level}</span>
                        </span>
                        {linked.has(r.id) ? <span className="pil pil-biru">Sudah terhubung</span> : <LinkChild studentId={r.id} name={r.name} />}
                      </li>
                    ))}
                  </ul>
                )
              )}
              <p className="mt-3 text-sm text-tinta-2">Demi privasi, daftar nama siswa tidak ditampilkan. Kode orang tua terdiri dari 6 karakter. Anak bisa melihatnya di halaman Profil, dan guru juga bisa memberikannya.</p>
            </section>

            {parent.demo && (
              <section className="kartu border-l-4 !border-l-kobalt p-5" aria-labelledby="kode-demo">
                <p className="label-kecil">Mode demo</p>
                <h2 id="kode-demo" className="mt-1 text-lg">Kode contoh untuk mencoba</h2>
                <p className="mt-1 text-sm text-tinta-2">Di akun sungguhan, kode ini diberikan oleh anak atau gurunya. Salin salah satu kode di bawah untuk mencoba menghubungkan anak dari kelas lain.</p>
                <ul className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                  {demoCodes().map((d) => (
                    <li key={d.code} className="flex items-center justify-between gap-3 rounded-lg bg-kertas-2/70 px-3 py-2">
                      <span className="text-sm"><b>{d.name}</b> · Kelas {d.level}</span>
                      <code className="font-mono font-bold tracking-widest text-kobalt-tua">{d.code}</code>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            <section aria-labelledby="terhubung">
              <h2 id="terhubung" className="mb-3 text-lg">Anak yang terhubung ({kids.length})</h2>
              {kids.length === 0 ? (
                <p className="kartu p-5 text-tinta-2">Belum ada anak yang terhubung. Cari nama anak di atas untuk memulai.</p>
              ) : (
                <ul className="kartu divide-y divide-tinta/10 overflow-hidden">
                  {kids.map((k) => (
                    <li key={k.id} className="flex flex-wrap items-center gap-4 px-5 py-3.5">
                      <Monogram name={k.name} size={38} />
                      <span className="min-w-[140px] flex-1 leading-tight">
                        <span className="block font-semibold">{k.name}</span>
                        <span className="text-sm text-tinta-2">Kelas {k.level}</span>
                      </span>
                      <UnlinkButton childId={k.id} name={k.name} />
                    </li>
                  ))}
                </ul>
              )}
            </section>
          </div>
        );
      }}
    </ParentPlain>
  );
}
