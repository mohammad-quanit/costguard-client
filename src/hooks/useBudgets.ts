import { useState, useEffect, useCallback, useMemo } from 'react';
import { BudgetService, AppBudget, CreateBudgetRequest, UpdateBudgetRequest } from '@/services/budgetService';

// AWS Budget type (from existing budget data)
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
}

interface UseBudgetsReturn {
  // Data
  appBudgets: AppBudget[];
  awsBudgets: AWSBudget[];
  
  // Loading states
  isLoading: boolean;
  isCreating: boolean;
  isUpdating: boolean;
  isDeleting: boolean;
  
  // Error states
  error: string | null;
  
  // Actions
  fetchBudgets: () => Promise<void>;
  createBudget: (budgetData: CreateBudgetRequest) => Promise<void>;
  updateBudget: (budgetData: UpdateBudgetRequest) => Promise<void>;
  deleteBudget: (budgetId: string) => Promise<void>;
  
  // Utilities
  getTotalBudgets: () => number;
  getTotalAppBudgetAmount: () => number;
  getTotalAWSBudgetAmount: () => number;
  getOverBudgetCount: () => number;
}

export const useBudgets = (existingAWSBudgets: AWSBudget[] = []): UseBudgetsReturn => {
  const [appBudgets, setAppBudgets] = useState<AppBudget[]>([]);
  const [awsBudgets, setAWSBudgets] = useState<AWSBudget[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch app budgets from API - memoized to prevent re-creation
  const fetchBudgets = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await BudgetService.getBudgets();
      setAppBudgets(response.budgets || []);
    } catch (err: any) {
      console.error('useBudgets - Error fetching budgets:', err);
      setError(err.message || 'Failed to fetch budgets');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Create budget function - memoized
  const createBudget = useCallback(async (budgetData: CreateBudgetRequest) => {
    setIsCreating(true);
    setError(null);
    
    try {
      const response = await BudgetService.createBudget(budgetData);
      
      // Add the new budget to the list
      setAppBudgets(prev => [...prev, response.budget]);
    } catch (err: any) {
      console.error('useBudgets - Error creating budget:', err);
      setError(err.message || 'Failed to create budget');
      throw err;
    } finally {
      setIsCreating(false);
    }
  }, []);

  // Update budget function - memoized
  const updateBudget = useCallback(async (budgetData: UpdateBudgetRequest) => {
    setIsUpdating(true);
    setError(null);
    
    try {
      const response = await BudgetService.updateBudget(budgetData);
      
      // Update the budget in the list
      setAppBudgets(prev => 
        prev.map(budget => 
          budget.budgetId === budgetData.budgetId ? response.budget : budget
        )
      );
    } catch (err: any) {
      console.error('useBudgets - Error updating budget:', err);
      setError(err.message || 'Failed to update budget');
      throw err;
    } finally {
      setIsUpdating(false);
    }
  }, []);

  // Delete budget function - memoized
  const deleteBudget = useCallback(async (budgetId: string) => {
    setIsDeleting(true);
    setError(null);
    
    try {
      await BudgetService.deleteBudget(budgetId);
      
      // Remove the budget from the list
      setAppBudgets(prev => prev.filter(budget => budget.budgetId !== budgetId));
    } catch (err: any) {
      console.error('useBudgets - Error deleting budget:', err);
      setError(err.message || 'Failed to delete budget');
      throw err;
    } finally {
      setIsDeleting(false);
    }
  }, []);

  // Utility functions - memoized with proper dependencies
  const getTotalBudgets = useCallback(() => {
    return appBudgets.length + awsBudgets.length;
  }, [appBudgets.length, awsBudgets.length]);

  const getTotalAppBudgetAmount = useCallback(() => {
    return appBudgets.reduce((total, budget) => total + budget.monthlyLimit, 0);
  }, [appBudgets]);

  const getTotalAWSBudgetAmount = useCallback(() => {
    return awsBudgets.reduce((total, budget) => total + parseFloat(budget.budgetLimit.amount), 0);
  }, [awsBudgets]);

  const getOverBudgetCount = useCallback(() => {
    const overAppBudgets = appBudgets.filter(budget => 
      budget.status === 'over_budget'
    ).length;
    
    const overAWSBudgets = awsBudgets.filter(budget => 
      parseFloat(budget.actualSpend.amount) >= parseFloat(budget.budgetLimit.amount)
    ).length;
    
    return overAppBudgets + overAWSBudgets;
  }, [appBudgets, awsBudgets]);

  // Update AWS budgets only when the reference actually changes
  useEffect(() => {
    // Only update if the arrays are actually different
    const currentIds = awsBudgets.map(b => b.budgetId).sort().join(',');
    const newIds = existingAWSBudgets.map(b => b.budgetId).sort().join(',');
    
    if (currentIds !== newIds) {
      setAWSBudgets(existingAWSBudgets);
    }
  }, [existingAWSBudgets, awsBudgets]);

  // Fetch app budgets on mount only when explicitly requested
  useEffect(() => {
    let mounted = true;
    
    // Only fetch if we don't have budgets yet
    if (mounted && appBudgets.length === 0) {
      fetchBudgets();
    }
    
    return () => {
      mounted = false;
    };
  }, []); // Empty dependency array - only run on mount, and only if no budgets exist

  return {
    // Data
    appBudgets,
    awsBudgets,
    
    // Loading states
    isLoading,
    isCreating,
    isUpdating,
    isDeleting,
    
    // Error state
    error,
    
    // Actions
    fetchBudgets,
    createBudget,
    updateBudget,
    deleteBudget,
    
    // Utilities
    getTotalBudgets,
    getTotalAppBudgetAmount,
    getTotalAWSBudgetAmount,
    getOverBudgetCount,
  };
};
