
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CostHistoryChart } from "@/components/CostHistoryChart";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, TrendingUp, TrendingDown, DollarSign, BarChart3, Filter, AlertCircle } from "lucide-react";
import { Layout } from "@/components/Layout";
import { useCostData } from "@/hooks/useCostData";
import { Skeleton } from "@/components/ui/skeleton";

type FilterPeriod = '7d' | '30d' | '90d' | '180d' | '365d' | 'all';

const History = () => {
  const [selectedPeriod, setSelectedPeriod] = useState<FilterPeriod>('365d');
  const [selectedBudget, setSelectedBudget] = useState<string>('all');
  
  const { 
    budgetHistories, 
    rawData,
    isLoading, 
    error, 
    formatCurrency 
  } = useCostData();

  const filterPeriods = [
    { value: '7d', label: 'Last 7 days' },
    { value: '30d', label: 'Last 30 days' },
    { value: '90d', label: 'Last 90 days' },
    { value: '180d', label: 'Last 180 days' },
    { value: '365d', label: 'Last 365 days' },
    { value: 'all', label: 'All time' }
  ];

  // Filter data based on selected period
  const filterDataByPeriod = (data: any[], period: FilterPeriod) => {
    if (period === 'all') return data;
    
    const now = new Date();
    const daysToSubtract = parseInt(period.replace('d', ''));
    const cutoffDate = new Date(now.getTime() - (daysToSubtract * 24 * 60 * 60 * 1000));
    
    return data.filter(item => {
      const itemDate = new Date(item.timePeriod.start);
      return itemDate >= cutoffDate;
    });
  };

  // Get filtered historical data
  const getFilteredHistoricalData = () => {
    if (!budgetHistories || budgetHistories.length === 0) return [];
    
    const selectedBudgetData = selectedBudget === 'all' 
      ? budgetHistories[0] // Default to first budget if "all" selected
      : budgetHistories.find(b => b.budgetName === selectedBudget) || budgetHistories[0];
    
    if (!selectedBudgetData) return [];
    
    const filteredData = filterDataByPeriod(selectedBudgetData.monthlyData, selectedPeriod);
    
    return filteredData.map(monthData => ({
      date: monthData.timePeriod.start,
      spend: parseFloat(monthData.actualAmount.amount),
      budget: parseFloat(monthData.budgetedAmount.amount),
      utilization: parseFloat(monthData.utilization),
      period: `${new Date(monthData.timePeriod.start).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}`
    }));
  };

  // Calculate statistics
  const calculateStats = () => {
    const data = getFilteredHistoricalData();
    if (data.length === 0) return null;
    
    const totalSpent = data.reduce((sum, item) => sum + item.spend, 0);
    const totalBudget = data.reduce((sum, item) => sum + item.budget, 0);
    const averageSpend = totalSpent / data.length;
    const highestSpend = Math.max(...data.map(item => item.spend));
    const highestSpendMonth = data.find(item => item.spend === highestSpend);
    const budgetAdherence = totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0;
    const monthsOverBudget = data.filter(item => item.spend > item.budget).length;
    
    return {
      totalSpent,
      totalBudget,
      averageSpend,
      highestSpend,
      highestSpendMonth,
      budgetAdherence,
      monthsOverBudget,
      totalMonths: data.length
    };
  };

  const historicalData = getFilteredHistoricalData();
  const stats = calculateStats();

  if (isLoading) {
    return (
      <Layout>
        <main className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <Skeleton className="h-8 w-64 mb-2" />
            <Skeleton className="h-4 w-96" />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-32" />
            ))}
          </div>
          <Skeleton className="h-96" />
        </main>
      </Layout>
    );
  }

  if (error || !budgetHistories || budgetHistories.length === 0) {
    return (
      <Layout>
        <main className="container mx-auto px-4 py-8">
          <Card className="border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/20">
            <CardHeader>
              <CardTitle className="text-red-800 dark:text-red-200 flex items-center">
                <AlertCircle className="h-5 w-5 mr-2" />
                No Historical Data Available
              </CardTitle>
              <CardDescription className="text-red-600 dark:text-red-300">
                Unable to load historical cost data. Please check your API connection.
              </CardDescription>
            </CardHeader>
          </Card>
        </main>
      </Layout>
    );
  }

  return (
    <Layout>
      <main className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">Cost History</h1>
            <p className="text-slate-600 dark:text-slate-400 mt-2">
              Track your AWS spending trends over time
            </p>
          </div>
          
          {/* Filter Controls */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-slate-600 dark:text-slate-400" />
              <Select value={selectedPeriod} onValueChange={(value: FilterPeriod) => setSelectedPeriod(value)}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {filterPeriods.map(period => (
                    <SelectItem key={period.value} value={period.value}>
                      {period.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            {budgetHistories.length > 1 && (
              <Select value={selectedBudget} onValueChange={setSelectedBudget}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Select Budget" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Budgets</SelectItem>
                  {budgetHistories.map(budget => (
                    <SelectItem key={budget.budgetName} value={budget.budgetName}>
                      {budget.budgetName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>
        </div>
        
        {/* Statistics Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center">
                  <DollarSign className="h-5 w-5 mr-2 text-blue-600" />
                  Average Spend
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                  {formatCurrency(stats.averageSpend)}
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Per month ({stats.totalMonths} months)
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center">
                  <TrendingUp className="h-5 w-5 mr-2 text-green-600" />
                  Highest Month
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                  {formatCurrency(stats.highestSpend)}
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  {stats.highestSpendMonth?.period || 'N/A'}
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center">
                  <BarChart3 className="h-5 w-5 mr-2 text-purple-600" />
                  Budget Usage
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                  {stats.budgetAdherence.toFixed(1)}%
                </div>
                <Badge variant={stats.budgetAdherence > 100 ? "destructive" : stats.budgetAdherence > 80 ? "secondary" : "default"}>
                  {stats.budgetAdherence > 100 ? 'Over Budget' : stats.budgetAdherence > 80 ? 'Near Limit' : 'Within Budget'}
                </Badge>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center">
                  <Calendar className="h-5 w-5 mr-2 text-orange-600" />
                  Total Spent
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                  {formatCurrency(stats.totalSpent)}
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  {stats.monthsOverBudget} month{stats.monthsOverBudget !== 1 ? 's' : ''} over budget
                </p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Historical Data Tabs */}
        <Tabs defaultValue="chart" className="space-y-6">
          <TabsList>
            <TabsTrigger value="chart">Chart View</TabsTrigger>
            <TabsTrigger value="table">Table View</TabsTrigger>
            <TabsTrigger value="analysis">Analysis</TabsTrigger>
          </TabsList>

          <TabsContent value="chart">
            <Card>
              <CardHeader>
                <CardTitle>Monthly Spending Trend</CardTitle>
                <CardDescription>
                  Your AWS spending history compared to budget ({selectedPeriod === 'all' ? 'All time' : filterPeriods.find(p => p.value === selectedPeriod)?.label})
                </CardDescription>
              </CardHeader>
              <CardContent>
                {historicalData.length > 0 ? (
                  <CostHistoryChart data={historicalData} />
                ) : (
                  <div className="text-center py-8">
                    <AlertCircle className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-slate-900 dark:text-slate-100 mb-2">
                      No Data Available
                    </h3>
                    <p className="text-slate-600 dark:text-slate-400">
                      No historical data found for the selected time period.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="table">
            <Card>
              <CardHeader>
                <CardTitle>Historical Data Table</CardTitle>
                <CardDescription>
                  Detailed monthly breakdown of costs and budget utilization
                </CardDescription>
              </CardHeader>
              <CardContent>
                {historicalData.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="border-b border-slate-200 dark:border-slate-700">
                          <th className="text-left p-3 font-medium text-slate-900 dark:text-slate-100">Period</th>
                          <th className="text-right p-3 font-medium text-slate-900 dark:text-slate-100">Actual Spend</th>
                          <th className="text-right p-3 font-medium text-slate-900 dark:text-slate-100">Budget</th>
                          <th className="text-right p-3 font-medium text-slate-900 dark:text-slate-100">Utilization</th>
                          <th className="text-right p-3 font-medium text-slate-900 dark:text-slate-100">Variance</th>
                        </tr>
                      </thead>
                      <tbody>
                        {historicalData.map((item, index) => {
                          const variance = item.spend - item.budget;
                          const isOverBudget = variance > 0;
                          
                          return (
                            <tr key={index} className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50">
                              <td className="p-3 text-slate-900 dark:text-slate-100">{item.period}</td>
                              <td className="p-3 text-right font-medium text-slate-900 dark:text-slate-100">
                                {formatCurrency(item.spend)}
                              </td>
                              <td className="p-3 text-right text-slate-600 dark:text-slate-400">
                                {formatCurrency(item.budget)}
                              </td>
                              <td className="p-3 text-right">
                                <Badge variant={item.utilization > 100 ? "destructive" : item.utilization > 80 ? "secondary" : "default"}>
                                  {item.utilization.toFixed(1)}%
                                </Badge>
                              </td>
                              <td className={`p-3 text-right font-medium ${isOverBudget ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400'}`}>
                                {isOverBudget ? '+' : ''}{formatCurrency(Math.abs(variance))}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-slate-600 dark:text-slate-400">No data available for the selected period.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analysis">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Spending Patterns</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {stats && (
                    <>
                      <div className="flex justify-between">
                        <span className="text-slate-600 dark:text-slate-400">Total Periods:</span>
                        <span className="font-medium text-slate-900 dark:text-slate-100">{stats.totalMonths} months</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600 dark:text-slate-400">Average Monthly Spend:</span>
                        <span className="font-medium text-slate-900 dark:text-slate-100">{formatCurrency(stats.averageSpend)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600 dark:text-slate-400">Total Spent:</span>
                        <span className="font-medium text-slate-900 dark:text-slate-100">{formatCurrency(stats.totalSpent)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600 dark:text-slate-400">Total Budget:</span>
                        <span className="font-medium text-slate-900 dark:text-slate-100">{formatCurrency(stats.totalBudget)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600 dark:text-slate-400">Months Over Budget:</span>
                        <span className={`font-medium ${stats.monthsOverBudget > 0 ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400'}`}>
                          {stats.monthsOverBudget} / {stats.totalMonths}
                        </span>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Budget Performance</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {stats && (
                    <>
                      <div className="flex justify-between">
                        <span className="text-slate-600 dark:text-slate-400">Overall Utilization:</span>
                        <span className={`font-medium ${stats.budgetAdherence > 100 ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400'}`}>
                          {stats.budgetAdherence.toFixed(1)}%
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600 dark:text-slate-400">Highest Spend Month:</span>
                        <span className="font-medium text-slate-900 dark:text-slate-100">
                          {stats.highestSpendMonth?.period || 'N/A'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600 dark:text-slate-400">Budget Adherence Rate:</span>
                        <span className={`font-medium ${stats.monthsOverBudget === 0 ? 'text-green-600 dark:text-green-400' : 'text-yellow-600 dark:text-yellow-400'}`}>
                          {(((stats.totalMonths - stats.monthsOverBudget) / stats.totalMonths) * 100).toFixed(1)}%
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600 dark:text-slate-400">Savings vs Budget:</span>
                        <span className={`font-medium ${stats.totalBudget - stats.totalSpent > 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                          {formatCurrency(Math.abs(stats.totalBudget - stats.totalSpent))}
                          {stats.totalBudget - stats.totalSpent > 0 ? ' saved' : ' over'}
                        </span>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </Layout>
  );
};

export default History;
