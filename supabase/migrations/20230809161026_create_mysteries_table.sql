-- Create tables

CREATE TABLE mysteries (
    name TEXT PRIMARY KEY UNIQUE,
    description TEXT Not Null,
    prompt TEXT NOT NULL,
    answer TEXT NOT NULL,
    filepath TEXT NOT NULL
);

CREATE TABLE user_messages (
    user_id uuid PRIMARY KEY REFERENCES auth.users(id) ON UPDATE CASCADE,
    amount INTEGER CHECK (amount >= 0) NOT NULL
);

CREATE TABLE user_mystery_conversations (
    id SERIAL PRIMARY KEY,
    user_id uuid REFERENCES auth.users(id) ON UPDATE CASCADE,
    mystery_name TEXT NOT NULL REFERENCES mysteries(name) ON UPDATE CASCADE,
    archived BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE TABLE user_mystery_messages (
  id SERIAL PRIMARY KEY,
  conversation_id INT REFERENCES user_mystery_conversations(id) ON UPDATE CASCADE,
  content TEXT NOT NULL, 
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE TABLE subscription_tiers (
    tier_id SERIAL PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    description TEXT NOT NULL,
    daily_message_limit INTEGER CHECK (daily_message_limit >= 0) NOT NULL,
    stripe_price_id TEXT NOT NULL,
    active BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE user_subscriptions (
    subscription_id SERIAL PRIMARY KEY,
    user_id uuid REFERENCES auth.users(id) ON UPDATE CASCADE,
    tier_id INT REFERENCES subscription_tiers(tier_id) ON UPDATE CASCADE,
    start_date DATE NOT NULL,
    end_date DATE,
    active BOOLEAN NOT NULL DEFAULT TRUE
);



-- policies
ALTER DEFAULT PRIVILEGES REVOKE EXECUTE ON FUNCTIONS FROM PUBLIC;

alter table mysteries 
  enable row level security;

alter table user_messages 
  enable row level security;

alter table user_mystery_conversations 
  enable row level security;

alter table user_mystery_messages 
  enable row level security;

alter table user_subscriptions 
  enable row level security;

alter table subscription_tiers 
  enable row level security;

create policy "everybody can view mysteries."
    on mysteries for select
    using ( true );

create policy "Individuals can view their own messages."
    on user_messages for select
    using ( auth.uid() = user_id );

create policy "Individuals can view their own conversations"
    on user_mystery_conversations for select
    using ( auth.uid() = user_id ); 

create policy "Individuals can view their own messages"
  on user_mystery_messages
  for select using (
    auth.uid() in (
      select user_id from user_mystery_conversations
      where conversation_id = id
    )
  );

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

create function create_subscription(the_user_id uuid, price_id text)
returns void as
$$
UPDATE user_subscriptions
SET active = FALSE, 
    end_date = CURRENT_DATE  -- Set end_date to today, marking the end of this subscription tier.
WHERE user_id = the_user_id AND active = TRUE;

-- Insert a new record for the updated subscription
INSERT INTO user_subscriptions(user_id, tier_id, start_date, end_date, active)
VALUES (
    the_user_id, 
    (SELECT tier_id FROM subscription_tiers WHERE stripe_price_id = price_id LIMIT 1), 
    CURRENT_DATE, 
    NULL,  
    TRUE
);
$$ 
language sql volatile;
