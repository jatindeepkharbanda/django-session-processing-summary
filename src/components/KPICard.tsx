import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Download, Eye } from 'lucide-react';
import { cn } from '@/lib/utils';

interface KPICardProps {
  title: string;
  value: number;
  isLoading?: boolean;
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info';
  onDownload: () => void;
  onViewData: () => void;
}

const variantStyles = {
  default: 'border-border hover:border-primary/20 hover:shadow-sm',
  success: 'border-border hover:border-green-200 hover:shadow-sm',
  warning: 'border-border hover:border-orange-200 hover:shadow-sm',
  error: 'border-border hover:border-red-200 hover:shadow-sm',
  info: 'border-border hover:border-blue-200 hover:shadow-sm',
};

const valueStyles = {
  default: 'text-foreground',
  success: 'text-green-600',
  warning: 'text-orange-600',
  error: 'text-red-600',
  info: 'text-blue-600',
};

export const KPICard: React.FC<KPICardProps> = ({
  title,
  value,
  isLoading = false,
  variant = 'default',
  onDownload,
  onViewData,
}) => {
  const formatValue = (num: number) => {
    return new Intl.NumberFormat('en-US').format(num);
  };

  return (
    <Card className={cn(
      'relative transition-all duration-300 bg-card border group hover:shadow-md',
      variantStyles[variant]
    )}>
      <CardContent className="p-5">
        <div className="space-y-4">
          <div className="flex items-start justify-between">
            <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wide leading-tight pr-2">
              {title}
            </h3>
            <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 text-muted-foreground hover:text-foreground hover:bg-muted"
                onClick={onViewData}
              >
                <Eye className="h-3 w-3" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 text-muted-foreground hover:text-foreground hover:bg-muted"
                onClick={onDownload}
              >
                <Download className="h-3 w-3" />
              </Button>
            </div>
          </div>
          
          {isLoading ? (
            <Skeleton className="h-7 w-16" />
          ) : (
            <div className={cn(
              'text-xl font-semibold tabular-nums',
              valueStyles[variant]
            )}>
              {formatValue(value)}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};