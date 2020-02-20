CREATE TYPE user_status AS ENUM (
  'in',
  'out',
  'maybe'
);

CREATE TABLE rsvp (
  id SERIAL PRIMARY KEY,
  game_id INTEGER REFERENCES schedule(id) ON DELETE CASCADE NOT NULL,
  user_id INTEGER REFERENCES benchboss_user(id) ON DELETE CASCADE NOT NULL,
  game_status user_status,
  response_date TIMESTAMP DEFAULT now() NOT NULL
);
