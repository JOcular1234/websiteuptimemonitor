// src/mastra/index.ts
import { Mastra } from "@mastra/core/mastra";
import { uptimeAgent } from "./agents/uptime-agent";

export const mastra = new Mastra({
  agents: {
    uptimeAgent,
  },
  bundler: {
    externals: ["axios", "@libsql/client", "@mastra/libsql", "@mastra/loggers-http"],
  },
});