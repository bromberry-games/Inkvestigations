import express from 'express';

export const createServer = () => {
  const app = express();
  const PORT = 3000;

    // Sample data
    const chatItems = [
        {"id":"chatcmpl-8AyPbx8YO5bWIMAyRQAV1LIPaf5Py","object":"chat.completion.chunk","created":1697626195,"model":"gpt-4-0613","choices":[{"index":0,"delta":{"role":"assistant","content":""},"finish_reason":null}]},
        {"id":"chatcmpl-8AyPbx8YO5bWIMAyRQAV1LIPaf5Py","object":"chat.completion.chunk","created":1697626195,"model":"gpt-4-0613","choices":[{"index":0,"delta":{"content":"Hell yeah!"},"finish_reason":null}]},
        {"id":"chatcmpl-8AyPbx8YO5bWIMAyRQAV1LIPaf5Py","object":"chat.completion.chunk","created":1697626195,"model":"gpt-4-0613","choices":[{"index":0,"delta":{"content":".\n"},"finish_reason":null}]},
        {"id":"chatcmpl-8AyPbx8YO5bWIMAyRQAV1LIPaf5Py","object":"chat.completion.chunk","created":1697626195,"model":"gpt-4-0613","choices":[{"index":0,"delta":{},"finish_reason":"stop"}]},
    ];

    app.post('/ask', (req, res) => {
        res.setHeader('Content-Type', 'text/event-stream');
        res.setHeader('Cache-Control', 'no-cache');
        res.setHeader('Connection', 'keep-alive');
        res.flushHeaders();
        console.log("ASK::: this got posted");
        chatItems.forEach((item, index) => {
            setTimeout(() => {
                res.write(`data: ${JSON.stringify(item)}\n\n`);
            }, index * 100); 
        });

        setTimeout(() => {
            console.log("ended stream")
            res.end("data: [DONE]");
        }, chatItems.length * 100);
    });


  let serverInstance;
  return {
    start: (port = 3000) => {
        console.log("server starting");
        serverInstance = app.listen(port);
    },
    stop: () => {
        console.log("server stopping");
        serverInstance.close();
    },
  };
};
