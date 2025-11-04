// // src/mastra/routes/a2a.ts
// import { Agent } from "@mastra/core/agent";

// export function createA2AHandler(agent: Agent) {
//   return async (req: any) => {
//     try {
//       let body;
//       if (req.json && typeof req.json === 'function') {
//         body = await req.json();
//       } else if (req.body) {
//         body = req.body;
//       } else {
//         body = req;
//       }
      
//       console.log('📨 Request ID:', body.id);
      
//       // Extract message from different A2A formats
//       let userMessage = "";
      
//       if (body.params?.messages && Array.isArray(body.params.messages)) {
//         userMessage = body.params.messages[0]?.content || "";
//       } else if (body.params?.message?.parts && Array.isArray(body.params.message.parts)) {
//         const firstTextPart = body.params.message.parts.find((part: any) => part.kind === "text");
//         if (firstTextPart && firstTextPart.text) {
//           userMessage = firstTextPart.text.trim();
//         }
//       } else if (body.message) {
//         userMessage = body.message;
//       }
      
//       if (!userMessage) {
//         console.error('❌ No message found');
//         return new Response(JSON.stringify({
//           jsonrpc: "2.0",
//           id: body.id || "error",
//           error: {
//             code: -32602,
//             message: "No message content found"
//           }
//         }), {
//           status: 400,
//           headers: { 'Content-Type': 'application/json' }
//         });
//       }

//       console.log('🤖 Processing:', userMessage);
      
//       const result = await agent.generate(userMessage);

//       console.log('✅ Generated:', result.text);

//       // Build response in Telex-compatible format
//       const response = {
//         jsonrpc: "2.0",
//         id: body.id,
//         result: {
//           // THIS IS THE KEY PART - Telex needs this to display in UI
//           message: {
//             kind: "message",
//             role: "assistant",
//             parts: [
//               {
//                 kind: "text",
//                 text: result.text
//               }
//             ],
//             messageId: `response-${body.id}`,
//           },
//           // Also include artifacts for compatibility
//           artifacts: [
//             {
//               type: "text",
//               text: result.text,
//               title: "Uptime Status",
//             },
//           ],
//           // History for context
//           history: {
//             messages: [
//               {
//                 role: "user",
//                 content: userMessage,
//               },
//               {
//                 role: "assistant",
//                 content: result.text,
//               },
//             ],
//           },
//         },
//       };

//       console.log('📤 Sending response with message field');

//       return new Response(JSON.stringify(response), {
//         status: 200,
//         headers: { 'Content-Type': 'application/json' }
//       });
      
//     } catch (error: any) {
//       console.error('❌ Error:', error.message);
//       return new Response(JSON.stringify({
//         jsonrpc: "2.0",
//         id: "error",
//         error: {
//           code: -32000,
//           message: error.message
//         }
//       }), {
//         status: 500,
//         headers: { 'Content-Type': 'application/json' }
//       });
//     }
//   };
// }


// src/mastra/routes/a2a.ts
import { Agent } from "@mastra/core/agent";

export function createA2AHandler(agent: Agent) {
  return async (req: any) => {
    try {
      // Parse request body
      let body;
      if (req.json && typeof req.json === 'function') {
        body = await req.json();
      } else if (req.body) {
        body = req.body;
      } else {
        body = req;
      }
      
      console.log('📨 Received A2A request:', JSON.stringify(body, null, 2));
      
      // Validate JSON-RPC 2.0 format
      if (!body.jsonrpc || body.jsonrpc !== "2.0") {
        return new Response(JSON.stringify({
          jsonrpc: "2.0",
          id: body.id || null,
          error: {
            code: -32600,
            message: "Invalid Request: jsonrpc version must be 2.0"
          }
        }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        });
      }

      if (!body.id) {
        return new Response(JSON.stringify({
          jsonrpc: "2.0",
          id: null,
          error: {
            code: -32600,
            message: "Invalid Request: id is required"
          }
        }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        });
      }

      // Extract message content
      let userMessage = "";
      
      // Try different message formats
      if (body.params?.messages && Array.isArray(body.params.messages)) {
        const lastMessage = body.params.messages[body.params.messages.length - 1];
        userMessage = lastMessage?.content || "";
      } else if (body.params?.message?.parts && Array.isArray(body.params.message.parts)) {
        const textParts = body.params.message.parts
          .filter((part: any) => part.kind === "text")
          .map((part: any) => part.text)
          .join("\n");
        userMessage = textParts.trim();
      } else if (body.params?.prompt) {
        userMessage = body.params.prompt;
      } else if (body.params?.text) {
        userMessage = body.params.text;
      }
      
      if (!userMessage) {
        return new Response(JSON.stringify({
          jsonrpc: "2.0",
          id: body.id,
          error: {
            code: -32602,
            message: "Invalid params: No message content found"
          }
        }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        });
      }

      console.log('💬 User message:', userMessage);
      
      // Generate response using Mastra agent
      const result = await agent.generate(userMessage);

      console.log('✅ Agent response:', result.text);

      // Build Telex-compatible A2A response
      const response = {
        jsonrpc: "2.0",
        id: body.id,
        result: {
          message: {
            role: "assistant",
            parts: [
              {
                kind: "text",
                text: result.text
              }
            ]
          }
        }
      };

      console.log('📤 Sending response:', JSON.stringify(response, null, 2));

      return new Response(JSON.stringify(response), {
        status: 200,
        headers: { 
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      });
      
    } catch (error: any) {
      console.error('❌ A2A Handler Error:', error);
      
      const errorResponse = {
        jsonrpc: "2.0",
        id: (typeof req === 'object' && req.body?.id) || "error",
        error: {
          code: -32000,
          message: error.message || "Internal server error",
          data: process.env.NODE_ENV === 'development' ? {
            stack: error.stack,
            details: error.toString()
          } : undefined
        }
      };

      return new Response(JSON.stringify(errorResponse), {
        status: 500,
        headers: { 
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      });
    }
  };
}