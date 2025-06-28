import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useAuth } from "@/contexts/AuthContext";
import { useAWSAccounts } from "@/hooks/useAWSAccounts";
import { 
  Palette, 
  User, 
  Save, 
  AlertTriangle,
  Cloud,
  Trash2,
  Loader2,
  Settings as SettingsIcon
} from "lucide-react";
import { Layout } from "@/components/Layout";

const Settings = () => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [showAddAccount, setShowAddAccount] = useState(false);

  // AWS Accounts hook
  const { 
    accounts, 
    isLoading: accountsLoading, 
    isRemoving, 
    error: accountsError, 
    removeAccount, 
    refreshAccounts 
  } = useAWSAccounts();

  // User preferences state
  const [userPreferences, setUserPreferences] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    timezone: user?.preferences?.timezone || 'UTC',
    currency: user?.preferences?.currency || 'USD',
  });

  const handleSaveUserPreferences = async () => {
    setIsLoading(true);
    setSaveError(null);
    setSaveSuccess(false);

    try {
      // TODO: Implement API call to update user preferences
      
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

  // AWS Account management functions
  const handleRemoveAccount = async (accountId: string, accountAlias: string) => {
    if (window.confirm(`Are you sure you want to remove "${accountAlias}"? This will stop cost monitoring for this account.`)) {
      try {
        await removeAccount(accountId);
      } catch (error) {
        // Error is handled by the hook and displayed in the UI
      }
    }
  };

  const handleAccountAdded = () => {
    setShowAddAccount(false);
    refreshAccounts();
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800 border-green-200">Active</Badge>;
      case 'validating':
        return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">Validating</Badge>;
      case 'inactive':
        return <Badge className="bg-red-100 text-red-800 border-red-200">Inactive</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  // Show AWS Account Setup modal
  if (showAddAccount) {
    return (
      <AWSAccountSetup 
        onAccountAdded={handleAccountAdded}
        onSkip={() => setShowAddAccount(false)}
        isRequired={false}
      />
    );
  }

  return (
    <Layout>
      <main className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">Settings</h1>
          <p className="text-slate-600 dark:text-slate-400 mt-2">
            Customize your application preferences and appearance
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
                <p className="text-xs text-slate-500">
                  This email will be used for all notifications and alerts
                </p>
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

          {/* AWS Accounts Management */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Cloud className="h-5 w-5 mr-2" />
                AWS Accounts
              </CardTitle>
              <CardDescription>
                Manage your AWS accounts for cost monitoring and budget management
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Error Alert */}
              {accountsError && (
                <Alert variant="destructive">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>{accountsError}</AlertDescription>
                </Alert>
              )}

              {/* Add Account Button */}
              <div className="flex justify-between items-center">
                <p className="text-sm text-gray-600">
                  {accounts.length === 0 
                    ? "No AWS accounts connected. Add your first account to start monitoring costs."
                    : `${accounts.length} AWS account${accounts.length > 1 ? 's' : ''} connected`
                  }
                </p>
                <Button onClick={() => setShowAddAccount(true)} size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Account
                </Button>
              </div>

              {/* Accounts List */}
              {accountsLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
                  <span className="ml-2 text-gray-600">Loading AWS accounts...</span>
                </div>
              ) : accounts.length > 0 ? (
                <div className="space-y-3">
                  {accounts.map((account) => (
                    <div key={account.accountId} className="flex items-center justify-between p-3 border rounded-lg bg-gray-50">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-medium">{account.accountAlias}</h4>
                          {getStatusBadge(account.status)}
                        </div>
                        <div className="text-sm text-gray-600">
                          <span>Account ID: {account.accountId}</span>
                          <span className="mx-2">•</span>
                          <span>Region: {account.region}</span>
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          Added: {new Date(account.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <SettingsIcon className="h-3 w-3" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => handleRemoveAccount(account.accountId, account.accountAlias)}
                          disabled={isRemoving}
                          className="text-red-600 hover:text-red-700"
                        >
                          {isRemoving ? (
                            <Loader2 className="h-3 w-3 animate-spin" />
                          ) : (
                            <Trash2 className="h-3 w-3" />
                          )}
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Cloud className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                  <p>No AWS accounts connected</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </Layout>
  );
};

export default Settings;
