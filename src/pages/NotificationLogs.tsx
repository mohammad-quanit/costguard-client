
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Bell, Mail, MessageSquare, AlertTriangle } from "lucide-react";
import { Layout } from "@/components/Layout";

const NotificationLogs = () => {
  const notifications = [
    {
      id: 1,
      type: "warning",
      message: "Monthly spend reached 80% of budget",
      channel: "email",
      timestamp: "2024-01-15T10:30:00Z",
      status: "delivered"
    },
    {
      id: 2,
      type: "info",
      message: "Daily spend limit exceeded for EC2",
      channel: "slack",
      timestamp: "2024-01-14T15:45:00Z",
      status: "delivered"
    },
    {
      id: 3,
      type: "error",
      message: "Failed to fetch cost data",
      channel: "email",
      timestamp: "2024-01-13T08:20:00Z",
      status: "failed"
    }
  ];

  const getChannelIcon = (channel: string) => {
    switch (channel) {
      case "email": return <Mail className="h-4 w-4" />;
      case "slack": return <MessageSquare className="h-4 w-4" />;
      default: return <Bell className="h-4 w-4" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "warning": return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400";
      case "error": return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400";
      default: return "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "delivered": return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400";
      case "failed": return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400";
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400";
    }
  };

  return (
    <Layout>
      <main className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">Notification Logs</h1>
            <p className="text-slate-600 dark:text-slate-400 mt-2">History of all alert notifications sent from your cost monitoring system</p>
          </div>
          <Button variant="outline" size="sm">
            <Bell className="h-4 w-4 mr-2" />
            Test Notification
          </Button>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Recent Notifications</CardTitle>
            <CardDescription>
              History of all alert notifications sent from your cost monitoring system
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {notifications.map((notification) => (
                <div 
                  key={notification.id}
                  className="flex items-start justify-between p-4 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                >
                  <div className="flex items-start space-x-3">
                    <div className="flex items-center space-x-2">
                      <div className="text-slate-600 dark:text-slate-400">
                        {getChannelIcon(notification.channel)}
                      </div>
                      <AlertTriangle className="h-4 w-4 text-slate-400 dark:text-slate-500" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-slate-900 dark:text-slate-100">
                        {notification.message}
                      </p>
                      <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                        {new Date(notification.timestamp).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge className={getTypeColor(notification.type)}>
                      {notification.type}
                    </Badge>
                    <Badge className={getStatusColor(notification.status)}>
                      {notification.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </main>
    </Layout>
  );
};

export default NotificationLogs;
