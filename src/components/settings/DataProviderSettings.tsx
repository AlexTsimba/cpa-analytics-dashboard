/**
 * Data Provider Settings Component
 * Interface for configuring data sources
 */

'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import type { DataProviderConfig, GoogleSheetsConfig } from '@/types/providers';
import { analyticsService } from '@/services/AnalyticsService';

export function DataProviderSettings() {
  const [selectedType, setSelectedType] = useState<string>('google-sheets');
  const [config, setConfig] = useState<Partial<GoogleSheetsConfig>>({
    name: 'My Google Sheets',
    type: 'google-sheets',
    enabled: true,
    connectionStatus: 'disconnected',
    authType: 'service-account',
    spreadsheetId: '',
    sheetName: 'Sheet1',
  });
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectionResult, setConnectionResult] = useState<string>('');

  const availableProviders = analyticsService.getAvailableProviders();

  const handleConnect = async () => {
    if (!config.spreadsheetId) {
      setConnectionResult('Please enter a Spreadsheet ID');
      return;
    }

    setIsConnecting(true);
    setConnectionResult('');

    try {
      const result = await analyticsService.setDataProvider(config as DataProviderConfig);
      
      if (result.success) {
        setConnectionResult(`✅ Connected successfully: ${result.message}`);
        setConfig(prev => ({ ...prev, connectionStatus: 'connected' }));
      } else {
        setConnectionResult(`❌ Connection failed: ${result.message}`);
        setConfig(prev => ({ ...prev, connectionStatus: 'error' }));
      }
    } catch (error) {
      setConnectionResult(`❌ Error: ${error instanceof Error ? error.message : String(error)}`);
      setConfig(prev => ({ ...prev, connectionStatus: 'error' }));
    } finally {
      setIsConnecting(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setConfig(prev => ({ ...prev, [field]: value }));
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
            <label className="block text-sm font-medium mb-2">Data Provider</label>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full p-2 border rounded-md"
            >
              {availableProviders.map(type => (
                <option key={type} value={type}>
                  {type === 'google-sheets' ? 'Google Sheets' : 
                   type === 'clickhouse' ? 'ClickHouse' : type}
                </option>
              ))}
            </select>
          </div>

          {selectedType === 'google-sheets' && (
            <>
              <div>
                <label className="block text-sm font-medium mb-2">Provider Name</label>
                <input
                  type="text"
                  value={config.name || ''}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className="w-full p-2 border rounded-md"
                  placeholder="My Google Sheets"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Spreadsheet ID *
                </label>
                <input
                  type="text"
                  value={config.spreadsheetId || ''}
                  onChange={(e) => handleInputChange('spreadsheetId', e.target.value)}
                  className="w-full p-2 border rounded-md"
                  placeholder="1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Find this in your Google Sheets URL
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Sheet Name</label>
                <input
                  type="text"
                  value={config.sheetName || ''}
                  onChange={(e) => handleInputChange('sheetName', e.target.value)}
                  className="w-full p-2 border rounded-md"
                  placeholder="Sheet1"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Range (Optional)</label>
                <input
                  type="text"
                  value={config.range || ''}
                  onChange={(e) => handleInputChange('range', e.target.value)}
                  className="w-full p-2 border rounded-md"
                  placeholder="A1:Z1000"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Leave empty to read all data
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Authentication</label>
                <select
                  value={config.authType || 'service-account'}
                  onChange={(e) => handleInputChange('authType', e.target.value)}
                  className="w-full p-2 border rounded-md"
                >
                  <option value="service-account">Service Account</option>
                  <option value="oauth2" disabled>OAuth2 (Coming Soon)</option>
                </select>
              </div>

              {config.authType === 'service-account' && (
                <div className="bg-blue-50 p-4 rounded-md">
                  <h4 className="font-medium text-blue-900 mb-2">Service Account Setup</h4>
                  <p className="text-sm text-blue-800 mb-2">
                    To use service account authentication:
                  </p>
                  <ol className="text-sm text-blue-800 space-y-1 list-decimal list-inside">
                    <li>Create a service account in Google Cloud Console</li>
                    <li>Download the JSON key file</li>
                    <li>Set the GOOGLE_APPLICATION_CREDENTIALS environment variable</li>
                    <li>Share your spreadsheet with the service account email</li>
                  </ol>
                </div>
              )}
            </>
          )}

          <div className="flex gap-2">
            <Button 
              onClick={handleConnect}
              disabled={isConnecting || !config.spreadsheetId}
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
            <div className={`p-3 rounded-md text-sm ${
              connectionResult.startsWith('✅') 
                ? 'bg-green-50 text-green-800' 
                : 'bg-red-50 text-red-800'
            }`}>
              {connectionResult}
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
