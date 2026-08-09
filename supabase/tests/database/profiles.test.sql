begin;

select plan(16);

select has_table('public', 'profiles', 'profiles table exists');
select columns_are(
  'public',
  'profiles',
  array[
    'id',
    'username',
    'display_name',
    'bio',
    'avatar_url',
    'website',
    'created_at',
    'updated_at'
  ],
  'profiles exposes the expected columns'
);
select col_is_pk('public', 'profiles', 'id', 'profile id is the primary key');
select col_is_fk('public', 'profiles', 'id', 'profile id references auth.users');
select col_is_unique('public', 'profiles', 'username', 'profile usernames are unique');
select col_not_null('public', 'profiles', 'username', 'username is required');
select col_not_null('public', 'profiles', 'display_name', 'display name is required');

select ok(
  (select relrowsecurity from pg_class where oid = 'public.profiles'::regclass),
  'row-level security is enabled'
);
select ok(
  exists(
    select 1
    from pg_policies
    where schemaname = 'public'
      and tablename = 'profiles'
      and policyname = 'Public profiles are viewable by everyone'
      and cmd = 'SELECT'
  ),
  'public read policy exists'
);
select ok(
  exists(
    select 1
    from pg_policies
    where schemaname = 'public'
      and tablename = 'profiles'
      and policyname = 'Users can update their own profile'
      and cmd = 'UPDATE'
  ),
  'owner update policy exists'
);
select ok(
  exists(
    select 1
    from information_schema.triggers
    where event_object_schema = 'auth'
      and event_object_table = 'users'
      and trigger_name = 'on_auth_user_created'
  ),
  'new-user profile trigger exists'
);

insert into auth.users (
  id,
  instance_id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  raw_app_meta_data,
  raw_user_meta_data,
  created_at,
  updated_at
)
values (
  '11111111-1111-4111-8111-111111111111',
  '00000000-0000-0000-0000-000000000000',
  'authenticated',
  'authenticated',
  'Ada.Lovelace@example.com',
  '',
  now(),
  '{"provider":"email","providers":["email"]}'::jsonb,
  '{"full_name":"Ada Lovelace"}'::jsonb,
  now(),
  now()
);

select is(
  (select display_name from public.profiles where id = '11111111-1111-4111-8111-111111111111'),
  'Ada Lovelace',
  'creating an auth user creates a profile with its display name'
);
select matches(
  (select username from public.profiles where id = '11111111-1111-4111-8111-111111111111'),
  '^ada-lovelace-[0-9a-f]{8}$',
  'generated usernames are URL-safe and collision-resistant'
);

set local role anon;
select is(
  (
    select count(*)
    from public.profiles
    where id = '11111111-1111-4111-8111-111111111111'
  ),
  1::bigint,
  'anonymous visitors can read public profiles'
);
reset role;

set local role authenticated;
set local "request.jwt.claim.sub" = '11111111-1111-4111-8111-111111111111';
update public.profiles
set display_name = 'Ada, Countess of Lovelace'
where id = '11111111-1111-4111-8111-111111111111';
select is(
  (select display_name from public.profiles where id = '11111111-1111-4111-8111-111111111111'),
  'Ada, Countess of Lovelace',
  'authenticated users can update their own profile'
);

set local "request.jwt.claim.sub" = '22222222-2222-4222-8222-222222222222';
update public.profiles
set display_name = 'Unauthorized edit'
where id = '11111111-1111-4111-8111-111111111111';
select is(
  (select display_name from public.profiles where id = '11111111-1111-4111-8111-111111111111'),
  'Ada, Countess of Lovelace',
  'authenticated users cannot update another profile'
);
reset role;

select * from finish();
rollback;
