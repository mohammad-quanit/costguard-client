import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, DollarSign, AlertTriangle, CheckCircle, Clock, TrendingUp } from "lucide-react";
import { BudgetCardData, MultiBudgetMetrics, BudgetHistory } from "@/types/api";
import { BudgetDetailsModal } from "@/components/BudgetDetailsModal";
import { useState } from "react";

interface MultiBudgetCardProps {
  budgets: BudgetCardData[];
  metrics: MultiBudgetMetrics;
  budgetHistories: BudgetHistory[];
  onBudgetSelect?: (budgetId: string) => void;
}

export const MultiBudgetCard = ({ budgets, metrics, budgetHistories, onBudgetSelect }: MultiBudgetCardProps) => {
  const [selectedBudget, setSelectedBudget] = useState<BudgetCardData | null>(null);
  const [selectedBudgetHistory, setSelectedBudgetHistory] = useState<BudgetHistory | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const formatCurrency = (amount: number, currency: string = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getBudgetStatusColor = (status: string, isOverBudget: boolean) => {
    if (isOverBudget) return 'text-red-600 bg-red-100 dark:bg-red-900/20 dark:text-red-400';
    if (status === 'expired') return 'text-gray-600 bg-gray-100 dark:bg-gray-800 dark:text-gray-400';
    if (status === 'upcoming') return 'text-blue-600 bg-blue-100 dark:bg-blue-900/20 dark:text-blue-400';
    return 'text-green-600 bg-green-100 dark:bg-green-900/20 dark:text-green-400';
  };

  const getBudgetStatusIcon = (status: string, isOverBudget: boolean) => {
    if (isOverBudget) return <AlertTriangle className="h-4 w-4" />;
    if (status === 'expired') return <Clock className="h-4 w-4" />;
    if (status === 'upcoming') return <Calendar className="h-4 w-4" />;
    return <CheckCircle className="h-4 w-4" />;
  };

  const handleViewDetails = (budget: BudgetCardData) => {
    // Find the corresponding budget history
    const budgetIndex = parseInt(budget.id.split('-')[1]);
    const budgetHistory = budgetHistories[budgetIndex];
    
    setSelectedBudget(budget);
    setSelectedBudgetHistory(budgetHistory);
    setIsModalOpen(true);
    
    if (onBudgetSelect) {
      onBudgetSelect(budget.id);
    }
  };

  const activeBudgets = budgets.filter(b => b.status === 'active');
  const expiredBudgets = budgets.filter(b => b.status === 'expired');
  const upcomingBudgets = budgets.filter(b => b.status === 'upcoming');

  return (
    <>
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center">
              <DollarSign className="h-5 w-5 mr-2" />
              Budget Overview
            </div>
            <Badge variant="outline" className="ml-2">
              {budgets.length} Budget{budgets.length !== 1 ? 's' : ''}
            </Badge>
          </CardTitle>
          <CardDescription>
            Manage multiple budgets with different time periods and limits
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Summary Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="text-center p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
              <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                {formatCurrency(metrics.totalBudgetAmount)}
              </div>
              <div className="text-sm text-slate-600 dark:text-slate-400">Total Budget</div>
            </div>
            <div className="text-center p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
              <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                {formatCurrency(metrics.totalSpent)}
              </div>
              <div className="text-sm text-slate-600 dark:text-slate-400">Total Spent</div>
            </div>
            <div className="text-center p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
              <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                {metrics.overallUtilization.toFixed(1)}%
              </div>
              <div className="text-sm text-slate-600 dark:text-slate-400">Overall Usage</div>
            </div>
            <div className="text-center p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
              <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                {metrics.activeBudgets}
              </div>
              <div className="text-sm text-slate-600 dark:text-slate-400">Active Budgets</div>
            </div>
          </div>

          {/* Budget Tabs */}
          <Tabs defaultValue="active" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="active">
                Active ({activeBudgets.length})
              </TabsTrigger>
              <TabsTrigger value="upcoming">
                Upcoming ({upcomingBudgets.length})
              </TabsTrigger>
              <TabsTrigger value="expired">
                Expired ({expiredBudgets.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="active" className="space-y-4">
              {activeBudgets.length === 0 ? (
                <div className="text-center py-8 text-slate-500 dark:text-slate-400">
                  No active budgets found
                </div>
              ) : (
                activeBudgets.map((budget) => (
                  <BudgetItem 
                    key={budget.id} 
                    budget={budget} 
                    onViewDetails={handleViewDetails}
                    formatCurrency={formatCurrency}
                    formatDate={formatDate}
                    getBudgetStatusColor={getBudgetStatusColor}
                    getBudgetStatusIcon={getBudgetStatusIcon}
                  />
                ))
              )}
            </TabsContent>

            <TabsContent value="upcoming" className="space-y-4">
              {upcomingBudgets.length === 0 ? (
                <div className="text-center py-8 text-slate-500 dark:text-slate-400">
                  No upcoming budgets found
                </div>
              ) : (
                upcomingBudgets.map((budget) => (
                  <BudgetItem 
                    key={budget.id} 
                    budget={budget} 
                    onViewDetails={handleViewDetails}
                    formatCurrency={formatCurrency}
                    formatDate={formatDate}
                    getBudgetStatusColor={getBudgetStatusColor}
                    getBudgetStatusIcon={getBudgetStatusIcon}
                  />
                ))
              )}
            </TabsContent>

            <TabsContent value="expired" className="space-y-4">
              {expiredBudgets.length === 0 ? (
                <div className="text-center py-8 text-slate-500 dark:text-slate-400">
                  No expired budgets found
                </div>
              ) : (
                expiredBudgets.map((budget) => (
                  <BudgetItem 
                    key={budget.id} 
                    budget={budget} 
                    onViewDetails={handleViewDetails}
                    formatCurrency={formatCurrency}
                    formatDate={formatDate}
                    getBudgetStatusColor={getBudgetStatusColor}
                    getBudgetStatusIcon={getBudgetStatusIcon}
                  />
                ))
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Budget Details Modal */}
      <BudgetDetailsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        budget={selectedBudget}
        budgetHistory={selectedBudgetHistory}
      />
    </>
  );
};

interface BudgetItemProps {
  budget: BudgetCardData;
  onViewDetails: (budget: BudgetCardData) => void;
  formatCurrency: (amount: number, currency?: string) => string;
  formatDate: (dateString: string) => string;
  getBudgetStatusColor: (status: string, isOverBudget: boolean) => string;
  getBudgetStatusIcon: (status: string, isOverBudget: boolean) => React.ReactNode;
}

const BudgetItem = ({ 
  budget, 
  onViewDetails, 
  formatCurrency, 
  formatDate, 
  getBudgetStatusColor, 
  getBudgetStatusIcon 
}: BudgetItemProps) => {
  const remaining = budget.amount - budget.spent;
  const isOverBudget = budget.spent > budget.amount;

  return (
    <Card className="border-l-4 border-l-blue-500 hover:shadow-md transition-shadow">
      <CardContent className="pt-4">
        <div className="flex items-start justify-between mb-3">
          <div>
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100">
              {budget.name}
            </h3>
            <div className="flex items-center text-sm text-slate-600 dark:text-slate-400 mt-1">
              <Calendar className="h-4 w-4 mr-1" />
              {formatDate(budget.startDate)} - {formatDate(budget.endDate)}
            </div>
          </div>
          <Badge className={getBudgetStatusColor(budget.status, isOverBudget)}>
            {getBudgetStatusIcon(budget.status, isOverBudget)}
            <span className="ml-1 capitalize">
              {isOverBudget ? 'Over Budget' : budget.status}
            </span>
          </Badge>
        </div>

        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm text-slate-600 dark:text-slate-400">Budget Progress</span>
            <span className="text-sm font-medium">
              {formatCurrency(budget.spent)} / {formatCurrency(budget.amount)}
            </span>
          </div>
          
          <Progress 
            value={Math.min(budget.utilization, 100)} 
            className="h-2"
          />
          
          <div className="flex justify-between text-sm">
            <span className={`font-medium ${isOverBudget ? 'text-red-600 dark:text-red-400' : 'text-slate-600 dark:text-slate-400'}`}>
              {budget.utilization.toFixed(1)}% used
            </span>
            <span className={`font-medium ${remaining < 0 ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400'}`}>
              {remaining < 0 ? 'Over by ' : 'Remaining: '}
              {formatCurrency(Math.abs(remaining))}
            </span>
          </div>

          {budget.daysRemaining !== undefined && budget.status === 'active' && (
            <div className="flex items-center text-sm text-slate-600 dark:text-slate-400">
              <Clock className="h-4 w-4 mr-1" />
              {budget.daysRemaining} days remaining
            </div>
          )}
        </div>

        <Button 
          variant="outline" 
          size="sm" 
          className="mt-3 w-full"
          onClick={() => onViewDetails(budget)}
        >
          View Details
        </Button>
      </CardContent>
    </Card>
  );
};
