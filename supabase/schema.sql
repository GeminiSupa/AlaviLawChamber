-- Run this in your Supabase SQL Editor
-- Table: contact_submissions

create table if not exists contact_submissions (
  id uuid default gen_random_uuid() primary key,
  full_name text not null,
  email text not null,
  phone text,
  subject text,
  message text not null,
  created_at timestamptz default now()
);

-- Enable Row Level Security
alter table contact_submissions enable row level security;

-- Allow inserts from anonymous users (public contact form)
create policy "Allow public insert" on contact_submissions
  for insert
  with check (true);

-- Only authenticated users (admins) can read submissions
create policy "Allow authenticated read" on contact_submissions
  for select
  using (auth.role() = 'authenticated');
