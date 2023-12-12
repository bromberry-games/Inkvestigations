INSERT INTO mysteries 
(name, description, theme, setting, letter_info, letter_prompt, accuse_letter_prompt, suspects, action_clues, timeframe, murderer, victim_name, victim_description, filepath) 
VALUES (
'Mirror Mirror',
'A journalist is found dead. But nobody knows what happened.',
'pride and shame',
'England in the 1930s',
$$
Michael Terry, a prominent resident, met a bizarre and gruesome end – thrown through the mirror in his own study. The timing of this macabre incident is uncanny, as it occurred just before a meeting with the disgraced politician, Dexter Tin, who had a score to settle with Terry. No signs of forced entry, no struggle, and a method that defies logic – this is no ordinary crime. We have a web of connections, including Terry's best friend Bianca White, his devoted fan turned apprentice Oliver Smith, and his long-time maid Maria Payton. On top of that, there's the rivalry with columnist Angela Videl and the retired detective, Peter O'Ranner, who occasionally assisted Terry.
$$,
$$
Your name is William Wellington, the police chief of Zlockingbury. You live in a moderately sized city set in the beginning of the 20th century in England. You talk like a noir cop and use metaphors often. Michael Terry was found dead, thrown through the mirror in his study. His maid called the police, but before we had arrived, the politician Dexter Tin was there. He was supposed to have a meeting with Terry. Three days prior, Terry held a party at his house, but between then and his death he should have been alone until his appointment with Mr. Tin. There is no sign of struggle or forced entry, but a suicide is unlikely because the method is so gruesome and strange.
$$,
$$
Your name is William Wellington, the police chief of Zlockingbury. You live in a moderately sized city set in the beginning of the 20th century in England. You talk like a noir cop and use metaphors often. Michael Terry was found dead, thrown through the mirror in his study. His maid called the police, but before we had arrived, the politician Dexter Tin was there. He was supposed to have a meeting with Terry. Three days prior, Terry held a party at his house, but between then and his death he should have been alone until his appointment with Mr. Tin. There is no sign of struggle or forced entry, but a suicide is unlikely because the method is so gruesome and strange. 
$$,
ARRAY[
        ROW('Bianca White', 'bianca_white.webp', 'Best friend of Michael Terry. Once wanted to be a journalist but now works in marketing.')::suspect_type,
        ROW('Dexter Tin', 'dexter_tin.webp', 'Politician who was disgraced by Michael Terry.')::suspect_type,
        ROW('Maria Payton', 'maria_payton.webp', 'Long-time maid of Michael Terry.')::suspect_type,
        ROW('Angela Videl', 'angela_videl.webp', 'Rival columnist to Michael Terry.')::suspect_type,
        ROW('Peter O''Ranner', 'peter_oranner.webp', 'Retired detective who occasionally assisted Michael Terry with his articles.')::suspect_type
    ],
ARRAY[
        ('Interrogating the suspects', 'generic responses, none refer to anything below this point'),
        ('Searching the study', 'a bottle of medication for hair-regrowth; a trash can full of discarded drafts; a half-written piece on uncovering the dealings of a mafia boss; letters shaping that Tin was not involved in the conspiracy Terry published; Terry''s desk with everything he needs to write and his favorite ink pen; a drawer full of fan letters; fingerprints of all people close to him'),
        ('Inspecting the half-written piece', 'it is an expose, but none of the names are known in the country'),
        ('Inspecting the Tin letters', 'they just show his innocence from an objective observer, but have his fingerprints all over them'),
        ('Inspecting fan letters', 'different fans praising him for different things. A lot are from Oliver from when he was still a fan. The recent ones have the distinct smudge Terry''s pen leaves when writing, as if he wrote some himself'),
        ('Asking about the similarity of Oliver''s letters and Terry''s drafts', 'they are using the same pen'),
        ('Autopsy', 'he was poisoned with cyanide; in his stomach a pill was found; he had a blue tongue, probably from his famous habit of licking his pen, he probably fell through the mirror after dying'),
        ('Analyzing pills', 'all ordinary'),
        ('Analyzing pen', 'gelatin and traces of cyanide in the inkwell'),
        ('Asking about the gelatin', 'it is common for pills to be encased in gelatin, but this is much more than a normal pill, it would have taken a lot longer to dissolve'),
        ('Asking how often Terry refilled the inkwell', 'with his writing speed every two days probably'),
        ('Ask for alibis', 'Bianca was on a trip, but talked to Terry over the phone; Tin was busy with his political obligations; Oliver was at home writing a piece'),
        ('Searching Oliver''s apartment', 'a normal apartment, but for the fact that he has the same pen as Terry twice')
    ]::action_clue_type[],
  ARRAY[
        ('Friday evening', 'party with his friends'),
        ('Saturday morning', 'guests who stayed over leave his house early in the morning. Terry recovers from his hangover.'),
        ('Sunday', 'Terry is alone writing'),
        ('Monday', 'Around noon, the maid finds Terry dead, fallen through the mirror in his study. Dexter Tin arrives.')
    ]::timeframe_type[],
(
    'Oliver Smith',
    'Biggest fan before becoming his apprentice',
    'oliver_smith.webp',
    'Fanaticism for journalism and its ethics that was deeply hurt when he realized his hero and mentor, Michael Terry was in it more for the drama than the truth.',
    'After sleeping over after the party, he had time to slip into the study and place the poison in the inkwell and because he was the assistant, nobody bat an eye.',
    'The second pen in his home with traces of cyanide.'
)::murderer_type,
'Michael Terry',
'Reputation as a rockstar journalist, but rumored to not always follow the truth, or at least embellish a little. Recently he privately started writing fiction without anybody knowing.',
'images/mysteries/mirror_mirror.webp'
);

INSERT INTO subscription_tiers (name, description, daily_message_limit, stripe_price_id)
VALUES
(
    'Rookie',
    'For those who are new to the game',
    10,
    'price_1NgTQsKIDbJkcynJPpFoFZNz'
);
INSERT INTO subscription_tiers (name, description, daily_message_limit, stripe_price_id)
VALUES
(
    'Detective',
    'For moderate players',
    20,
    'price_1Ng9UfKIDbJkcynJYsE9jPMZ'
);
INSERT INTO subscription_tiers (name, description, daily_message_limit, stripe_price_id)
VALUES
(
    'Chief',
    'For the most experienced players',
    30,
    'price_1NgSRVKIDbJkcynJkhJJb1E3'
);
INSERT INTO subscription_tiers (name, description, daily_message_limit, stripe_price_id)
VALUES
(
    'TEST',
    'Just for testing',
    5,
    'test_1'
);

DELETE FROM auth.users;
alter table auth.identities alter column provider_id drop not null;

DO $$
DECLARE
    email text := 'test@mail.com';
    password text := 'password';
    user_id uuid;
    encrypted_pw text;
BEGIN
    user_id := gen_random_uuid();
    encrypted_pw := crypt(password, gen_salt('bf'));

    INSERT INTO auth.users
        (instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, recovery_sent_at, last_sign_in_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at, confirmation_token, email_change, email_change_token_new, recovery_token)
    VALUES
        ('00000000-0000-0000-0000-000000000000', user_id, 'authenticated', 'authenticated', email, encrypted_pw, '2023-05-03 19:41:43.585805+00', '2023-04-22 13:10:03.275387+00', '2023-04-22 13:10:31.458239+00', '{"provider":"email","providers":["email"]}', '{}', '2023-05-03 19:41:43.580424+00', '2023-05-03 19:41:43.585948+00', '', '', '', '');

    INSERT INTO auth.identities (id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at)
    VALUES
        (gen_random_uuid(), user_id, format('{"sub":"%s","email":"%s"}', user_id::text, email)::jsonb, 'email', '2023-05-03 19:41:43.582456+00', '2023-05-03 19:41:43.582497+00', '2023-05-03 19:41:43.582497+00');
END;
$$ LANGUAGE plpgsql;

DO $$
DECLARE
    email text := 'test-only-user@mail.com';
    password text := 'password-test-user';
    user_id uuid;
    encrypted_pw text;
BEGIN
    user_id := gen_random_uuid();
    encrypted_pw := crypt(password, gen_salt('bf'));

    INSERT INTO auth.users
        (instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, recovery_sent_at, last_sign_in_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at, confirmation_token, email_change, email_change_token_new, recovery_token)
    VALUES
        ('00000000-0000-0000-0000-000000000000', user_id, 'authenticated', 'authenticated', email, encrypted_pw, '2023-05-03 19:41:43.585805+00', '2023-04-22 13:10:03.275387+00', '2023-04-22 13:10:31.458239+00', '{"provider":"email","providers":["email"]}', '{}', '2023-05-03 19:41:43.580424+00', '2023-05-03 19:41:43.585948+00', '', '', '', '');

    INSERT INTO auth.identities (id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at)
    VALUES
        (gen_random_uuid(), user_id, format('{"sub":"%s","email":"%s"}', user_id::text, email)::jsonb, 'email', '2023-05-03 19:41:43.582456+00', '2023-05-03 19:41:43.582497+00', '2023-05-03 19:41:43.582497+00');
END;
$$ LANGUAGE plpgsql;

update public.user_messages
set
  amount = amount + 15
where
  user_id = (
    select
      id
    from
      auth.users
    where
      email = 'test-only-user@mail.com'
  );