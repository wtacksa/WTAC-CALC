
'use client';
import jsPDF from 'jspdf';
import * as XLSX from 'xlsx';
import { round } from '@/lib/calc';
import type { Task, Project } from '@/lib/types';

export default function ExportButtons({tasks, project}:{tasks: Task[], project: Project}){

  const exportPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(14);
    doc.text('WTAC Workforce Calculator - Report', 14, 16);
    doc.setFontSize(10);
    doc.text(`Project: ${project.name}`, 14, 24);
    doc.text(`Period: ${project.period} | Hours/FTE: ${project.hours_per_fte} | Utilization: ${project.utilization}`, 14, 30);
    doc.text(`Current staff: ${project.current_staff}`, 14, 36);

    let y = 46;
    doc.text('Tasks:', 14, y); y+=6;
    tasks.forEach((t, i) => {
      doc.text(`${i+1}. ${t.name} – Occ: ${t.occurrences}, Min/Occ: ${t.minutes_per_occurrence}, Hours: ${round((t.occurrences*t.minutes_per_occurrence)/60)}`, 14, y);
      y += 6;
      if (y > 270) { doc.addPage(); y = 20; }
    });

    const totalMinutes = tasks.reduce((a,t)=>a+(t.occurrences*t.minutes_per_occurrence),0);
    const totalHours = totalMinutes/60;
    const reqFTE = totalHours / (project.hours_per_fte * project.utilization || 1);
    const gap = reqFTE - (project.current_staff || 0);

    y += 6;
    doc.text(`Total minutes: ${round(totalMinutes)} | Total hours: ${round(totalHours)}`, 14, y); y+=6;
    doc.text(`Required FTE: ${round(reqFTE)} | Gap: ${round(gap)}`, 14, y);

    doc.save(`${project.name.replace(/\s+/g,'_')}_report.pdf`);
  };

  const exportExcel = () => {
    const rows = tasks.map(t => ({
      task_name: t.name,
      occurrences: t.occurrences,
      minutes_per_occurrence: t.minutes_per_occurrence,
      hours: round((t.occurrences*t.minutes_per_occurrence)/60)
    }));
    const ws1 = XLSX.utils.json_to_sheet(rows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws1, 'Tasks');

    const totalMinutes = tasks.reduce((a,t)=>a+(t.occurrences*t.minutes_per_occurrence),0);
    const totalHours = totalMinutes/60;
    const reqFTE = totalHours / (project.hours_per_fte * project.utilization || 1);
    const gap = reqFTE - (project.current_staff || 0);
    const summary = [
      ['Project', project.name],
      ['Period', project.period],
      ['Hours per FTE', project.hours_per_fte],
      ['Utilization', project.utilization],
      ['Current staff', project.current_staff],
      ['Total minutes', round(totalMinutes)],
      ['Total hours', round(totalHours)],
      ['Required FTE', round(reqFTE)],
      ['Gap', round(gap)]
    ];
    const ws2 = XLSX.utils.aoa_to_sheet(summary);
    XLSX.utils.book_append_sheet(wb, ws2, 'Summary');
    XLSX.writeFile(wb, `${project.name.replace(/\s+/g,'_')}_report.xlsx`);
  };

  return (
    <div className="flex gap-3">
      <button className="btn btn-ghost" onClick={exportExcel}>Export Excel</button>
      <button className="btn btn-primary" onClick={exportPDF}>Export PDF</button>
    </div>
  );
}
