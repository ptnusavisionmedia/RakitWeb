import "server-only";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import crypto from "node:crypto";
import { classMeta, isLevel, type ClassLevel } from "./curriculum/types";
import { getLesson, lessonsOf } from "./curriculum";
import { BOBOT, buildActivityResult, buildSelf, clampScore, lessonAuto, lessonFinal, predikat, termLabel, type Grade, type LessonResult } from "./nilai";
import { defaultDoc, sanitizeDoc, type VisualDoc } from "./page";
import { starterFiles, type Files } from "./starter";

export type Role = "student" | "teacher" | "parent";
export type Status = "draft" | "submitted" | "revision" | "published";
export type Content = VisualDoc | Files;

export type User = {
  id: string;
  role: Role;
  username: string;
  nickname: string;
  avatar: string;
  level?: ClassLevel;
  demo?: boolean;
  /** Akun guru: kelas yang diajar. Kosong berarti koordinator yang melihat semua kelas. */
  /** Akun orang tua: id siswa yang didampingi (bisa lintas kelas). */
  childIds?: string[];
  /** Versi lama: satu anak. Dibaca lewat kidsOf(). */
  childId?: string;
  /** Akun siswa: kode rahasia yang dibagikan ke orang tua untuk menghubungkan akun. */
  parentCode?: string;
  /** Akun siswa: nilai karya dan sikap dari guru. */
  grades?: { karya?: Grade; sikap?: Grade };
  /** Catatan guru untuk orang tua, tersimpan pada akun siswa. */
  parentNotes?: { text: string; at: string }[];
  secret: string;
};
export type Progress = { userId: string; level: ClassLevel; completed: number[]; last: number; lastAt: string; results?: Record<string, LessonResult> };
export type ReportData = {
  term: string;
  project: string;
  teacherName: string;
  tugas: number;
  karya: number;
  sikap: number;
  final: number;
  predikat: "A" | "B" | "C" | "D";
  label: string;
  done: number;
  total: number;
  lessons: { no: number; title: string; score: number | null }[];
  karyaNote?: string;
  sikapNote?: string;
  deskripsi: string;
  catatan: string;
  generatedAt: string;
};
export type Report = { id: string; studentId: string; level: ClassLevel; term: string; data: ReportData; sent?: { data: ReportData; at: string }; updatedAt: string };
export type Work = {
  id: string;
  userId: string;
  level: ClassLevel;
  kind: "visual" | "code";
  content: Content;
  status: Status;
  comment?: { text: string; at: string };
  submitted?: Content;
  submittedAt?: string;
  published?: Content;
  publishedAt?: string;
  /** Riwayat tinjauan guru, terbaru di akhir. */
  history?: { at: string; kind: "perbaikan" | "galeri"; text: string }[];
  updatedAt: string;
};
type DB = { users: User[]; progress: Progress[]; works: Work[]; reports?: Report[]; v?: number };

const FILE = process.env.VERCEL ? path.join(os.tmpdir(), "rakitweb-db.json") : path.join(process.cwd(), ".data", "db.json");

// ---------- hashing ----------
function hash(secret: string): string {
  const salt = crypto.randomBytes(8).toString("hex");
  return `${salt}:${crypto.scryptSync(secret, salt, 32).toString("hex")}`;
}
function verify(secret: string, stored: string): boolean {
  const [salt, h] = stored.split(":");
  if (!salt || !h) return false;
  const a = Buffer.from(crypto.scryptSync(secret, salt, 32).toString("hex"));
  const b = Buffer.from(h);
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

// ---------- storage ----------
const g = globalThis as unknown as { __rw_db?: DB; __rw_mig?: number };
/** Naikkan angka ini setiap kali migrate() berubah, agar server yang sudah berjalan (mode dev) ikut memperbarui data. */
const MIGRATION = 3;

function seed(): DB {
  const now = Date.now();
  const iso = (minAgo: number) => new Date(now - minAgo * 60000).toISOString();
  const db: DB = { users: [], progress: [], works: [] };
  db.users.push({ id: "u-guru", role: "teacher", username: "guru", nickname: "Bu Guru", avatar: "a2", secret: hash(process.env.GURU_PASSWORD || "guru123") });
  const pin = hash("1234");
  const list: [number, string, string, string, number, number[]][] = [
    // level, username, nickname, avatar, last, completed
    [1, "kiko1", "Kiko", "a1", 3, [1, 2]],
    [1, "tari1", "Tari", "a4", 1, []],
    [2, "dodo2", "Dodo", "a5", 5, [1, 2, 3, 4]],
    [3, "luna3", "Luna", "a6", 2, [1]],
    [4, "bima4", "Bima", "a3", 8, [1, 2, 3, 4, 5, 6, 7]],
    [5, "rani5", "Rani", "a2", 6, [1, 2, 3, 4, 5]],
    [5, "awan5", "Awan", "a1", 2, [1]],
    [6, "sari6", "Sari", "a4", 10, [1, 2, 3, 4, 5, 6, 7, 8, 9]],
  ];
  list.forEach(([level, username, nickname, avatar, last, completed], i) => {
    const id = `u-${username}`;
    db.users.push({ id, role: "student", username, nickname, avatar, level: level as ClassLevel, secret: pin });
    db.progress.push({ userId: id, level: level as ClassLevel, completed, last, lastAt: iso(30 + i * 90) });
  });
  return db;
}

function load(): DB {
  if (g.__rw_db) {
    if (g.__rw_mig !== MIGRATION) {
      g.__rw_mig = MIGRATION;
      migrate(g.__rw_db);
    }
    return g.__rw_db;
  }
  let db: DB | null = null;
  try {
    db = JSON.parse(fs.readFileSync(FILE, "utf8")) as DB;
  } catch {
    db = null;
  }
  if (!db) {
    db = seed();
    g.__rw_db = db;
    save();
  }
  g.__rw_db = db;
  g.__rw_mig = MIGRATION;
  migrate(db);
  return db;
}
function save() {
  const db = g.__rw_db;
  if (!db) return;
  try {
    fs.mkdirSync(path.dirname(FILE), { recursive: true });
    fs.writeFileSync(FILE + ".tmp", JSON.stringify(db));
    fs.renameSync(FILE + ".tmp", FILE);
  } catch {
    /* penyimpanan sementara gagal: data tetap ada di memori */
  }
}
const CODE_CHARS = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
const newCode = () => Array.from(crypto.randomBytes(6), (b) => CODE_CHARS[b % CODE_CHARS.length]).join("");
const dayIso = (d: number) => new Date(Date.now() - d * 86400000).toISOString();

/** Mengisi data yang diperlukan pada basis data baru maupun lama. Aman dijalankan berulang. */
function migrate(db: DB) {
  let dirty = false;
  const pw = process.env.GURU_PASSWORD || "guru123";
  const addUser = (u: User) => {
    if (db.users.some((x) => x.id === u.id)) return false;
    db.users.push(u);
    dirty = true;
    return true;
  };
  const addWork = (userId: string, level: ClassLevel, nickname: string, status: Status, ago: number, comment?: string) => {
    const meta = classMeta(level);
    const w: Work = { id: uid("w"), userId, level, kind: meta.mode, content: meta.mode === "visual" ? defaultDoc(level, nickname) : starterFiles(level), status, updatedAt: dayIso(ago) };
    w.submitted = JSON.parse(JSON.stringify(w.content));
    w.submittedAt = dayIso(ago + 1);
    if (status === "revision" && comment) {
      w.comment = { text: comment, at: dayIso(ago) };
      w.history = [{ at: dayIso(ago), kind: "perbaikan", text: comment }];
    }
    if (status === "published") {
      const text = comment ?? "Karya ditampilkan di galeri kelas.";
      w.published = JSON.parse(JSON.stringify(w.submitted));
      w.publishedAt = dayIso(ago);
      w.comment = { text, at: dayIso(ago) };
      w.history = [{ at: dayIso(ago), kind: "galeri", text }];
    }
    db.works.push(w);
    dirty = true;
  };

  // Guru per kelas
  addUser({ id: "u-guru-k2", role: "teacher", username: "rina", nickname: "Bu Rina", avatar: "a2", level: 2, secret: hash(pw) });
  addUser({ id: "u-guru-k5", role: "teacher", username: "andi", nickname: "Pak Andi", avatar: "a3", level: 5, secret: hash(pw) });

  // Dua kelas contoh dengan siswa, karya, dan catatan yang berbeda
  const seedStudent = (level: ClassLevel, username: string, nickname: string, avatar: string, completed: number[], last: number, ago: number, status: Status | null, note: string, comment?: string) => {
    const id = `u-${username}`;
    if (!addUser({ id, role: "student", username, nickname, avatar, level, secret: hash("1234"), parentNotes: [{ text: note, at: dayIso(ago + 1) }] })) return;
    db.progress.push({ userId: id, level, completed, last, lastAt: dayIso(ago) });
    if (status) addWork(id, level, nickname, status, ago, comment);
  };
  seedStudent(2, "mira2", "Mira", "a2", [1, 2, 3, 4, 5], 6, 1, "published", "Mira rajin dan rapi. Di rumah, ajak Mira menceritakan siapa saja yang ada di halaman Tentang Aku-nya.", "Halamanmu rapi dan warnanya enak dilihat. Karyamu kami tampilkan di galeri kelas.");
  seedStudent(2, "nadia2", "Nadia", "a6", [1, 2, 3], 4, 2, "submitted", "Nadia sudah berani mencoba sendiri. Dukung ia untuk bertanya jika ada yang belum jelas.");
  seedStudent(2, "raka2", "Raka", "a3", [1, 2], 3, 5, "revision", "Raka perlu sedikit dorongan agar fokus. Ajak ia mengulang pertemuan yang terlewat.", "Gambarnya bagus. Coba tambahkan satu kalimat tentang hobimu di bawah judul.");
  seedStudent(5, "fajar5", "Fajar", "a3", [1, 2, 3, 4, 5, 6, 7], 8, 1, "submitted", "Fajar cepat memahami HTML. Tantang ia menjelaskan fungsi tag yang baru dipelajari.");
  seedStudent(5, "citra5", "Citra", "a4", [1, 2, 3, 4], 5, 3, "revision", "Citra teliti, hanya perlu memeriksa tautan buatannya satu per satu.", "Strukturnya sudah rapi. Coba klik semua tautan dan pastikan berpindah ke halaman yang benar.");
  const rani = db.users.find((u) => u.id === "u-rani5");
  if (rani && !db.works.some((w) => w.userId === rani.id)) addWork(rani.id, 5, rani.nickname, "published", 2, "Kode dan tampilannya konsisten. Karyamu tampil di galeri kelas.");

  // Akun orang tua contoh (login asli): Kiko di kelas 1
  const kiko = db.users.find((u) => u.id === "u-kiko1");
  if (kiko && addUser({ id: "u-ortu-kiko", role: "parent", username: "ortukiko", nickname: "Orang tua Kiko", avatar: "a2", childIds: [kiko.id], secret: hash("1234") })) {
    kiko.parentNotes = kiko.parentNotes ?? [{ text: "Kiko sangat bersemangat memilih gambar dan warna. Di rumah, ajak Kiko menceritakan alasan ia memilih hobinya.", at: dayIso(2) }];
  }
  // Akun demo orang tua tidak terikat kelas; setiap masuk dimulai dari satu anak
  addUser({ id: "u-demo-ortu", role: "parent", username: "ortu-demo", nickname: "Orang tua (demo)", avatar: "a2", demo: true, childIds: ["u-mira2"], secret: hash(crypto.randomBytes(8).toString("hex")) });

  for (const u of db.users) {
    if (u.role === "parent" && !u.childIds) {
      u.childIds = u.childId ? [u.childId] : [];
      dirty = true;
    }
    if (u.role === "student" && !u.parentCode) {
      u.parentCode = newCode();
      dirty = true;
    }
  }
  if ((db.v ?? 0) < 2) {
    db.reports ??= [];
    seedGrades(db);
    db.v = 2;
    dirty = true;
  }
  if (dirty) save();
}
const uid = (p: string) => `${p}-${crypto.randomBytes(5).toString("hex")}`;
const nowIso = () => new Date().toISOString();

// ---------- pengguna ----------
export const publicUser = (u: User) => ({ id: u.id, role: u.role, username: u.username, nickname: u.nickname, avatar: u.avatar, level: u.level, demo: u.demo });
export const kidsOf = (u: User): string[] => u.childIds ?? (u.childId ? [u.childId] : []);
/** Guru kelas hanya boleh mengelola kelasnya. Koordinator (tanpa kelas) boleh semua. */
export const canTeach = (t: User, level: number) => t.role === "teacher" && (!t.level || t.level === level);
export const homeFor = (u: { role: Role }) => (u.role === "teacher" ? "/guru" : u.role === "parent" ? "/ortu" : "/belajar");

export function getUser(id: string): User | undefined {
  return load().users.find((u) => u.id === id);
}
export function login(username: string, secret: string): User | null {
  const u = load().users.find((x) => x.username === username.trim().toLowerCase() && !x.demo);
  if (!u) return null;
  return verify(secret, u.secret) ? u : null;
}

const DEMO_NAMES = ["Kiko", "Mira", "Bima", "Sari", "Dodo", "Luna"];
const DEMO_AVATARS = ["a1", "a2", "a3", "a4", "a5", "a6"];

export function demoStudent(level: ClassLevel): User {
  const db = load();
  const id = `u-demo-k${level}`;
  let u = db.users.find((x) => x.id === id);
  if (!u) {
    u = { id, role: "student", username: `demo-k${level}`, nickname: `${DEMO_NAMES[level - 1]} (demo)`, avatar: DEMO_AVATARS[level - 1], level, demo: true, secret: hash(crypto.randomBytes(8).toString("hex")), parentCode: newCode() };
    db.users.push(u);
    save();
  }
  return u;
}
/** Guru demo per kelas. Kelas 2 dan 5 memakai guru contoh dengan siswa dan karya lengkap. */
export function demoTeacher(level: ClassLevel): User {
  const db = load();
  const fixed = db.users.find((x) => x.role === "teacher" && x.level === level && !x.demo);
  if (fixed) return fixed;
  const id = `u-demo-guru-k${level}`;
  let u = db.users.find((x) => x.id === id);
  if (!u) {
    u = { id, role: "teacher", username: `guru-demo-k${level}`, nickname: `Guru Kelas ${level}`, avatar: "a2", level, demo: true, secret: hash(crypto.randomBytes(8).toString("hex")) };
    db.users.push(u);
    save();
  }
  return u;
}
export const teacherNameOf = (level: number) => load().users.find((x) => x.role === "teacher" && x.level === level && !x.demo)?.nickname ?? `Guru Kelas ${level}`;

export function listStudents(level?: ClassLevel) {
  const db = load();
  return db.users
    .filter((u) => u.role === "student" && (!level || u.level === level))
    .map((u) => {
      const p = u.level ? db.progress.find((x) => x.userId === u.id && x.level === u.level) : undefined;
      const w = u.level ? db.works.find((x) => x.userId === u.id && x.level === u.level) : undefined;
      return { user: publicUser(u), parentCode: u.parentCode, progress: p, status: w?.status };
    });
}

const slug = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, "").slice(0, 12) || "siswa";

export function createStudent(input: { nickname: string; avatar: string; level: number; pin: string }): { ok: true; username: string } | { ok: false; error: string } {
  const nickname = input.nickname.trim().slice(0, 20);
  if (!nickname) return { ok: false, error: "Nama panggilan wajib diisi." };
  if (!isLevel(input.level)) return { ok: false, error: "Kelas tidak valid." };
  if (!/^\d{4}$/.test(input.pin)) return { ok: false, error: "PIN harus 4 angka." };
  const db = load();
  let username = `${slug(nickname)}${input.level}`;
  let i = 2;
  while (db.users.some((u) => u.username === username)) username = `${slug(nickname)}${input.level}${i++}`;
  db.users.push({ id: uid("u"), role: "student", username, nickname, avatar: input.avatar || "a1", level: input.level, secret: hash(input.pin), parentCode: newCode() });
  save();
  return { ok: true, username };
}
export function moveStudent(id: string, level: number): boolean {
  const u = getUser(id);
  if (!u || u.role !== "student" || !isLevel(level)) return false;
  u.level = level;
  save();
  return true;
}
export function updateProfile(id: string, nickname: string, avatar: string) {
  const u = getUser(id);
  if (!u) return;
  const n = nickname.trim().slice(0, 20);
  if (n) u.nickname = n;
  if (avatar) u.avatar = avatar;
  save();
}

// ---------- progres ----------
export function getProgress(userId: string, level: ClassLevel): Progress | undefined {
  return load().progress.find((p) => p.userId === userId && p.level === level);
}
function ensureProgress(userId: string, level: ClassLevel): Progress {
  const db = load();
  let p = db.progress.find((x) => x.userId === userId && x.level === level);
  if (!p) {
    p = { userId, level, completed: [], last: 0, lastAt: nowIso() };
    db.progress.push(p);
  }
  return p;
}
export function visitLesson(userId: string, level: ClassLevel, no: number) {
  const meta = classMeta(level);
  if (no < 1 || no > meta.meetings) return;
  const p = ensureProgress(userId, level);
  if (p.last === no && Date.now() - Date.parse(p.lastAt) < 60000) return;
  p.last = no;
  p.lastAt = nowIso();
  save();
}
export function completeLesson(userId: string, level: ClassLevel, no: number, self?: unknown) {
  const meta = classMeta(level);
  if (no < 1 || no > meta.meetings) return;
  const p = ensureProgress(userId, level);
  if (!p.completed.includes(no)) p.completed.push(no);
  const lesson = getLesson(level, no);
  const built = lesson ? buildSelf(lesson, self) : null;
  if (built) {
    ensureResult(p, no).self = built;
    ensureResult(p, no).at = nowIso();
  }
  p.lastAt = nowIso();
  save();
}
export function resetDemo(userId: string, level: ClassLevel) {
  const db = load();
  db.progress = db.progress.filter((p) => !(p.userId === userId && p.level === level));
  db.works = db.works.filter((w) => !(w.userId === userId && w.level === level));
  save();
}

// ---------- karya ----------
export function getWork(userId: string, level: ClassLevel): Work {
  const db = load();
  let w = db.works.find((x) => x.userId === userId && x.level === level);
  if (!w) {
    const u = getUser(userId);
    const nick = (u?.nickname ?? "Siswa").replace(/ \(demo\)$/, "");
    const meta = classMeta(level);
    w = {
      id: uid("w"),
      userId,
      level,
      kind: meta.mode,
      content: meta.mode === "visual" ? defaultDoc(level, nick) : starterFiles(level),
      status: "draft",
      updatedAt: nowIso(),
    };
    db.works.push(w);
    save();
  }
  return w;
}

export function sanitizeFiles(raw: unknown, level: ClassLevel, current: Files): Files | null {
  if (!raw || typeof raw !== "object") return null;
  const allowed = Object.keys(starterFiles(level));
  const out: Files = { ...current };
  for (const [k, v] of Object.entries(raw as Record<string, unknown>)) {
    if (!allowed.includes(k)) continue;
    if (typeof v !== "string" || v.length > 80000) return null;
    out[k] = v;
  }
  return out;
}

export function saveWork(userId: string, level: ClassLevel, raw: unknown): boolean {
  const w = getWork(userId, level);
  if (w.kind === "visual") {
    const doc = sanitizeDoc(raw);
    if (!doc) return false;
    w.content = doc;
  } else {
    const files = sanitizeFiles(raw, level, w.content as Files);
    if (!files) return false;
    w.content = files;
  }
  w.updatedAt = nowIso();
  save();
  return true;
}

export function submitWork(userId: string, level: ClassLevel): Work {
  const w = getWork(userId, level);
  w.submitted = JSON.parse(JSON.stringify(w.content));
  w.submittedAt = nowIso();
  w.status = "submitted";
  w.comment = undefined;
  save();
  return w;
}

export function reviewWork(id: string, action: "revise" | "publish", text: string): { ok: boolean; error?: string } {
  const w = load().works.find((x) => x.id === id);
  if (!w) return { ok: false, error: "Karya tidak ditemukan." };
  if (w.status !== "submitted" && w.status !== "revision" && w.status !== "published") return { ok: false, error: "Karya belum dikirim siswa." };
  const t = text.trim().slice(0, 400);
  if (action === "revise") {
    if (!t) return { ok: false, error: "Tulis satu komentar yang bisa ditindaklanjuti." };
    w.status = "revision";
    w.comment = { text: t, at: nowIso() };
    (w.history ??= []).push({ at: nowIso(), kind: "perbaikan", text: t });
  } else {
    if (!w.submitted) return { ok: false, error: "Tidak ada kiriman untuk ditampilkan." };
    w.status = "published";
    w.published = JSON.parse(JSON.stringify(w.submitted));
    w.publishedAt = nowIso();
    w.comment = t ? { text: t, at: nowIso() } : undefined;
    (w.history ??= []).push({ at: nowIso(), kind: "galeri", text: t || "Karya ditampilkan di galeri kelas." });
  }
  save();
  return { ok: true };
}

export function getWorkById(id: string): Work | undefined {
  return load().works.find((w) => w.id === id);
}
export function listWorks(level?: ClassLevel) {
  const db = load();
  return db.works
    .filter((w) => (!level || w.level === level) && w.submitted)
    .map((w) => ({ work: w, user: getUser(w.userId)! }))
    .filter((x) => x.user)
    .sort((a, b) => (b.work.submittedAt ?? "").localeCompare(a.work.submittedAt ?? ""));
}
export function gallery(level: ClassLevel) {
  return listWorks(level).filter((x) => x.work.status === "published" && x.work.published);
}
export function workSummary(userId: string, level: ClassLevel) {
  return load().works.find((w) => w.userId === userId && w.level === level);
}

// ---------- orang tua ----------
/** Guru menulis catatan yang tampil di halaman orang tua. Hanya untuk siswa di kelas guru tersebut. */
export function addParentNote(teacher: User, studentId: string, text: string): { ok: boolean; error?: string } {
  const s = getUser(studentId);
  if (!s || s.role !== "student" || !s.level) return { ok: false, error: "Siswa tidak ditemukan." };
  if (!canTeach(teacher, s.level)) return { ok: false, error: "Siswa ini bukan di kelas Anda." };
  const t = text.trim().slice(0, 500);
  if (!t) return { ok: false, error: "Tulis catatan untuk orang tua." };
  (s.parentNotes ??= []).unshift({ text: t, at: nowIso() });
  s.parentNotes = s.parentNotes.slice(0, 30);
  save();
  return { ok: true };
}

/** Daftar anak yang tertaut pada akun orang tua. */
export function childrenOf(parent: User) {
  return kidsOf(parent)
    .map((id) => getUser(id))
    .filter((u): u is User => !!u && u.role === "student" && !!u.level)
    .map((u) => ({ id: u.id, name: u.nickname.replace(/ \(demo\)$/, ""), level: u.level as ClassLevel, avatar: u.avatar }));
}

/** Ringkasan satu anak untuk halaman orang tua. */
export function childOverview(childId: string) {
  const child = getUser(childId);
  if (!child || child.role !== "student" || !child.level) return null;
  const level = child.level;
  const progress = getProgress(child.id, level);
  const work = workSummary(child.id, level);
  const notes = [
    ...(child.parentNotes ?? []).map((n) => ({ at: n.at, kind: "catatan" as const, text: n.text })),
    ...(work?.history ?? []).map((h) => ({ at: h.at, kind: h.kind, text: h.text })),
  ].sort((a, b) => b.at.localeCompare(a.at));
  return { child: publicUser(child), level, progress, work, notes, teacherName: teacherNameOf(level) };
}

/** Akun demo orang tua. Setiap masuk selalu mulai dari satu anak (Mira, kelas 2). */
export function demoParent(): User {
  const db = load();
  let p = db.users.find((x) => x.id === "u-demo-ortu");
  if (!p) {
    p = { id: "u-demo-ortu", role: "parent", username: "ortu-demo", nickname: "Orang tua (demo)", avatar: "a2", demo: true, secret: hash(crypto.randomBytes(8).toString("hex")) };
    db.users.push(p);
  }
  p.childIds = ["u-mira2"];
  save();
  return p;
}

/** Direktori kelas untuk pencarian orang tua. Tidak membuka daftar nama siswa. */
export function classDirectory() {
  const db = load();
  return ([1, 2, 3, 4, 5, 6] as ClassLevel[]).map((level) => {
    const meta = classMeta(level);
    return {
      level,
      project: meta.project,
      meetings: meta.meetings,
      minutes: meta.minutes,
      mode: meta.mode,
      teacher: teacherNameOf(level),
      students: db.users.filter((u) => u.role === "student" && u.level === level && !u.demo).length,
    };
  });
}

/** Mencari siswa menurut nama panggilan. Minimal 2 huruf; hasil hanya nama dan kelas. */
export function searchStudents(q: string, level?: ClassLevel) {
  const needle = q.trim().toLowerCase();
  if (needle.length < 2) return [];
  return load()
    .users.filter((u) => u.role === "student" && !u.demo && u.level && (!level || u.level === level) && u.nickname.toLowerCase().includes(needle))
    .slice(0, 12)
    .map((u) => ({ id: u.id, name: u.nickname, level: u.level as ClassLevel }));
}

/** Kode orang tua untuk contoh pada mode demo saja. */
export function demoCodes() {
  return load()
    .users.filter((u) => u.role === "student" && !u.demo && (u.level === 2 || u.level === 5) && u.parentCode)
    .map((u) => ({ name: u.nickname, level: u.level as ClassLevel, code: u.parentCode as string }));
}

const tries = globalThis as unknown as { __rw_tries?: Map<string, { n: number; until: number }> };
tries.__rw_tries ??= new Map();

/** Menghubungkan orang tua dengan anak memakai kode dari siswa atau guru. Kode salah dibatasi. */
export function linkChild(parent: User, studentId: string, code: string): { ok: true; childId: string } | { ok: false; error: string } {
  const t = tries.__rw_tries!;
  const st = t.get(parent.id) ?? { n: 0, until: 0 };
  if (st.until > Date.now()) return { ok: false, error: "Terlalu banyak kode salah. Coba lagi beberapa menit lagi." };
  const s = getUser(studentId);
  if (!s || s.role !== "student" || s.demo || !s.level) return { ok: false, error: "Siswa tidak ditemukan." };
  const kids = kidsOf(parent);
  if (kids.includes(s.id)) return { ok: false, error: "Anak ini sudah terhubung." };
  if (kids.length >= 6) return { ok: false, error: "Satu akun maksimal 6 anak." };
  const given = Buffer.from(code.trim().toUpperCase());
  const real = Buffer.from(s.parentCode ?? "");
  if (given.length !== real.length || real.length === 0 || !crypto.timingSafeEqual(given, real)) {
    st.n += 1;
    if (st.n >= 5) {
      st.n = 0;
      st.until = Date.now() + 10 * 60000;
    }
    t.set(parent.id, st);
    return { ok: false, error: "Kode belum cocok. Minta kode orang tua dari anak atau gurunya." };
  }
  t.delete(parent.id);
  parent.childIds = [...kids, s.id];
  save();
  return { ok: true, childId: s.id };
}

const regTries = globalThis as unknown as { __rw_reg?: { n: number; until: number } };

/** Orang tua mendaftar sendiri memakai kode orang tua dari anak atau gurunya. Kode salah dibatasi. */
export function registerParent(input: { nickname: string; username: string; secret: string; code: string }): { ok: true; user: User } | { ok: false; error: string } {
  const st = (regTries.__rw_reg ??= { n: 0, until: 0 });
  if (st.until > Date.now()) return { ok: false, error: "Terlalu banyak kode salah. Coba lagi beberapa menit lagi." };
  const nickname = input.nickname.trim().slice(0, 20);
  const username = input.username.trim().toLowerCase();
  if (!nickname) return { ok: false, error: "Nama panggilan wajib diisi." };
  if (!/^[a-z0-9._-]{3,20}$/.test(username)) return { ok: false, error: "Nama masuk 3 sampai 20 karakter: huruf kecil, angka, titik, garis bawah, atau strip." };
  if (input.secret.length < 6 || input.secret.length > 64) return { ok: false, error: "Kata sandi minimal 6 karakter." };
  const db = load();
  if (db.users.some((u) => u.username === username)) return { ok: false, error: "Nama masuk ini sudah dipakai. Pilih yang lain." };
  const code = input.code.trim().toUpperCase();
  const child = code.length === 6 ? db.users.find((u) => u.role === "student" && !u.demo && u.parentCode === code) : undefined;
  if (!child) {
    st.n += 1;
    if (st.n >= 8) {
      st.n = 0;
      st.until = Date.now() + 10 * 60000;
    }
    return { ok: false, error: "Kode orang tua tidak ditemukan. Minta kode dari anak (halaman Profil) atau gurunya." };
  }
  st.n = 0;
  const user: User = { id: uid("u"), role: "parent", username, nickname, avatar: "a2", childIds: [child.id], secret: hash(input.secret) };
  db.users.push(user);
  save();
  return { ok: true, user };
}

export function unlinkChild(parent: User, childId: string): boolean {
  const kids = kidsOf(parent);
  if (!kids.includes(childId)) return false;
  parent.childIds = kids.filter((x) => x !== childId);
  save();
  return true;
}

// ---------- hasil pertemuan, nilai, dan rapor ----------
const ensureResult = (p: Progress, no: number): LessonResult => {
  p.results ??= {};
  return (p.results[String(no)] ??= { at: nowIso() });
};

/** Menyimpan hasil latihan satu pertemuan. Nilai dihitung ulang di server dari jawaban mentah. */
export function recordActivity(userId: string, level: ClassLevel, no: number, raw: unknown): boolean {
  const lesson = getLesson(level, no);
  if (!lesson) return false;
  const built = buildActivityResult(lesson, raw);
  if (!built) return false;
  const r = ensureResult(ensureProgress(userId, level), no);
  r.score = built.score;
  r.items = built.items;
  r.checks = built.checks;
  r.at = nowIso();
  save();
  return true;
}

const cleanNote = (t: unknown) => (typeof t === "string" ? t.trim().slice(0, 300) : "") || undefined;

/** Guru menilai satu pertemuan yang sudah diselesaikan siswa. Nilai kosong menghapus nilai guru. */
export function gradeLesson(t: User, studentId: string, no: number, score: unknown, note: unknown): { ok: boolean; error?: string } {
  const s = getUser(studentId);
  if (!s || s.role !== "student" || !s.level) return { ok: false, error: "Siswa tidak ditemukan." };
  if (!canTeach(t, s.level)) return { ok: false, error: "Siswa ini bukan di kelas Anda." };
  if (!Number.isInteger(no) || no < 1 || no > classMeta(s.level).meetings) return { ok: false, error: "Pertemuan tidak valid." };
  const p = getProgress(s.id, s.level);
  if (!p || !p.completed.includes(no)) return { ok: false, error: "Pertemuan ini belum diselesaikan siswa." };
  const r = ensureResult(p, no);
  if (score === null || score === "") {
    delete r.teacherScore;
    delete r.teacherNote;
  } else {
    const v = clampScore(score);
    if (v === null) return { ok: false, error: "Nilai harus angka 0 sampai 100." };
    r.teacherScore = v;
    r.teacherNote = cleanNote(note);
  }
  save();
  return { ok: true };
}

/** Guru menilai karya proyek atau sikap/keaktifan siswa. */
export function gradeComponent(t: User, studentId: string, kind: "karya" | "sikap", score: unknown, note: unknown): { ok: boolean; error?: string } {
  const s = getUser(studentId);
  if (!s || s.role !== "student" || !s.level) return { ok: false, error: "Siswa tidak ditemukan." };
  if (!canTeach(t, s.level)) return { ok: false, error: "Siswa ini bukan di kelas Anda." };
  if (kind !== "karya" && kind !== "sikap") return { ok: false, error: "Jenis nilai tidak dikenal." };
  s.grades ??= {};
  if (score === null || score === "") {
    delete s.grades[kind];
  } else {
    const v = clampScore(score);
    if (v === null) return { ok: false, error: "Nilai harus angka 0 sampai 100." };
    if (kind === "karya" && !workSummary(s.id, s.level)?.submitted) return { ok: false, error: "Siswa belum mengirim karya untuk dinilai." };
    s.grades[kind] = { score: v, note: cleanNote(note), at: nowIso() };
  }
  save();
  return { ok: true };
}

const stripDemo = (n: string) => n.replace(/ \(demo\)$/, "");

/** Rekap lengkap satu siswa untuk guru: tiap pertemuan, jawaban, nilai, karya, dan ringkasan nilai akhir. */
export function studentSheet(t: User, studentId: string) {
  const s = getUser(studentId);
  if (!s || s.role !== "student" || !s.level || !canTeach(t, s.level)) return null;
  const level = s.level;
  const p = getProgress(s.id, level);
  const work = workSummary(s.id, level);
  const rows = lessonsOf(level).map((l) => {
    const done = !!p?.completed.includes(l.no);
    const result = p?.results?.[String(l.no)];
    return { no: l.no, title: l.title, done, result, auto: lessonAuto(result), score: done ? lessonFinal(result) : null };
  });
  const scored = rows.filter((r) => r.score !== null) as (typeof rows[number] & { score: number })[];
  const tugas = scored.length ? Math.round(scored.reduce((a, r) => a + r.score, 0) / scored.length) : null;
  const karya = s.grades?.karya ?? null;
  const sikap = s.grades?.sikap ?? null;
  const final = tugas !== null && karya && sikap ? Math.round((tugas * BOBOT.tugas + karya.score * BOBOT.karya + sikap.score * BOBOT.sikap) / 100) : null;
  const report = (load().reports ?? []).find((r) => r.studentId === s.id && r.term === termLabel()) ?? null;
  return { student: publicUser(s), name: s.nickname, level, rows, done: rows.filter((r) => r.done).length, total: rows.length, tugas, karya, sikap, final, work, report, parentCode: s.parentCode };
}

export type ReportStatus = "belum" | "draf" | "terkirim" | "diperbarui";
export function reportStatus(r?: Report | null): ReportStatus {
  if (!r) return "belum";
  if (!r.sent) return "draf";
  return r.sent.data.generatedAt === r.data.generatedAt ? "terkirim" : "diperbarui";
}

function describe(name: string, d: Pick<ReportData, "tugas" | "karya" | "sikap" | "final" | "done" | "total" | "project">): string {
  const pct = Math.round((100 * d.done) / d.total);
  const comps: [string, number][] = [["tugas pertemuan", d.tugas as number], ["karya proyek", d.karya], ["sikap dan keaktifan", d.sikap]];
  const hi = comps.reduce((a, b) => (b[1] > a[1] ? b : a));
  const lo = comps.reduce((a, b) => (b[1] < a[1] ? b : a));
  const out = [
    `${name} telah menyelesaikan ${d.done} dari ${d.total} pertemuan (${pct}%) pada proyek “${d.project}”.`,
    `Nilai tugas pertemuan rata-rata ${d.tugas} (${predikat(d.tugas as number).label}), nilai karya ${d.karya} (${predikat(d.karya).label}), dan nilai sikap serta keaktifan ${d.sikap} (${predikat(d.sikap).label}).`,
  ];
  if (hi[1] !== lo[1]) {
    out.push(`Kekuatan ${name} ada pada ${hi[0]}.`);
    out.push(lo[1] < 80 ? `Aspek ${lo[0]} masih perlu ditingkatkan melalui latihan dan pendampingan.` : `Pertahankan semangat belajar pada semua aspek.`);
  } else {
    out.push(`Capaian ${name} merata di semua aspek.`);
  }
  const p = predikat(d.final).p;
  out.push(p === "A" ? "Secara keseluruhan capaian sangat memuaskan." : p === "B" ? "Secara keseluruhan capaian baik dan terus meningkat." : p === "C" ? "Secara keseluruhan capaian cukup; ananda perlu rutin berlatih." : "Ananda memerlukan bimbingan tambahan agar capaiannya meningkat.");
  return out.join(" ");
}

/** Membuat atau memperbarui draf rapor. Nilai tugas, karya, dan sikap harus sudah ada. */
export function makeReport(t: User, studentId: string, catatan?: string): { ok: true; report: Report } | { ok: false; error: string } {
  const sh = studentSheet(t, studentId);
  if (!sh) return { ok: false, error: "Siswa tidak ditemukan atau bukan di kelas Anda." };
  const missing: string[] = [];
  if (sh.tugas === null) missing.push("nilai pertemuan");
  if (!sh.karya) missing.push("nilai karya");
  if (!sh.sikap) missing.push("nilai sikap");
  if (missing.length || sh.final === null || !sh.karya || !sh.sikap || sh.tugas === null) return { ok: false, error: `${sh.name}: belum ada ${missing.join(", ")}.` };
  const db = load();
  const term = termLabel();
  const meta = classMeta(sh.level);
  const existing = (db.reports ??= []).find((r) => r.studentId === studentId && r.term === term);
  const base = { tugas: sh.tugas, karya: sh.karya.score, sikap: sh.sikap.score, final: sh.final, done: sh.done, total: sh.total, project: meta.project };
  const pd = predikat(sh.final);
  const data: ReportData = {
    term,
    teacherName: t.nickname,
    ...base,
    predikat: pd.p,
    label: pd.label,
    lessons: sh.rows.filter((r) => r.done).map((r) => ({ no: r.no, title: r.title, score: r.score })),
    karyaNote: sh.karya.note,
    sikapNote: sh.sikap.note,
    deskripsi: describe(stripDemo(sh.name), base),
    catatan: (catatan !== undefined ? catatan : existing?.data.catatan ?? "").trim().slice(0, 500),
    generatedAt: nowIso(),
  };
  let report = existing;
  if (report) {
    report.data = data;
    report.updatedAt = nowIso();
  } else {
    report = { id: uid("r"), studentId, level: sh.level, term, data, updatedAt: nowIso() };
    db.reports.push(report);
  }
  save();
  return { ok: true, report };
}

/** Mengirim rapor ke siswa dan orang tua yang tertaut. Yang terkirim adalah salinan saat dikirim. */
export function sendReport(t: User, studentId: string): { ok: boolean; error?: string } {
  const s = getUser(studentId);
  if (!s || s.role !== "student" || !s.level) return { ok: false, error: "Siswa tidak ditemukan." };
  if (!canTeach(t, s.level)) return { ok: false, error: "Siswa ini bukan di kelas Anda." };
  const r = (load().reports ?? []).find((x) => x.studentId === studentId && x.term === termLabel());
  if (!r) return { ok: false, error: "Buat rapor terlebih dahulu." };
  r.sent = { data: JSON.parse(JSON.stringify(r.data)), at: nowIso() };
  save();
  return { ok: true };
}

/** Rapor yang sudah dikirim guru untuk siswa, terbaru lebih dulu. */
export function sentReports(studentId: string) {
  return (load().reports ?? [])
    .filter((r) => r.studentId === studentId && r.sent)
    .map((r) => ({ id: r.id, level: r.level, data: r.sent!.data, at: r.sent!.at }))
    .sort((a, b) => b.at.localeCompare(a.at));
}

/** Rekap seluruh kelas: setiap siswa, nilai tiap pertemuan, dan status rapor. */
export function classSheet(t: User, level: ClassLevel) {
  if (!canTeach(t, level)) return null;
  const lessons = lessonsOf(level);
  const rows = listStudents(level).map(({ user }) => {
    const sh = studentSheet(t, user.id)!;
    return { user, sh, cells: sh.rows.map((r) => ({ no: r.no, done: r.done, score: r.score, teacher: r.result?.teacherScore !== undefined })), status: reportStatus(sh.report) };
  });
  return { lessons, rows };
}

export function reportsForClass(t: User, level: ClassLevel, action: "make" | "send") {
  const ok: string[] = [];
  const skipped: string[] = [];
  if (!canTeach(t, level)) return { ok, skipped: ["Kelas ini bukan kelas Anda."] };
  for (const { user } of listStudents(level)) {
    const name = stripDemo(user.nickname);
    if (action === "make") {
      const r = makeReport(t, user.id);
      if (r.ok) ok.push(name);
      else skipped.push(r.error);
    } else {
      const sh = studentSheet(t, user.id);
      if (!sh?.report) {
        skipped.push(`${name}: rapor belum dibuat.`);
        continue;
      }
      if (reportStatus(sh.report) === "terkirim") continue;
      const r = sendReport(t, user.id);
      if (r.ok) ok.push(name);
      else skipped.push(`${name}: ${r.error}`);
    }
  }
  return { ok, skipped };
}

/** Data contoh nilai untuk dua kelas demo. Hanya dijalankan sekali pada basis data yang belum punya nilai. */
function seedGrades(db: DB) {
  const teacher = (id: string) => db.users.find((u) => u.id === id)!;
  const plan: [string, string, number | null, number | null, string][] = [
    // siswa, guru, nilai karya, nilai sikap, catatan
    ["u-mira2", "u-guru-k2", 90, 95, "Mira aktif bertanya dan senang membantu teman. Terus pertahankan, ya!"],
    ["u-nadia2", "u-guru-k2", null, 88, ""],
    ["u-raka2", "u-guru-k2", null, null, ""],
    ["u-rani5", "u-guru-k5", 85, 90, "Rani teliti dan kodenya rapi. Coba tantang diri dengan fitur baru."],
    ["u-fajar5", "u-guru-k5", null, 92, ""],
  ];
  for (const [sid, tid, karya, sikap, catatan] of plan) {
    const s = db.users.find((u) => u.id === sid);
    const p = db.progress.find((x) => x.userId === sid);
    if (!s || !s.level || !p) continue;
    // Hasil per pertemuan dari pertemuan yang sudah selesai, dibuat lewat jalur yang sama dengan siswa sungguhan
    for (const no of p.completed) {
      const lesson = getLesson(s.level, no);
      if (!lesson) continue;
      const r = ensureResult(p, no);
      r.at = p.lastAt;
      const a = lesson.activity;
      let raw: unknown = null;
      if (a?.type === "quiz") raw = { tries: a.items.map((_, i) => ((no + i) % 4 === 0 ? 2 : 1)) };
      else if (a?.type === "safe") raw = { picks: a.items.map((it, i) => ((no + i) % 5 === 0 ? !it.safe : it.safe)) };
      else if (a?.type === "parts") raw = { wrong: a.targets.map((_, i) => ((no + i) % 3 === 0 ? 1 : 0)) };
      else if (a?.type === "browser") raw = { checks: a.missions.map(() => true) };
      else if (a?.type === "sketch") raw = { checks: a.checklist.map((_, i) => i < a.checklist.length - ((no % 3 === 0) ? 1 : 0)) };
      const built = raw ? buildActivityResult(lesson, raw) : null;
      if (built) Object.assign(r, built);
      r.self = lesson.success.map((t, i) => ({ t, done: no % 4 === 0 ? i === 0 : true }));
    }
    const first = p.completed[0];
    if (first && s.id === "u-mira2") {
      const r = ensureResult(p, first);
      r.teacherScore = 96;
      r.teacherNote = "Lengkap dan rapi.";
    }
    s.grades = {};
    if (karya !== null) s.grades.karya = { score: karya, note: karya >= 90 ? "Halaman rapi, warna serasi, dan ceritanya jelas." : "Struktur baik dan tampilan konsisten.", at: dayIso(1) };
    if (sikap !== null) s.grades.sikap = { score: sikap, note: "Aktif, tertib, dan mau bertanya.", at: dayIso(1) };
    const t = teacher(tid);
    if (karya !== null && sikap !== null) {
      const made = makeReport(t, sid, catatan);
      if (made.ok && sid === "u-mira2") sendReport(t, sid);
    }
  }
}
