
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
import { MultiBudgetCard } from "@/components/MultiBudgetCard";
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
    budgetCards,
    multiBudgetMetrics,
    budgetHistories,
    rawData,
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
            title="AWS Budgets"
            value={`${multiBudgetMetrics.totalBudgets}`}
            change={`${multiBudgetMetrics.activeBudgets} active, ${multiBudgetMetrics.totalBudgets - multiBudgetMetrics.activeBudgets} inactive`}
            changeType="neutral"
            borderColor="blue"
          />
          <DashboardCard 
            title="AWS Total Budget"
            value={formatCurrency(multiBudgetMetrics.totalBudgetAmount, dashboardMetrics.currency)}
            change={formatCurrency(multiBudgetMetrics.totalBudgetAmount - multiBudgetMetrics.totalSpent, dashboardMetrics.currency) + " remaining"}
            changeType={multiBudgetMetrics.totalSpent > multiBudgetMetrics.totalBudgetAmount ? "increase" : "neutral"}
            borderColor="green"
          />
          <DashboardCard 
            title="AWS Spent"
            value={formatCurrency(multiBudgetMetrics.totalSpent, dashboardMetrics.currency)}
            change={`${multiBudgetMetrics.overallUtilization.toFixed(1)}% of AWS budget`}
            changeType={multiBudgetMetrics.overallUtilization > 80 ? "warning" : "neutral"}
            borderColor="orange"
          />
          <DashboardCard 
            title="AWS Budget Status"
            value={multiBudgetMetrics.budgetsOverLimit > 0 ? "OVER BUDGET" : "ON TRACK"}
            change={multiBudgetMetrics.budgetsOverLimit > 0 ? `${multiBudgetMetrics.budgetsOverLimit} AWS budget${multiBudgetMetrics.budgetsOverLimit > 1 ? 's' : ''} over limit` : `All ${multiBudgetMetrics.totalBudgets} AWS budgets within limits`}
            changeType={multiBudgetMetrics.budgetsOverLimit > 0 ? "increase" : "decrease"}
            borderColor="purple"
          />
        </div>

        {/* Multi-Budget Progress Overview */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center">
                <DollarSign className="h-5 w-5 mr-2" />
                AWS Budget Progress Overview
              </div>
              <Badge variant={multiBudgetMetrics.budgetsOverLimit > 0 ? "destructive" : "default"}>
                {multiBudgetMetrics.activeBudgets} Active AWS Budget{multiBudgetMetrics.activeBudgets !== 1 ? 's' : ''}
              </Badge>
            </CardTitle>
            <CardDescription>
              Combined progress across all your AWS budgets
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-600 dark:text-slate-400">Total Progress</span>
                <span className="text-sm font-medium">
                  {formatCurrency(multiBudgetMetrics.totalSpent, dashboardMetrics.currency)} / {formatCurrency(multiBudgetMetrics.totalBudgetAmount, dashboardMetrics.currency)}
                </span>
              </div>
              
              <Progress 
                value={Math.min(multiBudgetMetrics.overallUtilization, 100)} 
                className="h-3"
              />
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div className="text-center p-2 bg-slate-50 dark:bg-slate-800 rounded">
                  <div className="font-medium text-slate-900 dark:text-slate-100">
                    {multiBudgetMetrics.totalBudgets}
                  </div>
                  <div className="text-slate-600 dark:text-slate-400">AWS Budgets</div>
                </div>
                <div className="text-center p-2 bg-slate-50 dark:bg-slate-800 rounded">
                  <div className="font-medium text-slate-900 dark:text-slate-100">
                    {multiBudgetMetrics.activeBudgets}
                  </div>
                  <div className="text-slate-600 dark:text-slate-400">Active</div>
                </div>
                <div className="text-center p-2 bg-slate-50 dark:bg-slate-800 rounded">
                  <div className={`font-medium ${multiBudgetMetrics.budgetsOverLimit > 0 ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400'}`}>
                    {multiBudgetMetrics.budgetsOverLimit}
                  </div>
                  <div className="text-slate-600 dark:text-slate-400">Over AWS Budget</div>
                </div>
                <div className="text-center p-2 bg-slate-50 dark:bg-slate-800 rounded">
                  <div className={`font-medium ${multiBudgetMetrics.overallUtilization > 100 ? 'text-red-600 dark:text-red-400' : multiBudgetMetrics.overallUtilization > 80 ? 'text-yellow-600 dark:text-yellow-400' : 'text-slate-900 dark:text-slate-100'}`}>
                    {multiBudgetMetrics.overallUtilization.toFixed(1)}%
                  </div>
                  <div className="text-slate-600 dark:text-slate-400">Overall Usage</div>
                </div>
              </div>

              {multiBudgetMetrics.budgetsOverLimit > 0 && (
                <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                  <div className="flex items-center">
                    <AlertTriangle className="h-4 w-4 text-red-600 dark:text-red-400 mr-2" />
                    <span className="text-red-800 dark:text-red-200 font-medium">
                      {multiBudgetMetrics.budgetsOverLimit} AWS budget{multiBudgetMetrics.budgetsOverLimit > 1 ? 's have' : ' has'} exceeded the limit
                    </span>
                  </div>
                  <p className="text-red-600 dark:text-red-300 text-sm mt-1">
                    Review your AWS budget details to identify overspending areas.
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Main Content Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5 lg:w-[600px]">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="budgets">AWS Budgets</TabsTrigger>
            <TabsTrigger value="services">Services</TabsTrigger>
            <TabsTrigger value="alerts">Alerts</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <CostChart data={chartData} />
              <ServiceBreakdown 
                services={rawData?.services}
                totalCost={dashboardMetrics.totalCost} 
                currency={dashboardMetrics.currency}
              />
            </div>
          </TabsContent>

          <TabsContent value="budgets" className="space-y-6">
            <MultiBudgetCard 
              budgets={budgetCards} 
              metrics={multiBudgetMetrics}
              budgetHistories={budgetHistories}
              onBudgetSelect={(budgetId) => {
                console.log('Selected budget:', budgetId);
                // Handle budget selection - could navigate to detailed view
              }}
            />
          </TabsContent>

          <TabsContent value="services" className="space-y-6">
            <ServiceBreakdown 
              detailed={true} 
              services={rawData?.services}
              totalCost={dashboardMetrics.totalCost} 
              currency={dashboardMetrics.currency}
            />
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
                  Settings panel coming soon - configure AWS budget limits, alert thresholds, and notification channels.
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
