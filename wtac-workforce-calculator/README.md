
# WTAC Workforce Calculator (MVP)

A minimal SaaS to estimate staffing needs (FTE) from task volumes and time.

## Features
- Sign up / login (Supabase Auth).
- Create projects, add tasks manually or import CSV.
- Real-time results (Total hours, Required FTE, Gap vs current).
- Export to **PDF** and **Excel**.
- WordPress shortcode plugin to embed the app anywhere: `[wtac_calculator url="https://YOUR-DEPLOYED-APP.com"]`.

## Quick Start

### 1) Create Supabase project
- Go to supabase.com → New project.
- Copy the **Project URL** and **anon public API key**.

Run the SQL below in Supabase → SQL Editor:

```sql

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

```

### 2) Configure environment
Create `.env.local` in this repo:
```
NEXT_PUBLIC_SUPABASE_URL=YOUR_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY
```

### 3) Install & run (locally)
```
npm install
npm run dev
```
Open http://localhost:3000

### 4) Deploy
- Recommended: **Vercel**. Connect the repo and add the two env vars.
- Or any Node host that supports Next.js 14.

### 5) WordPress embed (MVP)
- Zip the `wordpress-plugin/wtac-workforce-calculator-embed` folder and upload it to WP → Plugins → Add New → Upload.
- Use the shortcode in a page or post:
```
[wtac_calculator url="https://your-app-url.vercel.app"]
```
- If `url` is omitted, it will use the default defined in the plugin.

### CSV format
See `templates/tasks_template.csv`:
```
task_name,occurrences,minutes_per_occurrence
Issue driving license,200,8
Verify documents,120,5
Counter service,80,7
```

### Notes
- Calculations: `Required FTE = Total hours ÷ (Hours per FTE × Utilization)`.
- You can tweak defaults on the project page.
- This is an MVP: data model and code are ready for extension (dashboards, roles, subscriptions, etc.).
