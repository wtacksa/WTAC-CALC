
'use client';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import type { Project } from '@/lib/types';

export default function ProjectSettings({project, onChange}:{project: Project, onChange: (p: Project)=>void}){
  const [p, setP] = useState(project);
  useEffect(()=>{ onChange(p); }, [p]);
  return (
    <div className="card">
      <h3 className="text-lg font-semibold mb-3">Project Settings</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <label className="label">Project Name
          <input className="input" value={p.name} onChange={e=>setP({...p, name: e.target.value})} />
        </label>
        <label className="label">Period
          <select className="input" value={p.period} onChange={e=>setP({...p, period: e.target.value as any})}>
            <option value="day">Day</option>
            <option value="week">Week</option>
            <option value="month">Month</option>
            <option value="year">Year</option>
          </select>
        </label>
        <label className="label">Hours per FTE per period
          <input type="number" className="input" value={p.hours_per_fte} onChange={e=>setP({...p, hours_per_fte: Number(e.target.value)})} />
        </label>
        <label className="label">Utilization (0-1)
          <input type="number" step="0.01" className="input" value={p.utilization} onChange={e=>setP({...p, utilization: Number(e.target.value)})} />
        </label>
        <label className="label">Current Staff (FTE)
          <input type="number" className="input" value={p.current_staff} onChange={e=>setP({...p, current_staff: Number(e.target.value)})} />
        </label>
      </div>
    </div>
  );
}
