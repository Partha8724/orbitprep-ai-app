'use client';

export default function Navbar() {
  return (
    <header className="fixed left-0 top-0 z-50 w-full">
      <div className="mx-auto max-w-7xl px-4 py-4 md:px-6">
        <div className="flex items-center justify-between rounded-full border border-white/10 bg-black/30 px-5 py-3 backdrop-blur-xl">
          <a href="/" className="text-sm font-semibold tracking-[0.2em] text-white">
            ORBITPREP AI
          </a>

          <nav className="hidden md:flex items-center gap-6">
            <a href="/" className="text-sm text-white/80 hover:text-white">Home</a>
            <a href="/test-series" className="text-sm text-white/80 hover:text-white">Test</a>
            <a href="/pricing" className="text-sm text-white/80 hover:text-white">Pricing</a>
          </nav>

          <a
            href="/test-series"
            className="rounded-full bg-white px-5 py-2 text-sm font-semibold text-black"
          >
            Start Now
          </a>
        </div>
      </div>
    </header>
  );
}