
'use client';
import { computeSummary, round } from '@/lib/calc';
import type { Task, Project } from '@/lib/types';

export default function SummaryPanel({tasks, project}:{tasks: Task[], project: Project}){
  const s = computeSummary(tasks, project);
  return (
    <div className="card">
      <h3 className="text-lg font-semibold mb-2">Results</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Stat label="Total minutes" value={round(s.totalMinutes)} />
        <Stat label="Total hours" value={round(s.totalHours)} />
        <Stat label="Required FTE" value={round(s.requiredFTE)} />
        <Stat label="Gap (FTE)" value={round(s.gap)} />
      </div>
      <p className="text-sm text-gray-600 mt-3">Formula: Required FTE = Total hours ÷ (Hours per FTE × Utilization)</p>
    </div>
  );
}

function Stat({label, value}:{label:string, value:number|string}){
  return (
    <div className="p-4 border rounded-xl bg-gray-50">
      <div className="text-xs text-gray-500">{label}</div>
      <div className="text-xl font-semibold">{value}</div>
    </div>
  );
}
