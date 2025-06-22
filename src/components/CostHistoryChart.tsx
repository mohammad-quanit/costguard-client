
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';

interface HistoricalData {
  date: string;
  spend: number;
  budget: number;
  utilization?: number;
  period?: string;
}

interface CostHistoryChartProps {
  data: HistoricalData[];
}

export const CostHistoryChart = ({ data }: CostHistoryChartProps) => {
  if (!data || data.length === 0) {
    return (
      <div className="h-[400px] flex items-center justify-center">
        <p className="text-slate-500 dark:text-slate-400">No data available</p>
      </div>
    );
  }

  const formattedData = data.map(item => ({
    ...item,
    month: item.period || new Date(item.date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
  }));

  // Calculate dynamic reference line based on average budget
  const averageBudget = data.reduce((sum, item) => sum + item.budget, 0) / data.length;

  return (
    <div className="h-[400px]">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={formattedData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9 dark:#334155" />
          <XAxis 
            dataKey="month" 
            stroke="#64748b"
            fontSize={12}
            angle={-45}
            textAnchor="end"
            height={60}
          />
          <YAxis 
            stroke="#64748b"
            fontSize={12}
            tickFormatter={(value) => `$${value.toFixed(0)}`}
          />
          <Tooltip 
            formatter={(value, name) => {
              if (name === 'spend') return [`$${Number(value).toFixed(2)}`, 'Actual Spend'];
              if (name === 'budget') return [`$${Number(value).toFixed(2)}`, 'Budget'];
              return [`${Number(value).toFixed(1)}%`, 'Utilization'];
            }}
            labelStyle={{ color: '#1e293b' }}
            contentStyle={{ 
              backgroundColor: 'white', 
              border: '1px solid #e2e8f0',
              borderRadius: '8px',
              boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
            }}
          />
          {averageBudget > 0 && (
            <ReferenceLine 
              y={averageBudget} 
              stroke="#ef4444" 
              strokeDasharray="5 5" 
              label={{ value: "Avg Budget", position: "topRight" }}
            />
          )}
          <Line 
            type="monotone" 
            dataKey="spend" 
            stroke="#2563eb" 
            strokeWidth={3}
            dot={{ fill: '#2563eb', strokeWidth: 2, r: 5 }}
            activeDot={{ r: 7, stroke: '#2563eb', strokeWidth: 2, fill: '#ffffff' }}
            name="spend"
          />
          <Line 
            type="monotone" 
            dataKey="budget" 
            stroke="#10b981" 
            strokeWidth={2}
            strokeDasharray="5 5"
            dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6, stroke: '#10b981', strokeWidth: 2, fill: '#ffffff' }}
            name="budget"
          />
        </LineChart>
      </ResponsiveContainer>
      
      {/* Legend */}
      <div className="flex items-center justify-center space-x-6 mt-4 text-sm">
        <div className="flex items-center space-x-2">
          <div className="w-4 h-0.5 bg-blue-600"></div>
          <span className="text-slate-600 dark:text-slate-400">Actual Spend</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-4 h-0.5 bg-green-600 border-dashed border-t-2 border-green-600"></div>
          <span className="text-slate-600 dark:text-slate-400">Budget</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-4 h-0.5 bg-red-600 border-dashed border-t-2 border-red-600"></div>
          <span className="text-slate-600 dark:text-slate-400">Average Budget</span>
        </div>
      </div>
    </div>
  );
};
