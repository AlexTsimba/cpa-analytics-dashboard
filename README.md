# CPA Analytics Dashboard

A modern, responsive analytics dashboard for CPA (Cost Per Action) performance tracking and reporting, built with Next.js 15 and TypeScript.

## 🏷️ Badges

[![CI](https://github.com/YOUR_USERNAME/cpa-analytics-dashboard/workflows/CI/CD%20Pipeline/badge.svg)](https://github.com/YOUR_USERNAME/cpa-analytics-dashboard/actions)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue.svg)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-15-black.svg)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-61dafb.svg)](https://react.dev/)
[![Playwright](https://img.shields.io/badge/Playwright-E2E-green.svg)](https://playwright.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38bdf8.svg)](https://tailwindcss.com/)
[![Code Style](https://img.shields.io/badge/code_style-prettier-ff69b4.svg)](https://prettier.io/)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](./LICENSE)

## ✨ Project Status

🎉 **Ready for GitHub Publication!**

- ✅ Complete Playwright E2E testing infrastructure
- ✅ Comprehensive code quality setup (ESLint, Prettier, TypeScript)
- ✅ All quality checks passing (19/19 tests, 0 lint errors)
- ✅ Git semantic versioning configured
- ✅ Production-ready build configuration
- ✅ Automated CI/CD pipeline ready

## 📊 Quality Metrics

- **Tests**: 19/19 passing ✅
- **Code Coverage**: Available with detailed reports
- **ESLint**: 0 errors, 0 warnings ✅
- **TypeScript**: 0 type errors ✅
- **Prettier**: All files formatted ✅
- **Commitlint**: Conventional commits enforced ✅

## 🚀 Features

- **Real-time Analytics**: Live data visualization and reporting
- **Responsive Design**: Optimized for desktop and mobile devices
- **TypeScript**: Full type safety and enhanced developer experience
- **Modern Stack**: Built with Next.js 15, React 19, and Tailwind CSS
- **Quality Assured**: Comprehensive linting, formatting, and testing setup
- **E2E Testing**: Complete Playwright testing suite with cross-browser support

## 📋 Prerequisites

- Node.js 18.0 or later
- npm, yarn, pnpm, or bun package manager

## 🛠️ Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd cpa-analytics-dashboard
```

2. Install dependencies:

```bash
npm install
# or
yarn install
# or
pnpm install
# or
bun install
```

3. Copy environment variables:

```bash
cp .env.example .env.local
```

4. Configure your environment variables in `.env.local`

## 🚀 Getting Started

Run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `src/app/page.tsx`. The page auto-updates as you edit the file.

## 📁 Project Structure

```
├── src/
│   ├── app/          # Next.js App Router pages and layouts
│   ├── components/   # Reusable React components
│   ├── lib/          # Utility functions and configurations
│   └── types/        # TypeScript type definitions
├── public/           # Static assets
├── docs/            # Project documentation
├── tests/           # Test files
├── e2e/             # End-to-end tests
└── scripts/         # Build and utility scripts
```

## 🔧 Development Commands

### Core Development

```bash
npm run dev          # Start development server with Turbopack
npm run build        # Build for production
npm run start        # Start production server
```

### Code Quality

```bash
npm run lint         # Run ESLint
npm run lint:fix     # Fix ESLint issues automatically
npm run lint:strict  # Run ESLint with zero warnings
npm run type-check   # Run TypeScript type checking
npm run format       # Format code with Prettier
npm run format:check # Check code formatting
npm run quality      # Run all quality checks
```

### Git & Commits

```bash
npm run commit:help        # Show conventional commit examples
npm run commit:interactive # Interactive commit creation
npm run commit:validate    # Validate commit message format
npm run git:status        # Show git status and recent commits
```

## 📝 Commit Guidelines

This project uses [Conventional Commits](https://www.conventionalcommits.org/) for consistent commit messages and automated changelog generation.

### Commit Format

```
type(scope): description

[optional body]

[optional footer]
```

### Examples

```bash
feat: add user authentication system
fix: resolve login validation bug
docs: update API documentation
style: format code with prettier
refactor: restructure user service
test: add unit tests for auth module
```

For detailed guidelines, see [Git Semantic Versioning Documentation](./docs/git-semantic-versioning.md).

## 🧪 Testing

```bash
npm run test         # Run unit tests
npm run test:watch   # Run tests in watch mode
npm run test:coverage # Run tests with coverage report
npm run e2e          # Run end-to-end tests
```

## 📚 Documentation

- [Git Semantic Versioning](./docs/git-semantic-versioning.md) - Commit guidelines and Git configuration
- [Development Guide](./docs/development.md) - Detailed development instructions
- [API Documentation](./docs/api.md) - API endpoints and usage
- [Deployment Guide](./docs/deployment.md) - Deployment instructions

## 🛡️ Code Quality

This project maintains high code quality through:

- **ESLint**: JavaScript/TypeScript linting with strict rules
- **Prettier**: Consistent code formatting
- **TypeScript**: Static type checking
- **Husky**: Git hooks for automated quality checks
- **Commitlint**: Conventional commit message validation
- **Lint-staged**: Run linters on staged files only

## 🔄 Git Hooks

- **pre-commit**: Runs linting and formatting on staged files
- **commit-msg**: Validates commit message format
- **pre-push**: Runs comprehensive quality checks before push

## 🌐 Environment Variables

Copy `.env.example` to `.env.local` and configure:

```env
# Database
DATABASE_URL=

# API Keys
NEXT_PUBLIC_API_URL=
API_SECRET_KEY=

# Analytics
NEXT_PUBLIC_ANALYTICS_ID=
```

## 📦 Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **UI Components**: [React 19](https://react.dev/)
- **Code Quality**: ESLint, Prettier, Husky
- **Testing**: Jest, React Testing Library
- **Development**: Turbopack (dev), Webpack (prod)

## 🚀 Deployment

### Vercel (Recommended)

1. Connect your repository to [Vercel](https://vercel.com)
2. Configure environment variables
3. Deploy automatically on push

### Manual Deployment

```bash
npm run build
npm run start
```

For detailed deployment instructions, see [Deployment Guide](./docs/deployment.md).

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feat/amazing-feature`
3. Make your changes following the code style guidelines
4. Commit using conventional commits: `npm run commit:interactive`
5. Push to your branch: `git push origin feat/amazing-feature`
6. Open a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:

- Check the [documentation](./docs/)
- Open an [issue](https://github.com/your-repo/issues)
- Contact the development team

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) team for the amazing framework
- [Vercel](https://vercel.com/) for hosting and deployment platform
- All contributors who help improve this project

---

**Happy coding! 🎉**
