# 🚀 Render.com Deployment Guide

## 📋 **Prerequisites**

### **1. Accounts Needed:**
- ✅ [Render.com](https://render.com) account (free tier available)
- ✅ [MongoDB Atlas](https://cloud.mongodb.com) account (free tier available)
- ✅ [Supabase](https://supabase.com) account (free tier available)
- ✅ GitHub account with your project repository

### **2. Project Requirements:**
- ✅ Clean project structure (completed ✓)
- ✅ Environment configuration files (created ✓)
- ✅ Production-ready server configuration (updated ✓)

## 🗄️ **Step 1: Setup MongoDB Atlas**

### **Create Database:**
1. **Go to [MongoDB Atlas](https://cloud.mongodb.com)**
2. **Create new project** → "MediEquip"
3. **Create cluster** → Choose "Free Tier" (M0)
4. **Choose region** → Closest to your users
5. **Create cluster** → Wait for deployment

### **Configure Database:**
1. **Database Access** → Add new user:
   - Username: `mediequip_user`
   - Password: Generate secure password
   - Role: `Atlas Admin`

2. **Network Access** → Add IP Address:
   - Click "Add IP Address"
   - Choose "Allow access from anywhere" (0.0.0.0/0)
   - Or add Render's IP ranges

3. **Get Connection String:**
   - Click "Connect" → "Connect your application"
   - Copy connection string
   - Replace `<password>` with your user password

## 🚀 **Step 2: Deploy to Render**

### **Backend Deployment:**

1. **Go to [Render Dashboard](https://dashboard.render.com)**
2. **Click "New +"** → **"Web Service"**
3. **Connect GitHub repository**
4. **Configure service:**
   - **Name:** `mediequip-backend`
   - **Environment:** `Node`
   - **Region:** Choose closest region
   - **Branch:** `master` (or `main` if that's your default branch)
   - **Root Directory:** `backend` ⚠️ **CRITICAL: Must be set to `backend`**
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`

4. **Environment Variables:**
   ```
   NODE_ENV=production
   PORT=10000
   MONGODB_URI=mongodb+srv://mediequip_user:YOUR_PASSWORD@cluster.mongodb.net/mediequip?retryWrites=true&w=majority
   JWT_SECRET=your-super-secret-jwt-key-minimum-32-characters
   CORS_ORIGIN=https://mediequip-frontend.onrender.com
   ```

5. **Click "Create Web Service"**

### **Frontend Deployment:**

1. **Click "New +"** → **"Static Site"**
2. **Connect same GitHub repository**
3. **Configure site:**
   - **Name:** `mediequip-frontend`
   - **Branch:** `main`
   - **Build Command:** `npm install && npm run build`
   - **Publish Directory:** `dist`

4. **Environment Variables:**
   ```
   VITE_API_URL=https://mediequip-backend.onrender.com/api
   NODE_ENV=production
   ```

5. **Click "Create Static Site"**

## 🔧 **Step 4: Configure Custom Domains (Optional)**

### **Backend Domain:**
1. **Go to backend service** → **Settings** → **Custom Domains**
2. **Add custom domain:** `api.yourdomain.com`
3. **Update DNS** with provided CNAME record

### **Frontend Domain:**
1. **Go to frontend service** → **Settings** → **Custom Domains**
2. **Add custom domain:** `yourdomain.com`
3. **Update DNS** with provided CNAME record

## 🧪 **Step 5: Test Deployment**

### **Backend Testing:**
1. **Visit:** `https://mediequip-backend.onrender.com/api/health`
2. **Should return:**
   ```json
   {
     "status": "OK",
     "message": "MediEquip API Server is running",
     "environment": "production",
     "timestamp": "2024-01-09T..."
   }
   ```

### **Frontend Testing:**
1. **Visit:** `https://mediequip-frontend.onrender.com`
2. **Test features:**
   - ✅ Homepage loads
   - ✅ Navigation works
   - ✅ Login/signup functions
   - ✅ Equipment catalog displays
   - ✅ Admin panel accessible

### **Full System Testing:**
1. **Create test accounts**
2. **Submit rental requests**
3. **Test admin approval workflow**
4. **Test payment system**
5. **Verify all functionality**

## 📊 **Step 6: Monitor Deployment**

### **Render Dashboard:**
- **Logs:** Monitor application logs
- **Metrics:** Check performance metrics
- **Events:** Track deployment events
- **Settings:** Manage environment variables

### **Health Checks:**
- **Backend:** `/api/health` endpoint
- **Database:** MongoDB Atlas monitoring
- **Authentication:** Supabase dashboard

## 🔄 **Step 7: Continuous Deployment**

### **Auto-Deploy Setup:**
1. **Render automatically deploys** on git push to main branch
2. **Backend redeploys** when backend files change
3. **Frontend rebuilds** when frontend files change

### **Manual Deploy:**
1. **Go to service dashboard**
2. **Click "Manual Deploy"**
3. **Choose "Deploy latest commit"**

## 🛠️ **Troubleshooting**

### **Common Issues:**

#### **Backend Won't Start:**
- ✅ Check environment variables
- ✅ Verify MongoDB connection string
- ✅ Check build logs for errors
- ✅ Ensure all dependencies installed

#### **Frontend Build Fails:**
- ✅ Check Node.js version compatibility
- ✅ Verify all dependencies in package.json
- ✅ Check for TypeScript errors
- ✅ Ensure environment variables set

#### **CORS Errors:**
- ✅ Update CORS_ORIGIN in backend
- ✅ Verify frontend URL matches
- ✅ Check protocol (http vs https)

#### **Database Connection Issues:**
- ✅ Verify MongoDB Atlas IP whitelist
- ✅ Check connection string format
- ✅ Ensure database user has correct permissions

## 💰 **Cost Optimization**

### **Free Tier Limits:**
- **Render:** 750 hours/month per service
- **MongoDB Atlas:** 512MB storage
- **Supabase:** 500MB database, 2GB bandwidth

### **Upgrade Considerations:**
- **Render Pro:** $7/month per service
- **MongoDB Atlas:** $9/month for M2 cluster
- **Supabase Pro:** $25/month

## 🎉 **Deployment Checklist**

- [ ] MongoDB Atlas cluster created
- [ ] Database user and network access configured
- [ ] Supabase project created and configured
- [ ] Backend service deployed on Render
- [ ] Frontend static site deployed on Render
- [ ] Environment variables configured
- [ ] Custom domains configured (optional)
- [ ] Health checks passing
- [ ] Full system testing completed
- [ ] Monitoring setup

## 🚀 **Your Live URLs**

After deployment, your application will be available at:

- **Frontend:** `https://mediequip-frontend.onrender.com`
- **Backend API:** `https://mediequip-backend.onrender.com/api`
- **Health Check:** `https://mediequip-backend.onrender.com/api/health`

## 📞 **Support**

If you encounter issues:
1. **Check Render logs** in dashboard
2. **Review MongoDB Atlas logs**
3. **Check Supabase dashboard**
4. **Render Support:** [help.render.com](https://help.render.com)

Your medical equipment marketplace is now ready for production! 🎉