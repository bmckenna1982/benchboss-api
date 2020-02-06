CREATE TABLE comment (
  id SERIAL PRIMARY KEY,
  content TEXT NOT NULL,  
  author TEXT NOT NULL,
  posted_date TIMESTAMP DEFAULT now() NOT NULL,
  message_id INTEGER REFERENCES message(id) ON DELETE CASCADE NOT NULL
)