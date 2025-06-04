'use client';

import { cva, type VariantProps } from 'class-variance-authority';
import {
  Calendar,
  Download,
  MoreHorizontal,
  RefreshCw,
  Settings,
} from 'lucide-react';
import * as React from 'react';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';

// Page Header Variants
const pageHeaderVariants = cva(
  'flex flex-col space-y-4 pb-6 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60',
  {
    variants: {
      variant: {
        default: 'border-border',
        minimal: 'border-transparent pb-4',
        elevated: 'shadow-sm border-border',
      },
      size: {
        sm: 'pb-4 space-y-2',
        default: 'pb-6 space-y-4',
        lg: 'pb-8 space-y-6',
      },
      sticky: {
        true: 'sticky top-0 z-20',
        false: 'relative',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
      sticky: false,
    },
  }
);

// Breadcrumb Item
export type BreadcrumbItem = {
  label: string;
  href?: string;
  current?: boolean;
};

// Date Range Preset
export type DateRangePreset = {
  label: string;
  value: string;
  days: number;
};

export type PageHeaderProps = {
  title: string;
  description?: string;
  breadcrumbs?: BreadcrumbItem[];
  actions?: React.ReactNode;
  showDatePicker?: boolean;
  selectedDateRange?: string;
  onDateRangeChange?: (range: string) => void;
  dateRangePresets?: DateRangePreset[];
  showRefresh?: boolean;
  onRefresh?: () => void;
  isLoading?: boolean;
  showExport?: boolean;
  onExport?: () => void;
  showSettings?: boolean;
  onSettings?: () => void;
  customActions?: {
    label: string;
    icon?: React.ComponentType<{ className?: string }>;
    onClick: () => void;
    variant?: 'default' | 'outline' | 'ghost';
  }[];
} & React.HTMLAttributes<HTMLDivElement> &
  VariantProps<typeof pageHeaderVariants>;

// Default date range presets
const defaultDatePresets: DateRangePreset[] = [
  { label: 'Last 7 days', value: '7d', days: 7 },
  { label: 'Last 30 days', value: '30d', days: 30 },
  { label: 'Last 90 days', value: '90d', days: 90 },
  { label: 'This month', value: 'month', days: 30 },
  { label: 'This quarter', value: 'quarter', days: 90 },
];

// Main Page Header Component
const PageHeader = React.forwardRef<HTMLDivElement, PageHeaderProps>(
  (
    {
      className,
      variant,
      size,
      sticky,
      title,
      description,
      breadcrumbs,
      actions,
      showDatePicker = false,
      selectedDateRange = '30d',
      onDateRangeChange,
      dateRangePresets = defaultDatePresets,
      showRefresh = false,
      onRefresh,
      isLoading = false,
      showExport = false,
      onExport,
      showSettings = false,
      onSettings,
      customActions = [],
      ...props
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className={cn(pageHeaderVariants({ variant, size, sticky }), className)}
        {...props}
      >
        {/* Breadcrumbs */}
        {breadcrumbs && breadcrumbs.length > 0 && (
          <nav className="flex" aria-label="Breadcrumb">
            <ol className="flex items-center space-x-2 text-sm">
              {breadcrumbs.map((item, index) => (
                <li key={index} className="flex items-center">
                  {index > 0 && (
                    <span className="mx-2 text-muted-foreground">/</span>
                  )}
                  {item.href && !item.current ? (
                    <a
                      href={item.href}
                      className="text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {item.label}
                    </a>
                  ) : (
                    <span
                      className={cn(
                        item.current
                          ? 'text-foreground font-medium'
                          : 'text-muted-foreground'
                      )}
                    >
                      {item.label}
                    </span>
                  )}
                </li>
              ))}
            </ol>
          </nav>
        )}

        {/* Main Header Content */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          {/* Title and Description */}
          <div className="space-y-1">
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              {title}
            </h1>
            {description && (
              <p className="text-muted-foreground max-w-2xl">{description}</p>
            )}
          </div>

          {/* Actions Section */}
          <div className="flex items-center gap-2 flex-wrap">
            {/* Date Range Picker */}
            {showDatePicker && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Calendar className="h-4 w-4 mr-2" />
                    {dateRangePresets.find((p) => p.value === selectedDateRange)
                      ?.label ?? 'Select range'}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuLabel>Date Range</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {dateRangePresets.map((preset) => (
                    <DropdownMenuItem
                      key={preset.value}
                      onClick={() => onDateRangeChange?.(preset.value)}
                      className={cn(
                        selectedDateRange === preset.value &&
                          'bg-accent text-accent-foreground'
                      )}
                    >
                      {preset.label}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            )}

            {/* Refresh Button */}
            {showRefresh && (
              <Button
                variant="outline"
                size="sm"
                onClick={onRefresh}
                disabled={isLoading}
              >
                <RefreshCw
                  className={cn('h-4 w-4', isLoading && 'animate-spin')}
                />
              </Button>
            )}

            {/* Custom Actions */}
            {customActions.map((action, index) => {
              const Icon = action.icon;
              return (
                <Button
                  key={index}
                  variant={action.variant ?? 'outline'}
                  size="sm"
                  onClick={action.onClick}
                >
                  {Icon && <Icon className="h-4 w-4 mr-2" />}
                  {action.label}
                </Button>
              );
            })}

            {/* More Actions Dropdown */}
            {(showExport || showSettings) && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {showExport && (
                    <DropdownMenuItem onClick={onExport}>
                      <Download className="h-4 w-4 mr-2" />
                      Export Data
                    </DropdownMenuItem>
                  )}
                  {showSettings && (
                    <DropdownMenuItem onClick={onSettings}>
                      <Settings className="h-4 w-4 mr-2" />
                      Settings
                    </DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            )}

            {/* Custom Actions Node */}
            {actions}
          </div>
        </div>
      </div>
    );
  }
);
PageHeader.displayName = 'PageHeader';

// Simple Breadcrumb Component
const Breadcrumb = React.forwardRef<
  HTMLElement,
  {
    items: BreadcrumbItem[];
    separator?: string;
    className?: string;
  }
>(({ items, separator = '/', className }, ref) => (
  <nav ref={ref} className={cn('flex', className)} aria-label="Breadcrumb">
    <ol className="flex items-center space-x-2 text-sm">
      {items.map((item, index) => (
        <li key={index} className="flex items-center">
          {index > 0 && (
            <span className="mx-2 text-muted-foreground">{separator}</span>
          )}
          {item.href && !item.current ? (
            <a
              href={item.href}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              {item.label}
            </a>
          ) : (
            <span
              className={cn(
                item.current
                  ? 'text-foreground font-medium'
                  : 'text-muted-foreground'
              )}
            >
              {item.label}
            </span>
          )}
        </li>
      ))}
    </ol>
  </nav>
));
Breadcrumb.displayName = 'Breadcrumb';

// Page Title Component for simpler use cases
const PageTitle = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement> & {
    level?: 1 | 2 | 3;
    description?: string;
  }
>(({ className, level = 1, description, children, ...props }, ref) => {
  return (
    <div className="space-y-1">
      {level === 1 && (
        <h1
          ref={ref as React.RefObject<HTMLHeadingElement>}
          className={cn(
            'font-bold tracking-tight text-foreground text-2xl',
            className
          )}
          {...props}
        >
          {children}
        </h1>
      )}
      {level === 2 && (
        <h2
          ref={ref as React.RefObject<HTMLHeadingElement>}
          className={cn(
            'font-bold tracking-tight text-foreground text-xl',
            className
          )}
          {...props}
        >
          {children}
        </h2>
      )}
      {level === 3 && (
        <h3
          ref={ref as React.RefObject<HTMLHeadingElement>}
          className={cn(
            'font-bold tracking-tight text-foreground text-lg',
            className
          )}
          {...props}
        >
          {children}
        </h3>
      )}
      {description && <p className="text-muted-foreground">{description}</p>}
    </div>
  );
});
PageTitle.displayName = 'PageTitle';

export { PageHeader, Breadcrumb, PageTitle, pageHeaderVariants };
