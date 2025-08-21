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
  definition?: string;
  onDownload: () => void;
  onViewData: () => void;
}

const variantStyles = {
  default: "bg-gradient-to-br from-white to-slate-50/50 border-slate-200/60 hover:border-primary/20 hover:shadow-lg hover:shadow-primary/5",
  success: "bg-gradient-to-br from-emerald-50/50 to-emerald-100/30 border-emerald-200/60 hover:border-emerald-300/60 hover:shadow-lg hover:shadow-emerald-500/10",
  warning: "bg-gradient-to-br from-amber-50/50 to-orange-100/30 border-orange-200/60 hover:border-orange-300/60 hover:shadow-lg hover:shadow-orange-500/10",
  error: "bg-gradient-to-br from-red-50/50 to-red-100/30 border-red-200/60 hover:border-red-300/60 hover:shadow-lg hover:shadow-red-500/10",
  info: "bg-gradient-to-br from-blue-50/50 to-blue-100/30 border-blue-200/60 hover:border-blue-300/60 hover:shadow-lg hover:shadow-blue-500/10",
};

const valueStyles = {
  default: "text-slate-700",
  success: "text-emerald-700",
  warning: "text-orange-700",
  error: "text-red-700",
  info: "text-blue-700",
};

const iconBgStyles = {
  default: "bg-slate-100",
  success: "bg-emerald-100",
  warning: "bg-orange-100", 
  error: "bg-red-100",
  info: "bg-blue-100",
};

export const KPICard: React.FC<KPICardProps> = ({
  title,
  value,
  isLoading = false,
  variant = 'default',
  definition,
  onDownload,
  onViewData,
}) => {
  const formatValue = (num: number) => {
    return new Intl.NumberFormat('en-US').format(num);
  };

  return (
    <Card className={cn(
      "relative overflow-hidden transition-all duration-300 border hover:shadow-lg backdrop-blur-sm group hover:-translate-y-1",
      "before:absolute before:inset-0 before:bg-gradient-to-br before:from-white/40 before:to-transparent before:opacity-0 before:transition-opacity before:duration-300 hover:before:opacity-100",
      variantStyles[variant]
    )}>
      <CardContent className="relative p-6">
        <div className="space-y-5">
          <div className="flex items-start justify-between">
            <div className="space-y-3 flex-1">
              <div className="flex items-center gap-3">
                <div className={cn(
                  "w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-300 group-hover:scale-110",
                  iconBgStyles[variant]
                )}>
                  <div className={cn(
                    "w-4 h-4 rounded-full",
                    valueStyles[variant]
                  )} />
                </div>
                <h3 className="text-xs font-semibold text-slate-600 uppercase tracking-wider leading-tight">
                  {title}
                </h3>
              </div>
              
              {isLoading ? (
                <Skeleton className="h-8 w-20 bg-slate-200/50" />
              ) : (
                <div className={cn(
                  "text-2xl font-bold tabular-nums transition-all duration-300 group-hover:scale-105",
                  valueStyles[variant]
                )}>
                  {formatValue(value)}
                </div>
              )}
            </div>

            {/* Action buttons - always visible */}
            <div className="flex items-center space-x-2 transition-all duration-300">
              <Button
                variant="ghost"
                size="icon"
                className={cn(
                  "h-8 w-8 rounded-lg text-slate-500 hover:text-slate-700 hover:bg-white/80 backdrop-blur-sm border border-white/20",
                  "transition-all duration-200 hover:scale-105 hover:shadow-md"
                )}
                onClick={onViewData}
              >
                <Eye className="h-3.5 w-3.5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className={cn(
                  "h-8 w-8 rounded-lg text-slate-500 hover:text-slate-700 hover:bg-white/80 backdrop-blur-sm border border-white/20",
                  "transition-all duration-200 hover:scale-105 hover:shadow-md"
                )}
                onClick={onDownload}
              >
                <Download className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
          
          {/* Definition text */}
          {definition && (
            <div className="mt-4 pt-3 border-t border-slate-200/40">
              <p className="text-xs text-slate-500 leading-relaxed">
                {definition}
              </p>
            </div>
          )}
        </div>

        {/* Subtle bottom border accent */}
        <div className={cn(
          "absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r transition-all duration-300 opacity-0 group-hover:opacity-100",
          variant === 'success' && "from-emerald-400 to-emerald-600",
          variant === 'warning' && "from-orange-400 to-orange-600",
          variant === 'error' && "from-red-400 to-red-600",
          variant === 'info' && "from-blue-400 to-blue-600",
          variant === 'default' && "from-slate-400 to-slate-600"
        )} />
      </CardContent>
    </Card>
  );
};