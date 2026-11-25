import Link from "next/link";
import { CLASSES } from "@/lib/curriculum/types";

export function ClassTabs({ base, current, extra = "" }: { base: string; current: number; extra?: string }) {
  return (
    <div role="tablist" aria-label="Pilih kelas" className="segmen">
      {CLASSES.map((c) => (
        <Link key={c.level} href={`${base}?k=${c.level}${extra}`} role="tab" aria-selected={current === c.level}>
          Kelas {c.level}
        </Link>
      ))}
    </div>
  );
}
