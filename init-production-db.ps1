# Initialize Production Database
# Run this after Vercel deployment succeeds

Write-Host "🗄️  Initializing Production Database" -ForegroundColor Cyan
Write-Host "====================================`n" -ForegroundColor Cyan

# Get DATABASE_URL from user
Write-Host "📋 Get your DATABASE_URL from:" -ForegroundColor Yellow
Write-Host "   - Vercel Dashboard → Your Project → Settings → Environment Variables" -ForegroundColor White
Write-Host "   - Or from your database provider (Supabase/Neon)`n" -ForegroundColor White

$dbUrl = Read-Host "Paste your DATABASE_URL here"

if ([string]::IsNullOrWhiteSpace($dbUrl)) {
    Write-Host "❌ No DATABASE_URL provided. Exiting." -ForegroundColor Red
    exit 1
}

Write-Host "`n🔧 Setting environment variable..." -ForegroundColor Yellow
$env:DATABASE_URL = $dbUrl

Write-Host "📊 Pushing Prisma schema..." -ForegroundColor Yellow
npx prisma db push

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Schema pushed successfully!`n" -ForegroundColor Green
    
    Write-Host "🌱 Seeding demo data..." -ForegroundColor Yellow
    npx tsx scripts/seed-database.ts
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "`n🎉 Database initialized successfully!" -ForegroundColor Green
        Write-Host "`n📋 Demo login credentials:" -ForegroundColor Cyan
        Write-Host "   Email: demo@example.com" -ForegroundColor White
        Write-Host "   Password: demo123" -ForegroundColor White
        Write-Host "`n🌐 Your app is ready at your Vercel URL!" -ForegroundColor Green
    } else {
        Write-Host "❌ Failed to seed database" -ForegroundColor Red
    }
} else {
    Write-Host "❌ Failed to push schema" -ForegroundColor Red
}

