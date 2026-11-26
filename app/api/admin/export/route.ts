import { addLog, exportData } from "@/lib/db";
import { adminOrNull, fail } from "@/lib/api";

export const dynamic = "force-dynamic";

/** Unduhan cadangan data (tanpa kata sandi dan PIN). */
export async function GET() {
  const a = await adminOrNull();
  if (!a) return fail("Khusus admin.", 403);
  addLog(a, "Unduh cadangan data");
  const day = new Date().toISOString().slice(0, 10);
  return new Response(JSON.stringify(exportData(), null, 2), {
    headers: {
      "content-type": "application/json; charset=utf-8",
      "content-disposition": `attachment; filename="rakitweb-cadangan-${day}.json"`,
      "cache-control": "no-store",
    },
  });
}
