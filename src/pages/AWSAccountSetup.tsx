import { useNavigate } from 'react-router-dom';
import { AWSAccountSetup } from '@/components/AWSAccountSetup';

export default function AWSAccountSetupPage() {
  const navigate = useNavigate();

  const handleAccountAdded = () => {
    // Navigate to dashboard after successful account addition
    navigate('/', { replace: true });
  };

  const handleSkip = () => {
    // Navigate to dashboard even if user skips
    navigate('/', { replace: true });
  };

  return (
    <AWSAccountSetup 
      onAccountAdded={handleAccountAdded}
      onSkip={handleSkip}
    />
  );
}
