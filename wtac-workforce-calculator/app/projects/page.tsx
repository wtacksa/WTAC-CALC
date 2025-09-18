
'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import type { Project } from '@/lib/types';

export default function ProjectsPage(){
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data }) => {
      if(!data.user){ window.location.href = '/login'; return; }
      const { data: rows } = await supabase.from('projects').select('*').order('created_at',{ascending:false});
      setProjects(rows as any || []);
    });
  }, []);

  const createNew = async () => {
    const user = (await supabase.auth.getUser()).data.user;
    if(!user) return;
    const { data } = await supabase.from('projects').insert({
      user_id: user.id,
      name: 'New project',
      period: 'month',
      hours_per_fte: 160,
      utilization: 0.85,
      current_staff: 0
    }).select().single();
    window.location.href = `/projects/${data.id}`;
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">My Projects</h1>
        <button className="btn btn-primary" onClick={createNew}>New Project</button>
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        {projects.map(p => (
          <Link key={p.id} href={`/projects/${p.id}`} className="card hover:shadow">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-semibold">{p.name}</div>
                <div className="text-sm text-gray-600">Period: {p.period} • H/FTE: {p.hours_per_fte} • Util: {p.utilization}</div>
              </div>
              <span className="badge">Open</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
