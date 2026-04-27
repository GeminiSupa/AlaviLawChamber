-- Updated Schema for Alavi Law Chamber (v2)

-- 1. Team Members Table
create table if not exists team_members (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  role text not null,
  image_url text,
  bio text,
  display_order int default 0,
  created_at timestamptz default now()
);

-- 2. Blog Posts Table
create table if not exists blogs (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  slug text unique not null,
  excerpt text,
  content text not null,
  cover_image text,
  author_name text default 'Alavi Law Chamber',
  author_id uuid references auth.users(id),
  published_at timestamptz default now(),
  published bool default false,
  created_at timestamptz default now()
);

-- 3. Gallery Table
create table if not exists gallery (
  id uuid default gen_random_uuid() primary key,
  title text,
  image_url text not null,
  category text,
  created_at timestamptz default now()
);

-- 4. Testimonials (Enhanced)
-- Table contact_submissions already exists, but these are specifically for display
create table if not exists public_testimonials (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  role text,
  testimonial text not null,
  stars int default 5,
  is_featured bool default true,
  created_at timestamptz default now()
);

-- Enable RLS on all new tables
alter table team_members enable row level security;
alter table blogs enable row level security;
alter table gallery enable row level security;
alter table public_testimonials enable row level security;

-- Policies: Everyone can read
drop policy if exists "Allow public read team" on team_members;
create policy "Allow public read team" on team_members for select using (true);

drop policy if exists "Allow public read blogs" on blogs;
create policy "Allow public read blogs" on blogs for select using (true);

drop policy if exists "Allow public read gallery" on gallery;
create policy "Allow public read gallery" on gallery for select using (true);

drop policy if exists "Allow public read testimonials" on public_testimonials;
create policy "Allow public read testimonials" on public_testimonials for select using (true);

-- Policies: Only authenticated admins can write
drop policy if exists "Allow admin crud team" on team_members;
create policy "Allow admin crud team" on team_members for all using (auth.role() = 'authenticated');

drop policy if exists "Allow admin crud blogs" on blogs;
create policy "Allow admin crud blogs" on blogs for all using (auth.role() = 'authenticated');

drop policy if exists "Allow admin crud gallery" on gallery;
create policy "Allow admin crud gallery" on gallery for all using (auth.role() = 'authenticated');

drop policy if exists "Allow admin crud testimonials" on public_testimonials;
create policy "Allow admin crud testimonials" on public_testimonials for all using (auth.role() = 'authenticated');

-- 5. Storage Policies (Run after creating 'website_assets' bucket in UI)
-- Allow public reading of all assets
drop policy if exists "Public Access" on storage.objects;
create policy "Public Access" on storage.objects for select using ( bucket_id = 'website_assets' );

-- Allow authenticated admins to upload/delete
drop policy if exists "Admin Upload" on storage.objects;
create policy "Admin Upload" on storage.objects for insert with check ( bucket_id = 'website_assets' AND auth.role() = 'authenticated' );

drop policy if exists "Admin Update" on storage.objects;
create policy "Admin Update" on storage.objects for update with check ( bucket_id = 'website_assets' AND auth.role() = 'authenticated' );

drop policy if exists "Admin Delete" on storage.objects;
create policy "Admin Delete" on storage.objects for delete using ( bucket_id = 'website_assets' AND auth.role() = 'authenticated' );


