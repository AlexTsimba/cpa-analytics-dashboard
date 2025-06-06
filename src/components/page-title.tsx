'use client';

import { usePathname } from 'next/navigation';

const getPageTitle = (pathname: string): string => {
  if (pathname === '/') return 'Affiliate Dashboard';
  if (pathname === '/conversions') return 'Conversions';
  if (pathname === '/quality') return 'Quality Report';
  if (pathname === '/quality/cohorts') return 'Cohorts Analysis';
  if (pathname === '/settings') return 'Settings';

  // Default fallback - capitalize the path
  const segments = pathname.split('/').filter(Boolean);
  const lastSegment = segments[segments.length - 1];
  return lastSegment
    ? lastSegment.charAt(0).toUpperCase() + lastSegment.slice(1)
    : 'Dashboard';
};

export const PageTitle = () => {
  const pathname = usePathname();
  const title = getPageTitle(pathname);

  return <h1 className="text-lg font-semibold text-foreground">{title}</h1>;
};
