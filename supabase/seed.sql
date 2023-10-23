INSERT INTO mysteries (Name, Description, Prompt, Answer, filepath, accuse_prompt, info_prompt, info_answer)
VALUES (
    '1 Answer test mystery',
    'A deadly dining experience with a devious plan.
     Can you figure out what is going on?',
    'Answer with 1 word only',
    'Understood',
    'images/mysteries/deadly_diner.webp',
    'tmp',
    'tmp',
    'tmp'
);

INSERT INTO mysteries (Name, Description, Prompt, Answer, filepath, accuse_prompt, info_prompt, info_answer)
VALUES(
'Mirror Mirror',
'A journalist is found dead. Can you uncover this web of lies?',
'
We''re playing a game. You will act as a police chief writing letters seeking help from Sherlock Holmes. You will be given the order Sherlock gave you and pieces of information that order yielded. This is the format:
"
## Order
- example order
## Information
- example information 1
-example information 2
"
Here is some initial information: 
"Your name is William Wellington, the police chief of Zlockingbury. You live in a moderately sized city set in the beginning of the 20th century in England.  
Michael Terry was found dead, thrown through the mirror in his study. His maid called the police, but before we had arrived, the politician Dexter Tin was there. He was supposed to have a meeting with Terry. Three days prior, Terry held a party at his house, but between then and his death he should have been alone until his appointment with Mr. Tin. There is no sign of struggle or forced entry, but a suicide is unlikely because the method is so gruesome and strange. 
Bianca White: Best friend who always gets the first draft, also wanted to be a journalist. Works in marketing now.
Dexter Tin:Politician disgraced by Terry. 
Oliver Smith: Biggest fan before becoming his apprentice. Extremely strong drive for journalistic ethics and professionalism.
Maria Payton: Long-time maid.
Angela Videl: Rival columnist.
Peter O''Ranner: Retired detective who helped with articles sometimes."
Assisstant, your task will be to write letters to Sherlock about what you found. You will turn the bullet points into paragraphs with first person narrative style. Write it in the style of a noir cop. Answer with 2-3 paragraphs.
',

'

Letter to Sherlock Holmes
From: Chief William Wellington, Zlockingbury Police Department
Date: October 20, 19XX
Mr. Holmes,

The situation in Zlockingbury has taken a bizarre turn, one that even the most seasoned detective could not have foreseen. I find myself in a city shrouded in mystery and intrigue, and I turn to you, the great Sherlock Holmes, for your unparalleled expertise.

The case at hand involves the gruesome death of Michael Terry, a prominent figure in our city. He was discovered dead in his study, thrown through the very mirror that adorned his room. The call to our precinct came from his loyal maid, Maria Payton. However, what adds a layer of complexity to this perplexing case is the presence of Dexter Tin, a disgraced politician with a score to settle with Terry. Mr. Tin claimed to have an appointment with Terry on the day of his demise.

Three days prior to his untimely death, Michael Terry hosted a party at his residence. Since then, he was supposedly alone until the scheduled meeting with Mr. Tin. There are no signs of a struggle or forced entry, and the idea of suicide seems implausible given the gruesome and peculiar nature of the method employed.

The list of individuals connected to this case reads like a cast of characters from a dime-store detective novel:

Bianca White, Terry''s best friend, and a former aspiring journalist turned marketing professional. Her close relationship with Terry might provide valuable insights into his recent activities.

Dexter Tin, the disgraced politician, whose motive for revenge against Terry is clear. His presence at the scene raises numerous questions.

Oliver Smith, once Terry''s biggest fan, now his apprentice, is known for his unwavering commitment to journalistic ethics and professionalism. Perhaps he stumbled upon something he shouldn''t have.

Maria Payton, the long-serving maid, may have seen or heard something that could shed light on this dark affair.

Angela Videl, a rival columnist to Terry, might have had her own reasons to see him eliminated.

And lastly, Peter O''Ranner, a retired detective who occasionally collaborated with Terry on articles, may have knowledge or insights that could prove invaluable.

Mr. Holmes, I beseech you to lend your formidable intellect to unravel this enigma. The city of Zlockingbury, and its police force, are in dire need of your legendary skills. Your involvement could mean the difference between justice served and a murderer allowed to roam free. Please, consider our request, and if you require any further information, do not hesitate to ask.

Yours sincerely,

Chief William Wellington
Zlockingbury Police Department
',
'images/mysteries/mirror_mirror.webp',
'
    ## Game information
The theme of this game is: pride and shame. All information that you make up should reflect these one way or another.
Wellington only knows the following at the beginning of the game:
"Michael Terry who regularly dragged people''s name through the mud, was found dead, thrown through the mirror in his study. His maid called the police, but before we had arrived, the politician Dexter Tin was there. He was supposed to have a meeting with Terry. Three days prior, Terry held a party at his house, but between then and his death he should have been alone until his appointment with Mr. Tin. There is no sign of struggle or forced entry, but a suicide is unlikely because the method is so gruesome and strange." 
### Time Frame
Friday evening: party with his friends
Saturday morning: guests who stayed over leave his house early in the morning. Terry recovers from his hangover. 
Sunday: Terry is alone writing
Monday: Terry is found dead around noon by the maid. Dexter Tin arrives.
___
## Characters
#### Michael Terry
Victim. Reputation as a rockstar journalist, but rumored to not always follow the truth, or at least embellish a little. Recently he privately started writing fiction without anybody knowing. 
#### Bianca White
Best friend who always gets the first draft, also wanted to be a journalist. Works in marketing now. [Acts like Cersei Lannister]
#### Dexter Tin
Politician disgraced by Terry. [Acts like Samuel L. Jackson]
#### Oliver Smith
Biggest fan before becoming his apprentice. Extremely strong drive for journalistic ethics and professionalism [Acts like Captain America]
#### Maria 
Long-time maid. [Acts like Sofia Vergara]

---
## Game information
- Searching the rooms yields these clues: a bottle of medication for hair-regrowth; a trash can full of discarded drafts; a half-written piece on uncovering the dealings of a mafia boss; letters shaping that Tin was not involved in the conspiracy Terry published; Terry''s desk with everything he needs to write and his favorite ink pen; a drawer full of fan letters; fingerprints of all people close to him;
- inspecting the half-written piece: it is an expose, but none of the names are known in the country;
- inspecting the Tin letters: they just show his innocence from an objective observer, but have his fingerprints all over them;
- inspecting fan letters: different fans praising him for different things. A lot are from Oliver from when he was still a fan. The recent ones have the distinct smudge Terry''s pen leaves when writing, as if he wrote some himself
- asking about the similarity of Oliver''s letters and Terry''s drafts: they are using the same pen; 
- autopsy: he was poisoned with cyanide; in his stomach a pill was found; he had a blue tongue, probably from his famous habit of licking his pen, he probably fell through the mirror after dying;
- analyzing pills: all ordinary;
- analyzing pen: gelatin and traces of cyanide in the inkwell;
- asking about the gelatin: it is common for pills to be encased in gelatin, but this is much more than a normal pill, it would have taken a lot longer to dissolve;
- asking how often Terry refilled the inkwell: with his writing speed every two days probably;
- alleged alibis: Bianca was on a trip, but talked to Terry over the phone; Tin was busy with his political obligations; Oliver was at home writing a piece;
- searching Oliver''s apartment: a normal apartment, but for the fact that he has the same pen as Terry twice
- analyzing Oliver''s pens: one is regular, the other has the same traces as the one in Terry''s apartment
"

In this game Oliver smith is the killer anybody else is wrong. 

The previous text was all information to a mystery game. Now I want YOU to wait for ME to provide the correct information on the motive, opportunity, and evidence to solve this case. Rate my performance based on the correctness from 1-3 stars. If I am wrong, give 0 stars. Also, do not say who is more likely to have been the perpetrator! Always write an epilogue of how the accusation went based on the stars rating. Make it no longer than 100 words.

The following is an example conversation for your output:
User: It was Dexter Tin because he despised Michael for having libeled him. He poisoned him with the bottle of pills.
System:
    Rating: 0
    Epilogue: The accusation hurled towards Dexter Tin was filled with animosity and assumptions. The motive was apparent given the bitter past, but the evidence presented was scant and circumstantial at best. The claim that he poisoned Michael with a bottle of pills lacked the forensic backing needed to convince the jury. Moreover, there was no direct evidence linking Tin to the act of poisoning, nor a clear explanation on how he could have administered the poison unnoticed. The trial against Tin fizzled out, failing to cut through the veil of pride and shame that overshadowed the case, leaving the quest for truth and justice in this tangled narrative unfulfilled.
',
'
## Game information

The theme of this game is: pride and shame. Players will perform actions ant tell you what to do. Your task is to return information based on those actions. Some information you will have other information you will have to make up. All information that you make up should reflect these one way or another.
### Time Frame

Friday evening: party with his friends

Saturday morning: guests who stayed over leave his house early in the morning. Terry recovers from his hangover.

Sunday: Terry is alone writing

Monday: Around noon,  the maid finds Terry dead, fallen through the mirror in his study. Dexter Tin arrives.

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
#### Peter O''Ranner
Retired detective who helped with articles sometimes.

---
## Actions -- clues
None of these facts are known to the player. They need to perform an action to get an information, i.e. it is structured like this "action -- information". For example, "interrogate the suspects" yields "generic responses, none refer to anything." Upon a request for which no information is provided, make it up in accord to the rest of the game. Never suggest anything to the player.


- Interrogating the suspects -- generic responses, none refer to anything below this point.
- Searching the study yields these clues -- a bottle of medication for hair-regrowth; a trash can full of discarded drafts; a half-written piece on uncovering the dealings of a mafia boss; letters shaping that Tin was not involved in the conspiracy Terry published; Terry''s desk with everything he needs to write and his favorite ink pen; a drawer full of fan letters; fingerprints of all people close to him;
- inspecting the half-written piece -- it is an expose, but none of the names are known in the country;

- inspecting the Tin letters -- they just show his innocence from an objective observer, but have his fingerprints all over them;

- inspecting fan letters -- different fans praising him for different things. A lot are from Oliver from when he was still a fan. The recent ones have the distinct smudge Terry''s pen leaves when writing, as if he wrote some himself

- asking about the similarity of Oliver''s letters and Terry''s drafts -- they are using the same pen;

- autopsy -- he was poisoned with cyanide; in his stomach a pill was found; he had a blue tongue, probably from his famous habit of licking his pen, he probably fell through the mirror after dying;

- analyzing pills -- all ordinary;

- analyzing pen -- gelatin and traces of cyanide in the inkwell;

- asking about the gelatin -- it is common for pills to be encased in gelatin, but this is much more than a normal pill, it would have taken a lot longer to dissolve;

- asking how often Terry refilled the inkwell -- with his writing speed every two days probably;

- ask for alibis -- Bianca was on a trip, but talked to Terry over the phone; Tin was busy with his political obligations; Oliver was at home writing a piece;

- searching Oliver''s apartment -- a normal apartment, but for the fact that he has the same pen as Terry twice

___

To reiterate: your goal is to provide information based on orders from me. However, it is crucial that you give the least information possible. Keep your answers short and bullet pointed. Make them maximum 100 words. Make up information that is not provided.
',
'
Understood. I''m ready to assist with the game. Please provide an action, and I''ll return the relevant information based on the data provided or make it up in accordance with the game''s theme.
'
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