import Link from "next/link";
import { notFound } from "next/navigation";
import { ActionButton, EditUser, LinkStudent, ResetSecret } from "@/components/AdminClient";
import { AdminShell } from "@/components/Shell";
import { PageHead, Stat, Status } from "@/components/Status";
import { classMeta } from "@/lib/curriculum/types";
import { listRooms, userDetail } from "@/lib/db";
import { ago, ROLE_LABEL, tgl } from "@/lib/format";

export const dynamic = "force-dynamic";

const RAPOR: Record<string, string> = { belum: "Belum dibuat", draf: "Draf", terkirim: "Terkirim", diperbarui: "Diperbarui, belum dikirim ulang" };

export default async function AdminPenggunaDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return (
    <AdminShell>
      {(a) => {
        const d = userDetail(id);
        if (!d) notFound();
        const u = d.user;
        const self = u.id === a.id;
        const lockedAdmin = u.role === "admin" && !!a.demo && !u.demo;
        const meta = u.role === "student" && u.level ? classMeta(u.level) : null;
        const done = d.progress?.completed.length ?? 0;
        return (
          <div className="flex flex-col gap-8">
            <p><Link href="/admin/pengguna" className="tautan text-sm">← Semua pengguna</Link></p>
            <PageHead
              icon="kelas"
              eyebrow={`${ROLE_LABEL[u.role]}${u.demo ? " · akun demo" : ""}`}
              title={u.nickname}
              desc={`Nama masuk: ${u.username}${d.room ? ` · ${d.room.name} (tingkat ${d.room.level})` : u.role === "teacher" ? " · Koordinator semua kelas" : ""}`}
              right={
                u.role !== "admin" ? (
                  <ActionButton body={{ action: "impersonate", id: u.id }} label={`Masuk sebagai ${u.nickname}`} tone="1" />
                ) : self ? (
                  <span className="pil pil-isi">Akun Anda</span>
                ) : undefined
              }
            />

            {lockedAdmin && <p className="catatan text-sm">Akun demo hanya bisa melihat akun admin asli. Perubahan, atur ulang kata sandi, dan penghapusan dikunci.</p>}

            {meta && (
              <div className="berurutan grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <Stat icon="cek" label="Pertemuan selesai" value={`${done} / ${meta.meetings}`} note={d.progress?.lastAt ? `aktif ${ago(d.progress.lastAt)}` : "belum mulai"} />
                <Stat icon="galeri" label="Karya" value={<Status status={d.work?.status} />} />
                <Stat icon="target" label="Nilai karya / sikap" value={`${d.grades?.karya?.score ?? "-"} / ${d.grades?.sikap?.score ?? "-"}`} />
                <Stat icon="buku" label="Rapor semester ini" value={RAPOR[d.report]} />
              </div>
            )}

            <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,380px)]">
              <div className="flex flex-col gap-6">
                {!lockedAdmin && <EditUser id={u.id} role={u.role} nickname={u.nickname} username={u.username} roomId={d.room?.id} rooms={listRooms().map((r) => ({ id: r.id, name: r.name, level: r.level }))} demo={u.demo} />}

                {u.role === "student" && (
                  <section className="kartu p-6" aria-labelledby="ortu">
                    <h2 id="ortu" className="text-lg">Orang tua terhubung</h2>
                    <p className="mt-1 text-sm text-tinta-2">
                      Kode orang tua: <b className="font-mono tracking-widest text-kobalt-tua">{d.parentCode ?? "-"}</b>
                    </p>
                    {d.parents.length === 0 ? (
                      <p className="mt-3 text-tinta-2">Belum ada orang tua yang terhubung.</p>
                    ) : (
                      <ul className="mt-3 divide-y divide-tinta/10">
                        {d.parents.map((p) => (
                          <li key={p.id} className="flex flex-wrap items-center justify-between gap-3 py-2.5">
                            <Link href={`/admin/pengguna/${p.id}`} className="font-semibold text-kobalt hover:underline">{p.name}</Link>
                            <ActionButton body={{ action: "unlink", id: p.id, studentId: u.id }} label="Lepas" confirm={`Lepas ${u.nickname} dari ${p.name}?`} />
                          </li>
                        ))}
                      </ul>
                    )}
                    <div className="mt-4 flex flex-wrap gap-3">
                      <ActionButton body={{ action: "new-code", id: u.id }} label="Buat kode baru" confirm="Kode lama tidak bisa dipakai lagi. Lanjutkan?" okText="Kode baru dibuat." />
                      <Link href={`/guru/nilai/${u.id}`} className="tombol-2 tombol-kecil">Nilai dan rapor</Link>
                    </div>
                  </section>
                )}

                {u.role === "parent" && (
                  <section className="kartu p-6" aria-labelledby="anak">
                    <h2 id="anak" className="text-lg">Anak terhubung</h2>
                    {d.kids.length === 0 ? (
                      <p className="mt-3 text-tinta-2">Belum ada anak yang terhubung.</p>
                    ) : (
                      <ul className="mt-3 divide-y divide-tinta/10">
                        {d.kids.map((k) => (
                          <li key={k.id} className="flex flex-wrap items-center justify-between gap-3 py-2.5">
                            <Link href={`/admin/pengguna/${k.id}`} className="font-semibold text-kobalt hover:underline">{k.name} · {k.className}</Link>
                            <ActionButton body={{ action: "unlink", id: u.id, studentId: k.id }} label="Lepas" confirm={`Lepas ${k.name} dari akun ini?`} />
                          </li>
                        ))}
                      </ul>
                    )}
                    <div className="mt-4"><LinkStudent parentId={u.id} students={d.students} /></div>
                  </section>
                )}

                {u.role === "teacher" && (
                  <section className="kartu p-6">
                    <h2 className="text-lg">Alat guru</h2>
                    <p className="mt-1 text-sm text-tinta-2">Buka kelas, nilai, dan karya yang diajar guru ini.</p>
                    <div className="mt-4 flex flex-wrap gap-3">
                      {d.room ? (
                        <>
                          <Link href={`/admin/kelas/${d.room.id}`} className="tombol-2 tombol-kecil">Data {d.room.name}</Link>
                          <Link href={`/guru/nilai?c=${d.room.id}`} className="tombol-2 tombol-kecil">Nilai</Link>
                          <Link href={`/guru/tinjau?c=${d.room.id}`} className="tombol-2 tombol-kecil">Tinjau karya</Link>
                        </>
                      ) : (
                        <Link href="/admin/kelas" className="tombol-2 tombol-kecil">Semua kelas</Link>
                      )}
                    </div>
                  </section>
                )}
              </div>

              <aside className="flex flex-col gap-6">
                {!lockedAdmin && !u.demo && <ResetSecret id={u.id} role={u.role} />}

                <section className="kartu p-6" aria-labelledby="bahaya">
                  <h2 id="bahaya" className="text-lg text-salah-tua">Zona berbahaya</h2>
                  <div className="mt-4 flex flex-col items-start gap-4">
                    {u.role === "student" && (
                      <div>
                        <ActionButton body={{ action: "reset-progress", id: u.id }} label="Kosongkan progres" tone="bahaya" confirm={`Semua progres, jawaban, karya, nilai, dan rapor ${u.nickname} akan dihapus. Lanjutkan?`} okText="Progres dikosongkan." />
                        <p className="mt-1 text-xs text-tinta-2">Siswa mulai lagi dari pertemuan 1.</p>
                      </div>
                    )}
                    {self ? (
                      <p className="text-sm text-tinta-2">Akun yang sedang dipakai tidak dapat dihapus.</p>
                    ) : lockedAdmin ? (
                      <p className="text-sm text-tinta-2">Dikunci untuk akun demo.</p>
                    ) : (
                      <div>
                        <ActionButton body={{ action: "delete", id: u.id }} label="Hapus akun" tone="bahaya" confirm={`Hapus akun ${u.nickname} (${u.username}) beserta datanya? Tindakan ini tidak bisa dibatalkan.`} />
                        <p className="mt-1 text-xs text-tinta-2">{u.role === "student" ? "Progres, karya, dan rapor ikut terhapus." : "Akun dihapus permanen."}</p>
                      </div>
                    )}
                  </div>
                </section>

                {d.logs.length > 0 && (
                  <section className="kartu p-6" aria-labelledby="riwayat">
                    <h2 id="riwayat" className="text-lg">Riwayat</h2>
                    <ul className="mt-3 flex flex-col gap-2 text-sm">
                      {d.logs.map((l, i) => (
                        <li key={l.at + i} className="leading-snug">
                          <b>{l.action}</b> <span className="text-tinta-2">· {l.actorName} · {tgl(l.at)}</span>
                        </li>
                      ))}
                    </ul>
                  </section>
                )}
              </aside>
            </div>
          </div>
        );
      }}
    </AdminShell>
  );
}
