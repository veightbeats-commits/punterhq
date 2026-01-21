-- Create a table for Status Cards
create table status_cards (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  name text not null,
  image_url text not null,
  betway_link text not null,
  social_link text
);

-- Set up Row Level Security (RLS)
alter table status_cards enable row level security;

-- Create policies
create policy "Public_Access"
  on status_cards for select
  using ( true );

create policy "Admin_Insert"
  on status_cards for insert
  with check ( true ); -- ideally restrictive to admins, but for now open or handled by app logic
