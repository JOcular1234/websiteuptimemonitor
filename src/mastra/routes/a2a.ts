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
      
//       console.log('📨 Received A2A request:', JSON.stringify(body, null, 2));
      
//       // Extract message from different A2A formats
//       let userMessage = "";
      
//       // Format 1: Standard A2A (params.messages)
//       if (body.params?.messages && Array.isArray(body.params.messages)) {
//         userMessage = body.params.messages[0]?.content || "";
//       }
//       // Format 2: Telex A2A (params.message.parts)
//       else if (body.params?.message?.parts && Array.isArray(body.params.message.parts)) {
//         // Extract text from the first text part
//         const textPart = body.params.message.parts.find((part: any) => part.kind === "text");
//         if (textPart) {
//           userMessage = textPart.text || "";
//         }
//       }
//       // Format 3: Direct message (fallback)
//       else if (body.message) {
//         userMessage = body.message;
//       }
      
//       // Clean up the message (remove duplicates and HTML)
//       userMessage = cleanMessage(userMessage);
      
//       console.log('📝 Extracted message:', userMessage);
      
//       if (!userMessage) {
//         console.error('❌ No message found in request');
//         return new Response(JSON.stringify({
//           jsonrpc: "2.0",
//           id: body.id || "error",
//           error: {
//             code: -32602,
//             message: "Invalid params: message content required",
//             details: "Could not extract message from request"
//           }
//         }), {
//           status: 400,
//           headers: { 'Content-Type': 'application/json' }
//         });
//       }

//       console.log('🤖 Calling agent with message:', userMessage);
      
//       // Generate response using the agent (removed conversationId)
//       const result = await agent.generate(userMessage);

//       console.log('✅ Agent response:', result.text);

//       // Return A2A-compliant response
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

//       console.log('📤 Sending response:', JSON.stringify(response, null, 2));

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
//           message: error.message || "Internal server error",
//           stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
//         }
//       }), {
//         status: 500,
//         headers: { 'Content-Type': 'application/json' }
//       });
//     }
//   };
// }

// /**
//  * Clean up message text
//  * - Remove HTML tags
//  * - Remove code blocks
//  * - Remove duplicates
//  * - Trim whitespace
//  */
// function cleanMessage(text: string): string {
//   if (!text) return "";
  
//   // Remove HTML/code block tags
//   let cleaned = text
//     .replace(/<pre[^>]*>.*?<\/pre>/gs, '') // Remove code blocks
//     .replace(/<code[^>]*>.*?<\/code>/gs, '') // Remove inline code
//     .replace(/<[^>]+>/g, '') // Remove all HTML tags
//     .replace(/&nbsp;/g, ' ') // Replace HTML entities
//     .replace(/&lt;/g, '<')
//     .replace(/&gt;/g, '>')
//     .replace(/&amp;/g, '&');
  
//   // Split into lines and remove duplicates
//   const lines = cleaned.split('\n')
//     .map(line => line.trim())
//     .filter(line => line.length > 0);
  
//   // Remove duplicate lines
//   const uniqueLines = [...new Set(lines)];
  
//   // Join and clean up
//   return uniqueLines
//     .join(' ')
//     .replace(/\s+/g, ' ') // Multiple spaces to single
//     .trim();
// }

import { Agent } from "@mastra/core/agent";

export function createA2AHandler(agent: Agent) {
  return async (req: any) => {
    // Handle both Request object and plain object
    let body;
    try {
      if (req.json && typeof req.json === 'function') {
        body = await req.json();
      } else if (req.body) {
        body = req.body;
      } else {
        body = req;
      }
      
      console.log('📨 Received A2A request:', JSON.stringify(body, null, 2));
      
      // Extract message from different A2A formats
      let userMessage = "";
      
      // Format 1: Standard A2A (params.messages)
      if (body.params?.messages && Array.isArray(body.params.messages)) {
        userMessage = body.params.messages[0]?.content || "";
        console.log('📝 Extracted from standard format:', userMessage);
      }
      // Format 2: Telex A2A (params.message.parts)
      else if (body.params?.message?.parts && Array.isArray(body.params.message.parts)) {
        // Get the FIRST part with kind="text"
        const firstTextPart = body.params.message.parts.find((part: any) => part.kind === "text");
        if (firstTextPart && firstTextPart.text) {
          userMessage = firstTextPart.text.trim();
          console.log('📝 Extracted from Telex format:', userMessage);
        }
      }
      // Format 3: Direct message (fallback)
      else if (body.message) {
        userMessage = body.message;
        console.log('📝 Extracted from direct message:', userMessage);
      }
      
      if (!userMessage) {
        console.error('❌ No message found in request');
        console.error('Request structure:', JSON.stringify({
          hasParamsMessages: !!body.params?.messages,
          hasParamsMessageParts: !!body.params?.message?.parts,
          hasDirectMessage: !!body.message,
          parts: body.params?.message?.parts
        }, null, 2));
        
        return new Response(JSON.stringify({
          jsonrpc: "2.0",
          id: body.id || "error",
          error: {
            code: -32602,
            message: "Invalid params: message content required",
            details: "Could not extract message from request. Please provide website URLs to check."
          }
        }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        });
      }

      console.log('🤖 Calling agent with message:', userMessage);
      
      // Generate response using the agent
      const result = await agent.generate(userMessage);

      console.log('✅ Agent response:', result.text);

      // Build A2A-compliant response
      const response = {
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
      };

      // Check if we need to push to webhook (non-blocking mode)
      const pushConfig = body.params?.configuration?.pushNotificationConfig;
      if (pushConfig?.url) {
        console.log('📤 Pushing response to webhook:', pushConfig.url);
        
        // Push response to Telex webhook asynchronously
        const webhookHeaders: Record<string, string> = {
          'Content-Type': 'application/json',
        };
        
        // Add Bearer token if provided
        if (pushConfig.token) {
          webhookHeaders['Authorization'] = `Bearer ${pushConfig.token}`;
        }
        
        try {
          const webhookResponse = await fetch(pushConfig.url, {
            method: 'POST',
            headers: webhookHeaders,
            body: JSON.stringify(response),
          });
          
          console.log('✅ Webhook push status:', webhookResponse.status);
          
          if (!webhookResponse.ok) {
            const errorText = await webhookResponse.text();
            console.error('❌ Webhook rejected:', errorText);
          }
          
          // Return acknowledgment for non-blocking mode
          return new Response(JSON.stringify({
            jsonrpc: "2.0",
            id: body.id,
            result: {
              status: "accepted",
              message: "Processing asynchronously"
            } 
          }), {
            status: 202,
            headers: { 'Content-Type': 'application/json' }
          });
        } catch (webhookError: any) {
          console.error('❌ Webhook push failed:', webhookError.message);
          // Fall through to return response directly
        }
      }

      console.log('📤 Sending response directly');

      return new Response(JSON.stringify(response), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    } catch (error: any) {
      console.error('❌ A2A handler error:', error);
      return new Response(JSON.stringify({
        jsonrpc: "2.0",
        id: body.id || "error",
        error: {
          code: -32000,
          message: error.message || "Internal server error",
          stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        }
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  };
}



