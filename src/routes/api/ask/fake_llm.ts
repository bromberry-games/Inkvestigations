import type { CallbackManager } from 'langchain/callbacks';
import { FakeListLLM } from 'langchain/llms/fake';

export function createFakeLLM(callbackManager?: CallbackManager): FakeListLLM {
	if (callbackManager) {
		return new FakeListLLM({
			responses: ['Fake 1.', 'Fake 2.', 'Fake 3.', 'Fake 4.', 'Fake 5.'],
			callbackManager
		});
	}
	return new FakeListLLM({
		responses: ['Fake 1.', 'Fake 2.', 'Fake 3.', 'Fake 4.', 'Fake 5.']
	});
}
