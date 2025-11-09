# ⚡ Quick Start - Copy & Paste Commands

## 🚀 Get Running in 5 Minutes

### Step 1: Setup Environment
```bash
# Install dependencies
npm install

# Create environment file
cat > .env.local << 'EOF'
DATABASE_URL="postgresql://postgres:password@localhost:5432/content_accelerator"
AUTH_SECRET="$(openssl rand -base64 32)"
AUTH_URL="http://localhost:3000"
ENCRYPTION_KEY="$(node -e "console.log(require('crypto').randomBytes(32).toString('hex'))")"
NEXT_PUBLIC_URL="http://localhost:3000"
NODE_ENV="development"
EOF
```

### Step 2: Database Setup

**Option A: Use Docker (Recommended)**
```bash
# Start PostgreSQL in Docker
docker run --name postgres-content \
  -e POSTGRES_PASSWORD=password \
  -e POSTGRES_DB=content_accelerator \
  -p 5432:5432 \
  -d postgres:15

# Wait 5 seconds for startup
sleep 5

# Initialize database
npm run db:push
npx tsx scripts/seed-database.ts
```

**Option B: Use Existing PostgreSQL**
```bash
# Create database
createdb content_accelerator

# Initialize
npm run db:push
npx tsx scripts/seed-database.ts
```

### Step 3: Generate Demo Images (Optional)
```bash
npx tsx scripts/generate-demo-images.ts
```

### Step 4: Start Development Server
```bash
npm run dev
```

### Step 5: Login
Open [http://localhost:3000](http://localhost:3000)

```
Email: demo@example.com
Password: demo123
```

---

## 🎯 Explore the System

### View Demo Content
1. Dashboard → Projects
2. Click on "Bay Area HVAC Pro"
3. Click on "AI-Powered Predictive Maintenance"
4. Explore all generated assets

### View Public Blog
Visit: [http://localhost:3000/blog/week-01-ai-hvac-maintenance](http://localhost:3000/blog/week-01-ai-hvac-maintenance)

### Create New Content
1. Click "New Content" in sidebar
2. Fill in business details
3. Add topic and keywords
4. Select platforms
5. Click "Generate Content"

---

## 🔧 Useful Commands

```bash
# Development
npm run dev              # Start dev server
npm run build            # Build for production
npm run start            # Start production server

# Database
npm run db:push          # Update database schema
npm run db:studio        # Open Prisma Studio GUI
npx tsx scripts/seed-database.ts  # Reset demo data

# Images
npx tsx scripts/generate-demo-images.ts  # Generate demo images

# Lint
npm run lint             # Check for errors
```

---

## 🛑 Troubleshooting

### Port 3000 in use?
```bash
# Use different port
PORT=3001 npm run dev
```

### Database connection failed?
```bash
# Check PostgreSQL is running
docker ps                # If using Docker
pg_isready               # If using local PostgreSQL

# Reset database
npm run db:push -- --force-reset
npx tsx scripts/seed-database.ts
```

### Auth not working?
```bash
# Regenerate AUTH_SECRET
echo "AUTH_SECRET=\"$(openssl rand -base64 32)\"" >> .env.local
```

### Can't see demo content?
```bash
# Reseed database
npx tsx scripts/seed-database.ts
```

---

## 📦 What You Get

After running these commands, you'll have:

✅ Full Next.js application running
✅ PostgreSQL database with demo data
✅ Demo workspace "Bay Area HVAC Pro"
✅ Demo content week with:
   - Blog article (1184 words)
   - Video scripts (main + 5 shorts)
   - 11 social media posts
   - Email newsletter
   - Publishing schedule
   - Validation score: 92/100
✅ Demo user account (demo@example.com)
✅ All dashboard features functional

---

## 🎓 Next Steps

1. **Explore Demo Content**
   - Review the AI HVAC article
   - Check validation scores
   - View the publishing schedule

2. **Customize for Your Business**
   - Create new workspace
   - Add your business details
   - Generate your first content week

3. **Invite Team Members**
   - Go to Members page
   - Invite colleagues
   - Assign roles (Owner/Staff/Client)

4. **Connect Platforms (Future)**
   - Go to Settings
   - Add platform API keys
   - Enable scheduled posting

---

## 📚 Documentation

- `README.md` - Complete documentation
- `SETUP.md` - Detailed setup guide
- `PROJECT-SUMMARY.md` - System overview
- `VALIDATION-CHECKLIST.md` - Requirements validation

---

## 🆘 Need Help?

- Check documentation files above
- Review Prisma Studio: `npm run db:studio`
- Check logs in terminal
- Verify environment variables in `.env.local`

---

**You're all set! Start generating content! 🚀**

