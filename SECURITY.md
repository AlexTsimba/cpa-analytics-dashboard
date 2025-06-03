# Security Policy

## Supported Versions

We support security updates for the following versions:

| Version | Supported          |
| ------- | ------------------ |
| Latest  | :white_check_mark: |
| < Latest| :x:               |

## Reporting a Vulnerability

We take security vulnerabilities seriously. If you discover a security vulnerability, please follow these steps:

### 1. Do NOT create a public issue

Please do not report security vulnerabilities through public GitHub issues, discussions, or pull requests.

### 2. Report privately

Send a detailed report to [security@cpa-dashboard.dev](mailto:security@cpa-dashboard.dev) with:

- Description of the vulnerability
- Steps to reproduce the issue
- Potential impact
- Any suggested fixes (if available)

### 3. What to expect

- **Acknowledgment**: We will acknowledge receipt of your report within 24 hours
- **Investigation**: We will investigate and validate the issue within 5 business days
- **Response**: We will provide a detailed response indicating the next steps within 10 business days

### 4. Disclosure Process

- We will work with you to understand and resolve the issue
- We will provide credit for responsible disclosure (unless you prefer to remain anonymous)
- We will coordinate public disclosure timing with you
- We aim to resolve critical vulnerabilities within 30 days

## Security Features

Our application includes the following security measures:

### Code Security
- ✅ CodeQL static analysis scanning
- ✅ Dependency vulnerability scanning (npm audit)
- ✅ Secret detection with TruffleHog
- ✅ Container security scanning with Trivy
- ✅ OSSF Scorecard assessment

### Development Security
- ✅ TypeScript strict mode enabled
- ✅ ESLint security rules
- ✅ Automated security testing in CI/CD
- ✅ Pinned action versions in workflows
- ✅ Minimal permissions in GitHub Actions

### Infrastructure Security
- ✅ Secure environment variable handling
- ✅ HTTPS enforcement
- ✅ Security headers configuration
- ✅ Regular dependency updates
- ✅ Audit logging

## Security Best Practices for Contributors

When contributing to this project, please follow these security guidelines:

### Code Security
1. **Never commit secrets**: Use environment variables for sensitive data
2. **Validate input**: Always validate and sanitize user input
3. **Use secure dependencies**: Keep dependencies updated and audit regularly
4. **Follow TypeScript strict mode**: Enable all strict type checking options

### GitHub Actions Security
1. **Pin action versions**: Always use commit SHA for third-party actions
2. **Minimal permissions**: Use least privilege principle for workflow permissions
3. **Secure artifact handling**: Be careful with artifact uploads/downloads
4. **Environment separation**: Use proper environment protection rules

### General Guidelines
1. **Code review**: All code changes require review
2. **Testing**: Include security tests for new features
3. **Documentation**: Document security-relevant changes
4. **Disclosure**: Report security issues privately first

## Automated Security Scanning

This repository automatically scans for:

- **Vulnerabilities in dependencies** (npm audit)
- **Code security issues** (CodeQL)
- **Exposed secrets** (TruffleHog)
- **Container vulnerabilities** (Trivy)
- **Supply chain security** (OSSF Scorecard)

Scans run:
- On every push to main branches
- On every pull request
- Daily at 2 AM UTC (scheduled)

## Security Contacts

- **Security Team**: [security@cpa-dashboard.dev](mailto:security@cpa-dashboard.dev)
- **Project Maintainer**: [dev@cpa-dashboard.dev](mailto:dev@cpa-dashboard.dev)

## Resources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [GitHub Security Advisories](https://github.com/advisories)
- [Node.js Security Guidelines](https://nodejs.org/en/security/)
- [Next.js Security Guidelines](https://nextjs.org/docs/pages/building-your-application/configuring/content-security-policy)

---

Thank you for helping keep our project secure! 🛡️
