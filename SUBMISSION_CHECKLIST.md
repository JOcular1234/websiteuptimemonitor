# ✅ HNG Stage 3 Submission Checklist

Use this checklist to ensure you've completed all requirements before submitting.

## 📋 Core Requirements

### 1. AI Agent Development
- [x] Agent built and functional
- [x] Uses Mastra framework (required for TypeScript)
- [x] Implements useful functionality (uptime monitoring)
- [x] Agent instructions defined
- [x] Multiple tools implemented (3 tools)
- [x] Error handling implemented
- [x] Input validation with Zod schemas

### 2. Telex.im Integration
- [ ] Registered with Telex.im organization
  - Command: `/telex-invite your-email@example.com`
- [ ] A2A endpoint implemented (`/api/a2a`)
- [ ] JSON-RPC 2.0 compliant responses
- [ ] Workflow JSON created (`telex-workflow.json`)
- [ ] Workflow imported to Telex.im
- [ ] Integration tested in Telex.im chat
- [ ] Agent logs accessible at `https://api.telex.im/agent-logs/{channel-id}.txt`

### 3. Deployment
- [ ] Agent deployed to public URL
- [ ] Choose platform:
  - [ ] Railway (recommended)
  - [ ] Render
  - [ ] Fly.io
  - [ ] Other: ___________
- [ ] Environment variables configured
- [ ] HTTPS enabled (automatic on most platforms)
- [ ] Endpoint accessible publicly
- [ ] Test deployment with curl/Postman
- [ ] Updated `telex-workflow.json` with production URL

### 4. Documentation
- [x] README.md created
  - [x] Overview and features
  - [x] Installation instructions
  - [x] Usage examples
  - [x] API documentation
  - [x] Architecture explanation
  - [x] Deployment guide
- [x] DEPLOYMENT.md guide created
- [ ] Update README with:
  - [ ] Your deployed URL
  - [ ] Your GitHub repo link
  - [ ] Your blog post link
  - [ ] Your name/info

### 5. Blog Post
- [x] Blog post template created (`BLOG_POST_TEMPLATE.md`)
- [ ] Customize template with your experience
- [ ] Add screenshots/demos
- [ ] Include code snippets
- [ ] Explain challenges and solutions
- [ ] Discuss integration process with Mastra
- [ ] Published to:
  - [ ] Medium
  - [ ] Dev.to
  - [ ] Hashnode
  - [ ] Personal blog
  - [ ] Other: ___________
- [ ] Blog URL: ___________________________

### 6. Social Media (Twitter/X)
- [ ] Tweet created about your agent
- [ ] Tagged @mastra (required for TypeScript/Mastra)
- [ ] Tagged @hnginternship
- [ ] Tagged @teleximapp
- [ ] Included:
  - [ ] Brief description
  - [ ] Key features (3-5 bullet points)
  - [ ] Deployed URL
  - [ ] GitHub repo
  - [ ] Screenshot or demo
  - [ ] Relevant hashtags (#HNGInternship #Mastra #AI)
- [ ] Tweet URL: ___________________________

## 🧪 Testing Checklist

### Local Testing
- [x] `npm run dev` works
- [x] Agent responds at `http://localhost:4111`
- [x] Tools execute correctly
- [x] Environment variables loaded
- [x] Build succeeds: `npm run build`

### Deployment Testing
- [ ] Production URL accessible
- [ ] POST to `/api/a2a` returns valid response
- [ ] OpenAI API key configured correctly
- [ ] No "Provider not connected" errors
- [ ] Response time acceptable (<5 seconds)
- [ ] Error handling works (test with invalid inputs)

### Telex.im Testing
- [ ] Workflow imported successfully
- [ ] Agent appears in Telex.im
- [ ] Test prompt: "Check if google.com is up"
- [ ] Agent responds with emoji status
- [ ] Test batch: "Monitor google.com, github.com, facebook.com"
- [ ] Agent prioritizes DOWN sites correctly
- [ ] Response format matches expectations
- [ ] Logs visible at agent-logs URL

## 📦 Deliverables

### Required Files
- [x] `README.md` - Main documentation
- [x] `telex-workflow.json` - Telex integration config
- [x] `DEPLOYMENT.md` - Deployment guide
- [x] `BLOG_POST_TEMPLATE.md` - Blog post draft
- [x] `.env.example` - Environment variable template
- [ ] `.env` - Your actual env vars (NOT committed)
- [x] `src/mastra/` - Source code
  - [x] `agents/uptime-agent.ts`
  - [x] `tools/` (3 tools)
  - [x] `routes/a2a.ts`
  - [x] `index.ts`

### Submission Information
Fill this out before submitting:

**Deployed URL:**
```
https://____________________________
```

**GitHub Repository:**
```
https://github.com/_______________
```

**Blog Post URL:**
```
https://____________________________
```

**Tweet URL:**
```
https://twitter.com/_______________
```

**Channel ID (for logs):**
```
Get from Telex.im URL bar (first UUID)
01989dec-0d08-71ee-9017-00e4556e1942
```

**Agent Logs URL:**
```
https://api.telex.im/agent-logs/[your-channel-id].txt
```

## 🚀 Submission Process

### Step 1: Final Verification
```bash
# Test local build
npm run build

# Test production endpoint (after deployment)
curl -X POST https://your-url.com/api/a2a \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","id":"test","params":{"messages":[{"role":"user","content":"Check if google.com is up"}]}}'
```

### Step 2: Submit to HNG

In Discord `#stage-3-backend` channel:
```
/submit
```

Fill in the form with:
1. **Project Name**: Uptime Monitor AI Agent
2. **Deployed URL**: Your production URL
3. **GitHub Repo**: Your repository
4. **Blog Post**: Your published article
5. **Tweet**: Your Twitter/X post
6. **Additional Notes**: Any special features or considerations

### Step 3: Post-Submission

- [ ] Monitor Telex.im for feedback
- [ ] Check agent logs for any errors
- [ ] Be ready to fix issues quickly
- [ ] Respond to comments on blog post
- [ ] Engage with others who tried your agent

## ⏰ Deadline Reminder

**Submission Deadline**: Monday, Nov 3rd 2025 | 11:59pm GMT+1 (WAT)

Current time: Check Discord for accurate countdown

## 🆘 Troubleshooting

### Common Issues

**Issue**: Deployment fails
- Check environment variables are set
- Verify build succeeds locally
- Check platform logs for errors

**Issue**: Agent doesn't respond in Telex
- Verify workflow JSON URL is correct
- Check deployed endpoint with curl
- Review agent logs at Telex

**Issue**: "Provider not connected"
- Ensure OPENAI_API_KEY is set in production
- Restart service after adding env vars
- Verify API key is valid

**Issue**: Build fails with axios error
- Confirm `bundler.externals: ["axios"]` in `src/mastra/index.ts`
- Reinstall dependencies: `npm ci`

## 📚 Resources

- **Mastra Docs**: https://mastra.ai/docs
- **Telex.im**: https://telex.im
- **Railway Docs**: https://docs.railway.app
- **Render Docs**: https://render.com/docs
- **HNG Discord**: Ask in #stage-3-backend for help

## ✨ Tips for Success

1. **Test Early**: Don't wait until the deadline to deploy
2. **Screenshot Everything**: Capture your testing process for blog
3. **Be Specific**: Clear documentation helps reviewers
4. **Show Your Work**: Blog post should detail your process
5. **Engage**: Respond to feedback and help others

---

## 🎯 Quick Start Guide

If you're reading this with limited time:

1. **Deploy Now** (15 min)
   ```bash
   railway login
   railway init
   railway variables set OPENAI_API_KEY=your_key
   railway up
   ```

2. **Update Config** (5 min)
   - Get Railway URL
   - Update `telex-workflow.json`
   - Import to Telex.im

3. **Test** (5 min)
   - Try in Telex chat
   - Verify it works

4. **Document** (30 min)
   - Customize blog post template
   - Publish to Medium/Dev.to
   - Update README links

5. **Share** (5 min)
   - Tweet with required tags
   - Submit via `/submit`

**Total Time**: ~60 minutes

---

**Good luck! 🚀**

You've got this. May the wind be always at your back! 💨
