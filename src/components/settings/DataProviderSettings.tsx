/**
 * Data Provider Settings Component
 * Interface for configuring data sources
 */

'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import type { DataProviderConfig, PostgreSQLConfig } from '@/types/providers';
import { analyticsService } from '@/services/AnalyticsService';

export const DataProviderSettings = () => {
  const [selectedType, setSelectedType] = useState<string>('postgresql');
  const [config, setConfig] = useState<Partial<PostgreSQLConfig>>({
    name: 'Digital Ocean PostgreSQL',
    type: 'postgresql',
    enabled: true,
    connectionStatus: 'disconnected',
    host: '',
    port: 5432,
    database: '',
    username: '',
    password: '',
    ssl: true,
    table: 'players',
  });
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectionResult, setConnectionResult] = useState<string>('');

  const availableProviders = analyticsService.getAvailableProviders();

  const handleConnect = async () => {
    if (
      !config.host ||
      !config.database ||
      !config.username ||
      !config.password
    ) {
      setConnectionResult(
        'Please enter all required PostgreSQL connection details'
      );
      return;
    }

    setIsConnecting(true);
    setConnectionResult('');

    try {
      const result = await analyticsService.setDataProvider(
        config as DataProviderConfig
      );

      if (result.success) {
        setConnectionResult(`✅ Connected successfully: ${result.message}`);
        setConfig((prev) => ({ ...prev, connectionStatus: 'connected' }));
      } else {
        setConnectionResult(`❌ Connection failed: ${result.message}`);
        setConfig((prev) => ({ ...prev, connectionStatus: 'error' }));
      }
    } catch (error) {
      setConnectionResult(
        `❌ Error: ${error instanceof Error ? error.message : String(error)}`
      );
      setConfig((prev) => ({ ...prev, connectionStatus: 'error' }));
    } finally {
      setIsConnecting(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setConfig((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold">Data Provider Configuration</h2>
        <p className="text-muted-foreground">
          Configure your data source for the analytics dashboard
        </p>
      </div>

      <Card className="p-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              Data Provider
            </label>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full p-2 border rounded-md"
            >
              {availableProviders.map((type) => {
                let displayName = type;
                if (type === 'postgresql')
                  displayName = 'Digital Ocean PostgreSQL';
                else if (type === 'clickhouse') displayName = 'ClickHouse';

                return (
                  <option key={type} value={type}>
                    {displayName}
                  </option>
                );
              })}
            </select>
          </div>

          {selectedType === 'postgresql' && (
            <>
              <div>
                <label className="block text-sm font-medium mb-2">
                  Provider Name
                </label>
                <input
                  type="text"
                  value={config.name ?? ''}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className="w-full p-2 border rounded-md"
                  placeholder="Digital Ocean PostgreSQL"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Host *</label>
                <input
                  type="text"
                  value={config.host ?? ''}
                  onChange={(e) => handleInputChange('host', e.target.value)}
                  className="w-full p-2 border rounded-md"
                  placeholder="your-cluster-host.db.ondigitalocean.com"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Digital Ocean PostgreSQL cluster hostname
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Port *</label>
                <input
                  type="number"
                  value={config.port ?? 5432}
                  onChange={(e) => handleInputChange('port', e.target.value)}
                  className="w-full p-2 border rounded-md"
                  placeholder="5432"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Database port (usually 5432)
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Database Name *
                </label>
                <input
                  type="text"
                  value={config.database ?? ''}
                  onChange={(e) =>
                    handleInputChange('database', e.target.value)
                  }
                  className="w-full p-2 border rounded-md"
                  placeholder="cpa_analytics"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Name of your analytics database
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Username *
                </label>
                <input
                  type="text"
                  value={config.username ?? ''}
                  onChange={(e) =>
                    handleInputChange('username', e.target.value)
                  }
                  className="w-full p-2 border rounded-md"
                  placeholder="db_user"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Password *
                </label>
                <input
                  type="password"
                  value={config.password ?? ''}
                  onChange={(e) =>
                    handleInputChange('password', e.target.value)
                  }
                  className="w-full p-2 border rounded-md"
                  placeholder="••••••••"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Table Name
                </label>
                <input
                  type="text"
                  value={config.table ?? ''}
                  onChange={(e) => handleInputChange('table', e.target.value)}
                  className="w-full p-2 border rounded-md"
                  placeholder="players"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Name of the table containing your analytics data
                </p>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={config.ssl ?? true}
                  onChange={(e) =>
                    handleInputChange('ssl', e.target.checked.toString())
                  }
                  className="rounded"
                />
                <label className="text-sm font-medium">
                  Use SSL Connection
                </label>
                <p className="text-xs text-muted-foreground">
                  (Recommended for Digital Ocean)
                </p>
              </div>

              <div className="bg-blue-50 p-4 rounded-md">
                <h4 className="font-medium text-blue-900 mb-2">
                  Digital Ocean PostgreSQL Setup
                </h4>
                <p className="text-sm text-blue-800 mb-2">
                  To connect to your Digital Ocean PostgreSQL database:
                </p>
                <ol className="text-sm text-blue-800 space-y-1 list-decimal list-inside">
                  <li>Create a managed PostgreSQL cluster in Digital Ocean</li>
                  <li>Configure SSL settings and firewall rules</li>
                  <li>Create your analytics database and tables</li>
                  <li>Copy connection details from your cluster overview</li>
                  <li>Ensure your IP is whitelisted for access</li>
                </ol>
              </div>
            </>
          )}

          <div className="flex gap-2">
            <Button
              onClick={() => {
                handleConnect().catch(console.error);
              }}
              disabled={
                isConnecting ||
                !config.host ||
                !config.database ||
                !config.username ||
                !config.password
              }
            >
              {isConnecting ? 'Connecting...' : 'Test Connection'}
            </Button>

            {config.connectionStatus === 'connected' && (
              <div className="flex items-center text-green-600">
                <span className="text-sm">✅ Connected</span>
              </div>
            )}
          </div>

          {connectionResult && (
            <div
              className={`p-3 rounded-md text-sm ${
                connectionResult.startsWith('✅')
                  ? 'bg-green-50 text-green-800'
                  : 'bg-red-50 text-red-800'
              }`}
            >
              {connectionResult}
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};
