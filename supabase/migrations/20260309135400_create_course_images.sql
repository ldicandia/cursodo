-- Create a public bucket for course images
insert into storage.buckets (id, name, public) 
values ('course-images', 'course-images', true)
on conflict (id) do nothing;



-- Allow public read access on the "course-images" bucket
create policy 'Public read access for course images'
  on storage.objects for select
  using ( bucket_id = 'course-images' );

-- Allow authenticated "dentist" users to insert into the "course-images" bucket
create policy 'Instructors can upload course images'
  on storage.objects for insert
  with check (
    auth.role() = 'authenticated' and
    bucket_id = 'course-images' and
    exists (select 1 from public.profiles where id = auth.uid() and role = 'dentist')
  );

-- Allow instructors to update their own images
create policy 'Instructors can update own course images'
  on storage.objects for update
  using (
    auth.role() = 'authenticated' and
    bucket_id = 'course-images' and
    owner = auth.uid()
  );

-- Allow instructors to delete their own images
create policy 'Instructors can delete own course images'
  on storage.objects for delete
  using (
    auth.role() = 'authenticated' and
    bucket_id = 'course-images' and
    owner = auth.uid()
  );
