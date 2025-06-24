/* eslint-disable @typescript-eslint/no-explicit-any */
// API Configuration
const API_BASE_URL = import.meta.env.DEV
  ? '/api' // Use proxy in development
  : 'https://dl6q0k9s90.execute-api.us-east-1.amazonaws.com/dev'; // Direct API in production

// API Client class for handling requests
class ApiClient {
  private baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    
    // Get token from localStorage for authenticated requests
    const token = localStorage.getItem('authToken');
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    };

    try {
      console.log(`Making API request to: ${url}`);
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error(`HTTP error! status: ${response.status}, body: ${errorText}`);
        
        // Handle 401 Unauthorized - token might be expired
        if (response.status === 401) {
          localStorage.removeItem('authToken');
          localStorage.removeItem('refreshToken');
          localStorage.removeItem('user');
          // Redirect to login if not already there
          if (!window.location.pathname.includes('/login')) {
            window.location.href = '/login';
          }
        }
        
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('API response received:', data);
      return data;
    } catch (error) {
      console.error(`API request failed for ${endpoint}:`, error);
      
      // Check if it's a CORS error
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new Error('Network error: Please check your internet connection or try again later.');
      }
      
      throw error;
    }
  }

  async get<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'GET' });
  }

  async post<T>(endpoint: string, data: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async put<T>(endpoint: string, data: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }
}

// Create and export the API client instance
export const apiClient = new ApiClient(API_BASE_URL);

// API Endpoints
export const API_ENDPOINTS = {
  // Cost endpoints
  COST_USAGE: '/cost-usage',
  
  // Auth endpoints
  AUTH_SIGNUP: '/auth/signup',
  AUTH_SIGNIN: '/auth/signin',
  AUTH_REFRESH: '/auth/refresh',
  AUTH_PROFILE: '/auth/profile',
  
  // Budget endpoints
  BUDGET_GET: '/budget',
  BUDGET_SET: '/budget/set',
} as const;
