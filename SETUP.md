# 🚀 Quick Setup Guide

## Step-by-Step Installation

### 1. Install Dependencies

```bash
npm install
```

### 2. Setup PostgreSQL

Option A: **Local PostgreSQL**
```bash
# Install PostgreSQL (macOS)
brew install postgresql@15
brew services start postgresql@15

# Create database
createdb content_accelerator
```

Option B: **Docker**
```bash
docker run --name postgres-content \
  -e POSTGRES_PASSWORD=password \
  -e POSTGRES_DB=content_accelerator \
  -p 5432:5432 \
  -d postgres:15
```

Option C: **Cloud Database**
- [Vercel Postgres](https://vercel.com/docs/storage/vercel-postgres)
- [Supabase](https://supabase.com/database)
- [Neon](https://neon.tech)

### 3. Configure Environment Variables

```bash
# Copy example file
cp .env.local.example .env.local

# Generate secrets
echo "AUTH_SECRET=$(openssl rand -base64 32)" >> .env.local
echo "ENCRYPTION_KEY=$(node -e "console.log(require('crypto').randomBytes(32).toString('hex'))")" >> .env.local

# Edit .env.local and add your DATABASE_URL
```

### 4. Initialize Database

```bash
# Push Prisma schema to database
npm run db:push

# Seed with demo data
npx tsx scripts/seed-database.ts
```

### 5. Generate Demo Images (Optional)

```bash
npx tsx scripts/generate-demo-images.ts
```

This creates placeholder images in `public/images/week-01-ai-hvac-maintenance/`

### 6. Start Development Server

```bash
npm run dev
```

Visit: [http://localhost:3000](http://localhost:3000)

### 7. Login

```
Email: demo@example.com
Password: demo123
```

## 🎯 Next Steps

1. **Explore the Demo Content**
   - Go to Projects → View demo week
   - See the review page with all generated content
   - Check the public blog at `/blog/week-01-ai-hvac-maintenance`

2. **Create Your First Content Week**
   - Click "New Content"
   - Fill in your business details
   - Generate content

3. **Invite Team Members**
   - Go to Members
   - Invite staff or clients
   - Assign appropriate roles (Owner/Staff/Client)

4. **Connect Platforms** (Coming Soon)
   - Go to Settings
   - Connect social media accounts
   - Enable scheduled posting

## 🔧 Troubleshooting

### Database Connection Issues

```bash
# Test PostgreSQL connection
psql -h localhost -U postgres -d content_accelerator

# Reset database
npm run db:push -- --force-reset
npx tsx scripts/seed-database.ts
```

### Prisma Issues

```bash
# Regenerate Prisma client
npx prisma generate

# View data
npm run db:studio
```

### Auth Issues

Make sure `AUTH_SECRET` is set in `.env.local` and is at least 32 characters.

### Port Already in Use

```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9

# Or use different port
PORT=3001 npm run dev
```

## 📦 Production Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Import to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

### Manual Deployment

```bash
# Build
npm run build

# Start production server
npm start
```

## 🔐 Security Checklist

- [ ] Change default demo user password
- [ ] Set strong `AUTH_SECRET`
- [ ] Generate unique `ENCRYPTION_KEY`
- [ ] Use HTTPS in production
- [ ] Set secure `AUTH_URL`
- [ ] Enable Google OAuth (optional)
- [ ] Configure firewall for database

## 📊 Monitoring

```bash
# View Prisma logs
npm run db:studio

# Check application logs
# (in production, use your hosting provider's logs)
```

## 🆘 Getting Help

- Check `README.md` for detailed documentation
- Open an issue on GitHub
- Review Prisma docs: https://www.prisma.io/docs
- Review Next.js docs: https://nextjs.org/docs

---

Happy content generating! 🎉

