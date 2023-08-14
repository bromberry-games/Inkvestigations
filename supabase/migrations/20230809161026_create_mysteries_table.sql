-- Create tables

CREATE TABLE mysteries (
    Name TEXT PRIMARY KEY UNIQUE,
    Description TEXT Not Null,
    Prompt TEXT Not Null
);

CREATE TABLE user_messages (
    user_id uuid PRIMARY KEY REFERENCES auth.users(id) ON UPDATE CASCADE,
    amount INTEGER CHECK (amount >= 0) NOT NULL
);

-- views
CREATE VIEW mysteries_view AS
  SELECT Name, Description FROM mysteries;

-- policies
ALTER DEFAULT PRIVILEGES REVOKE EXECUTE ON FUNCTIONS FROM PUBLIC;

alter table mysteries 
  enable row level security;

alter table user_messages 
  enable row level security;

create policy "Individuals can view their own messages."
    on user_messages for select
    using ( auth.uid() = user_id );

-- triggers

CREATE OR REPLACE FUNCTION add_user_to_user_messages()
RETURNS TRIGGER
language plpgsql
security definer set search_path = public
AS $$
BEGIN
    INSERT INTO public.user_messages (user_id, amount) VALUES (NEW.id, 5);
    RETURN NEW;
END;
$$;


CREATE OR REPLACE TRIGGER tr_insert_user_messages
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE FUNCTION add_user_to_user_messages();

-- functions

create function decrement_message_for_user(the_user_id uuid) 
returns void as
$$
  update user_messages
  set amount = amount - 1
  where user_id = the_user_id
$$ 
language sql volatile;

create function increase_message_for_user_by_amount(the_user_id uuid, increase integer) 
returns void as
$$
  update user_messages
  set amount = amount + increase
  where user_id = the_user_id
$$ 
language sql volatile;