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
  tokens?: Tokens; // Optional for signup responses
  user?: User; // Optional for some responses
  cognitoTokens?: CognitoTokens; // Optional
  success?: boolean; // For signup responses that don't return tokens
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
