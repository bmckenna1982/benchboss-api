CREATE TABLE comment (
  id SERIAL PRIMARY KEY,
  content TEXT NOT NULL,  
  author TEXT NOT NULL,
  postedDate TIMESTAMP DEFAULT now() NOT NULL,
  messageId INTEGER REFERENCES message(id) ON DELETE CASCADE NOT NULL
)