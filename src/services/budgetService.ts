import { apiClient } from '@/lib/api';

// Types for your budget API - Updated to match actual response
export interface CreateBudgetRequest {
  budgetName: string;
  monthlyLimit: number;
  currency: string;
  alertThreshold: number;
  alertFrequency: 'daily' | 'weekly' | 'monthly';
  services: string[];
  tags?: Record<string, any>;
  notifications: {
    sns: boolean;
    email: boolean;
    webhookUrl?: string | null;
    slack: boolean;
  };
}

export interface UpdateBudgetRequest extends CreateBudgetRequest {
  budgetId: string;
  isActive?: boolean;
}

export interface AppBudget {
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

export interface BudgetResponse {
  message: string;
  budgets: AppBudget[];
  totalBudgets: number;
  user: {
    userId: string;
    email: string;
    firstName: string;
    lastName: string;
  };
}

export interface CreateBudgetResponse {
  message: string;
  budget: AppBudget;
}

export class BudgetService {
  /**
   * Get all budgets for the authenticated user
   */
  static async getBudgets(accountId?: string): Promise<BudgetResponse> {
    try {
      const endpoint = accountId ? `/budget?accountId=${accountId}` : '/budget';
      const response = await apiClient.get<BudgetResponse>(endpoint);
      return response;
    } catch (error) {
      console.error('BudgetService - Error fetching budgets:', error);
      throw error;
    }
  }

  /**
   * Create a new budget
   */
  static async createBudget(budgetData: CreateBudgetRequest): Promise<CreateBudgetResponse> {
    try {
      const response = await apiClient.post<CreateBudgetResponse>('/budget/set', budgetData);
      return response;
    } catch (error) {
      console.error('BudgetService - Error creating budget:', error);
      throw error;
    }
  }

  /**
   * Update an existing budget
   */
  static async updateBudget(budgetData: UpdateBudgetRequest): Promise<CreateBudgetResponse> {
    try {
      const response = await apiClient.post<CreateBudgetResponse>('/budget/set', budgetData);
      return response;
    } catch (error) {
      console.error('BudgetService - Error updating budget:', error);
      throw error;
    }
  }

  /**
   * Delete a budget (by setting isActive to false)
   */
  static async deleteBudget(budgetId: string): Promise<CreateBudgetResponse> {
    try {
      const response = await apiClient.delete<CreateBudgetResponse>(`/budget/${budgetId}`);
      return response;
    } catch (error) {
      console.error('BudgetService - Error deleting budget:', error);
      throw error;
    }
  }

  /**
   * Calculate budget utilization percentage
   */
  static calculateUtilization(totalSpent: number, monthlyLimit: number): number {
    return monthlyLimit > 0 ? (totalSpent / monthlyLimit) * 100 : 0;
  }

  /**
   * Get budget status based on utilization
   */
  static getBudgetStatus(utilization: number): 'on_track' | 'near_limit' | 'over_budget' {
    if (utilization >= 100) return 'over_budget';
    if (utilization >= 80) return 'near_limit';
    return 'on_track';
  }

  /**
   * Format currency amount
   */
  static formatCurrency(amount: number, currency: string = 'USD'): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2,
    }).format(amount);
  }

  /**
   * Get status color for UI
   */
  static getStatusColor(status: string): string {
    switch (status) {
      case 'over_budget':
        return 'text-red-600 bg-red-100 dark:bg-red-900/20 dark:text-red-400';
      case 'near_limit':
        return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'on_track':
        return 'text-green-600 bg-green-100 dark:bg-green-900/20 dark:text-green-400';
      default:
        return 'text-slate-600 bg-slate-100 dark:bg-slate-800 dark:text-slate-400';
    }
  }

  /**
   * Get status text for UI
   */
  static getStatusText(status: string): string {
    switch (status) {
      case 'over_budget':
        return 'Over Budget';
      case 'near_limit':
        return 'Near Limit';
      case 'on_track':
        return 'On Track';
      default:
        return 'Unknown';
    }
  }
}
