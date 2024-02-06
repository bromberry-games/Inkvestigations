export function shuffleArray<T>(array: T[]) {
	for (let i = array.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[array[i], array[j]] = [array[j], array[i]];
	}
	return array;
}

export function convertToSnakeCaseEnhanced(str: string): string {
	return str
		.replace(/'|"/g, '')
		.split(/(?=[A-Z])|\s+/)
		.join('_')
		.toLowerCase();
}

// This might be a problem with touch laptops? But for now I don't care
export function isMobile(navigator: Navigator) {
	return navigator.maxTouchPoints > 0;
}
