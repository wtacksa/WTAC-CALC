
'use client';
import Link from 'next/link';
import { supabase } from '@/lib/supabaseClient';
import { useState } from 'react';

export default function RegisterPage(){
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [err, setErr] = useState<string|null>(null);

  const register = async () => {
    setErr(null);
    const { data, error } = await supabase.auth.signUp({ email, password, options: { data: { full_name: fullName } } });
    if(error) setErr(error.message);
    else window.location.href = '/projects';
  };

  return (
    <div className="card max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-3">Create account</h2>
      {err && <div className="text-red-600 text-sm mb-2">{err}</div>}
      <label className="label">Full name<input className="input" value={fullName} onChange={e=>setFullName(e.target.value)} /></label>
      <label className="label">Email<input className="input" value={email} onChange={e=>setEmail(e.target.value)} /></label>
      <label className="label">Password<input type="password" className="input" value={password} onChange={e=>setPassword(e.target.value)} /></label>
      <div className="mt-3 flex items-center gap-3">
        <button className="btn btn-primary" onClick={register}>Register</button>
        <Link className="text-sm text-gray-600" href="/login">Already have an account?</Link>
      </div>
    </div>
  );
}
