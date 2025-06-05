'use client';

import { useLastUpdate } from '@/hooks/use-status';

export const HeaderStatus = () => {
  const lastUpdate = useLastUpdate();

  return (
    <div className="text-xs text-muted-foreground">
      Last sync: <span className="text-foreground">{lastUpdate}</span>
    </div>
  );
};
