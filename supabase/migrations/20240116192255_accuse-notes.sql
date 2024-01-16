Create table conversation_notes (
    conversation_id integer not null references user_mystery_conversations(id) PRIMARY KEY,
    notes json
);