-- Create tables

CREATE TABLE mysteries (
    Name TEXT PRIMARY KEY UNIQUE,
    Description TEXT Not Null,
    Prompt TEXT Not Null
);

CREATE TABLE user_messages (
    user_id uuid PRIMARY KEY REFERENCES auth.users(id) ON UPDATE CASCADE,
    amount INTEGER CHECK (amount >= 0)
);

-- policies

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

-- triggers

CREATE OR REPLACE FUNCTION add_user_to_user_messages()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO user_messages (user_id, amount) VALUES (NEW.id, 5);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;


CREATE OR REPLACE TRIGGER tr_insert_user_messages
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE FUNCTION add_user_to_user_messages();
