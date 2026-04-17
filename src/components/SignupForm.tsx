'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';

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

    setMessage('Signup successful. Check your email if confirmation is enabled.');
    setLoading(false);
  }

  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl">
      <h2 className="text-2xl font-semibold text-white">Create Account</h2>
      <p className="mt-2 text-white/70">
        Sign up with your email and password.
      </p>

      <form onSubmit={handleSignup} className="mt-6 space-y-4">
        <input
          type="email"
          required
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none"
        />

        <input
          type="password"
          required
          placeholder="Create password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none"
        />

        {message && <p className="text-sm text-white/80">{message}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-full bg-white px-6 py-3 font-semibold text-black disabled:opacity-60"
        >
          {loading ? 'Creating account...' : 'Sign Up'}
        </button>
      </form>
    </div>
  );
}