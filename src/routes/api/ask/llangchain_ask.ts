import { ChatOpenAI } from 'langchain/chat_models/openai';
import { LLMChain } from 'langchain/chains';
import { CallbackManager } from 'langchain/callbacks';
import { ChatPromptTemplate, HumanMessagePromptTemplate } from 'langchain/prompts';
import { BaseMessage, ChatMessage, HumanMessage } from 'langchain/schema';
import { OPEN_AI_KEY } from '$env/static/private';

const prompt = ChatPromptTemplate.fromMessages([HumanMessagePromptTemplate.fromTemplate('{input}')]);

async function llangRequest(req): Promise<Response> {
	try {
		const { input } = await req.json();
		// Check if the request is for a streaming response.
		const streaming = req.headers.get('accept') === 'text/event-stream';

		if (streaming) {
			// For a streaming response we need to use a TransformStream to
			// convert the LLM's callback-based API into a stream-based API.
			const encoder = new TextEncoder();
			const stream = new TransformStream();
			const writer = stream.writable.getWriter();

			const llm = new ChatOpenAI({
				streaming,
				callbackManager: CallbackManager.fromHandlers({
					handleLLMNewToken: async (token) => {
						await writer.ready;
						await writer.write(encoder.encode(`data: ${token}\n\n`));
					},
					handleLLMEnd: async () => {
						await writer.ready;
						await writer.close();
					},
					handleLLMError: async (e) => {
						await writer.ready;
						await writer.abort(e);
					}
				})
			});
			const chain = new LLMChain({ prompt, llm });
			// We don't need to await the result of the chain.run() call because
			// the LLM will invoke the callbackManager's handleLLMEnd() method
			chain.call({ input }).catch((e) => console.error(e));

			return new Response(stream.readable, {
				headers: { 'Content-Type': 'text/event-stream' }
			});
		} else {
			// For a non-streaming response we can just await the result of the
			// chain.run() call and return it.
			const llm = new ChatOpenAI();
			const chain = new LLMChain({ prompt, llm });
			const response = await chain.call({ input });

			return new Response(JSON.stringify(response), {
				headers: { 'Content-Type': 'application/json' }
			});
		}
	} catch (e) {
		return new Response(JSON.stringify({ error: e.message }), {
			status: 500,
			headers: { 'Content-Type': 'application/json' }
		});
	}
}

export async function nonStreamRequest(messages: BaseMessage[]) {
	console.log(messages);
	const llm = new ChatOpenAI({
		temperature: 0.9,
		openAIApiKey: OPEN_AI_KEY,
		modelName: 'gpt-4'
	});
	return await llm.predictMessages(messages);
}
