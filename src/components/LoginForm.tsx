'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function LoginForm() {
  const supabase = createClient();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  async function handleLogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setMessage(error.message);
      setLoading(false);
      return;
    }

    window.location.href = '/dashboard';
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col gap-8 rounded-lg border border-white/[0.08] bg-white/[0.035] p-8 shadow-[0_28px_90px_rgba(0,0,0,0.45)] backdrop-blur-3xl md:p-10"
    >
      <div className="flex flex-col gap-3">
        <h2 className="text-3xl font-semibold tracking-tight text-white">Sign in.</h2>
        <p className="text-lg text-white/40">
          Continue your preparation journey.
        </p>
      </div>

      <form onSubmit={handleLogin} className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <input
            type="email"
            required
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-lg border border-white/10 bg-white/5 px-5 py-4 text-[15px] font-medium text-white outline-none transition-all focus:border-white/25 focus:bg-white/[0.08]"
          />
        </div>

        <div className="flex flex-col gap-2">
          <input
            type="password"
            required
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-lg border border-white/10 bg-white/5 px-5 py-4 text-[15px] font-medium text-white outline-none transition-all focus:border-white/25 focus:bg-white/[0.08]"
          />
        </div>

        {message && (
          <p className="rounded-lg border border-red-300/20 bg-red-500/10 px-4 py-3 text-center text-[13px] font-semibold text-red-200">
            {message}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="mt-4 w-full rounded-lg bg-white px-8 py-4 text-[15px] font-semibold text-black transition-colors hover:bg-white/90 disabled:opacity-50"
        >
          {loading ? 'Authenticating...' : 'Sign In'}
        </button>
      </form>

      <div className="flex justify-center border-t border-white/5 pt-8 text-[13px] font-medium text-white/30">
        <p>
          Don&apos;t have an account?{' '}
          <Link href="/signup" className="font-bold text-white/60 transition-colors hover:text-white">
            Join OrbitPrep free
          </Link>
        </p>
      </div>
    </motion.div>
  );
}
