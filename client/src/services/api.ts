const API_BASE_URL = 'http://localhost:5000/api';

class ApiService {
  private getHeaders() {
    const token = localStorage.getItem('token');
    console.log('API Request - Token:', token ? 'Present' : 'Missing');
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  }

  private async request(endpoint: string, options: RequestInit = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const config = {
      headers: this.getHeaders(),
      ...options,
    };

    console.log(`API Request: ${options.method || 'GET'} ${url}`);

    const response = await fetch(url, config);
    
    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Network error' }));
      console.error(`API Error (${response.status}):`, error);
      throw new Error(error.message || 'Something went wrong');
    }

    return response.json();
  }

  // Auth endpoints
  async login(email: string, password: string) {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  async register(userData: any) {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async updateLocation(location: { latitude: number; longitude: number }) {
    return this.request('/auth/location', {
      method: 'PUT',
      body: JSON.stringify({ location }),
    });
  }

  async updateAvailability(isAvailable: boolean) {
    return this.request('/auth/availability', {
      method: 'PUT',
      body: JSON.stringify({ isAvailable }),
    });
  }

  // User endpoints
  async getUserProfile() {
    return this.request('/users/me');
  }

  // Laborer endpoints
  async getNearbyLaborers(latitude: number, longitude: number, radius: number = 10) {
    return this.request(`/laborers/nearby?latitude=${latitude}&longitude=${longitude}&radius=${radius}`);
  }

  async getLaborerProfile(laborerId: string) {
    return this.request(`/laborers/${laborerId}`);
  }

  async updateLaborerProfile(profileData: any) {
    return this.request('/laborers/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData),
    });
  }

  // Request endpoints
  async createRequest(requestData: any) {
    return this.request('/requests', {
      method: 'POST',
      body: JSON.stringify(requestData),
    });
  }

  async getRequests(status?: string) {
    const endpoint = status ? `/requests?status=${status}` : '/requests';
    return this.request(endpoint);
  }

  async getRequest(requestId: string) {
    return this.request(`/requests/${requestId}`);
  }

  async updateRequestStatus(requestId: string, status: string) {
    return this.request(`/requests/${requestId}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    });
  }

  async getRequestStats() {
    return this.request('/requests/stats/overview');
  }

  // Get current location
  async getCurrentLocation(): Promise<{ latitude: number; longitude: number }> {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported by this browser'));
        return;
      }

      const options = {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      };

      navigator.geolocation.getCurrentPosition(
        (position) => {
          console.log('Location obtained:', {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy
          });
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        (error) => {
          console.error('Geolocation error:', error);
          let errorMessage = 'Unable to retrieve your location';
          
          switch (error.code) {
            case error.PERMISSION_DENIED:
              errorMessage = 'Location access denied. Please enable location permissions.';
              break;
            case error.POSITION_UNAVAILABLE:
              errorMessage = 'Location information unavailable.';
              break;
            case error.TIMEOUT:
              errorMessage = 'Location request timed out. Please try again.';
              break;
          }
          
          reject(new Error(errorMessage));
        },
        options
      );
    });
  }
}

export const api = new ApiService(); 