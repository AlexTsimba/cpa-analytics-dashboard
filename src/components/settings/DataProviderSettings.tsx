/**
 * Data Provider Settings Component
 * Interface for configuring data sources
 */

'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import type { DataProviderConfig, SupabaseConfig } from '@/types/providers';
import { analyticsService } from '@/services/AnalyticsService';

export const DataProviderSettings = () => {
  const [selectedType, setSelectedType] = useState<string>('supabase');
  const [config, setConfig] = useState<Partial<SupabaseConfig>>({
    name: 'My Supabase Database',
    type: 'supabase',
    enabled: true,
    connectionStatus: 'disconnected',
    url: '',
    anonKey: '',
    table: 'analytics_records',
  });
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectionResult, setConnectionResult] = useState<string>('');

  const availableProviders = analyticsService.getAvailableProviders();

  const handleConnect = async () => {
    if (!config.url || !config.anonKey) {
      setConnectionResult('Please enter Supabase URL and anonymous key');
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
        <h2 className="text-2xl font-bold">Data Provider Settings</h2>
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
                if (type === 'supabase') displayName = 'Supabase';
                else if (type === 'clickhouse') displayName = 'ClickHouse';

                return (
                  <option key={type} value={type}>
                    {displayName}
                  </option>
                );
              })}
            </select>
          </div>

          {selectedType === 'supabase' && (
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
                  placeholder="My Supabase Database"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Supabase URL *
                </label>
                <input
                  type="text"
                  value={config.url ?? ''}
                  onChange={(e) => handleInputChange('url', e.target.value)}
                  className="w-full p-2 border rounded-md"
                  placeholder="https://your-project.supabase.co"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Find this in your Supabase project settings
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Anonymous Key *
                </label>
                <input
                  type="password"
                  value={config.anonKey ?? ''}
                  onChange={(e) => handleInputChange('anonKey', e.target.value)}
                  className="w-full p-2 border rounded-md"
                  placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Your Supabase project&apos;s anonymous/public key
                </p>
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
                  placeholder="analytics_records"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Name of the table containing your analytics data
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Service Role Key (Optional)
                </label>
                <input
                  type="password"
                  value={config.serviceRoleKey ?? ''}
                  onChange={(e) =>
                    handleInputChange('serviceRoleKey', e.target.value)
                  }
                  className="w-full p-2 border rounded-md"
                  placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Only needed for administrative operations
                </p>
              </div>

              <div className="bg-blue-50 p-4 rounded-md">
                <h4 className="font-medium text-blue-900 mb-2">
                  Supabase Setup
                </h4>
                <p className="text-sm text-blue-800 mb-2">
                  To connect to your Supabase database:
                </p>
                <ol className="text-sm text-blue-800 space-y-1 list-decimal list-inside">
                  <li>Create a Supabase project at supabase.com</li>
                  <li>Set up your database schema for analytics data</li>
                  <li>
                    Copy your project URL and anonymous key from project
                    settings
                  </li>
                  <li>
                    Configure Row Level Security (RLS) for data protection
                  </li>
                </ol>
              </div>
            </>
          )}

          <div className="flex gap-2">
            <Button
              onClick={() => {
                handleConnect().catch(console.error);
              }}
              disabled={isConnecting || !config.url || !config.anonKey}
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
