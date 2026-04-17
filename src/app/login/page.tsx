import type { Metadata } from "next";
import LoginForm from "@/components/LoginForm";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Login",
};

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-[#050816] px-6 py-20 text-white">
      <div className="mx-auto max-w-md pt-20">
        <LoginForm />
      </div>
    </main>
  );
}