export const STATUS_LABEL: Record<string, string> = {
  draft: "Draf, belum dikirim",
  submitted: "Dikirim, menunggu guru",
  revision: "Perlu diperbaiki",
  published: "Tampil di galeri kelas",
};

export const ROLE_LABEL: Record<string, string> = { student: "Siswa", teacher: "Guru", parent: "Orang tua", admin: "Admin" };

export function ago(iso?: string): string {
  if (!iso) return "belum pernah";
  const s = Math.max(0, (Date.now() - Date.parse(iso)) / 1000);
  if (s < 90) return "baru saja";
  if (s < 3600) return `${Math.round(s / 60)} menit lalu`;
  if (s < 86400) return `${Math.round(s / 3600)} jam lalu`;
  return `${Math.round(s / 86400)} hari lalu`;
}

export function tgl(iso?: string): string {
  if (!iso) return "-";
  return new Date(iso).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });
}
export function hariLalu(iso?: string): number {
  return iso ? Math.max(0, Math.floor((Date.now() - Date.parse(iso)) / 86400000)) : 999;
}
