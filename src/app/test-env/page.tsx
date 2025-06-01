/**
 * Test environment variables loading in a Next.js component
 */

import { getAppConfig } from '@/lib/env';

export default function EnvTestPage() {
  // Test environment variables loading
  const config = getAppConfig();

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Environment Variables Test</h1>

      <div className="space-y-6">
        <section>
          <h2 className="text-lg font-semibold mb-3">
            Application Configuration
          </h2>
          <div className="bg-gray-100 p-4 rounded-lg">
            <pre className="text-sm">{JSON.stringify(config, null, 2)}</pre>
          </div>
        </section>

        <section>
          <h2 className="text-lg font-semibold mb-3">Feature Flags</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-3 border rounded">
              <strong>Cohort Analysis:</strong>{' '}
              {config.features.enableCohortAnalysis ? '✅' : '❌'}
            </div>
            <div className="p-3 border rounded">
              <strong>Real-time Updates:</strong>{' '}
              {config.features.enableRealTimeUpdates ? '✅' : '❌'}
            </div>
            <div className="p-3 border rounded">
              <strong>Data Export:</strong>{' '}
              {config.features.enableDataExport ? '✅' : '❌'}
            </div>
            <div className="p-3 border rounded">
              <strong>Dark Mode:</strong>{' '}
              {config.features.enableDarkMode ? '✅' : '❌'}
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-lg font-semibold mb-3">Environment Info</h2>
          <div className="bg-blue-50 p-4 rounded-lg">
            <p>
              <strong>Environment:</strong> {config.environment}
            </p>
            <p>
              <strong>App URL:</strong> {config.appUrl}
            </p>
            <p>
              <strong>Debug Mode:</strong>{' '}
              {config.debug ? 'Enabled' : 'Disabled'}
            </p>
            <p>
              <strong>Mock Data:</strong>{' '}
              {config.useMockData ? 'Enabled' : 'Disabled'}
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
