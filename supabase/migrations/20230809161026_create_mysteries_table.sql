CREATE TABLE mysteries (
    Name TEXT PRIMARY KEY UNIQUE,
    Description TEXT Not Null,
    Prompt TEXT Not Null,
);

CREATE TABLE user_messages (
    user_id uuid PRIMARY KEY REFERENCES auth.users(id) ON UPDATE CASCADE,
    amount INTEGER CHECK (amount >= 0)
);

alter table mysteries 
  enable row level security;

alter table user_messages 
  enable row level security;

create policy "Mysteries are viewable by everyone"
  on mysteries for select using (
    true
  );

create policy "Individuals can view their own muessages."
    on user_messages for select
    using ( auth.uid() = user_id );
