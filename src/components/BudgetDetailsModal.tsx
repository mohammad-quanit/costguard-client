import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, DollarSign, AlertTriangle, CheckCircle, Clock, TrendingUp, BarChart3, Target, Activity } from "lucide-react";
import { BudgetCardData, BudgetHistory } from "@/types/api";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

interface BudgetDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  budget: BudgetCardData | null;
  budgetHistory: BudgetHistory | null;
}

export const BudgetDetailsModal = ({ isOpen, onClose, budget, budgetHistory }: BudgetDetailsModalProps) => {
  if (!budget || !budgetHistory) return null;

  const formatCurrency = (amount: number, currency: string = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatDateShort = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: '2-digit'
    });
  };

  const getBudgetStatusColor = (status: string, isOverBudget: boolean) => {
    if (isOverBudget) return 'text-red-600 bg-red-100 dark:bg-red-900/20 dark:text-red-400';
    if (status === 'expired') return 'text-gray-600 bg-gray-100 dark:bg-gray-800 dark:text-gray-400';
    if (status === 'upcoming') return 'text-blue-600 bg-blue-100 dark:bg-blue-900/20 dark:text-blue-400';
    return 'text-green-600 bg-green-100 dark:bg-green-900/20 dark:text-green-400';
  };

  const getBudgetStatusIcon = (status: string, isOverBudget: boolean) => {
    if (isOverBudget) return <AlertTriangle className="h-4 w-4" />;
    if (status === 'expired') return <Clock className="h-4 w-4" />;
    if (status === 'upcoming') return <Calendar className="h-4 w-4" />;
    return <CheckCircle className="h-4 w-4" />;
  };

  // Prepare chart data from monthly data
  const chartData = budgetHistory.monthlyData.map(monthData => {
    const date = new Date(monthData.timePeriod.start);
    const monthName = date.toLocaleDateString('en-US', { 
      month: 'short', 
      year: '2-digit' 
    });

    return {
      month: monthName,
      budgeted: parseFloat(monthData.budgetedAmount.amount),
      actual: parseFloat(monthData.actualAmount.amount),
      utilization: parseFloat(monthData.utilization),
    };
  });

  const remaining = budget.amount - budget.spent;
  const isOverBudget = budget.spent > budget.amount;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <div className="flex items-center">
              <Target className="h-5 w-5 mr-2" />
              {budget.name}
            </div>
            <Badge className={getBudgetStatusColor(budget.status, isOverBudget)}>
              {getBudgetStatusIcon(budget.status, isOverBudget)}
              <span className="ml-1 capitalize">
                {isOverBudget ? 'Over Budget' : budget.status}
              </span>
            </Badge>
          </DialogTitle>
          <DialogDescription>
            Detailed budget analysis and monthly breakdown
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Budget Overview Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="pt-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                    {formatCurrency(budget.amount, budget.currency)}
                  </div>
                  <div className="text-sm text-slate-600 dark:text-slate-400">Total Budget</div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                    {formatCurrency(budget.spent, budget.currency)}
                  </div>
                  <div className="text-sm text-slate-600 dark:text-slate-400">Total Spent</div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-4">
                <div className="text-center">
                  <div className={`text-2xl font-bold ${remaining < 0 ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400'}`}>
                    {formatCurrency(Math.abs(remaining), budget.currency)}
                  </div>
                  <div className="text-sm text-slate-600 dark:text-slate-400">
                    {remaining < 0 ? 'Over Budget' : 'Remaining'}
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-4">
                <div className="text-center">
                  <div className={`text-2xl font-bold ${budget.utilization > 100 ? 'text-red-600 dark:text-red-400' : 'text-slate-900 dark:text-slate-100'}`}>
                    {budget.utilization.toFixed(1)}%
                  </div>
                  <div className="text-sm text-slate-600 dark:text-slate-400">Utilization</div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Budget Progress */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Activity className="h-5 w-5 mr-2" />
                Budget Progress
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-600 dark:text-slate-400">Overall Progress</span>
                <span className="text-sm font-medium">
                  {formatCurrency(budget.spent, budget.currency)} / {formatCurrency(budget.amount, budget.currency)}
                </span>
              </div>
              
              <Progress 
                value={Math.min(budget.utilization, 100)} 
                className="h-3"
              />
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-slate-600 dark:text-slate-400">Period: </span>
                  <span className="font-medium">{formatDate(budget.startDate)} - {formatDate(budget.endDate)}</span>
                </div>
                {budget.daysRemaining !== undefined && budget.status === 'active' && (
                  <div>
                    <span className="text-slate-600 dark:text-slate-400">Days Remaining: </span>
                    <span className="font-medium">{budget.daysRemaining} days</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Detailed Analysis Tabs */}
          <Tabs defaultValue="monthly" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="monthly">Monthly Breakdown</TabsTrigger>
              <TabsTrigger value="trends">Trends</TabsTrigger>
              <TabsTrigger value="summary">Summary</TabsTrigger>
            </TabsList>

            <TabsContent value="monthly" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <BarChart3 className="h-5 w-5 mr-2" />
                    Monthly Spending vs Budget
                  </CardTitle>
                  <CardDescription>
                    Compare actual spending against budgeted amounts each month
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                        <XAxis 
                          dataKey="month" 
                          stroke="#64748b"
                          fontSize={12}
                        />
                        <YAxis 
                          stroke="#64748b"
                          fontSize={12}
                          tickFormatter={(value) => `$${value}`}
                        />
                        <Tooltip 
                          formatter={(value, name) => {
                            if (name === 'actual') return [`$${Number(value).toFixed(2)}`, 'Actual Spent'];
                            if (name === 'budgeted') return [`$${Number(value).toFixed(2)}`, 'Budgeted'];
                            return [`${Number(value).toFixed(1)}%`, 'Utilization'];
                          }}
                          labelStyle={{ color: '#1e293b' }}
                          contentStyle={{ 
                            backgroundColor: 'white', 
                            border: '1px solid #e2e8f0',
                            borderRadius: '8px'
                          }}
                        />
                        <Bar 
                          dataKey="budgeted" 
                          fill="#e2e8f0" 
                          name="budgeted"
                          radius={[4, 4, 0, 0]}
                        />
                        <Bar 
                          dataKey="actual" 
                          fill="#3b82f6" 
                          name="actual"
                          radius={[4, 4, 0, 0]}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* Monthly Details Table */}
              <Card>
                <CardHeader>
                  <CardTitle>Monthly Details</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {budgetHistory.monthlyData.map((monthData, index) => {
                      const monthSpent = parseFloat(monthData.actualAmount.amount);
                      const monthBudget = parseFloat(monthData.budgetedAmount.amount);
                      const monthUtilization = parseFloat(monthData.utilization);
                      const monthRemaining = monthBudget - monthSpent;
                      
                      return (
                        <div key={index} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                          <div>
                            <div className="font-medium">
                              {formatDateShort(monthData.timePeriod.start)} - {formatDateShort(monthData.timePeriod.end)}
                            </div>
                            <div className="text-sm text-slate-600 dark:text-slate-400">
                              {formatCurrency(monthSpent)} / {formatCurrency(monthBudget)}
                            </div>
                          </div>
                          <div className="text-right">
                            <div className={`font-medium ${monthUtilization > 100 ? 'text-red-600 dark:text-red-400' : 'text-slate-900 dark:text-slate-100'}`}>
                              {monthUtilization.toFixed(1)}%
                            </div>
                            <div className={`text-sm ${monthRemaining < 0 ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400'}`}>
                              {monthRemaining < 0 ? 'Over: ' : 'Left: '}
                              {formatCurrency(Math.abs(monthRemaining))}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="trends" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <TrendingUp className="h-5 w-5 mr-2" />
                    Utilization Trend
                  </CardTitle>
                  <CardDescription>
                    Track how your budget utilization changes over time
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                        <XAxis 
                          dataKey="month" 
                          stroke="#64748b"
                          fontSize={12}
                        />
                        <YAxis 
                          stroke="#64748b"
                          fontSize={12}
                          tickFormatter={(value) => `${value}%`}
                        />
                        <Tooltip 
                          formatter={(value) => [`${Number(value).toFixed(1)}%`, 'Utilization']}
                          labelStyle={{ color: '#1e293b' }}
                          contentStyle={{ 
                            backgroundColor: 'white', 
                            border: '1px solid #e2e8f0',
                            borderRadius: '8px'
                          }}
                        />
                        <Line 
                          type="monotone" 
                          dataKey="utilization" 
                          stroke="#3b82f6" 
                          strokeWidth={3}
                          dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
                          activeDot={{ r: 6, stroke: '#3b82f6', strokeWidth: 2 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="summary" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Budget Summary</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-slate-600 dark:text-slate-400">Budget Type:</span>
                      <span className="font-medium">{budgetHistory.budgetType}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600 dark:text-slate-400">Time Unit:</span>
                      <span className="font-medium">{budgetHistory.timeUnit}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600 dark:text-slate-400">Total Months:</span>
                      <span className="font-medium">{budgetHistory.totalMonths}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600 dark:text-slate-400">Budget Limit:</span>
                      <span className="font-medium">
                        {formatCurrency(parseFloat(budgetHistory.budgetLimit.amount), budgetHistory.budgetLimit.unit)}
                      </span>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Performance Metrics</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-slate-600 dark:text-slate-400">Average Utilization:</span>
                      <span className="font-medium">{budgetHistory.summary.averageUtilization}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600 dark:text-slate-400">Max Utilization:</span>
                      <span className="font-medium">{budgetHistory.summary.maxUtilization}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600 dark:text-slate-400">Min Utilization:</span>
                      <span className="font-medium">{budgetHistory.summary.minUtilization}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600 dark:text-slate-400">Months Over Budget:</span>
                      <span className={`font-medium ${budgetHistory.summary.monthsOverBudget > 0 ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400'}`}>
                        {budgetHistory.summary.monthsOverBudget}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
};
