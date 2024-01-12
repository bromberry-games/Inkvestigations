DROP FUNCTION create_subscription(the_user_id uuid, price_id text);

ALTER TABLE subscription_tiers
    DROP COLUMN daily_message_limit;

ALTER TABLE subscription_tiers
    DROP COLUMN name;

ALTER TABLE subscription_tiers
    DROP COLUMN description;

ALTER TABLE subscription_tiers RENAME COLUMN tier_id TO id;

ALTER TABLE subscription_tiers RENAME TO subscriptions;
ALTER TABLE user_subscriptions ALTER COLUMN tier_id SET NOT NULL;


CREATE TABLE daily_messages_subscriptions (
    sub_id INTEGER REFERENCES subscriptions(id) ON UPDATE CASCADE ON DELETE CASCADE PRIMARY KEY,
    daily_refill_amount INTEGER CHECK (daily_refill_amount >= 0) NOT NULL
);

CREATE TABLE usage_based_subscriptions (
    sub_id INTEGER REFERENCES subscriptions(id) ON UPDATE CASCADE ON DELETE CASCADE PRIMARY KEY,
    bundle_refill_amount INTEGER CHECK (bundle_refill_amount >= 0) NOT NULL
);

CREATE OR REPLACE FUNCTION create_subscription(the_user_id uuid, price_ids text[])
RETURNS void AS
$$
DECLARE
    price_id text;
BEGIN
    UPDATE user_subscriptions
    SET active = FALSE, 
        end_date = CURRENT_DATE  
    WHERE user_id = the_user_id AND active = TRUE;

    FOREACH price_id IN ARRAY price_ids LOOP
        INSERT INTO user_subscriptions(user_id, tier_id, start_date, end_date, active)
        VALUES (
            the_user_id, 
            (SELECT id FROM subscriptions WHERE stripe_price_id = price_id), 
            CURRENT_DATE, 
            NULL,  
            TRUE
        );
    END LOOP;

    -- Update user_messages for daily message subscriptions
    UPDATE user_messages um
    SET amount = dms.daily_refill_amount + um.amount
    FROM daily_messages_subscriptions dms
    WHERE dms.sub_id IN (
        SELECT tier_id 
        FROM user_subscriptions 
        WHERE active = TRUE AND user_id = the_user_id
    ) AND um.user_id = the_user_id;

EXCEPTION
    WHEN OTHERS THEN
        ROLLBACK;
        RAISE;
END;
$$ 
LANGUAGE plpgsql VOLATILE;

CREATE OR REPLACE FUNCTION set_test_subscription()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    -- Insert into user_subscriptions with a tier_id selected from subscriptions
    -- based on a given stripe_price_id. Adjust the subquery according to your schema.
    INSERT INTO user_subscriptions(user_id, tier_id, start_date, end_date, active)
    VALUES (
        NEW.id, 
        (SELECT id FROM subscriptions WHERE stripe_price_id = 'test_1' LIMIT 1), 
        CURRENT_DATE, 
        NULL,  
        TRUE
    );
    RETURN NEW;
END;
$$;



--- function to update daily messages from stripe product data
SELECT content
  FROM http((
          'GET',
           'https://api.stripe.com/v1/products',
           ARRAY[http_header('Authorization','Bearer TODO')],
           NULL,
           NULL
        )::http_request);