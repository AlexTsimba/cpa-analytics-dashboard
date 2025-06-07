# Sidebar Backup - TraffBoard Navigation Structure

## Navigation Items

```typescript
const NAVIGATION_ITEMS: NavItem[] = [
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
] as const;

const BOTTOM_NAV_ITEMS: NavItem[] = [
  {
    title: 'Settings',
    href: '/settings',
    icon: Settings,
  },
] as const;
```

## Custom CSS Classes Used

- sidebar-shadow
- nav-item-hover
- tooltip-dark

## App Structure

- SidebarProvider wrapping the app
- SidebarInset for main content
- SidebarTrigger in header
- AppSidebar component with TraffBoard branding

## Header Integration

```typescript
<header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
  <div className="flex items-center gap-2 px-4">
    <SidebarTrigger className="-ml-1" />
    <Separator orientation="vertical" className="mr-2 h-4" />
    <PageTitle />
  </div>
  <div className="flex items-center gap-4 ml-auto px-4">
    <HeaderStatus />
    <ThemeToggle />
  </div>
</header>
```
