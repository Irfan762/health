# 🚨 URGENT: Fix Render Deployment Issue

## Problem
Your Render deployment is failing because it's running from the wrong directory. The logs show:
```
npm error Missing script: "start"
```

This happens because Render is running from the root directory instead of the `backend` directory.

## ⚡ Quick Fix Steps

### 1. Go to Render Dashboard
1. Open [Render Dashboard](https://dashboard.render.com)
2. Find your `mediequip-backend` service
3. Click on the service name

### 2. Update Service Settings
1. Click **"Settings"** tab
2. Scroll to **"Build & Deploy"** section
3. **CRITICAL:** Set **"Root Directory"** to: `backend`
4. Set **"Build Command"** to: `npm install`
5. Set **"Start Command"** to: `npm start`
6. Click **"Save Changes"**

### 3. Redeploy
1. Go to **"Deploys"** tab
2. Click **"Manual Deploy"**
3. Select **"Deploy latest commit"**

## ✅ Expected Result
After fixing the Root Directory, your deployment should:
1. Install dependencies from `backend/package.json`
2. Start the server with `node server.js`
3. Show successful deployment logs

## 🔍 Verify Fix
Once deployed, test:
- Backend health: `https://your-service-name.onrender.com/api/health`
- Should return JSON with status "OK"

## 📋 Current Configuration Should Be:
```
Root Directory: backend
Build Command: npm install
Start Command: npm start
Environment: Node
```

## 🚨 If Still Failing
Check these in order:
1. Ensure MongoDB_URI environment variable is set
2. Verify all required environment variables are present
3. Check build logs for specific errors
4. Ensure your GitHub repo has the latest code

The key issue was the missing **Root Directory** setting!