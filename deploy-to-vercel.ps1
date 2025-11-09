# Deploy to Vercel Script (PowerShell)
# This script helps deploy the Content Accelerator to Vercel

Write-Host "🚀 Content Accelerator - Vercel Deployment Helper" -ForegroundColor Cyan
Write-Host "==================================================" -ForegroundColor Cyan
Write-Host ""

# Check if gh CLI is installed
if (!(Get-Command gh -ErrorAction SilentlyContinue)) {
    Write-Host "❌ GitHub CLI (gh) is not installed." -ForegroundColor Red
    Write-Host "   Install it from: https://cli.github.com/" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "   Windows: winget install GitHub.cli" -ForegroundColor Yellow
    Write-Host "   Or download from: https://github.com/cli/cli/releases" -ForegroundColor Yellow
    exit 1
}

Write-Host "✅ GitHub CLI found" -ForegroundColor Green
Write-Host ""

# Check if logged in to GitHub
$authStatus = gh auth status 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "🔐 Please login to GitHub:" -ForegroundColor Yellow
    gh auth login
}

Write-Host "✅ GitHub authenticated" -ForegroundColor Green
Write-Host ""

# Get repository name
$repoName = Read-Host "📦 Enter repository name (default: content-accelerator)"
if ([string]::IsNullOrWhiteSpace($repoName)) {
    $repoName = "content-accelerator"
}

Write-Host ""
Write-Host "Creating GitHub repository and pushing code..." -ForegroundColor Yellow

# Create repository and push
gh repo create $repoName --public --source=. --remote=origin --push

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "✅ Code pushed to GitHub!" -ForegroundColor Green
    Write-Host ""
    Write-Host "📋 Next steps:" -ForegroundColor Cyan
    Write-Host "   1. Go to https://vercel.com"
    Write-Host "   2. Click 'Add New...' → 'Project'"
    Write-Host "   3. Import your GitHub repository: $repoName"
    Write-Host "   4. Add environment variables (see DEPLOYMENT.md)"
    Write-Host "   5. Deploy!"
    Write-Host ""
    Write-Host "📚 Full guide: See DEPLOYMENT.md" -ForegroundColor Cyan
} else {
    Write-Host "❌ Failed to create repository" -ForegroundColor Red
    Write-Host "   You can create it manually at: https://github.com/new"
}

