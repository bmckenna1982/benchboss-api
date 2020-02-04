DROP TYPE IF EXISTS arena;

CREATE TYPE arena as ENUM (
    'IceComplex',
    'The Cooler (Red)',
    'The Cooler (Blue)',
    'Sandy Springs'
);

CREATE TABLE schedule (
    id SERIAL PRIMARY KEY,
    summary TEXT NOT NULL,
    location arena NOT NULL,
    time TIMESTAMP NOT NULL
);