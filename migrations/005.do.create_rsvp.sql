CREATE TYPE user_status AS ENUM (
  'in',
  'out',
  'maybe'
);

CREATE TABLE rsvp (
  id SERIAL PRIMARY KEY,
  game_id INTEGER REFERENCES schedule(id) NOT NULL ON DELETE CASCADE,
  user_id INTEGER REFERENCES benchboss_user(id) NOT NULL ON DELETE CASCADE,
  game_status user_status,
  response_date TIMESTAMP NOT NULL
);
