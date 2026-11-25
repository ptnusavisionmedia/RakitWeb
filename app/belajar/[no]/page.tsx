import Link from "next/link";
import { notFound } from "next/navigation";
import { StudentShell } from "@/components/Shell";
import { CodeWorkspace } from "@/components/CodeWorkspace";
import { VisualLesson } from "@/components/VisualLesson";
import { classMeta, getLesson } from "@/lib/curriculum";
import { getProgress, getWork, visitLesson } from "@/lib/db";
import { pagesOf, type Files } from "@/lib/starter";
import type { VisualDoc } from "@/lib/page";

export const dynamic = "force-dynamic";

export default async function LessonPage({ params }: { params: Promise<{ no: string }> }) {
  const { no: raw } = await params;
  return (
    <StudentShell wide>
      {(s) => {
        const no = Number(raw);
        // Siswa hanya dapat membuka pertemuan pada jalur kelas yang ditetapkan guru.
        const lesson = Number.isInteger(no) ? getLesson(s.level, no) : undefined;
        if (!lesson) notFound();
        visitLesson(s.id, s.level, lesson.no);
        const work = getWork(s.id, s.level);
        const done = getProgress(s.id, s.level)?.completed.includes(lesson.no) ?? false;
        const meta = classMeta(s.level);
        return (
          <>
            <div className="-mt-2 mb-5 flex flex-wrap items-center gap-x-3 gap-y-2 text-sm">
              <Link href="/belajar" className="tautan">← Semua pertemuan</Link>
              <span aria-hidden="true" className="text-tinta/25">/</span>
              <span className="text-tinta-2">Kelas {s.level} · {meta.project}</span>
              <span className="ml-auto flex items-center gap-2">
                <span className="mr-1 hidden text-tinta-2 sm:inline">{lesson.no} / {lesson.total}</span>
                {lesson.no > 1 && <Link className="tombol-2 tombol-kecil" href={`/belajar/${lesson.no - 1}`}>Sebelumnya</Link>}
                {lesson.no < lesson.total && <Link className="tombol-2 tombol-kecil" href={`/belajar/${lesson.no + 1}`}>Berikutnya</Link>}
              </span>
            </div>
            {meta.mode === "visual" ? (
              <VisualLesson key={lesson.id} lesson={lesson} doc={work.content as VisualDoc} nickname={s.nickname} completed={done} />
            ) : (
              <CodeWorkspace key={lesson.id} lesson={lesson} level={s.level} initial={work.content as Files} pages={pagesOf(s.level)} completed={done} />
            )}
          </>
        );
      }}
    </StudentShell>
  );
}
