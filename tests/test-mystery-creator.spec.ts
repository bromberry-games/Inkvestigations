import path from 'path';
import { test, expect, type Page } from '../playwright/fixtures';
import { letter } from './data/death_on_the_dancefloor';

test('test create new mystery and save it', async ({ page }) => {
	await page.goto('/user/mysteries');
	await page.getByRole('button', { name: 'New' }).click();
	await page.waitForTimeout(500);
	await page.locator('input[name="mystery.name"]').fill('Test mystery');
	await page.getByRole('button', { name: 'save' }).click();
	await page.waitForLoadState('networkidle');

	await expect(page.locator('input[name="mystery.name"]')).toHaveValue('Test mystery');
	await page.goto('/user/mysteries');
	// await page.getByRole('button', { name: 'Delete' }).click();
});

test('test create new mystery and save it then change name', async ({ page }) => {
	await page.goto('/user/mysteries');
	await page.getByRole('button', { name: 'New' }).click();
	await page.getByPlaceholder('Mirror Mirror').click();
	await page.getByPlaceholder('Mirror Mirror').fill('new mystery');
	await page.getByRole('button', { name: 'save' }).click();
	await page.waitForLoadState('networkidle');
	await page.getByPlaceholder('Mirror Mirror').fill('even newer mystery');
	await page.getByRole('button', { name: 'save' }).click();

	await page.waitForURL('**/user/mysteries/even_newer_mystery');

	await expect(page.getByPlaceholder('Mirror Mirror')).toHaveValue('even newer mystery');
	await expect(page.url()).toContain('/user/mysteries/even_newer_mystery');

	await page.goto('/user/mysteries');
	await expect((await page.getByLabel('mystery').nth(0).allInnerTexts())[0]).toContain('even newer mystery');
});

test('save and load image', async ({ page }) => {
	await page.goto('/user/mysteries');
	await page.getByRole('button', { name: 'New' }).click();
	await page.waitForTimeout(400);
	await page.locator('input[name="mystery.name"]').fill('Test Images');
	const fileInput = await page.locator('input[name="mystery.image"]');
	await fileInput.setInputFiles(path.join(process.cwd(), '/static/images/mysteries/mirror_mirror.webp'));

	await page.getByRole('button', { name: 'save' }).click();
	await page.waitForTimeout(300);
	await page.reload({ waitUntil: 'networkidle' });
	const fileInput2 = await page.locator('input[name="mystery.image"]');
	await fileInput2.setInputFiles(path.join(process.cwd(), '/static/images/mysteries/prison.webp'));
	await page.getByRole('button', { name: 'save' }).click();
	// await page.waitForTimeout(300);
	// await page.reload({ waitUntil: 'networkidle' });
});

test('test create new mystery and publish it', async ({ page }) => {
	await page.goto('/user/mysteries');
	await page.getByRole('button', { name: 'New' }).click();
	await page.waitForTimeout(300);
	await page.locator('input[name="mystery.name"]').fill('Test mystery');
	await page.locator('input[name="mystery.setting"]').fill('England in the 1890s, a small town called Romey');
	await page.locator('input[name="mystery.description"]').fill('test description');
	await page.locator('input[name="mystery.theme"]').fill('Mystery Theme');
	await page.locator('input[name="mystery.victim_name"]').fill('John Toilard');

	const fileInput = await page.locator('input[name="image"]');
	await fileInput.setInputFiles(path.join(process.cwd(), '/static/images/mysteries/mirror_mirror.webp'));

	await page
		.locator('input[name="mystery.letter_info"]')
		.fill('Hello Sherlock. I made this mystery myself! It is what I believe they call a custom user created one!');
	await page
		.locator('input[name="mystery.victim_description"]')
		.fill('kidnapped. A 13 year old boy with his head in the clouds, often fantasizing about different lives.');
	await page.locator('input[name="mystery.solution"]').fill('Solve the mystery');

	await page.locator('input[name="suspects[0].name"]').fill('Butler Jesob');
	await page.locator('input[name="suspects[0].description"]').fill('A long-time butler and good friend of the family, loves the children.');

	await page.locator('input[name="timeframes[0].timeframe"]').fill('The time frame');
	await page.locator('input[name="timeframes[0].event_happened"]').fill('What happened');

	await page.locator('input[name="action_clues[0].action"]').fill('Inspect the garden');
	await page.locator('input[name="action_clues[0].clue"]').fill('Found a hidden key');

	await page.getByRole('button', { name: 'Submit' }).click();
});

async function setSuspect(page: Page, index: number, name: string, description: string) {
	await page.locator(`input[name="suspects[${index}].name"]`).fill(name);
	await page.locator(`input[name="suspects[${index}].description"]`).fill(description);
	const susp1 = await page.locator(`input[name="suspects[${index}].image"]`);
	await susp1.setInputFiles(
		path.join(
			process.cwd(),
			'/static/images/mysteries/prison/suspects/' +
				name
					.replace(/'|"/g, '')
					.split(/(?=[A-Z])|\s+/)
					.join('_')
					.toLowerCase() +
				'.webp'
		)
	);
}

test('Create prison and publish it', async ({ page }) => {
	await page.goto('/user/mysteries');
	await page.getByRole('button', { name: 'New' }).click();
	await page.waitForTimeout(400);

	// Filling out the main mystery details
	await page.locator('input[name="mystery.name"]').fill('Prison');
	const fileInput2 = await page.locator('input[name="mystery.image"]');
	await fileInput2.setInputFiles(path.join(process.cwd(), '/static/images/mysteries/prison.webp'));
	await page.locator('input[name="mystery.description"]').fill('A prison guard meets his end halfway between freedom and chains.');
	await page.locator('input[name="mystery.theme"]').fill('Corruption and integrity');
	await page
		.locator('textarea[name="mystery.setting"]')
		.fill(
			'This story is set in 1889 in England. Ernest Orion is a good friend of Wellington, and thus Wellington is hesitant to suspect him.'
		);
	await page.locator('textarea[name="mystery.letter_info"]').fill(letter);
	const fileInput3 = await page.locator('input[name="mystery.victim_image"]');
	await fileInput3.setInputFiles(path.join(process.cwd(), '/static/images/mysteries/prison/suspects/leonard_corcoran.webp'));
	await page.locator('input[name="mystery.victim_name"]').fill('Leonard Corcoran');
	await page
		.locator('input[name="mystery.victim_description"]')
		.fill('A 40 year old prison warden. Wants to be at the top at any cost. Machiavellian personality.');
	await page
		.locator('textarea[name="mystery.solution"]')
		.fill(
			`It was Heinrich Mann because Leonard, who was stringing Mann along with promises that he would be freed if he helped Leonard, but Leonard never delivered on his promises. [...]`
		);

	await setSuspect(
		page,
		0,
		'Ernest "The Hunter" Orion',
		'A 65 year old prison governor. Used to be the best detective for Scotland Yard and got the nickname "The Hunter". Close to retirement. Sticks up for his own.'
	);
	await page.getByTestId('add-suspect').click();

	await setSuspect(page, 1, 'Heinrich Mann', 'A 28 year old prisoner forger. Is obsessed with his wife. A weasel who does what it takes.');
	await page.getByTestId('add-suspect').click();

	await setSuspect(
		page,
		2,
		'Joe Tovy',
		'A 30 year old doctor in Pentonville. A bit of a quack always experimenting with "cutting edge" medicine. Doesn\'t take anything too seriously.'
	);
	await page.getByTestId('add-suspect').click();
	await setSuspect(page, 3, 'Millicent Hagan', 'A 35 year old secretary of Ernie Orion in Pentonville. Pedantic and porous personality.');

	await page.locator('input[name="action_clues[0].action"]').fill('question Heinrich Mann');
	await page
		.locator('input[name="action_clues[0].clue"]')
		.fill(
			`Mann swears he didn't do it, he's already done most of his sentence. It would make no sense. He just wants to see his wife. [...]`
		);
	await page.getByTestId('add-action').click();
	await page.locator('input[name="action_clues[1].action"]').fill('question Orion');
	await page
		.locator('input[name="action_clues[1].clue"]')
		.fill(
			"Orion says he obviously didn't do it, but he doesn't need to waste breath on it. He smiled a devilish grin, making me uncomfortable."
		);
	await page.getByTestId('add-action').click();

	await page.locator('input[name="action_clues[2].action"]').fill('question Millicent Hagan');
	await page
		.locator('input[name="action_clues[2].clue"]')
		.fill(
			"Governor Orion often goes to the toilet because--she stopped. He simply does. I stopped paying attention to his comings and goings, he is gone for about 10 minutes usually. The governor and Mr. Corcoran often quarreled, but it never seemed to be Mr. Orion's initiative, Leonard was always complaining."
		);
	await page.getByTestId('add-action').click();

	await page.locator('input[name="action_clues[3].action"]').fill('question Joe Tovy');
	await page
		.locator('input[name="action_clues[3].clue"]')
		.fill(
			"Tovy says he sees Governor Orion pass his door many times a day going to the bathroom since he suffers from diabetes melitus. But Tovy doesn't see the door to the toilet so he doesn't know if that's where he went."
		);
	await page.getByTestId('add-action').click();

	await page.locator('input[name="action_clues[4].action"]').fill('question the other prisoners');
	await page
		.locator('input[name="action_clues[4].clue"]')
		.fill(
			"During their time outside, Mann sometimes stayed in and talked with Corcoran. It wasn't unusual, because Mann wanted to get his wife to visit--yea he was going on about that without end--and Leonard is the supervisor for that. Also everyone apparently knew Corcoran was as corrupt as they come. Prisoners in his favor always moved into better conditions, somehow they always got the approval of the governor."
		);
	await page.getByTestId('add-action').click();
	await page.locator('input[name="action_clues[5].action"]').fill('autopsy of Corcoran');
	await page
		.locator('input[name="action_clues[5].clue"]')
		.fill(
			'At first it looks like he suffocated, but actually he had a broken neck from strangulation with his own manacles. It was over in an instant, not even time to scream. The imprint of the chain is clearly visible. It must have taken great strength.'
		);
	await page.getByTestId('add-action').click();

	await page.locator('input[name="action_clues[6].action"]').fill('manacles');
	await page
		.locator('input[name="action_clues[6].clue"]')
		.fill(
			'Every warden has a pair of manacles, they are put on prisoners who are leaving the prison block. For example for medical issues, official court hearings, visitations, etc.'
		);
	await page.getByTestId('add-action').click();

	await page.locator('input[name="action_clues[7].action"]').fill('What does the prison look like');
	await page
		.locator('input[name="action_clues[7].clue"]')
		.fill(
			"It's a symmetrical building. Two square blocks are connected with a long corridor the middle of which is also the point of entrance. On the left side is the prisoners wing. On the right is the executive wing. The prisoner's wing is separated with two self-locking steel bar gates from the corridor. The visitor's center has two regular doors, one close to the prisoner's wing, the other close to executive wing."
		);
	await page.getByTestId('add-action').click();

	await page.locator('input[name="action_clues[8].action"]').fill('Scene of the murder in the visitors center');
	await page
		.locator('input[name="action_clues[8].clue"]')
		.fill(
			'The body was inside the visitors center which was closer to the prisoners wing. He was close to the open door feet facing toward the open door. The keys were at his feet.'
		);
	await page.getByTestId('add-action').click();

	await page.locator('input[name="action_clues[9].action"]').fill('ask Orion about his name');
	await page
		.locator('input[name="action_clues[9].clue"]')
		.fill(
			'Orion says his father was an Astronomer and had his name legally changed to Orion. Ernest wanted to live up to it. His nickname came about through his skill in hunting down criminals in his golden detective years.'
		);
	await page.getByTestId('add-action').click();

	await page.locator('input[name="action_clues[10].action"]').fill("search Leonard's clothes");
	await page
		.locator('input[name="action_clues[10].clue"]')
		.fill(
			'He has a pocketwatch inscribed with "L.C.", an official pardon for Frederick Upton signed by Ernest Orion, a handkerchief, and some money.'
		);
	await page.getByTestId('add-action').click();

	await page.locator('input[name="action_clues[11].action"]').fill('Frederick Upton');
	await page
		.locator('input[name="action_clues[11].clue"]')
		.fill(
			'Upton is a murderer and rapist known for his barbaric murder scenes, talking to him is impossible as he only rambles like a madman. His execution is in a few weeks. Pardoning him would be a scandal.'
		);
	await page.getByTestId('add-action').click();

	await page.locator('input[name="action_clues[12].action"]').fill('official pardon');
	await page
		.locator('input[name="action_clues[12].clue"]')
		.fill(
			"Orion denies making something like that, it would end his career. Upton doesn't know anything and seems to be out of his mind anyway. Mann says he has never seen that document. Mrs. Hagan says she should have known about such a document."
		);
	await page.getByTestId('add-action').click();

	await page.locator('input[name="action_clues[13].action"]').fill('wife of Mann');
	await page
		.locator('input[name="action_clues[13].clue"]')
		.fill(
			"In his letters he can't wait to show off how his training has developed his body. She hasn't seen Heinrich in a long time because she is always denied visitation. Even though he always says that he's good friends with the warden and that he is helping the warden, so he'll be rewarded with visitation. Her Heinrich would never do such a thing!"
		);
	await page.getByTestId('add-action').click();

	await page.locator('input[name="action_clues[14].action"]').fill("search Mann's cell");
	await page.locator('input[name="action_clues[14].clue"]').fill('writing supplies tucked in mattress');
	await page.getByTestId('add-action').click();

	await page.locator('input[name="action_clues[15].action"]').fill('visitation rights denied');
	await page
		.locator('input[name="action_clues[15].clue"]')
		.fill('Orion has never denied anything to Mrs. Mann. She is free to see him of course. Leonard was in charge of visitation.');
	await page.getByTestId('add-action').click();

	await page.locator('input[name="action_clues[16].action"]').fill('question other guards');
	await page
		.locator('input[name="action_clues[16].clue"]')
		.fill(
			'two were watching the prisoners outside, they found him when they were returning, the others were playing cards in their room. Leonard could usually be gone for few hours when the prisoners were in the yard. Often he arranged for visitations for them then. He is the supervisor for that.'
		);
	await page.getByTestId('add-action').click();

	await page.locator('input[name="action_clues[17].action"]').fill('analyze the official pardon');
	await page
		.locator('input[name="action_clues[17].clue"]')
		.fill(
			'it appears the genuine article under scrutiny at first, but actually the give-away is that Orion uses a different kind of ink. It is a fake!'
		);

	await page.locator('input[name="few_shots_known_answers[0].question"]').fill('Search the crime scene');
	await page
		.locator('input[name="few_shots_known_answers[0].answer"]')
		.fill(
			`The crime scene is in the visitor's center, closer to the prisoners wing. Leonard Corcoran's body was found with his feet facing toward the open door, and the keys were at his feet.`
		);
	await page.locator('input[name="few_shots_known_answers[1].question"]').fill('Interrogate the suspects');
	await page
		.locator('input[name="few_shots_known_answers[1].answer"]')
		.fill(
			`Heinrich Mann denies involvement in the crime and expresses his desire to see his wife. Governor Orion confidently denies any wrongdoing, but his demeanor makes others uncomfortable.`
		);

	await page.locator('input[name="few_shots_unknown_answers[0].question"]').fill(`Search leonard's house`);
	await page
		.locator('input[name="few_shots_unknown_answers[0].answer"]')
		.fill(
			`I searched Leonard's house and found a letter addressed to his sister, a pair of spectacles on his bedside table, and a newspaper from the day before his death.`
		);

	await page.locator('input[name="few_shots_unknown_answers[1].question"]').fill(`search the moon`);
	await page
		.locator('input[name="few_shots_unknown_answers[1].answer"]')
		.fill(`I attempted to search the moon using the prison's telescope, but unfortunately, the moon was not visible at that time of day.`);

	await page.getByRole('button', { name: 'Submit' }).click();
	await page.waitForTimeout(5000);
});
