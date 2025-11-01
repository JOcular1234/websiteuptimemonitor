# 🚀 Deployment Guide

Quick guide to deploy your Uptime Monitor AI Agent to production.

## 📋 Pre-Deployment Checklist

- [ ] Build succeeds locally (`npm run build`)
- [ ] Environment variables configured
- [ ] Tested A2A endpoint locally
- [ ] Updated `.env` with valid OpenAI API key
- [ ] Committed all changes to Git

## 🌐 Recommended Platforms

### Option 1: Railway (⭐ Recommended - Fastest)

**Why Railway:**
- Zero-config deployment
- Automatic HTTPS
- Free tier available
- Built-in environment variables

**Steps:**

```bash
# Install Railway CLI
npm i -g @railway/cli

# Login to Railway
railway login

# Initialize project
railway init

# Add environment variable
railway variables set OPENAI_API_KEY=your_key_here

# Deploy
railway up

# Get your URL
railway domain
```

**Post-Deployment:**
1. Copy the generated URL (e.g., `https://your-app.railway.app`)
2. Update `telex-workflow.json` with `https://your-app.railway.app/api/a2a`
3. Test: `curl https://your-app.railway.app/api/a2a`

---

### Option 2: Render

**Why Render:**
- Simple dashboard
- Free tier
- PostgreSQL integration ready

**Steps:**

1. **Create Web Service**
   - Go to [render.com](https://render.com)
   - Click "New +" → "Web Service"
   - Connect your GitHub repository

2. **Configure Service**
   - **Name**: `uptime-monitor-agent`
   - **Environment**: `Node`
   - **Build Command**: `npm run build`
   - **Start Command**: `npm start`
   - **Plan**: Free

3. **Add Environment Variables**
   - Click "Environment" tab
   - Add: `OPENAI_API_KEY` = `your_key_here`

4. **Deploy**
   - Click "Create Web Service"
   - Wait for build (~5 minutes)
   - Your URL: `https://uptime-monitor-agent.onrender.com`

**Post-Deployment:**
- Update `telex-workflow.json` with your Render URL + `/api/a2a`

---

### Option 3: Fly.io

**Why Fly.io:**
- Global edge deployment
- Docker-based
- Free tier includes 3 VMs

**Steps:**

1. **Install Fly CLI**
```bash
# Windows
powershell -Command "iwr https://fly.io/install.ps1 -useb | iex"

# Restart terminal
```

2. **Authenticate**
```bash
fly auth login
```

3. **Create fly.toml**

Create `fly.toml` in project root:

```toml
app = "uptime-monitor-agent"
primary_region = "iad"

[build]
  [build.args]
    NODE_VERSION = "20"

[env]
  PORT = "8080"

[http_service]
  internal_port = 8080
  force_https = true
  auto_stop_machines = true
  auto_start_machines = true
  min_machines_running = 0

[[vm]]
  memory = "256mb"
  cpu_kind = "shared"
  cpus = 1
```

4. **Deploy**
```bash
# Set secrets
fly secrets set OPENAI_API_KEY=your_key_here

# Launch
fly launch

# Deploy
fly deploy
```

5. **Get URL**
```bash
fly info
# Your URL: https://uptime-monitor-agent.fly.dev
```

---

## 🔧 Environment Variables

All platforms need these environment variables:

| Variable | Value | Required |
|----------|-------|----------|
| `OPENAI_API_KEY` | Your OpenAI API key | ✅ Yes |
| `PORT` | Port number (auto-set on most platforms) | ⚠️ Optional |

## 🧪 Testing Deployment

### 1. Health Check

```bash
curl https://your-deployed-url.com/api/a2a \
  -X POST \
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

Expected response should include:
```json
{
  "jsonrpc": "2.0",
  "id": "test-1",
  "result": {
    "artifacts": [...]
  }
}
```

### 2. Update Telex Workflow

1. Open `telex-workflow.json`
2. Update the `url` field:
```json
{
  "nodes": [
    {
      "url": "https://your-deployed-url.com/api/a2a"
    }
  ]
}
```

### 3. Import to Telex.im

1. Go to Telex.im
2. Navigate to workflows
3. Import `telex-workflow.json`
4. Test in chat: "Check if google.com is up"

### 4. Monitor Logs

View real-time logs:
```
https://api.telex.im/agent-logs/{channel-id}.txt
```

Get channel ID from Telex URL bar (first UUID).

---

## 🐛 Troubleshooting

### Build Fails

**Error**: `Cannot find module 'axios'`
```bash
# Ensure axios is in externals
# Check src/mastra/index.ts has:
bundler: {
  externals: ["axios"]
}
```

### Agent Not Responding

**Check:**
1. Environment variables set correctly
2. OpenAI API key is valid
3. Endpoint URL is correct in workflow JSON
4. Check platform logs for errors

**Railway:**
```bash
railway logs
```

**Render:**
- Dashboard → Logs tab

**Fly.io:**
```bash
fly logs
```

### "Provider not connected" Error

**Solution:**
- Ensure `OPENAI_API_KEY` is set in platform environment variables
- Restart the service after adding variables

### Timeout Errors

- Check if your deployed URL is accessible
- Verify network/firewall settings
- Increase timeout in Telex workflow if needed

---

## 📊 Post-Deployment

### Update Documentation

1. **README.md**
   - Add your deployed URL
   - Update "Live Demo" link

2. **telex-workflow.json**
   - Replace `YOUR_DEPLOYED_URL_HERE` with actual URL

### Submit to HNG

Use command in Discord:
```
/submit
```

Fill in:
- **Deployed URL**: Your production URL
- **GitHub Repo**: Your repository
- **Blog Post**: Link to your article
- **Demo Video**: Optional

### Share on Twitter

**Template:**
```
Just built an AI-powered uptime monitoring agent with @mastra 🚀

Features:
✅ Real-time website monitoring
✅ Multi-site batch checks
✅ AI-powered insights
✅ Integrated with @teleximapp

Built for @hnginternship Stage 3 Backend task 💪

Live: [your-url]
Code: [github-url]

#HNGInternship #Mastra #AI
```

---

## ✅ Deployment Complete!

Your agent is now live and ready for Telex.im integration! 🎉

**Next Steps:**
1. Write blog post about your implementation
2. Create demo video
3. Submit to HNG
4. Share on Twitter
5. Monitor logs and fix any issues

---

Need help? Check:
- [Mastra Docs](https://mastra.ai/docs)
- [Railway Docs](https://docs.railway.app)
- [Render Docs](https://render.com/docs)
- [Fly.io Docs](https://fly.io/docs)
