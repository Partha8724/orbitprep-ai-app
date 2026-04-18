import { getCurrentUser } from '@/lib/auth';
import { LogoutButton } from './auth/LogoutButton';
import Link from 'next/link';

export default async function Navbar() {
  const user = await getCurrentUser();

  return (
    <header className="fixed left-0 top-0 z-50 w-full px-6 pt-6">
      <div className="mx-auto max-w-7xl">
        <div className="flex items-center justify-between rounded-full border border-white/10 bg-black/20 px-8 py-3.5 backdrop-blur-2xl transition-all duration-300 hover:bg-black/30">
          <Link href="/" className="text-sm font-bold tracking-[0.25em] text-white transition-opacity hover:opacity-70">
            ORBITPREP
          </Link>

          <nav className="hidden items-center gap-10 md:flex">
            <Link href="/" className="text-[13px] font-medium text-white/50 transition-colors hover:text-white">Home</Link>
            <Link href="/test-series" className="text-[13px] font-medium text-white/50 transition-colors hover:text-white">Tests</Link>
            <Link href="/pricing" className="text-[13px] font-medium text-white/50 transition-colors hover:text-white">Pricing</Link>
            {user && (
              <>
                <Link href="/ai-mentor" className="text-[13px] font-medium text-white/50 transition-colors hover:text-white">AI Mentor</Link>
                <Link href="/translator" className="text-[13px] font-medium text-white/50 transition-colors hover:text-white">Translator</Link>
                <Link href="/dashboard" className="text-[13px] font-medium text-white/50 transition-colors hover:text-white">Dashboard</Link>
                <LogoutButton />
              </>
            )}
            {!user && (
              <Link href="/login" className="text-[13px] font-medium text-white/50 transition-colors hover:text-white">Sign In</Link>
            )}
          </nav>

          <Link
            href={user ? "/dashboard" : "/signup"}
            className="group relative inline-flex items-center justify-center overflow-hidden rounded-full bg-white px-6 py-2 text-[13px] font-bold text-black transition-transform duration-300 hover:scale-105 active:scale-95"
          >
            {user ? "Dashboard" : "Join Now"}
          </Link>
        </div>
      </div>
    </header>
  );
}
