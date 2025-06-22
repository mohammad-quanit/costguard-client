// API Response Types

export interface TimePeriod {
  start: string;
  end: string;
}

export interface Amount {
  amount: string;
  unit: string;
}

export interface MonthlyData {
  timePeriod: TimePeriod;
  budgetedAmount: Amount;
  actualAmount: Amount;
  utilization: string;
}

export interface BudgetSummary {
  totalBudgeted: string;
  totalActual: string;
  averageUtilization: string;
  maxUtilization: string;
  minUtilization: string;
  monthsOverBudget: number;
  totalMonths: number;
  overBudgetPercentage: string;
}

export interface BudgetHistory {
  budgetName: string;
  budgetType: string;
  timeUnit: string;
  budgetLimit: Amount;
  monthlyData: MonthlyData[];
  totalMonths: number;
  summary: BudgetSummary;
}

export interface Budget {
  monthlyBudget: string;
  budgetUtilization: string;
  remainingBudget: string;
  budgetStatus: 'on_track' | 'at_risk' | 'over_budget';
  projectedMonthlyCost: string;
  isOverBudget: boolean;
  daysRemainingInMonth: number;
  budgetSource: string;
  monthlyHistory: BudgetHistory[];
}

export interface CostUsageResponse {
  totalCost: string;
  dailyAverage: string;
  averageMonthlyCost: string;
  currentMonthCost: string;
  serviceCount: number;
  currency: string;
  start: string;
  end: string;
  budget: Budget;
}

// Utility types for dashboard components
export interface DashboardMetrics {
  totalCost: number;
  dailyAverage: number;
  currentMonthCost: number;
  monthlyBudget: number;
  remainingBudget: number;
  budgetUtilization: number;
  serviceCount: number;
  budgetStatus: Budget['budgetStatus'];
  isOverBudget: boolean;
  currency: string;
}

export interface ChartDataPoint {
  month: string;
  actual: number;
  budgeted: number;
  utilization: number;
}
