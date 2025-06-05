'use client';

import { useEffect, useState } from 'react';
import { Badge } from '@/components/ui/badge';

type HydrationSafeBadgeProps = {
  children: React.ReactNode;
  variant?:
    | 'default'
    | 'secondary'
    | 'destructive'
    | 'outline'
    | 'success'
    | 'warning'
    | 'info';
  className?: string;
  fallback?: React.ReactNode;
};

export const HydrationSafeBadge = ({
  children,
  variant = 'secondary',
  className = '',
  fallback = '...',
}: HydrationSafeBadgeProps) => {
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  if (!hasMounted) {
    return (
      <Badge variant={variant} className={className}>
        {fallback}
      </Badge>
    );
  }

  return (
    <Badge variant={variant} className={className}>
      {children}
    </Badge>
  );
};
