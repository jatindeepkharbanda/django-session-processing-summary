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
  default: 'border-border',
  success: 'border-green-200 bg-green-50/50 dark:border-green-800 dark:bg-green-950/20',
  warning: 'border-yellow-200 bg-yellow-50/50 dark:border-yellow-800 dark:bg-yellow-950/20',
  error: 'border-red-200 bg-red-50/50 dark:border-red-800 dark:bg-red-950/20',
  info: 'border-blue-200 bg-blue-50/50 dark:border-blue-800 dark:bg-blue-950/20',
};

const valueStyles = {
  default: 'text-foreground',
  success: 'text-green-700 dark:text-green-400',
  warning: 'text-yellow-700 dark:text-yellow-400',
  error: 'text-red-700 dark:text-red-400',
  info: 'text-blue-700 dark:text-blue-400',
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
      'relative transition-all duration-200 hover:shadow-md hover:shadow-primary/5 group',
      variantStyles[variant]
    )}>
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <h3 className="text-sm font-medium text-muted-foreground leading-tight pr-2">
            {title}
          </h3>
          <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 text-muted-foreground hover:text-foreground"
              onClick={onViewData}
            >
              <Eye className="h-3 w-3" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 text-muted-foreground hover:text-foreground"
              onClick={onDownload}
            >
              <Download className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        {isLoading ? (
          <Skeleton className="h-8 w-24" />
        ) : (
          <div className={cn(
            'text-2xl font-bold tabular-nums',
            valueStyles[variant]
          )}>
            {formatValue(value)}
          </div>
        )}
      </CardContent>
    </Card>
  );
};