import React, { createContext, useContext, useEffect, useState } from 'react';
import { AuthState, User } from '@/types/auth';
import { AuthService } from '@/services/authService';

interface AuthContextType extends AuthState {
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, firstName?: string, lastName?: string) => Promise<void>;
  signOut: () => void;
  refreshToken: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [state, setState] = useState<AuthState>({
    user: null,
    token: null,
    refreshToken: null,
    isAuthenticated: false,
    isLoading: true,
    error: null,
  });

  // Initialize auth state from localStorage
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const token = AuthService.getToken();
        const user = AuthService.getCurrentUser();
        
        if (token && user) {
          // Check if token is expired
          if (AuthService.isTokenExpired()) {
            try {
              await AuthService.refreshToken();
              const refreshedUser = AuthService.getCurrentUser();
              const newToken = AuthService.getToken();
              
              setState(prev => ({
                ...prev,
                user: refreshedUser,
                token: newToken,
                refreshToken: localStorage.getItem('refreshToken'),
                isAuthenticated: true,
                isLoading: false,
                error: null,
              }));
            } catch (error) {
              console.error('Token refresh failed:', error);
              AuthService.signOut();
              setState(prev => ({
                ...prev,
                user: null,
                token: null,
                refreshToken: null,
                isAuthenticated: false,
                isLoading: false,
                error: null,
              }));
            }
          } else {
            setState(prev => ({
              ...prev,
              user,
              token,
              refreshToken: localStorage.getItem('refreshToken'),
              isAuthenticated: true,
              isLoading: false,
              error: null,
            }));
            
            // Try to refresh user profile in background
            try {
              const updatedUser = await AuthService.getProfile();
              setState(prev => ({
                ...prev,
                user: updatedUser,
              }));
            } catch (error) {
              console.warn('AuthContext - Failed to refresh user profile:', error);
              // Don't fail the auth if profile fetch fails
            }
          }
        } else {
          setState(prev => ({
            ...prev,
            isLoading: false,
          }));
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        setState(prev => ({
          ...prev,
          isLoading: false,
          error: 'Failed to initialize authentication',
        }));
      }
    };

    initializeAuth();
  }, []);

  const signIn = async (email: string, password: string) => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      const response = await AuthService.signIn({ email, password });
      
      // Check the actual response structure from your API
      const hasValidTokens = response.tokens && response.tokens.accessToken;
      const hasValidUser = response.user && (response.user.userId || response.user.email);
      
      if (!hasValidTokens || !hasValidUser) {
        console.error('AuthContext - Invalid response structure:', {
          hasTokens: !!response.tokens,
          hasAccessToken: !!(response.tokens && response.tokens.accessToken),
          hasUser: !!response.user,
          hasUserId: !!(response.user && response.user.userId),
          hasUserEmail: !!(response.user && response.user.email),
          actualResponse: response
        });
        throw new Error('Invalid response from server - missing token or user data');
      }
      
      setState(prev => ({
        ...prev,
        user: response.user,
        token: response.tokens.accessToken,
        refreshToken: response.tokens.refreshToken,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      }));
      
    } catch (error: any) {
      console.error('AuthContext - Sign in failed:', error);
      setState(prev => ({
        ...prev,
        user: null,
        token: null,
        refreshToken: null,
        isAuthenticated: false,
        isLoading: false,
        error: error.message || 'Sign in failed',
      }));
      throw error;
    }
  };

  const signUp = async (email: string, password: string, firstName?: string, lastName?: string) => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      const response = await AuthService.signUp({ 
        email, 
        password, 
        firstName, 
        lastName 
      });
      
      // Check the actual response structure from your API
      const hasValidTokens = response.tokens && response.tokens.accessToken;
      const hasValidUser = response.user && (response.user.userId || response.user.email);
      
      if (!hasValidTokens || !hasValidUser) {
        console.error('AuthContext - Invalid signup response structure:', {
          hasTokens: !!response.tokens,
          hasAccessToken: !!(response.tokens && response.tokens.accessToken),
          hasUser: !!response.user,
          actualResponse: response
        });
        throw new Error('Invalid response from server - missing token or user data');
      }
      
      setState(prev => ({
        ...prev,
        user: response.user,
        token: response.tokens.accessToken,
        refreshToken: response.tokens.refreshToken,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      }));
      
    } catch (error: any) {
      console.error('AuthContext - Sign up failed:', error);
      setState(prev => ({
        ...prev,
        user: null,
        token: null,
        refreshToken: null,
        isAuthenticated: false,
        isLoading: false,
        error: error.message || 'Sign up failed',
      }));
      throw error;
    }
  };

  const signOut = () => {
    setState({
      user: null,
      token: null,
      refreshToken: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
    });
    AuthService.signOut();
  };

  const refreshToken = async () => {
    try {
      const response = await AuthService.refreshToken();
      setState(prev => ({
        ...prev,
        token: response.token,
      }));
    } catch (error: any) {
      console.error('Token refresh failed:', error);
      setState(prev => ({
        ...prev,
        error: error.message || 'Token refresh failed',
      }));
      signOut();
      throw error;
    }
  };

  const value: AuthContextType = {
    ...state,
    signIn,
    signUp,
    signOut,
    refreshToken,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
