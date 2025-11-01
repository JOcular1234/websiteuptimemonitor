import { Agent } from "@mastra/core/agent";

export function createA2AHandler(agent: Agent) {
  return async (req: any) => {
    const body = await req.json();
    
    // Extract the user's message from A2A request
    const userMessage = body.params?.messages?.[0]?.content || "";
    
    try {
      // Generate response using the agent
      const result = await agent.generate(userMessage);

      // Return A2A-compliant response
      return Response.json({
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
      });
    } catch (error: any) {
      return Response.json({
        jsonrpc: "2.0",
        id: body.id,
        error: {
          code: -32000,
          message: error.message,
        },
      });
    }
  };
}