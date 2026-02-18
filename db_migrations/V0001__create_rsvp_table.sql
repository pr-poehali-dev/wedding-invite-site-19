CREATE TABLE rsvp (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    guests_count INTEGER NOT NULL DEFAULT 1,
    wishes TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);