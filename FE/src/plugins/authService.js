/**
 * API Service for authentication
 * Handles all API calls related to registration and login
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

class AuthService {
  // Register user
  static async register(fullName, email, password, confirmPassword) {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          fullName,
          email,
          password,
          confirmPassword
        })
      });

      const data = await response.json();
      
      if (data.success) {
        this.setToken(data.data.token);
        this.setUser(data.data.user);
      }
      
      return data;
    } catch (error) {
      console.error('Register error:', error);
      return {
        success: false,
        message: 'Không thể kết nối đến máy chủ'
      };
    }
  }

  // Login user
  static async login(email, password, rememberMe = false) {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email,
          password,
          rememberMe
        })
      });

      const data = await response.json();
      
      if (data.success) {
        this.setToken(data.data.token);
        this.setUser(data.data.user);
        
        if (rememberMe) {
          localStorage.setItem('rememberMe', 'true');
        }
      }
      
      return data;
    } catch (error) {
      console.error('Login error:', error);
      return {
        success: false,
        message: 'Không thể kết nối đến máy chủ'
      };
    }
  }

  // Logout user
  static logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('rememberMe');
  }

  // Get current user
  static getCurrentUser() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }

  // Get token
  static getToken() {
    return localStorage.getItem('token');
  }

  // Set token
  static setToken(token) {
    localStorage.setItem('token', token);
  }

  // Set user
  static setUser(user) {
    localStorage.setItem('user', JSON.stringify(user));
  }

  // Check if user is authenticated
  static isAuthenticated() {
    return !!this.getToken();
  }

  // Get authorization header
  static getAuthHeader() {
    const token = this.getToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
  }

  // Verify token with server
  static async verifyToken() {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/me`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...this.getAuthHeader()
        }
      });

      const data = await response.json();
      
      if (data.success) {
        this.setUser(data.data);
        return true;
      } else {
        this.logout();
        return false;
      }
    } catch (error) {
      console.error('Token verification error:', error);
      this.logout();
      return false;
    }
  }
}

export default AuthService;
