update public.ideas
set description = replace(description, E'\\n', E'\n')
where slug in (
  'clean-air-library',
  'repair-commons',
  'neighbor-ride-credits',
  'after-dark-storefronts'
)
and position(E'\\n' in description) > 0;
