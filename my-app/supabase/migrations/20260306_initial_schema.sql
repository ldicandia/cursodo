-- Create profiles table
create table public.profiles (
  id uuid references auth.users on delete cascade not null primary key,
  role text check (role in ('dentist', 'student')) default 'student'::text,
  name text,
  bio text,
  avatar_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create courses table
create table public.courses (
  id uuid default gen_random_uuid() primary key,
  instructor_id uuid references public.profiles(id) on delete cascade not null,
  title text not null,
  description text not null,
  date timestamp with time zone not null,
  price numeric not null,
  max_students integer not null,
  image_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create enrollments table
create table public.enrollments (
  course_id uuid references public.courses(id) on delete cascade not null,
  student_id uuid references public.profiles(id) on delete cascade not null,
  payment_status text check (payment_status in ('pending', 'completed')) default 'pending'::text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  primary key (course_id, student_id)
);

-- Enable RLS
alter table public.profiles enable row level security;
alter table public.courses enable row level security;
alter table public.enrollments enable row level security;

-- Profiles Policies
create policy "Public profiles are viewable by everyone."
  on profiles for select
  using ( true );

create policy "Users can insert their own profile."
  on profiles for insert
  with check ( auth.uid() = id );

create policy "Users can update own profile."
  on profiles for update
  using ( auth.uid() = id );

-- Courses Policies
create policy "Courses are viewable by everyone."
  on courses for select
  using ( true );

create policy "Instructors can insert courses."
  on courses for insert
  with check ( 
    auth.uid() = instructor_id and 
    exists (select 1 from profiles where id = auth.uid() and role = 'dentist')
  );

create policy "Instructors can update their own courses."
  on courses for update
  using ( auth.uid() = instructor_id );

create policy "Instructors can delete their own courses."
  on courses for delete
  using ( auth.uid() = instructor_id );

-- Enrollments Policies
create policy "Instructors can view enrollments for their courses, students can view their own."
  on enrollments for select
  using ( 
    auth.uid() = student_id or 
    exists (select 1 from courses where id = course_id and instructor_id = auth.uid())
  );

create policy "Students can enroll in courses."
  on enrollments for insert
  with check ( auth.uid() = student_id );

create policy "Students can delete their own enrollments."
  on enrollments for delete
  using ( auth.uid() = student_id );
