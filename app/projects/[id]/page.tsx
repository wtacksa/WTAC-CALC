export const dynamic = 'force-dynamic';
'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useParams } from 'next/navigation';
import type { Project, Task } from '@/lib/types';
import ProjectSettings from '@/components/ProjectSettings';
import TaskTable from '@/components/TaskTable';
import UploadCsv from '@/components/UploadCsv';
import SummaryPanel from '@/components/SummaryPanel';
import ExportButtons from '@/components/ExportButtons';

export default function ProjectDetail(){
  const params = useParams();
  const id = params?.id as string;
  const [project, setProject] = useState<Project | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [msg, setMsg] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const user = (await supabase.auth.getUser()).data.user;
      if(!user){ window.location.href = '/login'; return; }
      const { data: p } = await supabase.from('projects').select('*').eq('id', id).single();
      if(p){ setProject(p as any); }
      const { data: ts } = await supabase.from('tasks').select('*').eq('project_id', id).order('id');
      setTasks((ts as any) || []);
    })();
  }, [id]);

  const saveAll = async () => {
    if(!project) return;
    setMsg('Saving...');
    await supabase.from('projects').update({
      name: project.name,
      period: project.period,
      hours_per_fte: project.hours_per_fte,
      utilization: project.utilization,
      current_staff: project.current_staff
    }).eq('id', project.id);
    // naive save: delete and insert tasks
    await supabase.from('tasks').delete().eq('project_id', project.id);
    if(tasks.length){
      await supabase.from('tasks').insert(tasks.map(t => ({...t, project_id: project.id})));
    }
    setMsg('Saved ✔');
    setTimeout(()=>setMsg(null), 2000);
  };

  if(!project) return <div className="card">Loading...</div>;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">{project.name}</h1>
        <div className="flex items-center gap-3">
          <ExportButtons tasks={tasks} project={project} />
          <button className="btn btn-primary" onClick={saveAll}>Save</button>
        </div>
      </div>
      {msg && <div className="text-sm text-green-700">{msg}</div>}
      <ProjectSettings project={project} onChange={setProject} />
      <UploadCsv onLoad={(rows)=>setTasks(rows)} />
      <TaskTable tasks={tasks} setTasks={setTasks} />
      <SummaryPanel tasks={tasks} project={project} />
    </div>
  );
}
