ALTER TABLE conversation_notes DROP CONSTRAINT conversation_notes_conversation_id_fkey;

ALTER TABLE conversation_notes
ADD CONSTRAINT conversation_notes_user_mystery_conversations_fk
FOREIGN KEY (conversation_id) REFERENCES user_mystery_conversations(id) ON DELETE CASCADE ON UPDATE CASCADE;

CREATE OR REPLACE FUNCTION delete_old_users()
RETURNS void AS
$$
BEGIN
  DELETE FROM auth.users
  WHERE last_sign_in_at < NOW() - INTERVAL '1 week'
    AND raw_user_meta_data->>'anonymous' = 'true';
END;
$$
LANGUAGE plpgsql;

SELECT cron.schedule('delete_old_users', '0 0 * * *', $$SELECT delete_old_users();$$);
