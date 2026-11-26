import { ResetAll } from "@/components/AdminClient";
import { Ikon } from "@/components/Deco";
import { AdminShell } from "@/components/Shell";
import { PageHead } from "@/components/Status";
import { recentLogs } from "@/lib/db";
import { ago, tgl } from "@/lib/format";

export const dynamic = "force-dynamic";

export default function AdminSistem() {
  return (
    <AdminShell>
      {() => {
        const logs = recentLogs(200);
        return (
          <div className="flex flex-col gap-8">
            <PageHead icon="kunci" eyebrow="Sistem" title="Data dan keamanan" desc="Unduh cadangan, pulihkan data contoh, dan periksa log aktivitas seluruh pengguna." />

            <div className="grid gap-6 lg:grid-cols-2">
              <section className="kartu p-6" aria-labelledby="cadangan">
                <h2 id="cadangan" className="flex items-center gap-2 text-lg"><Ikon name="kirim" size={20} className="text-kobalt" />Cadangan data</h2>
                <p className="mt-2 text-sm text-tinta-2">Unduh semua akun, progres, karya, nilai, rapor, dan log dalam satu berkas JSON. Kata sandi dan PIN tidak ikut diunduh.</p>
                <a href="/api/admin/export" className="tombol mt-4" download>Unduh cadangan</a>
              </section>

              <section className="kartu border-l-4 !border-l-salah p-6" aria-labelledby="pulihkan">
                <h2 id="pulihkan" className="text-lg text-salah-tua">Pulihkan data contoh</h2>
                <p className="mt-2 mb-4 text-sm text-tinta-2">Mengembalikan semua akun, progres, karya, nilai, dan rapor ke data contoh awal. Akun yang ditambahkan akan hilang dan log dikosongkan.</p>
                <ResetAll />
              </section>
            </div>

            <section aria-labelledby="log">
              <h2 id="log" className="mb-3 text-lg">Log aktivitas <span className="text-sm font-normal text-tinta-2">({logs.length} terbaru)</span></h2>
              {logs.length === 0 ? (
                <p className="kartu p-6 text-tinta-2">Belum ada aktivitas tercatat.</p>
              ) : (
                <div className="kartu overflow-x-auto">
                  <table className="w-full min-w-[640px] text-left text-sm">
                    <thead className="border-b border-tinta/10 bg-kertas-2/50">
                      <tr>
                        {["Waktu", "Pengguna", "Tindakan", "Rincian"].map((h) => (
                          <th key={h} scope="col" className="label-kecil px-4 py-2.5 font-semibold">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-tinta/10">
                      {logs.map((l, i) => (
                        <tr key={l.at + i}>
                          <td className="whitespace-nowrap px-4 py-2.5 text-tinta-2" title={tgl(l.at)}>{ago(l.at)}</td>
                          <td className="px-4 py-2.5 font-semibold">{l.actorName}</td>
                          <td className="px-4 py-2.5">{l.action}</td>
                          <td className="px-4 py-2.5 text-tinta-2">{l.detail || "-"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </section>
          </div>
        );
      }}
    </AdminShell>
  );
}
