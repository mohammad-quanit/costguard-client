
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, TrendingUp } from "lucide-react";

interface BudgetCardProps {
  currentSpend: number;
  monthlyBudget: number;
  progress: number;
  isOverBudget: boolean;
  isNearBudget: boolean;
}

export const BudgetCard = ({ 
  currentSpend, 
  monthlyBudget, 
  progress, 
  isOverBudget, 
  isNearBudget 
}: BudgetCardProps) => {
  const getProgressColor = () => {
    if (isOverBudget) return "bg-red-500";
    if (isNearBudget) return "bg-orange-500";
    return "bg-blue-500";
  };

  const getStatusBadge = () => {
    if (isOverBudget) return <Badge variant="destructive">Over Budget</Badge>;
    if (isNearBudget) return <Badge variant="secondary" className="bg-orange-100 text-orange-800">Near Limit</Badge>;
    return <Badge variant="secondary" className="bg-green-100 text-green-800">On Track</Badge>;
  };

  return (
    <Card className="mb-8">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center">
              {(isOverBudget || isNearBudget) && (
                <AlertTriangle className="h-5 w-5 text-orange-500 mr-2" />
              )}
              Monthly Budget Progress
            </CardTitle>
            <CardDescription>
              Track your spending against your monthly budget limit
            </CardDescription>
          </div>
          {getStatusBadge()}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex justify-between text-sm">
            <span className="text-slate-600">
              ${currentSpend.toFixed(2)} of ${monthlyBudget.toFixed(2)}
            </span>
            <span className="font-medium">
              {progress.toFixed(1)}%
            </span>
          </div>
          <Progress 
            value={Math.min(progress, 100)} 
            className="h-3"
          />
          <div className="flex justify-between items-center text-sm">
            <span className="text-slate-600">
              ${(monthlyBudget - currentSpend).toFixed(2)} remaining
            </span>
            <div className="flex items-center text-slate-600">
              <TrendingUp className="h-4 w-4 mr-1" />
              <span>
                {Math.round((new Date().getDate() / new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate()) * 100)}% through month
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
