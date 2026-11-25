import Link from "next/link";
import { ClassTabs } from "@/components/ClassTabs";
import { TeacherShell } from "@/components/Shell";
import { PageHead } from "@/components/Status";
import { classMeta, isLevel, lessonsOf } from "@/lib/curriculum";

export const dynamic = "force-dynamic";

export default async function GuruMateri({ searchParams }: { searchParams: Promise<{ k?: string }> }) {
  const sp = await searchParams;
  const k = Number(sp.k ?? 1);
  return (
    <TeacherShell>
      {(t) => {
        const level = t.level ?? (isLevel(k) ? k : 1);
        const meta = classMeta(level);
        const lessons = lessonsOf(level);
        return (
          <div className="flex flex-col gap-8">
            <PageHead
              icon="buku"
              eyebrow="Materi"
              title={`Kelas ${level} · ${meta.project}`}
              desc={`${meta.meetings} pertemuan × ${meta.minutes} menit. Buka satu pertemuan untuk melihat panduan mengajar dan rincian waktu.`}
              right={t.level ? undefined : <ClassTabs base="/guru/materi" current={level} />}
            />
            <ol className="berurutan kartu divide-y divide-tinta/10 overflow-hidden">
              {lessons.map((l) => (
                <li key={l.id}>
                  <Link href={`/guru/materi/${l.level}/${l.no}`} className="baris flex items-center gap-4 px-5 py-3.5">
                    <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-kobalt-muda font-judul text-sm font-bold text-kobalt-tua">{l.no}</span>
                    <span className="min-w-0 flex-1 leading-tight">
                      <span className="block truncate font-semibold">{l.title}</span>
                      <span className="block truncate text-sm text-tinta-2">{l.topic}</span>
                    </span>
                    <span className="hidden text-sm text-tinta-2 sm:inline">{l.minutes} menit</span>
                    <span className="tautan hidden sm:inline">Buka panduan →</span>
                  </Link>
                </li>
              ))}
            </ol>
          </div>
        );
      }}
    </TeacherShell>
  );
}
