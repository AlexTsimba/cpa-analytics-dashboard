# 🤝 Contributing to CPA Analytics Dashboard

Thank you for your interest in contributing to the CPA Analytics Dashboard! This document provides guidelines and information for contributors.

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Contribution Workflow](#contribution-workflow)
- [Coding Standards](#coding-standards)
- [Testing Guidelines](#testing-guidelines)
- [Commit Guidelines](#commit-guidelines)
- [Pull Request Process](#pull-request-process)
- [Issue Reporting](#issue-reporting)

## 📜 Code of Conduct

This project and everyone participating in it is governed by our Code of Conduct. By participating, you are expected to uphold this code.

### Our Standards

- Using welcoming and inclusive language
- Being respectful of differing viewpoints and experiences
- Gracefully accepting constructive criticism
- Focusing on what is best for the community
- Showing empathy towards other community members

## 🚀 Getting Started

### Prerequisites

- Node.js 18.0 or later
- npm, yarn, pnpm, or bun
- Git
- Modern web browser for testing

### Fork and Clone

1. Fork the repository on GitHub
2. Clone your fork locally:

```bash
git clone https://github.com/YOUR_USERNAME/cpa-analytics-dashboard.git
cd cpa-analytics-dashboard
```

3. Add the original repository as upstream:

```bash
git remote add upstream https://github.com/ORIGINAL_OWNER/cpa-analytics-dashboard.git
```

## ⚙️ Development Setup

1. Install dependencies:

```bash
npm install
```

2. Copy environment variables:

```bash
cp .env.example .env.local
```

3. Start the development server:

```bash
npm run dev
```

4. Run tests to ensure everything works:

```bash
npm run test
npm run test:e2e
```

## 🔄 Contribution Workflow

1. **Create a branch** for your work:

```bash
git checkout -b feat/your-feature-name
# or
git checkout -b fix/your-bug-fix
```

2. **Make your changes** following our coding standards

3. **Test your changes**:

```bash
npm run quality  # Runs all quality checks
npm run test:e2e # End-to-end tests
```

4. **Commit your changes** using conventional commits:

```bash
npm run commit:interactive  # Interactive commit tool
```

5. **Push to your fork**:

```bash
git push origin feat/your-feature-name
```

6. **Create a Pull Request** on GitHub

## 🎯 Coding Standards

### TypeScript

- Use TypeScript for all new code
- Provide proper type annotations
- Avoid `any` types (use `unknown` if necessary)
- Use interface for object shapes, type for unions

### React Components

- Use functional components with hooks
- Follow the single responsibility principle
- Use descriptive component and prop names
- Implement proper error boundaries

### Code Style

- Follow ESLint and Prettier configurations
- Use meaningful variable and function names
- Write self-documenting code with clear comments
- Keep functions small and focused

### File Organization

```
src/
├── app/           # Next.js app router pages
├── components/    # Reusable components
│   ├── ui/       # Basic UI components
│   └── features/ # Feature-specific components
├── lib/          # Utility functions
├── types/        # TypeScript type definitions
└── hooks/        # Custom React hooks
```

## 🧪 Testing Guidelines

### Unit Tests

- Write tests for all utility functions
- Test components with React Testing Library
- Mock external dependencies
- Aim for high test coverage (>90%)

### Integration Tests

- Test complete user workflows
- Use realistic data and scenarios
- Test error conditions and edge cases

### E2E Tests

- Use Playwright for end-to-end testing
- Test critical user journeys
- Include cross-browser testing
- Test responsive design

### Running Tests

```bash
npm run test           # Unit tests
npm run test:watch     # Watch mode
npm run test:coverage  # With coverage
npm run test:e2e       # E2E tests
npm run test:e2e:ui    # E2E with UI
```

## 📝 Commit Guidelines

We use [Conventional Commits](https://www.conventionalcommits.org/) for consistent commit messages.

### Format

```
type(scope): description

[optional body]

[optional footer]
```

### Types

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

### Examples

```bash
feat(analytics): add real-time dashboard updates
fix(auth): resolve login validation bug
docs(readme): update installation instructions
test(components): add unit tests for Dashboard component
```

### Tools

Use our interactive commit tool:

```bash
npm run commit:interactive
```

## 🔀 Pull Request Process

### Before Submitting

1. Ensure all tests pass
2. Run quality checks: `npm run quality`
3. Update documentation if needed
4. Add tests for new functionality
5. Rebase on the latest master branch

### PR Description

- Use the provided PR template
- Describe what changes were made and why
- Link to related issues
- Include screenshots for UI changes
- List any breaking changes

### Review Process

1. **Automated checks** must pass (CI/CD pipeline)
2. **Code review** by at least one maintainer
3. **Testing** verification by reviewers
4. **Documentation** review if applicable
5. **Final approval** and merge

### After Merge

- Delete your feature branch
- Update your local master branch
- Consider if any follow-up work is needed

## 🐛 Issue Reporting

### Bug Reports

Use the bug report template and include:

- Clear description of the issue
- Steps to reproduce
- Expected vs actual behavior
- Environment details
- Screenshots if applicable
- Error logs if available

### Feature Requests

Use the feature request template and include:

- Clear description of the feature
- Use cases and motivation
- Proposed solution
- Alternatives considered
- Technical considerations

## 🏷️ Labels and Project Management

### Issue Labels

- **Type**: `bug`, `enhancement`, `documentation`, `question`
- **Priority**: `low`, `medium`, `high`, `critical`
- **Status**: `needs-triage`, `in-progress`, `blocked`, `ready-for-review`
- **Component**: `ui`, `api`, `analytics`, `testing`, `docs`

### Milestones

Issues and PRs are organized into milestones representing feature releases or sprint goals.

## 🛠️ Development Tools

### Recommended VSCode Extensions

- ESLint
- Prettier
- TypeScript and JavaScript Language Features
- Tailwind CSS IntelliSense
- Auto Rename Tag
- Bracket Pair Colorizer

### Browser DevTools

- React Developer Tools
- Redux DevTools (if using Redux)
- Web Vitals extension

## 📚 Resources

### Learning Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Playwright Documentation](https://playwright.dev)

### Project Resources

- [Project Roadmap](./docs/roadmap.md)
- [Architecture Decision Records](./docs/adr/)
- [API Documentation](./docs/api.md)

## ❓ Getting Help

- **Documentation**: Check the [docs folder](./docs/)
- **Issues**: Search existing [GitHub issues](https://github.com/your-repo/issues)
- **Discussions**: Use [GitHub Discussions](https://github.com/your-repo/discussions)
- **Email**: Contact maintainers at dev@cpa-dashboard.dev

## 🎉 Recognition

Contributors will be recognized in:

- README.md contributors section
- Release notes for significant contributions
- GitHub contributor graphs
- Annual contributor appreciation posts

Thank you for contributing to CPA Analytics Dashboard! 🙏

---

_This document is inspired by open source contribution guidelines and is regularly updated based on community feedback._
