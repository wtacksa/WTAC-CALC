-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Projects table
create table if not exists public.projects (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null,
  name text not null,
  period text not null default 'month',
  hours_per_fte numeric not null default 160,
  utilization numeric not null default 0.85,
  current_staff numeric not null default 0,
  notes text,
  created_at timestamptz default now()
);

-- Tasks table
create table if not exists public.tasks (
  id uuid primary key default uuid_generate_v4(),
  project_id uuid not null references public.projects(id) on delete cascade,
  name text not null,
  occurrences integer not null default 0,
  minutes_per_occurrence numeric not null default 0
);

-- RLS
alter table public.projects enable row level security;
alter table public.tasks enable row level security;

-- Policy: users can manage only their projects
drop policy if exists "p_select_projects" on public.projects;
drop policy if exists "p_modify_projects" on public.projects;
create policy "p_select_projects" on public.projects
  for select using ( auth.uid() = user_id );
create policy "p_modify_projects" on public.projects
  using ( auth.uid() = user_id )
  with check ( auth.uid() = user_id );

-- Policy: access tasks of own projects
drop policy if exists "t_select" on public.tasks;
drop policy if exists "t_modify" on public.tasks;
create policy "t_select" on public.tasks
  for select using ( exists (select 1 from public.projects p where p.id = tasks.project_id and p.user_id = auth.uid()) );
create policy "t_modify" on public.tasks
  using ( exists (select 1 from public.projects p where p.id = tasks.project_id and p.user_id = auth.uid()) )
  with check ( exists (select 1 from public.projects p where p.id = tasks.project_id and p.user_id = auth.uid()) );