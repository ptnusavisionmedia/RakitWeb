import Link from "next/link";
import { Monogram } from "@/components/Monogram";
import { TeacherShell } from "@/components/Shell";
import { PageHead, Status } from "@/components/Status";
import { getRoom, listRooms, listWorks, roomOf, roomForTeacher, seesAllClasses } from "@/lib/db";
import { ago } from "@/lib/format";
import { IkonKotak } from "@/components/Deco";

export const dynamic = "force-dynamic";

const FILTERS: [string, string][] = [["submitted", "Menunggu ditinjau"], ["revision", "Perlu diperbaiki"], ["published", "Di galeri"], ["", "Semua"]];

export default async function GuruTinjau({ searchParams }: { searchParams: Promise<{ k?: string; c?: string; s?: string }> }) {
  const sp = await searchParams;
  const s = sp.s === undefined ? "submitted" : sp.s;
  const href = (c?: string, ns?: string) => `/guru/tinjau?${c ? `c=${c}&` : ""}s=${ns ?? s}`;
  return (
    <TeacherShell>
      {(t) => {
        // Guru kelas hanya melihat kiriman kelasnya sendiri.
        const many = seesAllClasses(t);
        const wanted = sp.c ?? sp.k;
        const room = many ? (wanted ? (getRoom(wanted) ?? roomForTeacher(t, wanted)) : undefined) : roomForTeacher(t);
        const all = listWorks(undefined, room?.id);
        const rows = s ? all.filter((r) => r.work.status === s) : all;
        const count = (v: string) => (v ? all.filter((r) => r.work.status === v).length : all.length);
        return (
          <div className="flex flex-col gap-6">
            <PageHead icon="komentar" eyebrow="Tinjau Karya" title="Kiriman siswa" desc="Buka satu kiriman, beri satu komentar yang bisa ditindaklanjuti, lalu minta perbaikan atau tampilkan di galeri kelas." />
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="segmen" role="group" aria-label="Saring status">
                {FILTERS.map(([v, t]) => (
                  <Link key={t} href={href(room?.id, v)} aria-current={s === v ? "true" : undefined}>
                    {t}
                    <span className="ml-1.5 text-xs opacity-60">{count(v)}</span>
                  </Link>
                ))}
              </div>
              {many && <div className="segmen" role="group" aria-label="Saring kelas">
                <Link href={href(undefined)} className={!room ? "aktif" : ""}>Semua kelas</Link>
                {listRooms().map((r) => (
                  <Link key={r.id} href={href(r.id)} className={room?.id === r.id ? "aktif" : ""}>{r.name}</Link>
                ))}
              </div>}
            </div>
            {rows.length === 0 ? (
              <div className="kartu flex flex-col items-center px-6 py-14 text-center">
                <IkonKotak name="komentar" />
                <p className="mt-3 font-judul text-lg font-bold">Tidak ada karya dengan status ini</p>
                <p className="mx-auto mt-1 max-w-md text-sm text-tinta-2">Kiriman siswa muncul di sini setelah mereka menekan “Kirim ke guru”.</p>
              </div>
            ) : (
              <ul className="berurutan kartu divide-y divide-tinta/10 overflow-hidden">
                {rows.map(({ work, user }) => (
                  <li key={work.id}>
                    <Link href={`/guru/tinjau/${work.id}`} className="baris flex flex-wrap items-center gap-x-4 gap-y-2 px-5 py-3.5">
                      <Monogram name={user.nickname} size={38} />
                      <span className="min-w-[160px] flex-1 leading-tight">
                        <span className="block font-semibold">{user.nickname}</span>
                        <span className="text-sm text-tinta-2">{roomOf(user)?.name ?? `Kelas ${work.level}`} · dikirim {ago(work.submittedAt)}</span>
                      </span>
                      <Status status={work.status} />
                      <span className="tautan">Tinjau →</span>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        );
      }}
    </TeacherShell>
  );
}
