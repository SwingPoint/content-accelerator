#!/bin/bash

# Deploy to Vercel Script
# This script helps deploy the Content Accelerator to Vercel

echo "🚀 Content Accelerator - Vercel Deployment Helper"
echo "=================================================="
echo ""

# Check if gh CLI is installed
if ! command -v gh &> /dev/null; then
    echo "❌ GitHub CLI (gh) is not installed."
    echo "   Install it from: https://cli.github.com/"
    echo ""
    echo "   macOS:   brew install gh"
    echo "   Windows: winget install GitHub.cli"
    echo "   Linux:   See https://github.com/cli/cli/blob/trunk/docs/install_linux.md"
    exit 1
fi

echo "✅ GitHub CLI found"
echo ""

# Check if logged in to GitHub
if ! gh auth status &> /dev/null; then
    echo "🔐 Please login to GitHub:"
    gh auth login
fi

echo "✅ GitHub authenticated"
echo ""

# Get repository name
read -p "📦 Enter repository name (default: content-accelerator): " REPO_NAME
REPO_NAME=${REPO_NAME:-content-accelerator}

echo ""
echo "Creating GitHub repository and pushing code..."

# Create repository and push
gh repo create "$REPO_NAME" --public --source=. --remote=origin --push

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Code pushed to GitHub!"
    echo ""
    echo "📋 Next steps:"
    echo "   1. Go to https://vercel.com"
    echo "   2. Click 'Add New...' → 'Project'"
    echo "   3. Import your GitHub repository: $REPO_NAME"
    echo "   4. Add environment variables (see DEPLOYMENT.md)"
    echo "   5. Deploy!"
    echo ""
    echo "📚 Full guide: See DEPLOYMENT.md"
else
    echo "❌ Failed to create repository"
    echo "   You can create it manually at: https://github.com/new"
fi

