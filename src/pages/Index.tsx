
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertTriangle, TrendingUp, TrendingDown, DollarSign, Bell, Settings, RefreshCw } from "lucide-react";
import { CostChart } from "@/components/CostChart";
import { AlertsPanel } from "@/components/AlertsPanel";
import { BudgetCard } from "@/components/BudgetCard";
import { ServiceBreakdown } from "@/components/ServiceBreakdown";
import { HeaderNav } from "@/components/HeaderNav";
import { DashboardCard } from "@/components/DashboardCard";
import { useCostData } from "@/hooks/useCostData";
import { Skeleton } from "@/components/ui/skeleton";

const Index = () => {
  const [selectedPeriod, setSelectedPeriod] = useState("30d");
  const { 
    dashboardMetrics, 
    chartData, 
    isLoading, 
    error, 
    refetch,
    isUsingMockData,
    formatCurrency,
    getBudgetStatusColor,
    calculateBudgetPercentage 
  } = useCostData();

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800">
        <HeaderNav />
        <main className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <Skeleton className="h-10 w-80 mb-2" />
            <Skeleton className="h-6 w-96" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-32" />
            ))}
          </div>
          <Skeleton className="h-48 mb-8" />
        </main>
      </div>
    );
  }

  // Error state
  if (error && !isUsingMockData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800">
        <HeaderNav />
        <main className="container mx-auto px-4 py-8">
          <Card className="border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/20">
            <CardHeader>
              <CardTitle className="text-red-800 dark:text-red-200 flex items-center">
                <AlertTriangle className="h-5 w-5 mr-2" />
                Error Loading Cost Data
              </CardTitle>
              <CardDescription className="text-red-600 dark:text-red-300">
                Failed to fetch cost data from the API. Using sample data instead.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={() => refetch()} variant="outline" className="border-red-300 text-red-700 hover:bg-red-100 dark:border-red-600 dark:text-red-300 dark:hover:bg-red-800/20">
                <RefreshCw className="h-4 w-4 mr-2" />
                Retry
              </Button>
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

  if (!dashboardMetrics) {
    return null;
  }

  // Calculate derived values
  const budgetProgress = calculateBudgetPercentage(dashboardMetrics.currentMonthCost, dashboardMetrics.monthlyBudget);
  const isOverBudget = dashboardMetrics.isOverBudget;
  const isNearBudget = budgetProgress > 80;

  // Generate alerts based on real data
  const alerts = [];
  if (budgetProgress > 70) {
    alerts.push({
      id: 1,
      type: budgetProgress > 90 ? "error" as const : "warning" as const,
      message: `Monthly spend is ${budgetProgress}% of budget`,
      service: "Overall",
      amount: dashboardMetrics.currentMonthCost,
      threshold: 70
    });
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800">
      <HeaderNav />
      
      <main className="container mx-auto px-4 py-8">
        {/* API Status Banner */}
        {isUsingMockData && (
          <Card className="border-yellow-200 bg-yellow-50 dark:border-yellow-800 dark:bg-yellow-900/20 mb-6">
            <CardContent className="pt-4">
              <div className="flex items-center">
                <AlertTriangle className="h-5 w-5 text-yellow-600 dark:text-yellow-400 mr-2" />
                <div>
                  <p className="text-yellow-800 dark:text-yellow-200 font-medium">
                    Using Sample Data
                  </p>
                  <p className="text-yellow-600 dark:text-yellow-300 text-sm">
                    {error ? 'API connection failed. ' : 'API data not available. '}
                    Displaying sample cost data for demonstration.
                  </p>
                </div>
                <Button 
                  onClick={() => refetch()} 
                  variant="outline" 
                  size="sm" 
                  className="ml-auto border-yellow-300 text-yellow-700 hover:bg-yellow-100 dark:border-yellow-600 dark:text-yellow-300 dark:hover:bg-yellow-800/20"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Retry API
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Hero Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-slate-900 dark:text-slate-100 mb-2">
                Cloud Cost Dashboard
              </h1>
              <p className="text-lg text-slate-600 dark:text-slate-400">
                Monitor your AWS spending and avoid surprise bills
              </p>
            </div>
            <Button onClick={() => refetch()} variant="outline" size="sm">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>
        </div>

        {/* Dashboard Cards Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <DashboardCard 
            title="Current Month"
            value={formatCurrency(dashboardMetrics.currentMonthCost, dashboardMetrics.currency)}
            change={`${dashboardMetrics.serviceCount} services`}
            changeType="neutral"
            borderColor="blue"
          />
          <DashboardCard 
            title="Monthly Budget"
            value={formatCurrency(dashboardMetrics.monthlyBudget, dashboardMetrics.currency)}
            change={formatCurrency(dashboardMetrics.remainingBudget, dashboardMetrics.currency) + " remaining"}
            changeType={dashboardMetrics.remainingBudget > 0 ? "neutral" : "increase"}
            borderColor="green"
          />
          <DashboardCard 
            title="Daily Average"
            value={formatCurrency(dashboardMetrics.dailyAverage, dashboardMetrics.currency)}
            change={`Total: ${formatCurrency(dashboardMetrics.totalCost, dashboardMetrics.currency)}`}
            changeType="neutral"
            borderColor="orange"
          />
          <DashboardCard 
            title="Budget Status"
            value={dashboardMetrics.budgetStatus.replace('_', ' ').toUpperCase()}
            change={`${budgetProgress}% utilized`}
            changeType={isOverBudget ? "increase" : isNearBudget ? "warning" : "decrease"}
            borderColor="purple"
          />
        </div>

        {/* Budget Progress */}
        <BudgetCard 
          currentSpend={dashboardMetrics.currentMonthCost}
          monthlyBudget={dashboardMetrics.monthlyBudget}
          progress={budgetProgress}
          isOverBudget={isOverBudget}
          isNearBudget={isNearBudget}
        />

        {/* Main Content Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 lg:w-[500px]">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="services">Services</TabsTrigger>
            <TabsTrigger value="alerts">Alerts</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <CostChart data={chartData} />
              <ServiceBreakdown />
            </div>
          </TabsContent>

          <TabsContent value="services" className="space-y-6">
            <ServiceBreakdown detailed={true} />
          </TabsContent>

          <TabsContent value="alerts" className="space-y-6">
            <AlertsPanel alerts={alerts} />
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Settings className="h-5 w-5 mr-2" />
                  Alert Settings
                </CardTitle>
                <CardDescription>
                  Configure your cost alert thresholds and notification preferences
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-sm text-slate-600 dark:text-slate-400">
                  Settings panel coming soon - configure budget limits, alert thresholds, and notification channels.
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Index;
