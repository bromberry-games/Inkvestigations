-- extensions
create extension pg_cron with schema extensions;

-- create schemas
CREATE SCHEMA mystery;
CREATE SCHEMA user_interaction;
CREATE SCHEMA subscriptions;

-- Create tables

CREATE TABLE mystery.mysteries (
    name TEXT PRIMARY KEY UNIQUE,
    description TEXT Not Null,
    prompt TEXT NOT NULL,
    answer TEXT NOT NULL,
    filepath TEXT NOT NULL,
    accuse_prompt TEXT NOT NULL
);

CREATE TABLE mystery.suspects (
    id SERIAL PRIMARY KEY,
    mystery_name TEXT NOT NULL REFERENCES mystery.mysteries(name) ON UPDATE CASCADE ON DELETE CASCADE,
    name TEXT NOT NULL,
    imagepath TEXT NOT NULL,
    description TEXT NOT NULL
);

CREATE TABLE mystery.murderers (
  id SERIAL PRIMARY KEY, 
  suspect_id INT NOT NULL UNIQUE REFERENCES mystery.suspects(id) ON UPDATE CASCADE ON DELETE CASCADE,
  murder_reasons TEXT NOT NULL
);

CREATE TABLE user_interaction.SOLVED (
    id SERIAL PRIMARY KEY,
    mystery_name TEXT NOT NULL REFERENCES mystery.mysteries(name) ON UPDATE CASCADE,
    user_id uuid NOT NULL REFERENCES auth.users(id) ON UPDATE CASCADE,
    rating INTEGER CHECK (rating >= 0)
);

CREATE TABLE user_interaction.user_messages (
    user_id uuid PRIMARY KEY REFERENCES auth.users(id) ON UPDATE CASCADE,
    amount INTEGER CHECK (amount >= 0) NOT NULL
);

CREATE TABLE user_interaction.user_mystery_conversations (
    id SERIAL PRIMARY KEY,
    user_id uuid REFERENCES auth.users(id) ON UPDATE CASCADE,
    mystery_name TEXT NOT NULL REFERENCES mystery.mysteries(name) ON UPDATE CASCADE,
    archived BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE TABLE user_interaction.user_mystery_messages (
  id SERIAL PRIMARY KEY,
  conversation_id INT REFERENCES user_interaction.user_mystery_conversations(id) ON UPDATE CASCADE,
  content TEXT NOT NULL, 
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE TABLE subscriptions.subscription_tiers (
    tier_id SERIAL PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    description TEXT NOT NULL,
    daily_message_limit INTEGER CHECK (daily_message_limit >= 0) NOT NULL,
    stripe_price_id TEXT NOT NULL,
    active BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE subscriptions.user_subscriptions (
    subscription_id SERIAL PRIMARY KEY,
    user_id uuid REFERENCES auth.users(id) ON UPDATE CASCADE,
    tier_id INT REFERENCES subscriptions.subscription_tiers(tier_id) ON UPDATE CASCADE,
    start_date DATE NOT NULL,
    end_date DATE,
    active BOOLEAN NOT NULL DEFAULT TRUE
);



-- policies
ALTER DEFAULT PRIVILEGES REVOKE EXECUTE ON FUNCTIONS FROM PUBLIC;

ALTER TABLE mystery.mysteries 
  ENABLE ROW LEVEL SECURITY;

ALTER TABLE mystery.suspects
  ENABLE ROW LEVEL SECURITY;

ALTER TABLE mystery.murderers
  ENABLE ROW LEVEL SECURITY;

ALTER TABLE user_interaction.user_messages 
  ENABLE ROW LEVEL SECURITY;

ALTER TABLE user_interaction.user_mystery_conversations 
  ENABLE ROW LEVEL SECURITY;

ALTER TABLE user_interaction.user_mystery_messages 
  ENABLE ROW LEVEL SECURITY;

ALTER TABLE subscriptions.user_subscriptions 
  ENABLE ROW LEVEL SECURITY;

ALTER TABLE subscriptions.subscription_tiers 
  ENABLE ROW LEVEL SECURITY;

create policy "everybody can view mystery.mysteries."
    on mystery.mysteries for select
    using ( true );

create policy "Individuals can view their own messages."
    on user_interaction.user_messages for select
    using ( auth.uid() = user_id );

create policy "Individuals can view their own conversations"
    on user_interaction.user_mystery_conversations for select
    using ( auth.uid() = user_id ); 

create policy "Individuals can view their own messages"
  on user_interaction.user_mystery_messages
  for select using (
    auth.uid() in (
      select user_id from user_interaction.user_mystery_conversations
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
    INSERT INTO user_interaction.user_messages (user_id, amount) VALUES (NEW.id, 5);
    RETURN NEW;
END;
$$;


CREATE OR REPLACE TRIGGER tr_insert_user_messages
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE FUNCTION add_user_to_user_messages();

-- functions

create function user_interaction.decrement_message_for_user(the_user_id uuid) 
returns void as
$$
  update user_interaction.user_messages
  set amount = amount - 1
  where user_id = the_user_id
$$ 
language sql volatile;

create function user_interaction.increase_message_for_user_by_amount(the_user_id uuid, increase integer) 
returns void as
$$
  update user_interaction.user_messages
  set amount = amount + increase
  where user_id = the_user_id
$$ 
language sql volatile;

create function subscriptions.create_subscription(the_user_id uuid, price_id text)
returns void as
$$
UPDATE subscriptions.user_subscriptions
SET active = FALSE, 
    end_date = CURRENT_DATE  
WHERE user_id = the_user_id AND active = TRUE;

INSERT INTO subscriptions.user_subscriptions(user_id, tier_id, start_date, end_date, active)
VALUES (
    the_user_id, 
    (SELECT tier_id FROM subscriptions.subscription_tiers WHERE stripe_price_id = price_id LIMIT 1), 
    CURRENT_DATE, 
    NULL,  
    TRUE
);

  UPDATE user_interaction.user_messages um
  SET amount = sub.daily_message_limit + um.amount
  FROM (
      SELECT us.user_id, st.daily_message_limit
      FROM subscriptions.user_subscriptions us
      JOIN subscriptions.subscription_tiers st ON us.tier_id = st.tier_id
      WHERE us.active = TRUE AND us.user_id = the_user_id
  ) AS sub
  WHERE um.user_id = sub.user_id;

$$ 
language sql volatile;

CREATE OR REPLACE FUNCTION subscriptions.update_daily_messages()
RETURNS VOID
LANGUAGE plpgsql AS $$
BEGIN

  UPDATE subscriptions.user_subscriptions
    SET active = FALSE
    WHERE end_date IS NOT NULL AND end_date < CURRENT_DATE;

    UPDATE user_interaction.user_messages um
    SET amount = sub.daily_message_limit + um.amount
    FROM (
        SELECT us.user_id, st.daily_message_limit
        FROM subscriptionsuser_subscriptions us
        JOIN subscription_tiers st ON us.tier_id = st.tier_id
        WHERE us.active = TRUE
    ) AS sub
    WHERE um.user_id = sub.user_id;
END;
$$;

SELECT cron.schedule('0 0 * * *', $$SELECT subscriptions.update_daily_messages();$$);