CREATE TABLE for_free_users (
    id SERIAL PRIMARY KEY,
    amount INTEGER CHECK (amount >= 0) NOT NULL,
    daily_limit INTEGER CHECK (daily_limit >= 0) NOT NULL
);

ALTER TABLE for_free_users
    ENABLE ROW LEVEL SECURITY;

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

    UPDATE for_free_users
        SET current_amount = daily_limit WHERE id = 1;
END;
$$;

SELECT cron.schedule('update_daily_messages', '0 0 * * *', $$SELECT update_daily_messages();$$);

create function decrement_for_free_users() 
returns void as
$$
  update for_free_users
  set amount = amount - 1 where id = 1;
$$ 
language sql volatile;
