
CREATE OR REPLACE FUNCTION update_for_free_users()
RETURNS VOID
LANGUAGE plpgsql AS $$
BEGIN
    UPDATE for_free_users
        SET amount = daily_limit WHERE id = 1;
END;
$$;