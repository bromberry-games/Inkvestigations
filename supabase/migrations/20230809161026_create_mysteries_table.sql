-- extensions
create extension pg_cron with schema extensions;

-- Create tables
CREATE TABLE mysteries (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    description TEXT Not NULL,
    brain_prompt TEXT NOT NULL,
    letter_info TEXT NOT NULL,
    letter_prompt TEXT NOT NULL,
    accuse_prompt TEXT NOT NULL,
    accuse_letter_prompt TEXT NOT NULL,
    filepath TEXT NOT NULL
);

CREATE TABLE suspects (
    id SERIAL PRIMARY KEY,
    mystery_name TEXT NOT NULL REFERENCES mysteries(name) ON UPDATE CASCADE ON DELETE CASCADE,
    name TEXT NOT NULL,
    imagepath TEXT NOT NULL,
    description TEXT NOT NULL
);

CREATE TABLE murderers (
  id SERIAL PRIMARY KEY, 
  suspect_id INT NOT NULL UNIQUE REFERENCES suspects(id) ON UPDATE CASCADE ON DELETE CASCADE,
  murder_reasons TEXT NOT NULL
);

CREATE TABLE solved (
    id SERIAL PRIMARY KEY,
    mystery_name TEXT NOT NULL REFERENCES mysteries(name) ON UPDATE CASCADE,
    user_id uuid NOT NULL REFERENCES auth.users(id) ON UPDATE CASCADE ON DELETE CASCADE,
    rating INTEGER CHECK (rating >= 0)
);

CREATE TABLE user_messages (
    user_id uuid PRIMARY KEY REFERENCES auth.users(id) ON UPDATE CASCADE ON DELETE CASCADE,
    amount INTEGER CHECK (amount >= 0) NOT NULL
);

CREATE TABLE user_mystery_conversations (
    id SERIAL PRIMARY KEY,
    user_id uuid REFERENCES auth.users(id) ON UPDATE CASCADE ON DELETE CASCADE,
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

CREATE TABLE user_mystery_info_messages (
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

ALTER TABLE mysteries 
  ENABLE ROW LEVEL SECURITY;

ALTER TABLE suspects
  ENABLE ROW LEVEL SECURITY;

ALTER TABLE murderers
  ENABLE ROW LEVEL SECURITY;

ALTER TABLE user_messages 
  ENABLE ROW LEVEL SECURITY;

ALTER TABLE user_mystery_conversations 
  ENABLE ROW LEVEL SECURITY;

ALTER TABLE user_mystery_messages 
  ENABLE ROW LEVEL SECURITY;

ALTER TABLE user_mystery_info_messages 
  ENABLE ROW LEVEL SECURITY;

ALTER TABLE user_subscriptions 
  ENABLE ROW LEVEL SECURITY;

ALTER TABLE subscription_tiers 
  ENABLE ROW LEVEL SECURITY;

ALTER TABLE solved
  ENABLE ROW LEVEL SECURITY;

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
    INSERT INTO user_messages (user_id, amount) VALUES (NEW.id, 5);
    RETURN NEW;
END;
$$;


CREATE OR REPLACE TRIGGER tr_insert_user_messages
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE FUNCTION add_user_to_user_messages();

CREATE OR REPLACE FUNCTION migrate_anonymous_user_to_new_user()
RETURNS TRIGGER 
security definer set search_path = public
AS $$
DECLARE
    new_user_id uuid;
    old_user_id uuid;
    is_anonymous BOOLEAN;
BEGIN
    -- Extract the old_user_id from the newly inserted user's metadata
    new_user_id := NEW.id;
    old_user_id := NEW.raw_user_meta_data->>'old_user_id';

    -- If old_user_id is not set, do nothing
    IF old_user_id IS NULL THEN
        RETURN NEW;
    END IF;

    -- Retrieve the anonymous flag from the old user's metadata
    SELECT raw_user_meta_data->>'anonymous' = 'true' INTO is_anonymous
    FROM auth.users
    WHERE id = old_user_id;

    -- If the old user is not anonymous, do nothing
    IF NOT is_anonymous THEN
        RETURN NEW;
    END IF;

        -- Update user_id in user_mystery_conversations
    UPDATE public.user_mystery_conversations
    SET user_id = new_user_id
    WHERE user_id = old_user_id;

        -- Delete the old user
    DELETE FROM auth.users
    WHERE id = old_user_id;


    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_migrate_anonymous_user
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE FUNCTION migrate_anonymous_user_to_new_user();


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
    end_date = CURRENT_DATE  
WHERE user_id = the_user_id AND active = TRUE;

INSERT INTO user_subscriptions(user_id, tier_id, start_date, end_date, active)
VALUES (
    the_user_id, 
    (SELECT tier_id FROM subscription_tiers WHERE stripe_price_id = price_id LIMIT 1), 
    CURRENT_DATE, 
    NULL,  
    TRUE
);

  UPDATE user_messages um
  SET amount = sub.daily_message_limit + um.amount
  FROM (
      SELECT us.user_id, st.daily_message_limit
      FROM user_subscriptions us
      JOIN subscription_tiers st ON us.tier_id = st.tier_id
      WHERE us.active = TRUE AND us.user_id = the_user_id
  ) AS sub
  WHERE um.user_id = sub.user_id;

$$ 
language sql volatile;

CREATE OR REPLACE FUNCTION update_daily_messages()
RETURNS VOID
LANGUAGE plpgsql AS $$
BEGIN

  UPDATE user_subscriptions
    SET active = FALSE
    WHERE end_date IS NOT NULL AND end_date < CURRENT_DATE;

    UPDATE user_messages um
    SET amount = sub.daily_message_limit 
    FROM (
        SELECT us.user_id, st.daily_message_limit
        FROM user_subscriptions us
        JOIN subscription_tiers st ON us.tier_id = st.tier_id
        WHERE us.active = TRUE
    ) AS sub
    WHERE um.user_id = sub.user_id;
END;
$$;

SELECT cron.schedule('update_daily_messages', '0 0 * * *', $$SELECT update_daily_messages();$$);