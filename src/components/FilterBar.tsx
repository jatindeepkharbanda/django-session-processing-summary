import React from 'react';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Card, CardContent } from '@/components/ui/card';
import { CalendarIcon, X } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import type { DateRange } from 'react-day-picker';
import { useToast } from '@/hooks/use-toast';

interface FilterState {
  modifiedDate: { from?: Date; to?: Date };
  createdOn: { from?: Date; to?: Date };
  visitTimestamp: { from?: Date; to?: Date };
}

interface FilterBarProps {
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
}

interface DateRangePickerProps {
  label: string;
  value: { from?: Date; to?: Date };
  onChange: (range: { from?: Date; to?: Date }) => void;
}

const DateRangePicker: React.FC<DateRangePickerProps> = ({ label, value, onChange }) => {
  const [isOpen, setIsOpen] = React.useState(false);

  const handleSelect = (range: DateRange | undefined) => {
    const newRange = range || { from: undefined, to: undefined };
    onChange(newRange);
    
    // Auto-close when both dates are selected
    if (newRange.from && newRange.to) {
      setIsOpen(false);
    }
  };

  const clearFilter = () => {
    onChange({ from: undefined, to: undefined });
    setIsOpen(false);
  };

  const hasValue = value.from || value.to;

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className={cn(
            'w-full justify-start text-left font-normal h-8 px-2 text-xs',
            !hasValue && 'text-muted-foreground'
          )}
        >
          <CalendarIcon className="mr-1.5 h-3 w-3" />
          {hasValue ? (
            <>
              {value.from ? format(value.from, 'dd/MM') : 'Start'} - {' '}
              {value.to ? format(value.to, 'dd/MM/yy') : 'End'}
            </>
          ) : (
            'Select range'
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <div className="p-3">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-medium text-sm">{label}</h4>
            {hasValue && (
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6"
                onClick={clearFilter}
              >
                <X className="h-3 w-3" />
              </Button>
            )}
          </div>
          <Calendar
            mode="range"
            selected={value.from || value.to ? value as DateRange : undefined}
            onSelect={handleSelect}
            numberOfMonths={2}
            className="pointer-events-auto"
          />
        </div>
      </PopoverContent>
    </Popover>
  );
};

export const FilterBar: React.FC<FilterBarProps> = ({ filters, onFilterChange }) => {
  const { toast } = useToast();
  
  const handleFilterUpdate = (
    filterType: keyof FilterState,
    range: { from?: Date; to?: Date }
  ) => {
    // Check which filters are currently active and will be removed
    const removedFilters = [];
    
    if (filterType !== 'visitTimestamp' && (filters.visitTimestamp.from || filters.visitTimestamp.to)) {
      removedFilters.push('Visit Timestamp');
    }
    if (filterType !== 'createdOn' && (filters.createdOn.from || filters.createdOn.to)) {
      removedFilters.push('Created On');
    }
    if (filterType !== 'modifiedDate' && (filters.modifiedDate.from || filters.modifiedDate.to)) {
      removedFilters.push('Modified Date');
    }
    
    // Clear all filters and apply only the selected one
    const newFilters = {
      visitTimestamp: {},
      createdOn: {},
      modifiedDate: {},
      [filterType]: range
    };
    
    onFilterChange(newFilters);
    
    // Show toast for removed filters if any were active and a new range is being set
    if (removedFilters.length > 0 && (range.from || range.to)) {
      const filterDisplayNames = {
        visitTimestamp: 'Visit Timestamp',
        createdOn: 'Created On',
        modifiedDate: 'Modified Date'
      };
      
      toast({
        title: "Filter Replaced",
        description: `Removed ${removedFilters.join(', ')} filter${removedFilters.length > 1 ? 's' : ''} and applied new ${filterDisplayNames[filterType]} filter.`,
        duration: 3000,
      });
    }
  };

  const clearAllFilters = () => {
    onFilterChange({
      modifiedDate: {},
      createdOn: {},
      visitTimestamp: {},
    });
  };

  const hasActiveFilters = 
    filters.modifiedDate.from || filters.modifiedDate.to ||
    filters.createdOn.from || filters.createdOn.to ||
    filters.visitTimestamp.from || filters.visitTimestamp.to;

  return (
    <Card className="border-border bg-card">
      <CardContent className="p-5">
        <div className="space-y-5">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-medium text-foreground">Filter Data</h2>
            {hasActiveFilters && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearAllFilters}
                className="h-7 px-2 text-xs text-muted-foreground hover:text-destructive hover:bg-destructive/10"
              >
                <X className="mr-1 h-3 w-3" />
                Clear All
              </Button>
            )}
          </div>
          
          <div className="grid grid-cols-3 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                Visit Timestamp
              </label>
              <DateRangePicker
                label="Visit Timestamp"
                value={filters.visitTimestamp}
                onChange={(range) => handleFilterUpdate('visitTimestamp', range)}
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                Created On
              </label>
              <DateRangePicker
                label="Created On"
                value={filters.createdOn}
                onChange={(range) => handleFilterUpdate('createdOn', range)}
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                Modified Date
              </label>
              <DateRangePicker
                label="Modified Date"
                value={filters.modifiedDate}
                onChange={(range) => handleFilterUpdate('modifiedDate', range)}
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};