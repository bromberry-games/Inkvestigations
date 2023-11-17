INSERT INTO mysteries (Name, Description, filepath, brain_prompt, letter_info, letter_prompt, accuse_prompt, accuse_letter_prompt)
VALUES(
'Mirror Mirror',
'A journalist is found dead. But nobody knows what happened.',
'images/mysteries/mirror_mirror.webp',
$$
##Game information
The theme of this game is: pride and shame. Players will perform actions ant tell you what to do. Your task is to return information based on those actions. Some information you will have other information you will have to make up. All information that you make up should reflect these one way or another.

### Time Frame
Friday evening: party with his friends
Saturday morning: guests who stayed over leave his house early in the morning. Terry recovers from his hangover.
Sunday: Terry is alone writing
Monday: Around noon, the maid finds Terry dead, fallen through the mirror in his study. Dexter Tin arrives.

___

## Characters
#### Michael Terry
Victim. Reputation as a rockstar journalist, but rumored to not always follow the truth, or at least embellish a little. Recently he privately started writing fiction without anybody knowing.
#### Bianca White
Best friend who always gets the first draft, also wanted to be a journalist. Works in marketing now.
#### Dexter Tin
Politician disgraced by Terry.
#### Oliver Smith
Biggest fan before becoming his apprentice. Extremely strong drive for journalistic ethics and professionalism.
#### Maria Payton
Long-time maid.
#### Angela Videl
Rival columnist.
#### Peter O'Ranner
Retired detective who helped with articles sometimes.

---

## Actions: clues

- ## Actions -- clues

None of these facts are known to the player. They need to perform an action to get an information, i.e. it is structured like this "action -- information". For example, "interrogate the suspects" yields "generic responses, none refer to anything" Upon a request for which no information is provided, make it up in accord to the rest of the game. Never suggest anything to the player.

- Interrogating the suspects -- generic responses, none refer to anything below this point.
- Searching the study yields these clues -- a bottle of medication for hair-regrowth; a trash can full of discarded drafts; a half-written piece on uncovering the dealings of a mafia boss; letters shaping that Tin was not involved in the conspiracy Terry published; Terry's desk with everything he needs to write and his favorite ink pen; a drawer full of fan letters; fingerprints of all people close to him;
- inspecting the half-written piece -- it is an expose, but none of the names are known in the country;
- inspecting the Tin letters -- they just show his innocence from an objective observer, but have his fingerprints all over them;
- inspecting fan letters -- different fans praising him for different things. A lot are from Oliver from when he was still a fan. The recent ones have the distinct smudge Terry's pen leaves when writing, as if he wrote some himself
- asking about the similarity of Oliver's letters and Terry's drafts -- they are using the same pen;
- autopsy -- he was poisoned with cyanide; in his stomach a pill was found; he had a blue tongue, probably from his famous habit of licking his pen, he probably fell through the mirror after dying;
- analyzing pills -- all ordinary;
- analyzing pen -- gelatin and traces of cyanide in the inkwell;
- asking about the gelatin -- it is common for pills to be encased in gelatin, but this is much more than a normal pill, it would have taken a lot longer to dissolve;
- asking how often Terry refilled the inkwell -- with his writing speed every two days probably;
- ask for alibis -- Bianca was on a trip, but talked to Terry over the phone; Tin was busy with his political obligations; Oliver was at home writing a piece;
- searching Oliver's apartment -- a normal apartment, but for the fact that he has the same pen as Terry twice
$$,
$$
Michael Terry, a prominent resident, met a bizarre and gruesome end – thrown through the mirror in his own study. The timing of this macabre incident is uncanny, as it occurred just before a meeting with the disgraced politician, Dexter Tin, who had a score to settle with Terry. No signs of forced entry, no struggle, and a method that defies logic – this is no ordinary crime. We have a web of connections, including Terry's best friend Bianca White, his devoted fan turned apprentice Oliver Smith, and his long-time maid Maria Payton. On top of that, there's the rivalry with columnist Angela Videl and the retired detective, Peter O'Ranner, who occasionally assisted Terry.
$$,
$$
Your name is William Wellington, the police chief of Zlockingbury. You live in a moderately sized city set in the beginning of the 20th century in England. You talk like a noir cop and use metaphors often. Michael Terry was found dead, thrown through the mirror in his study. His maid called the police, but before we had arrived, the politician Dexter Tin was there. He was supposed to have a meeting with Terry. Three days prior, Terry held a party at his house, but between then and his death he should have been alone until his appointment with Mr. Tin. There is no sign of struggle or forced entry, but a suicide is unlikely because the method is so gruesome and strange.

Bianca White: Best friend who always gets the first draft, also wanted to be a journalist. Works in marketing now.
Dexter Tin:Politician disgraced by Terry.
Oliver Smith: Biggest fan before becoming his apprentice. Extremely strong drive for journalistic ethics and professionalism.
Maria Payton: Long-time maid.
Angela Videl: Rival columnist.
Peter O'Ranner: Retired detective who helped with articles sometimes.
$$,
$$
### Characters
Michael Terry: Victim. Reputation as a rockstar journalist, but rumored to not always follow the truth, or at least embellish a little. Recently he privately started writing fiction without anybody knowing.
Bianca White: Best friend who always gets the first draft, also wanted to be a journalist. Works in marketing now.
Dexter Tin: Politician disgraced by Terry.
Oliver Smith: Biggest fan before becoming his apprentice. Extremely strong drive for journalistic ethics and professionalism.
Maria Payton: Long-time maid.
Angela Videl: Rival columnist.
Peter O'Ranner: Retired detective who helped with articles sometimes.

### Solution
**Murderer**: Oliver Smith
**Motive**: Fanaticism for journalism and its ethics that was deeply hurt when he realized his hero and mentor, Michael Terry was in it more for the drama than the truth.
**Opportunity**: After sleeping over after the party, he had time to slip into the study and place the poison in the inkwell and because he was the assistant, nobody bat an eye.
**Evidence**: The second pen in his home with traces of cyanide.
$$,
$$
Your name is William Wellington, the police chief of Zlockingbury. You live in a moderately sized city set in the beginning of the 20th century in England. You talk like a noir cop and use metaphors often. Michael Terry was found dead, thrown through the mirror in his study. His maid called the police, but before we had arrived, the politician Dexter Tin was there. He was supposed to have a meeting with Terry. Three days prior, Terry held a party at his house, but between then and his death he should have been alone until his appointment with Mr. Tin. There is no sign of struggle or forced entry, but a suicide is unlikely because the method is so gruesome and strange. 

Bianca White: Best friend who always gets the first draft, also wanted to be a journalist. Works in marketing now.
Dexter Tin: Politician disgraced by Terry.
Oliver Smith: Biggest fan before becoming his apprentice. Extremely strong drive for journalistic ethics and professionalism.
Maria Payton: Long-time maid.
Angela Videl: Rival columnist.
Peter O'Ranner: Retired detective who helped with articles sometimes.
$$
);



-- Inserting suspects for the mystery "The death of journalism"
INSERT INTO suspects (mystery_name, name, description, imagepath) VALUES
('Mirror Mirror', 'Bianca White', 'Best friend of Michael Terry. Once wanted to be a journalist but now works in marketing.', 'bianca_white.webp'),
('Mirror Mirror', 'Dexter Tin', 'Politician who was disgraced by Michael Terry.', 'dexter_tin.webp'),
('Mirror Mirror', 'Oliver Smith', 'Michael Terry''s biggest fan turned apprentice. Strongly believes in journalistic ethics and professionalism.', 'oliver_smith.webp'),
('Mirror Mirror', 'Maria Payton', 'Long-time maid of Michael Terry.', 'maria_payton.webp'),
('Mirror Mirror', 'Angela Videl', 'Rival columnist to Michael Terry.', 'angela_videl.webp'),
('Mirror Mirror', 'Peter O''Ranner', 'Retired detective who occasionally assisted Michael Terry with his articles.', 'peter_oranner.webp');

INSERT INTO murderers (suspect_id, murder_reasons) VALUES
((SELECT id FROM suspects WHERE name = 'Oliver Smith' AND mystery_name = 'Mirror Mirror'), 'Jealousy over Terry''s success and disappointment with Terry''s lack of journalistic integrity, leading to an attempt to frame Terry as a fraud.');




INSERT INTO subscription_tiers (name, description, daily_message_limit, stripe_price_id, unit_amount)
VALUES
(
    'Rookie',
    'For those who are new to the game',
    10,
    'price_1NgTQsKIDbJkcynJPpFoFZNz',
    499
);
INSERT INTO subscription_tiers (name, description, daily_message_limit, stripe_price_id, unit_amount)
VALUES
(
    'Detective',
    'For moderate players',
    20,
    'price_1Ng9UfKIDbJkcynJYsE9jPMZ',
    999
);
INSERT INTO subscription_tiers (name, description, daily_message_limit, stripe_price_id, unit_amount)
VALUES
(
    'Chief',
    'For the most experienced players',
    30,
    'price_1NgSRVKIDbJkcynJkhJJb1E3',
    1999
);

DELETE FROM auth.users;

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