# 🚀 Vercel Deployment Guide

## Prerequisites

1. **GitHub Account**: [Sign up](https://github.com/signup) if you don't have one
2. **Vercel Account**: [Sign up](https://vercel.com/signup) (use GitHub to sign in)
3. **Git installed**: Check with `git --version`

---

## Step 1: Initialize Git Repository

```bash
# Initialize git (if not already done)
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit - AI Content Accelerator v3"
```

---

## Step 2: Create GitHub Repository

### Option A: Via GitHub CLI (Recommended)
```bash
# Install GitHub CLI if needed
# macOS: brew install gh
# Windows: winget install GitHub.cli

# Login
gh auth login

# Create repository
gh repo create content-accelerator --public --source=. --remote=origin --push
```

### Option B: Via GitHub Web UI
1. Go to [github.com/new](https://github.com/new)
2. Repository name: `content-accelerator`
3. Choose Public or Private
4. **Do NOT** initialize with README, .gitignore, or license
5. Click "Create repository"
6. Follow the "push an existing repository" commands:

```bash
git remote add origin https://github.com/YOUR-USERNAME/content-accelerator.git
git branch -M main
git push -u origin main
```

---

## Step 3: Deploy to Vercel

### Option A: Vercel CLI (Fastest)
```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel

# Follow prompts:
# - Link to existing project? No
# - Project name: content-accelerator
# - Directory: ./
# - Override settings? No
```

### Option B: Vercel Dashboard (Visual)

1. **Go to [vercel.com](https://vercel.com) and sign in**

2. **Click "Add New..." → Project**

3. **Import Git Repository**
   - Select your GitHub account
   - Find `content-accelerator`
   - Click "Import"

4. **Configure Project**
   - Framework Preset: **Next.js** (auto-detected)
   - Root Directory: `./`
   - Build Command: `npm run build` (default)
   - Output Directory: `.next` (default)

5. **Environment Variables** (CRITICAL)
   Click "Environment Variables" and add these:

   ```
   DATABASE_URL
   postgresql://username:password@host:5432/dbname
   
   AUTH_SECRET
   [Generate new: openssl rand -base64 32]
   
   AUTH_URL
   https://your-app-name.vercel.app
   
   ENCRYPTION_KEY
   [Generate new: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"]
   
   NEXT_PUBLIC_URL
   https://your-app-name.vercel.app
   
   NODE_ENV
   production
   ```

   **Optional (for Google OAuth):**
   ```
   GOOGLE_CLIENT_ID
   [Your Google OAuth Client ID]
   
   GOOGLE_CLIENT_SECRET
   [Your Google OAuth Client Secret]
   ```

6. **Click "Deploy"**

---

## Step 4: Setup Production Database

Vercel needs a production PostgreSQL database. Choose one:

### Option A: Vercel Postgres (Easiest)

1. In Vercel dashboard, go to your project
2. Click "Storage" tab
3. Click "Create Database"
4. Select "Postgres"
5. Follow wizard
6. Database URL will be automatically added to environment variables

### Option B: Supabase (Free Tier)

1. Go to [supabase.com](https://supabase.com)
2. Create new project
3. Get connection string from Settings → Database
4. Add to Vercel environment variables as `DATABASE_URL`

### Option C: Neon (Serverless Postgres)

1. Go to [neon.tech](https://neon.tech)
2. Create project
3. Copy connection string
4. Add to Vercel environment variables as `DATABASE_URL`

### Option D: Railway (Generous Free Tier)

1. Go to [railway.app](https://railway.app)
2. New Project → Provision PostgreSQL
3. Copy connection string
4. Add to Vercel environment variables as `DATABASE_URL`

---

## Step 5: Initialize Production Database

Once deployed with DATABASE_URL:

### Via Vercel CLI:
```bash
# Install dependencies in Vercel environment
vercel env pull .env.production

# Run Prisma push
DATABASE_URL="your-production-url" npx prisma db push

# Seed database
DATABASE_URL="your-production-url" npx tsx scripts/seed-database.ts
```

### Or trigger via Vercel Functions:
Create a one-time initialization endpoint (then delete it):

**Create `app/api/init/route.ts`:**
```typescript
import { prisma } from '@/lib/db';
import { hash } from 'bcryptjs';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  // Add authentication check here!
  const { secret } = await req.json();
  
  if (secret !== process.env.INIT_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Run seed logic
  const user = await prisma.user.create({
    data: {
      email: 'admin@example.com',
      name: 'Admin User',
      password: await hash('change-me-123', 10),
    },
  });

  return NextResponse.json({ success: true, userId: user.id });
}
```

Then call it once:
```bash
curl -X POST https://your-app.vercel.app/api/init \
  -H "Content-Type: application/json" \
  -d '{"secret":"your-init-secret"}'
```

**Then delete the route file for security!**

---

## Step 6: Configure Google OAuth (Optional)

1. **Go to [Google Cloud Console](https://console.cloud.google.com)**

2. **Create/Select Project**

3. **Enable Google+ API**
   - APIs & Services → Enable APIs
   - Search "Google+ API"
   - Enable

4. **Create OAuth Credentials**
   - APIs & Services → Credentials
   - Create Credentials → OAuth client ID
   - Application type: Web application
   - Name: Content Accelerator
   - Authorized redirect URIs:
     ```
     https://your-app.vercel.app/api/auth/callback/google
     ```
   - Copy Client ID and Client Secret

5. **Add to Vercel Environment Variables**
   - `GOOGLE_CLIENT_ID`
   - `GOOGLE_CLIENT_SECRET`

6. **Redeploy** (Vercel will auto-redeploy on env change)

---

## Step 7: Verify Deployment

### Check these URLs:

1. **Homepage**: `https://your-app.vercel.app`
   - Should redirect to `/app/projects` or `/login`

2. **Login**: `https://your-app.vercel.app/login`
   - Test login with seeded credentials

3. **Blog**: `https://your-app.vercel.app/blog/week-01-ai-hvac-maintenance`
   - Check SSR is working
   - View page source - should see full HTML

4. **API**: `https://your-app.vercel.app/api/auth/providers`
   - Should return JSON with providers

5. **Robots**: `https://your-app.vercel.app/robots.txt`
   - Should show AI bot allowlist

6. **Sitemap**: `https://your-app.vercel.app/sitemap.xml`
   - Should list blog posts

---

## Troubleshooting

### Build Fails

**Error: "Cannot find module 'prisma'"**
```bash
# Add postinstall script to package.json (already included)
"postinstall": "prisma generate"
```

**Error: "MODULE_NOT_FOUND"**
- Check all imports use `@/` alias correctly
- Verify `tsconfig.json` paths are correct

### Database Connection Issues

**Error: "Can't reach database server"**
- Verify `DATABASE_URL` in Vercel environment variables
- Check database allows connections from Vercel IPs (0.0.0.0/0 for testing)
- Ensure connection string includes `?schema=public`

**Error: "Prisma schema not found"**
```bash
# In vercel CLI or build command
npx prisma generate
```

### Auth Issues

**Error: "AUTH_SECRET not defined"**
- Add `AUTH_SECRET` to Vercel environment variables
- Must be at least 32 characters

**Google OAuth not working**
- Check redirect URI matches exactly
- Include `/api/auth/callback/google`
- Verify `AUTH_URL` matches your Vercel domain

### Missing Environment Variables

If deployment succeeds but app crashes:
1. Go to Vercel Dashboard → Your Project → Settings → Environment Variables
2. Verify all required variables are set
3. Redeploy: Settings → Deployments → Click "..." → Redeploy

---

## Continuous Deployment

Now that you're connected:

```bash
# Make changes locally
git add .
git commit -m "Your changes"
git push

# Vercel automatically deploys on push to main!
```

### Preview Deployments

Every branch and PR gets a preview URL:
```bash
git checkout -b new-feature
git push origin new-feature
# Vercel creates preview at: https://content-accelerator-git-new-feature-username.vercel.app
```

---

## Custom Domain (Optional)

1. Go to Vercel Dashboard → Your Project → Settings → Domains
2. Add your domain: `mycontentapp.com`
3. Follow DNS configuration instructions
4. Update `AUTH_URL` and `NEXT_PUBLIC_URL` environment variables
5. Redeploy

---

## Monitoring & Logs

### View Logs
```bash
vercel logs https://your-app.vercel.app
```

### Or in Dashboard:
1. Vercel Dashboard → Your Project
2. Click "Deployments"
3. Click latest deployment
4. View "Build Logs" and "Function Logs"

### Analytics
- Vercel Dashboard → Your Project → Analytics
- See page views, performance, Web Vitals

---

## Production Checklist

Before going live:

- [ ] All environment variables set in Vercel
- [ ] Production database configured and seeded
- [ ] `AUTH_URL` and `NEXT_PUBLIC_URL` match your domain
- [ ] Google OAuth configured (if using)
- [ ] Test login flow
- [ ] Test content generation
- [ ] Verify blog posts render (SSR)
- [ ] Check robots.txt and sitemap
- [ ] Review Vercel Analytics
- [ ] Set up custom domain (optional)
- [ ] Configure error monitoring (Sentry, etc.)

---

## Cost Estimate

### Vercel
- **Hobby (Free)**: 
  - 100GB bandwidth/month
  - 100 hours serverless function execution
  - Perfect for testing & small projects

- **Pro ($20/month)**:
  - 1TB bandwidth
  - 1000 hours execution
  - Team collaboration
  - Better for production

### Database
- **Vercel Postgres**: $0.10/GB storage + compute
- **Supabase Free**: 500MB database, 2GB bandwidth
- **Neon Free**: 3GB storage, autoscaling
- **Railway**: $5/month for small database

**Typical small business**: $5-20/month total

---

## Next Steps After Deployment

1. **Remove demo user**: Delete or change demo@example.com password
2. **Create real admin account**
3. **Invite team members**
4. **Create your first real content week**
5. **Set up real image generation API** (DALL-E, Midjourney)
6. **Connect social media platforms** (OAuth flows)
7. **Enable monitoring** (Sentry, LogRocket)

---

## Support

- **Vercel Docs**: https://vercel.com/docs
- **Vercel Support**: https://vercel.com/support
- **This Project**: Check README.md and other docs

---

🎉 **Your app is now live on Vercel!**

