CREATE TABLE IF NOT EXISTS t_p14134602_wedding_invite_site_.rsvp (
  id SERIAL PRIMARY KEY,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  guests_count INTEGER DEFAULT 1,
  has_plus_one BOOLEAN DEFAULT FALSE,
  plus_one_name VARCHAR(100) DEFAULT '',
  allergies TEXT DEFAULT '',
  drink_preference VARCHAR(50) DEFAULT '',
  need_transfer BOOLEAN DEFAULT FALSE,
  wishes TEXT DEFAULT '',
  created_at TIMESTAMP DEFAULT NOW()
);