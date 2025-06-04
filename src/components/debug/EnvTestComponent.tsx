/**
 * Environment Variables Test Component
 *
 * This component helps debug and verify environment variable loading
 */

'use client';

import {
  getAppConfig,
  getFeatureFlags,
  validateEnvironmentVariables,
} from '@/lib/env';

const EnvTestComponent = () => {
  const handleTestEnvironment = () => {
    try {
      // eslint-disable-next-line no-console
      console.log('🔍 Testing environment variables...');

      // Validate required variables
      validateEnvironmentVariables();
      // eslint-disable-next-line no-console
      console.log('✅ Required environment variables are set');

      // Get app configuration
      const appConfig = getAppConfig();
      // eslint-disable-next-line no-console
      console.log('📋 App Configuration:', appConfig);

      // Get feature flags
      const features = getFeatureFlags();
      // eslint-disable-next-line no-console
      console.log('🚩 Feature Flags:', features);

      // Test client-side variables
      const clientVars = {
        appUrl: process.env['NEXT_PUBLIC_APP_URL'],
        useMockData: process.env['NEXT_PUBLIC_USE_MOCK_DATA'],
        enableDarkMode: process.env['NEXT_PUBLIC_ENABLE_DARK_MODE'],
        dataRefreshInterval: process.env['NEXT_PUBLIC_DATA_REFRESH_INTERVAL'],
      };
      // eslint-disable-next-line no-console
      console.log('🌐 Client-side Variables:', clientVars);

      alert('Environment test completed! Check console for details.');
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      console.error('❌ Environment test failed:', error);
      alert(`Environment test failed: ${errorMessage}`);
    }
  };

  return (
    <div className="p-4 border rounded-lg bg-gray-50 dark:bg-gray-800">
      <h3 className="text-lg font-semibold mb-2">Environment Variables Test</h3>
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
        Click the button below to test environment variable loading. Results
        will be shown in the browser console.
      </p>
      <button
        onClick={handleTestEnvironment}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
      >
        Test Environment Variables
      </button>
    </div>
  );
};

export default EnvTestComponent;
