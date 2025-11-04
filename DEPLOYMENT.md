# Deployment Guide - Mastra Cloud

## ✅ Project Status
Your uptime monitor agent is **ready to deploy** to Mastra Cloud!

## 🔗 Endpoint Information

### Local Development
- **Mastra Native API**: `http://localhost:8080/api/agents/uptimeAgent/generate`
- **Playground**: `http://localhost:8080/`

### Mastra Cloud (After Deployment)
- **A2A Protocol**: `https://your-project.mastra.cloud/a2a/agent/uptimeAgent`
- **Mastra Native API**: `https://your-project.mastra.cloud/api/agents/uptimeAgent/generate`

**Example from reference:**
```
https://harsh-noisy-daybreak.mastra.cloud/a2a/agent/debugAgent
```

## 🚀 Deploy to Mastra Cloud

### Step 1: Commit Your Changes
```bash
git add .
git commit -m "Ready for Mastra Cloud deployment"
git push
```

### Step 2: Deploy on Mastra Cloud
1. Go to [https://cloud.mastra.ai](https://cloud.mastra.ai)
2. Sign in with GitHub
3. Click **"New Project"**
4. Select your repository: `uptime-monitor-agent`
5. Configuration:
   - **Framework**: Auto-detected (Mastra)
   - **Build Command**: `mastra build`
   - **Start Command**: `mastra start`
   - **Node Version**: 18+

### Step 3: Add Environment Variables
In Mastra Cloud dashboard:
```
OPENAI_API_KEY=your_openai_api_key_here
```

### Step 4: Deploy!
Click **"Deploy"** and wait for the build to complete.

### Step 5: Get Your Endpoint
After deployment, Mastra Cloud will give you a URL like:
```
https://your-unique-name.mastra.cloud
```

Your A2A endpoint will be:
```
https://your-unique-name.mastra.cloud/a2a/agent/uptimeAgent
```

## 📝 Update Telex Workflow

Once deployed, update `telex-workflow.json`:

```json
{
  "url": "https://your-unique-name.mastra.cloud/a2a/agent/uptimeAgent"
}
```

Then import it to Telex.im to integrate with your workflow.

## 🧪 Testing

### Local Testing
```bash
# Terminal 1: Start dev server
npm run dev

# Terminal 2: Run tests
npm run test:a2a
```

### Production Testing
After deployment, test with curl:
```bash
curl -X POST https://your-project.mastra.cloud/a2a/agent/uptimeAgent \
  -H "Content-Type: application/json" \
  -d '{
    "messages": [
      {
        "role": "user",
        "content": "Check if google.com is up"
      }
    ]
  }'
```

## 📊 Agent Configuration

**Agent Name**: `uptimeAgent` (from `src/mastra/index.ts`)

**Available Tools**:
- `pingWebsiteTool` - Check single website
- `checkMultipleSitesTool` - Check multiple websites (accepts domains with or without https://)
- `getUptimeStatsTool` - Get historical stats

**Example Queries**:
- "Check if google.com is up"
- "Monitor these sites: github.com, stackoverflow.com, npmjs.com"
- "Get uptime stats for reddit.com"

## ✨ Key Features Fixed

✅ ESM/CommonJS compatibility (using `p-map@4.0.0` and `slugify@1.1.2`)  
✅ URL normalization (accepts domains with or without protocol)  
✅ Proper Mastra Cloud endpoint structure  
✅ A2A protocol support  
✅ Express removed (pure Mastra deployment)

## 🎯 Next Steps

1. ✅ Commit and push changes
2. ⏳ Deploy to Mastra Cloud
3. ⏳ Get your deployment URL
4. ⏳ Update `telex-workflow.json`
5. ⏳ Import to Telex.im
6. ⏳ Test in production

Your agent is ready to go! 🚀
