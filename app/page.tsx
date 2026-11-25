import { redirect } from "next/navigation";
import { Entry } from "@/components/Entry";
import { currentUser } from "@/lib/auth";
import { homeFor } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function Home({ searchParams }: { searchParams: Promise<{ demo?: string }> }) {
  const u = await currentUser();
  if (u) redirect(homeFor(u));
  const sp = await searchParams;
  return <Entry initialMode={sp.demo === "siswa" ? "siswa" : sp.demo === "guru" ? "guru" : "home"} />;
}
