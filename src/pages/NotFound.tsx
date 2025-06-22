import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Home, AlertCircle } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800 p-4">
      <Card className="w-full max-w-md text-center">
        <CardContent className="pt-8 pb-8">
          <div className="flex items-center justify-center w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full mx-auto mb-6">
            <AlertCircle className="h-8 w-8 text-red-600 dark:text-red-400" />
          </div>
          
          <h1 className="text-6xl font-bold text-slate-900 dark:text-slate-100 mb-4">404</h1>
          
          <h2 className="text-2xl font-semibold text-slate-800 dark:text-slate-200 mb-2">
            Page Not Found
          </h2>
          
          <p className="text-slate-600 dark:text-slate-400 mb-6">
            Oops! The page you're looking for doesn't exist or has been moved.
          </p>
          
          <div className="space-y-3">
            <Button asChild className="w-full">
              <a href="/">
                <Home className="h-4 w-4 mr-2" />
                Return to Dashboard
              </a>
            </Button>
            
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Attempted to access: <code className="bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded text-xs">{location.pathname}</code>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default NotFound;
