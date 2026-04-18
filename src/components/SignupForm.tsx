'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function SignupForm() {
  const supabase = createClient();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  async function handleSignup(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    const { error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      setMessage(error.message);
      setLoading(false);
      return;
    }

    setMessage('Account created. Check your email for verification.');
    setLoading(false);
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col gap-8 rounded-lg border border-white/[0.08] bg-white/[0.035] p-8 shadow-[0_28px_90px_rgba(0,0,0,0.45)] backdrop-blur-3xl md:p-10"
    >
      <div className="flex flex-col gap-3">
        <h2 className="text-3xl font-semibold tracking-tight text-white">Join OrbitPrep.</h2>
        <p className="text-lg text-white/40">
          The future of exam preparation starts here.
        </p>
      </div>

      <form onSubmit={handleSignup} className="flex flex-col gap-4">
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
            placeholder="Choose password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-lg border border-white/10 bg-white/5 px-5 py-4 text-[15px] font-medium text-white outline-none transition-all focus:border-white/25 focus:bg-white/[0.08]"
          />
        </div>

        {message && (
          <p className={`rounded-lg border px-4 py-3 text-center text-[13px] font-semibold ${message.includes('error') ? 'border-red-300/20 bg-red-500/10 text-red-200' : 'border-emerald-300/20 bg-emerald-500/10 text-emerald-200'}`}>
            {message}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="mt-4 w-full rounded-lg bg-white px-8 py-4 text-[15px] font-semibold text-black transition-colors hover:bg-white/90 disabled:opacity-50"
        >
          {loading ? 'Creating account...' : 'Create Account'}
        </button>
      </form>

      <div className="flex justify-center border-t border-white/5 pt-8 text-[13px] font-medium text-white/30">
        <p>
          Already have an account?{' '}
          <Link href="/login" className="font-bold text-white/60 transition-colors hover:text-white">
            Sign in
          </Link>
        </p>
      </div>
    </motion.div>
  );
}
