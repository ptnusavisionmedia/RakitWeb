import { Monogram } from "@/components/Monogram";
import Link from "next/link";
import { notFound } from "next/navigation";
import { TeacherShell } from "@/components/Shell";
import { ParentNoteForm, ReviewForm } from "@/components/TeacherClient";
import { WorkView } from "@/components/WorkView";
import { classMeta } from "@/lib/curriculum";
import { canTeach, getUser, getWorkById } from "@/lib/db";
import { Status } from "@/components/Status";
import { ago, STATUS_LABEL } from "@/lib/format";
import type { VisualDoc } from "@/lib/page";

export const dynamic = "force-dynamic";

export default async function GuruTinjauItem({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return (
    <TeacherShell wide>
      {(t) => {
        const w = getWorkById(id);
        if (!w || !w.submitted || !canTeach(t, w.level)) notFound();
        const owner = getUser(w.userId)!;
        const meta = classMeta(w.level);
        const doc = w.kind === "visual" ? (w.submitted as VisualDoc) : null;
        return (
          <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_380px] lg:gap-8">
            <section>
              <Link href="/guru/tinjau" className="tautan">← Semua kiriman</Link>
              <div className="mt-5 flex flex-wrap items-center gap-4 border-b border-tinta/10 pb-6">
                <Monogram name={owner.nickname} size={48} />
                <div className="min-w-0 flex-1">
                  <h1 className="text-2xl">{owner.nickname}</h1>
                  <p className="text-sm text-tinta-2">Kelas {w.level} · {meta.project} · dikirim {ago(w.submittedAt)}</p>
                </div>
                <Status status={w.status} testid="status" />
              </div>
              <div className="mt-6">
                <WorkView kind={w.kind} content={w.submitted} level={w.level} height={500} showCode />
              </div>
            </section>
            <aside className="flex flex-col gap-4 lg:sticky lg:top-24 lg:self-start">
              {doc?.reflection && (
                <div className="kartu p-5">
                  <p className="label-kecil mb-1">Pilihan desain menurut siswa</p>
                  <p className="font-semibold">{doc.reflection}</p>
                  {doc.friendTested !== undefined && <p className="mt-1 text-sm text-tinta-2">Uji teman: {doc.friendTested ? "temannya menemukan bagian Hobi memakai menu." : "belum dicatat."}</p>}
                </div>
              )}
              {w.comment && w.status === "revision" && (
                <div className="kartu p-5">
                  <p className="label-kecil mb-1">Komentar terakhir Anda · {ago(w.comment.at)}</p>
                  <p>{w.comment.text}</p>
                </div>
              )}
              <ReviewForm workId={w.id} status={STATUS_LABEL[w.status]} initialComment={w.status === "revision" ? "" : w.comment?.text} />
              <ParentNoteForm studentId={owner.id} name={owner.nickname} />
            </aside>
          </div>
        );
      }}
    </TeacherShell>
  );
}
