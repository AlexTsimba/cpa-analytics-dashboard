'use client';

import { cva, type VariantProps } from 'class-variance-authority';
import { ChevronDown, Filter, X } from 'lucide-react';
import * as React from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

// Helper function to get input type
const getInputType = (filterType: string): string => {
  if (filterType === 'date') return 'date';
  if (filterType === 'number') return 'number';
  return 'text';
};

// Filter Container Variants
const filterBarVariants = cva(
  'flex flex-wrap items-center gap-3 p-4 rounded-lg border bg-card/50 backdrop-blur-sm',
  {
    variants: {
      variant: {
        default: 'border-border',
        elevated: 'shadow-sm',
        compact: 'p-2 gap-2',
      },
      position: {
        top: 'sticky top-0 z-10',
        static: 'relative',
        floating: 'sticky top-4 z-10 mx-4',
      },
    },
    defaultVariants: {
      variant: 'default',
      position: 'static',
    },
  }
);

// Filter Item Interface
export type FilterItem = {
  id: string;
  label: string;
  value: string | number | boolean;
  type: 'text' | 'select' | 'date' | 'number' | 'boolean';
  options?: { label: string; value: string | number }[];
};

// Active Filter Interface
export type ActiveFilter = {
  id: string;
  label: string;
  value: string;
  displayValue?: string;
};

export type FilterBarProps = {
  filters?: FilterItem[];
  activeFilters?: ActiveFilter[];
  onFilterAdd?: (filter: FilterItem, value: string | number | boolean) => void;
  onFilterRemove?: (filterId: string) => void;
  onFiltersClear?: () => void;
  searchPlaceholder?: string;
  showFilterCount?: boolean;
} & React.HTMLAttributes<HTMLDivElement> &
  VariantProps<typeof filterBarVariants>;

// Main Filter Bar Component
const FilterBar = React.forwardRef<HTMLDivElement, FilterBarProps>(
  (
    {
      className,
      variant,
      position,
      filters = [],
      activeFilters = [],
      onFilterAdd,
      onFilterRemove,
      onFiltersClear,
      searchPlaceholder = 'Search...',
      showFilterCount = true,
      ...props
    },
    ref
  ) => {
    const [isOpen, setIsOpen] = React.useState(false);
    const [searchTerm, setSearchTerm] = React.useState('');

    return (
      <div
        ref={ref}
        className={cn(filterBarVariants({ variant, position }), className)}
        {...props}
      >
        {/* Search Input */}
        <div className="relative flex-1 min-w-64">
          <input
            type="text"
            placeholder={searchPlaceholder}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full h-9 px-3 py-1 text-sm bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
          />
        </div>

        {/* Filter Toggle Button */}
        {filters.length > 0 && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsOpen(!isOpen)}
            className="shrink-0"
          >
            <Filter className="h-4 w-4 mr-2" />
            Filters
            {showFilterCount && activeFilters.length > 0 && (
              <Badge variant="secondary" className="ml-2 h-5 w-5 p-0 text-xs">
                {activeFilters.length}
              </Badge>
            )}
            <ChevronDown
              className={cn(
                'h-4 w-4 ml-2 transition-transform',
                isOpen && 'rotate-180'
              )}
            />
          </Button>
        )}

        {/* Active Filters */}
        {activeFilters.length > 0 && (
          <div className="flex flex-wrap items-center gap-2">
            {activeFilters.map((filter) => (
              <Badge
                key={filter.id}
                variant="secondary"
                className="flex items-center gap-1 px-2 py-1"
              >
                <span className="text-xs">
                  {filter.label}: {filter.displayValue ?? filter.value}
                </span>
                <button
                  onClick={() => onFilterRemove?.(filter.id)}
                  className="ml-1 hover:bg-muted rounded-sm p-0.5"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}

            {/* Clear All Button */}
            {activeFilters.length > 1 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onFiltersClear}
                className="h-6 px-2 text-xs text-muted-foreground hover:text-foreground"
              >
                Clear all
              </Button>
            )}
          </div>
        )}

        {/* Expandable Filter Options */}
        {isOpen && filters.length > 0 && (
          <div className="w-full border-t pt-3 mt-3">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
              {filters.map((filter) => (
                <FilterOption
                  key={filter.id}
                  filter={filter}
                  onSelect={(value) => {
                    onFilterAdd?.(filter, value);
                    // Don't close for multi-select scenarios
                  }}
                  isActive={activeFilters.some((af) => af.id === filter.id)}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }
);
FilterBar.displayName = 'FilterBar';

// Individual Filter Option Component
const FilterOption = React.forwardRef<
  HTMLDivElement,
  {
    filter: FilterItem;
    onSelect: (value: string | number | boolean) => void;
    isActive?: boolean;
  }
>(({ filter, onSelect, isActive }, ref) => {
  const [value, setValue] = React.useState<string>('');

  const handleSubmit = () => {
    if (!value.trim()) {
      return;
    }

    let processedValue: string | number | boolean = value;

    if (filter.type === 'number') {
      processedValue = parseFloat(value);
      if (isNaN(processedValue)) {
        return;
      }
    } else if (filter.type === 'boolean') {
      processedValue = value === 'true';
    }

    onSelect(processedValue);
    setValue('');
  };

  if (filter.type === 'select' && filter.options) {
    return (
      <div ref={ref} className="space-y-2">
        <label className="text-sm font-medium text-muted-foreground">
          {filter.label}
        </label>
        <select
          className={cn(
            'w-full h-9 px-3 py-1 text-sm bg-background border border-input rounded-md',
            'focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent',
            isActive && 'border-primary'
          )}
          onChange={(e) => {
            if (e.target.value) {
              onSelect(e.target.value);
            }
          }}
        >
          <option value="">Select {filter.label}</option>
          {filter.options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    );
  }

  return (
    <div ref={ref} className="space-y-2">
      <label className="text-sm font-medium text-muted-foreground">
        {filter.label}
      </label>
      <div className="flex gap-2">
        <input
          type={getInputType(filter.type)}
          placeholder={`Enter ${filter.label.toLowerCase()}`}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
          className={cn(
            'flex-1 h-9 px-3 py-1 text-sm bg-background border border-input rounded-md',
            'focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent',
            isActive && 'border-primary'
          )}
        />
        <Button
          size="sm"
          onClick={handleSubmit}
          disabled={!value.trim()}
          className="shrink-0"
        >
          Add
        </Button>
      </div>
    </div>
  );
});
FilterOption.displayName = 'FilterOption';

// Quick Filter Chips Component
const QuickFilters = React.forwardRef<
  HTMLDivElement,
  {
    filters: { label: string; value: string; count?: number }[];
    onFilterSelect: (value: string) => void;
    className?: string;
  }
>(({ filters, onFilterSelect, className }, ref) => (
  <div ref={ref} className={cn('flex flex-wrap gap-2', className)}>
    {filters.map((filter, index) => (
      <button
        key={index}
        onClick={() => onFilterSelect(filter.value)}
        className={cn(
          'inline-flex items-center gap-2 px-3 py-1 text-sm rounded-full',
          'border border-input hover:bg-accent hover:text-accent-foreground',
          'transition-colors focus:outline-none focus:ring-2 focus:ring-ring'
        )}
      >
        {filter.label}
        {filter.count && (
          <Badge variant="secondary" className="h-4 w-4 p-0 text-xs">
            {filter.count}
          </Badge>
        )}
      </button>
    ))}
  </div>
));
QuickFilters.displayName = 'QuickFilters';

export { FilterBar, QuickFilters, filterBarVariants };
