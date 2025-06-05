/**
 * Sidebar Navigation Component
 *
 * Keitaro-inspired professional navigation for affiliate management
 * Optimized for quick access to core functionality
 */

'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

type NavItem = {
  title: string;
  href: string;
  icon?: string;
  badge?: string;
  children?: NavItem[];
};

const navigationItems: NavItem[] = [
  {
    title: 'Overview',
    href: '/',
    icon: '📊',
    badge: 'Live',
  },
  {
    title: 'Conversions',
    href: '/conversions',
    icon: '🎯',
    children: [
      {
        title: 'Funnel Analysis',
        href: '/conversions/funnel',
      },
      {
        title: 'Attribution',
        href: '/conversions/attribution',
      },
      {
        title: 'Events',
        href: '/conversions/events',
      },
    ],
  },
  {
    title: 'Quality',
    href: '/quality',
    icon: '📈',
    children: [
      {
        title: 'Cohorts',
        href: '/quality/cohorts',
      },
      {
        title: 'Campaigns',
        href: '/quality/campaigns',
      },
      {
        title: 'Traffic Quality',
        href: '/quality/traffic',
      },
    ],
  },
];

type SidebarProps = {
  className?: string;
};

export const Sidebar = ({ className }: SidebarProps) => {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === '/') {
      return pathname === '/';
    }
    return pathname.startsWith(href);
  };

  const hasActiveChild = (item: NavItem) => {
    return item.children?.some((child) => isActive(child.href)) ?? false;
  };

  return (
    <div
      className={cn(
        'flex h-full w-64 flex-col bg-card border-r border-border',
        className
      )}
    >
      {/* Header */}
      <div className="flex h-16 items-center border-b border-border px-4">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-md bg-primary flex items-center justify-center">
            <span className="text-primary-foreground text-sm font-semibold">
              K
            </span>
          </div>
          <div>
            <h2 className="text-sm font-semibold text-foreground">Keitaro</h2>
            <p className="text-xs text-muted-foreground">Affiliate Tracker</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 p-4">
        {navigationItems.map((item) => (
          <div key={item.href} className="space-y-1">
            <Link href={item.href}>
              <Button
                variant={
                  isActive(item.href) || hasActiveChild(item)
                    ? 'secondary'
                    : 'ghost'
                }
                className={cn(
                  'w-full justify-start text-sm font-medium',
                  (isActive(item.href) || hasActiveChild(item)) &&
                    'bg-secondary/80'
                )}
              >
                {item.icon && (
                  <span className="mr-3 text-base">{item.icon}</span>
                )}
                <span className="flex-1 text-left">{item.title}</span>
                {item.badge && (
                  <Badge variant="success" className="ml-auto text-xs">
                    {item.badge}
                  </Badge>
                )}
              </Button>
            </Link>

            {/* Sub-navigation */}
            {item.children && (isActive(item.href) || hasActiveChild(item)) && (
              <div className="ml-6 space-y-1">
                {item.children.map((child) => (
                  <Link key={child.href} href={child.href}>
                    <Button
                      variant={isActive(child.href) ? 'secondary' : 'ghost'}
                      size="sm"
                      className={cn(
                        'w-full justify-start text-xs',
                        isActive(child.href) &&
                          'bg-secondary text-secondary-foreground'
                      )}
                    >
                      <span className="mr-2 h-1 w-1 rounded-full bg-muted-foreground" />
                      {child.title}
                    </Button>
                  </Link>
                ))}
              </div>
            )}
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className="border-t border-border p-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Status</span>
            <Badge variant="success" className="text-xs">
              Online
            </Badge>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Data Sync</span>
            <span className="text-foreground">Real-time</span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Last Update</span>
            <span className="text-muted-foreground">1m ago</span>
          </div>
        </div>
      </div>
    </div>
  );
};
