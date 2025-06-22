
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, AlertTriangle } from "lucide-react";

interface DashboardCardProps {
  title: string;
  value: string;
  change: string;
  changeType: "increase" | "decrease" | "neutral" | "warning";
  borderColor: "blue" | "green" | "orange" | "purple";
}

export const DashboardCard = ({ title, value, change, changeType, borderColor }: DashboardCardProps) => {
  const borderColorClasses = {
    blue: "border-l-blue-500",
    green: "border-l-green-500",
    orange: "border-l-orange-500",
    purple: "border-l-purple-500"
  };

  const getChangeIcon = () => {
    if (changeType === "increase") return <TrendingUp className="h-4 w-4 text-red-500 mr-1" />;
    if (changeType === "decrease") return <TrendingDown className="h-4 w-4 text-green-500 mr-1" />;
    if (changeType === "warning") return <AlertTriangle className="h-4 w-4 text-yellow-500 mr-1" />;
    return null;
  };

  const getChangeColor = () => {
    if (changeType === "increase") return "text-red-600 dark:text-red-400";
    if (changeType === "decrease") return "text-green-600 dark:text-green-400";
    if (changeType === "warning") return "text-yellow-600 dark:text-yellow-400";
    return "text-slate-600 dark:text-slate-400";
  };

  return (
    <Card className={`border-l-4 ${borderColorClasses[borderColor]}`}>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">
          {value}
        </div>
        <div className="flex items-center mt-1">
          {getChangeIcon()}
          <span className={`text-sm ${getChangeColor()}`}>
            {change}
          </span>
        </div>
      </CardContent>
    </Card>
  );
};
