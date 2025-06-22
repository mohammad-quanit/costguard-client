
const API_BASE_URL = process.env.VITE_API_BASE_URL || 'https://api.example.com';

export class APIClient {
  private static instance: APIClient;
  private baseURL: string;

  private constructor() {
    this.baseURL = API_BASE_URL;
  }

  public static getInstance(): APIClient {
    if (!APIClient.instance) {
      APIClient.instance = new APIClient();
    }
    return APIClient.instance;
  }

  private async request(endpoint: string, options: RequestInit = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Cost data endpoints
  async getCurrentCosts() {
    return this.request('/costs/current');
  }

  async getHistoricalCosts(period: string = '30d') {
    return this.request(`/costs/history?period=${period}`);
  }

  async getServiceBreakdown() {
    return this.request('/costs/services');
  }

  // Alert management endpoints
  async getAlerts() {
    return this.request('/alerts');
  }

  async createAlert(alertConfig: any) {
    return this.request('/alerts', {
      method: 'POST',
      body: JSON.stringify(alertConfig),
    });
  }

  async updateAlert(alertId: string, alertConfig: any) {
    return this.request(`/alerts/${alertId}`, {
      method: 'PUT',
      body: JSON.stringify(alertConfig),
    });
  }

  async deleteAlert(alertId: string) {
    return this.request(`/alerts/${alertId}`, {
      method: 'DELETE',
    });
  }

  // Notification endpoints
  async getNotificationLogs() {
    return this.request('/notifications/logs');
  }

  async testNotification(channel: string, config: any) {
    return this.request('/notifications/test', {
      method: 'POST',
      body: JSON.stringify({ channel, config }),
    });
  }
}

export const apiClient = APIClient.getInstance();
