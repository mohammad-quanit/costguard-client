// Authentication Types

export interface SignUpRequest {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
}

export interface SignInRequest {
  email: string;
  password: string;
}

export interface Tokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  tokenType: string;
}

export interface CognitoTokens {
  accessToken: string;
  idToken: string;
  refreshToken: string;
}

export interface UserPreferences {
  emailNotifications: boolean;
  currency: string;
  smsNotifications: boolean;
  timezone: string;
}

export interface CostSettings {
  monthlyBudget: number;
  alertThreshold: number;
  alertFrequency: string;
}

export interface User {
  userId: string;
  email: string;
  firstName: string;
  lastName: string;
  isActive: boolean;
  lastLoginAt: string;
  createdAt: string;
  updatedAt: string;
  preferences: UserPreferences;
  costSettings: CostSettings;
}

export interface AuthResponse {
  message: string;
  tokens: Tokens;
  user: User;
  cognitoTokens: CognitoTokens;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface RefreshTokenResponse {
  token: string;
  expiresIn?: number;
}

export interface AuthError {
  message: string;
  code?: string;
  details?: any;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}
