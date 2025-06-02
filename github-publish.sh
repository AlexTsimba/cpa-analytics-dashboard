#!/bin/bash

# 🚀 GitHub Publication Script for CPA Analytics Dashboard
# Run this script after creating the repository manually on GitHub

echo "🚀 Starting GitHub publication process..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Repository details
REPO_NAME="cpa-analytics-dashboard"
GITHUB_USER="AlexTsimba"
REPO_URL="https://github.com/${GITHUB_USER}/${REPO_NAME}.git"

echo -e "${BLUE}Repository: ${REPO_URL}${NC}"

# Check if we're in the right directory
if [ ! -f "package.json" ] || [ ! -f "next.config.ts" ]; then
    echo -e "${RED}❌ Error: Not in the project root directory${NC}"
    echo "Please run this script from the CPA Dashboard project directory"
    exit 1
fi

# Check if git is initialized
if [ ! -d ".git" ]; then
    echo -e "${RED}❌ Error: Git not initialized${NC}"
    echo "Please run 'git init' first"
    exit 1
fi

# Check if we have commits
if ! git log --oneline -1 > /dev/null 2>&1; then
    echo -e "${RED}❌ Error: No commits found${NC}"
    echo "Please make at least one commit first"
    exit 1
fi

echo -e "${YELLOW}📋 Pre-publication checklist:${NC}"

# Run quality checks
echo "🔍 Running quality checks..."
if npm run quality; then
    echo -e "${GREEN}✅ All quality checks passed${NC}"
else
    echo -e "${RED}❌ Quality checks failed${NC}"
    echo "Please fix issues before publishing"
    exit 1
fi

echo -e "${YELLOW}⚠️  Manual step required:${NC}"
echo "1. Go to https://github.com/${GITHUB_USER}"
echo "2. Click 'New repository'"
echo "3. Repository name: ${REPO_NAME}"
echo "4. Description: Modern CPA analytics dashboard built with Next.js 15, TypeScript, and comprehensive testing infrastructure"
echo "5. Make it Public"
echo "6. Do NOT initialize with README, .gitignore, or license (we have them)"
echo "7. Click 'Create repository'"
echo ""
read -p "Press Enter when you've created the repository on GitHub..."

# Check if remote already exists
if git remote get-url origin > /dev/null 2>&1; then
    echo -e "${YELLOW}⚠️  Remote 'origin' already exists${NC}"
    echo "Current origin: $(git remote get-url origin)"
    read -p "Do you want to update it? (y/N): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        git remote set-url origin "$REPO_URL"
        echo -e "${GREEN}✅ Updated remote origin${NC}"
    fi
else
    # Add remote origin
    echo "🔗 Adding remote origin..."
    git remote add origin "$REPO_URL"
    echo -e "${GREEN}✅ Added remote origin${NC}"
fi

# Push to GitHub
echo "📤 Pushing to GitHub..."
echo "🔄 Pushing main branch..."
if git push -u origin master; then
    echo -e "${GREEN}✅ Successfully pushed main branch${NC}"
else
    echo -e "${RED}❌ Failed to push main branch${NC}"
    echo "This might be due to authentication issues or repository settings"
    exit 1
fi

# Push tags
echo "🏷️  Pushing tags..."
if git push origin --tags; then
    echo -e "${GREEN}✅ Successfully pushed tags${NC}"
else
    echo -e "${YELLOW}⚠️  Warning: Failed to push tags${NC}"
fi

# Verify publication
echo ""
echo -e "${GREEN}🎉 Publication completed successfully!${NC}"
echo ""
echo -e "${BLUE}📊 Repository Information:${NC}"
echo "🔗 Repository URL: https://github.com/${GITHUB_USER}/${REPO_NAME}"
echo "📁 Clone URL: ${REPO_URL}"
echo "🏷️  Latest tag: $(git describe --tags --abbrev=0 2>/dev/null || echo 'v0.1.0')"
echo "📝 Commits: $(git rev-list --count HEAD)"
echo ""

echo -e "${YELLOW}📋 Next steps:${NC}"
echo "1. 🔧 Configure repository settings:"
echo "   - Go to Settings > Branches > Add rule for 'master'"
echo "   - Enable branch protection rules"
echo "   - Add required status checks"
echo ""
echo "2. 🏷️  Add repository topics:"
echo "   - nextjs, typescript, react, tailwindcss, playwright"
echo "   - analytics, dashboard, cpa, testing"
echo ""
echo "3. 🚀 Set up deployment:"
echo "   - Connect to Vercel for automatic deployments"
echo "   - Configure environment variables"
echo ""
echo "4. 📢 Share your project:"
echo "   - Update badges in README with correct repository URL"
echo "   - Share on social media and developer communities"
echo ""

echo -e "${GREEN}✨ Your CPA Analytics Dashboard is now live on GitHub! ✨${NC}"
echo "🌟 Don't forget to star your own repository! 😄"
