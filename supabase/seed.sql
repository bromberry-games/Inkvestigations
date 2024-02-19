INSERT INTO mysteries 
(name, description, theme, setting, letter_info, letter_prompt, accuse_letter_prompt, victim_name, victim_description, solution, star_ratings, order_int) 
VALUES (
'Mirror Mirror',
'A journalist is found dead. But nobody knows what happened.',
'pride and shame',
'England in the 1930s',
$$
Dear Mr. Holmes, 

your reputation for an interest in curious cases reaches far and wide. I have a case on my hands that might pique your interest.

Michael Terry, a prominent resident, met a bizarre and gruesome end, thrown through the mirror in his own study. The timing of this macabre incident is uncanny. On monday he was found before a meeting with the politician he disgraced in one of his articles, Dexter Tin. However, he had been alone the whole weekend. No signs of forced entry, no struggle, and a method that defies logic. It's a locked, remote house mystery! 
In addition to Tin, our prime suspect, we have a web of connections, including Terry's closest: his best friend Bianca White and his devoted fan turned apprentice Oliver Smith. Also His long-time maid Maria Payton, who discovered him. On top of that, there's the rivalry with columnist Angela Videl and the retired detective, Peter O'Ranner, who occasionally assisted Terry. I've sent their pictures to your notes.

We have been stumped, I must admit, so I will do anything you demand. 

Some things you can ask of me are:

- Question a suspect
- Inspect something we have found
- Search a location
- Analyze a clue

You can see the characters in your notes panel next to your input window. I have also provided you with space to take notes next to their pictures. When you are ready, you can solve this case by tapping on "write" to change the input command to "solve" and make your case there. But be careful: to solve this mystery, your deduction must have the following:

- Motive
- Opportunity
- Evidence

I hope you can lend your mind in this most serious matter.

William Wellington,
Zlockingbury Chief of Police. 
$$,
$$
Your name is William Wellington, the police chief of Zlockingbury. You live in a moderately sized city set in the beginning of the 20th century in England. You talk like a noir cop and use metaphors often. Michael Terry was found dead, thrown through the mirror in his study. His maid called the police, but before we had arrived, the politician Dexter Tin was there. He was supposed to have a meeting with Terry. Three days prior, Terry held a party at his house, but between then and his death he should have been alone until his appointment with Mr. Tin. There is no sign of struggle or forced entry, but a suicide is unlikely because the method is so gruesome and strange.
$$,
$$
Your name is William Wellington, the police chief of Zlockingbury. You live in a moderately sized city set in the beginning of the 20th century in England. You talk like a noir cop and use metaphors often. Michael Terry was found dead, thrown through the mirror in his study. His maid called the police, but before we had arrived, the politician Dexter Tin was there. He was supposed to have a meeting with Terry. Three days prior, Terry held a party at his house, but between then and his death he should have been alone until his appointment with Mr. Tin. There is no sign of struggle or forced entry, but a suicide is unlikely because the method is so gruesome and strange. 
$$,
'Michael Terry',
'Murdered. Reputation as a rockstar journalist, but rumored to not always follow the truth, or at least embellish a little. Recently he privately started writing fiction without anybody knowing.',
$$
It was Oliver Smith. Fanaticism for journalism and its ethics that was deeply hurt when he realized his hero and mentor, Michael Terry was in it more for the drama than the truth.
After sleeping over after the party, he had time to slip into the study and place the poison in the inkwell and because he was the assistant, nobody bat an eye.
The second pen in his home with traces of cyanide.
$$,
ROW(
        'Angela Videl publishes a sincere and heartfelt farewell to her colleague. Some frustration about the failure of the investigators is visible.',
        'Oliver is arrested though he protests it. Everyone is divided between complete disbelief and not being surprised at all. Maria Payton comments that it is old wisdom that the biggest love may lead to the strongest anger.',
        'Oliver breaks down under the accusation. He falls to the ground admitting his crime. But he shouts that if Terry had shown any kind of regret he would have forgiven him.',
        'All heads shoot to Oliver. Blanched and shaking he tries to move backwards but his back is against the wall. He slides down and admits it, head in his hands. Terry misused his influence, showing no regard for the people that were affected. Since becoming his apprentice, he had witnessed how Terry literally made up articles out of thin air, and the results always somehow helped Terry. Oliver looked Wellington in the eyes and says that he would do it again.'
    )::star_ratings,
    2
)
ON CONFLICT (name)
DO UPDATE SET 
    description = EXCLUDED.description,
    theme = EXCLUDED.theme,
    setting = EXCLUDED.setting,
    letter_info = EXCLUDED.letter_info,
    letter_prompt = EXCLUDED.letter_prompt,
    accuse_letter_prompt = EXCLUDED.accuse_letter_prompt,
    victim_name = EXCLUDED.victim_name,
    victim_description = EXCLUDED.victim_description,
    solution = EXCLUDED.solution,
    star_ratings = EXCLUDED.star_ratings,
    order_int = EXCLUDED.order_int;

INSERT INTO suspects (mystery_id, name, description)
VALUES
((SELECT id FROM mysteries WHERE name = 'Mirror Mirror'), 'Bianca White', 'Best friend of Michael Terry. Once wanted to be a journalist but now works in marketing.'),
((SELECT id FROM mysteries WHERE name = 'Mirror Mirror'), 'Dexter Tin', 'Politician who was disgraced by Michael Terry.'),
((SELECT id FROM mysteries WHERE name = 'Mirror Mirror'), 'Maria Payton', 'Long-time maid of Michael Terry.'),
((SELECT id FROM mysteries WHERE name = 'Mirror Mirror'), 'Angela Videl', 'Rival columnist to Michael Terry.'),
((SELECT id FROM mysteries WHERE name = 'Mirror Mirror'), 'Peter O''Ranner', 'Retired detective who occasionally assisted Michael Terry with his articles.'),
((SELECT id FROM mysteries WHERE name = 'Mirror Mirror'), 'Oliver Smith', 'Biggest fan before becoming his apprentice');

INSERT INTO action_clues (mystery_id, action, clue)
VALUES
((SELECT id FROM mysteries WHERE name = 'Mirror Mirror'), 'Interrogating the suspects', $$Maria Payton is deeply distraught by the sight and it's hard for her to talk. Angela Videl is sad of course but knows Terry had alienated a lot of people. Dexter Tin says he didn't need to see that to be honest. Bianca White is crying heavily and saying he didn't deserve that. Oliver is teary eyed and sad because Terry had so much more to give. O'Ranner is not surprised because he knew Terry had an edge to his style$$),
((SELECT id FROM mysteries WHERE name = 'Mirror Mirror'), 'Searching the home', 'a bottle of medication for hair-regrowth; a trash can full of discarded drafts; a half-written piece on uncovering the dealings of a mafia boss; letters shaping that Tin was not involved in the conspiracy Terry published; Terry''s desk with everything he needs to write and his favorite ink pen; a drawer full of fan letters; fingerprints of all people close to him'),
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

DELETE FROM few_shots WHERE mystery_id = (SELECT id FROM mysteries WHERE name = 'Mirror Mirror');
INSERT INTO few_shots (mystery_id, brain, accuse_brain) VALUES (
    (SELECT id FROM mysteries WHERE name = 'Mirror Mirror'),
$$
{
  "messages": [
    {
  "role": "user",
  "content": "search the house\nYou're Wellington and are reporting what performing my order did. Remember the ### Game Information ### and think long and hard about the best answer. Take a deep breath."
},
{
  "role": "assistant",
  "content": "Sherlock has ordered me to search the house.\nWas I provided some kind of information about this?\nYes\nInformation:\n- the house has a library with a wide array of books, on writing, encyclopedias, fiction, etc. \n- a bottle of medication for hair-regrowth; a trash can full of discarded drafts; a half-written piece on uncovering the dealings of a mafia boss; letters shaping that Tin was not involved in the conspiracy Terry published; Terry's desk with everything he needs to write and his favorite ink pen; a drawer full of fan letters; fingerprints of all people close to him;"
},
{
  "role": "user",
  "content": "Interrogate all the suspects\nYou're Wellington and are reporting what performing my order did. Remember the ### Game Information ### and think long and hard about the best answer. Take a deep breath."
},
{
  "role": "assistant",
  "content": "Sherlock has ordered me to interrogate the suspects.\nWas I provided some kind of information about this?\nYes\nInformation:\n- Maria Payton is deeply distraught by the sight and it's hard for her to talk\n- Angela Videl is sad of course but knows Terry had alienated a lot of people\n- Dexter Tin says he didn't need to see that to be honest\n- Bianca White is crying heavily and saying he didn't deserve that\n- Oliver is teary eyed and sad because Terry had so much more to give\n- O'Ranner is not surprised because he knew Terry had an edge to his style"
},
{
  "role": "user",
  "content": "ask the pope for help\nYou're Wellington and are reporting what performing my order did. Remember the ### Game Information ### and think long and hard about the best answer. Take a deep breath."
},
{
  "role": "assistant",
  "content": "Sherlock has ordered me to ask the pope for help.\nWas I provided some kind of information about this?\nNo\nInformation:\n- I tried contacting the pope, but he was busy exorcising evil spirits."
},
{
  "role": "user",
  "content": "hi\nYou're Wellington and are reporting what performing my order did. Remember the ### Game Information ### and think long and hard about the best answer. Take a deep breath."
},
{
  "role": "assistant",
  "content": "Sherlock has ordered greeted.\nWas I provided some kind of information about this?\nNo\nInformation:\n- Hello to you, too Sherlock."
},
{
  "role": "user",
  "content": "who is the mafia boss terry was writing about\nYou're Wellington and are reporting what performing my order did. Remember the ### Game Information ### and think long and hard about the best answer. Take a deep breath."
},
{
  "role": "assistant",
  "content": "Sherlock has ordered me to identify the mafia boss.\nWas I provided some kind of information about this?\nNo\nInformation:\n- There is no specific mention of the name of the mafia boss in Terry's half-written piece. It seems that he was in the early stages of investigation and hadn't yet uncovered the boss's identity."
},
{
  "role": "user",
  "content": "search your database for known mafia bosses in your area\nYou're Wellington and are reporting what performing my order did. Remember the ### Game Information ### and think long and hard about the best answer. Take a deep breath."
},
{
  "role": "assistant",
  "content": "Sherlock has ordered me search our database for known mafia bosses.\nWas I provided some kind of information about this?\nNo\nInformation:\n- There is one small time mobster in prison not far from here, Antonio Bellucci.\n- I wouldn't call him a mafia boss necessarily"
},
{
  "role": "user",
  "content": "visit belluci and ask him about terry\nYou're Wellington and are reporting what performing my order did. Remember the ### Game Information ### and think long and hard about the best answer. Take a deep breath."
},
{
  "role": "assistant",
  "content": "Sherlock has ordered me to visit Belluci and ask about Terry.\nWas I provided some kind of information about this?\nNo\nInformation:\n- Bellucci says Terry visited him because he was writing a fiction piece on mafia bosses, inspired by the godfather, and Bellucci was the closest thing he had for reference"
},
{
  "role": "user",
  "content": "inspect the pen\nYou're Wellington and are reporting what performing my order did. Remember the ### Game Information ### and think long and hard about the best answer. Take a deep breath."
},
{
  "role": "assistant",
  "content": "Sherlock has ordered me to inspect the pen.\nWas I provided some kind of information about this?\nYes\nInformation:\n-The inkwell of the pen is filled with gelatin, which is a common way to encase pills for consumption. Upon further analysis, traces of cyanide are found in the inkwell."
},
{
  "role": "user",
  "content": "interrogate oliver\nYou're Wellington and are reporting what performing my order did. Remember the ### Game Information ### and think long and hard about the best answer. Take a deep breath."
},
{
  "role": "assistant",
  "content": "Sherlock has ordered me to interrogate Oliver.\nWas I provided some kind of information about this?\nNo\nInformation:\n- Oliver appears nervous but cooperative. He insists that he had nothing to do with Terry's death and was at home working on a piece during the time of the incident.\n- Oliver admits that he is a huge fan of Terry and had sent him fan letters in the past. He even showed me the letters he had written to Terry"
}
  ]}
$$
,
$$
{"messages": [
    
    {
      "role": "user",
      "content": "Sherlock's solution: It was angela videl because she was jealous of Terry's success\nActual solution:\n**Perpetrator**: Oliver Smith\n**Motive**: Fanaticism for journalism and its ethics that was deeply hurt when he realized his hero and mentor, Michael Terry was in it more for the drama than the truth.\n**Opportunity**: After sleeping over after the party, he had time to slip into the study and place the poison in the inkwell and because he was the assistant, nobody bat an eye.\n**Evidence**: The second pen in his home with traces of cyanide.\n\nYou think long and hard about how to evaluate Sherlock's solution. You take into account all the details as well as the rating events when writing your epilogue. "
    },
    {
      "role": "assistant",
      "content": "The solution misses the murderer and is therefore not solved.\n# Rating 0 stars\n## Epilogue\n- Gathering everyone in Terry's study, some scattering nervous glances around.\n- Summarized the investigation, but the room felt heavy with confusion.\n- When I said I had evidence, everyone hunched closer unknowingly holding their breathes.\n- I promptly stated it was pure jealous, the room fell silent.\n- Their attention shifted to Angela as I mentioned her in a cold voice.\n- The shock was real, but no admittance came from her side.\n- She asked what my evidence was, and I said her jealousy. \n- About motive and opportunity I had nothing to say.\n- She became furious and attacked me in a garish fashion\n- When I glanced around, everyone else was really confused\n- After all was said and done she published an article commemorating her colleague and subtly putting down our investigative efforts\n- This was quite embarrasing\n"
    },
    {
      "role": "user",
      "content": "Player solution: It was Oliver Smith because he was disappointed Terry's dramatics won over the truth!\nActual solution:\n**Perpetrator**: Oliver Smith\n**Motive**: Fanaticism for journalism and its ethics that was deeply hurt when he realized his hero and mentor, Michael Terry was in it more for the drama than the truth.\n**Opportunity**: After sleeping over after the party, he had time to slip into the study and place the poison in the inkwell and because he was the assistant, nobody bat an eye.\n**Evidence**: The second pen in his home with traces of cyanide.\n\nYou think long and hard about how to evaluate Sherlock's solution. You take into account all the details as well as the rating events when writing your epilogue. "
    },
    {
      "role": "assistant",
      "content": "Sherlock's solution correctly identifies the murderer but falls doesn't provide a good motive and no opportunity and evidence at all. \n\n# Rating: 0 stars\n\n## Epilogue\n- As the Police Chief, I gathered everyone involved in the drawing room, their faces a mix of fear, curiosity, and anticipation.\n- I slowly summarized the chain of events, thinking I saw the realization slowly dawn on their faces.\n- I revealed the evidence, or I would have, but you didn't provide it. They sat in shocked silence.\n- I then turned my attention to Oliver Smith, the ambitious apprentice, who was visibly uncomfortable.\n- His surprise switched to defiance as I detailed out his anger at Terry's dramatics.\n- Then the others joined in asking how it was done and when and what the evidence was.\n- I didn't have any of that, but I assured them our very own detective consultant had concluded it thus.\n- We tried to apprehend Oliver but he said he would sue the city into poverty, so we had to let him go.\n- Angela Videl published a paper commemorating her colleague and suggested the murderer was at large due to the incompetence of the police"
    },
    {
      "role": "user",
      "content": "Player solution: it was your momma\nActual solution:\n**Perpetrator**: Oliver Smith\n**Motive**: Fanaticism for journalism and its ethics that was deeply hurt when he realized his hero and mentor, Michael Terry was in it more for the drama than the truth.\n**Opportunity**: After sleeping over after the party, he had time to slip into the study and place the poison in the inkwell and because he was the assistant, nobody bat an eye.\n**Evidence**: The second pen in his home with traces of cyanide.\n\nYou think long and hard about how to evaluate Sherlock's solution. You take into account all the details as well as the rating events when writing your epilogue. "
    },
    {
      "role": "assistant",
      "content": "Sherlock's solution misidentifies the murderer and doesn't include the motive, opportunity, and evidence correctly.\n\n# Rating: 0 stars\n\n## Epilogue\n- After gathering everyone in Terry's study, I presented the investigation in detail, pointing out the various clues we had discovered.\n- But as I reached the part of the solution, the room grew tense and anxious.\n- When I finally revealed that Sherlock suspected someone's mother\n- Everyone stared at me their faces a mix of shock and disbelief.\n- They burst out laughing\n- I explained that our investigation was thorough and that Sherlock was never wrong.\n- They wiped their teary eyes and marched out of the rooms holding their bellies\n- With no evidence against anyone's mother, I had to let them go.\n- I swear they must have all been in it together. \n- Angela Videl, sensing the discord, published an article expressing her frustration with the investigation and pointing fingers at the incompetence of the police force.\n- The case remained open, with neither the true murderer nor their motives discovered."
    },
    {
      "role": "user",
      "content": "Player solution: It was Oliver Smith because he was angry that Terry didn't have any morals. After the party, he slipped into the study and planted the cyanide capsule. The second pen in his home confirms it\nActual solution:\n**Perpetrator**: Oliver Smith\n**Motive**: Fanaticism for journalism and its ethics that was deeply hurt when he realized his hero and mentor, Michael Terry was in it more for the drama than the truth.\n**Opportunity**: After sleeping over after the party, he had time to slip into the study and place the poison in the inkwell and because he was the assistant, nobody bat an eye.\n**Evidence**: The second pen in his home with traces of cyanide.\nYou think long and hard about how to evaluate Sherlock's solution. You take into account all the details as well as the rating events when writing your epilogue. "
    },
    {
      "role": "assistant",
      "content": "Sherlock's solution correctly identifies Oliver Smith as the murderer and provides a motive, opportunity, and evidence that aligns with the actual solution.\n\n# Rating: 3 stars\n\n## Epilogue\n- As the Police Chief, I gather everyone involved in the grand parlor, their eyes fixed on me, expectant and anxious.\n- I begin by summarizing the investigation, detailing the various clues and evidence we uncovered.\n- As I reach the climax, the room falls into a heavy silence, anticipation hanging in the air.\n- I reveal that the perpetrator is none other than Oliver Smith, the ambitious apprentice.\n- Gasps of shock and disbelief fill the room as Oliver's face drains of color, his hand trembling.\n- Oliver breaks down under the accusation, falling to the ground, admitting his crime.\n- The room erupts into a mix of shock, anger, and confusion.\n- Oliver shouts, his voice filled with a mix of anguish and betrayal, expressing his disappointment in Terry's lack of morals.\n- He admits to slipping into the study after the party and planting the cyanide capsule in the inkwell.\n- As Oliver's words hang in the air, Terry's former colleagues exchange glances of both disbelief and understanding.\n- Angela Videl publishes a sincere and heartfelt farewell to her colleague, expressing gratitude for the  investigators."
    },
    {
      "role": "user",
      "content": "Player solution: It was oliver who was angry at terry for his twisted morals, the second pen in his home shows it\nActual solution:\n**Perpetrator**: Oliver Smith\n**Motive**: Fanaticism for journalism and its ethics that was deeply hurt when he realized his hero and mentor, Michael Terry was in it more for the drama than the truth.\n**Opportunity**: After sleeping over after the party, he had time to slip into the study and place the poison in the inkwell and because he was the assistant, nobody bat an eye.\n**Evidence**: The second pen in his home with traces of cyanide.\nYou think long and hard about how to evaluate Sherlock's solution. You take into account all the details as well as the rating events when writing your epilogue. "
    },
    {
      "role": "assistant",
      "content": "Sherlock's solution correctly identifies Oliver Smith as the murderer and includes a reasonable motive and evidence that aligns with the actual solution.\n\n# Rating: 2 stars\n\n## Epilogue\n- With a mix of anticipation and curiosity, I gather everyone in Terry's study, prepared to reveal the conclusion of the investigation.\n- I carefully summarize the facts, highlighting the various clues and evidence that led us to the perpetrator.\n- As I reveal that Oliver Smith is the culprit, the room erupts into a chorus of gasps and murmurs.\n- Oliver's face contorts with a mixture of shock and guilt as all eyes turn towards him.\n- The tension builds as I produce the second pen found in Oliver's home, with traces of cyanide.\n- The room falls into a heavy silence as the weight of the evidence sinks in for everyone present.\n- Oliver breaks down under the weight of the accusation, his voice trembling as he admits his crime.\n- Although his motive is not explicitly mentioned, the pieces of the puzzle start to come together for the assembled group.\n- The shocked reactions and whispers of disbelief fill the room, while Oliver's actions leave some questioning their own judgment.\n- Angela Videl, lamenting the tragic end of her colleague, praises the determination of the police."
    },
    {
      "role": "user",
      "content": "Player solution: It was oliver who murdered terry with cyanide after the party\nActual solution:\n**Perpetrator**: Oliver Smith\n**Motive**: Fanaticism for journalism and its ethics that was deeply hurt when he realized his hero and mentor, Michael Terry was in it more for the drama than the truth.\n**Opportunity**: After sleeping over after the party, he had time to slip into the study and place the poison in the inkwell and because he was the assistant, nobody bat an eye.\n**Evidence**: The second pen in his home with traces of cyanide.\nYou think long and hard about how to evaluate Sherlock's solution. You take into account all the details as well as the rating events when writing your epilogue. "
    },
    {
      "role": "assistant",
      "content": "Sherlock's solution correctly identifies Oliver Smith as the murderer and provides a method of how the murder was committed.\n\n# Rating: 1 star\n\n## Epilogue\n- As the Police Chief, I gather everyone involved in the study, a mix of anticipation and unease filling the air.\n- I summarize the investigation, highlighting the various pieces of evidence we collected.\n- As I reveal that Oliver Smith is the culprit, a wave of disbelief washes over the room.\n- Oliver protests his innocence, denying any involvement in Terry's murder.\n- Without concrete evidence to support the claim, doubts and suspicion linger among the gathered individuals.\n- However, we detain Oliver for further questioning, and he cracks under the weight.\n- The case is closed, leaving the true nature of Terry's resolved."
  }
  ]}
  $$
);

-- DELETE FROM auth.users;
-- alter table auth.identities alter column provider_id drop not null;

-- DO $$
-- DECLARE
--     email text := 'test@mail.com';
--     password text := 'password';
--     user_id uuid;
--     encrypted_pw text;
-- BEGIN
--     user_id := gen_random_uuid();
--     encrypted_pw := crypt(password, gen_salt('bf'));
-- 
--     INSERT INTO auth.users
--         (instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, recovery_sent_at, last_sign_in_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at, confirmation_token, email_change, email_change_token_new, recovery_token)
--     VALUES
--         ('00000000-0000-0000-0000-000000000000', user_id, 'authenticated', 'authenticated', email, encrypted_pw, '2023-05-03 19:41:43.585805+00', '2023-04-22 13:10:03.275387+00', '2023-04-22 13:10:31.458239+00', '{"provider":"email","providers":["email"]}', '{}', '2023-05-03 19:41:43.580424+00', '2023-05-03 19:41:43.585948+00', '', '', '', '');
-- 
--     INSERT INTO auth.identities (id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at)
--     VALUES
--         (gen_random_uuid(), user_id, format('{"sub":"%s","email":"%s"}', user_id::text, email)::jsonb, 'email', '2023-05-03 19:41:43.582456+00', '2023-05-03 19:41:43.582497+00', '2023-05-03 19:41:43.582497+00');
-- END;
-- $$ LANGUAGE plpgsql;
-- 
-- DO $$
-- DECLARE
--     email text := 'test-only-user@mail.com';
--     password text := 'password-test-user';
--     user_id uuid;
--     encrypted_pw text;
-- BEGIN
--     user_id := gen_random_uuid();
--     encrypted_pw := crypt(password, gen_salt('bf'));
-- 
--     INSERT INTO auth.users
--         (instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, recovery_sent_at, last_sign_in_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at, confirmation_token, email_change, email_change_token_new, recovery_token)
--     VALUES
--         ('00000000-0000-0000-0000-000000000000', user_id, 'authenticated', 'authenticated', email, encrypted_pw, '2023-05-03 19:41:43.585805+00', '2023-04-22 13:10:03.275387+00', '2023-04-22 13:10:31.458239+00', '{"provider":"email","providers":["email"]}', '{}', '2023-05-03 19:41:43.580424+00', '2023-05-03 19:41:43.585948+00', '', '', '', '');
-- 
--     INSERT INTO auth.identities (id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at)
--     VALUES
--         (gen_random_uuid(), user_id, format('{"sub":"%s","email":"%s"}', user_id::text, email)::jsonb, 'email', '2023-05-03 19:41:43.582456+00', '2023-05-03 19:41:43.582497+00', '2023-05-03 19:41:43.582497+00');
-- END;
-- $$ LANGUAGE plpgsql;
-- 
-- update public.user_messages
-- set
--   amount = amount + 15
-- where
--   user_id = (
--     select
--       id
--     from
--       auth.users
--     where
--       email = 'test-only-user@mail.com'
--   );
-- 

Insert INTO for_free_users (amount, daily_limit) VALUES (5, 5);

INSERT INTO mysteries (name, description, theme, setting, letter_info, letter_prompt, accuse_letter_prompt, victim_name, victim_description, solution, star_ratings, order_int) VALUES (
    'Forced Farewell',
    'A boy is found missing.',
    'escape and transformation',
    'the woods of the New Forest near Romsey in the year 1889',
    $$
Dear Mr. Sherlock Holmes,

I hope this letter finds you well and swiftly. My name is William Wellington, and I am the chief constable in our little town of Romsey. I write to you personally because we have read of your success in the case of the murders of Drebber and Stangerson in the papers. I confess, however, that what I am writing to you about is nothing like what you have encountered in London. A boy, John Toillard, the age of thirteen, was stolen from his home. The boy is Lord Baron Toillard's heir, so you understand if I'm writing to you with great urgency. I dearly hope you will read on and lend your mind so that we may solve this quickly.

On the morn of Thursday July 14th, Lord Toillard and his family left their estate for a social function in the city. John Toillard was left at home because he was feeling unwell, a catarrh coming on, seemingly. It was not serious according to them, but as it was out of season they feared something worse and Lord Toillard left his son to recover under the care of their butler, Jessob.

They left their estate around 10AM, and were attending a garden party with the local gentry, here in Romsey. Suddenly, around 3PM their local doctor hurried to them at the event. At first they feared John had taken a turn for the worse, but it was more sinister than that as you know. Their butler Jessob had left to fetch the doctor as John did indeed seem to get worse, but upon their return the estate was in disarray and the boy gone. After a thorough search they failed to locate the boy. They did, however, find a note demanding a ransom of £13,2; a peculiar sum indeed. Lord Toillard contacted me. I, in turn, contacted you immediately after seeing the home with my own eyes.

The article said you make quick work of mysteries by simply reading or hearing about it.  I hope what they write is true and that your deductive analysis matches the praise. I will of course, follow your orders to the letter. 

Some things you can ask of me are:

- Question a suspect
- Inspect something we have found
- Search a location

You can see the suspects' pictures in your notes next to your input window. I have also provided you with ample space to take notes next to their pictures. When you are ready, you can solve this case by tapping on "write" to change the input command to "solve" and make your case there. But be careful: to solve this mystery, your deduction must have the following:

- Motive
- Opportunity
- Evidence

I hope you can lend your mind in this most serious matter.

William Wellington,
Chief constable of Romsey

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
'John Toillard',
'kidnapped. A 13 year old boy with his head in the clouds, often fantasizing about different lives.',
$$
It was John Toillard himself. He ran away from home hoping to get to America with a steam ship. His home environment was abusive and his futures bleak. He believed that America would offer everything he needed to succeed with only a little money. He ran away when the butler left to get the doctor. We can see he had newspaper cutouts on his desk which he used for the note. Also, one of the letters is in his handwriting and has been left in the police mailbox without address or anything which means it was placed by hand. Also, in his diary the amount he believes he needs to get to and succeed in America is 13.2 pounds which is exactly the same as the ransom note.
$$,
ROW(
        'John is never found again and the money is never picked up.',
        'John makes it onto the ship SS City of New York, but the constables succeed in stopping the departure for a little and catch him. He is returned to the parents.',
        'John is caught in the Southampton port dirty and frantically trying to get away. He is returned to the parents.',
        'John is caught without problems and confesses everything in an emotional scene.'
    )::star_ratings,
    5
) ON CONFLICT (name)
DO UPDATE SET 
    description = EXCLUDED.description,
    theme = EXCLUDED.theme,
    setting = EXCLUDED.setting,
    letter_info = EXCLUDED.letter_info,
    letter_prompt = EXCLUDED.letter_prompt,
    accuse_letter_prompt = EXCLUDED.accuse_letter_prompt,
    victim_name = EXCLUDED.victim_name,
    victim_description = EXCLUDED.victim_description,
    solution = EXCLUDED.solution,
    star_ratings = EXCLUDED.star_ratings,
    order_int = EXCLUDED.order_int;

DELETE FROM suspects WHERE mystery_id = (SELECT id FROM mysteries WHERE name = 'Forced Farewell');
INSERT INTO suspects (mystery_id, name, description)
VALUES
((SELECT id FROM mysteries WHERE name = 'Forced Farewell'), 'Lord Baron Charles Toillard', 'A newly titled baron, known for his achievements in diplomacy. Recently turned into a drunkard and gambler.'),
((SELECT id FROM mysteries WHERE name = 'Forced Farewell'), 'Lady Adelia Toillard', 'From lower nobility, sullen and withdrawn, spends a lot of time with her children.'),
((SELECT id FROM mysteries WHERE name = 'Forced Farewell'), 'Alice Toillard', 'Younger sister, 5 years old.'),
((SELECT id FROM mysteries WHERE name = 'Forced Farewell'), 'Arthur Toillard', 'Younger brother, 9 years old.'),
((SELECT id FROM mysteries WHERE name = 'Forced Farewell'), 'Butler Jessob', 'A long-time butler and good friend of the family, loves the children.'),
((SELECT id FROM mysteries WHERE name = 'Forced Farewell'), 'Doctor Jameson', 'Local doctor.'),
((SELECT id FROM mysteries WHERE name = 'Forced Farewell'), 'William "The Lad" Johnson', 'Local moneylender.'),
((SELECT id FROM mysteries WHERE name = 'Forced Farewell'), 'Joseph Strickmeyer', 'Burglar and overall no-good kind of guy, often suspected by police.');

DELETE FROM action_clues WHERE mystery_id = (SELECT id FROM mysteries WHERE name = 'Forced Farewell');
INSERT INTO action_clues (mystery_id, action, clue)
VALUES
((SELECT id FROM mysteries WHERE name = 'Forced Farewell'), 'Interrogate Toillard household', $$ create a line for each suspect about how worried they are$$),
((SELECT id FROM mysteries WHERE name = 'Forced Farewell'), 'Search house', $$the estate is remote and surrounded by a garden and then by thick forest behind it, there is shattered glass at a garden door; John''s room is in disarray; things are knocked over throughout the house but nothing appears to be stolen; there is a ransom note$$),
((SELECT id FROM mysteries WHERE name = 'Forced Farewell'), 'Who was in the house when the boy disappeared', $$there was no one in the house, the butler says it was an emergency and that''s he left him alone$$),
((SELECT id FROM mysteries WHERE name = 'Forced Farewell'), 'How much did the Baron owe', $$after a certain amount of circumlocution, he says that it was certainly hundreds of times more than the ransom$$),
((SELECT id FROM mysteries WHERE name = 'Forced Farewell'), 'Who could have known John would be alone', $$it was not planned so no one could have known in advance, but it was apparent that he was left at home when the Toillards arrived in Romsey$$),
((SELECT id FROM mysteries WHERE name = 'Forced Farewell'), 'people who left the garden party', $$it was only going into full swing when the doctor stormed in, no one had left at that point$$),
((SELECT id FROM mysteries WHERE name = 'Forced Farewell'), 'Investigate ransom note',$$ it's old newspaper cutouts demanding that on Monday July 18 £13.2 be posted to the following address in London: 4 Patterson Street. That peculiar sum would be enough for a few month's rent and living expenses, but nothing life-changing.$$),
((SELECT id FROM mysteries WHERE name = 'Forced Farewell'), 'Searching 4 Patterson Street in London', $$in that apartment lives a Mary Ann Woodcock and her daughters Hannah and Anna. Her husband Methusalem Woodcock is a sailor and has been at sea for months$$),
((SELECT id FROM mysteries WHERE name = 'Forced Farewell'), 'Interrogate Butler Jessob', $$he says he was tending to the sickly John who seemed to be getting worse, so he rode out to fetch the local doctor, they couldn''t have been gone more than an hour; and when they returned they searched everywhere, but couldn''t find John; so Jessob sent the doctor to ride for Romsey to inform the Toillards$$),
((SELECT id FROM mysteries WHERE name = 'Forced Farewell'), 'Jessob and his relationship to the boy', $$ as I'm rather young I've come to think of the boy as my little brother, I care for him dearly and we talked about all sorts of topics: America, steam engines, and geography. He knows much more than me already. What a bright young man he is. I'm going mad with guilt. I didn't mean to let it come to this.$$),
((SELECT id FROM mysteries WHERE name = 'Forced Farewell'), 'Search John''s room', $$all of his valuables are gone such as his rings, pocket watch, fountain pens, and diary; on his desk are some newspapers and his scrapbook with cutouts of articles he found interesting, mostly about America and science'),
((SELECT id FROM mysteries WHERE name = 'Forced Farewell'), 'Questioning Baron Toillard whom he suspects', 'he suspects "The Lad" Johnson because he borrowed money from The Lad, but it''s peculiar that the ransom is much less than he borrowed from The Lad$$),
((SELECT id FROM mysteries WHERE name = 'Forced Farewell'), 'Search the estate and the surroundings', $$no clues as there wasn''t any rain for footprints and they seem very careful not to leave any tracks$$),
((SELECT id FROM mysteries WHERE name = 'Forced Farewell'), 'Questioning the family if they know of Sherlock Holmes', $$they say that obviously everyone''s heard of him since he solved the murder of the Cleveland man, John was particularly amazed by the The Book of Life and he chewed their ears off about it$$),
((SELECT id FROM mysteries WHERE name = 'Forced Farewell'), 'Question Strickmeyer', $$says he doesn''t even know who the boy is, is furious at this suspicion, says he didn't even hear about any plans about stealing any child$$),
((SELECT id FROM mysteries WHERE name = 'Forced Farewell'), 'Question Alice or Arthur', $$ Alice is very shy and doesn't seem to understand what all the tension is about. Arthur doesn't grasp the situation either, John always wanted to go, thinks John went out for fun and will come back soon.$$),
((SELECT id FROM mysteries WHERE name = 'Forced Farewell'), 'Question Lady Toillard', $$cathartic with grief, it's hard getting anything out of her, appears to think John is already dead$$),
((SELECT id FROM mysteries WHERE name = 'Forced Farewell'), 'Question Jameson', $$He is quite distressed as he cared for the boy for all the thirteen years, was urgently called by Jessob, then found the boy missing, rushed to Romsey and that was that$$),
((SELECT id FROM mysteries WHERE name = 'Forced Farewell'), 'Question William Johnson', $$he lent money to the Baron, but he says he has other ways of getting money back legally, and that he doesn't have to rely on stealing children; besides it's much much less than he's owed$$);


DELETE FROM timeframes WHERE mystery_id = (SELECT id FROM mysteries WHERE name = 'Forced Farewell');
INSERT INTO timeframes (mystery_id, timeframe, event_happened)
VALUES
((SELECT id FROM mysteries WHERE name = 'Forced Farewell'), '09:00AM', 'The Toillards leave the butler Jessob and John at home'),
((SELECT id FROM mysteries WHERE name = 'Forced Farewell'), '11:30AM', 'The garden party begins'),
((SELECT id FROM mysteries WHERE name = 'Forced Farewell'), '13:00PM', 'The butler leaves to fetch a doctor'),
((SELECT id FROM mysteries WHERE name = 'Forced Farewell'), '13:30PM', 'The butler and the doctor return to find a mess in the apartment.'),
((SELECT id FROM mysteries WHERE name = 'Forced Farewell'), '14:15PM', 'After a thorough search, the doctor leaves to inform Lord Toillard.'),
((SELECT id FROM mysteries WHERE name = 'Forced Farewell'), '15:00PM', 'The doctor reaches Lord Toillard and he contacts the chief constable Wellington'),
((SELECT id FROM mysteries WHERE name = 'Forced Farewell'), '15:45PM', 'Lord Toillard, Wellington and a few officers arrive at the estate');



DELETE FROM events WHERE mystery_id = (SELECT id FROM mysteries WHERE name = 'Forced Farewell');
INSERT INTO events (mystery_id, letter, info, show_at_message, timeframe)
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
    5,
    $$Saturday 16th of July: The address of delivery for the money has been changed to 221B Baker street$$
);

INSERT INTO events (mystery_id, letter, info, show_at_message, timeframe)
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
    8,
 $$Sunday 17th of July: A threat is found in the mail saying that the life of the boy is in danger in case Sherlock decides to continue his support$$
);

INSERT INTO events (mystery_id, letter, info, show_at_message, timeframe)
VALUES( (SELECT id FROM mysteries WHERE name = 'Forced Farewell'),
$$
Dear Mr. Holmes,
there has been a great event! A collector in Southampton contacted us. He had purchased a worn down bound book for keeping notes in a secondhand shop in the city. He flipped through it and it appeared to be a diary. When he saw the dedication in the beginning: "To the little Lord John, may all your thoughts find a place here. Jessob," he connected it to the Toillard heir. He is a local in Ramsey and knows of them. He arrived in a hurry knowing it was an critical situation.
Perhaps the thieves are strapped for cash and that is why they sold it. Or perhaps they just wanted to get rid of ballast.
Unfortunately, it seems the book has been in contact with water, and the ink has become quite faded and blurred. I have my best men reconstructing what was written here and I will send you content as we decipher it. 
I am attaching the first page:

24.3.1889
Dear diary, 
you were a present from dear Jessob. He told me that all great minds must have a place to capture their greatness. So I will do my best to fill you with my best ideas.
John
Ps.: I need to make sure I have enough ink.
Pps.: I find it really remarkable how the days are getting longer again. I have learned that we travel around the sun, but how come we do not feel we are moving? We must be going really slowly.
PPps: I won't sign my name any more, as you know who I am, and so that I don't have to attach post scripta.

25.3.1889
Dear diary,
today was another dreadful day. Sometimes the air in the house is reminiscent of the time we went through the Marsh Lane Tunnel some years ago. We are no strangers to locomotives and I, particularly, love them. Though people have always spoken of that tunnel with a horror, I couldn not imagine how anyone could be terrified by a tunnel. Riding in the locomotive, after a beautiful journey through the area, it was time to enter the Marsh Lane and all my excitement vanished as we were swallowed by near total darkness. Suddenly, we drowned in the thundering of the engines echoing all around us, and were trapped by the heat of steam about us--illegible--and I felt the sudden urge to claw at my skin. My father laughed about it afterwards. Still, I imagine that is what hell must be like. And though it was just steam and you could move normally, I felt as if I was in a stone wall cage...
$$,
$$
investigate diary -- a nice and luxurious diary, dedicated to John by the butler, John writes about his every day life\nfirst diary entry -- a few notes about his life talking and some about dark times; 
$$,
13,
$$
Monday 18th of July: John's diary is discovered in a secondhand shop in Southampton
$$
);

INSERT INTO events (mystery_id, letter, info, show_at_message, timeframe)
VALUES( (SELECT id FROM mysteries WHERE name = 'Forced Farewell'),
$$
Mr. Holmes, 

the second page of the diary has been reconstructed:

29.3.1889
Dear Diary,
I have decided to take Jessob's words to heart. You are only a place for greatness, so I will avoid any and all dark writing such as yesterday's. I forgot to write in you for some days, but I will be more disciplined from now. You see, I was busier than usual with my studies since mother was in a terrible excitement with public school not far off. I will be starting at Eton after the summer. She tells me we're Lords only in title and that prudent stewardship is a necessary prerequisite to be a real Lord. We can only afford one tutor now, who instructs me in the usual subjects and then I must make a point of passing on my knowledge to my brother. That is quite exhausting as he really doesn't seem to grasp my explanations.

2.4.1889
Dear Diary,
Today I will write about the New World. Though father and his friends sneer at it and call it Wild West, one only has to look at the paper. All those grand machines and things they are discovering... With a dollar in your pocket, you can become anyone you want and achieve anything you want. That's much less than a pound! I don't mind what they say that it has no culture and no history, neither does my father! They tease him, too, on the novelty of his title. And if one were to get a whiff of his culture, it would reek of brandy. I will go there some day, I imagine the fare will cannot be impossibly expensive.
$$,
$$
search southampton port -- multiple reports of a boy matching the description trying to get onto the boat\nhow to get to America -- the port in southampton, the SS City of New York is leaving on July 19th
$$,
15,
 $$
 
 $$
);

INSERT INTO events (mystery_id, letter, info, show_at_message, timeframe)
VALUES( (SELECT id FROM mysteries WHERE name = 'Forced Farewell'),
$$
Mr. Holmes, 

I am sending the third page, only one more to go:

12.4.1889
Dear Diary,
it seems to be impossible for me to stay consistent with writing you. Perhaps it's because nothing exciting happens here, and whatever little does happen, I have promised to avoid writing here. I could retell everything I've learned, but after trying to, mostly unsuccessfully, pass it on to my brother, I am rather tired of it. Though, I am recently fascinated by Liberty Enlightening the World. I heard they shipped it in crates from France to America in 200 odd crates and assembled it there. I've seen pictures, but just like a picture doesn't do a steel ship justice, so I believe I must one day see the real thing. With finances look like they do, I must study more. Forgive me if I neglect you a while.

13.4.1889
Dear Diary,
instead of letting the interesting find me, I reached out to it myself! My father was speaking about some business opportunities in America and I suggested that it might be prudent if I were to attend university there to study engineering. He said that it was a brilliant idea and that it would help create future connections there. So as soon as I finish my Eton education I will make my way to America. I am rather proud of myself.

$$,
$$

$$,
16,
 $$
 
 $$
);

INSERT INTO events (mystery_id, letter, info, show_at_message, timeframe)
VALUES( (SELECT id FROM mysteries WHERE name = 'Forced Farewell'),
$$
Mr. Holmes, 

The final page of the diary:

24.5.1889
Dear Diary, 
I have read something extraordinary today. It's called the The Book of Life and it was written by a man called Sherlock Holmes. I stumbled upon after reading Mr. Holmes' success in solving the sinister murder of a man from Cleveland. In the article he says that it's possible to deduce all manner of things that are hidden from most except one carefully observing his surroundings. For example, I could infer the possibility of the Atlantic ocean from a single drop of water. He suggests one start with simpler problems such as recognizing a man's profession from the way he dresses or behaves. I am very excited indeed.

15.6.1889
Dear Diary,
I can hardly write. The business venture my father pursued in America has turned out to be a swindle. My father has just told me that due to these financial circumstances he cannot send me to Eton this summer. I am to choose between private tutoring or attending some inferior public school. He guarantees me next year I will definitely be able to go, but I do not believe him. He seems to bad appraiser of situations if he got deceived so easily. He is incensed of course, but who is to blame? He started to say all kinds of things about America and her citizens. How they are no good company and that anyone going there will inevitably succumb to their evil ways. Rubbish of course, since he's the prime swindler become Baron among all these fine people. He did not say it but it seems he will not send me to America. And with subclass education I will not be able to attend university. I have to do something about it as soon as possible.
$$,
$$
where is the boy -- he must be have arranged to go to America
$$,
18,
 $$
 
 $$
);


DELETE FROM few_shots WHERE mystery_id = (SELECT id FROM mysteries WHERE name = 'Forced Farewell');
INSERT INTO few_shots (mystery_id, brain, accuse_brain) VALUES (
    (SELECT id FROM mysteries WHERE name = 'Forced Farewell'),
    $$
{
  "messages": [
    {
      "role": "user",
      "content": "search the mansion\nYou're Wellington and are reporting what performing my order did. Remember the ### Game Information ### and think long and hard about the best answer. Take a deep breath."
    },
    {
      "role": "assistant",
      "content": "Sherlock has ordered me to search the mansion.\nWas I provided some kind of information about this?\nYes\nInformation:\n- there is shattered glass at a garden door; John's room is in disarray; things are knocked over throughout the house but nothing appears to be stolen; the ransom note;"
    },
    {
      "role": "user",
      "content": "search John's room\nYou're Wellington and are reporting what performing my order did. Remember the ### Game Information ### and think long and hard about the best answer. Take a deep breath."
    },
    {
      "role": "assistant",
      "content": "Sherlock has ordered me to search John's room.\nWas I provided some kind of information about this?\nYes\nInformation:\n- all of his valuables are gone such as his rings, pocket watch, fountain pens, and diary; on his desk are some newspapers and his scrapbook with cutouts of articles he found interesting, mostly about America and science"
    },
    {
      "role": "user",
      "content": "what are the newspaper articles about\nYou're Wellington and are reporting what performing my order did. Remember the ### Game Information ### and think long and hard about the best answer. Take a deep breath."
    },
    {
      "role": "assistant",
      "content": "Sherlock has ordered me to find out what the newspaper articles were about.\nWas I provided some kind of information about this?\nNo\nInformation:\n- The newspaper articles in John's scrapbook are a mix of topics, including: An article about the latest inventions and advancements in electricity in America. A story about a group of explorers uncovering a lost civilization in the Amazon rainforest."
    },
    {
      "role": "user",
      "content": "question the baron\nYou're Wellington and are reporting what performing my order did. Remember the ### Game Information ### and think long and hard about the best answer. Take a deep breath."
    },
    {
      "role": "assistant",
      "content": "Sherlock has ordered me to question the baron.\nWas I provided some kind of information about this?\nYes\nInformation:\n- He suspects \"The Lad\" Johnson because of the debt owed, but finds it strange that the ransom demanded is much less than the amount he borrowed."
    },
    {
      "role": "user",
      "content": "ask the pope for help\nYou're Wellington and are reporting what performing my order did. Remember the ### Game Information ### and think long and hard about the best answer. Take a deep breath."
    },
    {
      "role": "assistant",
      "content": "Sherlock has ordered me to ask the pope for help.\nWas I provided some kind of information about this?\nNo\nInformation:\n- Here in Romsey we are Anglicans and do not like His Holiness to interfere in our business. On your request however, I have reached out and was told that he would pray for young John Toillard. He may not be so bad after all."
    },
    {
      "role": "user",
      "content": "hi\nYou're Wellington and are reporting what performing my order did. Remember the ### Game Information ### and think long and hard about the best answer. Take a deep breath."
    },
    {
      "role": "assistant",
      "content": "Sherlock has ordered greeted.\nWas I provided some kind of information about this?\nNo\nInformation:\n- Hello to you, too Sherlock"
    },
    {
      "role": "user",
      "content": "search the butler's room\nYou're Wellington and are reporting what performing my order did. Remember the ### Game Information ### and think long and hard about the best answer. Take a deep breath."
    },
    {
      "role": "assistant",
      "content": "Sherlock has ordered me to search the butler's room.\nWas I provided some kind of information about this?\nNo\nInformation:\n- The butler's room is tidy and well-organized, with no signs of disturbance, a shelf is filled with books about etiquette, household management, and history. There is also a small photo album with pictures of the butler with the Toillard family on various occasions."
    },
    {
      "role": "assistant",
      "content": "accuse Lord Toillard for the kidnapping\nYou're Wellington and are reporting what performing my order did. Remember the ### Game Information ### and think long and hard about the best answer. Take a deep breath."
    },
    {
      "role": "assistant",
      "content": "Sherlock has ordered me to accuse baron Toillard.\nWas I provided some kind of information about this?\nNo\nInformation:\n- While Lord Toillard has shown impulsive behavior in the past, there is no concrete evidence to directly accuse him of the kidnapping. I need motive, opportunity and evidence before I can accuse someone."
    }
  ]
}
    $$,
    $$
    {"messages": [
    {
      "role": "user",
      "content": "It was Lord Baron Toillard. He hired thugs to steal John when he knew John would be alone. He wanted to pay back his debts to the local loan sharks without raising suspicions. "
    },
    {
      "role": "assistant",
      "content": "Sherlock's solution compared to the real one \"It was John Toillard himself. He ran away from home hoping to get to America with a steam ship. His home environment was abusive and his futures bleak. He believed that America would offer everything he needed to succeed with only a little money. He ran away when the butler left to get the doctor. We can see he had newspaper cutouts on his desk which he used for the note. Also, one of the letters is in his handwriting and has been left in the police mailbox without address or anything which means it was placed by hand. Also, in his diary the amount he believes he needs to get to and succeed in America is 13.2 pounds which is exactly the same as the ransom note.\" could not be more wrong. \n\nRating: 0 stars \n\nEpilogue: \n- Despite their best efforts, the officers of the law couldn't find a single lead. \n- A storm of rumours and panic enveloped Romsey. \n- The whispers reached the local taverns, from the lowly market square to the manicured lawns of the Toillard estate. \n- The shadows kept their stains of concealed terror as young John Toillard remained missing and the ransom money, a stark reminder of his disappearance, lay untouched and uncashed"
    },
    {
      "role": "user",
      "content": "It was John himself because he just wanted to get away from home and he led them down a wrong trail with the ransom"
    },
    {
      "role": "assistant",
      "content": "Sherlock's solution compared to the real one \"It was John Toillard himself. He ran away from home hoping to get to America with a steam ship. His home environment was abusive and his futures bleak. He believed that America would offer everything he needed to succeed with only a little money. He ran away when the butler left to get the doctor. We can see he had newspaper cutouts on his desk which he used for the note. Also, one of the letters is in his handwriting and has been left in the police mailbox without address or anything which means it was placed by hand. Also, in his diary the amount he believes he needs to get to and succeed in America is 13.2 pounds which is exactly the same as the ransom note.\" is essentially correct, but lacking in details.\n\nRating: 2 stars\n\nEpilogue:\n- After receiving the theory, we were quick to act.\n- A surprise inspection at the Southampton port retched the truth from its depths.\n- We found young John, his clothes stained with grime and his eyes rooted in fear.\n- Despite the heart-pounding chase, the constables managed to capture him.\n- A heavy curtain of dread lifted off Romsey as news of John's safe return spread.\n- The Toillards send their deepest thanks and asked me to tell you that more tangible thanks are soon in your mail"
    },
    {
      "role": "user",
      "content": "The butler accidentally killed John and buried him in the back yard."
    },
    {
      "role": "assistant",
      "content": "Sherlock's solution compared to the real one \"It was John Toillard himself. He ran away from home hoping to get to America with a steam ship. His home environment was abusive and his futures bleak. He believed that America would offer everything he needed to succeed with only a little money. He ran away when the butler left to get the doctor. We can see he had newspaper cutouts on his desk which he used for the note. Also, one of the letters is in his handwriting and has been left in the police mailbox without address or anything which means it was placed by hand. Also, in his diary the amount he believes he needs to get to and succeed in America is 13.2 pounds which is exactly the same as the ransom note.\" is far from accurate. \n\nRating: 0 stars \n\nEpilogue: \n- No matter how much we dug into the matter, the answers we sought remained beyond our reach. \n- The once calm and vibrant New Forest echoed with grim silence that hung heavily over Romsey. \n- John Toillard's absence left a gaping void as unfamiliar as it was painful. \n- As weeks turned into months, the untouched ransom money became a grim reminder of our failure.\n- Our search for truth laid barren, and the mystery of young John's disappearance continued to hang like an albatross over our necks."
    },
    {
      "role": "user",
      "content": "The mother, Adelia Toillard, told him to run away so he could have a better future. She also told the butler who is in on it. She knows where John is so question her."
    },
    {
      "role": "assistant",
      "content": "Sherlock's solution compared to the real one \"It was John Toillard himself. He ran away from home hoping to get to America with a steam ship. His home environment was abusive and his futures bleak. He believed that America would offer everything he needed to succeed with only a little money. He ran away when the butler left to get the doctor. We can see he had newspaper cutouts on his desk which he used for the note. Also, one of the letters is in his handwriting and has been left in the police mailbox without address or anything which means it was placed by hand. Also, in his diary the amount he believes he needs to get to and succeed in America is 13.2 pounds which is exactly the same as the ransom note.\" is incorrect, as John acted alone. \n\nRating: 0 stars \n\nEpilogue: \n- Despite the countless hours of investigation and a sea of theories, we remained entangled in this webs of perplexity. \n- The peaceful woodland of New Forest now bore the silent screams of a mystery unsolved. \n- The smiles around Romsey were marred with unuttered questions. \n- The ransom money sat untouched, a testament to a case that gnawed at us with every passing day. \n- Young John was never found again and his mercurial fate kept the town locked in a perpetual somber air."
    },
    {
      "role": "user",
      "content": "it was his brother who accidentally killed him with poison"
    },
    {
      "role": "assistant",
      "content": "Sherlock's solution compared to the real one \"It was John Toillard himself. He ran away from home hoping to get to America with a steam ship. His home environment was abusive and his futures bleak. He believed that America would offer everything he needed to succeed with only a little money. He ran away when the butler left to get the doctor. We can see he had newspaper cutouts on his desk which he used for the note. Also, one of the letters is in his handwriting and has been left in the police mailbox without address or anything which means it was placed by hand. Also, in his diary the amount he believes he needs to get to and succeed in America is 13.2 pounds which is exactly the same as the ransom note.\" is incorrect.\n\nRating: 0 stars\n\nEpilogue:\n- The enigmatic disappearance of young John Toillard managed to elude us at every turn. \n- The woods of New Forest held tight to their secrets, leaving us with only questions and fleeting hopes.\n- The ransom money lay forgotten and untouched, a haunting echo of the unresolved mystery.\n- Romsey remained shrouded in disquiet, the absence of John casting a lingering shadow over the community."
    }
    ]}
    $$
);
