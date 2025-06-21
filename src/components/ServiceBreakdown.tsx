
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

interface ServiceBreakdownProps {
  detailed?: boolean;
}

export const ServiceBreakdown = ({ detailed = false }: ServiceBreakdownProps) => {
  const services = [
    { name: 'EC2', cost: 324.56, percentage: 38.3, trend: '+12%', color: 'bg-blue-500' },
    { name: 'RDS', cost: 156.78, percentage: 18.5, trend: '+15%', color: 'bg-green-500' },
    { name: 'S3', cost: 89.45, percentage: 10.6, trend: '-3%', color: 'bg-orange-500' },
    { name: 'Lambda', cost: 67.23, percentage: 7.9, trend: '+8%', color: 'bg-purple-500' },
    { name: 'CloudFront', cost: 45.67, percentage: 5.4, trend: '+5%', color: 'bg-pink-500' },
    { name: 'Others', cost: 163.63, percentage: 19.3, trend: '+2%', color: 'bg-slate-400' }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Service Breakdown</CardTitle>
        <CardDescription>
          Cost distribution across AWS services this month
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {services.map((service, index) => (
            <div key={service.name} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full ${service.color}`} />
                  <span className="font-medium text-slate-900">{service.name}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Badge variant="outline" className={service.trend.startsWith('+') ? 'text-red-600' : 'text-green-600'}>
                    {service.trend}
                  </Badge>
                  <span className="font-semibold">${service.cost.toFixed(2)}</span>
                </div>
              </div>
              <Progress value={service.percentage} className="h-2" />
              {detailed && (
                <div className="text-sm text-slate-600 ml-6">
                  {service.percentage.toFixed(1)}% of total spend
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
