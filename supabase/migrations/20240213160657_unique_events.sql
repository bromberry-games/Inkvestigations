ALTER TABLE events
ADD CONSTRAINT unique_message_timings UNIQUE (mystery_id, show_at_message);