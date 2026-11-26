import Link from "next/link";
import { AdminShell } from "@/components/Shell";
import { PageHead, Stat } from "@/components/Status";
import { adminStats, recentLogs } from "@/lib/db";
import { ago, tgl } from "@/lib/format";
import { termLabel } from "@/lib/nilai";

export const dynamic = "force-dynamic";

export default function AdminDasbor() {
  return (
    <AdminShell>
      {(a) => {
        const s = adminStats();
        const logs = recentLogs(8);
        return (
          <div className="flex flex-col gap-8">
            <PageHead
              icon="kunci"
              eyebrow="Admin super"
              title={`Halo, ${a.nickname}`}
              desc={`Kendali penuh atas seluruh sekolah: pengguna, kelas, nilai, rapor, dan data. ${termLabel()}.`}
              right={
                <>
                  <Link href="/admin/pengguna" className="tombol">Kelola pengguna</Link>
                  <Link href="/admin/sistem" className="tombol-2">Sistem</Link>
                </>
              }
            />
            {a.demo && (
              <p className="catatan text-sm">
                Anda memakai <b>akun demo admin</b>. Semua fitur aktif, kecuali mengubah atau menghapus akun admin asli. Gunakan <Link href="/admin/sistem" className="tautan">Pulihkan data contoh</Link> bila ingin mengulang dari awal.
              </p>
            )}

            <div className="berurutan grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <Stat icon="kelas" label="Siswa" value={s.students} note="di 6 kelas" />
              <Stat icon="buku" label="Guru" value={s.teachers} note={`${s.admins} admin`} />
              <Stat icon="komentar" label="Orang tua" value={s.parents} note="akun terdaftar" />
              <Stat icon="galeri" label="Karya dikirim" value={s.works} note={`${s.waiting} menunggu ditinjau · ${s.reports} rapor terkirim`} />
            </div>

            <section aria-labelledby="per-kelas">
              <div className="mb-3 flex flex-wrap items-baseline justify-between gap-2">
                <h2 id="per-kelas" className="text-lg">Ringkasan per kelas</h2>
                <Link href="/admin/kelas" className="tautan text-sm">Lihat detail kelas →</Link>
              </div>
              <div className="kartu overflow-x-auto">
                <table className="w-full min-w-[720px] text-left text-sm">
                  <thead className="border-b border-tinta/10 bg-kertas-2/50">
                    <tr>
                      {["Kelas", "Wali kelas", "Siswa", "Rata-rata progres", "Menunggu ditinjau", "Galeri", "Rapor terkirim"].map((h) => (
                        <th key={h} scope="col" className="label-kecil px-4 py-2.5 font-semibold">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-tinta/10">
                    {s.perClass.map((c) => (
                      <tr key={c.level} className="baris">
                        <td className="px-4 py-3">
                          <Link href={`/admin/kelas?k=${c.level}`} className="font-semibold text-kobalt hover:underline">Kelas {c.level}</Link>
                          <span className="block max-w-[14rem] truncate text-xs text-tinta-2">{c.project}</span>
                        </td>
                        <td className="px-4 py-3">{c.teachers.length ? c.teachers.map((t) => t.name).join(", ") : <span className="text-tinta-2">Belum ada</span>}</td>
                        <td className="px-4 py-3 font-semibold">{c.students}</td>
                        <td className="px-4 py-3">
                          <span className="flex items-center gap-2">
                            <span className="h-1.5 w-20 overflow-hidden rounded-full bg-tinta/10"><span className="block h-full rounded-full bg-kobalt" style={{ width: `${c.avg}%` }} /></span>
                            {c.avg}%
                          </span>
                        </td>
                        <td className="px-4 py-3">{c.waiting ? <span className="pil pil-biru">{c.waiting}</span> : "0"}</td>
                        <td className="px-4 py-3">{c.published}</td>
                        <td className="px-4 py-3">{c.reportsSent} / {c.students}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            <section aria-labelledby="aktivitas" className="kartu p-6">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <h2 id="aktivitas" className="text-lg">Aktivitas terbaru</h2>
                <Link href="/admin/sistem" className="tautan text-sm">Semua log →</Link>
              </div>
              {logs.length === 0 ? (
                <p className="mt-3 text-tinta-2">Belum ada aktivitas tercatat.</p>
              ) : (
                <ul className="mt-3 divide-y divide-tinta/10">
                  {logs.map((l, i) => (
                    <li key={l.at + i} className="flex flex-wrap items-baseline gap-x-3 gap-y-0.5 py-2.5 text-sm">
                      <span className="font-semibold">{l.action}</span>
                      <span className="min-w-0 flex-1 text-tinta-2">{l.detail}</span>
                      <span className="text-xs text-tinta-2" title={tgl(l.at)}>{l.actorName} · {ago(l.at)}</span>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          </div>
        );
      }}
    </AdminShell>
  );
}
