import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AuthService } from '@/services/authService';

export const AuthDebug = () => {
  const { user, token, isAuthenticated, isLoading, error, signIn } = useAuth();

  const testLogin = async () => {
    try {
      console.log('Testing direct API call...');
      const response = await AuthService.signIn({
        email: 'john.doe@examplee.com',
        password: 'Test@123'
      });
      console.log('Direct API response:', response);
    } catch (error) {
      console.error('Direct API error:', error);
    }
  };

  const testContextLogin = async () => {
    try {
      console.log('Testing context login...');
      await signIn('john.doe@examplee.com', 'Test@123');
      console.log('Context login successful');
    } catch (error) {
      console.error('Context login error:', error);
    }
  };

  const refreshProfile = async () => {
    try {
      console.log('Testing profile refresh...');
      const updatedUser = await AuthService.getProfile();
      console.log('Profile refresh successful:', updatedUser);
    } catch (error) {
      console.error('Profile refresh error:', error);
    }
  };

  const clearAuth = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    window.location.reload();
  };

  return (
    <Card className="fixed bottom-4 right-4 w-80 z-50 bg-yellow-50 border-yellow-200 max-h-96 overflow-y-auto">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm">Auth Debug</CardTitle>
      </CardHeader>
      <CardContent className="text-xs space-y-1">
        <div>Loading: {isLoading ? 'Yes' : 'No'}</div>
        <div>Authenticated: {isAuthenticated ? 'Yes' : 'No'}</div>
        <div>Has User: {user ? 'Yes' : 'No'}</div>
        <div>Has Token: {token ? 'Yes' : 'No'}</div>
        <div>User Email: {user?.email || 'None'}</div>
        <div>User ID: {user?.userId || 'None'}</div>
        <div>First Name: {user?.firstName || 'None'}</div>
        <div>Last Name: {user?.lastName || 'None'}</div>
        <div>Error: {error || 'None'}</div>
        <div>LocalStorage Token: {localStorage.getItem('authToken') ? 'Yes' : 'No'}</div>
        <div>LocalStorage User: {localStorage.getItem('user') ? 'Yes' : 'No'}</div>
        <div className="text-xs mt-2 p-2 bg-gray-100 rounded">
          <div>Raw User Object:</div>
          <div className="break-all">{user ? JSON.stringify(user, null, 2) : 'null'}</div>
        </div>
        <div className="text-xs mt-2 p-2 bg-gray-100 rounded">
          <div>LocalStorage User:</div>
          <div className="break-all">{localStorage.getItem('user') || 'null'}</div>
        </div>
        <div className="pt-2 space-y-1">
          <Button size="sm" onClick={testLogin} className="w-full text-xs">
            Test Direct API
          </Button>
          <Button size="sm" onClick={testContextLogin} className="w-full text-xs">
            Test Context Login
          </Button>
          <Button size="sm" onClick={refreshProfile} variant="outline" className="w-full text-xs">
            Refresh Profile
          </Button>
          <Button size="sm" onClick={clearAuth} variant="destructive" className="w-full text-xs">
            Clear Auth Data
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
