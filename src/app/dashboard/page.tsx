import Link from "next/link";
import { ShieldCheck, Star, UserRound } from "lucide-react";

import { logoutAction } from "@/app/auth-actions";
import { requireProfile } from "@/lib/auth";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Dashboard",
};

export default async function DashboardPage() {
  const profile = await requireProfile();

  return (
    <main className="min-h-screen bg-[#050816] px-6 py-10 text-white">
      <div className="mx-auto max-w-6xl">
        <header className="flex flex-col gap-5 border-b border-white/10 pb-8 md:flex-row md:items-center md:justify-between">
          <div>
            <Link href="/" className="text-sm text-cyan-200 hover:text-cyan-100">
              OrbitPrep AI
            </Link>
            <h1 className="mt-3 text-4xl font-semibold tracking-tight md:text-5xl">
              Welcome, {profile.full_name}
            </h1>
            <p className="mt-3 max-w-2xl text-slate-300">
              Your authenticated student workspace is connected to Supabase Auth and your Postgres profile record.
            </p>
          </div>

          <form action={logoutAction}>
            <button className="rounded-2xl border border-white/10 bg-white px-5 py-3 font-semibold text-slate-950 transition hover:bg-slate-100">
              Log out
            </button>
          </form>
        </header>

        <section className="mt-10 grid gap-5 md:grid-cols-3">
          <div className="rounded-[28px] border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-300/10 text-cyan-100">
              <UserRound className="h-6 w-6" />
            </div>
            <h2 className="mt-5 text-xl font-semibold">Profile</h2>
            <dl className="mt-5 space-y-4 text-sm">
              <div>
                <dt className="text-slate-400">Full name</dt>
                <dd className="mt-1 text-white">{profile.full_name}</dd>
              </div>
              <div>
                <dt className="text-slate-400">Email</dt>
                <dd className="mt-1 text-white">{profile.email}</dd>
              </div>
            </dl>
          </div>

          <div className="rounded-[28px] border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-300/10 text-violet-100">
              <Star className="h-6 w-6" />
            </div>
            <h2 className="mt-5 text-xl font-semibold">Premium status</h2>
            <div className="mt-5 inline-flex rounded-full border border-white/10 bg-slate-950/70 px-4 py-2 text-sm">
              {profile.is_premium ? "Premium active" : "Free account"}
            </div>
            <p className="mt-4 text-sm leading-6 text-slate-300">
              Premium access is controlled by the `is_premium` field in your `profiles` table.
            </p>
          </div>

          <div className="rounded-[28px] border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-300/10 text-emerald-100">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <h2 className="mt-5 text-xl font-semibold">Access role</h2>
            <div className="mt-5 inline-flex rounded-full border border-white/10 bg-slate-950/70 px-4 py-2 text-sm capitalize">
              {profile.role}
            </div>
            {profile.role === "admin" ? (
              <Link href="/admin" className="mt-5 inline-flex text-sm font-medium text-cyan-200 hover:text-cyan-100">
                Open admin panel
              </Link>
            ) : (
              <p className="mt-4 text-sm leading-6 text-slate-300">
                Admin pages are restricted to profiles with `role = admin`.
              </p>
            )}
          </div>
        </section>

        <section className="mt-8 rounded-[32px] border border-white/10 bg-white/5 p-6 backdrop-blur-xl md:p-8">
          <h2 className="text-2xl font-semibold">Account details</h2>
          <div className="mt-6 grid gap-4 text-sm md:grid-cols-2">
            <div className="rounded-2xl border border-white/10 bg-slate-950/60 p-4">
              <div className="text-slate-400">User ID</div>
              <div className="mt-2 break-all font-mono text-slate-100">{profile.id}</div>
            </div>
            <div className="rounded-2xl border border-white/10 bg-slate-950/60 p-4">
              <div className="text-slate-400">Created</div>
              <div className="mt-2 text-slate-100">
                {new Intl.DateTimeFormat("en-IN", {
                  dateStyle: "medium",
                  timeStyle: "short",
                }).format(new Date(profile.created_at))}
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
