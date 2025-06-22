
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';

interface HistoricalData {
  date: string;
  spend: number;
  budget: number;
}

interface CostHistoryChartProps {
  data: HistoricalData[];
}

export const CostHistoryChart = ({ data }: CostHistoryChartProps) => {
  const formattedData = data.map(item => ({
    ...item,
    month: new Date(item.date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
  }));

  return (
    <div className="h-[400px]">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={formattedData}>
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
            formatter={(value, name) => [`$${value}`, name === 'spend' ? 'Actual Spend' : 'Budget']}
            labelStyle={{ color: '#1e293b' }}
            contentStyle={{ 
              backgroundColor: 'white', 
              border: '1px solid #e2e8f0',
              borderRadius: '8px'
            }}
          />
          <ReferenceLine y={1200} stroke="#ef4444" strokeDasharray="5 5" label="Budget Limit" />
          <Line 
            type="monotone" 
            dataKey="spend" 
            stroke="#2563eb" 
            strokeWidth={3}
            dot={{ fill: '#2563eb', strokeWidth: 2, r: 5 }}
            activeDot={{ r: 7, stroke: '#2563eb', strokeWidth: 2 }}
          />
          <Line 
            type="monotone" 
            dataKey="budget" 
            stroke="#10b981" 
            strokeWidth={2}
            strokeDasharray="5 5"
            dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};
