import { Monogram } from "@/components/Monogram";
import { StudentShell } from "@/components/Shell";
import { ProfileForm } from "@/components/ProfileForm";
import Link from "next/link";
import { classMeta } from "@/lib/curriculum";
import { sentReports } from "@/lib/db";

export const dynamic = "force-dynamic";

export default function ProfilPage() {
  return (
    <StudentShell>
      {(s) => {
        const meta = classMeta(s.level);
        return (
          <div className="mx-auto flex max-w-3xl flex-col gap-8">
            <section className="pita flex flex-wrap items-center gap-5 p-6 sm:p-8">
              <Monogram name={s.nickname} size={64} />
              <div className="min-w-0 flex-1">
                <p className="label-kecil">Profil</p>
                <h1 className="text-2xl">{s.nickname}</h1>
                <p className="redup">Kelas <b className="text-white">{s.level}</b> · {meta.project}</p>
              </div>
              <dl className="flex gap-8 text-sm">
                <div><dt className="redup">Pertemuan</dt><dd className="font-judul text-lg font-bold">{meta.meetings}</dd></div>
                <div><dt className="redup">Durasi</dt><dd className="font-judul text-lg font-bold">{meta.minutes} menit</dd></div>
              </dl>
              <p className="redup w-full border-t border-white/15 pt-4 text-sm">Kelas diatur oleh gurumu.</p>
            </section>
            <section className="kartu flex flex-wrap items-center justify-between gap-4 p-5" aria-labelledby="rapor-saya">
              <div className="min-w-[220px] flex-1">
                <h2 id="rapor-saya" className="text-lg">Rapor</h2>
                <p className="mt-1 text-sm text-tinta-2">{sentReports(s.id).length > 0 ? "Gurumu sudah mengirim rapor. Lihat nilai dan catatannya." : "Rapormu belum dikirim guru."}</p>
              </div>
              <Link href="/rapor" className={sentReports(s.id).length > 0 ? "tombol" : "tombol-2"}>Lihat rapor</Link>
            </section>
            {s.parentCode && (
              <section className="kartu flex flex-wrap items-center justify-between gap-4 p-5" aria-labelledby="kode-ortu">
                <div className="min-w-[220px] flex-1">
                  <h2 id="kode-ortu" className="text-lg">Kode untuk orang tua</h2>
                  <p className="mt-1 text-sm text-tinta-2">Berikan kode ini kepada orang tuamu agar bisa melihat perkembanganmu. Jangan bagikan ke orang lain.</p>
                </div>
                <code className="rounded-xl bg-kobalt-muda px-4 py-2 font-mono text-2xl font-bold tracking-[.25em] text-kobalt-tua">{s.parentCode}</code>
              </section>
            )}
            <ProfileForm nickname={s.nickname} avatar={s.avatar} demo={!!s.demo} />
          </div>
        );
      }}
    </StudentShell>
  );
}
