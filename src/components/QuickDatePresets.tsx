import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { X, Zap } from 'lucide-react';
import { addDays, addHours, startOfDay, endOfDay, subDays, subHours, subWeeks, subMonths, format } from 'date-fns';

interface FilterState {
  modifiedDate: { from?: Date; to?: Date };
  createdOn: { from?: Date; to?: Date };
  visitTimestamp: { from?: Date; to?: Date };
}

interface QuickDatePresetsProps {
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
}

const QuickDatePresets: React.FC<QuickDatePresetsProps> = ({ filters, onFilterChange }) => {
  const now = new Date();

  const presets = [
    {
      label: 'Today',
      getValue: () => ({
        from: startOfDay(now),
        to: endOfDay(now)
      })
    },
    {
      label: 'Yesterday',
      getValue: () => ({
        from: startOfDay(subDays(now, 1)),
        to: endOfDay(subDays(now, 1))
      })
    },
    {
      label: 'Last 1 Hour',
      getValue: () => ({
        from: subHours(now, 1),
        to: now
      })
    },
    {
      label: 'Last 4 Hours',
      getValue: () => ({
        from: subHours(now, 4),
        to: now
      })
    },
    {
      label: 'Last 1 Day',
      getValue: () => ({
        from: subDays(now, 1),
        to: now
      })
    },
    {
      label: 'Last 3 Days',
      getValue: () => ({
        from: subDays(now, 3),
        to: now
      })
    },
    {
      label: 'Last 1 Week',
      getValue: () => ({
        from: subWeeks(now, 1),
        to: now
      })
    },
    {
      label: 'Last 1 Month',
      getValue: () => ({
        from: subMonths(now, 1),
        to: now
      })
    }
  ];

  const handlePresetClick = (preset: typeof presets[0]) => {
    const dateRange = preset.getValue();
    // Apply to visitTimestamp by default, but this could be made configurable
    onFilterChange({
      ...filters,
      visitTimestamp: dateRange
    });
  };

  const clearAllFilters = () => {
    onFilterChange({
      modifiedDate: {},
      createdOn: {},
      visitTimestamp: {}
    });
  };

  const getActiveFilters = () => {
    const active = [];
    
    if (filters.modifiedDate.from || filters.modifiedDate.to) {
      active.push({
        type: 'Modified Date',
        range: filters.modifiedDate,
        onRemove: () => onFilterChange({ ...filters, modifiedDate: {} })
      });
    }
    
    if (filters.createdOn.from || filters.createdOn.to) {
      active.push({
        type: 'Created On',
        range: filters.createdOn,
        onRemove: () => onFilterChange({ ...filters, createdOn: {} })
      });
    }
    
    if (filters.visitTimestamp.from || filters.visitTimestamp.to) {
      active.push({
        type: 'Visit Time',
        range: filters.visitTimestamp,
        onRemove: () => onFilterChange({ ...filters, visitTimestamp: {} })
      });
    }

    return active;
  };

  const formatDateRange = (range: { from?: Date; to?: Date }) => {
    if (!range.from && !range.to) return '';
    
    if (range.from && range.to) {
      return `${format(range.from, 'dd/MM/yyyy HH:mm')} - ${format(range.to, 'dd/MM/yyyy HH:mm')}`;
    } else if (range.from) {
      return `From ${format(range.from, 'dd/MM/yyyy HH:mm')}`;
    } else if (range.to) {
      return `Until ${format(range.to, 'dd/MM/yyyy HH:mm')}`;
    }
    
    return '';
  };

  const activeFilters = getActiveFilters();

  return (
    <Card className="border-border bg-card">
      <CardContent className="p-5">
        <div className="space-y-5">
          {/* Quick Date Presets */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Zap className="h-4 w-4 text-primary" />
              <h3 className="text-sm font-medium text-foreground">Quick Date Presets</h3>
            </div>
            
            <div className="flex flex-wrap gap-2">
              {presets.map((preset) => (
                <Button
                  key={preset.label}
                  variant="outline"
                  size="sm"
                  onClick={() => handlePresetClick(preset)}
                  className="h-8 px-3 text-xs font-medium hover:bg-primary hover:text-primary-foreground"
                >
                  {preset.label}
                </Button>
              ))}
              
              {activeFilters.length > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearAllFilters}
                  className="h-8 px-3 text-xs font-medium text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                >
                  Clear All
                </Button>
              )}
            </div>
          </div>

          {/* Active Filters */}
          {activeFilters.length > 0 && (
            <div className="space-y-3">
              <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                Active Filters
              </h4>
              
              <div className="flex flex-wrap gap-2">
                {activeFilters.map((filter, index) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="h-8 px-3 text-xs font-medium bg-primary/10 text-primary hover:bg-primary/20 group"
                  >
                    <span className="flex items-center gap-2">
                      {filter.type}: {formatDateRange(filter.range)}
                      <button
                        onClick={filter.onRemove}
                        className="ml-1 rounded-full hover:bg-primary/20 p-0.5"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default QuickDatePresets;