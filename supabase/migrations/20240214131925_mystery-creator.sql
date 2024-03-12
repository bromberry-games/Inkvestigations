CREATE TABLE user_mysteries (
    id uuid UNIQUE NOT NULL PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id uuid REFERENCES auth.users(id) ON UPDATE CASCADE ON DELETE CASCADE,
    info JSON NOT NULL,
    mystery_id Integer REFERENCES mysteries(id) ON UPDATE CASCADE 
);

ALTER TABLE user_mysteries
  ENABLE ROW LEVEL SECURITY;

ALTER TABLE mysteries ADD COLUMN slug uuid UNIQUE NOT NULL DEFAULT uuid_generate_v4();

ALTER TABLE user_mystery_conversations ADD COLUMN mystery_slug uuid NOT NULL REFERENCES mysteries(slug) ON UPDATE CASCADE ON DELETE CASCADE;
UPDATE user_mystery_conversations
SET mystery_slug = (
    SELECT slug
    FROM mysteries
    WHERE mysteries.name = user_mystery_conversations.mystery_name
);
ALTER TABLE user_mystery_conversations DROP COLUMN mystery_name;
ALTER TABLE solved ADD COLUMN mystery_slug uuid NOT NULL REFERENCES mysteries(slug) ON UPDATE CASCADE ON DELETE CASCADE;
UPDATE solved
SET mystery_slug = (
    SELECT slug
    FROM mysteries
    WHERE mysteries.name = solved.mystery_name
);
ALTER TABLE solved DROP COLUMN mystery_name;
ALTER TABLE mysteries DROP CONSTRAINT mysteries_name_key;
ALTER TABLE suspects ADD COLUMN path text;

-- for some reason supabase does not reset this.
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM storage.buckets WHERE id = 'user_mysteries' OR name = 'user_mysteries') THEN
        INSERT INTO storage.buckets (id, name, public)
        VALUES ('user_mysteries', 'user_mysteries', true);
    END IF;
END$$;