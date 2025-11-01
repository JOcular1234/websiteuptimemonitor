# Building an AI-Powered Uptime Monitor with Mastra and Telex.im

## Introduction

As part of the HNG Internship Stage 3 Backend challenge, I built an intelligent website uptime monitoring agent using Mastra framework and integrated it with Telex.im's A2A protocol. This post walks through the entire implementation process, challenges faced, and lessons learned.

## The Challenge

The task was clear: build an AI agent that does something useful and integrate it with Telex.im using the Agent-to-Agent (A2A) protocol. For TypeScript developers, using Mastra was mandatory.

## Why an Uptime Monitor?

I chose to build an uptime monitoring agent because:

1. **Real-world utility** - Every developer and business needs to monitor their services
2. **Clear use cases** - Status checks, performance tracking, downtime alerts
3. **Demonstrable value** - Easy to test and see immediate results
4. **Scalability potential** - Can expand to scheduled monitoring, historical tracking, and alerting

## Tech Stack

- **Framework**: Mastra v0.23.3
- **Language**: TypeScript
- **Runtime**: Node.js 20+
- **AI Model**: OpenAI GPT-4o-mini
- **Protocol**: A2A (Agent-to-Agent) JSON-RPC 2.0
- **HTTP Client**: Axios
- **Validation**: Zod

## Architecture Overview

The agent consists of three main components:

### 1. The Agent Definition (`uptime-agent.ts`)

```typescript
export const uptimeAgent = new Agent({
  name: "Uptime Monitor",
  instructions: `
    You are a professional website uptime monitoring assistant.
    // ... detailed instructions
  `,
  model: "openai/gpt-4o-mini",
  tools: {
    pingWebsiteTool,
    checkMultipleSitesTool,
    getUptimeStatsTool,
  },
});
```

**Key Design Decision**: I gave the agent specific instructions on how to format responses with emojis (🟢, 🔴, ⚠️) for better UX in chat interfaces.

### 2. The Tools

I implemented three distinct tools:

#### a) pingWebsiteTool - Single Site Monitoring

```typescript
export const pingWebsiteTool = createTool({
  id: "ping-website",
  description: "Check if a website is up and measure response time",
  inputSchema: z.object({
    url: z.string().url(),
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
    // Implementation with axios
  },
});
```

**Challenge #1: TypeScript Type Literals**

Initially, I hit a type error:
```
Type 'string' is not assignable to type '"up" | "down"'
```

**Solution**: Explicitly cast status values:
```typescript
status: (isUp ? "up" : "down") as "up" | "down"
```

#### b) checkMultipleSitesTool - Batch Monitoring

This tool uses `Promise.all()` to check multiple sites concurrently, providing summary statistics.

#### c) getUptimeStatsTool - Historical Data

Currently returns mock data, but the schema is designed for real database integration.

### 3. The A2A Integration (`routes/a2a.ts`)

```typescript
export function createA2AHandler(agent: Agent) {
  return async (req: any) => {
    const body = await req.json();
    const userMessage = body.params?.messages?.[0]?.content || "";
    
    const result = await agent.generate(userMessage);

    return Response.json({
      jsonrpc: "2.0",
      id: body.id,
      result: {
        artifacts: [{
          type: "text",
          text: result.text,
          title: "Uptime Status",
        }],
        history: {
          messages: [
            { role: "user", content: userMessage },
            { role: "assistant", content: result.text }
          ],
        },
      },
    });
  };
}
```

**Challenge #2: Understanding A2A Protocol**

The A2A protocol uses JSON-RPC 2.0 format. Key learnings:

- Must include `jsonrpc: "2.0"` field
- Response must echo back the request `id`
- Messages formatted in `params.messages` array
- Response structured with `artifacts` and `history`

**Challenge #3: Import Path Issues**

Hit an error: `Cannot find module '../../mastra'`

The correct path was `../../index` to import from `src/mastra/index.ts`.

### 4. Mastra Configuration

```typescript
export const mastra = new Mastra({
  agents: {
    uptimeAgent,
  },
  logger: createLogger({
    name: "UptimeMonitor",
    level: "info",
  }),
  bundler: {
    externals: ["axios"],  // Critical for build!
  },
});
```

**Challenge #4: Build Errors**

Initial build failed with:
```
Mastra wasn't able to build your project. Please add `axios` to your externals.
```

**Solution**: Added `bundler.externals` configuration. This tells Mastra not to bundle axios, allowing it to be used as an external dependency.

## Development Process

### Phase 1: Local Development

```bash
npm run dev
```

Server starts on `http://localhost:4111`

**Challenge #5: Port Already in Use**

Got `EADDRINUSE: address already in use :::4111` error.

**Solution**: Kill existing Node processes:
```bash
taskkill /IM node.exe /F
```

### Phase 2: Environment Configuration

**Challenge #6: Provider Not Connected**

Opened `http://localhost:4111` and got:
```
Provider not connected
Set the OPENAI_API_KEY environment variable
```

**Solution**: Created `.env` file from `.env.example`:
```bash
OPENAI_API_KEY=your_actual_key_here
```

Also updated `.gitignore` to protect sensitive data:
```
.env*
```

### Phase 3: Testing

Tested the agent with various prompts:

**Test 1: Single Site**
```
User: Check if google.com is up
Agent: 🟢 google.com - UP (655ms)
```

**Test 2: Multiple Sites**
```
User: Monitor these sites: github.com, stackoverflow.com, reddit.com
Agent:
🔴 reddit.com - DOWN (Connection timeout)
🟢 github.com - UP (1192ms)
🟢 stackoverflow.com - UP (1332ms)

Actionable Insight:
Reddit is currently down; check back later or investigate further.
```

✅ **All tests passed!** The agent correctly:
- Prioritizes DOWN sites first
- Provides response times
- Gives actionable insights

## Telex.im Integration

### Workflow Configuration

Created `telex-workflow.json`:

```json
{
  "active": true,
  "category": "utilities",
  "name": "uptime_monitor_agent",
  "nodes": [{
    "type": "a2a/mastra-a2a-node",
    "url": "YOUR_DEPLOYED_URL/api/a2a"
  }]
}
```

Key fields:
- **category**: "utilities" (monitoring is a utility)
- **type**: "a2a/mastra-a2a-node" (Mastra integration)
- **url**: Points to your deployed `/api/a2a` endpoint

## Deployment

I deployed to [Railway/Render/Fly.io - choose your platform]:

```bash
# Railway example
railway login
railway init
railway variables set OPENAI_API_KEY=your_key
railway up
railway domain
```

Deployed URL: `https://your-app.railway.app`

Updated `telex-workflow.json` with production URL and imported to Telex.im.

## What I Learned

### 1. Mastra is Powerful but Specific

**Pros:**
- Quick agent setup with minimal boilerplate
- Built-in A2A support
- Type-safe with TypeScript
- Excellent tool system

**Cons:**
- Must handle build configurations (externals)
- Limited documentation on advanced features
- Need to understand JSON-RPC for A2A

### 2. A2A Protocol is Elegant

The Agent-to-Agent protocol standardizes how AI agents communicate. Key benefits:
- Platform-agnostic
- JSON-RPC 2.0 standard
- Easy to debug (just HTTP/JSON)
- Supports message history

### 3. Tool Design Matters

Good tool design principles I learned:
- **Clear descriptions** - Help the AI choose the right tool
- **Strict schemas** - Use Zod for validation
- **Helpful errors** - Return actionable error messages
- **Type safety** - Use TypeScript literal types

### 4. Agent Instructions are Critical

The agent's behavior is largely controlled by its instructions. I found that:
- Being specific helps (e.g., "Always prioritize DOWN sites")
- Format examples guide output style
- Clear capability descriptions prevent confusion

## Challenges & Solutions Summary

| Challenge | Solution |
|-----------|----------|
| TypeScript type literals | Explicit `as "up" \| "down"` casting |
| Import path errors | Correct relative paths |
| Build failures | Add `bundler.externals: ["axios"]` |
| Port conflicts | Kill existing processes |
| Missing env vars | Create `.env` file |
| A2A format | Study JSON-RPC 2.0 spec |

## Future Improvements

1. **Database Integration** - Replace mock data with real historical tracking
2. **Scheduled Monitoring** - Add cron jobs for automated checks
3. **Alerting System** - Email/SMS/Slack notifications
4. **Dashboard UI** - Visual monitoring interface
5. **Rate Limiting** - Prevent abuse
6. **Caching** - Reduce repeated checks

## Conclusion

Building this uptime monitor taught me about:
- Mastra framework architecture
- A2A protocol implementation
- AI agent tool design
- Production deployment considerations

The most valuable lesson: **Start simple, validate early, iterate quickly.** I could have spent days building a complex system, but starting with core functionality and testing immediately helped catch issues early.

## Resources

- **Live Demo**: [Your deployed URL]
- **GitHub Repo**: [Your repo URL]
- **Mastra Docs**: https://mastra.ai/docs
- **Telex.im**: https://telex.im
- **HNG Internship**: https://hng.tech

## Try It Yourself

1. Clone the repo
2. Install dependencies: `npm install`
3. Add your OpenAI key to `.env`
4. Run: `npm run dev`
5. Test at `http://localhost:4111`

Or try it on Telex.im: [link to your workflow]

---

**Built with ❤️ using Mastra for HNG Internship Stage 3**

**Tags**: #HNGInternship #Mastra #AI #Telex #TypeScript #Backend

---

## Comments & Questions

I'd love to hear your feedback! What other tools would be useful for an uptime monitor? What features would you add?

Connect with me: [Your social links]
