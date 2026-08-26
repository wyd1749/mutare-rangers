insert into public.news (id, title, date, category, excerpt, image, body)
values
  ('n1', 'Rangers edge past City Hoopers', 'May 18, 2025', 'Match Report', 'A thrilling 86-78 win over City Hoopers keeps the Rangers on top of the league table.', '/images/hero-dunk.png', 'The Mutare Rangers held off a late surge from City Hoopers to secure an 86-78 victory in front of a packed home crowd on Saturday night.'),
  ('n2', 'Academy trials for 2025 now open', 'May 15, 2025', 'Academy', 'Aspiring young players can now register for the 2025 Mutare Rangers Academy trials.', '/images/player-2.png', 'Mutare Rangers Academy has officially opened registration for its 2025 trials, inviting young players from across the region to compete for a place in the club''s development programs.'),
  ('n3', 'Meet our new head coach', 'May 10, 2025', 'Club News', 'Coach Tendai Ncube joins the Rangers with a wealth of championship experience.', '/images/player-3.png', 'Mutare Rangers are pleased to announce the appointment of Tendai Ncube as the club''s new head coach, effective immediately.'),
  ('n4', 'U16 team wins ZBA Championship', 'May 12, 2025', 'Academy', 'Our U16 squad brought home the trophy after an undefeated tournament run.', '/images/player-4.png', 'The Mutare Rangers U16 Academy side capped off a perfect tournament run by winning the ZBA Championship.'),
  ('n5', 'College scholarship for academy star', 'May 05, 2025', 'Academy', 'One of our brightest talents has earned a full scholarship to a US college program.', '/images/player-1.png', 'Mutare Rangers Academy is proud to celebrate one of its own after a standout graduate earned a full basketball scholarship.')
on conflict (id) do update set title = excluded.title, date = excluded.date, category = excluded.category, excerpt = excluded.excerpt, image = excluded.image, body = excluded.body;

insert into public.products (id, name, price, image, category)
values
  ('p1', 'Home Jersey 2025', '$45', '/images/jersey.png', 'Apparel'),
  ('p2', 'Away Jersey 2025', '$45', '/images/jersey.png', 'Apparel'),
  ('p3', 'Training Shorts', '$25', '/images/jersey.png', 'Apparel'),
  ('p4', 'Warm-up Hoodie', '$55', '/images/jersey.png', 'Apparel')
on conflict (id) do update set name = excluded.name, price = excluded.price, image = excluded.image, category = excluded.category;
