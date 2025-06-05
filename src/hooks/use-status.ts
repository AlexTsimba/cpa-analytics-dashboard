'use client';

import { useEffect, useState } from 'react';

export function useLastUpdate(intervalMs = 60000) {
  const [lastUpdate, setLastUpdate] = useState<string>('just now');

  useEffect(() => {
    const updateTime = () => {
      setLastUpdate('just now');
    };

    // Update immediately after mount
    updateTime();

    const interval = setInterval(updateTime, intervalMs);

    return () => clearInterval(interval);
  }, [intervalMs]);

  // Always return the same value during SSR and initial render
  return lastUpdate;
}

export function useConnectionStatus() {
  const [isOnline, setIsOnline] = useState(true); // Always start with true

  useEffect(() => {
    // Only set actual online status after mount
    if (typeof navigator !== 'undefined') {
      setIsOnline(navigator.onLine);
    }

    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    if (typeof window !== 'undefined') {
      window.addEventListener('online', handleOnline);
      window.addEventListener('offline', handleOffline);
    }

    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('online', handleOnline);
        window.removeEventListener('offline', handleOffline);
      }
    };
  }, []);

  return isOnline;
}
