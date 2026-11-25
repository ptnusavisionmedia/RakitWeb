import { IkonKotak } from "@/components/Deco";
import { ReportView } from "@/components/ReportView";
import { ParentShell } from "@/components/Shell";
import { sentReports } from "@/lib/db";

export const dynamic = "force-dynamic";

export default function OrtuRapor() {
  return (
    <ParentShell>
      {({ child }) => {
        const name = child.nickname.replace(/ \(demo\)$/, "");
        const list = sentReports(child.id);
        return list.length === 0 ? (
          <div className="kartu flex flex-col items-center px-6 py-16 text-center">
            <IkonKotak name="buku" />
            <h1 className="mt-3 text-xl">Rapor {name} belum tersedia</h1>
            <p className="mt-1 max-w-md text-tinta-2">Rapor akan muncul di sini setelah guru kelas mengirimnya. Anda akan melihatnya langsung begitu terkirim.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            {list.map((r) => <ReportView key={r.id + r.at} data={r.data} name={name} level={r.level} sentAt={r.at} />)}
          </div>
        );
      }}
    </ParentShell>
  );
}
