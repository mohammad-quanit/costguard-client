import { useState, useEffect, useCallback } from 'react';
import { AWSAccountService, AWSAccount, AWSAccountRequest } from '@/services/awsAccountService';

interface UseAWSAccountsReturn {
  accounts: AWSAccount[];
  isLoading: boolean;
  isAdding: boolean;
  isRemoving: boolean;
  error: string | null;
  addAccount: (accountData: AWSAccountRequest) => Promise<void>;
  removeAccount: (accountId: string) => Promise<void>;
  refreshAccounts: () => Promise<void>;
  hasAccounts: boolean;
}

export const useAWSAccounts = (): UseAWSAccountsReturn => {
  const [accounts, setAccounts] = useState<AWSAccount[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAccounts = useCallback(async () => {
    try {
      setError(null);
      const fetchedAccounts = await AWSAccountService.getAccounts();
      setAccounts(fetchedAccounts);
    } catch (err: any) {
      console.error('useAWSAccounts - Error fetching accounts:', err);
      setError(err.message || 'Failed to fetch AWS accounts');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const addAccount = useCallback(async (accountData: AWSAccountRequest) => {
    setIsAdding(true);
    setError(null);
    
    try {
      const response = await AWSAccountService.validateAndAddAccount(accountData);
      
      if (response.success) {
        // Refresh accounts list after successful addition
        await fetchAccounts();
      } else {
        throw new Error(response.message || 'Failed to add AWS account');
      }
    } catch (err: any) {
      console.error('useAWSAccounts - Error adding account:', err);
      const errorMessage = err.message || 'Failed to add AWS account';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsAdding(false);
    }
  }, [fetchAccounts]);

  const removeAccount = useCallback(async (accountId: string) => {
    setIsRemoving(true);
    setError(null);
    
    try {
      const response = await AWSAccountService.removeAccount(accountId);
      
      if (response.success) {
        // Remove account from local state
        setAccounts(prev => prev.filter(account => account.accountId !== accountId));
      } else {
        throw new Error(response.message || 'Failed to remove AWS account');
      }
    } catch (err: any) {
      console.error('useAWSAccounts - Error removing account:', err);
      const errorMessage = err.message || 'Failed to remove AWS account';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsRemoving(false);
    }
  }, []);

  const refreshAccounts = useCallback(async () => {
    setIsLoading(true);
    await fetchAccounts();
  }, [fetchAccounts]);

  useEffect(() => {
    fetchAccounts();
  }, [fetchAccounts]);

  return {
    accounts,
    isLoading,
    isAdding,
    isRemoving,
    error,
    addAccount,
    removeAccount,
    refreshAccounts,
    hasAccounts: accounts.length > 0
  };
};
