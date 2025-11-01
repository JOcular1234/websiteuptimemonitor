# 🟢 Uptime Monitor AI Agent

An AI-powered website uptime monitoring assistant built with [Mastra](https://mastra.ai) and integrated with [Telex.im](https://telex.im) using the Agent-to-Agent (A2A) protocol.

## 🎯 Overview

This intelligent agent monitors website availability, measures response times, validates SSL certificates, and provides real-time status updates with actionable insights. Built for the HNG Stage 3 Backend Task.

## ✨ Features

- **🔍 Single Site Monitoring** - Check individual websites instantly
- **📊 Batch Monitoring** - Monitor multiple sites simultaneously  
- **⏱️ Response Time Tracking** - Measure and report performance metrics
- **🔐 SSL Validation** - Verify HTTPS certificate validity
- **📈 Historical Analytics** - Track uptime patterns over time
- **🤖 AI-Powered Insights** - Get intelligent recommendations and alerts
- **🌐 A2A Protocol Support** - Seamless Telex.im integration

## 🛠️ Tech Stack

- **Framework**: [Mastra](https://mastra.ai) v0.23.3
- **Language**: TypeScript
- **Runtime**: Node.js ≥20.9.0
- **HTTP Client**: Axios
- **Validation**: Zod
- **AI Model**: OpenAI GPT-4o-mini

## 🚀 Quick Start

### Prerequisites

- Node.js 20.9.0 or higher
- OpenAI API key

### Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd uptime-monitor-agent

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Add your OpenAI API key to .env
# OPENAI_API_KEY=your_key_here
```

### Development

```bash
# Start development server
npm run dev

# The agent will be available at http://localhost:4111
```

### Production Build

```bash
# Build for production
npm run build

# Start production server
npm start
```

## 📡 API Endpoints

### A2A Endpoint (Telex.im Integration)

**POST** `/api/a2a`

JSON-RPC 2.0 compliant endpoint for agent communication.

**Request:**
```json
{
  "jsonrpc": "2.0",
  "id": "unique-request-id",
  "params": {
    "messages": [
      {
        "role": "user",
        "content": "Check if google.com is up"
      }
    ]
  }
}
```

**Response:**
```json
{
  "jsonrpc": "2.0",
  "id": "unique-request-id",
  "result": {
    "artifacts": [
      {
        "type": "text",
        "text": "🟢 google.com - UP (142ms)",
        "title": "Uptime Status"
      }
    ],
    "history": {
      "messages": [
        {
          "role": "user",
          "content": "Check if google.com is up"
        },
        {
          "role": "assistant",
          "content": "🟢 google.com - UP (142ms)"
        }
      ]
    }
  }
}
```

## 🎮 Usage Examples

### Via Telex.im Chat

```
You: Check if github.com is up
Agent: 🟢 github.com - UP (245ms)

You: Monitor these sites: google.com, facebook.com, twitter.com
Agent: 
🟢 google.com - UP (142ms)
🟢 facebook.com - UP (389ms)
⚠️ twitter.com - UP (2134ms) - SLOW

Actionable Insight:
All sites are operational. Twitter has elevated response time - monitor for potential issues.

You: Get uptime stats for reddit.com
Agent: 
📊 Uptime Statistics for reddit.com (Last 24 hours):
- Uptime: 99.5%
- Average Response Time: 145ms
- Total Checks: 288
- Recent Downtime: 5 minutes (3 hours ago)
```

## 🧰 Available Tools

### 1. pingWebsiteTool
Checks a single website's status and measures response time.

**Capabilities:**
- HTTP/HTTPS support
- Response time measurement
- SSL validation for HTTPS
- Status code reporting
- Error message capture

### 2. checkMultipleSitesTool
Monitors multiple websites simultaneously with summary statistics.

**Capabilities:**
- Parallel checking (async)
- Batch status reporting
- Summary statistics (total/up/down)
- Individual site metrics

### 3. getUptimeStatsTool
Retrieves historical uptime data and analytics.

**Capabilities:**
- Uptime percentage calculation
- Average response time tracking
- Downtime incident reporting
- Configurable time ranges

## 🏗️ Architecture

```
src/
├── mastra/
│   ├── agents/
│   │   └── uptime-agent.ts      # Main agent definition
│   ├── tools/
│   │   ├── ping-website.ts      # Single site monitoring
│   │   ├── check-multiple.ts    # Batch monitoring
│   │   └── get-uptime-stats.ts  # Historical analytics
│   ├── routes/
│   │   └── a2a.ts              # A2A protocol handler
│   ├── pages/
│   │   └── api/
│   │       └── a2a.ts          # API route wrapper
│   └── index.ts                # Mastra configuration
```

## 🔌 Telex.im Integration

### Workflow Configuration

The agent integrates with Telex.im via the A2A protocol. See `telex-workflow.json` for the complete workflow configuration.

**Key Integration Points:**
1. **Endpoint**: `/api/a2a` handles all Telex.im requests
2. **Protocol**: JSON-RPC 2.0 compliant
3. **Authentication**: Environment-based (OPENAI_API_KEY)
4. **Response Format**: Structured artifacts with message history

### Testing Integration

1. Access Telex.im organization (use `/telex-invite your-email@example.com`)
2. Import the workflow JSON from `telex-workflow.json`
3. Update the `url` field with your deployed endpoint
4. Test the agent in Telex.im chat

### View Agent Logs

Monitor interactions at:
```
https://api.telex.im/agent-logs/{channel-id}.txt
```

## 🚢 Deployment

### Environment Variables

Required environment variables:

```bash
OPENAI_API_KEY=your_openai_api_key
PORT=4111  # Optional, defaults to 4111
```

### Deployment Platforms

#### Railway
```bash
# Install Railway CLI
npm i -g @railway/cli

# Login
railway login

# Deploy
railway up
```

#### Render
1. Create new Web Service
2. Connect your repository
3. Build Command: `npm run build`
4. Start Command: `npm start`
5. Add environment variables

#### Fly.io
```bash
# Install Fly CLI
curl -L https://fly.io/install.sh | sh

# Launch
fly launch

# Deploy
fly deploy
```

### Post-Deployment

1. Update `telex-workflow.json` with your deployed URL
2. Import workflow to Telex.im
3. Test the integration
4. Monitor logs at `https://api.telex.im/agent-logs/{channel-id}.txt`

## 📊 Performance

- **Average Response Time**: <500ms per site check
- **Concurrent Monitoring**: Up to 10 sites simultaneously
- **Timeout**: 10 seconds per request
- **SSL Verification**: Automatic for HTTPS URLs

## 🔒 Security

- API keys stored in environment variables
- No hardcoded credentials
- `.env` files git-ignored
- Input validation with Zod schemas
- Timeout protection against hanging requests

## 🧪 Testing

```bash
# Manual testing via HTTP
curl -X POST http://localhost:4111/api/a2a \
  -H "Content-Type: application/json" \
  -d '{
    "jsonrpc": "2.0",
    "id": "test-1",
    "params": {
      "messages": [{
        "role": "user",
        "content": "Check if google.com is up"
      }]
    }
  }'
```

## 🐛 Known Issues & Limitations

1. **Historical Data**: Currently returns mock data - database implementation pending
2. **Rate Limiting**: No rate limiting implemented yet
3. **Caching**: No response caching for repeated checks
4. **Scheduling**: No automated periodic monitoring (manual checks only)

## 🔮 Future Enhancements

- [ ] Database integration (SQLite/PostgreSQL) for real historical tracking
- [ ] Automated scheduled monitoring with cron jobs
- [ ] Email/SMS/Slack alerting for downtime incidents
- [ ] Web dashboard for visualization
- [ ] Rate limiting and caching layer
- [ ] Multi-region monitoring
- [ ] Custom alert thresholds
- [ ] Incident response workflows

## 📝 License

This project was built for the HNG Internship Stage 3 Backend Task.

## 👤 Author

Built by [Your Name] for [HNG Internship](https://hng.tech)

## 🔗 Links

- [Telex.im](https://telex.im)
- [Mastra Documentation](https://mastra.ai/docs)
- [HNG Internship](https://hng.tech)
- [Blog Post](#) - Coming soon
- [Live Demo](#) - Coming soon

## 🙏 Acknowledgments

- HNG Internship for the opportunity
- Mastra team for the excellent framework
- Telex.im for the A2A integration platform

---

**Built with ❤️ using Mastra for HNG Stage 3 Backend Task**
