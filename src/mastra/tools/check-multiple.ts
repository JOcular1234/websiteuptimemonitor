// src/mastra/tools/check-multiple.ts
import { createTool } from "@mastra/core/tools";
import { z } from "zod";
import axios from "axios";

export const checkMultipleSitesTool = createTool({
  id: "check-multiple-sites",
  description: "Check status of multiple websites at once",
  inputSchema: z.object({
    urls: z.array(z.string().url()).describe("Array of website URLs"),
  }),
  outputSchema: z.object({
    results: z.array(
      z.object({
        url: z.string(),
        status: z.enum(["up", "down"]),
        statusCode: z.number().optional(),
        responseTime: z.number(),
        error: z.string().optional(),
      })
    ),
    summary: z.object({
      total: z.number(),
      up: z.number(),
      down: z.number(),
    }),
  }),
  execute: async ({ context }) => {
    const results = await Promise.all(
      context.urls.map(async (url) => {
        const startTime = Date.now();
        try {
          const response = await axios.get(url, {
            timeout: 10000,
            validateStatus: () => true,
          });
          return {
            url,
            status: (response.status < 400 ? "up" : "down") as "up" | "down",
            statusCode: response.status,
            responseTime: Date.now() - startTime,
          };
        } catch (error: any) {
          return {
            url,
            status: "down" as "down",
            responseTime: Date.now() - startTime,
            error: error.message,
          };
        }
      })
    );

    const up = results.filter((r) => r.status === "up").length;
    const down = results.length - up;

    return {
      results,
      summary: {
        total: results.length,
        up,
        down,
      },
    };
  },
});