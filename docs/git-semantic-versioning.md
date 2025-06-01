# Git Semantic Versioning Configuration

This document describes the Git configuration with semantic versioning commit standards for the CPA Analytics Dashboard project.

## Overview

The project uses conventional commits and semantic versioning to maintain a clean, readable commit history that enables automatic changelog generation and semantic version bumping.

## Configuration Components

### 1. Commitlint Configuration (`commitlint.config.js`)

The project uses `@commitlint/config-conventional` with custom rules to enforce conventional commit format:

**Supported Commit Types:**

- `feat`: New features
- `fix`: Bug fixes
- `docs`: Documentation changes
- `style`: Code style changes (formatting, semicolons, etc.)
- `refactor`: Code refactoring
- `perf`: Performance improvements
- `test`: Adding or updating tests
- `chore`: Maintenance tasks
- `ci`: CI/CD changes
- `build`: Build system changes
- `revert`: Reverting previous commits

**Format Rules:**

- Type must be lowercase
- Subject must be present and between 10-72 characters
- Header must not exceed 100 characters
- Body and footer lines must not exceed 100 characters

### 2. Husky Git Hooks

#### Pre-commit Hook (`.husky/pre-commit`)

Runs before each commit to ensure code quality:

- Formats code with Prettier
- Fixes ESLint issues automatically
- Only processes staged files (via lint-staged)

#### Commit Message Hook (`.husky/commit-msg`)

Validates commit messages against conventional commit format using commitlint.

#### Pre-push Hook (`.husky/pre-push`)

Runs comprehensive quality checks before pushing:

- TypeScript type checking
- ESLint strict mode (no warnings allowed)
- Prettier format verification
- Commit message validation

### 3. Quality Gates

The `npm run quality` script runs all quality checks:

```bash
npm run quality
```

This includes:

- Type checking with TypeScript
- Strict linting (zero warnings)
- Format checking
- Last commit message validation

## Usage

### Making Commits

#### Method 1: Direct Git Commands

```bash
git add .
git commit -m "feat: add user authentication system"
```

#### Method 2: Interactive Helper

```bash
npm run commit:interactive
```

#### Method 3: Validate Before Committing

```bash
npm run commit:validate "feat: your commit message"
```

### Useful Commands

```bash
# Show conventional commit examples
npm run commit:help

# Check current git status and recent commits
npm run git:status

# Validate a specific commit message
npm run commit:validate "your message here"

# Run all quality checks manually
npm run quality

# Check commitlint configuration
npx commitlint --help-url
```

### Commit Message Examples

#### Basic Examples

```
feat: add dashboard analytics component
fix: resolve authentication token expiration
docs: update API documentation
style: format code according to prettier rules
refactor: restructure data processing pipeline
perf: optimize SQL queries for better performance
test: add unit tests for user service
chore: update project dependencies
ci: add automated testing workflow
build: configure webpack for production
```

#### With Scope

```
feat(auth): implement OAuth2 integration
fix(ui): correct responsive layout issues
docs(api): add endpoint documentation
test(auth): add integration tests for login flow
```

#### Breaking Changes

```
feat!: remove deprecated API endpoints
feat(auth)!: change authentication method to JWT
```

#### Multi-line Commits

```
feat: add advanced analytics dashboard

- Implement real-time data visualization
- Add filtering and sorting capabilities
- Include export functionality

Closes #123
```

## Best Practices

1. **Use Imperative Mood**: Write commit messages as commands

   - ✅ "add user authentication"
   - ❌ "added user authentication"

2. **Be Descriptive**: Explain what the change does

   - ✅ "fix: resolve memory leak in data processing"
   - ❌ "fix: bug"

3. **Use Appropriate Type**: Choose the most accurate type

   - Use `feat` for new functionality
   - Use `fix` for bug fixes
   - Use `refactor` for code improvements without changing functionality

4. **Include Breaking Changes**: Mark breaking changes with `!`

   ```
   feat!: remove deprecated getUserData method
   ```

5. **Reference Issues**: Link to relevant issues when applicable

   ```
   fix: resolve login timeout issue

   Fixes #456
   ```

## Troubleshooting

### Commit Rejected

If your commit is rejected:

1. Check the commit message format
2. Run `npm run commit:help` for examples
3. Use `npm run commit:validate "your message"` to test

### Pre-push Hook Fails

If pre-push hook fails:

1. Fix any TypeScript errors: `npm run type-check`
2. Fix ESLint issues: `npm run lint:fix`
3. Format code: `npm run format`
4. Ensure last commit message is valid

### Bypass Hooks (Emergency Only)

```bash
# Skip pre-commit hook
git commit --no-verify -m "emergency fix"

# Skip pre-push hook
git push --no-verify
```

**Note**: Only use `--no-verify` in genuine emergencies, as it bypasses quality checks.

## Tools Integration

### IDE Integration

- Install commitlint extension for your IDE
- Configure git hooks to work with your IDE's git interface
- Use conventional commits extension for commit message assistance

### CI/CD Integration

The configuration supports automatic:

- Changelog generation
- Semantic version bumping
- Release notes creation

## Related Files

- `commitlint.config.js` - Commitlint configuration
- `.husky/` - Git hooks directory
- `scripts/git-semantic.sh` - Semantic versioning helper script
- `package.json` - NPM scripts for git operations
- `.gitignore` - Git ignore patterns

## References

- [Conventional Commits](https://www.conventionalcommits.org/)
- [Commitlint](https://commitlint.js.org/)
- [Husky](https://typicode.github.io/husky/)
- [Semantic Versioning](https://semver.org/)
