import React, { useState, useEffect } from 'react';
import { KPICard } from '@/components/KPICard';
import CombinedFilterBar from '@/components/CombinedFilterBar';
import { Button } from '@/components/ui/button';
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbPage } from '@/components/ui/breadcrumb';
import { Toaster } from '@/components/ui/toaster';
import { RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

interface SessionMetrics {
  totalSessionsReceived: number;
  totalPhotosReceived: number;
  sessionsConfirmUploadClicked: number;
  sessionsNotMarkedComplete: number;
  sessionsSentForProcessing: number;
  sessionsFullyProcessed: number;
  sessionsNotProcessed: number;
  sessionsFailed: number;
  inProcessingSessions: number;
  sessionsAvailableInCAS: number;
  sessionsAvailableInOutputAPI: number;
  uniqueStoresVisited: number;
  uniqueUsersVisited: number;
}

interface FilterState {
  modifiedDate: { from?: Date; to?: Date };
  createdOn: { from?: Date; to?: Date };
  visitTimestamp: { from?: Date; to?: Date };
}

// Mock data generator
const generateMockData = (): SessionMetrics => ({
  totalSessionsReceived: Math.floor(Math.random() * 1000) + 500,
  totalPhotosReceived: Math.floor(Math.random() * 5000) + 2000,
  sessionsConfirmUploadClicked: Math.floor(Math.random() * 800) + 400,
  sessionsNotMarkedComplete: Math.floor(Math.random() * 100) + 50,
  sessionsSentForProcessing: Math.floor(Math.random() * 700) + 350,
  sessionsFullyProcessed: Math.floor(Math.random() * 600) + 300,
  sessionsNotProcessed: Math.floor(Math.random() * 50) + 25,
  sessionsFailed: Math.floor(Math.random() * 20) + 5,
  inProcessingSessions: Math.floor(Math.random() * 80) + 20,
  sessionsAvailableInCAS: Math.floor(Math.random() * 500) + 250,
  sessionsAvailableInOutputAPI: Math.floor(Math.random() * 450) + 225,
  uniqueStoresVisited: Math.floor(Math.random() * 100) + 50,
  uniqueUsersVisited: Math.floor(Math.random() * 500) + 250,
});

const SessionProcessingSummary = () => {
  const [metrics, setMetrics] = useState<SessionMetrics>(generateMockData());
  const [filters, setFilters] = useState<FilterState>({
    modifiedDate: {},
    createdOn: {},
    visitTimestamp: {},
  });
  const [loading, setLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { toast } = useToast();

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics(generateMockData());
    }, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, []);

  const handleFilterChange = (newFilters: FilterState) => {
    setFilters(newFilters);
    setLoading(true);
    // Simulate API call and auto-refresh when filters change
    setTimeout(() => {
      setMetrics(generateMockData());
      setLoading(false);
      toast({
        title: "Data Refreshed",
        description: "KPI data has been updated based on the applied filters.",
        duration: 2000,
      });
    }, 1000);
  };

  const handleRefreshData = () => {
    setIsRefreshing(true);
    // Simulate API call for manual refresh
    setTimeout(() => {
      setMetrics(generateMockData());
      setIsRefreshing(false);
      toast({
        title: "Data Refreshed",
        description: "All KPI data has been updated with the latest information.",
        duration: 2000,
      });
    }, 1000);
  };

  const handleDownload = (title: string, value: number) => {
    // Simulate download functionality
    const data = `${title}: ${value}\nGenerated: ${new Date().toISOString()}`;
    const blob = new Blob([data], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${title.toLowerCase().replace(/\s+/g, '_')}_data.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleViewData = (title: string) => {
    // Placeholder for view data functionality
    alert(`View detailed data for: ${title}`);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* OneDrive-style Header */}
      <header className="bg-slate-900 border-b border-slate-800">
        <div className="mx-auto max-w-7xl px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-400 rounded-sm flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M3 3h18v18H3V3zm2 2v14h14V5H5zm2 2h10v2H7V7zm0 4h10v2H7v-2zm0 4h6v2H7v-2z"/>
                  </svg>
                </div>
                <div>
                  <h1 className="text-xl font-semibold text-white">Session Processing Summary</h1>
                  <p className="text-sm text-slate-300">Live session status monitoring</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem>
                    <BreadcrumbPage className="text-sm text-slate-400 hover:text-slate-200 transition-colors">
                      Home
                    </BreadcrumbPage>
                  </BreadcrumbItem>
                  <span className="text-slate-500 mx-2">/</span>
                  <BreadcrumbItem>
                    <BreadcrumbPage className="text-sm text-slate-200 font-medium">
                      Reports
                    </BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
            </div>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-8 py-8 space-y-6">
        {/* Combined Filters */}
        <CombinedFilterBar 
          filters={filters} 
          onFilterChange={handleFilterChange}
          onRefreshData={handleRefreshData}
          isRefreshing={isRefreshing}
        />

        {/* KPI Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {/* Session Processing Flow */}
          <KPICard
            title="Total Sessions Received"
            value={metrics.totalSessionsReceived}
            isLoading={loading || isRefreshing}
            definition="PhotoSession table count"
            onDownload={() => handleDownload('Total Sessions Received', metrics.totalSessionsReceived)}
            onViewData={() => handleViewData('Total Sessions Received')}
          />
          
          <KPICard
            title="Total Photos Received"
            value={metrics.totalPhotosReceived}
            isLoading={loading || isRefreshing}
            definition="Photo table count"
            onDownload={() => handleDownload('Total Photos Received', metrics.totalPhotosReceived)}
            onViewData={() => handleViewData('Total Photos Received')}
          />

          <KPICard
            title="Sessions Confirm Upload Clicked"
            value={metrics.sessionsConfirmUploadClicked}
            isLoading={loading || isRefreshing}
            definition="PhotoSession where session_state = 2"
            onDownload={() => handleDownload('Sessions Confirm Upload Clicked', metrics.sessionsConfirmUploadClicked)}
            onViewData={() => handleViewData('Sessions Confirm Upload Clicked')}
          />

          <KPICard
            title="Sessions Not Marked Complete"
            value={metrics.sessionsNotMarkedComplete}
            isLoading={loading || isRefreshing}
            definition="PhotoSession where session_state ≠ 2"
            onDownload={() => handleDownload('Sessions Not Marked Complete', metrics.sessionsNotMarkedComplete)}
            onViewData={() => handleViewData('Sessions Not Marked Complete')}
          />

          <KPICard
            title="Sessions Sent For Processing"
            value={metrics.sessionsSentForProcessing}
            isLoading={loading || isRefreshing}
            variant={metrics.sessionsSentForProcessing > 0 ? "warning" : "default"}
            definition="SessionProcessingState count"
            onDownload={() => handleDownload('Sessions Sent For Processing', metrics.sessionsSentForProcessing)}
            onViewData={() => handleViewData('Sessions Sent For Processing')}
          />

          <KPICard
            title="Sessions Fully Processed"
            value={metrics.sessionsFullyProcessed}
            isLoading={loading || isRefreshing}
            variant={metrics.sessionsFullyProcessed > 0 ? "success" : "default"}
            definition="PhotoSession where non_evidence_status = 3"
            onDownload={() => handleDownload('Sessions Fully Processed', metrics.sessionsFullyProcessed)}
            onViewData={() => handleViewData('Sessions Fully Processed')}
          />

          <KPICard
            title="Sessions Not Processed"
            value={metrics.sessionsNotProcessed}
            isLoading={loading || isRefreshing}
            variant={metrics.sessionsNotProcessed > 0 ? "error" : "default"}
            definition="PhotoSession where non_evidence_status = 1"
            onDownload={() => handleDownload('Sessions Not Processed', metrics.sessionsNotProcessed)}
            onViewData={() => handleViewData('Sessions Not Processed')}
          />

          <KPICard
            title="Sessions Failed"
            value={metrics.sessionsFailed}
            isLoading={loading || isRefreshing}
            variant={metrics.sessionsFailed > 0 ? "error" : "default"}
            definition="PhotoSession where non_evidence_status = 4"
            onDownload={() => handleDownload('Sessions Failed', metrics.sessionsFailed)}
            onViewData={() => handleViewData('Sessions Failed')}
          />

          <KPICard
            title="In Processing Sessions"
            value={metrics.inProcessingSessions}
            isLoading={loading || isRefreshing}
            variant={metrics.inProcessingSessions > 0 ? "warning" : "default"}
            definition="PhotoSession where non_evidence_status = 2"
            onDownload={() => handleDownload('In Processing Sessions', metrics.inProcessingSessions)}
            onViewData={() => handleViewData('In Processing Sessions')}
          />

          <KPICard
            title="Sessions Available in CAS"
            value={metrics.sessionsAvailableInCAS}
            isLoading={loading || isRefreshing}
            definition="SessionFacingsDetail count"
            onDownload={() => handleDownload('Sessions Available in CAS', metrics.sessionsAvailableInCAS)}
            onViewData={() => handleViewData('Sessions Available in CAS')}
          />

          <KPICard
            title="Sessions Available in Output API"
            value={metrics.sessionsAvailableInOutputAPI}
            isLoading={loading || isRefreshing}
            variant={metrics.sessionsAvailableInOutputAPI > 0 ? "success" : "default"}
            definition="SessionIRAnalyticsV2 table count"
            onDownload={() => handleDownload('Sessions Available in Output API', metrics.sessionsAvailableInOutputAPI)}
            onViewData={() => handleViewData('Sessions Available in Output API')}
          />

          <KPICard
            title="Unique Stores Visited"
            value={metrics.uniqueStoresVisited}
            isLoading={loading || isRefreshing}
            variant={metrics.uniqueStoresVisited > 0 ? "info" : "default"}
            onDownload={() => handleDownload('Unique Stores Visited', metrics.uniqueStoresVisited)}
            onViewData={() => handleViewData('Unique Stores Visited')}
          />

          <KPICard
            title="Unique Users Visited"
            value={metrics.uniqueUsersVisited}
            isLoading={loading || isRefreshing}
            variant={metrics.uniqueUsersVisited > 0 ? "info" : "default"}
            onDownload={() => handleDownload('Unique Users Visited', metrics.uniqueUsersVisited)}
            onViewData={() => handleViewData('Unique Users Visited')}
          />
        </div>
      </div>
      <Toaster />
    </div>
  );
};

export default SessionProcessingSummary;