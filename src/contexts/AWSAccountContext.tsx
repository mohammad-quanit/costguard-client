import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AWSAccount } from '@/services/awsAccountService';
import { useAWSAccounts } from '@/hooks/useAWSAccounts';
import { useAuth } from '@/contexts/AuthContext';

interface AWSAccountContextType {
  selectedAccount: AWSAccount | null;
  setSelectedAccount: (account: AWSAccount | null) => void;
  accounts: AWSAccount[];
  isLoading: boolean;
  error: string | null;
  refreshAccounts: () => Promise<void>;
}

const AWSAccountContext = createContext<AWSAccountContextType | undefined>(undefined);

interface AWSAccountProviderProps {
  children: ReactNode;
}

export const AWSAccountProvider: React.FC<AWSAccountProviderProps> = ({ children }) => {
  const [selectedAccount, setSelectedAccount] = useState<AWSAccount | null>(null);
  const { isAuthenticated } = useAuth();
  
  // Only fetch accounts if user is authenticated
  const { accounts, isLoading, error, refreshAccounts } = useAWSAccounts(isAuthenticated);

  // Auto-select the first account when accounts are loaded
  useEffect(() => {
    if (accounts.length > 0 && !selectedAccount) {
      // Try to get previously selected account from localStorage
      const savedAccountId = localStorage.getItem('selectedAccountId');
      const savedAccount = accounts.find(acc => acc.accountId === savedAccountId);
      
      if (savedAccount) {
        setSelectedAccount(savedAccount);
      } else {
        // Select the first account by default
        setSelectedAccount(accounts[0]);
      }
    }
  }, [accounts, selectedAccount]);

  // Save selected account to localStorage
  useEffect(() => {
    if (selectedAccount) {
      localStorage.setItem('selectedAccountId', selectedAccount.accountId);
    }
  }, [selectedAccount]);

  const value: AWSAccountContextType = {
    selectedAccount,
    setSelectedAccount,
    accounts,
    isLoading,
    error,
    refreshAccounts
  };

  return (
    <AWSAccountContext.Provider value={value}>
      {children}
    </AWSAccountContext.Provider>
  );
};

export const useAWSAccountContext = (): AWSAccountContextType => {
  const context = useContext(AWSAccountContext);
  if (context === undefined) {
    throw new Error('useAWSAccountContext must be used within an AWSAccountProvider');
  }
  return context;
};
