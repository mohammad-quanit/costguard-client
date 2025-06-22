
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { ChartDataPoint } from '@/types/api';

interface CostChartProps {
  data?: ChartDataPoint[];
}

export const CostChart = ({ data = [] }: CostChartProps) => {
  // Use provided data or fallback to mock data
  const chartData = data.length > 0 ? data : [
    { month: 'Dec 24', actual: 25.43, budgeted: 50, utilization: 50.86 },
    { month: 'Jan 25', actual: 28.12, budgeted: 50, utilization: 56.24 },
    { month: 'Feb 25', actual: 31.78, budgeted: 50, utilization: 63.56 },
    { month: 'Mar 25', actual: 44.57, budgeted: 50, utilization: 89.14 },
    { month: 'Apr 25', actual: 15.04, budgeted: 50, utilization: 30.08 },
    { month: 'May 25', actual: 0, budgeted: 50, utilization: 0 },
    { month: 'Jun 25', actual: 0, budgeted: 50, utilization: 0 }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Monthly Cost vs Budget</CardTitle>
        <CardDescription>
          Your monthly AWS spending compared to budget over time
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis 
                dataKey="month" 
                stroke="#64748b"
                fontSize={12}
              />
              <YAxis 
                stroke="#64748b"
                fontSize={12}
                tickFormatter={(value) => `$${value}`}
              />
              <Tooltip 
                formatter={(value, name) => {
                  if (name === 'actual') return [`$${Number(value).toFixed(2)}`, 'Actual Cost'];
                  if (name === 'budgeted') return [`$${Number(value).toFixed(2)}`, 'Budget'];
                  return [`${Number(value).toFixed(1)}%`, 'Utilization'];
                }}
                labelStyle={{ color: '#1e293b' }}
                contentStyle={{ 
                  backgroundColor: 'white', 
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px'
                }}
              />
              <Bar 
                dataKey="budgeted" 
                fill="#e2e8f0" 
                name="budgeted"
                radius={[4, 4, 0, 0]}
              />
              <Bar 
                dataKey="actual" 
                fill="#2563eb" 
                name="actual"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="flex items-center justify-center space-x-6 mt-4 text-sm">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-gray-300 rounded"></div>
            <span className="text-slate-600 dark:text-slate-400">Budget</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-blue-600 rounded"></div>
            <span className="text-slate-600 dark:text-slate-400">Actual Cost</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
