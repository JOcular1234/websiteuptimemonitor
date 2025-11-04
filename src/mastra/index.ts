import { Mastra } from "@mastra/core/mastra";
import { uptimeAgent } from "./agents/uptime-agent";
import { createA2AHandler } from "./routes/a2a";

export const mastra = new Mastra({
  agents: {
    uptimeAgent,
  },
  bundler: {
    externals: ["axios"],
  },
});

// Export A2A handler for deployment
export const a2aHandler = createA2AHandler(uptimeAgent);