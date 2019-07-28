CREATE TABLE theater_rooms (
    id SERIAL PRIMARY KEY,
    password TEXT,
    name TEXT NOT NULL UNIQUE
);

