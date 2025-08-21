import React from 'react';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Card, CardContent } from '@/components/ui/card';
import { CalendarIcon, X } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import type { DateRange } from 'react-day-picker';

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
    onChange(range || {});
  };

  const clearFilter = () => {
    onChange({});
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
            'w-full justify-start text-left font-normal h-9 px-3 text-xs',
            !hasValue && 'text-muted-foreground'
          )}
        >
          <CalendarIcon className="mr-2 h-3 w-3" />
          {hasValue ? (
            <>
              {value.from ? format(value.from, 'MMM dd') : 'Start'} - {' '}
              {value.to ? format(value.to, 'MMM dd, yyyy') : 'End'}
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
  const handleFilterUpdate = (
    filterType: keyof FilterState,
    range: { from?: Date; to?: Date }
  ) => {
    const newFilters = {
      ...filters,
      [filterType]: range,
    };
    onFilterChange(newFilters);
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
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="space-y-2">
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                Modified Date
              </label>
              <DateRangePicker
                label="Modified Date"
                value={filters.modifiedDate}
                onChange={(range) => handleFilterUpdate('modifiedDate', range)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                Created On
              </label>
              <DateRangePicker
                label="Created On"
                value={filters.createdOn}
                onChange={(range) => handleFilterUpdate('createdOn', range)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                Visit Timestamp
              </label>
              <DateRangePicker
                label="Visit Timestamp"
                value={filters.visitTimestamp}
                onChange={(range) => handleFilterUpdate('visitTimestamp', range)}
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};