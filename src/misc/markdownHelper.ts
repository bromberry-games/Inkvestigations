export function closeOpenedCodeTicks(input: string) {
	const oneTickMatches = input.match(/(?<!`)`(?!`)/g) || [];
	const threeTickMatches = input.match(/(?<!``)```(?!``)/g) || [];

	if (oneTickMatches.length % 2 !== 0) {
		input += '`';
	}

	if (threeTickMatches.length % 2 !== 0) {
		input += '\n```';
	}

	return input;
}
