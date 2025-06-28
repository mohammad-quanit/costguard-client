import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Cloud, Loader2 } from 'lucide-react';
import { useAWSAccountContext } from '@/contexts/AWSAccountContext';

export const AWSAccountSelector = () => {
  const { selectedAccount, setSelectedAccount, accounts, isLoading } = useAWSAccountContext();

  if (isLoading) {
    return (
      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
        <Loader2 className="h-4 w-4 animate-spin" />
        Loading accounts...
      </div>
    );
  }

  if (accounts.length === 0) {
    return (
      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
        <Cloud className="h-4 w-4" />
        No AWS accounts connected
      </div>
    );
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800 text-xs">Active</Badge>;
      case 'validating':
        return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-400 dark:border-yellow-800 text-xs">Validating</Badge>;
      case 'inactive':
        return <Badge className="bg-red-100 text-red-800 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800 text-xs">Inactive</Badge>;
      default:
        return <Badge variant="secondary" className="text-xs">{status}</Badge>;
    }
  };

  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
        <Cloud className="h-4 w-4" />
        AWS Account:
      </div>
      
      <Select
        value={selectedAccount?.accountId || ''}
        onValueChange={(accountId) => {
          const account = accounts.find(acc => acc.accountId === accountId);
          if (account) {
            setSelectedAccount(account);
          }
        }}
      >
        <SelectTrigger className="w-64">
          <SelectValue placeholder="Select AWS Account">
            {selectedAccount ? (
              <div className="flex items-center justify-between w-full">
                <span className="truncate">
                  {selectedAccount.accountAlias || selectedAccount.awsAccountId || 'Unknown Account'}
                </span>
                <div className="ml-2">
                  {getStatusBadge(selectedAccount.status)}
                </div>
              </div>
            ) : (
              "Select AWS Account"
            )}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          {accounts.map((account) => (
            <SelectItem key={account.accountId} value={account.accountId}>
              <div className="flex flex-col">
                <span className="font-medium">
                  {account.accountAlias || account.awsAccountId || 'Unknown Account'}
                </span>
                <span className="text-xs text-muted-foreground">
                  {account.awsAccountId || account.accountId} • {account.region || 'Unknown Region'}
                </span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
