import { impersonator, requireAdmin, requireParent, requireStudent, requireTeacher, type Student } from "@/lib/auth";
import { childOverview, type User } from "@/lib/db";
import { ROLE_LABEL } from "@/lib/format";
import Link from "next/link";
import { AdminNav, ParentNav, StudentNav, TeacherNav } from "./Nav";
import { Footer, IkonKotak } from "./Deco";
import { ChildBar } from "./ParentClient";
import { BackToAdmin } from "./AdminClient";

const main = (wide?: boolean) => `mx-auto px-4 pb-28 pt-6 sm:px-6 md:pb-14 md:pt-8 ${wide ? "max-w-[1680px]" : "max-w-[1360px]"}`;

/** Pita peringatan saat admin sedang melihat sebagai pengguna lain. */
async function AsBanner({ user }: { user: User }) {
  const a = await impersonator();
  if (!a || a.id === user.id) return null;
  return (
    <div role="status" className="relative z-40 border-b border-salah/30 bg-salah-muda">
      <div className="mx-auto flex max-w-[1680px] flex-wrap items-center gap-x-4 gap-y-2 px-4 py-2 text-sm sm:px-6">
        <p className="min-w-0 flex-1 text-salah-tua">
          <b>Mode admin:</b> Anda melihat sebagai <b>{user.nickname}</b> ({ROLE_LABEL[user.role].toLowerCase()}).<span className="hidden sm:inline"> Semua perubahan tersimpan atas nama akun ini.</span>
        </p>
        <BackToAdmin />
      </div>
    </div>
  );
}

export async function StudentShell({ children, wide }: { children: (s: Student) => Promise<React.ReactNode> | React.ReactNode; wide?: boolean }) {
  const s = await requireStudent();
  const body = await children(s);
  return (
    <>
      <AsBanner user={s} />
      <StudentNav nickname={s.nickname} level={s.level} />
      <main className={main(wide)}>{body}<Footer /></main>
    </>
  );
}

/** Halaman guru. Admin super juga memakai halaman ini sebagai koordinator semua kelas. */
export async function TeacherShell({ children, wide }: { children: (t: User) => Promise<React.ReactNode> | React.ReactNode; wide?: boolean }) {
  const t = await requireTeacher();
  const body = await children(t);
  return (
    <>
      <AsBanner user={t} />
      {t.role === "admin" ? <AdminNav nickname={t.nickname} demo={t.demo} /> : <TeacherNav nickname={t.nickname} level={t.level} />}
      <main className={main(wide)}>{body}<Footer /></main>
    </>
  );
}

export async function AdminShell({ children, wide }: { children: (a: User) => Promise<React.ReactNode> | React.ReactNode; wide?: boolean }) {
  const a = await requireAdmin();
  const body = await children(a);
  return (
    <>
      <AdminNav nickname={a.nickname} demo={a.demo} />
      <main className={main(wide)}>{body}<Footer /></main>
    </>
  );
}

export type ChildData = NonNullable<ReturnType<typeof childOverview>>;
type Kid = { id: string; name: string; level: number; className?: string; avatar: string };

function ParentFrame({ parent, kids, selected, children }: { parent: User; kids: Kid[]; selected: Kid | null; children: React.ReactNode }) {
  return (
    <>
      <AsBanner user={parent} />
      <ParentNav parentName={parent.nickname} childName={selected?.name ?? ""} level={selected?.level ?? 0} />
      <main className={main(false)}>
        <ChildBar kids={kids} selectedId={selected?.id ?? ""} />
        {children}
        <Footer />
      </main>
    </>
  );
}

function NoChild() {
  return (
    <div className="kartu flex flex-col items-center px-6 py-16 text-center">
      <IkonKotak name="kelas" />
      <h1 className="mt-3 text-xl">Belum ada anak yang terhubung</h1>
      <p className="mt-1 max-w-md text-tinta-2">Cari kelas anak Anda, lalu hubungkan akun dengan kode orang tua dari anak atau gurunya.</p>
      <Link href="/ortu/kelas" className="tombol mt-5">Cari kelas anak</Link>
    </div>
  );
}

/** Halaman orang tua yang menampilkan satu anak. Anak dipilih lewat pemilih di bagian atas. */
export async function ParentShell({ children }: { children: (d: ChildData, parent: User) => Promise<React.ReactNode> | React.ReactNode }) {
  const { parent, kids, selected } = await requireParent();
  const data = selected ? childOverview(selected.id) : null;
  const body = data ? await children(data, parent) : <NoChild />;
  return <ParentFrame parent={parent} kids={kids} selected={selected} >{body}</ParentFrame>;
}

/** Halaman orang tua yang tidak bergantung pada satu anak, misalnya pencarian kelas. */
export async function ParentPlain({ children }: { children: (c: { parent: User; kids: Kid[] }) => Promise<React.ReactNode> | React.ReactNode }) {
  const { parent, kids, selected } = await requireParent();
  const body = await children({ parent, kids });
  return <ParentFrame parent={parent} kids={kids} selected={selected}>{body}</ParentFrame>;
}
