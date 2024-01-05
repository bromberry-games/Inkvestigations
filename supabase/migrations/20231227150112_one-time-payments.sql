ALTER TABLE user_messages ADD COLUMN non_refillable_amount int default 0 NOT NULL check (non_refillable_amount >= 0);

CREATE OR REPLACE FUNCTION decrement_message_for_user(the_user_id uuid)
RETURNS void AS
$$
BEGIN
    UPDATE user_messages
    SET amount = amount - 1
    WHERE user_id = the_user_id AND amount > 0;

    IF NOT FOUND THEN
        UPDATE user_messages
        SET non_refillable_amount = non_refillable_amount - 1
        WHERE user_id = the_user_id;
    END IF;
END;
$$ 
LANGUAGE plpgsql VOLATILE;

create or replace function increase_message_for_user_by_amount(the_user_id uuid, increase integer) 
returns void as
$$
  update user_messages
  set non_refillable_amount = non_refillable_amount + increase
  where user_id = the_user_id
$$ 
language sql volatile;