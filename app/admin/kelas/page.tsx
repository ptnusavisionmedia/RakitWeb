import Link from "next/link";
import { CreateRoom } from "@/components/AdminClient";
import { AdminShell } from "@/components/Shell";
import { PageHead } from "@/components/Status";
import { adminStats, getRoom, listUsers } from "@/lib/db";

export const dynamic = "force-dynamic";

export default function AdminKelas() {
  return (
    <AdminShell>
      {() => {
        const s = adminStats();
        const levels = [1, 2, 3, 4, 5, 6];
        const teachers = listUsers({ role: "teacher" }).map((t) => ({ id: t.id, name: t.nickname, className: t.classId ? getRoom(t.classId)?.name : undefined }));
        return (
          <div className="flex flex-col gap-8">
            <PageHead
              icon="kelas"
              eyebrow="Kelas"
              title="Semua kelas"
              desc={`${s.rooms} kelas di 6 tingkat. Pilih satu kelas untuk melihat siswa, nilai, karya, orang tua, dan aktivitasnya secara terpisah.`}
            />

            {levels.map((lv) => {
              const rooms = s.perClass.filter((c) => c.level === lv);
              return (
                <section key={lv} aria-labelledby={`tingkat-${lv}`}>
                  <div className="mb-3 flex flex-wrap items-baseline gap-x-3">
                    <h2 id={`tingkat-${lv}`} className="text-lg">Tingkat {lv}</h2>
                    <span className="text-sm text-tinta-2">{rooms[0]?.project} · {rooms.length} kelas</span>
                  </div>
                  <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                    {rooms.map((c) => (
                      <li key={c.id}>
                        <Link href={`/admin/kelas/${c.id}`} className="kartu angkat flex h-full flex-col gap-4 p-5" aria-label={`Buka ${c.name}`}>
                          <span className="flex items-start gap-3">
                            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-kobalt font-judul text-lg font-bold text-white">{c.level}</span>
                            <span className="min-w-0 flex-1 leading-snug">
                              <span className="block truncate font-judul text-lg font-bold">{c.name}</span>
                              <span className="block truncate text-sm text-tinta-2">{c.teachers.length ? `Wali: ${c.teachers.map((t) => t.name).join(", ")}` : "Belum ada wali kelas"}</span>
                            </span>
                            <span aria-hidden="true" className="tautan">→</span>
                          </span>
                          <span className="grid grid-cols-3 gap-2 text-center text-sm">
                            <span className="rounded-lg bg-kertas-2/70 px-2 py-2"><b className="block font-judul text-lg">{c.students}</b>siswa</span>
                            <span className="rounded-lg bg-kertas-2/70 px-2 py-2"><b className="block font-judul text-lg">{c.avg}%</b>progres</span>
                            <span className="rounded-lg bg-kertas-2/70 px-2 py-2"><b className="block font-judul text-lg">{c.waiting}</b>menunggu</span>
                          </span>
                          <span className="h-1.5 overflow-hidden rounded-full bg-tinta/10" aria-hidden="true">
                            <span className="block h-full rounded-full bg-kobalt" style={{ width: `${c.avg}%` }} />
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </section>
              );
            })}

            <CreateRoom teachers={teachers} />
          </div>
        );
      }}
    </AdminShell>
  );
}
