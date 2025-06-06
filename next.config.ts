import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // ESLint configuration
  eslint: {
    dirs: ['src', 'components', 'lib', 'app'], // Only run ESLint on specific directories
    ignoreDuringBuilds: false, // Keep ESLint checks during build
  },

  // Environment variables that should be available to the client
  env: {
    // Custom environment variables can be defined here
    // They will be available as process.env.VARIABLE_NAME in both server and client
  },

  // Experimental features
  experimental: {
    // Enable optimized package imports
    optimizePackageImports: [
      '@radix-ui/react-dropdown-menu',
      '@radix-ui/react-slot',
      'lucide-react',
    ],
  },

  // Performance optimizations
  typescript: {
    // Skip type checking during build (handled separately)
    ignoreBuildErrors: process.env['CI'] === 'true' ? false : true,
  },

  // Compiler optimizations
  compiler: {
    // Remove console logs in production
    removeConsole:
      process.env['NODE_ENV'] === 'production' ? { exclude: ['error'] } : false,
  },

  // External packages that should not be bundled by webpack
  serverExternalPackages: [],

  // Image optimization
  images: {
    // Configure domains for next/image optimization
    domains: [],
    // Configure remote patterns for images
    remotePatterns: [],
  },

  // Redirects configuration
  async redirects() {
    return [
      // Define any redirects here
    ];
  },

  // Headers configuration
  async headers() {
    return [
      {
        // Apply security headers to all routes
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
        ],
      },
    ];
  },

  // Bundle analyzer configuration
  ...(process.env['ANALYZE'] === 'true' && {
    webpack: (config: { plugins: unknown[] }) => {
      if (process.env['ANALYZE'] === 'true') {
        // eslint-disable-next-line @typescript-eslint/no-require-imports
        const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
        config.plugins.push(
          new BundleAnalyzerPlugin({
            analyzerMode: 'static',
            openAnalyzer: false,
          })
        );
      }
      return config;
    },
  }),
};

export default nextConfig;
