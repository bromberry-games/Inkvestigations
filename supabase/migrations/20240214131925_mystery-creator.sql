CREATE TABLE user_mysteries (
    id uuid UNIQUE NOT NULL,
    user_id uuid REFERENCES auth.users(id) ON UPDATE CASCADE ON DELETE CASCADE,
    name TEXT NOT NULL,
    published BOOLEAN NOT NULL DEFAULT FALSE,
    info JSON NOT NULL,
    UNIQUE (user_id, name)
);

ALTER TABLE user_mysteries
  ENABLE ROW LEVEL SECURITY;