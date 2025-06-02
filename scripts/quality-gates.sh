#!/bin/bash

# Quality Gates Workflow Script
# Comprehensive quality verification system for enterprise-grade development

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
WHITE='\033[1;37m'
NC='\033[0m' # No Color

# Configuration
COVERAGE_THRESHOLD=80
MAX_WARNINGS=0
REQUIRED_NODE_VERSION="18"

# Statistics tracking
TOTAL_CHECKS=0
PASSED_CHECKS=0
FAILED_CHECKS=0
WARNING_CHECKS=0

# Logging functions
log_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

log_success() {
    echo -e "${GREEN}✅ $1${NC}"
    ((PASSED_CHECKS++))
}

log_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
    ((WARNING_CHECKS++))
}

log_error() {
    echo -e "${RED}❌ $1${NC}"
    ((FAILED_CHECKS++))
}

log_header() {
    echo -e "${WHITE}$1${NC}"
    echo -e "${WHITE}$(printf '=%.0s' $(seq 1 ${#1}))${NC}"
}

# Function to run a check and track results
run_check() {
    local check_name="$1"
    local command="$2"
    local success_msg="$3"
    local error_msg="$4"
    
    ((TOTAL_CHECKS++))
    echo -n "Checking $check_name: "
    
    if eval "$command" > /dev/null 2>&1; then
        log_success "$success_msg"
        return 0
    else
        log_error "$error_msg"
        return 1
    fi
}

# Function to run a check with output capture
run_check_with_output() {
    local check_name="$1"
    local command="$2"
    local success_msg="$3"
    local error_msg="$4"
    
    ((TOTAL_CHECKS++))
    echo -n "Checking $check_name: "
    
    local output
    output=$(eval "$command" 2>&1)
    local exit_code=$?
    
    if [ $exit_code -eq 0 ]; then
        log_success "$success_msg"
        return 0
    else
        log_error "$error_msg"
        echo "$output"
        return 1
    fi
}

# Environment verification
check_environment() {
    log_header "🔍 Environment Verification"
    
    # Node.js version check
    if command -v node >/dev/null 2>&1; then
        NODE_VERSION=$(node --version | cut -d'v' -f2 | cut -d'.' -f1)
        if [ "$NODE_VERSION" -ge "$REQUIRED_NODE_VERSION" ]; then
            log_success "Node.js version: v$(node --version | cut -d'v' -f2)"
        else
            log_error "Node.js version too old. Required: v$REQUIRED_NODE_VERSION+, Found: v$(node --version | cut -d'v' -f2)"
        fi
    else
        log_error "Node.js not found"
    fi
    
    # NPM check
    run_check "NPM availability" "command -v npm" "NPM is available" "NPM not found"
    
    # Git check
    run_check "Git repository" "git rev-parse --git-dir" "Git repository detected" "Not in a git repository"
    
    # Package.json check
    run_check "package.json" "test -f package.json" "package.json exists" "package.json not found"
    
    echo ""
}

# Dependencies verification
check_dependencies() {
    log_header "📦 Dependencies Verification"
    
    # Node modules check
    run_check "Node modules" "test -d node_modules" "Dependencies installed" "Run 'npm install' first"
    
    # Lock file check
    run_check "Lock file integrity" "npm ci --dry-run" "Lock file is valid" "Lock file issues detected"
    
    # Security audit
    echo -n "Security audit: "
    AUDIT_OUTPUT=$(npm audit --audit-level=critical 2>&1)
    if echo "$AUDIT_OUTPUT" | grep -q "found 0 vulnerabilities"; then
        log_success "No critical vulnerabilities"
    elif echo "$AUDIT_OUTPUT" | grep -q "vulnerabilities"; then
        log_warning "Security vulnerabilities detected"
        echo "$AUDIT_OUTPUT"
    else
        log_success "Security audit passed"
    fi
    
    echo ""
}

# Code quality checks
check_code_quality() {
    log_header "🔧 Code Quality Verification"
    
    # TypeScript compilation
    run_check_with_output "TypeScript compilation" "npm run type-check" "TypeScript compilation successful" "TypeScript compilation failed"
    
    # ESLint strict mode
    run_check_with_output "ESLint (strict mode)" "npm run lint:strict" "No linting errors or warnings" "Linting issues detected"
    
    # Prettier formatting
    run_check_with_output "Code formatting" "npm run format:check" "Code is properly formatted" "Formatting issues detected"
    
    # Check for console.log statements (in production code)
    echo -n "Console statements check: "
    CONSOLE_COUNT=$(find src -name "*.ts" -o -name "*.tsx" | xargs grep -l "console\." | wc -l | tr -d ' ')
    if [ "$CONSOLE_COUNT" -eq 0 ]; then
        log_success "No console statements in production code"
    else
        log_warning "$CONSOLE_COUNT files contain console statements"
    fi
    
    # Check for TODO/FIXME comments
    echo -n "TODO/FIXME comments check: "
    TODO_COUNT=$(find src -name "*.ts" -o -name "*.tsx" | xargs grep -i -E "(TODO|FIXME|HACK)" | wc -l | tr -d ' ')
    if [ "$TODO_COUNT" -eq 0 ]; then
        log_success "No TODO/FIXME comments"
    else
        log_warning "$TODO_COUNT TODO/FIXME comments found"
    fi
    
    echo ""
}

# Testing verification
check_testing() {
    log_header "🧪 Testing Verification"
    
    # Unit tests
    run_check_with_output "Unit tests" "npm run test:run" "All unit tests passing" "Unit tests failed"
    
    # Test coverage
    echo -n "Test coverage: "
    COVERAGE_OUTPUT=$(npm run test:coverage 2>&1)
    COVERAGE_PERCENT=$(echo "$COVERAGE_OUTPUT" | grep -o 'All files.*|.*|.*|.*|' | tail -1 | awk -F'|' '{print $2}' | tr -d ' %' || echo "0")
    
    if [ -n "$COVERAGE_PERCENT" ] && [ "$COVERAGE_PERCENT" -ge "$COVERAGE_THRESHOLD" ]; then
        log_success "Coverage: $COVERAGE_PERCENT% (threshold: $COVERAGE_THRESHOLD%)"
    else
        log_error "Coverage: $COVERAGE_PERCENT% (below threshold: $COVERAGE_THRESHOLD%)"
    fi
    
    # Test file consistency
    echo -n "Test file consistency: "
    SRC_FILES=$(find src -name "*.ts" -o -name "*.tsx" | grep -v "\.test\." | grep -v "\.spec\." | wc -l | tr -d ' ')
    TEST_FILES=$(find . -name "*.test.*" -o -name "*.spec.*" | wc -l | tr -d ' ')
    
    if [ "$TEST_FILES" -gt 0 ]; then
        TEST_RATIO=$((TEST_FILES * 100 / SRC_FILES))
        if [ "$TEST_RATIO" -ge 50 ]; then
            log_success "Good test coverage ratio: $TEST_FILES tests for $SRC_FILES source files"
        else
            log_warning "Low test file ratio: $TEST_FILES tests for $SRC_FILES source files"
        fi
    else
        log_error "No test files found"
    fi
    
    echo ""
}

# Build verification
check_build() {
    log_header "🏗️  Build Verification"
    
    # Clean build
    echo -n "Clean build: "
    if rm -rf .next && npm run build > /dev/null 2>&1; then
        log_success "Build completed successfully"
    else
        log_error "Build failed"
    fi
    
    # Build size analysis
    if [ -d ".next" ]; then
        echo -n "Build size analysis: "
        BUILD_SIZE=$(du -sh .next 2>/dev/null | cut -f1 || echo "unknown")
        log_success "Build size: $BUILD_SIZE"
    fi
    
    # Check for build warnings
    echo -n "Build warnings check: "
    BUILD_OUTPUT=$(npm run build 2>&1)
    WARNING_COUNT=$(echo "$BUILD_OUTPUT" | grep -c "warning" || echo "0")
    if [ "$WARNING_COUNT" -eq 0 ]; then
        log_success "No build warnings"
    else
        log_warning "$WARNING_COUNT build warnings detected"
    fi
    
    echo ""
}

# Git workflow verification
check_git_workflow() {
    log_header "📝 Git Workflow Verification"
    
    # Check if we're in a clean state
    echo -n "Working directory status: "
    if [ -z "$(git status --porcelain)" ]; then
        log_success "Working directory is clean"
    else
        log_warning "Uncommitted changes detected"
        git status --short
    fi
    
    # Check branch status
    echo -n "Branch synchronization: "
    CURRENT_BRANCH=$(git rev-parse --abbrev-ref HEAD)
    if git rev-parse --verify origin/$CURRENT_BRANCH >/dev/null 2>&1; then
        LOCAL_COMMIT=$(git rev-parse HEAD)
        REMOTE_COMMIT=$(git rev-parse origin/$CURRENT_BRANCH)
        
        if [ "$LOCAL_COMMIT" = "$REMOTE_COMMIT" ]; then
            log_success "Branch is synchronized with remote"
        else
            log_warning "Branch is ahead/behind remote"
        fi
    else
        log_warning "Remote branch not found"
    fi
    
    # Check last commit message format
    echo -n "Commit message format: "
    LAST_COMMIT_MSG=$(git log -1 --pretty=format:"%s")
    if echo "$LAST_COMMIT_MSG" | grep -qE "^(feat|fix|docs|style|refactor|perf|test|chore|ci|build|revert)(\(.+\))?: .+"; then
        log_success "Conventional commit format"
    else
        log_warning "Non-conventional commit message format"
    fi
    
    echo ""
}

# Performance checks
check_performance() {
    log_header "⚡ Performance Verification"
    
    # Bundle size check
    if [ -f "package.json" ] && grep -q "analyze" package.json; then
        echo -n "Bundle analysis: "
        log_success "Bundle analyzer configured"
    else
        log_warning "Bundle analyzer not configured"
    fi
    
    # Check for performance anti-patterns
    echo -n "Performance patterns: "
    ANTIPATTERN_COUNT=0
    
    # Check for synchronous operations
    SYNC_COUNT=$(find src -name "*.ts" -o -name "*.tsx" | xargs grep -l "\.sync\|readFileSync\|writeFileSync" | wc -l | tr -d ' ')
    ANTIPATTERN_COUNT=$((ANTIPATTERN_COUNT + SYNC_COUNT))
    
    # Check for inefficient loops
    INEFFICIENT_LOOPS=$(find src -name "*.ts" -o -name "*.tsx" | xargs grep -c "for.*in.*Object\|forEach.*Object" | grep -v ":0" | wc -l | tr -d ' ')
    ANTIPATTERN_COUNT=$((ANTIPATTERN_COUNT + INEFFICIENT_LOOPS))
    
    if [ "$ANTIPATTERN_COUNT" -eq 0 ]; then
        log_success "No performance anti-patterns detected"
    else
        log_warning "$ANTIPATTERN_COUNT potential performance issues detected"
    fi
    
    echo ""
}

# Security checks
check_security() {
    log_header "🔒 Security Verification"
    
    # Environment variables check
    echo -n "Environment variables: "
    if [ -f ".env.example" ]; then
        log_success ".env.example template exists"
    else
        log_warning "No .env.example template found"
    fi
    
    # Secrets in code check
    echo -n "Secrets exposure check: "
    SECRETS_COUNT=$(find . -name "*.ts" -o -name "*.tsx" -o -name "*.js" -o -name "*.jsx" | grep -v node_modules | xargs grep -i -E "(password|secret|key|token)" | grep -v -E "(Password|Secret|Key|Token)" | wc -l | tr -d ' ')
    
    if [ "$SECRETS_COUNT" -eq 0 ]; then
        log_success "No hardcoded secrets detected"
    else
        log_warning "$SECRETS_COUNT potential hardcoded secrets detected"
    fi
    
    # Check for unsafe dependencies
    echo -n "Dependency security: "
    if npm audit --audit-level=moderate --dry-run > /dev/null 2>&1; then
        log_success "No moderate+ security vulnerabilities"
    else
        log_warning "Security vulnerabilities detected"
    fi
    
    echo ""
}

# Generate quality report
generate_report() {
    log_header "📊 Quality Gates Report"
    
    echo -e "${WHITE}Total Checks: $TOTAL_CHECKS${NC}"
    echo -e "${GREEN}Passed: $PASSED_CHECKS${NC}"
    echo -e "${YELLOW}Warnings: $WARNING_CHECKS${NC}"
    echo -e "${RED}Failed: $FAILED_CHECKS${NC}"
    echo ""
    
    SUCCESS_RATE=$((PASSED_CHECKS * 100 / TOTAL_CHECKS))
    
    echo -e "${WHITE}Success Rate: $SUCCESS_RATE%${NC}"
    
    if [ "$FAILED_CHECKS" -eq 0 ]; then
        if [ "$WARNING_CHECKS" -eq 0 ]; then
            echo -e "${GREEN}🎉 ALL QUALITY GATES PASSED! Ready for production.${NC}"
            exit 0
        else
            echo -e "${YELLOW}⚠️  Quality gates passed with warnings. Review recommended.${NC}"
            exit 0
        fi
    else
        echo -e "${RED}❌ Quality gates failed. Address issues before proceeding.${NC}"
        exit 1
    fi
}

# Main execution
main() {
    echo -e "${CYAN}"
    cat << "EOF"
╔═══════════════════════════════════════════════════════════════╗
║                    QUALITY GATES WORKFLOW                    ║
║              Enterprise-Grade Verification System            ║
╚═══════════════════════════════════════════════════════════════╝
EOF
    echo -e "${NC}"
    
    check_environment
    check_dependencies
    check_code_quality
    check_testing
    check_build
    check_git_workflow
    check_performance
    check_security
    generate_report
}

# Handle script arguments
case "${1:-all}" in
    "env"|"environment")
        check_environment
        ;;
    "deps"|"dependencies")
        check_dependencies
        ;;
    "quality"|"code")
        check_code_quality
        ;;
    "test"|"testing")
        check_testing
        ;;
    "build")
        check_build
        ;;
    "git")
        check_git_workflow
        ;;
    "perf"|"performance")
        check_performance
        ;;
    "security"|"sec")
        check_security
        ;;
    "report")
        generate_report
        ;;
    "help"|"-h"|"--help")
        echo "Usage: $0 [category]"
        echo "Categories: env, deps, quality, test, build, git, perf, security, report, all"
        exit 0
        ;;
    *)
        main
        ;;
esac
