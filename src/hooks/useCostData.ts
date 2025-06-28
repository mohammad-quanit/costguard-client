import { useQuery } from '@tanstack/react-query';
import { CostService } from '@/services/costService';
import { CostUsageResponse, DashboardMetrics, ChartDataPoint, BudgetCardData, MultiBudgetMetrics } from '@/types/api';

// Mock data for fallback when API is not available
const mockApiResponse: CostUsageResponse = {
  totalCost: "59.61",
  dailyAverage: "0.35",
  averageMonthlyCost: "9.93",
  currentMonthCost: "0.00",
  serviceCount: 9,
  currency: "USD",
  start: "2025-01-01",
  end: "2025-06-22",
  services: {
    allPeriods: [
      {
        serviceName: "Amazon Neptune",
        totalCost: 58.6421,
        totalUsage: 39023093.3621,
        unit: "N/A",
        currency: "USD",
        percentage: 98.38
      },
      {
        serviceName: "EC2 - Other",
        totalCost: 0.9654,
        totalUsage: 44.2677,
        unit: "N/A",
        currency: "USD",
        percentage: 1.62
      },
      {
        serviceName: "Amazon Simple Storage Service",
        totalCost: 0.0003,
        totalUsage: 1948.9428,
        unit: "N/A",
        currency: "USD",
        percentage: 0
      }
    ],
    currentMonth: [
      {
        serviceName: "AWS Backup",
        cost: 0,
        usage: 0,
        unit: "N/A",
        currency: "USD"
      },
      {
        serviceName: "Amazon Simple Storage Service",
        cost: 0,
        usage: 237.1385,
        unit: "N/A",
        currency: "USD"
      }
    ],
    summary: {
      totalServices: 20,
      currentMonthServices: 9,
      topServiceAllTime: "Amazon Neptune",
      topServiceCurrentMonth: "AWS Backup",
      topServiceCostAllTime: 58.6421,
      topServiceCostCurrentMonth: 0
    }
  },
  budget: {
    monthlyBudget: "50.00",
    budgetUtilization: "0.00",
    remainingBudget: "50.00",
    budgetStatus: "on_track",
    projectedMonthlyCost: "0.00",
    isOverBudget: false,
    daysRemainingInMonth: 8,
    budgetSource: "aws_budgets",
    monthlyHistory: [
      {
        budgetName: "Bootcamp 2023 Credits Budget",
        budgetType: "COST",
        timeUnit: "MONTHLY",
        budgetLimit: {
          amount: "50.0",
          unit: "USD"
        },
        monthlyData: [
          {
            timePeriod: {
              start: "2024-12-01T00:00:00.000Z",
              end: "2025-01-01T00:00:00.000Z"
            },
            budgetedAmount: {
              amount: "50",
              unit: "USD"
            },
            actualAmount: {
              amount: "0",
              unit: "USD"
            },
            utilization: "0.00"
          },
          {
            timePeriod: {
              start: "2025-01-01T00:00:00.000Z",
              end: "2025-02-01T00:00:00.000Z"
            },
            budgetedAmount: {
              amount: "50",
              unit: "USD"
            },
            actualAmount: {
              amount: "0",
              unit: "USD"
            },
            utilization: "0.00"
          },
          {
            timePeriod: {
              start: "2025-02-01T00:00:00.000Z",
              end: "2025-03-01T00:00:00.000Z"
            },
            budgetedAmount: {
              amount: "50",
              unit: "USD"
            },
            actualAmount: {
              amount: "0",
              unit: "USD"
            },
            utilization: "0.00"
          },
          {
            timePeriod: {
              start: "2025-03-01T00:00:00.000Z",
              end: "2025-04-01T00:00:00.000Z"
            },
            budgetedAmount: {
              amount: "50",
              unit: "USD"
            },
            actualAmount: {
              amount: "44.57",
              unit: "USD"
            },
            utilization: "89.14"
          },
          {
            timePeriod: {
              start: "2025-04-01T00:00:00.000Z",
              end: "2025-05-01T00:00:00.000Z"
            },
            budgetedAmount: {
              amount: "50",
              unit: "USD"
            },
            actualAmount: {
              amount: "15.04",
              unit: "USD"
            },
            utilization: "30.08"
          },
          {
            timePeriod: {
              start: "2025-05-01T00:00:00.000Z",
              end: "2025-06-01T00:00:00.000Z"
            },
            budgetedAmount: {
              amount: "50",
              unit: "USD"
            },
            actualAmount: {
              amount: "0",
              unit: "USD"
            },
            utilization: "0.00"
          },
          {
            timePeriod: {
              start: "2025-06-01T00:00:00.000Z",
              end: "2025-07-01T00:00:00.000Z"
            },
            budgetedAmount: {
              amount: "50",
              unit: "USD"
            },
            actualAmount: {
              amount: "0",
              unit: "USD"
            },
            utilization: "0.00"
          }
        ],
        totalMonths: 7,
        summary: {
          totalBudgeted: "350.00",
          totalActual: "59.61",
          averageUtilization: "17.03",
          maxUtilization: "89.14",
          minUtilization: "0.00",
          monthsOverBudget: 0,
          totalMonths: 7,
          overBudgetPercentage: "0.00"
        }
      },
      {
        budgetName: "Testing-Budget",
        budgetType: "COST",
        timeUnit: "MONTHLY",
        budgetLimit: {
          amount: "40.0",
          unit: "USD"
        },
        monthlyData: [
          {
            timePeriod: {
              start: "2025-06-01T00:00:00.000Z",
              end: "2025-07-01T00:00:00.000Z"
            },
            budgetedAmount: {
              amount: "40",
              unit: "USD"
            },
            actualAmount: {
              amount: "0",
              unit: "USD"
            },
            utilization: "0.00"
          }
        ],
        totalMonths: 1,
        summary: {
          totalBudgeted: "40.00",
          totalActual: "0.00",
          averageUtilization: "0.00",
          maxUtilization: "0.00",
          minUtilization: "0.00",
          monthsOverBudget: 0,
          totalMonths: 1,
          overBudgetPercentage: "0.00"
        }
      }
    ]
  }
};

export const useCostData = () => {
  const {
    data: rawData,
    isLoading,
    error,
    refetch,
  } = useQuery<CostUsageResponse>({
    queryKey: ['costUsage'],
    queryFn: CostService.getCostUsage,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false, // Don't refetch when window gains focus
    refetchOnReconnect: false, // Don't refetch when network reconnects
    retry: 2, // Retry failed requests 2 times
    retryDelay: 1000, // Wait 1 second between retries
  });

  // Use real data if available, otherwise fall back to mock data
  const dataToUse = rawData || mockApiResponse;
  const isUsingMockData = !rawData;

  // Transform data for dashboard use
  const dashboardMetrics: DashboardMetrics = CostService.transformToDashboardMetrics(dataToUse);

  // Transform data for charts
  const chartData: ChartDataPoint[] = CostService.transformToChartData(dataToUse);

  // Transform data for multi-budget cards
  const budgetCards: BudgetCardData[] = CostService.transformToBudgetCards(dataToUse);

  // Calculate multi-budget metrics
  const multiBudgetMetrics: MultiBudgetMetrics = CostService.calculateMultiBudgetMetrics(budgetCards);

  return {
    // Raw API data
    rawData: dataToUse,
    
    // Transformed data
    dashboardMetrics,
    chartData,
    budgetCards,
    multiBudgetMetrics,
    budgetHistories: dataToUse.budget.monthlyHistory,
    
    // Query states
    isLoading,
    error,
    refetch,
    isUsingMockData,
    
    // Utility functions
    formatCurrency: CostService.formatCurrency,
    getBudgetStatusColor: CostService.getBudgetStatusColor,
    calculateBudgetPercentage: CostService.calculateBudgetPercentage,
  };
};
