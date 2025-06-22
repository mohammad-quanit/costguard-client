
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart3, TrendingUp, TrendingDown, AlertCircle, Info, Activity } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { ServiceData, Services } from '@/types/api';

interface ServiceBreakdownProps {
  detailed?: boolean;
  services?: Services;
  totalCost?: number;
  currency?: string;
}

export const ServiceBreakdown = ({ 
  detailed = false, 
  services, 
  totalCost = 59.61, 
  currency = 'USD' 
}: ServiceBreakdownProps) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2,
    }).format(amount);
  };

  const formatUsage = (usage: number) => {
    if (usage >= 1000000) {
      return `${(usage / 1000000).toFixed(1)}M`;
    } else if (usage >= 1000) {
      return `${(usage / 1000).toFixed(1)}K`;
    }
    return usage.toFixed(2);
  };

  const getServiceIcon = (serviceName: string) => {
    const name = serviceName.toLowerCase();
    if (name.includes('neptune')) return '🔵'; // Neptune database icon
    if (name.includes('ec2') && name.includes('other')) return '🖥️'; // EC2 compute icon
    if (name.includes('ec2') || name.includes('elastic compute')) return '💻'; // EC2 main icon
    if (name.includes('s3') || name.includes('simple storage')) return '🪣'; // S3 bucket icon
    if (name.includes('lambda')) return '⚡'; // Lambda function icon
    if (name.includes('rds') || name.includes('relational database')) return '🗃️'; // RDS icon
    if (name.includes('dynamodb')) return '⚡'; // DynamoDB icon
    if (name.includes('cloudwatch')) return '📊'; // CloudWatch monitoring icon
    if (name.includes('api gateway')) return '🌐'; // API Gateway icon
    if (name.includes('backup')) return '💾'; // Backup icon
    if (name.includes('cloudtrail')) return '👣'; // CloudTrail audit icon
    if (name.includes('elastic file system') || name.includes('efs')) return '📁'; // EFS icon
    if (name.includes('cloudformation')) return '📋'; // CloudFormation template icon
    if (name.includes('key management') || name.includes('kms')) return '🔐'; // KMS key icon
    if (name.includes('kinesis')) return '🌊'; // Kinesis streaming icon
    if (name.includes('vpc') || name.includes('virtual private cloud')) return '🔒'; // VPC network icon
    if (name.includes('iot')) return '📡'; // IoT device icon
    if (name.includes('appsync')) return '🔄'; // AppSync GraphQL icon
    if (name.includes('data transfer')) return '📤'; // Data transfer icon
    if (name.includes('cloudwatch events') || name.includes('events')) return '⏰'; // Events icon
    if (name.includes('tax')) return '💰'; // Tax icon
    return '🔧'; // Default AWS service icon
  };

  const getServiceCategory = (serviceName: string) => {
    const name = serviceName.toLowerCase();
    if (name.includes('neptune') || name.includes('rds') || name.includes('dynamodb')) return 'Database';
    if (name.includes('ec2') || name.includes('compute')) return 'Compute';
    if (name.includes('s3') || name.includes('storage') || name.includes('backup')) return 'Storage';
    if (name.includes('lambda')) return 'Serverless';
    if (name.includes('api gateway') || name.includes('vpc')) return 'Networking';
    if (name.includes('cloudwatch') || name.includes('cloudtrail')) return 'Monitoring';
    return 'Other';
  };

  // Use real service data if available, otherwise show message
  if (!services || !services.allPeriods || services.allPeriods.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <BarChart3 className="h-5 w-5 mr-2" />
            Service Breakdown
          </CardTitle>
          <CardDescription>
            AWS service cost distribution
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <AlertCircle className="h-12 w-12 text-slate-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-slate-900 dark:text-slate-100 mb-2">
              No Service Data Available
            </h3>
            <p className="text-slate-600 dark:text-slate-400">
              Service breakdown data is not available in the current API response.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Sort services by cost (highest first) and filter out zero-cost services for main display
  const sortedServices = [...services.allPeriods]
    .sort((a, b) => b.totalCost - a.totalCost)
    .filter(service => service.totalCost > 0);

  const topServices = sortedServices.slice(0, 6);
  const topService = sortedServices[0];

  // Prepare data for charts
  const pieData = topServices.map(service => ({
    name: service.serviceName,
    value: service.totalCost,
    percentage: service.percentage,
  }));

  const barData = topServices.map(service => ({
    name: service.serviceName.length > 15 
      ? service.serviceName.substring(0, 15) + '...' 
      : service.serviceName,
    fullName: service.serviceName,
    cost: service.totalCost,
    percentage: service.percentage,
  }));

  if (!detailed) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center">
              <BarChart3 className="h-5 w-5 mr-2" />
              Service Breakdown
            </div>
            <Badge variant="outline">
              {services.summary.totalServices} Services
            </Badge>
          </CardTitle>
          <CardDescription>
            Top AWS services by cost ({formatCurrency(totalCost)} total)
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Service List */}
          <div className="space-y-4">
            {topServices.map((service, index) => (
              <div key={service.serviceName} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center space-x-2">
                      <span className="text-lg">{getServiceIcon(service.serviceName)}</span>
                      <div>
                        <span className="font-medium text-slate-900 dark:text-slate-100">
                          {service.serviceName}
                        </span>
                        <div className="text-xs text-slate-500 dark:text-slate-400">
                          {getServiceCategory(service.serviceName)} • Usage: {formatUsage(service.totalUsage)}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-slate-900 dark:text-slate-100">
                      {formatCurrency(service.totalCost)}
                    </div>
                    <div className="text-sm text-slate-600 dark:text-slate-400">
                      {service.percentage.toFixed(1)}%
                    </div>
                  </div>
                </div>
                <Progress value={service.percentage} className="h-2" />
              </div>
            ))}
          </div>

          {/* Summary Info */}
          <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
            <div className="flex items-center">
              <Info className="h-4 w-4 text-blue-600 dark:text-blue-400 mr-2" />
              <div className="text-sm">
                <span className="text-blue-800 dark:text-blue-200 font-medium">
                  Showing top {topServices.length} services
                </span>
                <span className="text-blue-600 dark:text-blue-300 ml-2">
                  • {services.summary.totalServices} total services • Top service: {services.summary.topServiceAllTime}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Detailed view with tabs
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center">
            <BarChart3 className="h-5 w-5 mr-2" />
            Detailed Service Analysis
          </div>
          <Badge variant="outline">
            {services.summary.totalServices} Total Services
          </Badge>
        </CardTitle>
        <CardDescription>
          Comprehensive breakdown of AWS service costs and usage patterns
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="breakdown" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="breakdown">All Services</TabsTrigger>
            <TabsTrigger value="charts">Visual Analysis</TabsTrigger>
            <TabsTrigger value="categories">By Category</TabsTrigger>
          </TabsList>

          <TabsContent value="breakdown" className="space-y-4">
            {/* All Services List - Show ALL services from API */}
            <div className="space-y-4">
              {services.allPeriods.map((service, index) => (
                <Card key={service.serviceName}>
                  <CardContent className="pt-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <div className="flex items-center space-x-2">
                          <span className="text-xl">{getServiceIcon(service.serviceName)}</span>
                          <div>
                            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100">
                              {service.serviceName}
                            </h3>
                            <p className="text-sm text-slate-600 dark:text-slate-400">
                              {getServiceCategory(service.serviceName)} Service
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-xl font-bold text-slate-900 dark:text-slate-100">
                          {formatCurrency(service.totalCost)}
                        </div>
                        <div className="text-sm text-slate-600 dark:text-slate-400">
                          Rank #{index + 1}
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-slate-600 dark:text-slate-400">Cost Distribution</span>
                        <span className="text-sm font-medium">
                          {service.percentage.toFixed(2)}% of total
                        </span>
                      </div>
                      
                      <Progress value={service.percentage} className="h-3" />
                      
                      <div className="grid grid-cols-4 gap-4 text-sm">
                        <div className="text-center p-2 bg-slate-50 dark:bg-slate-800 rounded">
                          <div className="font-medium text-slate-900 dark:text-slate-100">
                            {formatCurrency(service.totalCost)}
                          </div>
                          <div className="text-slate-600 dark:text-slate-400">Total Cost</div>
                        </div>
                        <div className="text-center p-2 bg-slate-50 dark:bg-slate-800 rounded">
                          <div className="font-medium text-slate-900 dark:text-slate-100">
                            {formatUsage(service.totalUsage)}
                          </div>
                          <div className="text-slate-600 dark:text-slate-400">Usage</div>
                        </div>
                        <div className="text-center p-2 bg-slate-50 dark:bg-slate-800 rounded">
                          <div className="font-medium text-slate-900 dark:text-slate-100">
                            {service.percentage.toFixed(1)}%
                          </div>
                          <div className="text-slate-600 dark:text-slate-400">Percentage</div>
                        </div>
                        <div className="text-center p-2 bg-slate-50 dark:bg-slate-800 rounded">
                          <div className="font-medium text-slate-900 dark:text-slate-100 capitalize">
                            {getServiceCategory(service.serviceName)}
                          </div>
                          <div className="text-slate-600 dark:text-slate-400">Category</div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="charts" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Cost Distribution</CardTitle>
                  <CardDescription>Visual breakdown of service costs</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={pieData}
                          cx="50%"
                          cy="50%"
                          outerRadius={80}
                          dataKey="value"
                          label={({ name, percentage }) => `${name}: ${percentage.toFixed(1)}%`}
                        >
                          {pieData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={`hsl(${index * 45}, 70%, 50%)`} />
                          ))}
                        </Pie>
                        <Tooltip 
                          formatter={(value) => [formatCurrency(Number(value)), 'Cost']}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Service Comparison</CardTitle>
                  <CardDescription>Cost comparison across services</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={barData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                        <XAxis 
                          dataKey="name" 
                          stroke="#64748b"
                          fontSize={10}
                          angle={-45}
                          textAnchor="end"
                          height={80}
                        />
                        <YAxis 
                          stroke="#64748b"
                          fontSize={12}
                          tickFormatter={(value) => `$${value}`}
                        />
                        <Tooltip 
                          formatter={(value) => [formatCurrency(Number(value)), 'Cost']}
                          labelFormatter={(label) => {
                            const service = barData.find(s => s.name === label);
                            return service ? service.fullName : label;
                          }}
                        />
                        <Bar 
                          dataKey="cost" 
                          fill="#3b82f6"
                          radius={[4, 4, 0, 0]}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="categories" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Object.entries(
                services.allPeriods.reduce((acc, service) => {
                  const category = getServiceCategory(service.serviceName);
                  if (!acc[category]) {
                    acc[category] = { cost: 0, services: [], count: 0 };
                  }
                  acc[category].cost += service.totalCost;
                  acc[category].services.push(service);
                  acc[category].count += 1;
                  return acc;
                }, {} as Record<string, { cost: number; services: ServiceData[]; count: number }>)
              ).map(([category, data]) => (
                <Card key={category}>
                  <CardContent className="pt-4">
                    <div className="text-center mb-4">
                      <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                        {formatCurrency(data.cost)}
                      </div>
                      <div className="text-lg font-medium text-slate-700 dark:text-slate-300 capitalize">
                        {category}
                      </div>
                      <div className="text-sm text-slate-500 dark:text-slate-500">
                        {data.count} service{data.count !== 1 ? 's' : ''}
                      </div>
                    </div>
                    <div className="space-y-2 max-h-48 overflow-y-auto">
                      {data.services.map((service) => (
                        <div key={service.serviceName} className="flex justify-between text-sm">
                          <span className="text-slate-600 dark:text-slate-400 truncate flex items-center">
                            <span className="mr-1">{getServiceIcon(service.serviceName)}</span>
                            <span className="truncate">{service.serviceName}</span>
                          </span>
                          <span className="font-medium text-slate-900 dark:text-slate-100 ml-2">
                            {formatCurrency(service.totalCost)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {/* Summary Statistics */}
        <div className="mt-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
          <div className="flex items-start">
            <Activity className="h-5 w-5 text-green-600 dark:text-green-400 mr-3 mt-0.5" />
            <div>
              <h4 className="font-medium text-green-800 dark:text-green-200">
                Service Analysis Summary
              </h4>
              <div className="text-green-700 dark:text-green-300 text-sm mt-1 space-y-1">
                <p>• <strong>{services.summary.totalServices}</strong> total services tracked</p>
                <p>• <strong>{services.summary.topServiceAllTime}</strong> is your highest cost service at {formatCurrency(services.summary.topServiceCostAllTime)}</p>
                <p>• <strong>{sortedServices.filter(s => s.totalCost > 0).length}</strong> services have incurred costs</p>
                <p>• Top 3 services account for <strong>{sortedServices.slice(0, 3).reduce((sum, s) => sum + s.percentage, 0).toFixed(1)}%</strong> of total costs</p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
