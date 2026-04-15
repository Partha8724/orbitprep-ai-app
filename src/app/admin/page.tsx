import Link from "next/link";
import { ShieldCheck, UsersRound } from "lucide-react";

import { logoutAction } from "@/app/auth-actions";
import { requireAdminProfile } from "@/lib/auth";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Admin",
};

export default async function AdminPage() {
  const profile = await requireAdminProfile();

  return (
    <main className="min-h-screen bg-[#050816] px-6 py-10 text-white">
      <div className="mx-auto max-w-6xl">
        <header className="flex flex-col gap-5 border-b border-white/10 pb-8 md:flex-row md:items-center md:justify-between">
          <div>
            <Link href="/dashboard" className="text-sm text-cyan-200 hover:text-cyan-100">
              Back to dashboard
            </Link>
            <h1 className="mt-3 text-4xl font-semibold tracking-tight md:text-5xl">
              Admin control center
            </h1>
            <p className="mt-3 max-w-2xl text-slate-300">
              This route is available only when your Supabase profile role is set to admin.
            </p>
          </div>

          <form action={logoutAction}>
            <button className="rounded-2xl border border-white/10 bg-white px-5 py-3 font-semibold text-slate-950 transition hover:bg-slate-100">
              Log out
            </button>
          </form>
        </header>

        <section className="mt-10 grid gap-5 md:grid-cols-2">
          <div className="rounded-[28px] border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-300/10 text-emerald-100">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <h2 className="mt-5 text-xl font-semibold">Verified admin</h2>
            <p className="mt-3 text-sm leading-6 text-slate-300">
              {profile.full_name} is authenticated and authorized through the `profiles.role` column.
            </p>
          </div>

          <div className="rounded-[28px] border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-300/10 text-cyan-100">
              <UsersRound className="h-6 w-6" />
            </div>
            <h2 className="mt-5 text-xl font-semibold">Startup-ready permissions</h2>
            <p className="mt-3 text-sm leading-6 text-slate-300">
              Promote trusted operators by updating their profile role to `admin` in Supabase.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
