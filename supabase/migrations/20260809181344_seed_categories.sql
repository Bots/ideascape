insert into public.categories (slug, name, description)
values
  (
    'arts-culture',
    'Arts & Culture',
    'Creative work, cultural projects, and shared experiences.'
  ),
  (
    'community',
    'Community',
    'Projects that strengthen neighborhoods and human connection.'
  ),
  (
    'education',
    'Education',
    'Tools and programs that make learning more effective and accessible.'
  ),
  (
    'environment',
    'Environment',
    'Ideas that protect ecosystems and improve environmental resilience.'
  ),
  (
    'health',
    'Health',
    'Products and programs that support healthier lives.'
  ),
  (
    'technology',
    'Technology',
    'Software, hardware, and technical inventions.'
  )
on conflict (slug) do update
set
  name = excluded.name,
  description = excluded.description;
