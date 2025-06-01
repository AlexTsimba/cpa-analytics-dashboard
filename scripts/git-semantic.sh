#!/bin/bash

# Git Semantic Versioning Helper Script
# This script helps maintain semantic versioning standards

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🔧 Git Semantic Versioning Helper${NC}"
echo "=================================="

# Function to validate commit message
validate_commit() {
    local message="$1"
    if echo "$message" | npx commitlint; then
        echo -e "${GREEN}✅ Commit message is valid${NC}"
        return 0
    else
        echo -e "${RED}❌ Commit message does not follow semantic versioning format${NC}"
        echo -e "${YELLOW}Expected format: type(scope): description${NC}"
        echo -e "${YELLOW}Types: feat, fix, docs, style, refactor, perf, test, chore, ci, build, revert${NC}"
        return 1
    fi
}

# Function to show conventional commit examples
show_examples() {
    echo -e "${BLUE}📝 Conventional Commit Examples:${NC}"
    echo "feat: add user authentication system"
    echo "fix: resolve login validation bug"
    echo "docs: update API documentation"
    echo "style: format code with prettier"
    echo "refactor: restructure user service"
    echo "perf: optimize database queries"
    echo "test: add unit tests for auth module"
    echo "chore: update dependencies"
    echo "ci: add GitHub Actions workflow"
    echo "build: configure webpack optimization"
    echo ""
    echo -e "${BLUE}📝 With scope examples:${NC}"
    echo "feat(auth): add OAuth integration"
    echo "fix(ui): correct button alignment"
    echo "docs(api): add endpoint documentation"
    echo ""
    echo -e "${BLUE}📝 Breaking changes:${NC}"
    echo "feat!: remove deprecated API endpoints"
    echo "feat(auth)!: change authentication method"
}

# Function to create a semantic commit
create_commit() {
    echo -e "${BLUE}🚀 Creating Semantic Commit${NC}"
    echo "Files to commit:"
    git status --porcelain
    echo ""
    
    read -p "Enter commit message: " commit_message
    
    if validate_commit "$commit_message"; then
        git add .
        git commit -m "$commit_message"
        echo -e "${GREEN}✅ Commit created successfully!${NC}"
    else
        echo -e "${RED}❌ Commit aborted due to invalid message${NC}"
        exit 1
    fi
}

# Function to check current git status
check_status() {
    echo -e "${BLUE}📊 Current Git Status:${NC}"
    git status
    echo ""
    echo -e "${BLUE}📋 Recent Commits:${NC}"
    git log --oneline -10
}

# Main menu
case "${1:-menu}" in
    "validate")
        shift
        validate_commit "$*"
        ;;
    "examples")
        show_examples
        ;;
    "commit")
        create_commit
        ;;
    "status")
        check_status
        ;;
    "menu"|*)
        echo "Available commands:"
        echo "  validate <message>  - Validate a commit message"
        echo "  examples           - Show conventional commit examples"
        echo "  commit             - Interactive commit creation"
        echo "  status             - Show git status and recent commits"
        echo ""
        echo "Usage: $0 [command]"
        ;;
esac
