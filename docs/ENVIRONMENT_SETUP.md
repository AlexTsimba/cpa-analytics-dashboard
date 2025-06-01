# Environment Variables Configuration Guide

This document provides instructions for setting up environment variables for the CPA Analytics Dashboard.

## 📋 Overview

The application uses environment variables to configure various settings including:

- Data source connections (Google Sheets API)
- Authentication providers
- Feature flags
- API rate limiting
- Analytics and monitoring
- Development tools

## 🔧 Quick Setup

### 1. Copy Environment Template

```bash
# Copy the example file to create your local configuration
cp .env.example .env.local
```

### 2. Configure Required Variables

Open `.env.local` and set the following required variables:

```bash
# Application URL
NEXT_PUBLIC_APP_URL="http://localhost:3000"

# Google Sheets API (for data source)
GOOGLE_SHEETS_API_KEY="your_api_key_here"
GOOGLE_SHEETS_SPREADSHEET_ID="your_spreadsheet_id_here"
GOOGLE_SHEETS_CLIENT_EMAIL="your_service_account_email_here"
GOOGLE_SHEETS_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----"
```

## 📁 Environment Files

The project uses different environment files for different contexts:

| File              | Purpose                               | Git Tracked |
| ----------------- | ------------------------------------- | ----------- |
| `.env.example`    | Template with all available variables | ✅ Yes      |
| `.env.local`      | Local development settings            | ❌ No       |
| `.env.test`       | Test environment settings             | ✅ Yes      |
| `.env.production` | Production defaults                   | ✅ Yes      |

## 🔑 Required Variables

### Application Settings

```bash
# The URL where your application is deployed
NEXT_PUBLIC_APP_URL="http://localhost:3000"

# Application environment (development, test, production)
NODE_ENV="development"
```

### Google Sheets API (Primary Data Source)

```bash
# Google Sheets API credentials
GOOGLE_SHEETS_API_KEY="your_api_key_here"
GOOGLE_SHEETS_SPREADSHEET_ID="your_spreadsheet_id_here"
GOOGLE_SHEETS_CLIENT_EMAIL="your_service_account_email_here"
GOOGLE_SHEETS_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----"
```

#### Setting up Google Sheets API:

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project or select existing one
3. Enable Google Sheets API
4. Create credentials (Service Account)
5. Download the JSON key file
6. Extract the required values:
   - `client_email` → `GOOGLE_SHEETS_CLIENT_EMAIL`
   - `private_key` → `GOOGLE_SHEETS_PRIVATE_KEY`
7. Create an API key for `GOOGLE_SHEETS_API_KEY`
8. Get your spreadsheet ID from the URL: `https://docs.google.com/spreadsheets/d/{SPREADSHEET_ID}/edit`

## ⚙️ Optional Variables

### Authentication (Optional)

```bash
# NextAuth.js configuration
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="generate_with_openssl_rand_base64_32"

# Google OAuth (optional)
GOOGLE_CLIENT_ID="your_google_client_id"
GOOGLE_CLIENT_SECRET="your_google_client_secret"
```

### Analytics & Monitoring (Optional)

```bash
# Google Analytics
NEXT_PUBLIC_GA_MEASUREMENT_ID="G-XXXXXXXXXX"

# Sentry error tracking
SENTRY_DSN="https://your_sentry_dsn_here"
SENTRY_AUTH_TOKEN="your_sentry_auth_token"
```

### Caching & Performance (Optional)

```bash
# Redis for caching
REDIS_URL="redis://localhost:6379"

# API rate limiting
API_RATE_LIMIT_REQUESTS="100"
API_RATE_LIMIT_WINDOW="900000"
```

## 🚩 Feature Flags

Enable or disable specific features:

```bash
# Feature toggles
NEXT_PUBLIC_ENABLE_COHORT_ANALYSIS="true"
NEXT_PUBLIC_ENABLE_REAL_TIME_UPDATES="true"
NEXT_PUBLIC_ENABLE_DATA_EXPORT="true"
NEXT_PUBLIC_ENABLE_DARK_MODE="true"

# Data refresh interval (milliseconds)
NEXT_PUBLIC_DATA_REFRESH_INTERVAL="300000"
```

## 🔍 Development Settings

```bash
# Debug mode
DEBUG="true"

# Use mock data instead of real API calls
NEXT_PUBLIC_USE_MOCK_DATA="true"

# Performance monitoring
NEXT_PUBLIC_ENABLE_PERFORMANCE_MONITORING="true"
```

## 🚀 Environment-Specific Setup

### Development Environment

1. Copy `.env.example` to `.env.local`
2. Set up Google Sheets API credentials
3. Enable debug mode and mock data
4. Configure feature flags as needed

### Test Environment

The `.env.test` file is pre-configured for testing:

- Uses mock data by default
- Disables external API calls
- Sets appropriate timeouts for tests

### Production Environment

1. Set environment variables through your hosting platform (Vercel, etc.)
2. Never commit production secrets to Git
3. Use the `.env.production` file as a template
4. Ensure all required variables are set

## 🛡️ Security Best Practices

### DO:

- ✅ Use `.env.local` for local development
- ✅ Set production variables via hosting platform
- ✅ Use strong, randomly generated secrets
- ✅ Rotate API keys regularly
- ✅ Use different keys for different environments

### DON'T:

- ❌ Commit `.env.local` to Git
- ❌ Share API keys in public channels
- ❌ Use production keys in development
- ❌ Hard-code secrets in source code
- ❌ Use weak or predictable secrets

## 🔧 Validation

The application validates environment variables at startup. If required variables are missing, you'll see error messages like:

```
Missing required environment variable: NEXT_PUBLIC_APP_URL
```

To validate your configuration:

```bash
# Run the application
npm run dev

# Run tests
npm test tests/lib/env.test.ts
```

## 🆘 Troubleshooting

### Common Issues:

1. **"Missing required environment variable"**

   - Ensure all required variables are set in your `.env.local` file
   - Check variable names for typos

2. **"Google Sheets API authentication failed"**

   - Verify your service account credentials
   - Ensure the service account has access to the spreadsheet
   - Check that the private key is properly formatted

3. **"Environment variables not loading"**
   - Restart the development server after changing `.env.local`
   - Ensure the file is in the project root directory
   - Check that the file name is exactly `.env.local`

### Debug Environment Loading:

```bash
# Add this to your component to debug
console.log('Environment variables:', {
  appUrl: process.env.NEXT_PUBLIC_APP_URL,
  nodeEnv: process.env.NODE_ENV,
  useMockData: process.env.NEXT_PUBLIC_USE_MOCK_DATA,
});
```

## 📚 Additional Resources

- [Next.js Environment Variables Documentation](https://nextjs.org/docs/app/guides/environment-variables)
- [Google Sheets API Setup Guide](https://developers.google.com/sheets/api/quickstart/nodejs)
- [NextAuth.js Configuration](https://next-auth.js.org/configuration/options)
- [Vercel Environment Variables](https://vercel.com/docs/concepts/projects/environment-variables)
