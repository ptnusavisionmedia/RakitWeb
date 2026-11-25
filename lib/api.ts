import "server-only";
import { NextResponse } from "next/server";
import { currentUser, type Student } from "./auth";
import type { User } from "./db";

export const json = (data: unknown, status = 200) => NextResponse.json(data, { status });
export const fail = (error: string, status = 400) => NextResponse.json({ ok: false, error }, { status });

/** Hanya terima JSON: mencegah pengiriman formulir lintas situs. */
export async function readJson(req: Request): Promise<Record<string, unknown> | null> {
  if (!(req.headers.get("content-type") ?? "").includes("application/json")) return null;
  try {
    const b = await req.json();
    return b && typeof b === "object" ? (b as Record<string, unknown>) : null;
  } catch {
    return null;
  }
}

export async function studentOrNull(): Promise<Student | null> {
  const u = await currentUser();
  return u && u.role === "student" && u.level ? (u as Student) : null;
}
export async function teacherOrNull(): Promise<User | null> {
  const u = await currentUser();
  return u && u.role === "teacher" ? u : null;
}
export async function parentOrNull(): Promise<User | null> {
  const u = await currentUser();
  return u && u.role === "parent" ? u : null;
}
