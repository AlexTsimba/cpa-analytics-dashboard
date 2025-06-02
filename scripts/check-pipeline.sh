#!/bin/bash

# Pipeline Health Check Script
# This script checks the status of the CI/CD pipeline and reports results

set -e

echo "🔍 Checking Pipeline Health..."
echo "================================"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Check if we're in a git repository
if ! git rev-parse --git-dir > /dev/null 2>&1; then
    echo -e "${RED}❌ Not in a git repository${NC}"
    exit 1
fi

# Get current branch and commit
CURRENT_BRANCH=$(git rev-parse --abbrev-ref HEAD)
CURRENT_COMMIT=$(git rev-parse --short HEAD)
LAST_COMMIT_MESSAGE=$(git log -1 --pretty=format:"%s")

echo -e "${BLUE}📍 Current Branch:${NC} $CURRENT_BRANCH"
echo -e "${BLUE}📍 Current Commit:${NC} $CURRENT_COMMIT"
echo -e "${BLUE}📍 Last Commit:${NC} $LAST_COMMIT_MESSAGE"
echo ""

# Check working directory status
if [[ -n $(git status --porcelain) ]]; then
    echo -e "${YELLOW}⚠️  Working directory has uncommitted changes${NC}"
    git status --short
    echo ""
else
    echo -e "${GREEN}✅ Working directory is clean${NC}"
fi

# Check if current commit has been pushed
if git rev-parse --verify origin/$CURRENT_BRANCH > /dev/null 2>&1; then
    LOCAL_COMMIT=$(git rev-parse HEAD)
    REMOTE_COMMIT=$(git rev-parse origin/$CURRENT_BRANCH)
    
    if [[ "$LOCAL_COMMIT" == "$REMOTE_COMMIT" ]]; then
        echo -e "${GREEN}✅ Local branch is up to date with remote${NC}"
    else
        echo -e "${YELLOW}⚠️  Local branch is ahead of remote - push required${NC}"
    fi
else
    echo -e "${YELLOW}⚠️  Remote branch not found - initial push required${NC}"
fi

echo ""

# Run local quality checks
echo -e "${BLUE}🔧 Running Local Quality Checks...${NC}"
echo "-----------------------------------"

# Type checking
echo -n "TypeScript compilation: "
if npm run type-check > /dev/null 2>&1; then
    echo -e "${GREEN}✅ PASSED${NC}"
else
    echo -e "${RED}❌ FAILED${NC}"
    echo "Run 'npm run type-check' for details"
fi

# Linting
echo -n "ESLint (strict): "
if npm run lint:strict > /dev/null 2>&1; then
    echo -e "${GREEN}✅ PASSED${NC}"
else
    echo -e "${RED}❌ FAILED${NC}"
    echo "Run 'npm run lint:strict' for details"
fi

# Formatting
echo -n "Prettier formatting: "
if npm run format:check > /dev/null 2>&1; then
    echo -e "${GREEN}✅ PASSED${NC}"
else
    echo -e "${RED}❌ FAILED${NC}"
    echo "Run 'npm run format' to fix formatting"
fi

# Unit tests
echo -n "Unit tests: "
if npm run test:run > /dev/null 2>&1; then
    echo -e "${GREEN}✅ PASSED${NC}"
else
    echo -e "${RED}❌ FAILED${NC}"
    echo "Run 'npm run test' for details"
fi

# Build test
echo -n "Build: "
if npm run build > /dev/null 2>&1; then
    echo -e "${GREEN}✅ PASSED${NC}"
else
    echo -e "${RED}❌ FAILED${NC}"
    echo "Run 'npm run build' for details"
fi

echo ""

# Check if we can check remote pipeline status
if command -v gh >/dev/null 2>&1; then
    echo -e "${BLUE}🚀 Checking Remote Pipeline Status...${NC}"
    echo "------------------------------------"
    
    # Get latest workflow runs
    if gh run list --limit 5 --json status,conclusion,workflowName,createdAt,headBranch 2>/dev/null | jq -r '.[] | "\(.workflowName): \(.status) (\(.conclusion // "running")) - \(.headBranch)"' 2>/dev/null; then
        echo ""
    else
        echo -e "${YELLOW}⚠️  GitHub CLI not authenticated or no workflows found${NC}"
    fi
else
    echo -e "${YELLOW}⚠️  GitHub CLI not installed - cannot check remote pipeline status${NC}"
    echo "Install with: brew install gh"
fi

echo ""
echo -e "${BLUE}📋 Summary${NC}"
echo "=========="
echo "All local quality checks should pass before committing."
echo "After pushing, monitor the GitHub Actions pipeline in the repository."
echo ""
echo "Commands:"
echo "  📊 Check tests: npm run test:coverage"
echo "  🔧 Fix lint: npm run lint:fix"
echo "  💅 Fix format: npm run format"
echo "  🏗️  Build: npm run build"
echo "  🧪 E2E tests: npm run test:e2e"
echo ""
echo "🎯 Ready for next development phase!"
