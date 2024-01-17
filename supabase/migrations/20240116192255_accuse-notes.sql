Create table conversation_notes (
    conversation_id integer not null references user_mystery_conversations(id) PRIMARY KEY,
    notes json
);
alter table conversation_notes enable row level security;
alter table action_clues enable row level security;
alter table events enable row level security;
alter table suspects enable row level security;
alter table timeframes enable row level security;


create policy "Users can create notes."
on conversation_notes for insert
to authenticated                          
with check ( auth.uid() in (select user_id from user_mystery_conversations where id = conversation_id) );    

create policy "Users can update notes."
on conversation_notes for update
to authenticated                          
using ( auth.uid() in (select user_id from user_mystery_conversations where id = conversation_id) );    

create policy "Users can select notes"
on conversation_notes for select
to authenticated
using ( auth.uid() in (select user_id from user_mystery_conversations where id = conversation_id) );