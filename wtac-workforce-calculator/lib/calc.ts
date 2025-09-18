
import { Task, Project, Summary } from './types';

export function computeSummary(tasks: Task[], project: Pick<Project, 'hours_per_fte' | 'utilization' | 'current_staff'>): Summary {
  const totalMinutes = tasks.reduce((acc, t) => acc + (t.occurrences * t.minutes_per_occurrence), 0);
  const totalHours = totalMinutes / 60;
  const denom = Math.max(0.0001, project.hours_per_fte * project.utilization);
  const requiredFTE = totalHours / denom;
  const gap = requiredFTE - (project.current_staff || 0);
  return {
    totalMinutes,
    totalHours,
    requiredFTE,
    gap
  };
}

export function round(n: number, d = 2){ return Math.round(n * (10**d)) / (10**d); }
