import { Mastra } from "@mastra/core/mastra";
import { createLogger } from "@mastra/core/logger";
import { uptimeAgent } from "./agents/uptime-agent";
import { createA2AHandler } from "./routes/a2a";

export const mastra = new Mastra({
  agents: {
    uptimeAgent,
  },
  logger: createLogger({
    name: "UptimeMonitor",
    level: "info",
  }),
  bundler: {
    externals: ["axios"],
  },
});

// Export A2A handler for deployment
export const a2aHandler = createA2AHandler(uptimeAgent);