
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export const CostChart = () => {
  // Mock data for the last 30 days
  const data = [
    { date: 'Dec 1', cost: 25.43 },
    { date: 'Dec 5', cost: 28.12 },
    { date: 'Dec 10', cost: 31.78 },
    { date: 'Dec 15', cost: 29.45 },
    { date: 'Dec 20', cost: 35.21 },
    { date: 'Dec 25', cost: 32.89 },
    { date: 'Today', cost: 28.24 }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Daily Cost Trend</CardTitle>
        <CardDescription>
          Your daily AWS spending over the last 30 days
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis 
                dataKey="date" 
                stroke="#64748b"
                fontSize={12}
              />
              <YAxis 
                stroke="#64748b"
                fontSize={12}
                tickFormatter={(value) => `$${value}`}
              />
              <Tooltip 
                formatter={(value) => [`$${value}`, 'Daily Cost']}
                labelStyle={{ color: '#1e293b' }}
                contentStyle={{ 
                  backgroundColor: 'white', 
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px'
                }}
              />
              <Line 
                type="monotone" 
                dataKey="cost" 
                stroke="#2563eb" 
                strokeWidth={3}
                dot={{ fill: '#2563eb', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: '#2563eb', strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};
