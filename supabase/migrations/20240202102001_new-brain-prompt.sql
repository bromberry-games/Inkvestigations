ALTER TABLE mysteries DROP COLUMN murderer;
DROP TYPE murderer_type CASCADE;
ALTER TABLE mysteries ADD COLUMN solution TEXT;
ALTER TABLE suspects DROP COLUMN imagepath;
CREATE TYPE star_ratings AS (
    star0 TEXT,
    star1 TEXT,
    star2 TEXT,
    star3 TEXT
);
ALTER TABLE mysteries ADD COLUMN star_ratings star_ratings;