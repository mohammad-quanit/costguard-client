import { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, isLoading, user, error } = useAuth();
  const location = useLocation();

  useEffect(() => {
    console.log('ProtectedRoute - Auth state:', {
      isAuthenticated,
      isLoading,
      hasUser: !!user,
      currentPath: location.pathname,
      error
    });
  }, [isAuthenticated, isLoading, user, location.pathname, error]);

  // Show loading state while checking authentication
  if (isLoading) {
    console.log('ProtectedRoute - Showing loading state');
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="pt-8 pb-8 text-center">
            <div className="flex items-center justify-center w-16 h-16 bg-blue-100 dark:bg-blue-900/20 rounded-full mx-auto mb-6">
              <Loader2 className="h-8 w-8 text-blue-600 dark:text-blue-400 animate-spin" />
            </div>
            <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-2">
              Loading CostGuard
            </h2>
            <p className="text-slate-600 dark:text-slate-400 mb-4">
              Checking your authentication status...
            </p>
            <div className="space-y-2">
              <Skeleton className="h-4 w-3/4 mx-auto" />
              <Skeleton className="h-4 w-1/2 mx-auto" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated || !user) {
    console.log('ProtectedRoute - User not authenticated, redirecting to login');
    console.log('ProtectedRoute - Current location:', location.pathname);
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Render protected content
  console.log('ProtectedRoute - User authenticated, rendering protected content');
  return <>{children}</>;
};
