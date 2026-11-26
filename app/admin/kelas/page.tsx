import Link from "next/link";
import { ClassTabs } from "@/components/ClassTabs";
import { Monogram } from "@/components/Monogram";
import { AdminShell } from "@/components/Shell";
import { PageHead, Stat, Status } from "@/components/Status";
import { classMeta, isLevel } from "@/lib/curriculum/types";
import { adminStats, listUsers } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function AdminKelas({ searchParams }: { searchParams: Promise<{ k?: string }> }) {
  const sp = await searchParams;
  const k = Number(sp.k ?? 1);
  const level = isLevel(k) ? k : 1;
  return (
    <AdminShell>
      {() => {
        const meta = classMeta(level);
        const c = adminStats().perClass.find((x) => x.level === level)!;
        const students = listUsers({ role: "student", level });
        const teachers = listUsers({ role: "teacher", level });
        return (
          <div className="flex flex-col gap-8">
            <PageHead icon="kelas" eyebrow="Kelas" title={`Kelas ${level}`} desc={`${meta.project} · ${meta.meetings} pertemuan × ${meta.minutes} menit`} right={<ClassTabs base="/admin/kelas" current={level} />} />

            <div className="berurutan grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <Stat icon="kelas" label="Siswa" value={c.students} note={`rata-rata progres ${c.avg}%`} />
              <Stat icon="komentar" label="Menunggu ditinjau" value={c.waiting} note="kiriman karya" />
              <Stat icon="galeri" label="Di galeri" value={c.published} note="karya dipublikasikan" />
              <Stat icon="buku" label="Rapor terkirim" value={`${c.reportsSent} / ${c.students}`} />
            </div>

            <section className="kartu p-6" aria-labelledby="alat">
              <h2 id="alat" className="text-lg">Alat kelas</h2>
              <p className="mt-1 text-sm text-tinta-2">Admin dapat memakai semua alat guru untuk kelas ini: menambah siswa, meninjau karya, menilai, dan mengirim rapor.</p>
              <div className="mt-4 flex flex-wrap gap-3">
                <Link href={`/guru?k=${level}`} className="tombol-2 tombol-kecil">Daftar siswa</Link>
                <Link href={`/guru/materi?k=${level}`} className="tombol-2 tombol-kecil">Materi</Link>
                <Link href={`/guru/tinjau?k=${level}`} className="tombol-2 tombol-kecil">Tinjau karya</Link>
                <Link href={`/guru/nilai?k=${level}`} className="tombol-2 tombol-kecil">Nilai dan rapor</Link>
              </div>
            </section>

            <div className="grid gap-6 lg:grid-cols-[minmax(0,340px)_minmax(0,1fr)]">
              <section className="kartu p-6" aria-labelledby="guru">
                <h2 id="guru" className="text-lg">Wali kelas</h2>
                {teachers.length === 0 ? (
                  <p className="mt-3 text-tinta-2">Belum ada guru. <Link href="/admin/pengguna?peran=teacher" className="tautan">Tambah guru</Link></p>
                ) : (
                  <ul className="mt-3 divide-y divide-tinta/10">
                    {teachers.map((t) => (
                      <li key={t.id} className="flex items-center gap-3 py-2.5">
                        <Monogram name={t.nickname} size={34} />
                        <Link href={`/admin/pengguna/${t.id}`} className="min-w-0 flex-1 truncate font-semibold text-kobalt hover:underline">{t.nickname}</Link>
                        <span className="text-xs text-tinta-2">{t.username}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </section>

              <section aria-labelledby="siswa">
                <h2 id="siswa" className="mb-3 text-lg">Siswa</h2>
                {students.length === 0 ? (
                  <p className="kartu p-6 text-tinta-2">Belum ada siswa di kelas ini.</p>
                ) : (
                  <ul className="kartu divide-y divide-tinta/10">
                    {students.map((s) => (
                      <li key={s.id} className="baris flex flex-wrap items-center gap-x-4 gap-y-2 px-5 py-3">
                        <span className="flex min-w-[12rem] flex-1 items-center gap-3">
                          <Monogram name={s.nickname} size={34} />
                          <span className="min-w-0 leading-tight">
                            <Link href={`/admin/pengguna/${s.id}`} className="block truncate font-semibold text-kobalt hover:underline">{s.nickname}</Link>
                            <span className="block text-xs text-tinta-2">{s.username} · {s.links} orang tua</span>
                          </span>
                        </span>
                        <span className="text-sm text-tinta-2">{s.pct}% selesai</span>
                        <Status status={s.status} />
                      </li>
                    ))}
                  </ul>
                )}
              </section>
            </div>
          </div>
        );
      }}
    </AdminShell>
  );
}
