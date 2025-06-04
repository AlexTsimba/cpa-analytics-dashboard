'use client';

import { cva, type VariantProps } from 'class-variance-authority';
import { Minus, TrendingDown, TrendingUp } from 'lucide-react';
import * as React from 'react';

import { cn } from '@/lib/utils';

// KPI Card Variants
const kpiCardVariants = cva(
  'rounded-lg border bg-card text-card-foreground shadow-sm transition-all duration-200',
  {
    variants: {
      variant: {
        default: 'hover:shadow-md',
        elevated: 'shadow-lg hover:shadow-xl',
        flat: 'shadow-none border-muted',
        outlined: 'border-2 shadow-none hover:shadow-sm',
      },
      size: {
        sm: 'p-3',
        default: 'p-4',
        lg: 'p-6',
      },
      trend: {
        positive: 'border-l-4 border-l-chart-1',
        negative: 'border-l-4 border-l-destructive',
        neutral: 'border-l-4 border-l-muted-foreground',
        none: '',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
      trend: 'none',
    },
  }
);

export type KpiCardProps = {
  title: string;
  value: string | number;
  previousValue?: string | number;
  format?: 'currency' | 'percentage' | 'number' | 'decimal';
  precision?: number;
  loading?: boolean;
  error?: boolean;
} & React.HTMLAttributes<HTMLDivElement> &
  VariantProps<typeof kpiCardVariants>;

// Main KPI Card Component
const KpiCard = React.forwardRef<HTMLDivElement, KpiCardProps>(
  (
    {
      className,
      variant,
      size,
      trend: trendProp,
      title,
      value,
      previousValue,
      format = 'number',
      precision = 2,
      loading = false,
      error = false,
      ...props
    },
    ref
  ) => {
    // Calculate trend if previous value is provided
    const trend = React.useMemo(() => {
      if (trendProp) {
        return trendProp;
      }
      if (!previousValue || loading || error) {
        return 'none';
      }

      const current = typeof value === 'string' ? parseFloat(value) : value;
      const previous =
        typeof previousValue === 'string'
          ? parseFloat(previousValue)
          : previousValue;

      if (isNaN(current) || isNaN(previous)) {
        return 'none';
      }
      if (current > previous) {
        return 'positive';
      }
      if (current < previous) {
        return 'negative';
      }
      return 'neutral';
    }, [value, previousValue, trendProp, loading, error]);

    // Format value based on type
    const formatValue = (val: string | number) => {
      if (loading) {
        return '---';
      }
      if (error) {
        return 'Error';
      }

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
            maximumFractionDigits: precision,
          }).format(numVal);
        case 'percentage':
          return `${(numVal * 100).toFixed(precision)}%`;
        case 'decimal':
          return numVal.toFixed(precision);
        default:
          return new Intl.NumberFormat('en-US').format(numVal);
      }
    };

    // Calculate percentage change
    const getPercentageChange = () => {
      if (!previousValue || loading || error) {
        return null;
      }

      const current = typeof value === 'string' ? parseFloat(value) : value;
      const previous =
        typeof previousValue === 'string'
          ? parseFloat(previousValue)
          : previousValue;

      if (isNaN(current) || isNaN(previous) || previous === 0) {
        return null;
      }

      const change = ((current - previous) / previous) * 100;
      return change.toFixed(1);
    };

    const percentageChange = getPercentageChange();

    // Trend icon component
    const TrendIcon = () => {
      if (trend === 'positive') {
        return <TrendingUp className="h-4 w-4" />;
      }
      if (trend === 'negative') {
        return <TrendingDown className="h-4 w-4" />;
      }
      if (trend === 'neutral') {
        return <Minus className="h-4 w-4" />;
      }
      return null;
    };

    return (
      <div
        ref={ref}
        className={cn(kpiCardVariants({ variant, size, trend }), className)}
        {...props}
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium text-muted-foreground tracking-tight">
            {title}
          </h3>
          {trend !== 'none' && (
            <div
              className={cn(
                'flex items-center gap-1 text-xs font-medium',
                trend === 'positive' && 'text-chart-1',
                trend === 'negative' && 'text-destructive',
                trend === 'neutral' && 'text-muted-foreground'
              )}
            >
              <TrendIcon />
              {percentageChange && (
                <span>{Math.abs(parseFloat(percentageChange))}%</span>
              )}
            </div>
          )}
        </div>

        {/* Value */}
        <div className="mt-2">
          <div
            className={cn(
              'text-2xl font-bold text-kpi tabular-nums',
              loading && 'animate-pulse text-muted-foreground',
              error && 'text-destructive'
            )}
          >
            {formatValue(value)}
          </div>

          {/* Previous value comparison */}
          {previousValue && !loading && !error && (
            <p className="text-xs text-muted-foreground mt-1">
              vs {formatValue(previousValue)} previous
            </p>
          )}
        </div>

        {/* Loading state overlay */}
        {loading && (
          <div className="absolute inset-0 bg-background/50 rounded-lg flex items-center justify-center">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          </div>
        )}
      </div>
    );
  }
);
KpiCard.displayName = 'KpiCard';

// Compact KPI variant for dense layouts
const KpiMetric = React.forwardRef<
  HTMLDivElement,
  {
    label: string;
    value: string | number;
    format?: 'currency' | 'percentage' | 'number' | 'decimal';
    precision?: number;
    className?: string;
  }
>(
  (
    { label, value, format = 'number', precision = 2, className, ...props },
    ref
  ) => {
    const formatValue = (val: string | number) => {
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
      <div
        ref={ref}
        className={cn('flex flex-col space-y-1', className)}
        {...props}
      >
        <span className="text-xs text-muted-foreground font-medium">
          {label}
        </span>
        <span className="text-lg font-semibold text-metric tabular-nums">
          {formatValue(value)}
        </span>
      </div>
    );
  }
);
KpiMetric.displayName = 'KpiMetric';

export { KpiCard, KpiMetric, kpiCardVariants };
