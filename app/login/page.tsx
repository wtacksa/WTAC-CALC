export const dynamic = 'force-dynamic';
'use client';
import Link from 'next/link';
import { supabase } from '@/lib/supabaseClient';
import { useState } from 'react';

export default function LoginPage(){
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState<string|null>(null);

  const login = async () => {
    setErr(null);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if(error) setErr(error.message); else window.location.href = '/projects';
  };

  return (
    <div className="card max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-3">Sign in</h2>
      {err && <div className="text-red-600 text-sm mb-2">{err}</div>}
      <label className="label">Email<input className="input" value={email} onChange={e=>setEmail(e.target.value)} /></label>
      <label className="label">Password<input type="password" className="input" value={password} onChange={e=>setPassword(e.target.value)} /></label>
      <div className="mt-3 flex items-center gap-3">
        <button className="btn btn-primary" onClick={login}>Sign in</button>
        <Link className="text-sm text-gray-600" href="/register">Create account</Link>
      </div>
    </div>
  );
}
