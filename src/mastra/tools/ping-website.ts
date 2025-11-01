import { createTool } from "@mastra/core/tools";
import { z } from "zod";
import axios from "axios";

export const pingWebsiteTool = createTool({
  id: "ping-website",
  description: "Check if a website is up and measure response time",
  inputSchema: z.object({
    url: z.string().url().describe("Website URL to check"),
  }),
  outputSchema: z.object({
    url: z.string(),
    status: z.enum(["up", "down"]),
    statusCode: z.number().optional(),
    responseTime: z.number(),
    error: z.string().optional(),
    timestamp: z.string(),
    sslValid: z.boolean().optional(),
  }),
  execute: async ({ context }) => {
    const startTime = Date.now();
    const timestamp = new Date().toISOString();

    try {
      const response = await axios.get(context.url, {
        timeout: 10000,
        validateStatus: () => true,
        maxRedirects: 5,
      });

      const responseTime = Date.now() - startTime;
      const isUp = response.status >= 200 && response.status < 400;

      return {
        url: context.url,
        status: (isUp ? "up" : "down") as "up" | "down",
        statusCode: response.status,
        responseTime,
        timestamp,
        sslValid: context.url.startsWith("https://"),
      };
    } catch (error: any) {
      return {
        url: context.url,
        status: "down" as "down",
        responseTime: Date.now() - startTime,
        error: error.message,
        timestamp,
      };
    }
  },
});