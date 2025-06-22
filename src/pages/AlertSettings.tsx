
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertSettingsForm } from "@/components/AlertSettingsForm";
import { NotificationToggle } from "@/components/NotificationToggle";
import { Settings, Bell } from "lucide-react";
import { Layout } from "@/components/Layout";

const AlertSettings = () => {
  return (
    <Layout>
      <main className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">Alert Settings</h1>
          <p className="text-slate-600 dark:text-slate-400 mt-2">Configure your cost monitoring and notification preferences</p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Settings className="h-5 w-5 mr-2" />
                Budget & Thresholds
              </CardTitle>
              <CardDescription>
                Set your spending limits and alert thresholds
              </CardDescription>
            </CardHeader>
            <CardContent>
              <AlertSettingsForm />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Bell className="h-5 w-5 mr-2" />
                Notification Preferences
              </CardTitle>
              <CardDescription>
                Choose how you want to receive alerts
              </CardDescription>
            </CardHeader>
            <CardContent>
              <NotificationToggle />
            </CardContent>
          </Card>
        </div>
      </main>
    </Layout>
  );
};

export default AlertSettings;
