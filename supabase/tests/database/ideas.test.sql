begin;

select plan(28);

select has_type('public', 'idea_status', 'idea lifecycle enum exists');
select enum_has_labels(
  'public',
  'idea_status',
  array['draft', 'published', 'funding', 'funded', 'in_progress', 'completed', 'cancelled'],
  'idea lifecycle states are explicit and ordered'
);
select has_type('public', 'idea_media_kind', 'idea media kind enum exists');
select enum_has_labels(
  'public',
  'idea_media_kind',
  array['image', 'video'],
  'idea media kinds are constrained'
);

select has_table('public', 'categories', 'categories table exists');
select columns_are(
  'public',
  'categories',
  array['id', 'slug', 'name', 'description', 'created_at'],
  'categories exposes the expected columns'
);
select has_table('public', 'ideas', 'ideas table exists');
select columns_are(
  'public',
  'ideas',
  array[
    'id',
    'creator_id',
    'category_id',
    'slug',
    'title',
    'summary',
    'description',
    'status',
    'published_at',
    'created_at',
    'updated_at',
    'threat_scenario',
    'control_boundary',
    'proof_required'
  ],
  'ideas exposes the expected columns'
);
select has_table('public', 'idea_media', 'idea media table exists');
select columns_are(
  'public',
  'idea_media',
  array['id', 'idea_id', 'kind', 'url', 'alt_text', 'sort_order', 'created_at'],
  'idea media exposes the expected columns'
);

select col_is_fk('public', 'ideas', 'creator_id', 'ideas reference creator profiles');
select col_is_fk('public', 'ideas', 'category_id', 'ideas reference categories');
select col_is_fk('public', 'idea_media', 'idea_id', 'media references ideas');
select ok(
  (select relrowsecurity from pg_class where oid = 'public.categories'::regclass),
  'categories use row-level security'
);
select ok(
  (select relrowsecurity from pg_class where oid = 'public.ideas'::regclass),
  'ideas use row-level security'
);
select ok(
  (select relrowsecurity from pg_class where oid = 'public.idea_media'::regclass),
  'idea media uses row-level security'
);
select ok(
  exists(
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'ideas'
      and policyname = 'Published ideas are viewable by everyone'
      and cmd = 'SELECT'
  ),
  'published idea read policy exists'
);
select ok(
  exists(
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'ideas'
      and policyname = 'Creators can create ideas'
      and cmd = 'INSERT'
  ),
  'creator idea insert policy exists'
);
select ok(
  exists(
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'ideas'
      and policyname = 'Creators can update their ideas'
      and cmd = 'UPDATE'
  ),
  'creator idea update policy exists'
);
select ok(
  exists(
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'idea_media'
      and policyname = 'Published idea media is viewable by everyone'
      and cmd = 'SELECT'
  ),
  'published idea media read policy exists'
);

insert into auth.users (
  id, instance_id, aud, role, email, encrypted_password, email_confirmed_at,
  raw_app_meta_data, raw_user_meta_data, created_at, updated_at
)
values
  (
    '11111111-1111-4111-8111-111111111111',
    '00000000-0000-0000-0000-000000000000',
    'authenticated', 'authenticated', 'creator@example.com', '', now(),
    '{"provider":"email","providers":["email"]}'::jsonb,
    '{"full_name":"Idea Creator"}'::jsonb, now(), now()
  ),
  (
    '22222222-2222-4222-8222-222222222222',
    '00000000-0000-0000-0000-000000000000',
    'authenticated', 'authenticated', 'other@example.com', '', now(),
    '{"provider":"email","providers":["email"]}'::jsonb,
    '{"full_name":"Other Member"}'::jsonb, now(), now()
  );

insert into public.ideas (
  id, creator_id, category_id, slug, title, summary, description
)
values (
  'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
  '11111111-1111-4111-8111-111111111111',
  (select id from public.categories where slug = 'technology'),
  'analytical-engine',
  'The Analytical Engine',
  'A general-purpose mechanical computer.',
  'A programmable machine powered by punched cards.'
);

insert into public.ideas (
  id, creator_id, category_id, slug, title, summary, description, status, published_at
)
values (
  'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb',
  '11111111-1111-4111-8111-111111111111',
  (select id from public.categories where slug = 'technology'),
  'difference-engine',
  'The Difference Engine',
  'A machine for tabulating polynomial functions.',
  'Making mathematical tables more reliable.',
  'published',
  now()
);

select is(
  (select status::text from public.ideas where id = 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa'),
  'draft',
  'new ideas default to draft'
);
select is(
  (
    select count(*)
    from public.ideas
    where id = 'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb'
      and status = 'published'
  ),
  1::bigint,
  'published lifecycle state is stored'
);

insert into public.idea_media (idea_id, kind, url, alt_text, sort_order)
values
  (
    'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
    'image',
    'https://example.com/draft.png',
    'Draft engine plans',
    0
  ),
  (
    'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb',
    'video',
    'https://example.com/demo.mp4',
    'Published engine demonstration',
    0
  );

set local role anon;
select is(
  (select count(*) from public.categories),
  6::bigint,
  'anonymous visitors can read categories'
);
select is(
  (
    select count(*)
    from public.ideas
    where id in (
      'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
      'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb'
    )
  ),
  1::bigint,
  'anonymous visitors see published ideas but not drafts'
);
select is(
  (
    select count(*)
    from public.idea_media
    where idea_id in (
      'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
      'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb'
    )
  ),
  1::bigint,
  'anonymous visitors see media only for published ideas'
);
reset role;

set local role authenticated;
set local "request.jwt.claim.sub" = '11111111-1111-4111-8111-111111111111';
select is(
  (
    select count(*)
    from public.ideas
    where id in (
      'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
      'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb'
    )
  ),
  2::bigint,
  'creators can read their own drafts alongside published ideas'
);
update public.ideas
set title = 'Ada Lovelace Analytical Engine'
where id = 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa';
select is(
  (select title from public.ideas where id = 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa'),
  'Ada Lovelace Analytical Engine',
  'creators can update their own ideas'
);

set local "request.jwt.claim.sub" = '22222222-2222-4222-8222-222222222222';
update public.ideas
set title = 'Unauthorized edit'
where id = 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa';
reset role;
select is(
  (select title from public.ideas where id = 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa'),
  'Ada Lovelace Analytical Engine',
  'other members cannot update a creator draft'
);

select * from finish();
rollback;
