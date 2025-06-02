# Development Workflow Guide

## 🔄 Recommended Development Process

### 1. Before Starting Work on a Task

```bash
# Check current pipeline health
npm run pipeline:check

# Pull latest changes
git pull origin master

# Create feature branch (if needed)
git checkout -b feature/task-description
```

### 2. During Development

```bash
# Run tests while developing
npm run test:watch

# Check code quality frequently
npm run type-check
npm run lint:check
npm run format:check
```

### 3. Before Committing

```bash
# Run comprehensive quality check
npm run quality

# Check if ready for release
npm run release:ready

# Interactive commit with semantic versioning
npm run commit:interactive
```

### 4. After Committing

```bash
# Push changes
git push origin your-branch

# Check pipeline status
npm run pipeline:health

# Monitor GitHub Actions in browser
# https://github.com/your-repo/actions
```

### 5. Verification Steps

#### ✅ Local Verification (Required)

- [ ] TypeScript compilation passes
- [ ] ESLint strict mode passes
- [ ] Prettier formatting correct
- [ ] Unit tests pass with coverage ≥80%
- [ ] Build succeeds
- [ ] E2E tests pass (for major changes)

#### ✅ CI/CD Pipeline Verification (Monitor)

- [ ] Quality checks job passes
- [ ] E2E tests job passes
- [ ] Security scan passes
- [ ] Build artifacts created
- [ ] No deployment errors

### 6. Moving to Next Task

**Only proceed to the next task after:**

1. ✅ All local quality checks pass
2. ✅ Git commit successful with semantic versioning
3. ✅ Push to remote successful
4. ✅ GitHub Actions pipeline passes all jobs
5. ✅ No deployment errors
6. ✅ Application builds and runs correctly

## 🚀 Commands Reference

### Quality & Testing

```bash
npm run quality          # Full quality gate check
npm run pipeline:check   # Local pipeline health check
npm run deploy:check     # Pre-deployment verification
npm run release:ready    # Complete release readiness check
```

### Testing

```bash
npm run test            # Interactive test runner
npm run test:coverage   # Run tests with coverage report
npm run test:e2e        # End-to-end tests
npm run test:e2e:ui     # E2E tests with UI
```

### Code Quality

```bash
npm run type-check      # TypeScript compilation check
npm run lint:strict     # Strict linting (no warnings)
npm run lint:fix        # Auto-fix linting issues
npm run format          # Auto-format code
npm run format:check    # Check formatting without changes
```

### Git & Commits

```bash
npm run commit:interactive  # Interactive semantic commit
npm run commit:help        # Show commit format examples
npm run commit:validate    # Validate last commit message
npm run git:status         # Enhanced git status
```

## 🔍 Pipeline Status Monitoring

### GitHub Actions Dashboard

Monitor your pipeline at: `https://github.com/[username]/cpa-analytics-dashboard/actions`

### Key Pipeline Jobs

1. **Quality Checks** - Type checking, linting, formatting, unit tests
2. **E2E Tests** - End-to-end testing with Playwright
3. **Security Scan** - Security audit and CodeQL analysis
4. **Deployment** - Preview deployment for PRs, production for master

### Pipeline Health Indicators

- 🟢 **All Green** - Safe to proceed to next task
- 🟡 **Some Warnings** - Review and fix before proceeding
- 🔴 **Failures** - Must fix before any new development

## 🛠️ Troubleshooting

### Common Issues

#### Build Failures

```bash
# Clear cache and reinstall
rm -rf .next node_modules package-lock.json
npm install
npm run build
```

#### Test Failures

```bash
# Update test snapshots
npm run test -- --update-snapshots

# Run specific test
npm run test -- tests/specific-test.test.ts
```

#### Linting Errors

```bash
# Auto-fix most issues
npm run lint:fix
npm run format

# Check remaining issues
npm run lint:strict
```

### Pipeline Failures

#### Quality Checks Failed

1. Run `npm run quality` locally
2. Fix all reported issues
3. Commit fixes
4. Push and monitor pipeline

#### E2E Tests Failed

1. Run `npm run test:e2e:ui` to debug
2. Check Playwright report
3. Fix failing tests
4. Re-run pipeline

#### Security Scan Issues

1. Check `npm audit` output
2. Update vulnerable dependencies
3. Review CodeQL findings
4. Apply security fixes

## 📋 Task Completion Checklist

Before marking any task as complete:

- [ ] All acceptance criteria met
- [ ] Code properly tested (unit + integration)
- [ ] Documentation updated
- [ ] No console errors or warnings
- [ ] Performance impact assessed
- [ ] Accessibility requirements met
- [ ] All quality gates passed
- [ ] Pipeline fully green
- [ ] Application deployed successfully

## 🎯 Ready for Next Phase

When all verification steps are complete, you can confidently move to the next development task knowing that:

- Code quality is maintained
- All tests are passing
- Security standards are met
- Deployment pipeline is healthy
- Application is production-ready

This systematic approach ensures reliable, high-quality deliveries and maintains project momentum.
