CREATE TABLE events (
    id serial PRIMARY KEY,
    mystery_id integer REFERENCES mysteries(id) ON UPDATE CASCADE ON DELETE CASCADE,
    letter TEXT NOT NULL,
    info TEXT NOT NULL,
    show_at_message integer NOT NULL
);

CREATE TABLE suspects (
    id SERIAL PRIMARY KEY,
    mystery_id INTEGER NOT NULL REFERENCES mysteries(id),
    name TEXT NOT NULL,
    imagepath TEXT NOT NULL,
    description TEXT NOT NULL,
    UNIQUE (mystery_id, name)
);

CREATE TABLE action_clues (
    id SERIAL PRIMARY KEY,
    mystery_id INTEGER NOT NULL REFERENCES mysteries(id),
    action TEXT NOT NULL,
    clue TEXT NOT NULL,
    UNIQUE (mystery_id, action)
);

CREATE TABLE timeframes (
    id SERIAL PRIMARY KEY,
    mystery_id INTEGER NOT NULL REFERENCES mysteries(id),
    timeframe TEXT NOT NULL,
    event_happened TEXT NOT NULL,
    UNIQUE (mystery_id, timeframe)
);

-- migrate data
CREATE OR REPLACE FUNCTION migrate_suspects_data() RETURNS void AS $$
DECLARE
    r mysteries%ROWTYPE;
    s suspect_type;
BEGIN
    FOR r IN SELECT * FROM mysteries LOOP
        FOREACH s IN ARRAY r.suspects LOOP
            INSERT INTO suspects (mystery_id, name, imagepath, description)
            VALUES (r.id, s.name, s.imagepath, s.description);
        END LOOP;
    END LOOP;
END;
$$ LANGUAGE plpgsql;
SELECT migrate_suspects_data();

CREATE OR REPLACE FUNCTION migrate_action_clues_data() RETURNS void AS $$
DECLARE
    r mysteries%ROWTYPE;
    ac action_clue_type;
BEGIN
    FOR r IN SELECT * FROM mysteries LOOP
        FOREACH ac IN ARRAY r.action_clues LOOP
            INSERT INTO action_clues (mystery_id, action, clue)
            VALUES (r.id, ac.action, ac.clue);
        END LOOP;
    END LOOP;
END;
$$ LANGUAGE plpgsql;
SELECT migrate_action_clues_data();

CREATE OR REPLACE FUNCTION migrate_timeframes_data() RETURNS void AS $$
DECLARE
    r mysteries%ROWTYPE;
    tf timeframe_type;
BEGIN
    FOR r IN SELECT * FROM mysteries LOOP
        FOREACH tf IN ARRAY r.timeframe LOOP
            INSERT INTO timeframes (mystery_id, timeframe, event_happened)
            VALUES (r.id, tf.timeframe, tf.event_happened);
        END LOOP;
    END LOOP;
END;
$$ LANGUAGE plpgsql;
SELECT migrate_timeframes_data();


ALTER TABLE mysteries
DROP COLUMN suspects;
ALTER TABLE mysteries
DROP COLUMN action_clues;
ALTER TABLE mysteries
DROP COLUMN timeframe;

DROP TYPE suspect_type;
DROP TYPE action_clue_type;
DROP TYPE timeframe_type;

DROP FUNCTION migrate_suspects_data;
DROP FUNCTION migrate_action_clues_data;
DROP FUNCTION migrate_timeframes_data;