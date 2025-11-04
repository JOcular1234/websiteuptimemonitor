// import { mastra } from '../../../index';

// interface A2APart {
//   kind: string;
//   text?: string;
//   data?: any[];
// }

// interface A2AMessage {
//   kind?: string;
//   role: string;
//   parts: A2APart[];
//   messageId?: string;
//   metadata?: Record<string, any>;
// }

// interface A2ARequestBody {
//   jsonrpc: string;
//   id: string;
//   method?: string;
//   params?: {
//     message?: A2AMessage;
//     configuration?: any;
//   };
// }

// export async function POST(request: Request) {
//   try {
//     const body = await request.json() as A2ARequestBody;
    
//     // Extract agent ID from URL path
//     const url = new URL(request.url);
//     const pathParts = url.pathname.split('/');
//     const agentId = pathParts[pathParts.length - 1] || 'uptimeAgent';
    
//     // Get the agent
//     const agent = mastra.getAgent(agentId as any);
//     if (!agent) {
//       return new Response(
//         JSON.stringify({
//           jsonrpc: "2.0",
//           id: body.id || "error",
//           error: {
//             code: -32602,
//             message: `Agent '${agentId}' not found`
//           }
//         }),
//         { 
//           status: 404,
//           headers: { 'Content-Type': 'application/json' }
//         }
//       );
//     }

//     // Extract message from Telex A2A request format
//     let userMessage = "";
    
//     // Telex sends: params.message.parts[] where each part has kind and text
//     if (body.params?.message?.parts && Array.isArray(body.params.message.parts)) {
//       // Find the last plain text message (not HTML wrapped)
//       const parts = body.params.message.parts;
//       for (let i = parts.length - 1; i >= 0; i--) {
//         const part = parts[i];
//         if (part.kind === "text" && part.text && !part.text.includes("<p>") && !part.text.includes("Checking")) {
//           userMessage = part.text;
//           break;
//         }
//       }
//     }
    
//     if (!userMessage) {
//       return new Response(
//         JSON.stringify({
//           jsonrpc: "2.0",
//           id: body.id || "error",
//           error: {
//             code: -32602,
//             message: "Invalid params: message content required"
//           }
//         }),
//         { 
//           status: 400,
//           headers: { 'Content-Type': 'application/json' }
//         }
//       );
//     }

//     console.log(`Processing message: ${userMessage}`);

//     // Call the agent
//     const result = await agent.generate(userMessage);
    
//     // Extract response text
//     const responseText = result.text || "No response generated";

//     console.log(`Agent response: ${responseText}`);

//     // Return A2A-compliant response
//     return new Response(
//       JSON.stringify({
//         jsonrpc: "2.0",
//         id: body.id,
//         result: {
//           artifacts: [
//             {
//               type: "text",
//               text: responseText,
//               title: "Uptime Monitor"
//             }
//           ]
//         }
//       }),
//       { 
//         status: 200,
//         headers: { 'Content-Type': 'application/json' }
//       }
//     );
//   } catch (error: any) {
//     console.error('A2A Error:', error);
//     return new Response(
//       JSON.stringify({
//         jsonrpc: "2.0",
//         id: "error",
//         error: {
//           code: -32000,
//           message: error.message || "Internal server error",
//           data: error.stack
//         }
//       }),
//       { 
//         status: 500,
//         headers: { 'Content-Type': 'application/json' }
//       }
//     );
//   }
// }

import { mastra } from '../../../index';

// Define types for A2A protocol
interface A2AMessagePart {
  kind: string;
  text?: string;
  data?: any;
}

interface A2AMessage {
  kind?: string;
  role?: string;
  parts?: A2AMessagePart[];
}

interface A2AParams {
  message?: A2AMessage;
  messages?: Array<{ content: string }>;
}

interface A2ARequest {
  jsonrpc: string;
  id: string;
  method?: string;
  params?: A2AParams;
}

export async function POST(request: Request) {
  try {
    const body = await request.json() as A2ARequest;
    
    // Extract agent ID from URL path
    const url = new URL(request.url);
    const pathParts = url.pathname.split('/');
    const agentId = pathParts[pathParts.length - 1] || 'uptimeAgent';
    
    // Get the agent - use type assertion since we know the agent exists
    const agent = mastra.getAgent(agentId as any);
    if (!agent) {
      return new Response(
        JSON.stringify({
          jsonrpc: "2.0",
          id: body.id || "error",
          error: {
            code: -32602,
            message: `Agent '${agentId}' not found`
          }
        }),
        { 
          status: 404,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    // Extract message from Telex A2A request format
    let userMessage = "";
    
    // Telex sends: params.message.parts[] where each part has kind and text
    if (body.params?.message?.parts && Array.isArray(body.params.message.parts)) {
      // Find the last plain text message (not HTML wrapped)
      const parts = body.params.message.parts;
      for (let i = parts.length - 1; i >= 0; i--) {
        const part = parts[i];
        if (part.kind === "text" && part.text && !part.text.includes("<p>") && !part.text.includes("Checking")) {
          userMessage = part.text;
          break;
        }
      }
    }
    
    if (!userMessage) {
      return new Response(
        JSON.stringify({
          jsonrpc: "2.0",
          id: body.id || "error",
          error: {
            code: -32602,
            message: "Invalid params: message content required"
          }
        }),
        { 
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    console.log(`Processing message: ${userMessage}`);

    // Call the agent
    const result = await agent.generate(userMessage);
    
    // Extract response text
    const responseText = result.text || "No response generated";

    console.log(`Agent response: ${responseText}`);

    // Return A2A-compliant response
    return new Response(
      JSON.stringify({
        jsonrpc: "2.0",
        id: body.id,
        result: {
          artifacts: [
            {
              type: "text",
              text: responseText,
              title: "Uptime Monitor"
            }
          ]
        }
      }),
      { 
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  } catch (error: any) {
    console.error('A2A Error:', error);
    return new Response(
      JSON.stringify({
        jsonrpc: "2.0",
        id: "error",
        error: {
          code: -32000,
          message: error.message || "Internal server error",
          data: error.stack
        }
      }),
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}