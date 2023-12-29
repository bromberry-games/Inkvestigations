export function convertIsoStringToIcon(currency: string) {
	switch (currency) {
		case 'usd':
			return '$';
		case 'eur':
			return '€';
		default:
			throw new Error(`Unsupported currency: ${currency}`);
	}
}
