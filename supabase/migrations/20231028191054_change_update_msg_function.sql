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