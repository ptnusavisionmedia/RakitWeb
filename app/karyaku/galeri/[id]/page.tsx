import Link from "next/link";
import { notFound } from "next/navigation";
import { Monogram } from "@/components/Monogram";
import { StudentShell } from "@/components/Shell";
import { WorkView } from "@/components/WorkView";
import { getUser, getWorkById } from "@/lib/db";
import { ago } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function GaleriItem({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return (
    <StudentShell>
      {(s) => {
        const w = getWorkById(id);
        // Galeri hanya untuk anggota kelas yang sama.
        if (!w || w.level !== s.level || w.status !== "published" || !w.published) notFound();
        const owner = getUser(w.userId)!;
        return (
          <div className="mx-auto max-w-4xl">
            <Link href="/karyaku#galeri" className="tautan">← Kembali ke galeri</Link>
            <div className="mt-5 flex items-center gap-4 border-b border-tinta/10 pb-6">
              <Monogram name={owner.nickname} size={48} />
              <div>
                <h1 className="text-2xl">Karya {owner.nickname.replace(/ \(demo\)$/, "")}</h1>
                <p className="text-sm text-tinta-2">Galeri kelas {w.level} · dipublikasikan {ago(w.publishedAt)}</p>
              </div>
            </div>
            <div className="mt-6">
              <WorkView kind={w.kind} content={w.published} level={w.level} height={500} />
            </div>
          </div>
        );
      }}
    </StudentShell>
  );
}
