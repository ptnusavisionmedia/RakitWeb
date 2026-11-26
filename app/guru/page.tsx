import { RoomTabs } from "@/components/RoomTabs";
import { Monogram } from "@/components/Monogram";
import { TeacherShell } from "@/components/Shell";
import { PageHead, Stat, Status } from "@/components/Status";
import { AddStudent, MoveStudent } from "@/components/TeacherClient";
import { classMeta, getLesson } from "@/lib/curriculum";
import { listRooms, listStudents, roomForTeacher, seesAllClasses } from "@/lib/db";
import { ago } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function GuruKelas({ searchParams }: { searchParams: Promise<{ k?: string; c?: string }> }) {
  const sp = await searchParams;
  return (
    <TeacherShell>
      {(t) => {
        // Guru kelas hanya melihat kelasnya sendiri; koordinator dan admin memilih kelas.
        const all = seesAllClasses(t);
        const room = roomForTeacher(t, sp.c ?? sp.k);
        const level = room.level;
        const meta = classMeta(level);
        const rows = listStudents(level, room.id);
        const rooms = listRooms().map((r) => ({ id: r.id, name: r.name, level: r.level }));
        const waiting = rows.filter((r) => r.status === "submitted").length;
        const active = rows.filter((r) => r.progress && r.progress.last > 0).length;
        return (
          <div className="flex flex-col gap-8">
            <PageHead icon="kelas" eyebrow="Kelas" title={room.name} desc={`Tingkat ${level} · ${meta.project} · ${meta.meetings} pertemuan × ${meta.minutes} menit`} right={all ? <RoomTabs base="/guru" current={room.id} /> : <span className="pil pil-isi">{t.nickname}</span>} />

            <div className="berurutan grid gap-4 sm:grid-cols-3">
              {[
                ["kelas", "Siswa", rows.length, "terdaftar di kelas ini"],
                ["buku", "Sudah mulai", active, "membuka minimal satu pertemuan"],
                ["komentar", "Menunggu ditinjau", waiting, "kiriman karya"],
              ].map(([ic, t, n, d]) => (
                <Stat key={String(t)} icon={String(ic)} label={String(t)} value={n} note={String(d)} />
              ))}
            </div>

            <section aria-labelledby="daftar-siswa">
              <h2 id="daftar-siswa" className="mb-3 text-lg">Siswa dan pertemuan terakhir</h2>
              {rows.length === 0 ? (
                <p className="kartu p-6 text-tinta-2">Belum ada siswa di kelas ini. Tambahkan siswa di bawah. Siswa baru mulai dari pertemuan 1.</p>
              ) : (
                <div className="kartu overflow-hidden">
                  <div className="hidden grid-cols-[minmax(0,1.1fr)_minmax(0,1.6fr)_minmax(0,1fr)_auto] gap-4 border-b border-tinta/10 bg-kertas-2/50 px-5 py-2.5 lg:grid">
                    <span className="label-kecil">Siswa</span>
                    <span className="label-kecil">Pertemuan terakhir</span>
                    <span className="label-kecil">Karya</span>
                    <span className="label-kecil w-[218px]">{all ? "Pindah kelas" : "Kode orang tua"}</span>
                  </div>
                  <ul className="berurutan divide-y divide-tinta/10">
                    {rows.map(({ user, progress, status, parentCode }) => {
                      const last = progress && progress.last > 0 ? getLesson(level, progress.last) : undefined;
                      return (
                        <li key={user.id} className="baris grid items-center gap-x-4 gap-y-3 px-5 py-4 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1.6fr)_minmax(0,1fr)_auto]">
                          <div className="flex min-w-0 items-center gap-3">
                            <Monogram name={user.nickname} size={38} />
                            <div className="min-w-0 leading-tight">
                              <p className="truncate font-semibold">{user.nickname}</p>
                              <p className="truncate text-xs text-tinta-2">Nama masuk: {user.demo ? "(akun demo)" : user.username}</p>
                            </div>
                          </div>
                          <div className="min-w-0 leading-snug">
                            {last ? (
                              <>
                                <p className="truncate text-[.95rem] font-medium">Pertemuan {last.no} dari {last.total}: {last.title}</p>
                                <p className="text-xs text-tinta-2">{progress!.completed.length} selesai · dibuka {ago(progress!.lastAt)}</p>
                              </>
                            ) : (
                              <p className="text-sm text-tinta-2">Belum mulai belajar</p>
                            )}
                          </div>
                          <div><Status status={status ?? undefined} /></div>
                          {all ? (
                            <MoveStudent id={user.id} roomId={room.id} rooms={rooms} nickname={user.nickname} />
                          ) : (
                            <span className="w-[218px] font-mono text-sm font-bold tracking-widest text-kobalt-tua" title="Berikan kode ini kepada orang tua untuk menghubungkan akun">{parentCode}</span>
                          )}
                        </li>
                      );
                    })}
                  </ul>
                </div>
              )}
            </section>

            <AddStudent roomId={room.id} roomName={room.name} />
          </div>
        );
      }}
    </TeacherShell>
  );
}
