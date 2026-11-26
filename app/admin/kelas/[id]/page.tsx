import Link from "next/link";
import { notFound } from "next/navigation";
import { ActionButton, CreateUser, MoveRoom, RoomSettings } from "@/components/AdminClient";
import { ClassReportActions } from "@/components/GradeForms";
import { Monogram } from "@/components/Monogram";
import { AdminShell } from "@/components/Shell";
import { PageHead, Stat, Status } from "@/components/Status";
import { classMeta, getLesson } from "@/lib/curriculum";
import { classSheet, getRoom, listRooms, listUsers, listWorks, parentsOfRoom, roomLogs, roomStats, teachersOfRoom, type ReportStatus } from "@/lib/db";
import { ago, tgl } from "@/lib/format";
import { predikat, termLabel } from "@/lib/nilai";

export const dynamic = "force-dynamic";

const TABS = [
  ["", "Ringkasan"],
  ["siswa", "Siswa"],
  ["nilai", "Nilai & rapor"],
  ["karya", "Karya"],
  ["ortu", "Orang tua"],
  ["aktivitas", "Aktivitas"],
  ["atur", "Pengaturan"],
] as const;
type Tab = (typeof TABS)[number][0];

const RAPOR: Record<ReportStatus, [string, string]> = {
  belum: ["Belum dibuat", "pil"],
  draf: ["Draf", "pil pil-tinta"],
  terkirim: ["Terkirim", "pil pil-isi"],
  diperbarui: ["Kirim ulang", "pil pil-biru"],
};
const val = (n: number | null | undefined) => (n === null || n === undefined ? <span className="text-tinta-2">–</span> : n);

export default async function AdminKelasDetail({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ tab?: string }> }) {
  const { id } = await params;
  const sp = await searchParams;
  const tab: Tab = TABS.some(([v]) => v === sp.tab) ? (sp.tab as Tab) : "";
  return (
    <AdminShell wide>
      {(a) => {
        const room = getRoom(id);
        if (!room) notFound();
        const meta = classMeta(room.level);
        const stats = roomStats(room.id)!;
        const sheet = classSheet(a, room.id)!;
        const teachers = teachersOfRoom(room.id);
        const href = (t: Tab) => `/admin/kelas/${room.id}${t ? `?tab=${t}` : ""}`;
        const ready = sheet.rows.filter((r) => r.sh.final !== null).length;
        return (
          <div className="flex flex-col gap-6">
            <p><Link href="/admin/kelas" className="tautan text-sm">← Semua kelas</Link></p>
            <PageHead
              icon="kelas"
              eyebrow={`Tingkat ${room.level} · ${meta.project}`}
              title={room.name}
              desc={`${teachers.length ? `Wali kelas ${teachers.map((t) => t.nickname).join(", ")}` : "Belum ada wali kelas"} · ${meta.meetings} pertemuan × ${meta.minutes} menit · ${termLabel()}`}
              right={
                <>
                  <Link href={`/guru?c=${room.id}`} className="tombol">Buka sebagai guru</Link>
                </>
              }
            />

            <nav aria-label="Bagian data kelas" className="segmen self-start">
              {TABS.map(([v, label]) => (
                <Link key={v} href={href(v)} aria-current={tab === v ? "page" : undefined}>{label}</Link>
              ))}
            </nav>

            {tab === "" && (
              <>
                <div className="berurutan grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  <Stat icon="kelas" label="Siswa" value={stats.students} note={`rata-rata progres ${stats.avg}%`} />
                  <Stat icon="komentar" label="Menunggu ditinjau" value={stats.waiting} note={`${stats.published} karya di galeri`} />
                  <Stat icon="cek" label="Nilai lengkap" value={`${ready} / ${sheet.rows.length}`} note="siap dibuatkan rapor" />
                  <Stat icon="kirim" label="Rapor terkirim" value={`${stats.reportsSent} / ${stats.students}`} />
                </div>
                <div className="grid gap-6 lg:grid-cols-2">
                  <section className="kartu p-6" aria-labelledby="alat">
                    <h2 id="alat" className="text-lg">Alat guru untuk kelas ini</h2>
                    <p className="mt-1 text-sm text-tinta-2">Semua alat guru terbuka khusus untuk {room.name}.</p>
                    <div className="mt-4 flex flex-wrap gap-3">
                      <Link href={`/guru?c=${room.id}`} className="tombol-2 tombol-kecil">Daftar siswa</Link>
                      <Link href={`/guru/tinjau?c=${room.id}`} className="tombol-2 tombol-kecil">Tinjau karya</Link>
                      <Link href={`/guru/nilai?c=${room.id}`} className="tombol-2 tombol-kecil">Rekap nilai lengkap</Link>
                      <Link href={`/guru/materi?k=${room.level}`} className="tombol-2 tombol-kecil">Materi tingkat {room.level}</Link>
                    </div>
                  </section>
                  <section className="kartu p-6" aria-labelledby="perhatian">
                    <h2 id="perhatian" className="text-lg">Perlu perhatian</h2>
                    {(() => {
                      const list = sheet.rows
                        .map((r) => {
                          const last = r.sh.rows.filter((x) => x.done).length;
                          const reason = r.sh.work?.status === "submitted" ? "Karya menunggu ditinjau" : r.sh.work?.status === "revision" ? "Sedang memperbaiki karya" : last === 0 ? "Belum mulai belajar" : null;
                          return reason ? { r, reason } : null;
                        })
                        .filter((x): x is NonNullable<typeof x> => !!x);
                      return list.length === 0 ? (
                        <p className="mt-3 text-tinta-2">Tidak ada yang perlu ditindaklanjuti saat ini.</p>
                      ) : (
                        <ul className="mt-3 divide-y divide-tinta/10">
                          {list.map(({ r, reason }) => (
                            <li key={r.user.id} className="flex flex-wrap items-center justify-between gap-2 py-2.5">
                              <Link href={`/admin/pengguna/${r.user.id}`} className="font-semibold text-kobalt hover:underline">{r.sh.name}</Link>
                              <span className="text-sm text-tinta-2">{reason}</span>
                            </li>
                          ))}
                        </ul>
                      );
                    })()}
                  </section>
                </div>
              </>
            )}

            {tab === "siswa" && (
              <>
                <section aria-labelledby="daftar-siswa">
                  <h2 id="daftar-siswa" className="mb-3 text-lg">{sheet.rows.length} siswa di {room.name}</h2>
                  {sheet.rows.length === 0 ? (
                    <p className="kartu p-6 text-tinta-2">Belum ada siswa di kelas ini. Tambahkan siswa di bawah.</p>
                  ) : (
                    <div className="kartu overflow-x-auto">
                      <table className="w-full min-w-[820px] text-left text-sm">
                        <thead className="border-b border-tinta/10 bg-kertas-2/50">
                          <tr>
                            {["Siswa", "Progres", "Pertemuan terakhir", "Karya", "Orang tua", "Kode orang tua", ""].map((h, i) => (
                              <th key={i} scope="col" className="label-kecil px-4 py-2.5 font-semibold">{h}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-tinta/10">
                          {(() => {
                            const info = new Map(listUsers({ role: "student", roomId: room.id }).map((u) => [u.id, u]));
                            return sheet.rows.map(({ user, sh }) => {
                              const pct = Math.round((100 * sh.done) / sh.total);
                              const lastNo = Math.max(0, ...sh.rows.filter((x) => x.done || x.result).map((x) => x.no));
                              const last = lastNo ? getLesson(room.level, lastNo) : undefined;
                              return (
                                <tr key={user.id} className="baris">
                                  <td className="px-4 py-3">
                                    <span className="flex items-center gap-3">
                                      <Monogram name={user.nickname} size={34} />
                                      <span className="leading-tight">
                                        <span className="block font-semibold">{sh.name}</span>
                                        <span className="block text-xs text-tinta-2">{user.demo ? "akun demo" : user.username}</span>
                                      </span>
                                    </span>
                                  </td>
                                  <td className="px-4 py-3">
                                    <span className="flex items-center gap-2">
                                      <span className="h-1.5 w-16 overflow-hidden rounded-full bg-tinta/10"><span className="block h-full rounded-full bg-kobalt" style={{ width: `${pct}%` }} /></span>
                                      {sh.done}/{sh.total}
                                    </span>
                                  </td>
                                  <td className="px-4 py-3">{last ? <span className="block max-w-[14rem] truncate">{last.no}. {last.title}</span> : <span className="text-tinta-2">Belum mulai</span>}</td>
                                  <td className="px-4 py-3"><Status status={sh.work?.status} /></td>
                                  <td className="px-4 py-3">{info.get(user.id)?.links ?? 0}</td>
                                  <td className="px-4 py-3 font-mono font-bold tracking-widest text-kobalt-tua">{sh.parentCode}</td>
                                  <td className="px-4 py-3 text-right"><Link href={`/admin/pengguna/${user.id}`} className="tombol-2 tombol-kecil">Kelola</Link></td>
                                </tr>
                              );
                            });
                          })()}
                        </tbody>
                      </table>
                    </div>
                  )}
                </section>
                <CreateUser defaultRole="student" defaultRoom={room.id} rooms={listRooms().map((r) => ({ id: r.id, name: r.name, level: r.level }))} />
              </>
            )}

            {tab === "nilai" && (
              <>
                <section className="kartu p-6" aria-labelledby="aksi-rapor">
                  <h2 id="aksi-rapor" className="text-lg">Rapor {room.name}</h2>
                  <p className="mb-4 mt-1 text-sm text-tinta-2">Nilai akhir = tugas pertemuan 40% + karya 40% + sikap 20%. Rapor dikirim hanya ke siswa kelas ini dan orang tua masing-masing.</p>
                  <ClassReportActions roomId={room.id} />
                </section>
                <section aria-labelledby="nilai-siswa">
                  <div className="mb-3 flex flex-wrap items-baseline justify-between gap-2">
                    <h2 id="nilai-siswa" className="text-lg">Nilai setiap siswa</h2>
                    <Link href={`/guru/nilai?c=${room.id}`} className="tautan text-sm">Rekap per pertemuan →</Link>
                  </div>
                  {sheet.rows.length === 0 ? (
                    <p className="kartu p-6 text-tinta-2">Belum ada siswa di kelas ini.</p>
                  ) : (
                    <div className="kartu overflow-x-auto">
                      <table className="w-full min-w-[720px] text-left text-sm">
                        <thead className="border-b border-tinta/10 bg-kertas-2/50">
                          <tr>
                            {["Siswa", "Selesai", "Tugas", "Karya", "Sikap", "Akhir", "Rapor", ""].map((h, i) => (
                              <th key={i} scope="col" className={`label-kecil px-4 py-2.5 font-semibold ${i >= 2 && i <= 5 ? "text-right" : ""}`}>{h}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-tinta/10">
                          {sheet.rows.map(({ user, sh, status }) => (
                            <tr key={user.id} className="baris">
                              <td className="px-4 py-3 font-semibold">{sh.name}</td>
                              <td className="px-4 py-3 tabular-nums">{sh.done}/{sh.total}</td>
                              <td className="px-4 py-3 text-right tabular-nums">{val(sh.tugas)}</td>
                              <td className="px-4 py-3 text-right tabular-nums">{val(sh.karya?.score)}</td>
                              <td className="px-4 py-3 text-right tabular-nums">{val(sh.sikap?.score)}</td>
                              <td className="px-4 py-3 text-right font-judul font-bold tabular-nums">{sh.final === null ? <span className="font-normal text-tinta-2">–</span> : `${sh.final} (${predikat(sh.final).p})`}</td>
                              <td className="px-4 py-3"><span className={RAPOR[status][1]}>{RAPOR[status][0]}</span></td>
                              <td className="px-4 py-3 text-right"><Link href={`/guru/nilai/${user.id}`} className="tautan whitespace-nowrap">Nilai →</Link></td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </section>
              </>
            )}

            {tab === "karya" && (() => {
              const works = listWorks(undefined, room.id);
              return (
                <section aria-labelledby="karya">
                  <h2 id="karya" className="mb-3 text-lg">Karya yang dikirim ({works.length})</h2>
                  {works.length === 0 ? (
                    <p className="kartu p-6 text-tinta-2">Belum ada karya yang dikirim siswa kelas ini.</p>
                  ) : (
                    <ul className="kartu divide-y divide-tinta/10 overflow-hidden">
                      {works.map(({ work, user }) => (
                        <li key={work.id}>
                          <Link href={`/guru/tinjau/${work.id}`} className="baris flex flex-wrap items-center gap-x-4 gap-y-2 px-5 py-3.5">
                            <Monogram name={user.nickname} size={36} />
                            <span className="min-w-[160px] flex-1 leading-tight">
                              <span className="block font-semibold">{user.nickname}</span>
                              <span className="text-sm text-tinta-2">dikirim {ago(work.submittedAt)}{work.comment ? ` · “${work.comment.text.slice(0, 60)}${work.comment.text.length > 60 ? "…" : ""}”` : ""}</span>
                            </span>
                            <Status status={work.status} />
                            <span className="tautan">Buka →</span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </section>
              );
            })()}

            {tab === "ortu" && (() => {
              const parents = parentsOfRoom(room.id);
              return (
                <section aria-labelledby="ortu">
                  <h2 id="ortu" className="mb-1 text-lg">Orang tua terhubung ({parents.length})</h2>
                  <p className="mb-3 text-sm text-tinta-2">Orang tua yang anaknya berada di {room.name}. Satu orang tua bisa punya anak di kelas lain.</p>
                  {parents.length === 0 ? (
                    <p className="kartu p-6 text-tinta-2">Belum ada orang tua yang terhubung dengan siswa kelas ini.</p>
                  ) : (
                    <ul className="kartu divide-y divide-tinta/10 overflow-hidden">
                      {parents.map((p) => (
                        <li key={p.id} className="flex flex-wrap items-center gap-x-4 gap-y-2 px-5 py-3.5">
                          <Monogram name={p.name} size={36} />
                          <span className="min-w-[160px] flex-1 leading-tight">
                            <span className="block font-semibold">{p.name}</span>
                            <span className="text-sm text-tinta-2">{p.username} · anak: {p.kids.join(", ")}</span>
                          </span>
                          <Link href={`/admin/pengguna/${p.id}`} className="tombol-2 tombol-kecil">Kelola</Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </section>
              );
            })()}

            {tab === "aktivitas" && (() => {
              const logs = roomLogs(room.id, 100);
              return (
                <section aria-labelledby="log">
                  <h2 id="log" className="mb-3 text-lg">Aktivitas {room.name}</h2>
                  {logs.length === 0 ? (
                    <p className="kartu p-6 text-tinta-2">Belum ada aktivitas tercatat untuk kelas ini.</p>
                  ) : (
                    <div className="kartu overflow-x-auto">
                      <table className="w-full min-w-[640px] text-left text-sm">
                        <thead className="border-b border-tinta/10 bg-kertas-2/50">
                          <tr>{["Waktu", "Pengguna", "Tindakan", "Rincian"].map((h) => <th key={h} scope="col" className="label-kecil px-4 py-2.5 font-semibold">{h}</th>)}</tr>
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
              );
            })()}

            {tab === "atur" && (() => {
              const allTeachers = listUsers({ role: "teacher" })
                .filter((t) => t.classId !== room.id)
                .map((t) => ({ id: t.id, name: t.nickname, className: t.classId ? getRoom(t.classId)?.name : undefined }));
              const siblings = listRooms().filter((r) => r.level === room.level && r.id !== room.id);
              return (
                <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,380px)]">
                  <div className="flex flex-col gap-6">
                    <RoomSettings id={room.id} name={room.name} level={room.level} hasStudents={stats.students > 0 || sheet.rows.length > 0} teachers={allTeachers} />
                    <section className="kartu p-6" aria-labelledby="wali">
                      <h2 id="wali" className="text-lg">Wali kelas</h2>
                      {teachers.length === 0 ? (
                        <p className="mt-2 text-tinta-2">Belum ada wali kelas. Pilih guru pada pengaturan di atas.</p>
                      ) : (
                        <ul className="mt-3 divide-y divide-tinta/10">
                          {teachers.map((t) => (
                            <li key={t.id} className="flex flex-wrap items-center justify-between gap-3 py-2.5">
                              <span className="font-semibold">{t.nickname} <span className="text-sm font-normal text-tinta-2">· {t.username}</span></span>
                              <Link href={`/admin/pengguna/${t.id}`} className="tombol-2 tombol-kecil">Kelola</Link>
                            </li>
                          ))}
                        </ul>
                      )}
                      <p className="mt-3 text-xs text-tinta-2">Untuk melepas wali kelas, pindahkan guru tersebut ke kelas lain atau jadikan koordinator di halaman pengguna.</p>
                    </section>
                  </div>
                  <aside className="flex flex-col gap-6">
                    <section className="kartu p-6" aria-labelledby="pindah">
                      <h2 id="pindah" className="text-lg">Pindahkan siswa</h2>
                      <p className="mb-4 mt-1 text-sm text-tinta-2">Memindahkan seluruh siswa ke kelas lain di tingkat {room.level}. Progres, karya, dan nilai ikut pindah.</p>
                      <MoveRoom id={room.id} targets={siblings.map((r) => ({ id: r.id, name: r.name }))} />
                    </section>
                    <section className="kartu p-6" aria-labelledby="hapus">
                      <h2 id="hapus" className="text-lg text-salah-tua">Hapus kelas</h2>
                      <p className="mb-4 mt-1 text-sm text-tinta-2">Hanya kelas kosong (tanpa siswa dan wali kelas) yang bisa dihapus. Setiap tingkat harus tetap punya minimal satu kelas.</p>
                      <ActionButton body={{ action: "room-delete", id: room.id }} label={`Hapus ${room.name}`} tone="bahaya" confirm={`Hapus ${room.name}? Tindakan ini tidak bisa dibatalkan.`} />
                    </section>
                  </aside>
                </div>
              );
            })()}
          </div>
        );
      }}
    </AdminShell>
  );
}
