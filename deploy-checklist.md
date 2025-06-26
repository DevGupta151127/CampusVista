# 🚀 Deployment Checklist for Students

## ✅ Pre-Deployment Checklist

### 1. Code Preparation
- [ ] All files committed to GitHub
- [ ] No sensitive data in code (API keys, passwords)
- [ ] Environment variables properly configured
- [ ] README.md updated with project description

### 2. Backend (Railway) - 5 minutes
- [ ] Create Railway account
- [ ] Connect GitHub repository
- [ ] Set root directory to `server`
- [ ] Add environment variables:
  - [ ] `NODE_ENV=production`
  - [ ] `JWT_SECRET=your_secret_key`
  - [ ] `MONGODB_URI=your_mongodb_uri`
  - [ ] `STRIPE_SECRET_KEY=sk_test_...`
  - [ ] `STRIPE_PUBLISHABLE_KEY=pk_test_...`
- [ ] Add MongoDB database
- [ ] Deploy and get backend URL

### 3. Frontend (Vercel) - 5 minutes
- [ ] Create Vercel account
- [ ] Import GitHub repository
- [ ] Set build command: `npm run build`
- [ ] Set output directory: `build`
- [ ] Add environment variables:
  - [ ] `REACT_APP_API_URL=https://your-backend.railway.app/api`
  - [ ] `REACT_APP_STRIPE_PUBLISHABLE_KEY=pk_test_...`
- [ ] Deploy and get frontend URL

### 4. Database Setup - 2 minutes
- [ ] Access Railway shell
- [ ] Run: `npm run seed`
- [ ] Verify sample data created

### 5. Testing - 3 minutes
- [ ] Test login with: `john.doe@student.campusvista.edu` / `password123`
- [ ] Verify dashboard loads
- [ ] Test course browsing
- [ ] Test payment features
- [ ] Test responsive design

## 🎯 Final Steps

### 6. Portfolio Preparation
- [ ] Update resume with project details
- [ ] Prepare demo script for interviews
- [ ] Test all features work correctly
- [ ] Document any known limitations

### 7. Share with Recruiters
- [ ] Frontend URL: `https://your-app.vercel.app`
- [ ] GitHub URL: `https://github.com/your-username/campusvista`
- [ ] Demo credentials ready to share

## ⚡ Quick Commands

```bash
# If you need to restart backend
# Railway Dashboard → Deployments → Redeploy

# If you need to restart frontend  
# Vercel Dashboard → Deployments → Redeploy

# If you need to reseed database
# Railway Shell → npm run seed
```

## 🆘 Emergency Contacts

- **Railway Support:** https://railway.app/docs
- **Vercel Support:** https://vercel.com/docs
- **MongoDB Atlas:** https://docs.atlas.mongodb.com

## 🎉 Success!

Your project is now live and ready to impress recruiters!

**Total Time:** ~15 minutes
**Cost:** $0 (completely free)
**Result:** Professional live demo for your portfolio 