CREATE TABLE t_p14134602_wedding_invite_site_.site_content (
  key VARCHAR(100) PRIMARY KEY,
  value TEXT NOT NULL,
  updated_at TIMESTAMP DEFAULT NOW()
);

INSERT INTO t_p14134602_wedding_invite_site_.site_content (key, value) VALUES
  ('groom_name', 'Ванюшка'),
  ('bride_name', 'Настюшка'),
  ('wedding_date', '2026-08-26T15:00:00'),
  ('wedding_date_label', '26 августа 2026'),
  ('about_text', 'Дорогие друзья и родные! Мы рады сообщить вам о самом важном дне в нашей жизни. Будем счастливы разделить этот прекрасный момент с каждым из вас.'),
  ('venue_address', 'Ленинградская область, Ломоносовский район, деревня Таменгонт, Центральная улица, 39Б'),
  ('venue_name', 'Таменгонт'),
  ('dresscode', 'коктейльный / кэжуал'),
  ('dresscode_colors', '#3FA38D,#FFF990,#89D5DB,#3295F7,#4D3407'),
  ('rsvp_deadline', '26 июля 2026'),
  ('organizer_name', 'Алина'),
  ('organizer_phone', '+7-921-402-12-08'),
  ('no_flowers_text', 'Пожалуйста, не дарите цветы — лучше порадуйте нас тёплыми словами и хорошим настроением!'),
  ('schedule', '[{"time":"14:00","title":"Сбор гостей + фуршет","desc":"Встреча гостей, лёгкие закуски и шампанское","icon":"Users"},{"time":"15:00","title":"Выездная церемония","desc":"Торжественная регистрация брака","icon":"Heart"},{"time":"16:00","title":"Банкет","desc":"Праздничный ужин и веселье","icon":"Utensils"}]'),
  ('hero_video_url', 'https://cdn.poehali.dev/projects/5a3fdc4a-192c-44f8-bed7-676fcfabf9f6/bucket/150c7e2f-b584-4ca7-bc74-28dc2b73222c.MOV'),
  ('hero_image_url', 'https://cdn.poehali.dev/projects/5a3fdc4a-192c-44f8-bed7-676fcfabf9f6/files/7f7bcfe9-3e73-409e-986b-21f9bcfd686e.jpg'),
  ('couple_image_url', 'https://cdn.poehali.dev/projects/5a3fdc4a-192c-44f8-bed7-676fcfabf9f6/bucket/dcdaf83e-eeb9-4317-80a0-7ddc7fe2cd61.jpg'),
  ('child_groom_url', 'https://cdn.poehali.dev/files/2cf75f75-f8e9-47cf-8784-c0c9b56811c3.png'),
  ('child_bride_url', 'https://cdn.poehali.dev/files/51566e37-37ec-41b5-b1fd-0c72fa3228c0.png'),
  ('adult_groom_url', 'https://cdn.poehali.dev/files/953a90cf-1d75-4cc6-ae10-6a2d045940d8.png'),
  ('adult_bride_url', 'https://cdn.poehali.dev/files/0601fa4b-c3a9-4d70-86fb-d81539a302b4.png'),
  ('venue_image_url', 'https://cdn.poehali.dev/projects/5a3fdc4a-192c-44f8-bed7-676fcfabf9f6/bucket/f5dce4bd-5b74-4d52-ab29-50b7b81d7fe3.jpg');
