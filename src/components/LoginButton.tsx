
import { Button } from "@/components/ui/button";

export const LoginButton = () => {
  const handleFederatedLogin = () => {
    console.log("Initiating federated login with Cognito");
    // In a real app, this would redirect to AWS Cognito
  };

  return (
    <Button 
      variant="outline" 
      className="w-full" 
      onClick={handleFederatedLogin}
    >
      Sign in with AWS Cognito
    </Button>
  );
};
