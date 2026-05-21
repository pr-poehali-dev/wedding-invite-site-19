INSERT INTO t_p14134602_wedding_invite_site_.site_content (key, value) VALUES
  ('about_section_label', 'Наша история'),
  ('about_section_title', 'О событии'),
  ('dresscode_hint', 'Мужчинам: тёмный низ и светлая рубашка или поло'),
  ('rsvp_section_title', 'Подтвердите участие'),
  ('rsvp_important_note', 'Форму должен пройти каждый приглашённый лично, даже если вы приедете вместе. Это поможет нам точно подготовиться к празднику.'),
  ('rsvp_confirm_text', 'Мы с нетерпением ждём встречи с вами'),
  ('no_flowers_extra', 'Если захотите поздравить нас дополнительно, будем благодарны за подарок в конверте — он поможет исполнить наши общие мечты ✨'),
  ('ceremony_time_label', 'Начало церемонии в 15:00'),
  ('hero_tagline', 'Приглашение на свадьбу')
ON CONFLICT (key) DO NOTHING;
