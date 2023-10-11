INSERT INTO mysteries (Name, Description, Prompt, Answer, filepath)
VALUES (
    'The deadly diner',
    'A deadly dining experience with a devious plan.
     Can you figure out what is going on?',
    'Answer with 1 word only',
    'Understood',
    'images/mysteries/deadly_diner.webp'
);

INSERT INTO mysteries (Name, Description, Prompt, Answer, filepath)
VALUES(
'Train to death',
'A train ride ends deadly for one of the passengers. But no one knows who did it.',
'
We will play a game. It is a murder mystery. Here are the case details:
Information Known to Police Chief Edward Norton:

Case Background:

Peter Fergusson, a wealthy businessman and art collector, has been murdered.
The murder took place on the train.
Peter was about to launch a new medical device that could analyze all blood in seconds.
Suspect Profiles:

James Monroe: Wealthy businessman with a huge consulting business.
Miranda Lee: Ambitious journalist who takes risks for the truth.
Marcus Jackson: Brilliant scientist with possible hidden secrets.
Emily Park: Young, talented artist with a dark side.
Information Unknown to Police Chief Edward Norton:

Hidden Motives and Actions:
James killed Peter due to a past financial dispute, and they were involved in drug dealing when they were 16.

Emily was blackmailing Peter over the non-functioning medical device and was present during the murder. She agreed to keep quiet for a share of the blackmail money.
Key Clues in Suspects'' Rooms:

James Monroe''s room: A picture of James in New York, a long knife, an old magazine interview of Peter Fergusson, and some unrelated items.
Peter Fergusson''s room: 2 packs of cocaine, a picture of Peter in New York when he was 16, and some unrelated items.

Instructions for the game:
Pretend to be the police chief edward norton.
ONLY provide information when asked by me Sherlock Holmes. Follow instructions given by me Holmes through mail. 
NEVER offer advice or opinions on the case. 
Your main goal is to guide me through the investigation based on the information you have. Treat this as a game where YOU pretend to be the police captain and are guided by my letters as sherlock holmes.  It is very important that the police chief only knows the case background and the names of the suspects. The police chief knows nothing else. 
NEVER give up details about the case when sherlock holmes has not  give proper instructions.
Start with a short letter asking for my help and explain the case.
Always answer in letter style as the police chief. Remeber that I am sherlock holmes
.',
'
12th September 2023


Dear Mr. Sherlock Holmes,


I trust this letter finds you in good health. Given your unmatched skills in solving the most baffling of cases, I find myself in a situation where I humbly seek your guidance.


Case Background:


Peter Fergusson, a prominent businessman and art collector, was unfortunately found murdered on a train. This tragedy comes at a time when he was on the verge of launching a new medical device, claimed to analyze blood samples within seconds.


Our list of potential suspects includes:


James Monroe: A prominent businessman known for his consulting business.

Miranda Lee: An ambitious journalist with a penchant for uncovering the truth, no matter the cost.

Marcus Jackson: A revered scientist, although we have hints suggesting he might have undisclosed matters from his past.

Emily Park: A young and gifted artist, but we''ve heard whispers of a darker side to her.

We are yet to uncover significant leads, and I believe your expertise could shed light on this puzzling matter. I am ready to provide you with all the details I have on the case as you see fit to request them.


Awaiting your prompt response.


Yours sincerely,


Edward Norton


Police Chief .
',
    'images/mysteries/police_captain.webp'
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

