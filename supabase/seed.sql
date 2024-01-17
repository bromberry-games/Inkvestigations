INSERT INTO mysteries 
(name, description, theme, setting, letter_info, letter_prompt, accuse_letter_prompt, murderer, victim_name, victim_description, filepath) 
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

INSERT INTO suspects (mystery_id, name, imagepath, description)
VALUES
((SELECT id FROM mysteries WHERE name = 'Mirror Mirror'), 'Bianca White', 'bianca_white.webp', 'Best friend of Michael Terry. Once wanted to be a journalist but now works in marketing.'),
((SELECT id FROM mysteries WHERE name = 'Mirror Mirror'), 'Dexter Tin', 'dexter_tin.webp', 'Politician who was disgraced by Michael Terry.'),
((SELECT id FROM mysteries WHERE name = 'Mirror Mirror'), 'Maria Payton', 'maria_payton.webp', 'Long-time maid of Michael Terry.'),
((SELECT id FROM mysteries WHERE name = 'Mirror Mirror'), 'Angela Videl', 'angela_videl.webp', 'Rival columnist to Michael Terry.'),
((SELECT id FROM mysteries WHERE name = 'Mirror Mirror'), 'Peter O''Ranner', 'peter_oranner.webp', 'Retired detective who occasionally assisted Michael Terry with his articles.');

INSERT INTO action_clues (mystery_id, action, clue)
VALUES
((SELECT id FROM mysteries WHERE name = 'Mirror Mirror'), 'Interrogating the suspects', 'generic responses, none refer to anything below this point'),
((SELECT id FROM mysteries WHERE name = 'Mirror Mirror'), 'Searching the study', 'a bottle of medication for hair-regrowth; a trash can full of discarded drafts; a half-written piece on uncovering the dealings of a mafia boss; letters shaping that Tin was not involved in the conspiracy Terry published; Terry''s desk with everything he needs to write and his favorite ink pen; a drawer full of fan letters; fingerprints of all people close to him'),
((SELECT id FROM mysteries WHERE name = 'Mirror Mirror'), 'Inspecting the half-written piece', 'it is an expose, but none of the names are known in the country'),
((SELECT id FROM mysteries WHERE name = 'Mirror Mirror'), 'Inspecting the Tin letters', 'they just show his innocence from an objective observer, but have his fingerprints all over them'),
((SELECT id FROM mysteries WHERE name = 'Mirror Mirror'), 'Inspecting fan letters', 'different fans praising him for different things. A lot are from Oliver from when he was still a fan. The recent ones have the distinct smudge Terry''s pen leaves when writing, as if he wrote some himself'),
((SELECT id FROM mysteries WHERE name = 'Mirror Mirror'), 'Asking about the similarity of Oliver''s letters and Terry''s drafts', 'they are using the same pen'),
((SELECT id FROM mysteries WHERE name = 'Mirror Mirror'), 'Autopsy', 'he was poisoned with cyanide; in his stomach a pill was found; he had a blue tongue, probably from his famous habit of licking his pen, he probably fell through the mirror after dying'),
((SELECT id FROM mysteries WHERE name = 'Mirror Mirror'), 'Analyzing pills', 'all ordinary'),
((SELECT id FROM mysteries WHERE name = 'Mirror Mirror'), 'Analyzing pen', 'gelatin and traces of cyanide in the inkwell'),
((SELECT id FROM mysteries WHERE name = 'Mirror Mirror'), 'Asking about the gelatin', 'it is common for pills to be encased in gelatin, but this is much more than a normal pill, it would have taken a lot longer to dissolve'),
((SELECT id FROM mysteries WHERE name = 'Mirror Mirror'), 'Asking how often Terry refilled the inkwell', 'with his writing speed every two days probably'),
((SELECT id FROM mysteries WHERE name = 'Mirror Mirror'), 'Ask for alibis', 'Bianca was on a trip, but talked to Terry over the phone; Tin was busy with his political obligations; Oliver was at home writing a piece'),
((SELECT id FROM mysteries WHERE name = 'Mirror Mirror'), 'Searching Oliver''s apartment', 'a normal apartment, but for the fact that he has the same pen as Terry twice');

INSERT INTO timeframes (mystery_id, timeframe, event_happened)
VALUES
((SELECT id FROM mysteries WHERE name = 'Mirror Mirror'), 'Friday evening', 'party with his friends'),
((SELECT id FROM mysteries WHERE name = 'Mirror Mirror'), 'Saturday morning', 'guests who stayed over leave his house early in the morning. Terry recovers from his hangover.'),
((SELECT id FROM mysteries WHERE name = 'Mirror Mirror'), 'Sunday', 'Terry is alone writing'),
((SELECT id FROM mysteries WHERE name = 'Mirror Mirror'), 'Monday', 'Around noon, the maid finds Terry dead, fallen through the mirror in his study. Dexter Tin arrives.');




-- INSERT INTO subscriptions(stripe_price_id)
-- VALUES
-- (
--     'price_1Ng9UfKIDbJkcynJYsE9jPMZ'
-- );
-- INSERT INTO daily_messages_subscriptions(sub_id, daily_refill_amount)
-- VALUES
-- (
--     (SELECT id FROM subscriptions WHERE stripe_price_id = 'price_1Ng9UfKIDbJkcynJYsE9jPMZ'),
--     10
-- );
-- 
-- INSERT INTO subscriptions(stripe_price_id)
-- VALUES
-- (
--     'test_1'
-- );
-- INSERT INTO daily_messages_subscriptions(sub_id, daily_refill_amount)
-- VALUES
-- (
--     (SELECT id FROM subscriptions WHERE stripe_price_id = 'test_1'),
--     5
-- );
-- 
-- INSERT INTO subscriptions(stripe_price_id)
-- VALUES
-- (
--     'price_1OX1RjKIDbJkcynJBNwlgnJ2' -- for combo
-- );
-- 
-- INSERT INTO subscriptions(stripe_price_id)
-- VALUES
-- (
--     'price_1OX3PyKIDbJkcynJ84FAWIsv' --free tier
-- );


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

Insert INTO for_free_users (amount, daily_limit) VALUES (5, 5);

INSERT INTO mysteries (name, description, theme, setting, letter_info, letter_prompt, accuse_letter_prompt, murderer, victim_name, victim_description, filepath) VALUES (
    'Forced Farewell',
    'A boy is found missing.',
    'pride and shame',
    'England in the 1800s',
    $$
I hope this letter finds you well and swiftly. My name is William Wellington, and I am the chief constable in our little town of Romsey. I write to you personally because we have read of your success in the case of the murders of Drebber and Stangerson in the papers. I confess, however, that what I am writing to you about is nothing like what you have encountered in London. A boy, John Toillard, the age of thirteen, was stolen from his home. The boy is Lord Baron Toillard's heir, so you understand if I'm writing to you with great urgency. I dearly hope you will read on and lend your mind so that we may solve this quickly.

On the morn of Thursday July 14th, Lord Toillard and his family left their estate for a social function in the city. John Toillard was left at home because he was feeling unwell, a catarrh coming on, seemingly. It was not serious according to them, but as it was out of season they feared something worse and Lord Toillard left his son to recover under the care of their butler, Jessob.

They left their estate around 10AM, and were attending a garden party with the local gentry, here in Romsey. Around 3PM a messenger hurried to them and gave them an urgent message from the butler. The message described that the butler had gone to attend another duty, and then the subsequent state of the house once he returned. After a thorough search he failed to locate the boy. He did, however, find a note demanding a ransom of £13,2; a peculiar sum indeed. Lord Toillard contacted me. I contacted you immediately after seeing the home with my own eyes.

The article said you make quick work of mysteries by simply reading or hearing about it. I hope what they write is true and that your deductive analysis matches the praise.
$$,
$$
Your name is William Wellington and you are the chief constable of Romsey, a small town in the south of England. And your writing should reflect the period, use the style of Arthur Conan Doyle as inspiration. It is 1889 in Victorian era England. John Toillard, a boy the age of 13, has been abducted. His father is Lord Baron Charles Toillard, so it is especially urgent. On the morn of Thursday July 14th, Lord Toillard and his family left their estate for a social function in the city. John Toillard was left at home because he was feeling unwell, a catarrh coming on, seemingly. It was not serious according to them, but as it was out of season they feared something worse and Lord Toillard left his son to recover under the care of their butler, Jessob.

They left their estate around 10AM, and were attending a garden party with the local gentry, here in Romsey. Around 3PM the local doctor hurried to them and gave them an urgent message from the butler. The message described he had left to fetch the doctor, and then the subsequent state of the house once they returned. After a thorough search they failed to locate the boy. They did, however, find a note demanding a ransom of £13,2; a peculiar sum indeed. Lord Toillard contacted you immediately, and you wrote Sherlock as soon as you saw the mansion yourself.

John Toillard: kidnapped. A 13 year old boy with his head in the clouds, often fantasizing about different lives.

Lord Baron Charles Toillard: A newly titled baron for achievements in diplomacy helping prisoners of war to escape. Since his title has become a drunkard and gambler. Prone to impulsivity like hitting family members. He is completely broke!

Lady Adelia Toillard: From lower nobility family. Sullen and withdrawn, kind to her children. Spends a lot of time with them because there are no servants except the butler.

Butler Jessob: A long-time butler and good friend of the family. Loves the children.

Doctor Jameson: Local doctor.

William "The Lad" Johnson: Local moneylender.

Joseph Strickmeyer: Burgler and overall no-good kind of guy and very stupid. Police always thinks of this man first whenever something is suspicious.
$$,
$$
Your name is William Wellington and you are the chief constable of Romsey, a small town in the south of England. And your writing should reflect the period, use the style of Arthur Conan Doyle as inspiration. It is 1889 in Victorian era England. John Toillard, a boy the age of 13, has been abducted. His father is Lord Baron Charles Toillard, so it is especially urgent. On the morn of Thursday July 14th, Lord Toillard and his family left their estate for a social function in the city. John Toillard was left at home because he was feeling unwell, a catarrh coming on, seemingly. It was not serious according to them, but as it was out of season they feared something worse and Lord Toillard left his son to recover under the care of their butler, Jessob.

They left their estate around 10AM, and were attending a garden party with the local gentry, here in Romsey. Around 3PM the local doctor hurried to them and gave them an urgent message from the butler. The message described he had left to fetch the doctor, and then the subsequent state of the house once they returned. After a thorough search they failed to locate the boy. They did, however, find a note demanding a ransom of £13,2; a peculiar sum indeed. Lord Toillard contacted you immediately, and you wrote Sherlock as soon as you saw the mansion yourself.

John Toillard: kidnapped. A 13 year old boy with his head in the clouds, often fantasizing about different lives.

Lord Baron Charles Toillard: A newly titled baron for achievements in diplomacy helping prisoners of war to escape. Since his title has become a drunkard and gambler. Prone to impulsivity like hitting family members. He is completely broke!

Lady Adelia Toillard: From lower nobility family. Sullen and withdrawn, kind to her children. Spends a lot of time with them because there are no servants except the butler.

Butler Jessob: A long-time butler and good friend of the family. Loves the children.

Doctor Jameson: Local doctor.

William "The Lad" Johnson: Local moneylender.

Joseph Strickmeyer: Burgler and overall no-good kind of guy and very stupid. Police always thinks of this man first whenever something is suspicious.
$$,
(
    'John Toilard',
    'kidnapped. A 13 year old boy with his head in the clouds, often fantasizing about different lives.',
    'john_toilard.webp',
    'Fanaticism for journalism and its ethics that was deeply hurt when he realized his hero and mentor, Michael Terry was in it more for the drama than the truth.',
    'After sleeping over after the party, he had time to slip into the study and place the poison in the inkwell and because he was the assistant, nobody bat an eye.',
    'The second pen in his home with traces of cyanide.'
)::murderer_type,
'John Toilard',
'kidnapped. A 13 year old boy with his head in the clouds, often fantasizing about different lives.',
'/images/mysteries/forced_farewell.webp'
);

INSERT INTO suspects (mystery_id, name, imagepath, description)
VALUES
((SELECT id FROM mysteries WHERE name = 'Forced Farewell'), 'Lord Baron Charles Toillard', 'lord_baron_charles_toillard.webp', 'A newly titled baron, known for his achievements in diplomacy. Recently turned into a drunkard and gambler.'),
((SELECT id FROM mysteries WHERE name = 'Forced Farewell'), 'Lady Adelia Toillard', 'lady_adelia_toillard.webp', 'From lower nobility, sullen and withdrawn, spends a lot of time with her children.'),
((SELECT id FROM mysteries WHERE name = 'Forced Farewell'), 'Alice Toillard', 'alice_toillard.webp', 'Younger sister, 5 years old.'),
((SELECT id FROM mysteries WHERE name = 'Forced Farewell'), 'Arthur Toillard', 'arthur_toillard.webp', 'Younger brother, 9 years old.'),
((SELECT id FROM mysteries WHERE name = 'Forced Farewell'), 'Butler Jessob', 'butler_jessob.webp', 'A long-time butler and good friend of the family, loves the children.'),
((SELECT id FROM mysteries WHERE name = 'Forced Farewell'), 'Doctor Jameson', 'doctor_jameson.webp', 'Local doctor.'),
((SELECT id FROM mysteries WHERE name = 'Forced Farewell'), 'William "The Lad" Johnson', 'william_the_lad_johnson.webp', 'Local moneylender.'),
((SELECT id FROM mysteries WHERE name = 'Forced Farewell'), 'Joseph Strickmeyer', 'joseph_strickmeyer.webp', 'Burglar and overall no-good kind of guy, often suspected by police.');

INSERT INTO action_clues (mystery_id, action, clue)
VALUES
((SELECT id FROM mysteries WHERE name = 'Forced Farewell'), 'Interrogate Toillard household', 'create a line for each suspect about how worried they are'),
((SELECT id FROM mysteries WHERE name = 'Forced Farewell'), 'Search house', 'there is shattered glass at a garden door; John''s room is in disarray; things are knocked over throughout the house but nothing appears to be stolen; the ransom note'),
((SELECT id FROM mysteries WHERE name = 'Forced Farewell'), 'Investigate ransom note', 'it''s old newspaper cutouts demanding that on Monday July 18 £13.2 be posted to the following address in London: 4 Patterson Street'),
((SELECT id FROM mysteries WHERE name = 'Forced Farewell'), 'Searching 4 Patterson Street in London', 'in that apartment lives a Mary Ann Woodcock and her daughters Hannah and Anna. Her husband Methusalem Woodcock is a sailor and has been at sea for months'),
((SELECT id FROM mysteries WHERE name = 'Forced Farewell'), 'Interrogate Butler Jessob', 'he says he was tending to the sickly John who seemed to be getting worse, so he rode out to fetch the local doctor, they couldn''t have been gone more than an hour; and when they returned they searched everywhere, but couldn''t find John; so Jessob sent the doctor to ride for Romsey to inform the Toillards'),
((SELECT id FROM mysteries WHERE name = 'Forced Farewell'), 'Search John''s room', 'all of his valuables are gone such as his rings, pocket watch, fountain pens, and diary; on his desk are some newspapers and his scrapbook with cutouts of articles he found interesting, mostly about America and science'),
((SELECT id FROM mysteries WHERE name = 'Forced Farewell'), 'Questioning Baron Toillard whom he suspects', 'he suspects "The Lad" Johnson because he borrowed money from The Lad, but it''s peculiar that the ransom is much less than he borrowed from The Lad'),
((SELECT id FROM mysteries WHERE name = 'Forced Farewell'), 'Search the estate and the surroundings', 'no clues as there wasn''t any rain for footprints and they seem very careful not to leave any tracks'),
((SELECT id FROM mysteries WHERE name = 'Forced Farewell'), 'Questioning the family if they know of Sherlock Holmes', 'they say that obviously everyone''s heard of him since he solved the murder of the Cleveland man, John was particularly amazed by the The Book of Life and he chewed their ears off about it'),
((SELECT id FROM mysteries WHERE name = 'Forced Farewell'), 'Interrogating William Johnson', 'he lent money to the Baron, but he says he has other was of getting money back fair and square, and that he doesn''t have to rely on stealing children; besides it''s much much less than he''s owed');

INSERT INTO timeframes (mystery_id, timeframe, event_happened)
VALUES
((SELECT id FROM mysteries WHERE name = 'Forced Farewell'), '09:00AM', 'The Toillards leave the butler Jessob and John at home'),
((SELECT id FROM mysteries WHERE name = 'Forced Farewell'), '11:30AM', 'The garden party begins'),
((SELECT id FROM mysteries WHERE name = 'Forced Farewell'), '13:00PM', 'The butler leaves to fetch a doctor'),
((SELECT id FROM mysteries WHERE name = 'Forced Farewell'), '13:30PM', 'The butler and the doctor return to find a mess in the apartment.'),
((SELECT id FROM mysteries WHERE name = 'Forced Farewell'), '14:15PM', 'After a thorough search, the doctor leaves to inform Lord Toillard.'),
((SELECT id FROM mysteries WHERE name = 'Forced Farewell'), '15:00PM', 'The doctor reaches Lord Toilard and he contacts the chief constable Smith'),
((SELECT id FROM mysteries WHERE name = 'Forced Farewell'), '15:45PM', 'Lord Toillard, Smith and a few officers arrive at the estate');



INSERT INTO events (mystery_id, letter, info, show_at_message)
VALUES( (SELECT id FROM mysteries WHERE name = 'Forced Farewell'),
    $$Dear Mr. Holmes,

I'm sending you an urgent message. We have received an ominous message in our mailbox today, and we were instructed to pass it on to you or there would be consequences.

It reads as follows:

"If you know what is best for the boy, you will stop sniffing around."

The worst part: there appears to be blood on the paper and it appears to be written by the shaky hand of the boy himself. We must assume it is the boys blood. This seems a genuine.

Unfortunately there are neither sender's nor destination address on it. This is quite troubling to say the least. Of course, I believe that it would be foolish to stop our correspondence. If the thieves really want the ransom then they wouldn't seriously harm the boy, isn't that so? I understand this is new territory for us all, but I feel certain of this. Please let me know what you wish to do as soon as possible.

Yours faithfully,

Constable Wellington
$$,
    'A letter with blood on paper which appears to be written by John Toilard threatening to stop the investigation.',
    1
);

INSERT INTO events (mystery_id, letter, info, show_at_message)
VALUES( (SELECT id FROM mysteries WHERE name = 'Forced Farewell'),
    $$
Mr. Holmes,

another urgent message with sinister overtones has come.

It simply says: "The new address for the money is 221B Baker Street."

It is much the same as last time. It appeared in our mailbox without address. However, this time it is paper cutouts again.

On the risk of sounding foolish. I hope you can swear on it and assure me that you are in fact not one of the thieves. This is quite worrying and I must follow every lead.

Otherwise this might be a threat to you. Publicly showing that they know where you live... Please thread lightly Mr. Holmes.

Yours,

Constable Wellington
$$,
    'Your info content',
    6
);
