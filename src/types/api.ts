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

// New service-related types
export interface ServiceData {
  serviceName: string;
  totalCost: number;
  totalUsage: number;
  unit: string;
  currency: string;
  percentage: number;
}

export interface CurrentMonthService {
  serviceName: string;
  cost: number;
  usage: number;
  unit: string;
  currency: string;
}

export interface ServiceSummary {
  totalServices: number;
  currentMonthServices: number;
  topServiceAllTime: string;
  topServiceCurrentMonth: string;
  topServiceCostAllTime: number;
  topServiceCostCurrentMonth: number;
}

export interface Services {
  allPeriods: ServiceData[];
  currentMonth: CurrentMonthService[];
  summary: ServiceSummary;
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
  services: Services;
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

// New types for multi-budget support
export interface BudgetCardData {
  id: string;
  name: string;
  amount: number;
  spent: number;
  utilization: number;
  status: 'active' | 'expired' | 'upcoming';
  startDate: string;
  endDate: string;
  currency: string;
  isOverBudget: boolean;
  daysRemaining?: number;
}

export interface MultiBudgetMetrics {
  totalBudgets: number;
  activeBudgets: number;
  totalBudgetAmount: number;
  totalSpent: number;
  overallUtilization: number;
  budgetsOverLimit: number;
}
