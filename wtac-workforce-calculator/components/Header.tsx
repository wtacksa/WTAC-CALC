
'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

export default function Header(){
  const [email, setEmail] = useState<string | null>(null);
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setEmail(data.user?.email ?? null));
    const { data: sub } = supabase.auth.onAuthStateChange((_e, sess) => setEmail(sess?.user?.email ?? null));
    return () => { sub?.subscription.unsubscribe(); };
  }, []);
  return (
    <header className="bg-white border-b">
      <div className="container-narrow flex items-center justify-between py-3">
        <Link href="/" className="font-bold text-lg">WTAC Workforce Calculator</Link>
        <nav className="flex items-center gap-3">
          <Link href="/projects" className="btn btn-ghost">My Projects</Link>
          {email ? (
            <button onClick={()=>supabase.auth.signOut()} className="btn btn-ghost">Sign out ({email})</button>
          ) : (
            <Link href="/login" className="btn btn-primary">Sign in</Link>
          )}
        </nav>
      </div>
    </header>
  );
}
