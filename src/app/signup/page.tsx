import type { Metadata } from "next";
import SignupForm from "@/components/SignupForm";
import { redirectIfAuthenticated } from "@/lib/auth";
import Navbar from "@/components/Navbar";
import { PremiumPageShell, SectionGlowLines } from "@/components/premium";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Sign Up",
};

export default async function SignupPage() {
  await redirectIfAuthenticated();

  return (
    <PremiumPageShell>
      <Navbar />
      <div className="relative mx-auto flex min-h-screen max-w-6xl flex-col items-center justify-center px-6 py-24">
        <SectionGlowLines />
        <div className="mb-8 max-w-xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-white/40">Start free</p>
          <h1 className="mt-4 text-4xl font-semibold tracking-[-0.045em] text-white">Build a cleaner preparation system.</h1>
        </div>
        <div className="w-full max-w-md">
          <SignupForm />
        </div>
      </div>
    </PremiumPageShell>
  );
}
