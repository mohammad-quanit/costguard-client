
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertTriangle, TrendingUp, TrendingDown, DollarSign, Bell, Settings } from "lucide-react";
import { CostChart } from "@/components/CostChart";
import { AlertsPanel } from "@/components/AlertsPanel";
import { BudgetCard } from "@/components/BudgetCard";
import { ServiceBreakdown } from "@/components/ServiceBreakdown";
import { HeaderNav } from "@/components/HeaderNav";

const Index = () => {
  const [selectedPeriod, setSelectedPeriod] = useState("30d");

  // Mock data - in real app this would come from AWS Cost Explorer API
  const costData = {
    currentSpend: 847.32,
    monthlyBudget: 1200,
    lastMonthSpend: 723.45,
    dailyAverage: 28.24,
    projection: 1125.50
  };

  const alerts = [
    {
      id: 1,
      type: "warning",
      message: "Monthly spend is 71% of budget",
      service: "EC2",
      amount: 847.32,
      threshold: 70
    },
    {
      id: 2,
      type: "info",
      message: "RDS costs increased 15% this week",
      service: "RDS",
      amount: 156.78,
      threshold: 10
    }
  ];

  const budgetProgress = (costData.currentSpend / costData.monthlyBudget) * 100;
  const isOverBudget = budgetProgress > 100;
  const isNearBudget = budgetProgress > 80;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <HeaderNav />
      
      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">
            Cloud Cost Dashboard
          </h1>
          <p className="text-lg text-slate-600">
            Monitor your AWS spending and avoid surprise bills
          </p>
        </div>

        {/* Key Metrics Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="border-l-4 border-l-blue-500">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">Current Month</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-900">
                ${costData.currentSpend.toFixed(2)}
              </div>
              <div className="flex items-center mt-1">
                <TrendingUp className="h-4 w-4 text-red-500 mr-1" />
                <span className="text-sm text-red-600">
                  +17% from last month
                </span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-green-500">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">Monthly Budget</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-900">
                ${costData.monthlyBudget.toFixed(2)}
              </div>
              <div className="flex items-center mt-1">
                <span className="text-sm text-slate-600">
                  ${(costData.monthlyBudget - costData.currentSpend).toFixed(2)} remaining
                </span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-orange-500">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">Daily Average</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-900">
                ${costData.dailyAverage.toFixed(2)}
              </div>
              <div className="flex items-center mt-1">
                <TrendingDown className="h-4 w-4 text-green-500 mr-1" />
                <span className="text-sm text-green-600">
                  -5% this week
                </span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-purple-500">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">Projected Total</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-900">
                ${costData.projection.toFixed(2)}
              </div>
              <div className="flex items-center mt-1">
                <Badge variant={costData.projection > costData.monthlyBudget ? "destructive" : "secondary"}>
                  {costData.projection > costData.monthlyBudget ? "Over Budget" : "On Track"}
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Budget Progress */}
        <BudgetCard 
          currentSpend={costData.currentSpend}
          monthlyBudget={costData.monthlyBudget}
          progress={budgetProgress}
          isOverBudget={isOverBudget}
          isNearBudget={isNearBudget}
        />

        {/* Main Content Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 lg:w-[500px]">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="services">Services</TabsTrigger>
            <TabsTrigger value="alerts">Alerts</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <CostChart />
              <ServiceBreakdown />
            </div>
          </TabsContent>

          <TabsContent value="services" className="space-y-6">
            <ServiceBreakdown detailed={true} />
          </TabsContent>

          <TabsContent value="alerts" className="space-y-6">
            <AlertsPanel alerts={alerts} />
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Settings className="h-5 w-5 mr-2" />
                  Alert Settings
                </CardTitle>
                <CardDescription>
                  Configure your cost alert thresholds and notification preferences
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-sm text-slate-600">
                  Settings panel coming soon - configure budget limits, alert thresholds, and notification channels.
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Index;
