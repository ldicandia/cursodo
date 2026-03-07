DO $$
DECLARE
  elena_id uuid := '11111111-1111-1111-1111-111111111111';
  javier_id uuid := '22222222-2222-2222-2222-222222222222';
  sarah_id uuid := '33333333-3333-3333-3333-333333333333';
  ahmed_id uuid := '44444444-4444-4444-4444-444444444444';
  michael_id uuid := '55555555-5555-5555-5555-555555555555';
BEGIN
  -- Insert into auth.users
  INSERT INTO auth.users (instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, recovery_sent_at, last_sign_in_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at, confirmation_token, email_change, email_change_token_new, recovery_token)
  VALUES 
  ('00000000-0000-0000-0000-000000000000', elena_id, 'authenticated', 'authenticated', 'elena@example.com', crypt('password123', gen_salt('bf')), now(), now(), now(), '{"provider":"email","providers":["email"]}', '{}', now(), now(), '', '', '', ''),
  ('00000000-0000-0000-0000-000000000000', javier_id, 'authenticated', 'authenticated', 'javier@example.com', crypt('password123', gen_salt('bf')), now(), now(), now(), '{"provider":"email","providers":["email"]}', '{}', now(), now(), '', '', '', ''),
  ('00000000-0000-0000-0000-000000000000', sarah_id, 'authenticated', 'authenticated', 'sarah@example.com', crypt('password123', gen_salt('bf')), now(), now(), now(), '{"provider":"email","providers":["email"]}', '{}', now(), now(), '', '', '', ''),
  ('00000000-0000-0000-0000-000000000000', ahmed_id, 'authenticated', 'authenticated', 'ahmed@example.com', crypt('password123', gen_salt('bf')), now(), now(), now(), '{"provider":"email","providers":["email"]}', '{}', now(), now(), '', '', '', ''),
  ('00000000-0000-0000-0000-000000000000', michael_id, 'authenticated', 'authenticated', 'michael@example.com', crypt('password123', gen_salt('bf')), now(), now(), now(), '{"provider":"email","providers":["email"]}', '{}', now(), now(), '', '', '', '')
  ON CONFLICT (id) DO NOTHING;

  -- Insert profiles
  INSERT INTO public.profiles (id, role, name, bio, avatar_url) VALUES 
  (elena_id, 'dentist', 'Dr. Elena Smith', 'Specialist in Endodontics with 15+ years of clinical experience and international speaker. Dedicated to evidence-based practice and teaching.', null),
  (javier_id, 'dentist', 'Dr. Javier Gomez', 'Expert in aesthetic dentistry and composite restorations.', null),
  (sarah_id, 'dentist', 'Dr. Sarah Chen', 'Pioneer in digital workflow and implantology.', null),
  (ahmed_id, 'dentist', 'Dr. Ahmed Hassan', 'Pediatric dentist focusing on behavioral management.', null),
  (michael_id, 'dentist', 'Dr. Michael Rossi', 'Oral surgeon specializing in extractions and grafting.', null)
  ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, bio = EXCLUDED.bio;

  -- Insert courses
  INSERT INTO public.courses (id, instructor_id, title, description, date, price, max_students, image_url) VALUES 
  ('1cb8b0e7-3f33-4fec-a059-e93540a5a3a1', elena_id, 'Advanced Endodontics Masterclass: Rotary Instruments', 'Dive deep into modern endodontic techniques. This comprehensive masterclass covers everything from diagnosis to 3D obturation using the latest rotary files. You will learn protocols for safe, efficient, and predictable root canal treatments. The course includes hands-on practice on 3D printed teeth and live patient demonstrations.', current_date + interval '1 month', 499, 20, 'https://images.unsplash.com/photo-1606811841689-23dfddce3e95?auto=format&fit=crop&w=1200&q=80'),
  ('2cb8b0e7-3f33-4fec-a059-e93540a5a3a2', javier_id, 'Aesthetic Composite Restorations from A to Z', 'Learn the secrets of aesthetic composite restorations. From shade matching to final polish.', current_date + interval '15 days', 299, 30, 'https://images.unsplash.com/photo-1598256330419-db2468acb204?auto=format&fit=crop&w=800&q=80'),
  ('3cb8b0e7-3f33-4fec-a059-e93540a5a3a3', sarah_id, 'Digital Workflow in Implantology', 'Comprehensive guide to guided surgery and digital planning.', current_date + interval '25 days', 899, 15, 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&w=800&q=80'),
  ('4cb8b0e7-3f33-4fec-a059-e93540a5a3a4', ahmed_id, 'Pediatric Dentistry: Behavioral Management', 'Techniques for managing anxious children in the dental chair.', current_date + interval '2 months', 350, 25, 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=800&q=80'),
  ('5cb8b0e7-3f33-4fec-a059-e93540a5a3a5', michael_id, 'Surgical Extractions and Bone Grafting', 'Step-by-step surgical techniques for difficult extractions and socket preservation.', current_date + interval '3 months', 600, 12, 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=800&q=80')
  ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, description = EXCLUDED.description, date = EXCLUDED.date, instructor_id = EXCLUDED.instructor_id, image_url = EXCLUDED.image_url;

END $$;
