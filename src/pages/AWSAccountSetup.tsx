import { useNavigate, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { AWSAccountSetup } from '@/components/AWSAccountSetup';
import { useAWSAccounts } from '@/hooks/useAWSAccounts';
import { Loader2 } from 'lucide-react';

export default function AWSAccountSetupPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { accounts, isLoading, refreshAccounts, hasAccounts } = useAWSAccounts(true); // Always enabled for this page
  
  // Check if this is a required setup (from signup) or optional
  const isRequired = location.state?.isRequired || false;
  const fromSignup = location.state?.fromSignup || false;

  // If accounts already exist, redirect to dashboard
  useEffect(() => {
    if (!isLoading && hasAccounts) {
      // Small delay to ensure smooth transition
      setTimeout(() => {
        navigate('/', { replace: true });
      }, 500);
    }
  }, [isLoading, hasAccounts, accounts.length, navigate]);

  // Show loading while checking for existing accounts
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex items-center gap-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Checking AWS accounts...</span>
        </div>
      </div>
    );
  }

  // If accounts exist, show loading while redirecting
  if (hasAccounts) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex items-center gap-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>AWS accounts found, redirecting to dashboard...</span>
        </div>
      </div>
    );
  }

  const handleAccountAdded = () => {
    // Navigate to dashboard with a longer delay to ensure account is processed
    setTimeout(() => {
      navigate('/', { 
        replace: true,
        state: { 
          fromAccountSetup: true,
          timestamp: Date.now() // Add timestamp to force state change
        }
      });
    }, 2000); // Increased delay to 2 seconds
  };

  const handleSkip = () => {
    // Only allow skip if not required
    if (!isRequired) {
      navigate('/', { replace: true });
    }
  };

  return (
    <AWSAccountSetup 
      onAccountAdded={handleAccountAdded}
      onSkip={!isRequired ? handleSkip : undefined}
      isRequired={isRequired}
      fromSignup={fromSignup}
    />
  );
}
