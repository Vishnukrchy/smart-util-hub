
-- Create a table to store user profiles
create table public.profiles (
  id uuid not null primary key references auth.users(id) on delete cascade,
  display_name text,
  avatar_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Automatically create a profile row on sign up
create or replace function public.handle_new_profile()
returns trigger as $$
begin
  insert into public.profiles (id)
  values (new.id);
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_profile();

-- Enable Row Level Security (RLS)
alter table public.profiles enable row level security;

-- Policy: Users can view their own profile
create policy "Users can view their profile"
  on public.profiles for select using (auth.uid() = id);

-- Policy: Users can insert/update their own profile
create policy "Users can update their profile"
  on public.profiles for update using (auth.uid() = id);
create policy "Users can insert their profile"
  on public.profiles for insert with check (auth.uid() = id);
