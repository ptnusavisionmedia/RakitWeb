import { cookies } from "next/headers";
import { childrenOf, kidsOf, linkChild, unlinkChild } from "@/lib/db";
import { CHILD_COOKIE } from "@/lib/auth";
import { fail, json, parentOrNull, readJson } from "@/lib/api";

async function select(id: string) {
  (await cookies()).set(CHILD_COOKIE, id, { httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production", path: "/", maxAge: 60 * 60 * 24 * 30 });
}

export async function POST(req: Request) {
  const p = await parentOrNull();
  if (!p) return fail("Khusus orang tua.", 403);
  const b = await readJson(req);
  if (!b) return fail("Permintaan tidak valid.");
  switch (b.action) {
    case "pilih": {
      const id = String(b.childId ?? "");
      if (!kidsOf(p).includes(id)) return fail("Anak tidak ditemukan.", 404);
      await select(id);
      return json({ ok: true });
    }
    case "hubungkan": {
      const r = linkChild(p, String(b.studentId ?? ""), String(b.code ?? ""));
      if (!r.ok) return fail(r.error, 400);
      await select(r.childId);
      return json({ ok: true });
    }
    case "lepas": {
      const id = String(b.childId ?? "");
      if (!unlinkChild(p, id)) return fail("Anak tidak ditemukan.", 404);
      const left = childrenOf(p);
      if (left[0]) await select(left[0].id);
      else (await cookies()).delete(CHILD_COOKIE);
      return json({ ok: true });
    }
    default:
      return fail("Tindakan tidak dikenal.");
  }
}
