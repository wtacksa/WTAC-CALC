
'use client';
import { useState } from 'react';
import type { Task } from '@/lib/types';

export default function TaskTable({tasks, setTasks}:{tasks: Task[], setTasks:(t: Task[])=>void}){
  const [name, setName] = useState('');
  const [occ, setOcc] = useState<number>(1);
  const [mins, setMins] = useState<number>(5);

  const add = () => {
    const task: Task = { id: crypto.randomUUID(), project_id: tasks[0]?.project_id ?? 'temp', name, occurrences: occ, minutes_per_occurrence: mins };
    setTasks([...tasks, task]);
    setName(''); setOcc(1); setMins(5);
  };

  const update = (id: string, field: keyof Task, value: any) => {
    setTasks(tasks.map(t => t.id === id ? {...t, [field]: value} : t));
  };
  const remove = (id: string) => setTasks(tasks.filter(t => t.id !== id));

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-semibold">Tasks</h3>
      </div>
      <table className="table">
        <thead>
          <tr>
            <th>Task</th>
            <th>Occurrences</th>
            <th>Minutes / Occurrence</th>
            <th>Hours</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {tasks.map(t => (
            <tr key={t.id}>
              <td><input className="input" value={t.name} onChange={e=>update(t.id, 'name', e.target.value)} /></td>
              <td><input type="number" className="input" value={t.occurrences} onChange={e=>update(t.id, 'occurrences', Number(e.target.value))}/></td>
              <td><input type="number" className="input" value={t.minutes_per_occurrence} onChange={e=>update(t.id, 'minutes_per_occurrence', Number(e.target.value))}/></td>
              <td className="text-gray-700">{((t.occurrences * t.minutes_per_occurrence)/60).toFixed(2)}</td>
              <td><button className="btn btn-ghost" onClick={()=>remove(t.id)}>Delete</button></td>
            </tr>
          ))}
          <tr>
            <td><input placeholder="New task name" className="input" value={name} onChange={e=>setName(e.target.value)} /></td>
            <td><input type="number" className="input" value={occ} onChange={e=>setOcc(Number(e.target.value))}/></td>
            <td><input type="number" className="input" value={mins} onChange={e=>setMins(Number(e.target.value))}/></td>
            <td></td>
            <td><button className="btn btn-primary" onClick={add}>Add</button></td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
