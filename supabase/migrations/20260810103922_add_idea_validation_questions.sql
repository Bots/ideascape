create type public.validation_question_status as enum ('active', 'closed');

create table public.idea_validation_questions (
  id uuid primary key default gen_random_uuid(),
  idea_id uuid not null references public.ideas (id) on delete cascade,
  prompt text not null,
  status public.validation_question_status not null default 'active',
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  constraint idea_validation_questions_prompt_length check (
    char_length(prompt) between 10 and 280
  )
);

create unique index idea_validation_questions_one_active_idx
on public.idea_validation_questions (idea_id)
where status = 'active';

create table public.idea_validation_options (
  id uuid primary key default gen_random_uuid(),
  question_id uuid not null references public.idea_validation_questions (id) on delete cascade,
  value text not null,
  label text not null,
  sort_order smallint not null default 0,
  created_at timestamptz not null default timezone('utc', now()),
  constraint idea_validation_options_value_format check (
    value ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'
    and char_length(value) between 2 and 80
  ),
  constraint idea_validation_options_label_length check (
    char_length(label) between 2 and 120
  ),
  constraint idea_validation_options_sort_order_nonnegative check (sort_order >= 0),
  constraint idea_validation_options_question_value_unique unique (question_id, value),
  constraint idea_validation_options_question_sort_unique unique (question_id, sort_order),
  constraint idea_validation_options_question_id_unique unique (question_id, id)
);

create table public.idea_validation_responses (
  question_id uuid not null references public.idea_validation_questions (id) on delete cascade,
  option_id uuid not null,
  profile_id uuid not null references public.profiles (id) on delete cascade,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  primary key (question_id, profile_id),
  constraint idea_validation_responses_question_option_fk
    foreign key (question_id, option_id)
    references public.idea_validation_options (question_id, id)
    on delete cascade
);

create index idea_validation_options_question_id_idx
on public.idea_validation_options (question_id);
create index idea_validation_responses_profile_id_idx
on public.idea_validation_responses (profile_id);
create index idea_validation_responses_option_id_idx
on public.idea_validation_responses (option_id);

comment on table public.idea_validation_questions is
  'Focused questions that test one practical assumption for a concept preview.';
comment on table public.idea_validation_options is
  'Constrained, decision-oriented answers for a focused concept validation question.';
comment on table public.idea_validation_responses is
  'Private per-member answers used to evaluate concept demand without exposing identities.';

create function public.set_validation_response_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

revoke all on function public.set_validation_response_updated_at() from public;

create trigger set_validation_questions_updated_at
before update on public.idea_validation_questions
for each row execute function public.set_validation_response_updated_at();

create trigger set_validation_responses_updated_at
before update on public.idea_validation_responses
for each row execute function public.set_validation_response_updated_at();

alter table public.idea_validation_questions enable row level security;
alter table public.idea_validation_options enable row level security;
alter table public.idea_validation_responses enable row level security;

create policy "Active validation questions are publicly readable"
on public.idea_validation_questions
for select
to anon, authenticated
using (
  exists (
    select 1
    from public.ideas
    where ideas.id = idea_validation_questions.idea_id
      and (
        (
          ideas.status = 'published'
          and idea_validation_questions.status = 'active'
        )
        or ideas.creator_id = (select auth.uid())
      )
  )
);

create policy "Active validation options are publicly readable"
on public.idea_validation_options
for select
to anon, authenticated
using (
  exists (
    select 1
    from public.idea_validation_questions
    join public.ideas
      on ideas.id = idea_validation_questions.idea_id
    where idea_validation_questions.id = idea_validation_options.question_id
      and (
        (
          ideas.status = 'published'
          and idea_validation_questions.status = 'active'
        )
        or ideas.creator_id = (select auth.uid())
      )
  )
);

create policy "Members can read their own validation responses"
on public.idea_validation_responses
for select
to authenticated
using ((select auth.uid()) = profile_id);

create policy "Members can answer active validation questions"
on public.idea_validation_responses
for insert
to authenticated
with check (
  (select auth.uid()) = profile_id
  and exists (
    select 1
    from public.idea_validation_questions
    join public.ideas
      on ideas.id = idea_validation_questions.idea_id
    where idea_validation_questions.id = idea_validation_responses.question_id
      and idea_validation_questions.status = 'active'
      and ideas.status = 'published'
  )
);

create policy "Members can update their own active validation responses"
on public.idea_validation_responses
for update
to authenticated
using ((select auth.uid()) = profile_id)
with check (
  (select auth.uid()) = profile_id
  and exists (
    select 1
    from public.idea_validation_questions
    join public.ideas
      on ideas.id = idea_validation_questions.idea_id
    where idea_validation_questions.id = idea_validation_responses.question_id
      and idea_validation_questions.status = 'active'
      and ideas.status = 'published'
  )
);

create policy "Members can remove their own validation responses"
on public.idea_validation_responses
for delete
to authenticated
using ((select auth.uid()) = profile_id);

revoke all on table public.idea_validation_questions from anon, authenticated;
revoke all on table public.idea_validation_options from anon, authenticated;
revoke all on table public.idea_validation_responses from anon, authenticated;

grant select on table public.idea_validation_questions to anon, authenticated;
grant select on table public.idea_validation_options to anon, authenticated;
grant select, insert, update, delete
on table public.idea_validation_responses
to authenticated;

create function public.get_idea_validation_question(target_idea_id uuid)
returns table (
  question_id uuid,
  prompt text,
  option_id uuid,
  option_value text,
  option_label text,
  sort_order smallint,
  viewer_option_id uuid
)
language sql
stable
security definer
set search_path = ''
as $$
  select
    questions.id as question_id,
    questions.prompt,
    options.id as option_id,
    options.value as option_value,
    options.label as option_label,
    options.sort_order,
    (
      select responses.option_id
      from public.idea_validation_responses as responses
      where responses.question_id = questions.id
        and responses.profile_id = (select auth.uid())
    ) as viewer_option_id
  from public.idea_validation_questions as questions
  join public.ideas as ideas
    on ideas.id = questions.idea_id
  join public.idea_validation_options as options
    on options.question_id = questions.id
  where questions.idea_id = target_idea_id
    and questions.status = 'active'
    and ideas.status = 'published'
  order by options.sort_order;
$$;

revoke all on function public.get_idea_validation_question(uuid) from public;
grant execute on function public.get_idea_validation_question(uuid) to anon, authenticated;

comment on function public.get_idea_validation_question(uuid) is
  'Returns one active public question and options plus only the current member private choice.';

create function public.get_idea_validation_summary(target_idea_id uuid)
returns table (
  question_id uuid,
  prompt text,
  option_id uuid,
  option_value text,
  option_label text,
  response_count bigint
)
language sql
stable
security definer
set search_path = ''
as $$
  select
    questions.id as question_id,
    questions.prompt,
    options.id as option_id,
    options.value as option_value,
    options.label as option_label,
    count(responses.profile_id)::bigint as response_count
  from public.idea_validation_questions as questions
  join public.ideas as ideas
    on ideas.id = questions.idea_id
  join public.idea_validation_options as options
    on options.question_id = questions.id
  left join public.idea_validation_responses as responses
    on responses.question_id = questions.id
    and responses.option_id = options.id
  where questions.idea_id = target_idea_id
    and ideas.creator_id = (select auth.uid())
  group by questions.id, questions.prompt, options.id, options.value, options.label, options.sort_order
  order by options.sort_order;
$$;

revoke all on function public.get_idea_validation_summary(uuid) from public;
grant execute on function public.get_idea_validation_summary(uuid) to authenticated;

comment on function public.get_idea_validation_summary(uuid) is
  'Returns aggregate validation evidence only to the concept creator, never member identities.';

insert into public.idea_validation_questions (
  id,
  idea_id,
  prompt,
  status,
  created_at,
  updated_at
)
values (
  '00000000-0000-4000-8000-000000000401',
  '00000000-0000-4000-8000-000000000218',
  'What could you bring to a first Project Time Capsule pilot?',
  'active',
  '2026-08-10 10:39:22+00',
  '2026-08-10 10:39:22+00'
)
on conflict (id) do update
set
  idea_id = excluded.idea_id,
  prompt = excluded.prompt,
  status = excluded.status,
  updated_at = excluded.updated_at;

insert into public.idea_validation_options (
  id,
  question_id,
  value,
  label,
  sort_order,
  created_at
)
values
  (
    '00000000-0000-4000-8000-000000000411',
    '00000000-0000-4000-8000-000000000401',
    'open-source-project',
    'An open-source project I maintain',
    0,
    '2026-08-10 10:39:22+00'
  ),
  (
    '00000000-0000-4000-8000-000000000412',
    '00000000-0000-4000-8000-000000000401',
    'coursework-research-tool',
    'Coursework or a research tool',
    1,
    '2026-08-10 10:39:22+00'
  ),
  (
    '00000000-0000-4000-8000-000000000413',
    '00000000-0000-4000-8000-000000000401',
    'creative-software',
    'A creative software project',
    2,
    '2026-08-10 10:39:22+00'
  ),
  (
    '00000000-0000-4000-8000-000000000414',
    '00000000-0000-4000-8000-000000000401',
    'civic-community-application',
    'A civic or community application',
    3,
    '2026-08-10 10:39:22+00'
  ),
  (
    '00000000-0000-4000-8000-000000000415',
    '00000000-0000-4000-8000-000000000401',
    'rebuild-testing',
    'Time to test clean-room rebuilds',
    4,
    '2026-08-10 10:39:22+00'
  )
on conflict (id) do update
set
  question_id = excluded.question_id,
  value = excluded.value,
  label = excluded.label,
  sort_order = excluded.sort_order;
