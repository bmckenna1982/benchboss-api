CREATE TABLE message (
    id SERIAL PRIMARY KEY,
    content TEXT NOT NULL,
    title TEXT NOT NULL,
    author TEXT NOT NULL,
    postedDate TIMESTAMP NOT NULL
);