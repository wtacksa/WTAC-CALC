
export type Project = {
  id: string;
  user_id: string;
  name: string;
  period: 'day' | 'week' | 'month' | 'year';
  hours_per_fte: number;
  utilization: number; // 0..1
  current_staff: number;
  notes?: string | null;
  created_at?: string;
};

export type Task = {
  id: string;
  project_id: string;
  name: string;
  occurrences: number;
  minutes_per_occurrence: number;
};

export type Summary = {
  totalMinutes: number;
  totalHours: number;
  requiredFTE: number;
  gap: number;
};
