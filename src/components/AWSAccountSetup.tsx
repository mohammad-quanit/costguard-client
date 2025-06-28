import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Cloud, CheckCircle, AlertCircle, Info } from 'lucide-react';
import { AWSAccountService, AWSAccountRequest } from '@/services/awsAccountService';

interface AWSAccountSetupProps {
  onAccountAdded: () => void;
  onSkip?: () => void;
  isRequired?: boolean; // New prop to indicate if account setup is mandatory
  fromSignup?: boolean; // New prop to indicate if coming from signup
}

const AWS_REGIONS = [
  { value: 'us-east-1', label: 'US East (N. Virginia)' },
  { value: 'us-east-2', label: 'US East (Ohio)' },
  { value: 'us-west-1', label: 'US West (N. California)' },
  { value: 'us-west-2', label: 'US West (Oregon)' },
  { value: 'eu-west-1', label: 'Europe (Ireland)' },
  { value: 'eu-west-2', label: 'Europe (London)' },
  { value: 'eu-central-1', label: 'Europe (Frankfurt)' },
  { value: 'ap-southeast-1', label: 'Asia Pacific (Singapore)' },
  { value: 'ap-southeast-2', label: 'Asia Pacific (Sydney)' },
  { value: 'ap-northeast-1', label: 'Asia Pacific (Tokyo)' },
];

export const AWSAccountSetup = ({ onAccountAdded, onSkip, isRequired = false, fromSignup = false }: AWSAccountSetupProps) => {
  const [formData, setFormData] = useState<AWSAccountRequest>({
    accessKeyId: '',
    secretAccessKey: '',
    region: 'us-east-1',
    accountAlias: ''
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showCredentials, setShowCredentials] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await AWSAccountService.validateAndAddAccount(formData);
      
      if (response.success) {
        setSuccess(`AWS account "${formData.accountAlias}" added successfully!`);
        setTimeout(() => {
          onAccountAdded();
        }, 2000);
      } else {
        setError(response.message || 'Failed to validate AWS account');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to add AWS account. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: keyof AWSAccountRequest, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setError(null);
  };

  const isFormValid = formData.accessKeyId && formData.secretAccessKey && formData.region && formData.accountAlias;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
        <CardHeader className="text-center">
          {fromSignup && (
            <div className="mb-4">
              <div className="flex items-center justify-center space-x-2 text-sm text-slate-600 dark:text-slate-400">
                <div className="flex items-center">
                  <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center mr-2">
                    <CheckCircle className="h-3 w-3 text-white" />
                  </div>
                  <span>Account Created</span>
                </div>
                <div className="w-8 h-px bg-slate-300 dark:bg-slate-600"></div>
                <div className="flex items-center">
                  <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center mr-2">
                    <span className="text-xs text-white font-bold">2</span>
                  </div>
                  <span>Connect AWS</span>
                </div>
                <div className="w-8 h-px bg-slate-300 dark:bg-slate-600"></div>
                <div className="flex items-center">
                  <div className="w-6 h-6 bg-slate-300 dark:bg-slate-600 rounded-full flex items-center justify-center mr-2">
                    <span className="text-xs text-slate-600 dark:text-slate-400 font-bold">3</span>
                  </div>
                  <span className="text-slate-400 dark:text-slate-500">Dashboard</span>
                </div>
              </div>
            </div>
          )}
          
          <div className="mx-auto mb-4 w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
            <Cloud className="h-6 w-6 text-blue-600 dark:text-blue-400" />
          </div>
          <CardTitle className="text-2xl font-bold text-slate-900 dark:text-slate-100">
            {fromSignup ? 'Welcome to CostGuard!' : 'Connect Your AWS Account'}
          </CardTitle>
          <CardDescription className="text-lg text-slate-600 dark:text-slate-400">
            {fromSignup 
              ? "Great! Your account is ready. Now let's connect your AWS account to start monitoring your cloud costs."
              : isRequired 
                ? "To get started with CostGuard, you need to connect at least one AWS account for cost monitoring."
                : "Add your AWS account to start monitoring costs and managing budgets"
            }
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Info Alert */}
          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>
              Your AWS credentials are encrypted and stored securely. We only use them to fetch cost data and manage budgets on your behalf.
            </AlertDescription>
          </Alert>

          {/* Success Message */}
          {success && (
            <Alert className="border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-200 [&>svg]:text-green-600 dark:[&>svg]:text-green-400">
              <CheckCircle className="h-4 w-4" />
              <AlertDescription className="text-green-800 dark:text-green-200">{success}</AlertDescription>
            </Alert>
          )}

          {/* Error Message */}
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Account Alias */}
            <div className="space-y-2">
              <Label htmlFor="accountAlias">Account Alias *</Label>
              <Input
                id="accountAlias"
                type="text"
                placeholder="e.g., My Production Account"
                value={formData.accountAlias}
                onChange={(e) => handleInputChange('accountAlias', e.target.value)}
                required
              />
              <p className="text-sm text-slate-600 dark:text-slate-400">A friendly name to identify this AWS account</p>
            </div>

            {/* Region */}
            <div className="space-y-2">
              <Label htmlFor="region">AWS Region *</Label>
              <Select value={formData.region} onValueChange={(value) => handleInputChange('region', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select AWS Region" />
                </SelectTrigger>
                <SelectContent>
                  {AWS_REGIONS.map((region) => (
                    <SelectItem key={region.value} value={region.value}>
                      {region.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* AWS Credentials Section */}
            <div className="space-y-4 p-4 border border-slate-200 dark:border-slate-600 rounded-lg bg-slate-50 dark:bg-slate-700">
              <div className="flex items-center justify-between">
                <h3 className="font-medium text-slate-900 dark:text-slate-100">AWS Credentials</h3>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setShowCredentials(!showCredentials)}
                >
                  {showCredentials ? 'Hide' : 'Show'} Credentials
                </Button>
              </div>

              {showCredentials && (
                <div className="space-y-4">
                  {/* Access Key ID */}
                  <div className="space-y-2">
                    <Label htmlFor="accessKeyId">Access Key ID *</Label>
                    <Input
                      id="accessKeyId"
                      type="text"
                      placeholder="AKIA..."
                      value={formData.accessKeyId}
                      onChange={(e) => handleInputChange('accessKeyId', e.target.value)}
                      required
                    />
                  </div>

                  {/* Secret Access Key */}
                  <div className="space-y-2">
                    <Label htmlFor="secretAccessKey">Secret Access Key *</Label>
                    <Input
                      id="secretAccessKey"
                      type="password"
                      placeholder="Your secret access key"
                      value={formData.secretAccessKey}
                      onChange={(e) => handleInputChange('secretAccessKey', e.target.value)}
                      required
                    />
                  </div>
                </div>
              )}

              <Alert>
                <Info className="h-4 w-4" />
                <AlertDescription className="text-sm">
                  <strong>Required Permissions:</strong> Your AWS user needs Cost Explorer and Budgets read access. 
                  We recommend creating a dedicated IAM user with minimal required permissions.
                </AlertDescription>
              </Alert>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
              <Button
                type="submit"
                disabled={!isFormValid || isLoading}
                className="flex-1"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Validating Account...
                  </>
                ) : (
                  'Add AWS Account'
                )}
              </Button>
              
              {onSkip && !isRequired && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={onSkip}
                  disabled={isLoading}
                >
                  Skip for Now
                </Button>
              )}
            </div>
          </form>

          {/* Help Text */}
          <div className="text-center text-sm text-slate-600 dark:text-slate-400">
            <p>Need help setting up AWS credentials?</p>
            <a href="#" className="text-blue-600 dark:text-blue-400 hover:underline">
              View our setup guide
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
