
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { Layout } from "@/components/Layout";
import { useBudgets } from "@/hooks/useBudgets";
import { BudgetService } from "@/services/budgetService";
import { Settings, Bell, AlertTriangle, Target, Save, RefreshCw } from "lucide-react";

const AlertSettings = () => {
  const { appBudgets, isLoading, error, fetchBudgets, updateBudget } = useBudgets();
  const [selectedBudgetId, setSelectedBudgetId] = useState<string>("");
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateError, setUpdateError] = useState<string | null>(null);
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Form state for selected budget
  const [alertSettings, setAlertSettings] = useState({
    alertThreshold: 80,
    alertFrequency: 'daily' as 'daily' | 'weekly' | 'monthly',
    notifications: {
      email: true,
      sns: false,
      slack: false,
      webhookUrl: ''
    }
  });

  // Load selected budget data
  useEffect(() => {
    if (selectedBudgetId && appBudgets.length > 0) {
      const selectedBudget = appBudgets.find(b => b.budgetId === selectedBudgetId);
      if (selectedBudget) {
        setAlertSettings({
          alertThreshold: selectedBudget.alertThreshold,
          alertFrequency: selectedBudget.alertFrequency,
          notifications: selectedBudget.notifications
        });
      }
    }
  }, [selectedBudgetId, appBudgets]);

  // Auto-select first budget if none selected
  useEffect(() => {
    if (!selectedBudgetId && appBudgets.length > 0) {
      setSelectedBudgetId(appBudgets[0].budgetId);
    }
  }, [appBudgets, selectedBudgetId]);

  // Manual refresh function
  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await fetchBudgets();
    } catch (error) {
      console.error('Error refreshing budgets:', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleSaveAlerts = async () => {
    if (!selectedBudgetId) return;

    const selectedBudget = appBudgets.find(b => b.budgetId === selectedBudgetId);
    if (!selectedBudget) return;

    setIsUpdating(true);
    setUpdateError(null);
    setUpdateSuccess(false);

    try {
      await updateBudget({
        budgetId: selectedBudget.budgetId,
        budgetName: selectedBudget.budgetName,
        monthlyLimit: selectedBudget.monthlyLimit,
        currency: selectedBudget.currency,
        alertThreshold: alertSettings.alertThreshold,
        alertFrequency: alertSettings.alertFrequency,
        services: selectedBudget.services,
        tags: selectedBudget.tags,
        notifications: alertSettings.notifications,
        isActive: selectedBudget.isActive
      });

      setUpdateSuccess(true);
      setTimeout(() => setUpdateSuccess(false), 3000);
    } catch (error: any) {
      setUpdateError(error.message || 'Failed to update alert settings');
    } finally {
      setIsUpdating(false);
    }
  };

  const selectedBudget = appBudgets.find(b => b.budgetId === selectedBudgetId);

  if (isLoading) {
    return (
      <Layout>
        <main className="container mx-auto px-4 py-8">
          <div className="mb-6">
            <Skeleton className="h-8 w-64 mb-2" />
            <Skeleton className="h-4 w-96" />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Skeleton className="h-96" />
            <Skeleton className="h-96" />
          </div>
        </main>
      </Layout>
    );
  }

  return (
    <Layout>
      <main className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">Alert Settings</h1>
            <p className="text-slate-600 dark:text-slate-400 mt-2">
              Configure alerts for your app budgets
            </p>
          </div>
          <Button variant="outline" onClick={handleRefresh} disabled={isLoading || isRefreshing}>
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading || isRefreshing ? 'animate-spin' : ''}`} />
            {isRefreshing ? 'Refreshing...' : 'Refresh'}
          </Button>
        </div>

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {updateSuccess && (
          <Alert className="mb-6 border-green-200 bg-green-50 dark:bg-green-900/20">
            <AlertTriangle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800 dark:text-green-200">
              Alert settings updated successfully!
            </AlertDescription>
          </Alert>
        )}

        {updateError && (
          <Alert variant="destructive" className="mb-6">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>{updateError}</AlertDescription>
          </Alert>
        )}

        {appBudgets.length === 0 && !isLoading ? (
          <Card>
            <CardContent className="text-center py-12">
              <Target className="h-12 w-12 text-slate-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-slate-900 dark:text-slate-100 mb-2">
                No App Budgets Found
              </h3>
              <p className="text-slate-600 dark:text-slate-400 mb-4">
                Load your app budgets or create new ones to configure alerts
              </p>
              <div className="flex justify-center space-x-3">
                <Button onClick={handleRefresh} disabled={isRefreshing}>
                  <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
                  {isRefreshing ? 'Loading...' : 'Load Budgets'}
                </Button>
                <Button variant="outline" asChild>
                  <a href="/budgets">Create Budget</a>
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : appBudgets.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <Target className="h-12 w-12 text-slate-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-slate-900 dark:text-slate-100 mb-2">
                Loading Budgets...
              </h3>
              <p className="text-slate-600 dark:text-slate-400">
                Please wait while we load your app budgets
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Budget Selection */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Target className="h-5 w-5 mr-2" />
                  Select Budget
                </CardTitle>
                <CardDescription>
                  Choose which app budget to configure alerts for
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="budget-select">App Budget</Label>
                  <Select value={selectedBudgetId} onValueChange={setSelectedBudgetId}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a budget" />
                    </SelectTrigger>
                    <SelectContent>
                      {appBudgets.map((budget) => (
                        <SelectItem key={budget.budgetId} value={budget.budgetId}>
                          <div className="flex items-center justify-between w-full">
                            <span>{budget.budgetName}</span>
                            <Badge variant={budget.status === 'over_budget' ? 'destructive' : 
                                          budget.status === 'near_limit' ? 'secondary' : 'default'} 
                                   className="ml-2">
                              {BudgetService.formatCurrency(budget.monthlyLimit, budget.currency)}
                            </Badge>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {selectedBudget && (
                  <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-slate-600 dark:text-slate-400">Monthly Limit:</span>
                      <span className="text-sm font-medium">
                        {BudgetService.formatCurrency(selectedBudget.monthlyLimit || 0, selectedBudget.currency || 'USD')}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-slate-600 dark:text-slate-400">Current Spend:</span>
                      <span className="text-sm font-medium">
                        {BudgetService.formatCurrency(selectedBudget.totalSpentThisMonth || 0, selectedBudget.currency || 'USD')}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-slate-600 dark:text-slate-400">Utilization:</span>
                      <span className={`text-sm font-medium ${
                        (selectedBudget.utilization || 0) >= 100 ? 'text-red-600' :
                        (selectedBudget.utilization || 0) >= 80 ? 'text-yellow-600' : 'text-green-600'
                      }`}>
                        {(selectedBudget.utilization || 0).toFixed(1)}%
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-slate-600 dark:text-slate-400">Status:</span>
                      <Badge variant={selectedBudget.status === 'over_budget' ? 'destructive' : 
                                    selectedBudget.status === 'near_limit' ? 'secondary' : 'default'}>
                        {(selectedBudget.status || 'unknown').replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      </Badge>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Alert Configuration */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Bell className="h-5 w-5 mr-2" />
                  Alert Configuration
                </CardTitle>
                <CardDescription>
                  Set alert thresholds and notification preferences
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {selectedBudget ? (
                  <>
                    {/* Alert Threshold */}
                    <div className="space-y-2">
                      <Label htmlFor="alert-threshold">Alert Threshold (%)</Label>
                      <Input
                        id="alert-threshold"
                        type="number"
                        min="1"
                        max="100"
                        value={alertSettings.alertThreshold}
                        onChange={(e) => setAlertSettings(prev => ({
                          ...prev,
                          alertThreshold: parseInt(e.target.value) || 80
                        }))}
                      />
                      <p className="text-xs text-slate-500">
                        Alert when spending reaches this percentage of the budget
                      </p>
                    </div>

                    {/* Alert Frequency */}
                    <div className="space-y-2">
                      <Label htmlFor="alert-frequency">Alert Frequency</Label>
                      <Select 
                        value={alertSettings.alertFrequency} 
                        onValueChange={(value: 'daily' | 'weekly' | 'monthly') => 
                          setAlertSettings(prev => ({ ...prev, alertFrequency: value }))
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="daily">Daily</SelectItem>
                          <SelectItem value="weekly">Weekly</SelectItem>
                          <SelectItem value="monthly">Monthly</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Notification Preferences */}
                    <div className="space-y-4">
                      <Label>Notification Methods</Label>
                      
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div>
                            <Label htmlFor="email-notifications">Email Notifications</Label>
                            <p className="text-xs text-slate-500">Receive alerts via email</p>
                          </div>
                          <Switch
                            id="email-notifications"
                            checked={alertSettings.notifications.email}
                            onCheckedChange={(checked) => 
                              setAlertSettings(prev => ({
                                ...prev,
                                notifications: { ...prev.notifications, email: checked }
                              }))
                            }
                          />
                        </div>

                        {/* SNS and Slack notifications disabled for now */}
                        <div className="opacity-50">
                          <div className="flex items-center justify-between">
                            <div>
                              <Label>SNS Notifications</Label>
                              <p className="text-xs text-slate-500">Coming soon - AWS SNS integration</p>
                            </div>
                            <Switch disabled checked={false} />
                          </div>
                        </div>

                        <div className="opacity-50">
                          <div className="flex items-center justify-between">
                            <div>
                              <Label>Slack Notifications</Label>
                              <p className="text-xs text-slate-500">Coming soon - Slack integration</p>
                            </div>
                            <Switch disabled checked={false} />
                          </div>
                        </div>
                      </div>
                    </div>

                    <Button 
                      onClick={handleSaveAlerts} 
                      disabled={isUpdating}
                      className="w-full"
                    >
                      {isUpdating ? (
                        <>
                          <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                          Updating...
                        </>
                      ) : (
                        <>
                          <Save className="h-4 w-4 mr-2" />
                          Save Alert Settings
                        </>
                      )}
                    </Button>
                  </>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-slate-500">Select a budget to configure alerts</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </main>
    </Layout>
  );
};

export default AlertSettings;
