import { STATUS_LABEL } from "@/lib/format";
import { Ikon } from "./Deco";

const TONE: Record<string, string> = {
  draft: "pil",
  submitted: "pil pil-biru",
  revision: "pil pil-tinta",
  published: "pil pil-isi",
};

export function Status({ status, testid }: { status?: string; testid?: string }) {
  if (!status) return <span className="text-sm text-tinta-2">Belum ada karya</span>;
  return <span className={TONE[status] ?? "pil"} data-testid={testid}>{STATUS_LABEL[status]}</span>;
}

/** Kepala halaman yang seragam di semua halaman: pita gelap berpola. */
export function PageHead({ eyebrow, title, desc, right, icon }: { eyebrow?: string; title: React.ReactNode; desc?: React.ReactNode; right?: React.ReactNode; icon?: string }) {
  return (
    <header className="pita flex flex-wrap items-end justify-between gap-x-8 gap-y-5 px-6 py-7 sm:px-8 sm:py-8">
      <div className="flex min-w-0 items-start gap-4">
        {icon && (
          <span className="mt-1 hidden h-12 w-12 shrink-0 place-items-center rounded-xl bg-white/10 ring-1 ring-white/15 sm:grid">
            <Ikon name={icon} size={24} />
          </span>
        )}
        <div className="min-w-0">
          {eyebrow && <p className="label-kecil">{eyebrow}</p>}
          <h1 className="mt-1.5 text-[1.75rem] sm:text-[2rem]">{title}</h1>
          {desc && <div className="redup mt-2 max-w-2xl">{desc}</div>}
        </div>
      </div>
      {right && <div className="flex flex-wrap items-center gap-3">{right}</div>}
    </header>
  );
}

/** Kartu angka ringkas dengan ikon. */
export function Stat({ icon, label, value, note }: { icon: string; label: string; value: React.ReactNode; note?: string }) {
  return (
    <div className="kartu flex items-start gap-4 p-5">
      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-kobalt-muda text-kobalt"><Ikon name={icon} /></span>
      <div className="min-w-0">
        <p className="label-kecil">{label}</p>
        <p className="mt-1 font-judul text-2xl font-bold leading-tight">{value}</p>
        {note && <p className="text-sm text-tinta-2">{note}</p>}
      </div>
    </div>
  );
}
