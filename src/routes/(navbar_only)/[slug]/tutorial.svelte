<script lang="ts">
	import { messageAmountStore } from '$misc/stores';
	import { driver } from 'driver.js';
	import 'driver.js/dist/driver.css';
	import type { Button } from 'flowbite-svelte';

	export let messages: any[];

	//Hacky, but needed since the chat input only renders only when the messageAmountStore is greater than 0
	$: if ($messageAmountStore > 0) {
		const notesButton = document.querySelector('#notes-button');
		const solveButton = document.querySelector('#solve-button');
		if (!notesButton) throw new Error('Notes button not found');
		notesButton.disabled = true;
		if (!solveButton) throw new Error('Solve button not found');
		solveButton.disabled = true;

		if (messages.length == 1) {
			const driverObj = driver({
				showProgress: true,
				steps: [
					{
						element: '#chat-input',
						popover: {
							title: 'Title',
							description: `Chat with the police chief here. You can ask him anything you want.
                    <br>For example: Hello Chief, please interrogate the father of the victim.
                    <br>Press enter to send the message.
                    <br>Press shift + enter to create a new line
                    `
						}
					}
				]
			});

			const textarea = document.querySelector('#chat-input');
			if (!textarea) {
				return;
			}

			const drive = () => {
				driverObj.drive();
				const textarea = document.querySelector('#chat-input');
				textarea?.removeEventListener('click', drive);
			};

			textarea.addEventListener('click', drive);
		}
		if (messages.length == 3) {
			notesButton.disabled = false;

			const driverObj = driver({
				showProgress: true,
				steps: [
					{
						element: '#message-2-content',
						popover: {
							title: 'Notes',
							description: `You got new information. To track it, you can add it to your notes.
                    `
						}
					},
					{
						element: '#notes-button',
						popover: {
							title: 'Notes',
							description: `You got new information. To track it, you can add it to your notes.
                    `
						}
					}
				]
			});
			driverObj.drive();
			notesButton.addEventListener('click', () => {
				driverObj.destroy();
			});
		} else if (messages.length == 5) {
			solveButton.disabled = false;
			const driverObj = driver({
				showProgress: true,
				steps: [
					{
						element: '#solve-button',
						popover: {
							title: 'Solve',
							description: `Once you have enough information you can click here to solve the mystery. Be careful since you can only solve once.
                    `
						}
					}
				]
			});
			driverObj.drive();
			solveButton.addEventListener('click', () => {
				driverObj.destroy();
			});
		}
	}
</script>
