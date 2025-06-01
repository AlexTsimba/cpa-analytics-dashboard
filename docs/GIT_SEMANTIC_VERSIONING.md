# Git & Semantic Versioning Setup

This document describes the Git configuration and semantic versioning setup for the CPA Analytics Dashboard project.

## Overview

The project uses **Conventional Commits** specification for commit messages, enforced by **commitlint** and **Husky** git hooks.

## Commit Message Format

All commit messages must follow the Conventional Commits format:

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

### Commit Types

- **feat**: A new feature
- **fix**: A bug fix
- **docs**: Documentation only changes
- **style**: Changes that do not affect the meaning of the code (white-space, formatting, missing semi-colons, etc)
- **refactor**: A code change that neither fixes a bug nor adds a feature
- **perf**: A code change that improves performance
- **test**: Adding missing tests or correcting existing tests
- **chore**: Changes to the build process or auxiliary tools and libraries
- **ci**: Changes to CI configuration files and scripts
- **build**: Changes that affect the build system or external dependencies
- **revert**: Reverts a previous commit

### Examples

#### Good commit messages:

```bash
feat(auth): add user authentication system
fix(dashboard): resolve chart rendering issue
docs(api): update endpoint documentation
style(components): fix eslint formatting issues
refactor(utils): simplify data processing logic
perf(charts): optimize chart rendering performance
test(api): add unit tests for data validation
chore(deps): update dependencies to latest versions
ci(github): add automated testing workflow
build(webpack): optimize bundle size configuration
```

#### Bad commit messages:

```bash
# Too short
fix: bug

# No type
add new feature

# Wrong case
Fix: Bug in login

# Too long subject
feat(auth): add a very long description that exceeds the maximum character limit and should be shortened

# Wrong type
feature: add new login system
```

## Rules Enforced

### Subject Rules

- **Length**: 10-72 characters
- **Case**: Must not use sentence-case, start-case, pascal-case, or upper-case
- **Required**: Cannot be empty

### Header Rules

- **Max length**: 100 characters total
- **Type**: Must be one of the allowed types
- **Type case**: Must be lowercase

### Body Rules

- **Leading blank line**: Required if body is present
- **Max line length**: 100 characters per line

### Footer Rules

- **Leading blank line**: Required if footer is present
- **Max line length**: 100 characters per line

## Git Hooks

### Pre-commit Hook

- Runs lint-staged to format and lint staged files
- Executes Prettier formatting
- Runs ESLint with auto-fix

### Commit-msg Hook

- Validates commit message format using commitlint
- Prevents commits with invalid messages

## Scripts

### Quality Checks

```bash
# Run all quality checks (includes commit message validation)
npm run quality

# Check TypeScript compilation
npm run type-check

# Run ESLint with strict mode
npm run lint:strict

# Check Prettier formatting
npm run format:check

# Validate last commit message
npm run commitlint:last

# Validate specific commit range
npm run commitlint:check
```

### Formatting & Linting

```bash
# Auto-format all files
npm run format

# Fix ESLint issues
npm run lint:fix
```

## Semantic Versioning

This project follows [Semantic Versioning](https://semver.org/) (SemVer):

- **MAJOR**: Breaking changes
- **MINOR**: New features (backwards compatible)
- **PATCH**: Bug fixes (backwards compatible)

### Version Bumping

Commit types determine version bumps:

- `feat:` → **MINOR** version bump
- `fix:` → **PATCH** version bump
- `BREAKING CHANGE:` → **MAJOR** version bump
- `perf:`, `refactor:`, `style:`, etc. → **PATCH** version bump

### Breaking Changes

For breaking changes, add `BREAKING CHANGE:` in the footer:

```
feat(api)!: redesign authentication system

BREAKING CHANGE: The authentication API has been completely redesigned.
The old token format is no longer supported.
```

## Troubleshooting

### Commit Message Rejected

If your commit is rejected:

1. Check the error message from commitlint
2. Fix the commit message format
3. Use `git commit --amend` to update the message
4. Commit again

### Pre-commit Hook Fails

If pre-commit fails:

1. Fix the linting/formatting issues shown
2. Add the fixed files: `git add .`
3. Commit again

### Bypass Hooks (Emergency Only)

```bash
# Skip pre-commit hook
git commit --no-verify

# Skip commit-msg hook
git commit --no-verify -m "emergency fix"
```

⚠️ **Warning**: Only use `--no-verify` in emergencies. All commits should follow the conventional format.

## Configuration Files

- **commitlint.config.js**: Commitlint rules and configuration
- **.husky/commit-msg**: Git hook for commit message validation
- **.husky/pre-commit**: Git hook for pre-commit checks
- **package.json**: Scripts and lint-staged configuration

## Resources

- [Conventional Commits](https://conventionalcommits.org/)
- [Semantic Versioning](https://semver.org/)
- [Commitlint Documentation](https://commitlint.js.org/)
- [Husky Documentation](https://typicode.github.io/husky/)
