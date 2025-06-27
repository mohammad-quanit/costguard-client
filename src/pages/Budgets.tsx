import { useState, useMemo, useCallback } from "react";
import { Layout } from "@/components/Layout";
import { DualBudgetManager } from "@/components/DualBudgetManager";
import { BudgetModal } from "@/components/BudgetModal";
import { useBudgets } from "@/hooks/useBudgets";
import { useCostData } from "@/hooks/useCostData";
import { AppBudget, CreateBudgetRequest, UpdateBudgetRequest } from "@/services/budgetService";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle, RefreshCw } from "lucide-react";

const Budgets = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBudget, setEditingBudget] = useState<AppBudget | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Get existing AWS budgets from the cost data hook
  const { budgetCards = [], isLoading: isCostDataLoading, error: costDataError } = useCostData();

  // Convert budget cards to AWS budget format - STABLE memoization
  const awsBudgets = useMemo(() => {
    if (!Array.isArray(budgetCards) || budgetCards.length === 0) {
      return [];
    }
    
    return budgetCards.map(card => ({
      budgetId: String(card.id || Math.random()),
      budgetName: String(card.name || 'Unnamed Budget'),
      budgetLimit: {
        amount: String(card.amount || 0),
        unit: String(card.currency || 'USD')
      },
      actualSpend: {
        amount: String(card.spent || 0),
        unit: String(card.currency || 'USD')
      },
      budgetType: 'COST' as const,
      timeUnit: 'MONTHLY' as const,
      timePeriod: {
        start: String(card.startDate || ''),
        end: String(card.endDate || '')
      }
    }));
  }, [budgetCards]);

  // Use the budgets hook - ONLY pass the memoized awsBudgets
  const budgetHookResult = useBudgets(awsBudgets);
  
  // Destructure to prevent object recreation
  const {
    appBudgets,
    isLoading,
    isCreating,
    isUpdating,
    error,
    createBudget,
    updateBudget,
    deleteBudget,
    fetchBudgets,
    getTotalBudgets,
    getOverBudgetCount
  } = budgetHookResult;

  // Manual refresh function for app budgets
  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    try {
      await fetchBudgets();
    } catch (error) {
      console.error('Error refreshing budgets:', error);
    } finally {
      setIsRefreshing(false);
    }
  }, [fetchBudgets]);

  // STABLE event handlers - memoized with proper dependencies
  const handleCreateBudget = useCallback(() => {
    setEditingBudget(null);
    setIsModalOpen(true);
  }, []);

  const handleEditBudget = useCallback((budgetId: string, type: 'aws' | 'app') => {
    if (type === 'app') {
      const budget = appBudgets.find(b => b.budgetId === budgetId);
      if (budget) {
        setEditingBudget(budget);
        setIsModalOpen(true);
      }
    } else {
      window.open('https://console.aws.amazon.com/billing/home#/budgets', '_blank');
    }
  }, [appBudgets]);

  const handleSaveBudget = useCallback(async (budgetData: CreateBudgetRequest | UpdateBudgetRequest) => {
    try {
      if ('budgetId' in budgetData) {
        await updateBudget(budgetData as UpdateBudgetRequest);
      } else {
        await createBudget(budgetData as CreateBudgetRequest);
      }
      setIsModalOpen(false);
      setEditingBudget(null);
    } catch (error) {
      console.error('Error saving budget:', error);
    }
  }, [createBudget, updateBudget]);

  const handleDeleteBudget = useCallback(async (budgetId: string) => {
    if (window.confirm('Are you sure you want to delete this budget?')) {
      try {
        await deleteBudget(budgetId);
      } catch (error) {
        console.error('Error deleting budget:', error);
      }
    }
  }, [deleteBudget]);

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
    setEditingBudget(null);
  }, []);

  // Memoize computed values
  const totalBudgets = useMemo(() => {
    const total = getTotalBudgets();
    return total;
  }, [getTotalBudgets]);

  const overBudgetCount = useMemo(() => {
    const count = getOverBudgetCount();
    return count;
  }, [getOverBudgetCount]);

  // Loading state
  if (isLoading || isCostDataLoading) {
    return (
      <Layout>
        <main className="container mx-auto px-4 py-8">
          <div className="mb-6">
            <Skeleton className="h-8 w-64 mb-2" />
            <Skeleton className="h-4 w-96" />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-24" />
            ))}
          </div>
          
          <Skeleton className="h-96" />
        </main>
      </Layout>
    );
  }

  return (
    <Layout>
      <main className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">Budget Management</h1>
            <p className="text-slate-600 dark:text-slate-400 mt-2">
              Manage AWS native budgets and custom application budgets
            </p>
          </div>
          
          <div className="flex items-center space-x-3">
            <Button variant="outline" onClick={handleRefresh} disabled={isLoading || isRefreshing}>
              <RefreshCw className={`h-4 w-4 mr-2 ${isLoading || isRefreshing ? 'animate-spin' : ''}`} />
              {isRefreshing ? 'Refreshing...' : 'Refresh'}
            </Button>
          </div>
        </div>

        {/* Error Display */}
        {(error || costDataError) && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              {error || costDataError}
            </AlertDescription>
          </Alert>
        )}

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 rounded-lg">
            <div className="text-2xl font-bold">{totalBudgets}</div>
            <div className="text-blue-100">Total Budgets</div>
          </div>
          
          <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-6 rounded-lg">
            <div className="text-2xl font-bold">{appBudgets.length}</div>
            <div className="text-green-100">App Budgets</div>
          </div>
          
          <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white p-6 rounded-lg">
            <div className="text-2xl font-bold">{awsBudgets.length}</div>
            <div className="text-orange-100">AWS Budgets</div>
          </div>
          
          <div className={`bg-gradient-to-r ${overBudgetCount > 0 ? 'from-red-500 to-red-600' : 'from-slate-500 to-slate-600'} text-white p-6 rounded-lg`}>
            <div className="text-2xl font-bold">{overBudgetCount}</div>
            <div className={overBudgetCount > 0 ? 'text-red-100' : 'text-slate-100'}>Over Budget</div>
          </div>
        </div>

        {/* Main Budget Manager */}
        <DualBudgetManager
          awsBudgets={awsBudgets}
          appBudgets={appBudgets}
          onCreateAppBudget={handleCreateBudget}
          onEditBudget={handleEditBudget}
          onDeleteAppBudget={handleDeleteBudget}
        />

        {/* Budget Modal */}
        <BudgetModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onSave={handleSaveBudget}
          budget={editingBudget}
          isLoading={isCreating || isUpdating}
        />
      </main>
    </Layout>
  );
};

export default Budgets;
