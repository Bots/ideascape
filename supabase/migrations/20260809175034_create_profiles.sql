create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  username text not null unique,
  display_name text not null,
  bio text,
  avatar_url text,
  website text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  constraint profiles_username_format check (
    username ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'
    and char_length(username) between 3 and 40
  ),
  constraint profiles_display_name_length check (
    char_length(display_name) between 1 and 80
  ),
  constraint profiles_bio_length check (
    bio is null or char_length(bio) <= 500
  ),
  constraint profiles_avatar_url_length check (
    avatar_url is null or char_length(avatar_url) <= 2048
  ),
  constraint profiles_website_length check (
    website is null or char_length(website) <= 2048
  )
);

comment on table public.profiles is
  'Public creator and community-member profiles linked one-to-one with auth users.';

create function public.profile_username(
  user_id uuid,
  email text,
  metadata jsonb
)
returns text
language sql
immutable
set search_path = ''
as $$
  select
    left(
      coalesce(
        nullif(
          trim(
            both '-'
            from regexp_replace(
              lower(
                coalesce(
                  metadata ->> 'user_name',
                  metadata ->> 'preferred_username',
                  split_part(email, '@', 1),
                  'member'
                )
              ),
              '[^a-z0-9]+',
              '-',
              'g'
            )
          ),
          ''
        ),
        'member'
      ),
      31
    ) || '-' || left(replace(user_id::text, '-', ''), 8);
$$;

revoke all on function public.profile_username(uuid, text, jsonb) from public;

create function public.handle_new_user_profile()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (
    id,
    username,
    display_name,
    avatar_url
  )
  values (
    new.id,
    public.profile_username(new.id, new.email, new.raw_user_meta_data),
    left(
      coalesce(
        nullif(trim(new.raw_user_meta_data ->> 'full_name'), ''),
        nullif(trim(new.raw_user_meta_data ->> 'name'), ''),
        nullif(trim(new.raw_user_meta_data ->> 'user_name'), ''),
        nullif(split_part(new.email, '@', 1), ''),
        'Ideascape member'
      ),
      80
    ),
    coalesce(
      nullif(new.raw_user_meta_data ->> 'avatar_url', ''),
      nullif(new.raw_user_meta_data ->> 'picture', '')
    )
  )
  on conflict (id) do nothing;

  return new;
end;
$$;

revoke all on function public.handle_new_user_profile() from public;

create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user_profile();

insert into public.profiles (
  id,
  username,
  display_name,
  avatar_url
)
select
  users.id,
  public.profile_username(users.id, users.email, users.raw_user_meta_data),
  left(
    coalesce(
      nullif(trim(users.raw_user_meta_data ->> 'full_name'), ''),
      nullif(trim(users.raw_user_meta_data ->> 'name'), ''),
      nullif(trim(users.raw_user_meta_data ->> 'user_name'), ''),
      nullif(split_part(users.email, '@', 1), ''),
      'Ideascape member'
    ),
    80
  ),
  coalesce(
    nullif(users.raw_user_meta_data ->> 'avatar_url', ''),
    nullif(users.raw_user_meta_data ->> 'picture', '')
  )
from auth.users as users
on conflict (id) do nothing;

create function public.set_profile_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

revoke all on function public.set_profile_updated_at() from public;

create trigger set_profiles_updated_at
before update on public.profiles
for each row execute function public.set_profile_updated_at();

alter table public.profiles enable row level security;

create policy "Public profiles are viewable by everyone"
on public.profiles
for select
to anon, authenticated
using (true);

create policy "Users can update their own profile"
on public.profiles
for update
to authenticated
using ((select auth.uid()) = id)
with check ((select auth.uid()) = id);

revoke all on table public.profiles from anon, authenticated;
grant select on table public.profiles to anon, authenticated;
grant update (username, display_name, bio, avatar_url, website)
on table public.profiles
to authenticated;
