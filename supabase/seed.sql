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
    $$
    Dear Mr. Holmes,
I'm sending you an urgent telegram. We have received an puzzling message in our mailbox today. Unfortunately there are neither sender's nor destination address on it. No postmark to be found. The same style of cutout newspapers has been used to communicate the message.    
It simply reads:
"The new address for the money is 221B Baker Street."
I may sound reckless in asking your continued support, even though this appears to be a clear message saying the thieves know of your involvement, and possibly a threat to your person. I will ask your local force for two constables to stand guard at your place. It might be a prank, but we must be careful.
Yours,
Constable Wellington
$$,
    $$ 'Investigate letter with new address for delivery -- no information from where it came, the paper used beneath the cutouts is cheap; the individual letters are from today's newspaper, but it seems worn as if picked up from the ground;' $$,
    5
);

INSERT INTO events (mystery_id, letter, info, show_at_message)
VALUES( (SELECT id FROM mysteries WHERE name = 'Forced Farewell'),
    $$
Mr. Holmes,
another urgent message with truly sinister overtones has come. 
It says: "Mr. Holmes, if you are such a good detective, you must realize that the future of the boy is only guaranteed if you stop sniffing around."
Just like last time, it appeared in our mailbox without address. However, this time it appears to be written by the shaky hand of the boy himself. The worst part: there appears to be blood on the paper. This is a threat most serious. His life may be in danger. Yet, if the thieves really want the ransom then they wouldn't seriously harm the boy, isn't that so? I believe that it would be foolish to stop our correspondence as you seem to be making great progress. I place my trust in you, time is ticking fast.
Yours faithfully,
Constable Wellington
$$,
   $$ 'Investigate threat -- no information from where it came, same paper used as for the previous message, but it appears to be written by the shaky hand of the boy himself, there are blood droplets on the paper,' $$,
    8
);

INSERT INTO events (mystery_id, letter, info, show_at_message)
VALUES( (SELECT id FROM mysteries WHERE name = 'Forced Farewell'),
    $$
Dear Mr. Holmes,
there has been a great event! A gentleman in Southampton contacted us. He had purchased a bound book for keeping notes from a secondhand shop in the city. He flipped through it and it appeared to be a diary. When he saw the dedication in the beginning: "To the little Lord John, may all your thoughts find a place here. Jessob," he knew it was from the Toillard heir as he is a local in Ramsey and knows of them fairly well. He arrived in a hurry knowing it was an critical situation.
Perhaps the thieves are strapped for cash and that is why they sold it. Or perhaps they just wanted to get rid of ballast.
I am attaching a transcript of the contents:

24.3.1889
Dear diary, 
you were a present from dear Jessob. He told me that all great minds must have a place to capture their greatness. So I will do my best to fill you with my best ideas.
John
Ps.: I need to make sure I have enough ink.
Pps.: I find it really remarkable how the days are getting longer again. I have learned that we travel around the sun, but how come we do not feel we are moving? We must be going really slowly.
PPps: I won't sign my name any more, as you know who I am, and so that I don't have to attach post scripta.

25.3.1889
Dear diary,
today was another dreadful day. Sometimes the air in the house is reminiscent of the time we went through the Marsh Lane Tunnel some years ago. We were no strangers to locomotives and I particularly enjoyed them. But people were always telling us to beware the tunnel. After a scenic journey it was time to enter the it and all my excitement vanished. We were swallowed by near total darkness and drowned in the thundering of the locomotive, and the heat of steam about us all. Many women screamed, and I felt the need to claw at my skin. I imagine that is what hell must be like. And though it was just steam and you could move normally, I felt as if I was in a thick cloud of languor. That is what this house is like often.

26.3.1889
Dear Diary,
I have decided to take Jessob's words to heart. You are only a place for greatness, so I will avoid any and all dark writing such as yesterday's. Today I will write about the New World. America is now only £13 away with the steamboats. Though father and his friends sneer at it and call it Wild World, one only has to look at the paper. With a dollar in your pocket, you can become anyone you want and achieve anything you want. That's only 20 pence! I don't mind what they say that it has no culture and no history, neither does my father! They tease him, too, on the novelty of his title. And if one were to get a whiff of his culture, it would reek of brandy. 

2.4.1889
Dear Diary,
I forgot to write in you for some days, but I will be more disciplined from now. You see, I was busier than usual with my studies since mother was in a terrible excitement with public school not far off. I will be starting at Eton after the summer. She tells me we're Lords only in title and that prudent stewardship is a necessary prerequisite to be a real Lord. We can only afford one tutor now, who instructs me in the usual subjects and then I must make a point of passing on my knowledge to my brother. That is quite exhausting as he really doesn't seem to grasp my explanations.

12.4.1889
Dear Diary,
it seems to be impossible for me to stay consistent with writing you. Perhaps it's because nothing exciting happens here, and whatever little does happen, I have promised to avoid writing here. I could retell everything I've learned, but after trying to, mostly unsuccessfully, pass it on to my brother, I am rather tired of it. Though, I am recently fascinated by Liberty Enlightening the World. I heard they shipped it in crates from France to America in 200 odd crates and assembled it there. I've seen pictures, but just like a picture doesn't do a steel ship justice, so I believe I must one day see the real thing. With finances look like they do, I must study more. Forgive me if I neglect you a while.

13.4.1889
Dear Diary,
instead of letting the interesting find me, I reached out to it myself! My father was speaking about some business opportunities in America and I suggested that it might be prudent if I were to attend university there to study engineering. He said that it was a brilliant idea and that it would help create future connections there. So as soon as I finish my Eton education I will make my way to America. I am rather proud of myself.

24.5.1889
Dear Diary, 
I have read something extraordinary today. It's called the The Book of Life and it was written by a man called Sherlock Holmes. I stumbled upon after reading Mr. Holmes' success in solving the sinister murder of a man from Cleveland. In the article he says that it's possible to deduce all manner of things that are hidden from most except one carefully observing his surroundings. For example, I could infer the possibility of the Atlantic ocean from a single drop of water. He suggests one start with simpler problems such as recognizing a man's profession from the way he dresses or behaves. I am very excited indeed.

15.6.1889
Dear Diary,
I can hardly write. The business venture my father pursued in America has turned out to be a swindle. My father has just told me that due to these financial circumstances he cannot send me to Eton this summer. I am to choose between private tutoring or attending some inferior public school. He guarantees me next year I will definitely be able to go, but I do not believe him. He seems to bad appraiser of situations if he got deceived so easily. He is incensed of course, but who is to blame? He started to say all kinds of things about America and her citizens. How they are no good company and that anyone going there will inevitably succumb to their evil ways. Rubbish of course, since he's the prime swindler become Baron among all these fine people. He did not say it but it seems he will not send me to America. And with subclass education I will not be able to attend university. I have to do something about it as soon as possible.

$$,
   $$ 'investigate diary -- a nice and luxurious diary, dedicated to John by the butler, John writes about his every day life' $$,
    13
);


-- Saturday 16th of July: The address of delivery for the money has been changed to 221B Baker street
-- Sunday 17th of July: A threat is found in the mail saying that the life of the boy is in danger in case Sherlock decides to continue his support
-- Monday 18th of July: John's diary is discovered in a secondhand shop in Southampton.
-- investigate diary -- a nice and luxurious diary, dedicated to John by the butler, John writes about his every day life