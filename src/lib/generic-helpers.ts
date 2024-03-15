import { PUBLIC_SUPABASE_URL } from '$env/static/public';

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

const bucketPath = PUBLIC_SUPABASE_URL + '/storage/v1/object/public/user_mysteries/';
export function getMysteryImagePath(mystery: { access_code: string; slug: string; name: string }) {
	if (mystery.access_code != 'user') {
		return '/images/mysteries/' + mystery.name.replace(/ /g, '_').toLowerCase() + '.webp';
	}
	const path = bucketPath + mystery.slug + '/published/' + convertToSnakeCaseEnhanced(mystery.name);
	return path;
}
