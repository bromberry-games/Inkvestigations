CREATE TABLE events (
    id serial PRIMARY KEY,
    mystery_id integer REFERENCES mysteries(id) ON UPDATE CASCADE ON DELETE CASCADE,
    letter TEXT NOT NULL,
    info TEXT NOT NULL,
    show_at_message integer NOT NULL
);