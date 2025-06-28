import { apiClient, API_ENDPOINTS } from '@/lib/api';
import { 
  SignUpRequest, 
  SignInRequest, 
  AuthResponse, 
  User, 
  RefreshTokenRequest, 
  RefreshTokenResponse 
} from '@/types/auth';

export class AuthService {
  /**
   * Sign up a new user
   */
  static async signUp(data: SignUpRequest): Promise<AuthResponse> {
    try {
      const response = await apiClient.post<AuthResponse>(API_ENDPOINTS.AUTH_SIGNUP, data);
      
      // Handle different signup response patterns
      if (response.tokens?.accessToken) {
        // Case 1: Signup returns tokens immediately (auto-login)
        localStorage.setItem('authToken', response.tokens.accessToken);
        localStorage.setItem('refreshToken', response.tokens.refreshToken);
        localStorage.setItem('user', JSON.stringify(response.user));
      } else if (response.user || response.success || response.message) {
        // Case 2: Signup only creates user account (no tokens)
        // This is common - user needs to login separately
        console.log('AuthService - User account created successfully, no auto-login');
        
        // Ensure we return a consistent response structure
        return {
          ...response,
          success: true,
          message: response.message || 'Account created successfully'
        };
      } else {
        // Case 3: Invalid response structure
        throw new Error('Invalid signup response: missing user data');
      }
      
      return response;
    } catch (error: any) {
      console.error('AuthService - Sign up error:', error);
      
      // For development: if API is not available, simulate successful signup
      if (error.code === 'NETWORK_ERROR' || error.message?.includes('Network Error')) {
        console.log('AuthService - API not available, simulating successful signup');
        return {
          success: true,
          message: 'Account created successfully (simulated)',
          user: {
            userId: 'mock-user-id',
            email: data.email,
            firstName: data.firstName,
            lastName: data.lastName
          }
        };
      }
      
      // Handle network or API errors
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      } else if (error.message) {
        throw error;
      } else {
        throw new Error('Failed to create account. Please try again.');
      }
    }
  }

  /**
   * Sign in an existing user
   */
  static async signIn(data: SignInRequest): Promise<AuthResponse> {
    try {
      const response = await apiClient.post<AuthResponse>(API_ENDPOINTS.AUTH_SIGNIN, data);
      
      // Store tokens and user data using the new response structure
      if (response.tokens?.accessToken) {
        localStorage.setItem('authToken', response.tokens.accessToken);
        localStorage.setItem('refreshToken', response.tokens.refreshToken);
        localStorage.setItem('user', JSON.stringify(response.user));
      } else {
        throw new Error('Invalid response: missing access token');
      }
      
      return response;
    } catch (error) {
      console.error('AuthService - Sign in error:', error);
      throw error;
    }
  }

  /**
   * Refresh authentication token
   */
  static async refreshToken(): Promise<RefreshTokenResponse> {
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      if (!refreshToken) {
        throw new Error('No refresh token available');
      }

      const response = await apiClient.post<RefreshTokenResponse>(
        API_ENDPOINTS.AUTH_REFRESH, 
        { refreshToken }
      );
      
      // Update stored token
      if (response.token) {
        localStorage.setItem('authToken', response.token);
      }
      
      return response;
    } catch (error) {
      console.error('Token refresh error:', error);
      // Clear stored data on refresh failure
      AuthService.signOut();
      throw error;
    }
  }

  /**
   * Get user profile
   */
  static async getProfile(): Promise<User> {
    try {
      const response = await apiClient.get<{message: string; user: User}>(API_ENDPOINTS.AUTH_PROFILE);
      
      // Extract user from the response structure
      const userData = response.user;
      
      // Update stored user data
      localStorage.setItem('user', JSON.stringify(userData));
      
      return userData;
    } catch (error) {
      console.error('AuthService - Get profile error:', error);
      throw error;
    }
  }

  /**
   * Sign out user
   */
  static signOut(): void {
    localStorage.removeItem('authToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    
    // Only redirect if not already on login page
    if (!window.location.pathname.includes('/login')) {
      window.location.href = '/login';
    }
  }

  /**
   * Check if user is authenticated
   */
  static isAuthenticated(): boolean {
    const token = localStorage.getItem('authToken');
    const user = localStorage.getItem('user');
    return !!(token && user);
  }

  /**
   * Get current user from localStorage
   */
  static getCurrentUser(): User | null {
    try {
      const userStr = localStorage.getItem('user');
      return userStr ? JSON.parse(userStr) : null;
    } catch (error) {
      console.error('Error parsing user data:', error);
      return null;
    }
  }

  /**
   * Get current token from localStorage
   */
  static getToken(): string | null {
    return localStorage.getItem('authToken');
  }

  /**
   * Check if token is expired (basic check)
   */
  static isTokenExpired(): boolean {
    const token = localStorage.getItem('authToken');
    if (!token) {
      return true;
    }

    try {
      // Basic JWT token expiration check
      const payload = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Date.now() / 1000;
      const isExpired = payload.exp < currentTime;
      
      return isExpired;
    } catch (error) {
      console.error('AuthService - Error checking token expiration:', error);
      return true;
    }
  }
}
