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
        console.log('Initializing auth...');
        const token = AuthService.getToken();
        const user = AuthService.getCurrentUser();
        
        console.log('Token exists:', !!token);
        console.log('User exists:', !!user);
        
        if (token && user) {
          console.log('User found in localStorage:', user);
          
          // Check if token is expired
          if (AuthService.isTokenExpired()) {
            console.log('Token is expired, attempting refresh...');
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
              console.log('Token refreshed successfully');
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
            console.log('Token is valid, setting authenticated state');
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
              console.log('AuthContext - Fetching updated user profile...');
              const updatedUser = await AuthService.getProfile();
              console.log('AuthContext - Updated user profile:', updatedUser);
              setState(prev => ({
                ...prev,
                user: updatedUser,
              }));
              console.log('AuthContext - User profile updated successfully');
            } catch (error) {
              console.warn('AuthContext - Failed to refresh user profile:', error);
              // Don't fail the auth if profile fetch fails
            }
          }
        } else {
          console.log('No valid auth data found');
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
    console.log('AuthContext - Attempting sign in for:', email);
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      const response = await AuthService.signIn({ email, password });
      console.log('AuthContext - Sign in successful:', response);
      
      // Ensure we have all required data
      if (!response.tokens.atoken || !response.user) {
        throw new Error('Invalid response from server - missing token or user data');
      }
      
      setState(prev => ({
        ...prev,
        user: response.user,
        token: response.token,
        refreshToken: response.refreshToken,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      }));
      
      console.log('AuthContext - Auth state updated, user is now authenticated');
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
    console.log('Attempting sign up for:', email);
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      const response = await AuthService.signUp({ 
        email, 
        password, 
        firstName, 
        lastName 
      });
      console.log('Sign up successful:', response);
      
      setState(prev => ({
        ...prev,
        user: response.user,
        token: response.token,
        refreshToken: response.refreshToken,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      }));
      
      console.log('Auth state updated after sign up');
    } catch (error: any) {
      console.error('Sign up failed:', error);
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error.message || 'Sign up failed',
      }));
      throw error;
    }
  };

  const signOut = () => {
    console.log('Signing out user');
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

  console.log('Auth context state:', {
    isAuthenticated: state.isAuthenticated,
    isLoading: state.isLoading,
    hasUser: !!state.user,
    hasToken: !!state.token
  });

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
