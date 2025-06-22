import { apiClient, API_ENDPOINTS } from '@/lib/api';
import { CostUsageResponse, DashboardMetrics, ChartDataPoint } from '@/types/api';

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
