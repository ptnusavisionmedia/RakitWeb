import Link from "next/link";
import { IkonKotak } from "@/components/Deco";
import { ReportView } from "@/components/ReportView";
import { StudentShell } from "@/components/Shell";
import { sentReports } from "@/lib/db";

export const dynamic = "force-dynamic";

export default function RaporSiswa() {
  return (
    <StudentShell>
      {(s) => {
        const name = s.nickname.replace(/ \(demo\)$/, "");
        const list = sentReports(s.id);
        return (
          <div className="mx-auto flex max-w-4xl flex-col gap-6">
            <Link href="/profil" className="tautan no-print">← Profil</Link>
            {list.length === 0 ? (
              <div className="kartu flex flex-col items-center px-6 py-16 text-center">
                <IkonKotak name="buku" />
                <h1 className="mt-3 text-xl">Rapor belum tersedia</h1>
                <p className="mt-1 max-w-md text-tinta-2">Rapormu akan muncul di sini setelah gurumu mengirimnya. Terus semangat belajar!</p>
              </div>
            ) : (
              list.map((r) => <ReportView key={r.id + r.at} data={r.data} name={name} level={r.level} sentAt={r.at} />)
            )}
          </div>
        );
      }}
    </StudentShell>
  );
}
