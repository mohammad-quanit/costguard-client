
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertSettingsForm } from "@/components/AlertSettingsForm";
import { NotificationToggle } from "@/components/NotificationToggle";
import { Settings, Bell } from "lucide-react";

const AlertSettings = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <header className="bg-white border-b border-slate-200 shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <h1 className="text-2xl font-bold text-slate-900">Alert Settings</h1>
          </div>
        </div>
      </header>
      
      <main className="container mx-auto px-4 py-8">
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
    </div>
  );
};

export default AlertSettings;
