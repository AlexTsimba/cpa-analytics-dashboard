# Manual Testing Instructions

## 📋 Overview

This document provides comprehensive manual testing instructions for the CPA Analytics Dashboard project. These instructions ensure that all key functionality works correctly across different environments and scenarios.

## 🎯 Testing Scope

### Core Areas to Test

1. **Application Startup & Configuration**
2. **Development Environment**
3. **Build & Production Environment**
4. **Quality Gates & CI/CD Pipeline**
5. **Git Workflow & Hooks**
6. **Error Handling & Edge Cases**
7. **Performance & Accessibility**
8. **Cross-Browser Compatibility**

## 🚀 Pre-Testing Setup

### Prerequisites Checklist

- [ ] Node.js 18+ installed
- [ ] npm/yarn package manager available
- [ ] Git configured with semantic commit settings
- [ ] Modern browser (Chrome, Firefox, Safari, Edge)
- [ ] Terminal access for command execution

### Environment Setup

```bash
# 1. Clone the repository
git clone <repository-url>
cd cpa-analytics-dashboard

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.example .env.local
# Edit .env.local with appropriate values

# 4. Verify installation
npm run pipeline:check
```

## 🧪 Manual Test Cases

### 1. Application Startup Testing

#### Test Case 1.1: Development Server

**Objective**: Verify development server starts correctly
**Steps**:

1. Run `npm run dev`
2. Wait for server to start (should show "Local: http://localhost:3000")
3. Open browser to http://localhost:3000
4. Verify homepage loads without errors

**Expected Results**:

- [ ] Server starts within 30 seconds
- [ ] No console errors in terminal
- [ ] Homepage displays correctly
- [ ] Hot reload works when editing files

**Edge Cases to Test**:

- [ ] Start server on different port (`npm run dev -- -p 3001`)
- [ ] Restart server multiple times
- [ ] Start with missing dependencies (temporarily rename node_modules)

#### Test Case 1.2: Production Build

**Objective**: Verify production build works correctly
**Steps**:

1. Run `npm run build`
2. Wait for build completion
3. Run `npm run start`
4. Open browser to http://localhost:3000

**Expected Results**:

- [ ] Build completes without errors
- [ ] Build size is reasonable (<5MB)
- [ ] Production server starts correctly
- [ ] All pages load in production mode

### 2. Environment Variables Testing

#### Test Case 2.1: Environment Configuration

**Objective**: Verify environment variables load correctly
**Steps**:

1. Navigate to http://localhost:3000/test-env
2. Review displayed configuration
3. Check browser console for errors
4. Verify all required variables are present

**Expected Results**:

- [ ] Page loads without errors
- [ ] All environment variables display correctly
- [ ] Feature flags show expected values
- [ ] No missing variable errors in console

#### Test Case 2.2: Missing Environment Variables

**Objective**: Test graceful handling of missing variables
**Steps**:

1. Temporarily rename .env.local
2. Restart development server
3. Navigate to test environment page
4. Check error handling

**Expected Results**:

- [ ] Application doesn't crash
- [ ] Appropriate error messages displayed
- [ ] Fallback values used where appropriate

### 3. Quality Gates Testing

#### Test Case 3.1: Pre-commit Hooks

**Objective**: Verify git hooks enforce quality standards
**Steps**:

1. Make a small change to a TypeScript file
2. Introduce a linting error (e.g., unused variable)
3. Attempt to commit: `git add . && git commit -m "test commit"`
4. Observe hook behavior

**Expected Results**:

- [ ] Pre-commit hook runs automatically
- [ ] Commit is blocked due to linting error
- [ ] Clear error message displayed
- [ ] Instructions provided to fix issues

#### Test Case 3.2: Quality Gates Script

**Objective**: Test comprehensive quality verification
**Steps**:

1. Run `npm run quality:gates`
2. Review output for each category
3. Test individual categories: `npm run quality:gates:code`
4. Verify success/failure reporting

**Expected Results**:

- [ ] All quality categories execute
- [ ] Clear pass/fail indicators
- [ ] Detailed diagnostics for failures
- [ ] Success rate calculated correctly

### 4. Testing Infrastructure Testing

#### Test Case 4.1: Unit Tests

**Objective**: Verify unit testing works correctly
**Steps**:

1. Run `npm run test`
2. Run `npm run test:coverage`
3. Review coverage report
4. Run specific test: `npm run test -- tests/unit/env.test.ts`

**Expected Results**:

- [ ] All tests pass
- [ ] Coverage meets 80% threshold
- [ ] Coverage report generates correctly
- [ ] Individual test execution works

#### Test Case 4.2: End-to-End Tests

**Objective**: Verify E2E testing works correctly
**Steps**:

1. Run `npm run test:e2e`
2. Observe browser automation
3. Review test report
4. Run with UI: `npm run test:e2e:ui`

**Expected Results**:

- [ ] E2E tests execute across browsers
- [ ] All critical user flows pass
- [ ] Test report generates
- [ ] UI mode works for debugging

### 5. Build & Deployment Testing

#### Test Case 5.1: TypeScript Compilation

**Objective**: Verify TypeScript compiles correctly
**Steps**:

1. Run `npm run type-check`
2. Introduce a type error
3. Run type check again
4. Fix error and verify

**Expected Results**:

- [ ] Clean compilation with no errors
- [ ] Type errors detected and reported
- [ ] Error messages are helpful
- [ ] Fixed errors resolve correctly

#### Test Case 5.2: Code Formatting

**Objective**: Verify code formatting works
**Steps**:

1. Run `npm run format:check`
2. Introduce formatting issues
3. Run `npm run format`
4. Verify formatting applied

**Expected Results**:

- [ ] Formatting check detects issues
- [ ] Auto-format fixes issues
- [ ] Consistent formatting applied
- [ ] No formatting conflicts

### 6. Error Handling Testing

#### Test Case 6.1: Network Errors

**Objective**: Test handling of network failures
**Steps**:

1. Start application
2. Simulate network disconnection
3. Test application behavior
4. Restore connection and verify recovery

**Expected Results**:

- [ ] Graceful degradation during network issues
- [ ] Appropriate error messages
- [ ] Recovery when connection restored
- [ ] No application crashes

#### Test Case 6.2: Invalid Input Handling

**Objective**: Test input validation and error boundaries
**Steps**:

1. Navigate to forms/input fields
2. Enter invalid data
3. Submit forms with missing required fields
4. Test edge cases (very long inputs, special characters)

**Expected Results**:

- [ ] Input validation works correctly
- [ ] Clear error messages displayed
- [ ] Forms prevent invalid submissions
- [ ] Error boundaries catch component errors

### 7. Performance Testing

#### Test Case 7.1: Page Load Performance

**Objective**: Verify acceptable page load times
**Steps**:

1. Open Chrome DevTools
2. Navigate to Network tab
3. Reload homepage
4. Measure load times and resource sizes

**Expected Results**:

- [ ] Initial page load < 3 seconds
- [ ] Total bundle size reasonable
- [ ] Critical resources load first
- [ ] Progressive loading works

#### Test Case 7.2: Memory Usage

**Objective**: Test for memory leaks
**Steps**:

1. Open Chrome DevTools > Memory tab
2. Navigate between pages multiple times
3. Force garbage collection
4. Monitor memory usage

**Expected Results**:

- [ ] Memory usage stays reasonable
- [ ] No significant memory leaks
- [ ] Garbage collection works effectively
- [ ] Performance doesn't degrade over time

### 8. Cross-Browser Testing

#### Test Case 8.1: Browser Compatibility

**Objective**: Verify functionality across browsers
**Steps**:

1. Test in Chrome (latest)
2. Test in Firefox (latest)
3. Test in Safari (if available)
4. Test in Edge (latest)

**Expected Results**:

- [ ] Core functionality works in all browsers
- [ ] Styling displays correctly
- [ ] JavaScript features work
- [ ] No browser-specific errors

#### Test Case 8.2: Mobile Responsiveness

**Objective**: Test mobile device compatibility
**Steps**:

1. Open Chrome DevTools
2. Enable device simulation
3. Test various screen sizes
4. Test touch interactions

**Expected Results**:

- [ ] Layout adapts to screen sizes
- [ ] Touch interactions work
- [ ] Text remains readable
- [ ] Navigation works on mobile

### 9. Accessibility Testing

#### Test Case 9.1: Keyboard Navigation

**Objective**: Verify keyboard accessibility
**Steps**:

1. Navigate using only Tab key
2. Test Enter/Space for activation
3. Verify focus indicators
4. Test Escape key behavior

**Expected Results**:

- [ ] All interactive elements reachable via keyboard
- [ ] Clear focus indicators visible
- [ ] Logical tab order maintained
- [ ] Keyboard shortcuts work

#### Test Case 9.2: Screen Reader Compatibility

**Objective**: Test screen reader support
**Steps**:

1. Enable screen reader (VoiceOver on Mac, NVDA on Windows)
2. Navigate through the application
3. Verify content is read correctly
4. Test form labels and descriptions

**Expected Results**:

- [ ] Content read in logical order
- [ ] Form labels associated correctly
- [ ] Interactive elements announced properly
- [ ] No accessibility errors in console

## 📊 Test Execution Checklist

### Pre-Testing Checklist

- [ ] Environment setup completed
- [ ] All dependencies installed
- [ ] Environment variables configured
- [ ] Git configuration verified

### Core Functionality Tests

- [ ] Application startup (dev and prod)
- [ ] Environment variable handling
- [ ] Quality gates execution
- [ ] Testing infrastructure
- [ ] Build and compilation
- [ ] Error handling

### Quality Assurance Tests

- [ ] Performance testing
- [ ] Cross-browser compatibility
- [ ] Mobile responsiveness
- [ ] Accessibility compliance

### Edge Case Tests

- [ ] Network failure scenarios
- [ ] Invalid input handling
- [ ] Memory leak testing
- [ ] Concurrent user simulation

## 🚨 Issue Reporting

### Bug Report Template

When issues are found, report using this template:

```markdown
## Bug Report

**Environment**:

- OS: [Windows/Mac/Linux]
- Browser: [Chrome/Firefox/Safari/Edge] version
- Node.js version:
- npm version:

**Steps to Reproduce**:

1. Step 1
2. Step 2
3. Step 3

**Expected Behavior**:
Description of what should happen

**Actual Behavior**:
Description of what actually happens

**Screenshots/Console Errors**:
[Attach screenshots or console error messages]

**Additional Context**:
Any other relevant information
```

### Severity Levels

- **Critical**: Application crash, data loss, security vulnerability
- **High**: Major functionality broken, significant performance issue
- **Medium**: Minor functionality issue, cosmetic problem
- **Low**: Enhancement suggestion, minor cosmetic issue

## 📈 Test Results Documentation

### Test Execution Summary

Track test results using this format:

| Test Case      | Status  | Notes              | Tester | Date   |
| -------------- | ------- | ------------------ | ------ | ------ |
| 1.1 Dev Server | ✅ Pass | -                  | [Name] | [Date] |
| 1.2 Prod Build | ✅ Pass | -                  | [Name] | [Date] |
| 2.1 Env Config | ❌ Fail | Missing variable X | [Name] | [Date] |

### Performance Metrics

Document performance test results:

| Metric         | Target | Actual | Status  |
| -------------- | ------ | ------ | ------- |
| Page Load Time | <3s    | 2.1s   | ✅ Pass |
| Bundle Size    | <5MB   | 3.2MB  | ✅ Pass |
| Memory Usage   | <100MB | 85MB   | ✅ Pass |

## 🔄 Continuous Testing

### Regular Testing Schedule

- **Daily**: Smoke tests (core functionality)
- **Weekly**: Full manual test suite
- **Before Releases**: Complete regression testing
- **After Major Changes**: Focused testing on affected areas

### Integration with CI/CD

Manual testing should complement automated testing:

- Use manual testing for user experience validation
- Focus on scenarios difficult to automate
- Verify automated test results with manual verification
- Test edge cases and error conditions

This comprehensive manual testing approach ensures high-quality releases and excellent user experience across all supported environments and use cases.
