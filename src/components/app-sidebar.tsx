/**
 * App Sidebar Component - Sidebar-07 Style
 *
 * Keitaro-inspired collapsible sidebar that reduces to icons
 * Professional affiliate management navigation with modern shadcn/ui foundation
 */

'use client';

import * as React from 'react';
import Link from 'next/link';
import {
  BarChart3,
  ChevronUp,
  Home,
  Settings,
  Target,
  TrendingUp,
  User2,
} from 'lucide-react';
import { usePathname } from 'next/navigation';

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { HydrationSafeBadge } from '@/components/hydration-safe-badge';
import { useConnectionStatus, useLastUpdate } from '@/hooks/use-status';

type NavItem = {
  title: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
};

const navigationItems: NavItem[] = [
  {
    title: 'Overview',
    href: '/',
    icon: Home,
    badge: 'Live',
  },
  {
    title: 'Conversions',
    href: '/conversions',
    icon: Target,
  },
  {
    title: 'Quality',
    href: '/quality',
    icon: TrendingUp,
  },
  {
    title: 'Cohorts',
    href: '/quality/cohorts',
    icon: User2,
  },
];

const bottomNavItems: NavItem[] = [
  {
    title: 'Settings',
    href: '/settings',
    icon: Settings,
  },
];

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === '/') {
      return pathname === '/';
    }
    return pathname.startsWith(href);
  };

  // Dynamic status components
  const StatusBadge = () => {
    const isOnline = useConnectionStatus();
    return (
      <HydrationSafeBadge
        variant={isOnline ? 'secondary' : 'destructive'}
        className="text-xs px-2 py-1"
        fallback="Online"
      >
        {isOnline ? 'Online' : 'Offline'}
      </HydrationSafeBadge>
    );
  };

  const LastUpdateTime = () => {
    const lastUpdate = useLastUpdate();
    return (
      <span className="font-medium text-sidebar-foreground">{lastUpdate}</span>
    );
  };

  return (
    <Sidebar collapsible="icon" className="sidebar-shadow" {...props}>
      {/* Header */}
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild className="nav-item-hover">
              <Link href="/" className="flex items-center gap-3">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <BarChart3 className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">Keitaro</span>
                  <span className="truncate text-xs opacity-80">
                    Affiliate Tracker
                  </span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      {/* Main Navigation */}
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Platform</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton
                    asChild
                    isActive={isActive(item.href)}
                    tooltip={item.title}
                    className="nav-item-hover"
                  >
                    <Link href={item.href} className="flex items-center">
                      <item.icon className="size-4" />
                      <span>{item.title}</span>
                      {item.badge && (
                        <Badge variant="secondary" className="ml-auto text-xs">
                          {item.badge}
                        </Badge>
                      )}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Settings Section */}
        <SidebarGroup className="mt-auto">
          <SidebarGroupContent>
            <SidebarMenu>
              {bottomNavItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton
                    asChild
                    isActive={isActive(item.href)}
                    tooltip={item.title}
                    className="nav-item-hover"
                  >
                    <Link href={item.href} className="flex items-center">
                      <item.icon className="size-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* Footer */}
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size="lg"
                  className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground nav-item-hover"
                >
                  <User2 className="size-4" />
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">shadcn</span>
                    <span className="truncate text-xs opacity-80">
                      m@example.com
                    </span>
                  </div>
                  <ChevronUp className="ml-auto size-4" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-[--radix-select-trigger-width] min-w-56 rounded-lg tooltip-dark"
                side="bottom"
                align="end"
                sideOffset={4}
              >
                <DropdownMenuItem>
                  <User2 className="mr-2 size-4" />
                  Account
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings className="mr-2 size-4" />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <span className="mr-2 size-4" />
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>

        {/* Status Information */}
        <div className="px-3 py-2 text-xs text-sidebar-foreground/70 card-enhanced rounded-md mx-2">
          <div className="flex items-center justify-between mb-2">
            <span className="font-medium">Status</span>
            <StatusBadge />
          </div>
          <div className="flex items-center justify-between py-1">
            <span className="opacity-80">Data Sync</span>
            <span className="font-medium text-sidebar-foreground">
              Real-time
            </span>
          </div>
          <div className="flex items-center justify-between py-1">
            <span className="opacity-80">Last Update</span>
            <LastUpdateTime />
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
