create extension http
with
  schema extensions;

DROP TABLE user_subscriptions;
DROP TABLE subscription_tiers;
DROP FUNCTION create_subscription(the_user_id uuid, price_id text);
DROP FUNCTION update_daily_messages();
DROP FUNCTION update_subscription(stripe_customer text, price_id text);
DROP TRIGGER tr_set_test_subscription ON auth.users;
SELECT cron.unschedule('update_daily_messages');

CREATE TYPE product_type AS (
  product_id TEXT,
  metered_si TEXT
);


-- as long as end_date is null it means it's active
-- if end_date is not null but less than today the paid subscription is still provisioned
-- however the pay as you go model is no longer supported
CREATE TABLE user_subs(
    sub_id TEXT PRIMARY KEY, 
    user_id uuid NOT NULL REFERENCES auth.users(id) ON UPDATE CASCADE ON DELETE CASCADE,
    products product_type[] NOT NULL,
    end_date DATE DEFAULT NULL,
    access_codes TEXT
);

ALTER TABLE user_subs ENABLE ROW LEVEL SECURITY;


-- Storing access codes is not that nice. Better is to store all stripe products and then reference their data
-- This should be done eventually and should be possible with webhooks
ALTER TABLE mysteries ADD COLUMN access_code TEXT DEFAULT 'free' NOT NULL;


CREATE OR REPLACE FUNCTION update_user_messages()
RETURNS void AS $$
BEGIN
	-- free messages amount. Should be made variable
	UPDATE user_messages
    SET amount = 5;
    -- Create temporary table
    CREATE TEMPORARY TABLE temp_stripe_products AS
    SELECT id, daily_messages::integer
    FROM (
        SELECT 
            json_array_elements(content::json->'data')->>'id' as id,
            json_array_elements(content::json->'data')->'metadata'->>'daily_messages' as daily_messages
        FROM http((
            'GET',
            'https://api.stripe.com/v1/products?active=true',
            ARRAY[http_header('Authorization', 'Bearer ' || (SELECT decrypted_secret FROM vault.decrypted_secrets WHERE name = 'stripe_key'))],
            NULL,
            NULL
        )::http_request)
    ) as subquery
    WHERE daily_messages is not null;

    -- Update user messages
    WITH aggregated_messages AS (
    SELECT 
        us.user_id, 
        COALESCE(SUM(tp.daily_messages), 0) AS total_daily_messages
    FROM 
        user_subs us
    CROSS JOIN LATERAL 
        unnest(us.products) AS product_id
    LEFT JOIN 
        temp_stripe_products tp ON tp.id = product_id.product_id
    GROUP BY 
        us.user_id
    )
    UPDATE user_messages
    SET amount = am.total_daily_messages
    FROM aggregated_messages am
    WHERE user_messages.user_id = am.user_id;

    -- Drop temporary table
    DROP TABLE temp_stripe_products;

EXCEPTION
    WHEN OTHERS THEN
        RAISE;
END;
$$ LANGUAGE plpgsql;

SELECT cron.schedule('update_user_messages', '0 0 * * *', $$SELECT update_user_messages();$$);

create or replace function set_daily_messages_for_user(the_user_id uuid, daily_amount integer) 
returns void as
$$
  update user_messages
  set amount = daily_amount
  where user_id = the_user_id and amount < daily_amount
$$ 
language sql volatile;
