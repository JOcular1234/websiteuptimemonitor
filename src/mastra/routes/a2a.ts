// import { Agent } from "@mastra/core/agent";

// export function createA2AHandler(agent: Agent) {
//   return async (req: any) => {
//     try {
//       // Handle both Request object and plain object
//       let body;
//       if (req.json && typeof req.json === 'function') {
//         body = await req.json();
//       } else if (req.body) {
//         body = req.body;
//       } else {
//         body = req;
//       }
      
//       console.log('📨 Received A2A request');
//       console.log('Request ID:', body.id);
//       console.log('Method:', body.method);
      
//       // Extract message from different A2A formats
//       let userMessage = "";
      
//       // Format 1: Standard A2A (params.messages)
//       if (body.params?.messages && Array.isArray(body.params.messages)) {
//         userMessage = body.params.messages[0]?.content || "";
//         console.log('📝 Extracted from standard format:', userMessage);
//       }
//       // Format 2: Telex A2A (params.message.parts)
//       else if (body.params?.message?.parts && Array.isArray(body.params.message.parts)) {
//         // Get the FIRST part with kind="text"
//         const firstTextPart = body.params.message.parts.find((part: any) => part.kind === "text");
//         if (firstTextPart && firstTextPart.text) {
//           userMessage = firstTextPart.text.trim();
//           console.log('📝 Extracted from Telex format:', userMessage);
//         }
//       }
//       // Format 3: Direct message (fallback)
//       else if (body.message) {
//         userMessage = body.message;
//         console.log('📝 Extracted from direct message:', userMessage);
//       }
      
//       if (!userMessage) {
//         console.error('❌ No message found');
//         return new Response(JSON.stringify({
//           jsonrpc: "2.0",
//           id: body.id || "error",
//           error: {
//             code: -32602,
//             message: "Invalid params: message content required"
//           }
//         }), {
//           status: 400,
//           headers: { 'Content-Type': 'application/json' }
//         });
//       }

//       console.log('🤖 Calling agent...');
      
//       // Generate response using the agent
//       const result = await agent.generate(userMessage);

//       console.log('✅ Agent responded:', result.text);

//       // Build A2A-compliant response
//       const response = {
//         jsonrpc: "2.0",
//         id: body.id,
//         result: {
//           artifacts: [
//             {
//               type: "text",
//               text: result.text,
//               title: "Uptime Status",
//             },
//           ],
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

//       console.log('📤 Sending response back to Telex');

//       return new Response(JSON.stringify(response), {
//         status: 200,
//         headers: { 'Content-Type': 'application/json' }
//       });
      
//     } catch (error: any) {
//       console.error('❌ A2A handler error:', error);
//       return new Response(JSON.stringify({
//         jsonrpc: "2.0",
//         id: "error",
//         error: {
//           code: -32000,
//           message: error.message || "Internal server error"
//         }
//       }), {
//         status: 500,
//         headers: { 'Content-Type': 'application/json' }
//       });
//     }
//   };
// }

import { Agent } from "@mastra/core/agent";

export function createA2AHandler(agent: Agent) {
  return async (req: any) => {
    try {
      let body;
      if (req.json && typeof req.json === 'function') {
        body = await req.json();
      } else if (req.body) {
        body = req.body;
      } else {
        body = req;
      }
      
      console.log('📨 Request ID:', body.id);
      
      // Extract message from different A2A formats
      let userMessage = "";
      
      if (body.params?.messages && Array.isArray(body.params.messages)) {
        userMessage = body.params.messages[0]?.content || "";
      } else if (body.params?.message?.parts && Array.isArray(body.params.message.parts)) {
        const firstTextPart = body.params.message.parts.find((part: any) => part.kind === "text");
        if (firstTextPart && firstTextPart.text) {
          userMessage = firstTextPart.text.trim();
        }
      } else if (body.message) {
        userMessage = body.message;
      }
      
      if (!userMessage) {
        console.error('❌ No message found');
        return new Response(JSON.stringify({
          jsonrpc: "2.0",
          id: body.id || "error",
          error: {
            code: -32602,
            message: "No message content found"
          }
        }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        });
      }

      console.log('🤖 Processing:', userMessage);
      
      const result = await agent.generate(userMessage);

      console.log('✅ Generated:', result.text);

      // Build response in Telex-compatible format
      const response = {
        jsonrpc: "2.0",
        id: body.id,
        result: {
          // THIS IS THE KEY PART - Telex needs this to display in UI
          message: {
            kind: "message",
            role: "assistant",
            parts: [
              {
                kind: "text",
                text: result.text
              }
            ],
            messageId: `response-${body.id}`,
          },
          // Also include artifacts for compatibility
          artifacts: [
            {
              type: "text",
              text: result.text,
              title: "Uptime Status",
            },
          ],
          // History for context
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
      };

      console.log('📤 Sending response with message field');

      return new Response(JSON.stringify(response), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
      
    } catch (error: any) {
      console.error('❌ Error:', error.message);
      return new Response(JSON.stringify({
        jsonrpc: "2.0",
        id: "error",
        error: {
          code: -32000,
          message: error.message
        }
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  };
}