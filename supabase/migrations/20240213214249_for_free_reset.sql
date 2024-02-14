CREATE OR REPLACE FUNCTION update_for_free_users()
RETURNS VOID
LANGUAGE plpgsql AS $$
BEGIN
    UPDATE for_free_users
        SET current_amount = daily_limit WHERE id = 1;
END;
$$;

SELECT cron.schedule('update_for_free_users', '0 0 * * *', $$SELECT update_for_free_users();$$);