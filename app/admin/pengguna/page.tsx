import Link from "next/link";
import { CreateUser } from "@/components/AdminClient";
import { Monogram } from "@/components/Monogram";
import { AdminShell } from "@/components/Shell";
import { PageHead, Status } from "@/components/Status";
import { isLevel } from "@/lib/curriculum/types";
import { listUsers } from "@/lib/db";
import { ROLE_LABEL } from "@/lib/format";

export const dynamic = "force-dynamic";

const PERAN = [
  { v: "", t: "Semua" },
  { v: "student", t: "Siswa" },
  { v: "teacher", t: "Guru" },
  { v: "parent", t: "Orang tua" },
  { v: "admin", t: "Admin" },
];

export default async function AdminPengguna({ searchParams }: { searchParams: Promise<{ peran?: string; k?: string; q?: string; demo?: string }> }) {
  const sp = await searchParams;
  const role = PERAN.some((p) => p.v === sp.peran) ? (sp.peran as string) : "";
  const k = Number(sp.k);
  const level = isLevel(k) ? k : undefined;
  const q = (sp.q ?? "").slice(0, 40);
  const demo = sp.demo === "1";
  const qs = (o: Record<string, string | undefined>) => {
    const p = new URLSearchParams();
    const all = { peran: role || undefined, k: level ? String(level) : undefined, q: q || undefined, demo: demo ? "1" : undefined, ...o };
    for (const [key, v] of Object.entries(all)) if (v) p.set(key, v);
    const s = p.toString();
    return s ? `/admin/pengguna?${s}` : "/admin/pengguna";
  };
  return (
    <AdminShell>
      {() => {
        const rows = listUsers({ role, level, q, demo });
        return (
          <div className="flex flex-col gap-8">
            <PageHead icon="kelas" eyebrow="Pengguna" title="Semua akun" desc="Tambah, ubah, atur ulang kata sandi, hubungkan orang tua, masuk sebagai pengguna, atau hapus akun." />

            <section aria-label="Saring pengguna" className="flex flex-col gap-3">
              <div className="segmen" role="group" aria-label="Saring peran">
                {PERAN.map((p) => (
                  <Link key={p.v} href={qs({ peran: p.v || undefined, k: p.v === "student" || p.v === "teacher" || !p.v ? (level ? String(level) : undefined) : undefined })} aria-pressed={role === p.v}>
                    {p.t}
                  </Link>
                ))}
              </div>
              <form className="flex flex-wrap items-end gap-3" action="/admin/pengguna">
                {role && <input type="hidden" name="peran" value={role} />}
                <div className="w-full max-w-xs">
                  <label htmlFor="cari" className="label-kecil">Cari nama</label>
                  <input id="cari" name="q" className="isian mt-1" defaultValue={q} placeholder="Nama panggilan atau nama masuk" />
                </div>
                <div className="w-40">
                  <label htmlFor="kls" className="label-kecil">Kelas</label>
                  <select id="kls" name="k" className="isian mt-1" defaultValue={level ? String(level) : ""}>
                    <option value="">Semua kelas</option>
                    {[1, 2, 3, 4, 5, 6].map((n) => <option key={n} value={n}>Kelas {n}</option>)}
                  </select>
                </div>
                <label className="flex min-h-11 items-center gap-2 text-sm">
                  <input type="checkbox" name="demo" value="1" defaultChecked={demo} className="h-4 w-4 accent-kobalt" />
                  Tampilkan akun demo
                </label>
                <button type="submit" className="tombol-2">Terapkan</button>
                {(q || level || demo) && <Link href={qs({ q: undefined, k: undefined, demo: undefined })} className="tautan text-sm">Hapus saringan</Link>}
              </form>
            </section>

            <section aria-labelledby="daftar">
              <h2 id="daftar" className="mb-3 text-lg">{rows.length} akun</h2>
              {rows.length === 0 ? (
                <p className="kartu p-6 text-tinta-2">Tidak ada akun yang cocok dengan saringan.</p>
              ) : (
                <div className="kartu overflow-x-auto">
                  <table className="w-full min-w-[760px] text-left text-sm">
                    <thead className="border-b border-tinta/10 bg-kertas-2/50">
                      <tr>
                        {["Nama", "Peran", "Kelas", "Keterangan", ""].map((h, i) => (
                          <th key={i} scope="col" className="label-kecil px-4 py-2.5 font-semibold">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-tinta/10">
                      {rows.map((u) => (
                        <tr key={u.id} className="baris">
                          <td className="px-4 py-3">
                            <span className="flex min-w-0 items-center gap-3">
                              <Monogram name={u.nickname} size={34} />
                              <span className="min-w-0 leading-tight">
                                <span className="block truncate font-semibold">{u.nickname}</span>
                                <span className="block truncate text-xs text-tinta-2">{u.demo ? "akun demo" : u.username}</span>
                              </span>
                            </span>
                          </td>
                          <td className="px-4 py-3"><span className={`pil ${u.role === "admin" ? "pil-tinta" : u.role === "teacher" ? "pil-biru" : ""}`}>{ROLE_LABEL[u.role]}</span></td>
                          <td className="px-4 py-3">{u.level ? `Kelas ${u.level}` : u.role === "teacher" ? "Semua (koordinator)" : "-"}</td>
                          <td className="px-4 py-3">
                            {u.role === "student" ? (
                              <span className="flex flex-wrap items-center gap-2">
                                <span className="text-tinta-2">{u.pct}% selesai</span>
                                <Status status={u.status} />
                              </span>
                            ) : u.role === "parent" ? (
                              <span className="text-tinta-2">{u.links} anak terhubung</span>
                            ) : (
                              <span className="text-tinta-2">-</span>
                            )}
                          </td>
                          <td className="px-4 py-3 text-right">
                            <Link href={`/admin/pengguna/${u.id}`} className="tombol-2 tombol-kecil" aria-label={`Kelola ${u.nickname}`}>Kelola</Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </section>

            <CreateUser defaultRole={role || "student"} />
          </div>
        );
      }}
    </AdminShell>
  );
}
