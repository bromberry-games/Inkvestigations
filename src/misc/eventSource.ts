import { SSE } from 'sse.js';

export class EventSource {
	private eventSource?: SSE;
	private handleAnswer?: (event: MessageEvent<any>) => void;
	private handleError?: (event: MessageEvent<any>) => void;
	private handleAbort?: (event: MessageEvent<any>) => void;
	private handleEnd?: (event: MessageEvent<any>) => void;
	private handleRating?: (event: MessageEvent<any>) => void;

	start(
		payload: any,
		handleAnswer: (event: MessageEvent<any>) => void,
		handleError: (event: MessageEvent<any>) => void,
		handleAbort: (event: MessageEvent<any>) => void,
		handleEnd: (event: MessageEvent<any>) => void,
		handleRating: (event: MessageEvent<any>) => void
	) {
		this.eventSource = new SSE('/api/ask', {
			headers: {
				'Content-Type': 'application/json'
			},
			payload: JSON.stringify(payload)
		});
		this.handleAnswer = handleAnswer;
		this.handleError = handleError;
		this.handleAbort = handleAbort;
		this.handleEnd = handleEnd;
		this.handleRating = handleRating;

		if (this.handleAnswer) {
			this.eventSource.addEventListener('data', this.handleAnswer);
		}
		if (this.handleError) {
			this.eventSource.addEventListener('error', this.handleError);
		}
		if (this.handleAbort) {
			this.eventSource.addEventListener('abort', this.handleAbort);
		}
		if (this.handleEnd) {
			this.eventSource.addEventListener('end', this.handleEnd);
		}
		if (this.handleRating) {
			this.eventSource.addEventListener('rating', this.handleRating);
		}

		this.eventSource.stream();
	}

	stop() {
		this.eventSource?.close();
		this.reset();
	}

	reset() {
		if (this.handleAnswer) {
			this.eventSource?.removeEventListener('message', this.handleAnswer);
		}
		if (this.handleError) {
			this.eventSource?.removeEventListener('error', this.handleError);
		}
		if (this.handleAbort) {
			this.eventSource?.removeEventListener('abort', this.handleAbort);
		}

		this.eventSource?.close();

		this.eventSource = undefined;
	}
}
