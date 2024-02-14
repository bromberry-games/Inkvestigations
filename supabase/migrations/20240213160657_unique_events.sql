ALTER TABLE events
ADD CONSTRAINT unique_message_timings UNIQUE (mystery_id, show_at_message);

ALTER TABLE user_mystery_brain_messages DROP COLUMN mood;