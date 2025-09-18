
'use client';
import Papa from 'papaparse';
import type { Task } from '@/lib/types';

export default function UploadCsv({onLoad}:{onLoad:(rows: Task[])=>void}){
  const parse = (file: File) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (res) => {
        const rows: Task[] = (res.data as any[]).map((r:any)=> ({
          id: crypto.randomUUID(),
          project_id: 'temp',
          name: String(r['task_name'] ?? r['name'] ?? ''),
          occurrences: Number(r['occurrences'] ?? r['count'] ?? 0),
          minutes_per_occurrence: Number(r['minutes_per_occurrence'] ?? r['minutes'] ?? 0)
        }));
        onLoad(rows);
      }
    });
  };
  return (
    <div className="card">
      <h3 className="text-lg font-semibold mb-2">Import from CSV</h3>
      <p className="text-sm text-gray-600 mb-2">Columns: task_name, occurrences, minutes_per_occurrence</p>
      <input type="file" accept=".csv" onChange={e=> e.target.files && parse(e.target.files[0])} />
    </div>
  );
}
