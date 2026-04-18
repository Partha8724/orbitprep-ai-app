import type { Metadata } from "next";
import LoginForm from "@/components/LoginForm";
import { redirectIfAuthenticated } from "@/lib/auth";
import Navbar from "@/components/Navbar";
import { PremiumPageShell, SectionGlowLines } from "@/components/premium";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Sign In",
};

export default async function LoginPage() {
  await redirectIfAuthenticated();

  return (
    <PremiumPageShell>
      <Navbar />
      <div className="relative flex min-h-screen flex-col items-center justify-center px-6 py-24">
        <SectionGlowLines />
        <div className="mb-8 max-w-xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-white/40">Welcome back</p>
          <h1 className="mt-4 text-4xl font-semibold tracking-[-0.045em] text-white">Return to your study workspace.</h1>
        </div>
        <div className="w-full max-w-lg">
          <LoginForm />
        </div>
      </div>
    </PremiumPageShell>
  );
}
