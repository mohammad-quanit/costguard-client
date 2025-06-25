import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useAuth } from "@/contexts/AuthContext";
import { 
  Palette, 
  Settings as SettingsIcon, 
  Bell, 
  User, 
  Save, 
  Mail,
  MessageSquare,
  Smartphone,
  AlertTriangle
} from "lucide-react";
import { Layout } from "@/components/Layout";

const Settings = () => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  // User preferences state
  const [userPreferences, setUserPreferences] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    timezone: user?.preferences?.timezone || 'UTC',
    currency: user?.preferences?.currency || 'USD',
  });

  // Global notification preferences
  const [notificationPreferences, setNotificationPreferences] = useState({
    emailNotifications: user?.preferences?.emailNotifications ?? true,
    smsNotifications: user?.preferences?.smsNotifications ?? false,
    pushNotifications: true,
    weeklyReports: true,
    monthlyReports: true,
    budgetAlerts: true,
    costSpikes: true,
    serviceAlerts: true,
    emailAddress: user?.email || '',
    phoneNumber: '',
    slackWebhook: ''
  });

  const handleSaveUserPreferences = async () => {
    setIsLoading(true);
    setSaveError(null);
    setSaveSuccess(false);

    try {
      // TODO: Implement API call to update user preferences
      console.log('Saving user preferences:', userPreferences);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (error: any) {
      setSaveError(error.message || 'Failed to save preferences');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveNotificationPreferences = async () => {
    setIsLoading(true);
    setSaveError(null);
    setSaveSuccess(false);

    try {
      // TODO: Implement API call to update notification preferences
      console.log('Saving notification preferences:', notificationPreferences);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (error: any) {
      setSaveError(error.message || 'Failed to save notification preferences');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout>
      <main className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">Settings</h1>
          <p className="text-slate-600 dark:text-slate-400 mt-2">
            Customize your application preferences, appearance, and notification settings
          </p>
        </div>

        {saveSuccess && (
          <Alert className="mb-6 border-green-200 bg-green-50 dark:bg-green-900/20">
            <AlertTriangle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800 dark:text-green-200">
              Settings saved successfully!
            </AlertDescription>
          </Alert>
        )}

        {saveError && (
          <Alert variant="destructive" className="mb-6">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>{saveError}</AlertDescription>
          </Alert>
        )}
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* User Profile Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <User className="h-5 w-5 mr-2" />
                User Profile
              </CardTitle>
              <CardDescription>
                Update your personal information and preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    value={userPreferences.firstName}
                    onChange={(e) => setUserPreferences(prev => ({ ...prev, firstName: e.target.value }))}
                    placeholder="John"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    value={userPreferences.lastName}
                    onChange={(e) => setUserPreferences(prev => ({ ...prev, lastName: e.target.value }))}
                    placeholder="Doe"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={userPreferences.email}
                  onChange={(e) => setUserPreferences(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="john.doe@example.com"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="timezone">Timezone</Label>
                  <Select 
                    value={userPreferences.timezone} 
                    onValueChange={(value) => setUserPreferences(prev => ({ ...prev, timezone: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="UTC">UTC</SelectItem>
                      <SelectItem value="America/New_York">Eastern Time</SelectItem>
                      <SelectItem value="America/Chicago">Central Time</SelectItem>
                      <SelectItem value="America/Denver">Mountain Time</SelectItem>
                      <SelectItem value="America/Los_Angeles">Pacific Time</SelectItem>
                      <SelectItem value="Europe/London">London</SelectItem>
                      <SelectItem value="Europe/Paris">Paris</SelectItem>
                      <SelectItem value="Asia/Tokyo">Tokyo</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="currency">Default Currency</Label>
                  <Select 
                    value={userPreferences.currency} 
                    onValueChange={(value) => setUserPreferences(prev => ({ ...prev, currency: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="USD">USD ($)</SelectItem>
                      <SelectItem value="EUR">EUR (€)</SelectItem>
                      <SelectItem value="GBP">GBP (£)</SelectItem>
                      <SelectItem value="JPY">JPY (¥)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Button onClick={handleSaveUserPreferences} disabled={isLoading} className="w-full">
                <Save className="h-4 w-4 mr-2" />
                {isLoading ? 'Saving...' : 'Save Profile'}
              </Button>
            </CardContent>
          </Card>

          {/* Appearance Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Palette className="h-5 w-5 mr-2" />
                Appearance
              </CardTitle>
              <CardDescription>
                Customize the look and feel of your dashboard
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ThemeToggle />
            </CardContent>
          </Card>

          {/* Global Notification Preferences */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Bell className="h-5 w-5 mr-2" />
                Global Notification Preferences
              </CardTitle>
              <CardDescription>
                Configure your default notification settings for all alerts and reports
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Notification Types */}
              <div className="space-y-4">
                <h4 className="font-medium text-slate-900 dark:text-slate-100">Notification Types</h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Mail className="h-4 w-4 text-slate-500" />
                      <div>
                        <Label htmlFor="email-global">Email Notifications</Label>
                        <p className="text-xs text-slate-500">Receive alerts via email</p>
                      </div>
                    </div>
                    <Switch
                      id="email-global"
                      checked={notificationPreferences.emailNotifications}
                      onCheckedChange={(checked) => 
                        setNotificationPreferences(prev => ({ ...prev, emailNotifications: checked }))
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Smartphone className="h-4 w-4 text-slate-500" />
                      <div>
                        <Label htmlFor="sms-global">SMS Notifications</Label>
                        <p className="text-xs text-slate-500">Receive alerts via SMS</p>
                      </div>
                    </div>
                    <Switch
                      id="sms-global"
                      checked={notificationPreferences.smsNotifications}
                      onCheckedChange={(checked) => 
                        setNotificationPreferences(prev => ({ ...prev, smsNotifications: checked }))
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <MessageSquare className="h-4 w-4 text-slate-500" />
                      <div>
                        <Label htmlFor="push-global">Push Notifications</Label>
                        <p className="text-xs text-slate-500">Browser push notifications</p>
                      </div>
                    </div>
                    <Switch
                      id="push-global"
                      checked={notificationPreferences.pushNotifications}
                      onCheckedChange={(checked) => 
                        setNotificationPreferences(prev => ({ ...prev, pushNotifications: checked }))
                      }
                    />
                  </div>
                </div>
              </div>

              {/* Alert Categories */}
              <div className="space-y-4">
                <h4 className="font-medium text-slate-900 dark:text-slate-100">Alert Categories</h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="budget-alerts">Budget Alerts</Label>
                      <p className="text-xs text-slate-500">Threshold and limit notifications</p>
                    </div>
                    <Switch
                      id="budget-alerts"
                      checked={notificationPreferences.budgetAlerts}
                      onCheckedChange={(checked) => 
                        setNotificationPreferences(prev => ({ ...prev, budgetAlerts: checked }))
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="cost-spikes">Cost Spikes</Label>
                      <p className="text-xs text-slate-500">Unusual spending patterns</p>
                    </div>
                    <Switch
                      id="cost-spikes"
                      checked={notificationPreferences.costSpikes}
                      onCheckedChange={(checked) => 
                        setNotificationPreferences(prev => ({ ...prev, costSpikes: checked }))
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="service-alerts">Service Alerts</Label>
                      <p className="text-xs text-slate-500">AWS service-specific notifications</p>
                    </div>
                    <Switch
                      id="service-alerts"
                      checked={notificationPreferences.serviceAlerts}
                      onCheckedChange={(checked) => 
                        setNotificationPreferences(prev => ({ ...prev, serviceAlerts: checked }))
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="weekly-reports">Weekly Reports</Label>
                      <p className="text-xs text-slate-500">Weekly cost summaries</p>
                    </div>
                    <Switch
                      id="weekly-reports"
                      checked={notificationPreferences.weeklyReports}
                      onCheckedChange={(checked) => 
                        setNotificationPreferences(prev => ({ ...prev, weeklyReports: checked }))
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="monthly-reports">Monthly Reports</Label>
                      <p className="text-xs text-slate-500">Monthly cost analysis</p>
                    </div>
                    <Switch
                      id="monthly-reports"
                      checked={notificationPreferences.monthlyReports}
                      onCheckedChange={(checked) => 
                        setNotificationPreferences(prev => ({ ...prev, monthlyReports: checked }))
                      }
                    />
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div className="space-y-4">
                <h4 className="font-medium text-slate-900 dark:text-slate-100">Contact Information</h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="notification-email">Notification Email</Label>
                    <Input
                      id="notification-email"
                      type="email"
                      value={notificationPreferences.emailAddress}
                      onChange={(e) => setNotificationPreferences(prev => ({ ...prev, emailAddress: e.target.value }))}
                      placeholder="alerts@example.com"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone-number">Phone Number (SMS)</Label>
                    <Input
                      id="phone-number"
                      type="tel"
                      value={notificationPreferences.phoneNumber}
                      onChange={(e) => setNotificationPreferences(prev => ({ ...prev, phoneNumber: e.target.value }))}
                      placeholder="+1 (555) 123-4567"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="slack-webhook">Slack Webhook URL (Optional)</Label>
                  <Input
                    id="slack-webhook"
                    value={notificationPreferences.slackWebhook}
                    onChange={(e) => setNotificationPreferences(prev => ({ ...prev, slackWebhook: e.target.value }))}
                    placeholder="https://hooks.slack.com/services/..."
                  />
                  <p className="text-xs text-slate-500">
                    Global Slack webhook for all notifications (can be overridden per budget)
                  </p>
                </div>
              </div>

              <Button onClick={handleSaveNotificationPreferences} disabled={isLoading} className="w-full">
                <Save className="h-4 w-4 mr-2" />
                {isLoading ? 'Saving...' : 'Save Notification Preferences'}
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
    </Layout>
  );
};

export default Settings;
