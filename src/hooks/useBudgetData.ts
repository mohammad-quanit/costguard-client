import { useQuery } from '@tanstack/react-query';
import { BudgetService, BudgetResponse } from '@/services/budgetService';

export const useBudgetData = (accountId?: string) => {
  const {
    data,
    isLoading,
    error,
    refetch,
  } = useQuery<BudgetResponse>({
    queryKey: ['budgets', accountId],
    queryFn: () => BudgetService.getBudgets(accountId),
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    retry: 2,
    retryDelay: 1000,
  });

  return {
    budgets: data?.budgets || [],
    isLoading,
    error,
    refetch,
  };
};
