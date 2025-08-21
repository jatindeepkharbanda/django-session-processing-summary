import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { X, Zap } from 'lucide-react';
import { addDays, addHours, startOfDay, endOfDay, subDays, subHours, subWeeks, subMonths, format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';

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
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedPreset, setSelectedPreset] = useState<{ label: string; getValue: () => { from: Date; to: Date } } | null>(null);
  const { toast } = useToast();
  
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
    setSelectedPreset(preset);
    setIsDialogOpen(true);
  };

  const applyFilterToType = (filterType: keyof FilterState) => {
    if (!selectedPreset) return;
    
    const dateRange = selectedPreset.getValue();
    
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
      [filterType]: dateRange
    };
    
    onFilterChange(newFilters);
    
    // Show toast for removed filters
    if (removedFilters.length > 0) {
      toast({
        title: "Filter Replaced",
        description: `Removed ${removedFilters.join(', ')} filter${removedFilters.length > 1 ? 's' : ''} and applied ${selectedPreset.label} to ${getFilterDisplayName(filterType)}.`,
        duration: 3000,
      });
    } else {
      toast({
        title: "Filter Applied",
        description: `Applied ${selectedPreset.label} to ${getFilterDisplayName(filterType)}.`,
        duration: 3000,
      });
    }
    
    setIsDialogOpen(false);
    setSelectedPreset(null);
  };

  const getFilterDisplayName = (filterType: keyof FilterState) => {
    switch (filterType) {
      case 'visitTimestamp':
        return 'Visit Timestamp';
      case 'createdOn':
        return 'Created On';
      case 'modifiedDate':
        return 'Modified Date';
      default:
        return '';
    }
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
    
    if (filters.visitTimestamp.from || filters.visitTimestamp.to) {
      active.push({
        type: 'Visit Time',
        range: filters.visitTimestamp,
        onRemove: () => onFilterChange({ ...filters, visitTimestamp: {} })
      });
    }
    
    if (filters.createdOn.from || filters.createdOn.to) {
      active.push({
        type: 'Created On',
        range: filters.createdOn,
        onRemove: () => onFilterChange({ ...filters, createdOn: {} })
      });
    }
    
    if (filters.modifiedDate.from || filters.modifiedDate.to) {
      active.push({
        type: 'Modified Date',
        range: filters.modifiedDate,
        onRemove: () => onFilterChange({ ...filters, modifiedDate: {} })
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
    <>
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

      {/* Filter Type Selection Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Select Filter Type</DialogTitle>
            <DialogDescription>
              Choose which filter to apply "{selectedPreset?.label}" to:
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid grid-cols-1 gap-3 py-4">
            <Button
              variant="outline"
              onClick={() => applyFilterToType('visitTimestamp')}
              className="justify-start text-left h-12"
            >
              <div className="space-y-1">
                <div className="font-medium">Visit Timestamp</div>
                <div className="text-xs text-muted-foreground">Apply to visit timestamp filter</div>
              </div>
            </Button>
            
            <Button
              variant="outline"
              onClick={() => applyFilterToType('createdOn')}
              className="justify-start text-left h-12"
            >
              <div className="space-y-1">
                <div className="font-medium">Created On</div>
                <div className="text-xs text-muted-foreground">Apply to created on filter</div>
              </div>
            </Button>
            
            <Button
              variant="outline"
              onClick={() => applyFilterToType('modifiedDate')}
              className="justify-start text-left h-12"
            >
              <div className="space-y-1">
                <div className="font-medium">Modified Date</div>
                <div className="text-xs text-muted-foreground">Apply to modified date filter</div>
              </div>
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default QuickDatePresets;