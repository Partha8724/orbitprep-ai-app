import Link from "next/link";

import { loginAction } from "@/app/auth-actions";
import { redirectIfAuthenticated } from "@/lib/auth";

type LoginPageProps = {
  searchParams: Promise<{
    error?: string;
    message?: string;
  }>;
};

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Login",
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  await redirectIfAuthenticated();
  const params = await searchParams;

  return (
    <main className="min-h-screen bg-[#050816] px-6 py-16 text-white">
      <div className="mx-auto grid min-h-[calc(100vh-8rem)] max-w-6xl items-center gap-12 lg:grid-cols-[0.9fr_1.1fr]">
        <section>
          <div className="inline-flex rounded-full border border-cyan-300/25 bg-cyan-300/10 px-4 py-2 text-sm text-cyan-100">
            Student workspace
          </div>
          <h1 className="mt-6 text-4xl font-semibold tracking-tight md:text-6xl">
            Continue your OrbitPrep AI preparation.
          </h1>
          <p className="mt-5 max-w-xl text-lg leading-8 text-slate-300">
            Access your exam dashboard, premium status, saved preparation flow, and admin tools when authorized.
          </p>
        </section>

        <section className="rounded-[32px] border border-white/10 bg-white/5 p-6 shadow-2xl backdrop-blur-xl md:p-8">
          <div>
            <h2 className="text-3xl font-semibold">Log in</h2>
            <p className="mt-2 text-sm text-slate-300">Use the email and password on your Supabase account.</p>
          </div>

          {params.error ? (
            <div className="mt-6 rounded-2xl border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm text-red-100">
              {params.error}
            </div>
          ) : null}

          {params.message ? (
            <div className="mt-6 rounded-2xl border border-emerald-400/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-100">
              {params.message}
            </div>
          ) : null}

          <form action={loginAction} className="mt-8 space-y-5">
            <label className="block">
              <span className="text-sm font-medium text-slate-200">Email</span>
              <input
                name="email"
                type="email"
                autoComplete="email"
                required
                className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-300/60"
                placeholder="student@orbitprep.ai"
              />
            </label>

            <label className="block">
              <span className="text-sm font-medium text-slate-200">Password</span>
              <input
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-300/60"
                placeholder="Your password"
              />
            </label>

            <button className="w-full rounded-2xl bg-white px-5 py-3 font-semibold text-slate-950 transition hover:bg-slate-100">
              Log in
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-300">
            New to OrbitPrep AI?{" "}
            <Link href="/signup" className="font-medium text-cyan-200 hover:text-cyan-100">
              Create an account
            </Link>
          </p>
        </section>
      </div>
    </main>
  );
}
