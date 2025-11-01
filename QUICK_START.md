# 🚀 Quick Start - Deploy in 10 Minutes

## ✅ What's Already Done

- ✅ Agent built and tested locally
- ✅ A2A endpoint working
- ✅ All 3 tools functional
- ✅ TypeScript errors fixed
- ✅ Documentation complete
- ✅ Workflow JSON ready

## 📋 What You Need To Do

### 1️⃣ Deploy (Choose ONE platform)

#### Option A: Railway (Fastest ⭐)
```bash
npm i -g @railway/cli
railway login
railway init
railway variables set OPENAI_API_KEY=your_actual_key_here
railway up
railway domain
```
Copy your URL: `https://your-app.railway.app`

#### Option B: Render
1. Go to render.com → New Web Service
2. Connect GitHub repo
3. Build: `npm run build` | Start: `npm start`
4. Add env: `OPENAI_API_KEY`
5. Deploy and copy URL

---

### 2️⃣ Update Workflow JSON (2 minutes)

Edit `telex-workflow.json`:
```json
{
  "nodes": [{
    "url": "https://YOUR-DEPLOYED-URL.com/api/a2a"
  }]
}
```

---

### 3️⃣ Register with Telex (1 minute)

In Discord:
```
/telex-invite your-email@example.com
```

Wait for confirmation email.

---

### 4️⃣ Import to Telex.im (2 minutes)

1. Login to https://telex.im
2. Go to Workflows
3. Import `telex-workflow.json`
4. Test: "Check if google.com is up"

---

### 5️⃣ Write Blog Post (30 minutes)

Use `BLOG_POST_TEMPLATE.md` as your base:
1. Add your personal experience
2. Add screenshots of testing
3. Customize challenges section
4. Publish to Medium/Dev.to/Hashnode

Publish URL: ___________________________

---

### 6️⃣ Tweet (5 minutes)

Template:
```
Just built an AI-powered uptime monitoring agent with @mastra 🚀

Features:
✅ Real-time website monitoring
✅ Multi-site batch checks  
✅ AI-powered insights
✅ Integrated with @teleximapp

Built for @hnginternship Stage 3 Backend task 💪

Live: [your-url]
Blog: [blog-url]

#HNGInternship #Mastra #AI
```

Tweet URL: ___________________________

---

### 7️⃣ Submit (2 minutes)

In Discord `#stage-3-backend`:
```
/submit
```

Fill in:
- Deployed URL
- GitHub repo
- Blog post
- Tweet

---

## 🧪 Testing Commands

### Test Local
```bash
npm run dev
# Visit http://localhost:4111
```

### Test Deployed
```bash
curl -X POST https://your-url.com/api/a2a \
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

Expected: Should return JSON with agent response

---

## 📁 Your Project Files

**Documentation:**
- `README.md` - Complete project documentation
- `DEPLOYMENT.md` - Detailed deployment guide
- `BLOG_POST_TEMPLATE.md` - Blog post template
- `SUBMISSION_CHECKLIST.md` - Full checklist
- `QUICK_START.md` - This file

**Configuration:**
- `telex-workflow.json` - Telex integration config
- `.env` - Your environment variables (don't commit!)
- `.env.example` - Example env file

**Source Code:**
- `src/mastra/agents/uptime-agent.ts` - Agent definition
- `src/mastra/tools/ping-website.ts` - Single site check
- `src/mastra/tools/check-multiple.ts` - Batch checks
- `src/mastra/tools/get-uptime-stats.ts` - Historical data
- `src/mastra/routes/a2a.ts` - A2A handler
- `src/mastra/index.ts` - Mastra config

---

## ⏰ Timeline

**If you start now:**

- Deploy: 10 minutes
- Update config & test: 5 minutes  
- Blog post: 30 minutes
- Tweet & submit: 5 minutes

**Total: ~50 minutes**

**Deadline**: Monday, Nov 3rd 2025 | 11:59pm WAT

---

## 🆘 Need Help?

**Common Issues:**

1. **Build fails**
   - Check `bundler.externals: ["axios"]` exists in `src/mastra/index.ts`
   - Run `npm ci` to clean install

2. **"Provider not connected"**
   - Add `OPENAI_API_KEY` to platform environment variables
   - Restart service after adding

3. **Agent not responding in Telex**
   - Verify workflow JSON URL is correct
   - Test endpoint with curl first
   - Check logs: `https://api.telex.im/agent-logs/{channel-id}.txt`

**Ask for help in Discord:** `#stage-3-backend`

---

## ✨ Success Criteria

Your submission should have:

✅ Working deployed agent  
✅ Telex.im integration functional  
✅ Blog post published  
✅ Tweet with required tags  
✅ Clean documentation  
✅ Error handling working  

---

## 🎯 Pro Tips

1. **Deploy early** - Don't wait for the deadline
2. **Test in Telex** - Make sure it actually works
3. **Screenshot everything** - Use in blog post
4. **Be authentic** - Share real challenges in blog
5. **Engage** - Respond to feedback

---

## 📞 Your Submission Info

Fill this out:

**Deployed URL:**
```
https://____________________________
```

**GitHub Repo:**
```
https://github.com/____________________________
```

**Blog Post:**
```
https://____________________________
```

**Tweet:**
```
https://twitter.com/____________________________
```

---

**You've got this! 🚀**

Everything is ready. Just deploy, test, write, and submit.

Good luck, Backend Wizard! 🧙‍♂️
