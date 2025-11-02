// mastra/a2a-wrapper.ts
import { uptimeAgent } from "./agents/uptime-agent";

/**
 * A2A Protocol Wrapper for Telex.im Integration
 * Converts Mastra agent responses to A2A-compliant format
 */
export async function handleA2ARequest(request: any) {
  try {
    const body = typeof request.body === 'string' 
      ? JSON.parse(request.body) 
      : request.body;

    // Extract message from A2A request
    const userMessage = body.params?.messages?.[0]?.content || "";
    
    if (!userMessage) {
      return {
        jsonrpc: "2.0",
        id: body.id || "error",
        error: {
          code: -32602,
          message: "Invalid params: message content required"
        }
      };
    }

    // Call the agent
    const result = await uptimeAgent.generate(userMessage);
    
    // Extract response text
    const responseText = result.text || "No response generated";

    // Return A2A-compliant response
    return {
      jsonrpc: "2.0",
      id: body.id,
      result: {
        artifacts: [
          {
            type: "text",
            text: responseText,
            title: "Uptime Status"
          }
        ],
        history: {
          messages: [
            {
              role: "user",
              content: userMessage
            },
            {
              role: "assistant",
              content: responseText
            }
          ]
        }
      }
    };
  } catch (error: any) {
    return {
      jsonrpc: "2.0",
      id: "error",
      error: {
        code: -32000,
        message: error.message || "Internal server error"
      }
    };
  }
}
