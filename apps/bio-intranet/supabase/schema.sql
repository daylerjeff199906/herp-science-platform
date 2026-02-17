-- 1. Create Profiles Table (Linked to Auth)
create table public.profiles (
  id uuid references auth.users on delete cascade not null primary key,
  first_name text,
  last_name text,
  email text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Create Trigger to Auto-create Profile on Sign Up
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, first_name, last_name, email)
  values (
    new.id, 
    new.raw_user_meta_data->>'first_name', 
    new.raw_user_meta_data->>'last_name', 
    new.email
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- 3. Create Academic Profiles Table (For Onboarding)
create table public.academic_profiles (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  institution text,
  degree text,
  field_of_study text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);