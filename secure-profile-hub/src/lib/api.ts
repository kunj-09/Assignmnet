const API_BASE_URL = 'http://localhost:8000/api/auth';

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  aadhaar: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  aadhaar: string;
  createdAt?: string;
}

export interface AuthResponse {
  token: string;
  user?: User;
  message?: string;
}

export interface ApiError {
  message: string;
  errors?: Record<string, string[]>;
}

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    
    const config: RequestInit = {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        ...options.headers,
      },
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        const error: ApiError = {
          message: data.message || data.error || 'An error occurred',
          errors: data.errors,
        };
        throw error;
      }

      return data;
    } catch (error) {
      if ((error as ApiError).message) {
        throw error;
      }
      throw {
        message: 'Network error. Please check your connection and try again.',
      } as ApiError;
    }
  }

  async register(data: RegisterData): Promise<AuthResponse> {
    return this.request<AuthResponse>('/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async login(data: LoginData): Promise<AuthResponse> {
    return this.request<AuthResponse>('/login', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getProfile(token: string): Promise<User> {
    return this.request<User>('/profile', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
  }
}

export const api = new ApiClient(API_BASE_URL);
