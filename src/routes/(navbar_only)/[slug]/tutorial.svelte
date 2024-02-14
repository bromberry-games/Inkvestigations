<script lang="ts">
	import { messageAmountStore } from '$misc/stores';
	import { driver, type Driver, type DriveStep } from 'driver.js';
	import 'driver.js/dist/driver.css';

	export let messages: any[];

	function setupDriveOnTextArea(driverSteps: DriveStep[]) {
		const textarea = document.querySelector('#chat-input');
		if (textarea) {
			const startDrive = () => {
				const driverObj = driver({
					steps: driverSteps
				});
				driverObj.drive();
				const textarea = document.querySelector('#chat-input');
				textarea?.removeEventListener('click', startDrive);
			};

			textarea.addEventListener('click', startDrive);
		}
	}

	//Hacky, but needed since the chat input only renders only when the messageAmountStore is greater than 0
	$: if ($messageAmountStore > 0) {
		const notesButton: HTMLButtonElement | null = document.querySelector('#notes-button');
		const solveButton: HTMLButtonElement | null = document.querySelector('#solve-button');
		if (notesButton && solveButton) {
			notesButton.disabled = true;
			solveButton.disabled = true;

			if (messages.length == 1) {
				const driverSteps = [
					{
						element: '#chat-input',
						popover: {
							description: `<p><strong>Talk to the Police Chief:</strong> Ask anything to uncover clues.</p>
  <ul>
    <li><strong>Example:</strong> "Hello Chief, Please interrogate the victims father."</li>
    <li><strong>Send Message:</strong> Press <strong>Enter</strong> to send.</li>
    <li><strong>New Line:</strong> Use <strong>Shift + Enter</strong> for line breaks.</li>
  </ul>
                    `
						}
					}
				];

				setupDriveOnTextArea(driverSteps);
			}
			if (messages.length == 3) {
				notesButton.disabled = false;
				const messageDriverSteps = [
					{
						element: '#chat-input',
						popover: {
							description: `<p><strong>Talk to the Police Chief:</strong> You can also ask him do to actions in the world</p>
  <ul>
    <li><strong>Example:</strong> "Hello Chief, Please search the victims room."</li>
    <li><strong>Or:</strong> "Hello Chief, conduct a search of the toilards estate."
    <li><strong>Or:</strong> "Analyse the ransom note".</li>
  </ul>
                    `
						}
					}
				];
				setupDriveOnTextArea(messageDriverSteps);

				const notesDriver = driver({
					showProgress: true,
					steps: [
						{
							element: '#message-counter',
							popover: {
								title: 'Message counter',
								description: `Every message you send decreases your message counter. Once it is at 0 you can no longer send messages and will have to wait until the next day or buy more messages.`
							}
						},

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
				notesDriver.drive();
				notesButton.addEventListener('click', () => {
					notesDriver.destroy();
				});
			} else if (messages.length == 5) {
				solveButton.disabled = false;
				notesButton.disabled = false;
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
			} else if (messages.length > 5) {
				solveButton.disabled = false;
				notesButton.disabled = false;
			}
		}
	}
</script>
