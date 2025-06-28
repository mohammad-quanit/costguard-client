import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, Cloud, CheckCircle, AlertTriangle } from "lucide-react";
import { AWSAccountService, AWSAccountRequest } from "@/services/awsAccountService";

interface AWSAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  title?: string;
  description?: string;
  isRequired?: boolean; // New prop to make modal required
}

export const AWSAccountModal: React.FC<AWSAccountModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  title = "Add Your AWS Account",
  description = "Connect your AWS account to start monitoring your cloud costs and usage.",
  isRequired = false
}) => {
  const [formData, setFormData] = useState<AWSAccountRequest>({
    accessKeyId: '',
    secretAccessKey: '',
    accountAlias: '',
    region: 'us-east-1'
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [attemptCount, setAttemptCount] = useState(0);

  const handleInputChange = (field: keyof AWSAccountRequest, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    // Clear errors when user starts typing
    if (error) setError(null);
  };

  const handleRetry = () => {
    setError(null);
    setSuccess(null);
    setFormData({
      accessKeyId: '',
      secretAccessKey: '',
      accountAlias: '',
      region: 'us-east-1'
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.accessKeyId || !formData.secretAccessKey || !formData.accountAlias) {
      setError('Please fill in all required fields');
      return;
    }

    setIsLoading(true);
    setError(null);
    setSuccess(null);
    setAttemptCount(prev => prev + 1);

    try {
      const response = await AWSAccountService.validateAndAddAccount(formData);
      
      // Check for success in multiple possible response formats
      const isSuccess = response.success || response.status === 'success' || response.message?.includes('success');
      
      if (isSuccess) {
        // Validation successful, setting success state
        const successMessage = response.message || `AWS account "${formData.accountAlias}" validated and added successfully!`;
        setSuccess(successMessage);
        setError(null); // Make sure error is cleared
        
        // Wait a moment to show success message, then redirect to dashboard
        setTimeout(() => {
          onSuccess();
        }, 20000);
      } else {
        // Validation failed - show error message and keep modal open
        setError(response.message || response.error || 'AWS account validation failed. Please check your credentials and try again.');
      }
    } catch (err: any) {
      console.error('AWS Account validation error:', err);
      
      // Check if this might actually be a success response in disguise
      const errorMessage = err.message || err.responseText || '';
      if (errorMessage.includes('successfully') || errorMessage.includes('validated and stored')) {
        // Error message contains success indicators, treating as success
        setSuccess(errorMessage);
        setError(null);
        
        // Wait a moment to show success message, then redirect to dashboard
        setTimeout(() => {
          onSuccess();
        }, 1500);
        return;
      }
      
      // Handle actual errors
      if (err.status === 401) {
        setError('Authentication failed. Your session may have expired. Please refresh the page and try again.');
      } else if (err.status === 403) {
        setError('Access denied. Your AWS credentials do not have the required permissions. Please check your IAM policies.');
      } else if (err.status === 400) {
        setError('Invalid AWS credentials. Please verify your Access Key ID and Secret Access Key are correct.');
      } else if (err.message?.includes('Network Error') || err.code === 'NETWORK_ERROR') {
        setError('Network error. Please check your internet connection and try again.');
      } else if (err.responseText) {
        // Try to parse the response text for more specific error
        try {
          const errorData = JSON.parse(err.responseText);
          setError(errorData.message || errorData.error || 'AWS account validation failed. Please check your credentials.');
        } catch {
          setError(`AWS account validation failed (${err.status}): Please verify your credentials and try again.`);
        }
      } else {
        setError('AWS account validation failed. Please check your credentials and try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    if (!isLoading && (!isRequired || attemptCount >= 2)) {
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={!isRequired ? handleClose : undefined}>
      <DialogContent 
        className="sm:max-w-[500px]" 
        onPointerDownOutside={(e) => (isLoading || isRequired) && e.preventDefault()}
        onEscapeKeyDown={(e) => (isLoading || isRequired) && e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Cloud className="h-5 w-5 text-blue-500" />
            {title}
          </DialogTitle>
          <DialogDescription>
            {description}
          </DialogDescription>
        </DialogHeader>

        {success && !error ? (
          <div className="py-8 text-center">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-green-700 dark:text-green-400 mb-2">
              AWS Account Validated Successfully!
            </h3>
            <p className="text-green-600 dark:text-green-300 mb-4">
              {success}
            </p>
            <p className="text-sm text-gray-500 mb-4">
              Redirecting to your dashboard...
            </p>
            <Button 
              onClick={onSuccess}
              className="bg-green-600 hover:bg-green-700"
            >
              Go to Dashboard Now
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && !success && (
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  <div className="mb-2">{error}</div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleRetry}
                    className="mt-2"
                  >
                    Clear & Try Different Credentials
                  </Button>
                  {/* Debug info for development */}
                  {process.env.NODE_ENV === 'development' && (
                    <details className="mt-2">
                      <summary className="cursor-pointer text-xs">Debug Info</summary>
                      <div className="text-xs mt-1 font-mono">
                        <div>Auth Token: {localStorage.getItem('authToken') ? 'Present' : 'Missing'}</div>
                        <div>User: {localStorage.getItem('user') ? 'Present' : 'Missing'}</div>
                        <div>Attempts: {attemptCount}</div>
                      </div>
                    </details>
                  )}
                </AlertDescription>
              </Alert>
            )}

            {success && !error && (
              <Alert className="border-green-200 bg-green-50 dark:bg-green-900/20">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-800 dark:text-green-200">
                  {success}
                </AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="accountAlias">Account Alias *</Label>
              <Input
                id="accountAlias"
                placeholder="e.g., Production, Development"
                value={formData.accountAlias}
                onChange={(e) => handleInputChange('accountAlias', e.target.value)}
                disabled={isLoading}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="accessKeyId">AWS Access Key ID *</Label>
              <Input
                id="accessKeyId"
                placeholder="AKIA..."
                value={formData.accessKeyId}
                onChange={(e) => handleInputChange('accessKeyId', e.target.value)}
                disabled={isLoading}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="secretAccessKey">AWS Secret Access Key *</Label>
              <Input
                id="secretAccessKey"
                type="password"
                placeholder="Enter your secret access key"
                value={formData.secretAccessKey}
                onChange={(e) => handleInputChange('secretAccessKey', e.target.value)}
                disabled={isLoading}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="region">Default Region</Label>
              <select
                id="region"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700"
                value={formData.region}
                onChange={(e) => handleInputChange('region', e.target.value)}
                disabled={isLoading}
              >
                <option value="us-east-1">US East (N. Virginia)</option>
                <option value="us-west-2">US West (Oregon)</option>
                <option value="eu-west-1">Europe (Ireland)</option>
                <option value="ap-southeast-1">Asia Pacific (Singapore)</option>
              </select>
            </div>

            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
              <h4 className="font-semibold text-blue-900 dark:text-blue-100 text-sm mb-2">
                Required AWS Permissions:
              </h4>
              <ul className="text-xs text-blue-800 dark:text-blue-200 space-y-1">
                <li>• Cost Explorer: Read access</li>
                <li>• Budgets: Read/Write access</li>
                <li>• CloudWatch: Read access</li>
              </ul>
              <p className="text-xs text-blue-700 dark:text-blue-300 mt-2">
                💡 Tip: Make sure your AWS credentials have these permissions before validation.
              </p>
            </div>

            <div className="flex gap-3 pt-4">
              {(!isRequired || (attemptCount >= 2 && error)) && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleClose}
                  disabled={isLoading}
                  className="flex-1"
                >
                  {attemptCount >= 2 && error ? 'Skip for Now' : 'Cancel'}
                </Button>
              )}
              <Button
                type="submit"
                disabled={isLoading}
                className={(!isRequired || (attemptCount >= 2 && error)) ? "flex-1" : "w-full"}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Validating...
                  </>
                ) : (
                  'Validate & Add Account'
                )}
              </Button>
            </div>

            {attemptCount >= 2 && error && (
              <div className="mt-4 p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
                <p className="text-sm text-amber-800 dark:text-amber-200">
                  Having trouble? You can skip this step for now and add your AWS account later from the Settings page.
                </p>
              </div>
            )}
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
};
