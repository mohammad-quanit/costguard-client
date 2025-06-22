
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";

export const AlertSettingsForm = () => {
  const [monthlyBudget, setMonthlyBudget] = useState("1200");
  const [dailyLimit, setDailyLimit] = useState("50");
  const [warningThreshold, setWarningThreshold] = useState("80");

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Saving alert settings:", {
      monthlyBudget: parseFloat(monthlyBudget),
      dailyLimit: parseFloat(dailyLimit),
      warningThreshold: parseFloat(warningThreshold)
    });
  };

  return (
    <form onSubmit={handleSave} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="monthlyBudget">Monthly Budget ($)</Label>
        <Input
          id="monthlyBudget"
          type="number"
          value={monthlyBudget}
          onChange={(e) => setMonthlyBudget(e.target.value)}
          placeholder="1200"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="dailyLimit">Daily Spending Limit ($)</Label>
        <Input
          id="dailyLimit"
          type="number"
          value={dailyLimit}
          onChange={(e) => setDailyLimit(e.target.value)}
          placeholder="50"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="warningThreshold">Warning Threshold (%)</Label>
        <Input
          id="warningThreshold"
          type="number"
          value={warningThreshold}
          onChange={(e) => setWarningThreshold(e.target.value)}
          placeholder="80"
          max="100"
        />
        <p className="text-sm text-slate-600">
          Get warned when you reach this percentage of your monthly budget
        </p>
      </div>

      <Button type="submit" className="w-full">
        Save Alert Settings
      </Button>
    </form>
  );
};
