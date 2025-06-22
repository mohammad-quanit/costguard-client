import { apiClient, API_ENDPOINTS } from '@/lib/api';
import { CostUsageResponse, DashboardMetrics, ChartDataPoint, BudgetCardData, MultiBudgetMetrics } from '@/types/api';

export class CostService {
  /**
   * Fetch cost usage data from the API
   */
  static async getCostUsage(): Promise<CostUsageResponse> {
    return apiClient.get<CostUsageResponse>(API_ENDPOINTS.COST_USAGE);
  }

  /**
   * Transform API response to dashboard metrics
   */
  static transformToDashboardMetrics(data: CostUsageResponse): DashboardMetrics {
    return {
      totalCost: parseFloat(data.totalCost),
      dailyAverage: parseFloat(data.dailyAverage),
      currentMonthCost: parseFloat(data.currentMonthCost),
      monthlyBudget: parseFloat(data.budget.monthlyBudget),
      remainingBudget: parseFloat(data.budget.remainingBudget),
      budgetUtilization: parseFloat(data.budget.budgetUtilization),
      serviceCount: data.serviceCount,
      budgetStatus: data.budget.budgetStatus,
      isOverBudget: data.budget.isOverBudget,
      currency: data.currency,
    };
  }

  /**
   * Transform monthly history data for charts
   */
  static transformToChartData(data: CostUsageResponse): ChartDataPoint[] {
    // Get the first budget's monthly data (assuming primary budget)
    const primaryBudget = data.budget.monthlyHistory[0];
    
    if (!primaryBudget) {
      return [];
    }

    return primaryBudget.monthlyData.map(monthData => {
      const date = new Date(monthData.timePeriod.start);
      const monthName = date.toLocaleDateString('en-US', { 
        month: 'short', 
        year: '2-digit' 
      });

      return {
        month: monthName,
        actual: parseFloat(monthData.actualAmount.amount),
        budgeted: parseFloat(monthData.budgetedAmount.amount),
        utilization: parseFloat(monthData.utilization),
      };
    });
  }

  /**
   * Transform budget history to budget cards data
   */
  static transformToBudgetCards(data: CostUsageResponse): BudgetCardData[] {
    const currentDate = new Date();
    
    return data.budget.monthlyHistory.map((budget, index) => {
      // Calculate overall budget metrics from monthly data
      const totalBudgeted = parseFloat(budget.summary.totalBudgeted);
      const totalSpent = parseFloat(budget.summary.totalActual);
      const utilization = totalSpent > 0 ? (totalSpent / totalBudgeted) * 100 : 0;
      
      // Determine budget period (use first and last month from monthly data)
      const firstMonth = budget.monthlyData[0];
      const lastMonth = budget.monthlyData[budget.monthlyData.length - 1];
      const startDate = firstMonth ? firstMonth.timePeriod.start : new Date().toISOString();
      const endDate = lastMonth ? lastMonth.timePeriod.end : new Date().toISOString();
      
      // Determine status based on dates
      const start = new Date(startDate);
      const end = new Date(endDate);
      let status: 'active' | 'expired' | 'upcoming' = 'active';
      let daysRemaining: number | undefined;
      
      if (currentDate < start) {
        status = 'upcoming';
      } else if (currentDate > end) {
        status = 'expired';
      } else {
        status = 'active';
        daysRemaining = Math.ceil((end.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24));
      }

      return {
        id: `budget-${index}`,
        name: budget.budgetName,
        amount: totalBudgeted,
        spent: totalSpent,
        utilization: utilization,
        status: status,
        startDate: startDate,
        endDate: endDate,
        currency: data.currency,
        isOverBudget: totalSpent > totalBudgeted,
        daysRemaining: daysRemaining,
      };
    });
  }

  /**
   * Calculate multi-budget metrics
   */
  static calculateMultiBudgetMetrics(budgets: BudgetCardData[]): MultiBudgetMetrics {
    const totalBudgetAmount = budgets.reduce((sum, budget) => sum + budget.amount, 0);
    const totalSpent = budgets.reduce((sum, budget) => sum + budget.spent, 0);
    const activeBudgets = budgets.filter(b => b.status === 'active').length;
    const budgetsOverLimit = budgets.filter(b => b.isOverBudget).length;
    const overallUtilization = totalBudgetAmount > 0 ? (totalSpent / totalBudgetAmount) * 100 : 0;

    return {
      totalBudgets: budgets.length,
      activeBudgets: activeBudgets,
      totalBudgetAmount: totalBudgetAmount,
      totalSpent: totalSpent,
      overallUtilization: overallUtilization,
      budgetsOverLimit: budgetsOverLimit,
    };
  }

  /**
   * Get budget status color for UI components
   */
  static getBudgetStatusColor(status: DashboardMetrics['budgetStatus']): string {
    switch (status) {
      case 'on_track':
        return 'text-green-600';
      case 'at_risk':
        return 'text-yellow-600';
      case 'over_budget':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  }

  /**
   * Format currency values for display
   */
  static formatCurrency(amount: number, currency: string = 'USD'): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  }

  /**
   * Calculate percentage for budget utilization
   */
  static calculateBudgetPercentage(actual: number, budgeted: number): number {
    if (budgeted === 0) return 0;
    return Math.round((actual / budgeted) * 100);
  }
}
