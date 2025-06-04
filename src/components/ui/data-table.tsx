'use client';

import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';

import { cn } from '@/lib/utils';

// Data Table Container Variants
const dataTableVariants = cva(
  'w-full rounded-lg border bg-card text-card-foreground shadow-sm overflow-hidden',
  {
    variants: {
      size: {
        default: 'text-sm',
        compact: 'text-xs',
        comfortable: 'text-base',
      },
      density: {
        tight: '[&_td]:py-1 [&_th]:py-2',
        normal: '[&_td]:py-2 [&_th]:py-3',
        relaxed: '[&_td]:py-3 [&_th]:py-4',
      },
    },
    defaultVariants: {
      size: 'default',
      density: 'normal',
    },
  }
);

// Table Wrapper with horizontal scroll
const Table = React.forwardRef<
  HTMLTableElement,
  React.HTMLAttributes<HTMLTableElement> &
    VariantProps<typeof dataTableVariants>
>(({ className, size, density, ...props }, ref) => (
  <div className="relative w-full overflow-auto">
    <table
      ref={ref}
      className={cn(
        dataTableVariants({ size, density }),
        'w-full caption-bottom',
        className
      )}
      {...props}
    />
  </div>
));
Table.displayName = 'Table';

// Table Header
const TableHeader = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <thead
    ref={ref}
    className={cn('bg-muted/50 border-b [&_tr]:border-b', className)}
    {...props}
  />
));
TableHeader.displayName = 'TableHeader';

// Table Body
const TableBody = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <tbody
    ref={ref}
    className={cn('[&_tr:last-child]:border-0', className)}
    {...props}
  />
));
TableBody.displayName = 'TableBody';

// Table Footer
const TableFooter = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <tfoot
    ref={ref}
    className={cn(
      'border-t bg-muted/50 font-medium [&>tr]:last:border-b-0',
      className
    )}
    {...props}
  />
));
TableFooter.displayName = 'TableFooter';

// Table Row with hover effects
const TableRow = React.forwardRef<
  HTMLTableRowElement,
  React.HTMLAttributes<HTMLTableRowElement>
>(({ className, ...props }, ref) => (
  <tr
    ref={ref}
    className={cn(
      'border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted',
      className
    )}
    {...props}
  />
));
TableRow.displayName = 'TableRow';

// Table Header Cell with sorting support
const TableHead = React.forwardRef<
  HTMLTableCellElement,
  React.ThHTMLAttributes<HTMLTableCellElement> & {
    sortable?: boolean;
    sortDirection?: 'asc' | 'desc' | null;
  }
>(({ className, sortable, sortDirection, children, ...props }, ref) => (
  <th
    ref={ref}
    className={cn(
      'h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0',
      sortable && 'cursor-pointer select-none hover:bg-muted/50',
      className
    )}
    {...props}
  >
    <div className="flex items-center gap-2">
      {children}
      {sortable && (
        <div className="flex flex-col">
          <div
            className={cn(
              'h-0 w-0 border-l-[3px] border-r-[3px] border-b-[4px] border-transparent',
              sortDirection === 'asc'
                ? 'border-b-foreground'
                : 'border-b-muted-foreground/30'
            )}
          />
          <div
            className={cn(
              'h-0 w-0 border-l-[3px] border-r-[3px] border-t-[4px] border-transparent mt-0.5',
              sortDirection === 'desc'
                ? 'border-t-foreground'
                : 'border-t-muted-foreground/30'
            )}
          />
        </div>
      )}
    </div>
  </th>
));
TableHead.displayName = 'TableHead';

// Table Cell with metric formatting support
const TableCell = React.forwardRef<
  HTMLTableCellElement,
  React.TdHTMLAttributes<HTMLTableCellElement> & {
    numeric?: boolean;
    trend?: 'positive' | 'negative' | 'neutral' | undefined;
  }
>(({ className, numeric, trend, children, ...props }, ref) => (
  <td
    ref={ref}
    className={cn(
      'p-4 align-middle [&:has([role=checkbox])]:pr-0',
      numeric && 'text-right font-mono tabular-nums',
      trend === 'positive' && 'text-trend-positive',
      trend === 'negative' && 'text-trend-negative',
      trend === 'neutral' && 'text-trend-neutral',
      className
    )}
    {...props}
  >
    {children}
  </td>
));
TableCell.displayName = 'TableCell';

// Metric Cell specifically for KPI values
const MetricCell = React.forwardRef<
  HTMLTableCellElement,
  React.TdHTMLAttributes<HTMLTableCellElement> & {
    value: number | string;
    format?: 'currency' | 'percentage' | 'number' | 'decimal';
    trend?: 'positive' | 'negative' | 'neutral' | undefined;
    precision?: number;
  }
>(
  (
    { className, value, format = 'number', trend, precision = 2, ...props },
    ref
  ) => {
    const formatValue = (val: number | string) => {
      const numVal = typeof val === 'string' ? parseFloat(val) : val;

      if (isNaN(numVal)) {
        return val;
      }

      switch (format) {
        case 'currency':
          return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: precision,
          }).format(numVal);
        case 'percentage':
          return `${(numVal * 100).toFixed(precision)}%`;
        case 'decimal':
          return numVal.toFixed(precision);
        default:
          return new Intl.NumberFormat('en-US').format(numVal);
      }
    };

    return (
      <TableCell
        ref={ref}
        className={cn('text-right', className)}
        numeric
        trend={trend}
        {...props}
      >
        <span className="text-metric font-semibold">{formatValue(value)}</span>
      </TableCell>
    );
  }
);
MetricCell.displayName = 'MetricCell';

// Table Caption
const TableCaption = React.forwardRef<
  HTMLTableCaptionElement,
  React.HTMLAttributes<HTMLTableCaptionElement>
>(({ className, ...props }, ref) => (
  <caption
    ref={ref}
    className={cn('mt-4 text-sm text-muted-foreground', className)}
    {...props}
  />
));
TableCaption.displayName = 'TableCaption';

export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
  MetricCell,
};
