import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  DollarSign, 
  Plus, 
  Settings, 
  Cloud, 
  Database,
  AlertCircle,
  Info,
  TrendingUp,
  Shield,
  Loader2
} from "lucide-react";

interface AWSBudget {
  budgetId: string;
  budgetName: string;
  budgetLimit: {
    amount: string;
    unit: string;
  };
  actualSpend: {
    amount: string;
    unit: string;
  };
  forecastedSpend?: {
    amount: string;
    unit: string;
  };
  budgetType: 'COST' | 'USAGE' | 'RI_UTILIZATION' | 'RI_COVERAGE';
  timeUnit: 'DAILY' | 'MONTHLY' | 'QUARTERLY' | 'ANNUALLY';
  timePeriod: {
    start: string;
    end: string;
  };
  costFilters?: any;
  calculatedSpend?: {
    actualSpend: {
      amount: string;
      unit: string;
    };
    forecastedSpend: {
      amount: string;
      unit: string;
    };
  };
}

interface AppBudget {
  budgetId: string;
  budgetName: string;
  monthlyLimit: number;
  currency: string;
  alertThreshold: number;
  alertFrequency: 'daily' | 'weekly' | 'monthly';
  services: string[];
  tags: Record<string, any>;
  notifications: {
    sns: boolean;
    email: boolean;
    webhookUrl?: string | null;
    slack: boolean;
  };
  isActive: boolean;
  totalSpentThisMonth: number;
  projectedMonthlySpend: number;
  remainingBudget: number;
  utilization: number;
  status: 'on_track' | 'near_limit' | 'over_budget';
  lastAlertSent: string | null;
  createdAt: string;
  updatedAt: string;
}

interface DualBudgetManagerProps {
  awsBudgets: AWSBudget[];
  appBudgets: AppBudget[];
  onCreateAppBudget: () => void;
  onEditBudget: (budgetId: string, type: 'aws' | 'app') => void;
  onDeleteAppBudget: (budgetId: string) => void;
  isDeleting?: boolean;
}

export const DualBudgetManager = ({
  awsBudgets,
  appBudgets,
  onCreateAppBudget,
  onEditBudget,
  onDeleteAppBudget,
  isDeleting = false
}: DualBudgetManagerProps) => {
  const [activeTab, setActiveTab] = useState<'aws' | 'app'>('app');

  const formatCurrency = (amount: string | number, currency: string = 'USD') => {
    const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2,
    }).format(numAmount);
  };

  const calculateUtilization = (spent: number, budget: number) => {
    return budget > 0 ? (spent / budget) * 100 : 0;
  };

  const getBudgetStatusColor = (utilization: number) => {
    if (utilization >= 100) return 'text-red-600 bg-red-100 dark:bg-red-900/20 dark:text-red-400';
    if (utilization >= 80) return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/20 dark:text-yellow-400';
    return 'text-green-600 bg-green-100 dark:bg-green-900/20 dark:text-green-400';
  };

  const getBudgetStatusText = (utilization: number) => {
    if (utilization >= 100) return 'Over Budget';
    if (utilization >= 80) return 'Near Limit';
    return 'On Track';
  };

  return (
    <div className="space-y-6">
      {/* Header with Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 dark:text-slate-400">AWS Budgets</p>
                <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                  {awsBudgets.length}
                </p>
              </div>
              <Cloud className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 dark:text-slate-400">App Budgets</p>
                <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                  {appBudgets.length}
                </p>
              </div>
              <Database className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 dark:text-slate-400">Total Budgets</p>
                <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                  {awsBudgets.length + appBudgets.length}
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Budget Interface */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center">
                <DollarSign className="h-5 w-5 mr-2" />
                Budget Management
              </CardTitle>
              <CardDescription>
                Manage both AWS native budgets and custom application budgets
              </CardDescription>
            </div>
            <Button onClick={onCreateAppBudget} className="flex items-center">
              <Plus className="h-4 w-4 mr-2" />
              Create App Budget
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'aws' | 'app')}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="app" className="flex items-center">
                <Database className="h-4 w-4 mr-2" />
                App Budgets ({appBudgets.length})
              </TabsTrigger>
              <TabsTrigger value="aws" className="flex items-center">
                <Cloud className="h-4 w-4 mr-2" />
                AWS Budgets ({awsBudgets.length})
              </TabsTrigger>
            </TabsList>

            {/* App Budgets Tab */}
            <TabsContent value="app" className="space-y-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <Info className="h-4 w-4 text-blue-500" />
                  <span className="text-sm text-slate-600 dark:text-slate-400">
                    Custom budgets created and managed within CostGuard
                  </span>
                </div>
                <Badge variant="outline" className="bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400">
                  <Database className="h-3 w-3 mr-1" />
                  DynamoDB
                </Badge>
              </div>

              {appBudgets.length === 0 ? (
                <div className="text-center py-12">
                  <Database className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-slate-900 dark:text-slate-100 mb-2">
                    No App Budgets Created
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400 mb-4">
                    Create custom budgets with advanced rules and notifications
                  </p>
                  <Button onClick={onCreateAppBudget}>
                    <Plus className="h-4 w-4 mr-2" />
                    Create Your First Budget
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {appBudgets.map((budget) => {
                    // Add safety checks for all budget properties
                    const safeStatus = budget.status || 'unknown';
                    const safeUtilization = budget.utilization || 0;
                    const safeBudgetName = budget.budgetName || 'Unnamed Budget';
                    const safeAlertFrequency = budget.alertFrequency || 'daily';
                    const safeServices = budget.services || [];
                    const safeCurrency = budget.currency || 'USD';
                    const safeMonthlyLimit = budget.monthlyLimit || 0;
                    const safeTotalSpent = budget.totalSpentThisMonth || 0;
                    const safeRemainingBudget = budget.remainingBudget || 0;
                    const safeProjectedSpend = budget.projectedMonthlySpend || 0;
                    const safeNotifications = budget.notifications || { email: false, sns: false, slack: false };
                    
                    return (
                      <Card key={budget.budgetId} className="border-l-4 border-l-blue-500">
                        <CardContent className="pt-4">
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100">
                                {safeBudgetName}
                              </h3>
                              <div className="flex items-center space-x-2 mt-1">
                                <Badge variant="outline" className="text-xs">
                                  {safeAlertFrequency}
                                </Badge>
                                <Badge variant="secondary" className="text-xs">
                                  {safeServices.length} services
                                </Badge>
                                {!budget.isActive && (
                                  <Badge variant="destructive" className="text-xs">
                                    Inactive
                                  </Badge>
                                )}
                              </div>
                            </div>
                            <Badge className={getBudgetStatusColor(safeUtilization)}>
                              {safeStatus.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                            </Badge>
                          </div>

                          <div className="space-y-3">
                            <div className="flex justify-between items-center">
                              <span className="text-sm text-slate-600 dark:text-slate-400">Progress</span>
                              <span className="text-sm font-medium">
                                {formatCurrency(safeTotalSpent, safeCurrency)} / {formatCurrency(safeMonthlyLimit, safeCurrency)}
                              </span>
                            </div>
                            
                            <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                              <div 
                                className={`h-2 rounded-full transition-all duration-300 ${
                                  safeUtilization >= 100 ? 'bg-red-500' : 
                                  safeUtilization >= 80 ? 'bg-yellow-500' : 'bg-green-500'
                                }`}
                                style={{ width: `${Math.min(safeUtilization, 100)}%` }}
                              />
                            </div>
                            
                            <div className="flex justify-between text-sm">
                              <span className="text-slate-600 dark:text-slate-400">
                                {safeUtilization.toFixed(1)}% used
                              </span>
                              <span className={`font-medium ${
                                safeRemainingBudget < 0 
                                  ? 'text-red-600 dark:text-red-400' 
                                  : 'text-green-600 dark:text-green-400'
                              }`}>
                                {safeRemainingBudget < 0 ? 'Over by ' : 'Remaining: '}
                                {formatCurrency(Math.abs(safeRemainingBudget), safeCurrency)}
                              </span>
                            </div>

                            {/* Services and Notifications Info */}
                            <div className="grid grid-cols-2 gap-4 text-xs">
                              <div className="space-y-1">
                                <div className="text-slate-500 dark:text-slate-400">Services:</div>
                                <div className="flex flex-wrap gap-1">
                                  {safeServices.slice(0, 3).map((service, idx) => (
                                    <Badge key={idx} variant="outline" className="text-xs px-1 py-0">
                                      {service}
                                    </Badge>
                                  ))}
                                  {safeServices.length > 3 && (
                                    <Badge variant="outline" className="text-xs px-1 py-0">
                                      +{safeServices.length - 3}
                                    </Badge>
                                  )}
                                </div>
                              </div>
                              
                              <div className="space-y-1">
                                <div className="text-slate-500 dark:text-slate-400">Notifications:</div>
                                <div className="flex space-x-1">
                                  {safeNotifications.email && (
                                    <Badge variant="outline" className="text-xs px-1 py-0">Email</Badge>
                                  )}
                                  {safeNotifications.sns && (
                                    <Badge variant="outline" className="text-xs px-1 py-0">SNS</Badge>
                                  )}
                                  {safeNotifications.slack && (
                                    <Badge variant="outline" className="text-xs px-1 py-0">Slack</Badge>
                                  )}
                                </div>
                              </div>
                            </div>

                            {/* Projected Spend */}
                            {safeProjectedSpend > 0 && (
                              <div className="text-xs text-slate-500 dark:text-slate-400 border-t pt-2">
                                <div className="flex items-center justify-between">
                                  <span>Projected Monthly:</span>
                                  <span className={safeProjectedSpend > safeMonthlyLimit ? 'text-red-600 dark:text-red-400' : ''}>
                                    {formatCurrency(safeProjectedSpend, safeCurrency)}
                                  </span>
                                </div>
                              </div>
                            )}
                          </div>

                          <div className="flex space-x-2 mt-4">
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={() => onEditBudget(budget.budgetId, 'app')}
                              className="flex-1"
                            >
                              <Settings className="h-3 w-3 mr-1" />
                              Edit
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={() => onDeleteAppBudget(budget.budgetId)}
                              disabled={isDeleting}
                              className="text-red-600 hover:text-red-700 disabled:opacity-50"
                            >
                              {isDeleting ? (
                                <>
                                  <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                                  Deleting...
                                </>
                              ) : (
                                'Delete'
                              )}
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              )}
            </TabsContent>

            {/* AWS Budgets Tab */}
            <TabsContent value="aws" className="space-y-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <Shield className="h-4 w-4 text-orange-500" />
                  <span className="text-sm text-slate-600 dark:text-slate-400">
                    Native AWS Budgets managed through AWS Budgets service
                  </span>
                </div>
                <Badge variant="outline" className="bg-orange-50 text-orange-700 dark:bg-orange-900/20 dark:text-orange-400">
                  <Cloud className="h-3 w-3 mr-1" />
                  AWS Native
                </Badge>
              </div>

              {awsBudgets.length === 0 ? (
                <div className="text-center py-12">
                  <Cloud className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-slate-900 dark:text-slate-100 mb-2">
                    No AWS Budgets Found
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400 mb-4">
                    AWS Budgets are managed through the AWS Console
                  </p>
                  <Button variant="outline" asChild>
                    <a href="https://console.aws.amazon.com/billing/home#/budgets" target="_blank" rel="noopener noreferrer">
                      <Cloud className="h-4 w-4 mr-2" />
                      Open AWS Console
                    </a>
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {awsBudgets.map((budget) => {
                    const actualAmount = parseFloat(budget.actualSpend.amount);
                    const budgetAmount = parseFloat(budget.budgetLimit.amount);
                    const utilization = calculateUtilization(actualAmount, budgetAmount);
                    
                    return (
                      <Card key={budget.budgetId} className="border-l-4 border-l-orange-500">
                        <CardContent className="pt-4">
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100">
                                {budget.budgetName}
                              </h3>
                              <div className="flex items-center space-x-2 mt-1">
                                <Badge variant="outline" className="text-xs">
                                  {budget.timeUnit.toLowerCase()}
                                </Badge>
                                <Badge variant="secondary" className="text-xs">
                                  {budget.budgetType}
                                </Badge>
                              </div>
                            </div>
                            <Badge className={getBudgetStatusColor(utilization)}>
                              {getBudgetStatusText(utilization)}
                            </Badge>
                          </div>

                          <div className="space-y-3">
                            <div className="flex justify-between items-center">
                              <span className="text-sm text-slate-600 dark:text-slate-400">Progress</span>
                              <span className="text-sm font-medium">
                                {formatCurrency(actualAmount)} / {formatCurrency(budgetAmount)}
                              </span>
                            </div>
                            
                            <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                              <div 
                                className={`h-2 rounded-full transition-all duration-300 ${
                                  utilization >= 100 ? 'bg-red-500' : 
                                  utilization >= 80 ? 'bg-yellow-500' : 'bg-green-500'
                                }`}
                                style={{ width: `${Math.min(utilization, 100)}%` }}
                              />
                            </div>
                            
                            <div className="flex justify-between text-sm">
                              <span className="text-slate-600 dark:text-slate-400">
                                {utilization.toFixed(1)}% used
                              </span>
                              <span className={`font-medium ${
                                budgetAmount - actualAmount < 0 
                                  ? 'text-red-600 dark:text-red-400' 
                                  : 'text-green-600 dark:text-green-400'
                              }`}>
                                {budgetAmount - actualAmount < 0 ? 'Over by ' : 'Remaining: '}
                                {formatCurrency(Math.abs(budgetAmount - actualAmount))}
                              </span>
                            </div>

                            {budget.forecastedSpend && (
                              <div className="text-xs text-slate-500 dark:text-slate-400">
                                <div className="flex items-center justify-between">
                                  <span>Forecasted:</span>
                                  <span>{formatCurrency(parseFloat(budget.forecastedSpend.amount))}</span>
                                </div>
                              </div>
                            )}
                          </div>

                          <div className="flex space-x-2 mt-4">
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={() => onEditBudget(budget.budgetId, 'aws')}
                              className="flex-1"
                            >
                              <Settings className="h-3 w-3 mr-1" />
                              View Details
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              asChild
                            >
                              <a href="https://console.aws.amazon.com/billing/home#/budgets" target="_blank" rel="noopener noreferrer">
                                <Cloud className="h-3 w-3 mr-1" />
                                AWS Console
                              </a>
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};
