# 🚀 DEPLOY NOW - Copy & Paste These Commands

## Step 1: Push to GitHub

Replace `YOUR-USERNAME` with your actual GitHub username, then run:

```powershell
# Add GitHub as remote
git remote add origin https://github.com/YOUR-USERNAME/content-accelerator.git

# Rename branch to main (if needed)
git branch -M main

# Push code
git push -u origin main
```

---

## Step 2: Deploy to Vercel

### A. Go to Vercel
1. Open: https://vercel.com/new
2. Sign in with GitHub (if not already)

### B. Import Repository
1. Click "Add New..." → "Project"
2. Click "Import" next to `content-accelerator`

### C. Configure (Leave defaults, just add environment variables)

**Framework Preset:** Next.js ✅ (auto-detected)

**Root Directory:** `./` ✅

**Build Command:** `npm run build` ✅

**Output Directory:** `.next` ✅

### D. Add Environment Variables (CRITICAL!)

Click "Environment Variables" tab and add these:

#### Required Variables:

```bash
# 1. AUTH_SECRET (Generate new)
AUTH_SECRET
```
**Value:** Run this in PowerShell to generate:
```powershell
[Convert]::ToBase64String([System.Security.Cryptography.RandomNumberGenerator]::GetBytes(32))
```

```bash
# 2. ENCRYPTION_KEY (Generate new)
ENCRYPTION_KEY
```
**Value:** Run this in PowerShell to generate:
```powershell
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

```bash
# 3. AUTH_URL (Will update after deployment)
AUTH_URL
```
**Value:** `https://content-accelerator.vercel.app` (or your custom URL)

```bash
# 4. NEXT_PUBLIC_URL (Same as AUTH_URL)
NEXT_PUBLIC_URL
```
**Value:** `https://content-accelerator.vercel.app` (or your custom URL)

```bash
# 5. NODE_ENV
NODE_ENV
```
**Value:** `production`

### E. Database Setup

**Choose one option:**

#### Option 1: Vercel Postgres (Easiest)
1. After first deployment, go to your project dashboard
2. Click "Storage" tab
3. Click "Create Database" → "Postgres"
4. Follow wizard (auto-adds DATABASE_URL)
5. Redeploy to use new database

#### Option 2: Supabase (Free, Quick)
1. Go to https://supabase.com
2. Create new project
3. Go to Settings → Database
4. Copy "Connection string" (Transaction mode)
5. Add to Vercel as `DATABASE_URL`

#### Option 3: Neon (Serverless)
1. Go to https://neon.tech
2. Create project
3. Copy connection string
4. Add to Vercel as `DATABASE_URL`

---

### F. Click "Deploy" Button! 🚀

Vercel will:
- ✅ Install dependencies (~2 min)
- ✅ Build Next.js app (~3 min)
- ✅ Deploy to global CDN
- ✅ Give you a live URL!

---

## Step 3: Initialize Database

After deployment succeeds:

### Option A: Via Vercel Dashboard (If using Vercel Postgres)
1. Go to project → Storage → Your database
2. Click "Query" tab
3. Run Prisma push from your local terminal:

```powershell
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Pull environment variables
vercel env pull .env.production

# Push database schema
npx prisma db push

# Seed demo data
npx tsx scripts/seed-database.ts
```

### Option B: Via Local Terminal (Any database)
```powershell
# Set DATABASE_URL from Vercel env vars
$env:DATABASE_URL="your-production-database-url-here"

# Push schema
npx prisma db push

# Seed data
npx tsx scripts/seed-database.ts
```

---

## Step 4: Test Your Deployment! 🎉

Visit these URLs (replace with your actual Vercel URL):

1. **Homepage**
   ```
   https://content-accelerator.vercel.app
   ```
   Should redirect to login

2. **Login Page**
   ```
   https://content-accelerator.vercel.app/login
   ```
   Login with: `demo@example.com` / `demo123`

3. **Demo Blog Post**
   ```
   https://content-accelerator.vercel.app/blog/week-01-ai-hvac-maintenance
   ```
   Should show full blog article with SEO

4. **Robots.txt**
   ```
   https://content-accelerator.vercel.app/robots.txt
   ```
   Should show AI bot allowlist

5. **Sitemap**
   ```
   https://content-accelerator.vercel.app/sitemap.xml
   ```
   Should list blog posts

---

## 🎯 Success Checklist

- [ ] Code pushed to GitHub
- [ ] Vercel project created
- [ ] All 5 environment variables added
- [ ] Database connected (Vercel Postgres, Supabase, or Neon)
- [ ] First deployment successful
- [ ] Database schema pushed
- [ ] Demo data seeded
- [ ] Login works
- [ ] Demo blog post visible
- [ ] Dashboard accessible

---

## ⚠️ Common Issues & Fixes

### Build Fails
**Error:** "AUTH_SECRET is not defined"
- **Fix:** Add AUTH_SECRET in Vercel environment variables, then redeploy

**Error:** "Cannot find module"
- **Fix:** Check package.json has all dependencies, redeploy

### Database Connection Fails
**Error:** "Can't reach database server"
- **Fix:** Verify DATABASE_URL is correct
- **Fix:** Check database allows connections from 0.0.0.0/0

### Login Doesn't Work
**Error:** "Configuration error"
- **Fix:** Ensure AUTH_URL matches your Vercel domain exactly
- **Fix:** Regenerate AUTH_SECRET (must be 32+ characters)

### Page Not Found
**Error:** 404 on blog post
- **Fix:** Run database seed script to create demo content
- **Fix:** Check /review/ directory has demo content (should be in git)

---

## 🔄 Continuous Deployment

Now that you're connected:

```powershell
# Make changes locally
git add .
git commit -m "Update feature"
git push

# Vercel auto-deploys on every push! 🎉
```

---

## 📱 Next Steps

1. **Change Demo Password**
   - Login and change demo@example.com password

2. **Create Your First Content**
   - Go to "New Content"
   - Fill in your business details
   - Generate your first content week

3. **Invite Team Members**
   - Go to "Members"
   - Invite staff or clients

4. **Custom Domain (Optional)**
   - Vercel Dashboard → Settings → Domains
   - Add your custom domain
   - Update AUTH_URL and NEXT_PUBLIC_URL

---

## 🆘 Need Help?

**Full Deployment Guide:** See DEPLOYMENT.md
**System Documentation:** See README.md
**Quick Setup:** See QUICK-START.md

**Vercel Support:** https://vercel.com/support
**Vercel Docs:** https://vercel.com/docs

---

**🎉 You're about to be LIVE in the next 10 minutes!**

Start with Step 1 above ⬆️

