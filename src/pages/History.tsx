
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CostHistoryChart } from "@/components/CostHistoryChart";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { history } from "lucide-react";

const History = () => {
  const historicalData = [
    { date: "2024-01-01", spend: 1050.23, budget: 1200 },
    { date: "2024-02-01", spend: 980.45, budget: 1200 },
    { date: "2024-03-01", spend: 1150.67, budget: 1200 },
    { date: "2024-04-01", spend: 1075.89, budget: 1200 },
    { date: "2024-05-01", spend: 847.32, budget: 1200 },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <header className="bg-white border-b border-slate-200 shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <h1 className="text-2xl font-bold text-slate-900">Cost History</h1>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">Last 7 days</Button>
              <Button variant="outline" size="sm">Last 30 days</Button>
              <Button variant="default" size="sm">Last 6 months</Button>
            </div>
          </div>
        </div>
      </header>
      
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Average Monthly Spend</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$1,020.91</div>
              <p className="text-sm text-slate-600">Last 6 months</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Highest Month</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$1,150.67</div>
              <p className="text-sm text-slate-600">March 2024</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Budget Adherence</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">85%</div>
              <Badge variant="secondary">Within Budget</Badge>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Monthly Spending Trend</CardTitle>
            <CardDescription>
              Your AWS spending history compared to budget
            </CardDescription>
          </CardHeader>
          <CardContent>
            <CostHistoryChart data={historicalData} />
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default History;
