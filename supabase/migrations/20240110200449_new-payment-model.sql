-- TODO: Drop old subscription table and create new one
-- also create the new functions
ALTER TABLE subscription_tiers
    DROP COLUMN daily_message_limit;

ALTER TABLE subscription_tiers
    DROP COLUMN name;

ALTER TABLE subscription_tiers
    DROP COLUMN description;

ALTER TABLE subscription_tiers RENAME COLUMN tier_id TO id;


CREATE TABLE daily_messages_subscriptions (
    price_id INTEGER REFERENCES subscription_tiers(id) ON UPDATE CASCADE ON DELETE CASCADE PRIMARY KEY,
    daily_refill_amount INTEGER CHECK (daily_refill_amount >= 0) NOT NULL,
)

CREATE TABLE usage_based_subscriptions (
    price_id INTEGER REFERENCES subscription_tiers(id) ON UPDATE CASCADE ON DELETE CASCADE PRIMARY KEY,
    bundle_refill_amount INTEGER CHECK (bundle_refill_amount >= 0) NOT NULL,
)