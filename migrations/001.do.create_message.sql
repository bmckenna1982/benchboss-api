CREATE TABLE message (
    id SERIAL PRIMARY KEY,
    content TEXT NOT NULL,
    title TEXT NOT NULL,
    author TEXT NOT NULL,
    posted_date TIMESTAMP NOT NULL
);