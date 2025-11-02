import { Agent } from "@mastra/core/agent";

export function createA2AHandler(agent: Agent) {
  return async (req: any) => {
    try {
      // Handle both Request object and plain object
      let body;
      if (req.json && typeof req.json === 'function') {
        body = await req.json();
      } else if (req.body) {
        body = req.body;
      } else {
        body = req;
      }
      
      // Extract the user's message from A2A request
      const userMessage = body.params?.messages?.[0]?.content || "";
      
      if (!userMessage) {
        return new Response(JSON.stringify({
          jsonrpc: "2.0",
          id: body.id || "error",
          error: {
            code: -32602,
            message: "Invalid params: message content required"
          }
        }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        });
      }

      console.log(`Processing message: "${userMessage}"`);
      
      // Generate response using the agent
      const result = await agent.generate(userMessage);

      console.log(`Agent response: "${result.text}"`);

      // Return A2A-compliant response
      return new Response(JSON.stringify({
        jsonrpc: "2.0",
        id: body.id,
        result: {
          artifacts: [
            {
              type: "text",
              text: result.text,
              title: "Uptime Status",
            },
          ],
          history: {
            messages: [
              {
                role: "user",
                content: userMessage,
              },
              {
                role: "assistant",
                content: result.text,
              },
            ],
          },
        },
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    } catch (error: any) {
      console.error('A2A handler error:', error);
      return new Response(JSON.stringify({
        jsonrpc: "2.0",
        id: "error",
        error: {
          code: -32000,
          message: error.message || "Internal server error"
        }
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  };
}