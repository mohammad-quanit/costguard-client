import { apiClient } from '@/lib/api';

export interface AWSAccountRequest {
  accessKeyId: string;
  secretAccessKey: string;
  region: string;
  accountAlias: string;
}

export interface AWSAccountResponse {
  success: boolean;
  message: string;
  accountId?: string;
  accountAlias?: string;
  region?: string;
}

export interface AWSAccount {
  accountId: string;
  awsAccountId: string; // The actual AWS account ID (12-digit number)
  accountAlias: string;
  region: string;
  status: 'active' | 'inactive' | 'validating';
  createdAt: string;
  updatedAt: string;
}

export class AWSAccountService {
  static async validateAndAddAccount(accountData: AWSAccountRequest): Promise<AWSAccountResponse> {
    try {
      const response = await apiClient.post<AWSAccountResponse>('/aws/validate-account', accountData);
      return response;
    } catch (error) {
      console.error('AWSAccountService - Error validating account:', error);
      throw error;
    }
  }

  static async getAccounts(): Promise<AWSAccount[]> {
    try {
      const response = await apiClient.get<any>('/aws/accounts');
      
      // Handle different possible response structures
      let accounts: AWSAccount[] = [];
      
      if (Array.isArray(response)) {
        // Direct array response
        accounts = response;
      } else if (response && Array.isArray(response.accounts)) {
        // Nested accounts array
        accounts = response.accounts;
      } else if (response && Array.isArray(response.data)) {
        // Data wrapper
        accounts = response.data;
      } else if (response && response.Items && Array.isArray(response.Items)) {
        // DynamoDB style response
        accounts = response.Items;
      } else {
        accounts = [];
      }
      
      // Ensure awsAccountId is available (fallback to accountId if not provided by API)
      accounts = accounts.map(account => ({
        ...account,
        awsAccountId: account.awsAccountId || account.accountId || 'Unknown'
      }));
      
      return accounts;
    } catch (error) {
      console.error('AWSAccountService - Error fetching accounts:', error);
      
      // Return mock data for development/testing if API fails
      const mockAccounts: AWSAccount[] = [
        {
          accountId: 'mock-account-1',
          awsAccountId: '123456789012',
          accountAlias: 'Production Account',
          region: 'us-east-1',
          status: 'active',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          accountId: 'mock-account-2', 
          awsAccountId: '987654321098',
          accountAlias: 'Development Account',
          region: 'us-west-2',
          status: 'active',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }
      ];
      
      // Only return mock data in development
      if (process.env.NODE_ENV === 'development') {
        // Using mock data for development
        return mockAccounts;
      }
      
      // Return empty array in production if API fails
      return [];
    }
  }

  static async removeAccount(accountId: string): Promise<AWSAccountResponse> {
    try {
      const response = await apiClient.delete<AWSAccountResponse>(`/aws/accounts/${accountId}`);
      return response;
    } catch (error) {
      console.error('AWSAccountService - Error removing account:', error);
      throw error;
    }
  }
}
