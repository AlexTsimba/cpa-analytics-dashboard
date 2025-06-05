'use client';

import { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';

interface HydrationSafeBadgeProps {
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
}

export function HydrationSafeBadge({
  children,
  variant = 'secondary',
  className = '',
  fallback = '...',
}: HydrationSafeBadgeProps) {
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
}
