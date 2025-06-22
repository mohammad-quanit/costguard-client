
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Info, Bell, Settings } from "lucide-react";

interface Alert {
  id: number;
  type: 'warning' | 'info' | 'error';
  message: string;
  service: string;
  amount: number;
  threshold: number;
}

interface AlertsPanelProps {
  alerts: Alert[];
}

export const AlertsPanel = ({ alerts }: AlertsPanelProps) => {
  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-orange-500 dark:text-orange-400" />;
      case 'error':
        return <AlertTriangle className="h-4 w-4 text-red-500 dark:text-red-400" />;
      default:
        return <Info className="h-4 w-4 text-blue-500 dark:text-blue-400" />;
    }
  };

  const getAlertBadge = (type: string) => {
    switch (type) {
      case 'warning':
        return <Badge variant="secondary" className="bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400">Warning</Badge>;
      case 'error':
        return <Badge variant="destructive">Critical</Badge>;
      default:
        return <Badge variant="secondary" className="bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400">Info</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center">
                <Bell className="h-5 w-5 mr-2" />
                Active Alerts
              </CardTitle>
              <CardDescription>
                Monitor cost thresholds and unusual spending patterns
              </CardDescription>
            </div>
            <Button variant="outline" size="sm">
              <Settings className="h-4 w-4 mr-2" />
              Configure
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {alerts.map((alert) => (
              <div key={alert.id} className="flex items-start space-x-4 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                <div className="flex-shrink-0 mt-0.5">
                  {getAlertIcon(alert.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-2">
                    <p className="font-medium text-slate-900 dark:text-slate-100">{alert.message}</p>
                    {getAlertBadge(alert.type)}
                  </div>
                  <div className="flex items-center justify-between text-sm text-slate-600 dark:text-slate-400">
                    <span>Service: {alert.service}</span>
                    <span>Amount: ${alert.amount.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            ))}
            
            {alerts.length === 0 && (
              <div className="text-center py-8 text-slate-500 dark:text-slate-400">
                <Bell className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No active alerts</p>
                <p className="text-sm mt-1">Your costs are within normal thresholds</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Quick Alert Setup</CardTitle>
          <CardDescription>
            Set up common budget alerts with one click
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button variant="outline" className="h-auto p-4 flex-col items-start">
              <div className="font-medium mb-1">Budget 80% Alert</div>
              <div className="text-sm text-slate-600 dark:text-slate-400">Get notified at 80% of monthly budget</div>
            </Button>
            <Button variant="outline" className="h-auto p-4 flex-col items-start">
              <div className="font-medium mb-1">Daily Spike Alert</div>
              <div className="text-sm text-slate-600 dark:text-slate-400">Alert for 50%+ daily cost increases</div>
            </Button>
            <Button variant="outline" className="h-auto p-4 flex-col items-start">
              <div className="font-medium mb-1">Service Anomaly</div>
              <div className="text-sm text-slate-600 dark:text-slate-400">Detect unusual service spending patterns</div>
            </Button>
            <Button variant="outline" className="h-auto p-4 flex-col items-start">
              <div className="font-medium mb-1">Weekly Summary</div>
              <div className="text-sm text-slate-600 dark:text-slate-400">Weekly cost summary emails</div>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
