# 🧭 AI Content Accelerator v3

A complete end-to-end system for generating SEO + AIO + GEO-optimized weekly content for local businesses with multi-tenant dashboard, seed-based content generation, and secure review workflows.

## 🚀 Features

- **Seed-Based Content Generation**: Ingest URLs, articles, or videos as inspiration
- **Multi-Tenant Dashboard**: Secure workspaces with Owner/Staff/Client roles
- **Weekly Content Packages**: Blog posts, video scripts, social media posts, email newsletters
- **SEO + AIO + GEO Optimized**: Automatic optimization for search engines and AI overviews
- **Image Generation**: Node-based generation with Sharp resizing for all platforms
- **Review & Approval Workflow**: Edit, comment, and approve before publishing
- **Smart Scheduling**: Timezone-aware posting schedules with best-time recommendations
- **Platform Support**: Facebook, Instagram, LinkedIn, GBP, TikTok, YouTube, Email

## 📦 Tech Stack

- **Framework**: Next.js 14 (App Router, TypeScript)
- **Styling**: Tailwind CSS + ShadCN UI
- **Authentication**: Auth.js (NextAuth v5)
- **Database**: Prisma + PostgreSQL
- **Image Processing**: Sharp
- **Encryption**: AES-256-GCM for API tokens
- **Deployment**: Vercel-ready

## 🛠️ Setup

### 1. Prerequisites

- Node.js 18+ and npm
- PostgreSQL database
- (Optional) Google OAuth credentials

### 2. Clone and Install

```bash
git clone <your-repo>
cd content-accelerator
npm install
```

### 3. Environment Setup

Create `.env` file:

```bash
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/content_accelerator"

# Auth.js
AUTH_SECRET="your-secret-key-min-32-chars-long"
AUTH_URL="http://localhost:3000"

# Google OAuth (optional)
GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""

# Encryption Key (32 bytes hex for AES-256)
ENCRYPTION_KEY="generate-with-node-crypto-randomBytes-32-toString-hex"

# Public URL
NEXT_PUBLIC_URL="http://localhost:3000"
```

Generate encryption key:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 4. Database Setup

```bash
# Push schema to database
npm run db:push

# Seed demo data
npx tsx scripts/seed-database.ts
```

### 5. Generate Demo Images (Optional)

```bash
npx tsx scripts/generate-demo-images.ts
```

### 6. Start Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## 🔐 Demo Credentials

```
Email: demo@example.com
Password: demo123
```

## 📂 Project Structure

```
/app
  /(dashboard)
    /login              # Login page
    /app
      /projects         # Projects dashboard
      /intake           # Content generation intake
      /review/[slug]    # Review & preview content
      /members          # Team management
      /settings         # Platform connections
  /(public-site)
    /blog/[slug]        # SSR blog posts with JSON-LD

/lib
  /aio.ts              # SEO/AIO validation
  /authz.ts            # RBAC authorization
  /crypto.ts           # Token encryption
  /db.ts               # Prisma client
  /images.ts           # Image generation & Sharp
  /keywords.ts         # Keyword optimization
  /schedule.ts         # Content scheduling
  /seed.ts             # Seed content parsing
  /strings.ts          # Text utilities

/prisma
  /schema.prisma       # Database schema

/review
  /[slug]              # Generated content weeks
    /blog.md
    /video-script.md
    /social-posts.json
    /email.md
    /schedule.json
    /validation.json
    /index.json

/components
  /ui                  # ShadCN components
```

## 🎯 Usage Workflow

### 1. Content Intake

Navigate to **New Content** and fill out:
- Seed sources (optional URLs)
- Business details
- Topic and angle
- Target platforms
- Week identifier

Click **Generate Content** to create a full content week.

### 2. Review & Edit

- View generated content in the Review page
- Check SEO/AIO validation score
- Edit blog, scripts, social posts, email
- Add comments for team collaboration
- Preview blog post as it will appear publicly

### 3. Approve & Schedule

- Review the publishing schedule (timezone-aware)
- Approve content when ready
- Schedule posts to platforms (when integrated)

### 4. Publish

- Export content for manual posting
- Or connect platforms to auto-schedule (requires platform API setup)

## 🔒 Security

- **Passwords**: Bcrypt hashed
- **API Tokens**: AES-256-GCM encrypted at rest
- **Sessions**: JWT with secure cookies
- **RBAC**: Owner/Staff/Client permissions
- **No Autoposting**: Review-first workflow

## 🎨 Customization

### Add New Platform

1. Update `IMAGE_SIZES` in `lib/images.ts`
2. Add platform to Prisma schema
3. Create platform-specific templates
4. Update intake form

### Modify Content Templates

Edit files in `/review/[slug]/` or create generators in `/lib/`

### Connect Real Image Generation

Replace stub in `lib/images.ts` with:
- DALL-E API
- Midjourney
- Stable Diffusion
- Custom service

## 📊 Content Quality Validation

Every generated content week includes:

- ✅ SEO title length (≤70 chars)
- ✅ Meta description (120-160 chars)
- ✅ Word count (800-1200)
- ✅ Keyword density (1-2%)
- ✅ H1/H2 structure
- ✅ FAQ section for AIO
- ✅ JSON-LD schema (Article + FAQPage)
- ✅ Local keywords (region-specific)
- ✅ Image alt texts
- ✅ Internal/external links

## 🌐 Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Import to Vercel
3. Add environment variables
4. Deploy!

Vercel automatically:
- Builds Next.js app
- Provisions PostgreSQL (Vercel Postgres)
- Handles serverless functions

### Other Platforms

Compatible with any Node.js hosting that supports:
- Next.js 14
- PostgreSQL
- Server-side rendering

## 🧪 Development

```bash
# Development
npm run dev

# Build
npm run build

# Start production
npm run start

# Database studio
npm run db:studio

# Lint
npm run lint
```

## 📝 License

MIT License - feel free to use for commercial projects.

## 🤝 Contributing

Contributions welcome! Please:
1. Fork the repo
2. Create a feature branch
3. Submit a PR

## 🐛 Known TODOs

- [ ] Implement real image generation API integration
- [ ] Add platform OAuth flows (Facebook, LinkedIn, etc.)
- [ ] Build actual posting automation
- [ ] Add real-time collaboration (comments, notifications)
- [ ] Implement content versioning
- [ ] Add analytics dashboard
- [ ] Create mobile app

## 📧 Support

For questions or issues, open a GitHub issue or contact [your-email].

---

Built with ❤️ using Next.js, Prisma, and AI-powered content optimization.

