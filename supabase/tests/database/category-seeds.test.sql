begin;

select plan(1);

select results_eq(
  $$
    select slug
    from public.categories
    order by slug
  $$,
  $$
    values
      ('arts-culture'::text),
      ('community'::text),
      ('education'::text),
      ('environment'::text),
      ('health'::text),
      ('technology'::text)
  $$,
  'fresh databases include the initial public idea categories'
);

select * from finish();
rollback;
