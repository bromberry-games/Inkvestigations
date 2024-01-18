CREATE TABLE few_shots (
    mystery_id integer REFERENCES mysteries(id) PRIMARY KEY,
    brain JSON NOT NULL
);

ALTER TABLE events ADD COLUMN timeframe text NOT NULL;