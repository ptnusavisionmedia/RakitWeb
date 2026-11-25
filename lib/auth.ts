import "server-only";
import crypto from "node:crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { childrenOf, getUser, homeFor, type User } from "./db";
import type { ClassLevel } from "./curriculum/types";

const COOKIE = "rw_session";
const SECRET = process.env.SESSION_SECRET || "rakitweb-dev-secret-ganti-di-produksi";
const TTL = 60 * 60 * 24 * 14;

const sign = (payload: string) => crypto.createHmac("sha256", SECRET).update(payload).digest("base64url");

export async function startSession(userId: string) {
  const exp = Math.floor(Date.now() / 1000) + TTL;
  const payload = Buffer.from(JSON.stringify({ uid: userId, exp })).toString("base64url");
  (await cookies()).set(COOKIE, `${payload}.${sign(payload)}`, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: TTL,
  });
}
export async function endSession() {
  (await cookies()).delete(COOKIE);
}

export async function currentUser(): Promise<User | null> {
  const raw = (await cookies()).get(COOKIE)?.value;
  if (!raw) return null;
  const [payload, sig] = raw.split(".");
  if (!payload || !sig) return null;
  const expected = sign(payload);
  const a = Buffer.from(sig);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return null;
  try {
    const { uid, exp } = JSON.parse(Buffer.from(payload, "base64url").toString("utf8"));
    if (typeof uid !== "string" || typeof exp !== "number" || exp < Date.now() / 1000) return null;
    return getUser(uid) ?? null;
  } catch {
    return null;
  }
}

export type Student = User & { role: "student"; level: ClassLevel };

export async function requireStudent(): Promise<Student> {
  const u = await currentUser();
  if (!u) redirect("/");
  if (u.role !== "student" || !u.level) redirect(homeFor(u));
  return u as Student;
}
export async function requireTeacher(): Promise<User> {
  const u = await currentUser();
  if (!u) redirect("/");
  if (u.role !== "teacher") redirect(homeFor(u));
  return u;
}

export const CHILD_COOKIE = "rw_anak";

/** Orang tua: akun, daftar anak yang tertaut, dan anak yang sedang dipilih. */
export async function requireParent() {
  const u = await currentUser();
  if (!u) redirect("/");
  if (u.role !== "parent") redirect(homeFor(u));
  const kids = childrenOf(u);
  const want = (await cookies()).get(CHILD_COOKIE)?.value;
  const selected = kids.find((k) => k.id === want) ?? kids[0] ?? null;
  return { parent: u, kids, selected };
}
