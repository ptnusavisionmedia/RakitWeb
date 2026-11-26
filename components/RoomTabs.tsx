import Link from "next/link";
import { listRooms } from "@/lib/db";

/** Pilihan kelas (rombel). Dipakai admin dan koordinator; kelas diurutkan menurut tingkat lalu nama. */
export function RoomTabs({ base, current, extra = "", all }: { base: string; current?: string; extra?: string; all?: string }) {
  const rooms = listRooms();
  const sep = base.includes("?") ? "&" : "?";
  return (
    <div role="tablist" aria-label="Pilih kelas" className="segmen">
      {all !== undefined && (
        <Link href={`${base}${extra ? `${sep}${extra.replace(/^&/, "")}` : ""}`} role="tab" aria-selected={!current}>
          {all}
        </Link>
      )}
      {rooms.map((r) => (
        <Link key={r.id} href={`${base}${sep}c=${r.id}${extra}`} role="tab" aria-selected={current === r.id}>
          {r.name}
        </Link>
      ))}
    </div>
  );
}
