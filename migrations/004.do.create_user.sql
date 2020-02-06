CREATE TABLE benchboss_user (
  id SERIAL PRIMARY KEY,
  user_name TEXT NOT NULL UNIQUE,
  full_name TEXT NOT NULL,
  password TEXT NOT NULL,
  date_created TIMESTAMP DEFAULT now() NOT NULL,
  date_modified TIMESTAMP
);

ALTER TABLE message DROP COLUMN author;

ALTER TABLE message    
  ADD COLUMN
    author_id INTEGER REFERENCES benchboss_user(id) 
    ON DELETE SET NULL;

ALTER TABLE comment DROP COLUMN author;

ALTER TABLE comment    
  ADD COLUMN
    author_id INTEGER REFERENCES benchboss_user(id)
    ON DELETE SET NULL;