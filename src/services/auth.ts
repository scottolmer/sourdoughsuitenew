/**
 * Authentication Service
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { api } from './api';
import { API_ENDPOINTS, STORAGE_KEYS } from '../constants';
import { User, ApiResponse } from '../types';

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
}

export const authService = {
  /**
   * Login user
   */
  async login(credentials: LoginCredentials): Promise<User> {
    const response = await api.post<any>(
      API_ENDPOINTS.AUTH.LOGIN,
      credentials
    );

    if (response.user) {
      // Store user data
      await AsyncStorage.setItem(
        STORAGE_KEYS.USER_DATA,
        JSON.stringify(response.user)
      );

      // Store token if provided
      if (response.token) {
        await AsyncStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, response.token);
      }

      return response.user;
    }

    throw new Error('Login failed');
  },

  /**
   * Register new user
   */
  async register(data: RegisterData): Promise<User> {
    const response = await api.post<any>(
      API_ENDPOINTS.AUTH.REGISTER,
      data
    );

    if (response.user) {
      // Store user data
      await AsyncStorage.setItem(
        STORAGE_KEYS.USER_DATA,
        JSON.stringify(response.user)
      );

      // Store token if provided
      if (response.token) {
        await AsyncStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, response.token);
      }

      return response.user;
    }

    throw new Error('Registration failed');
  },

  /**
   * Logout user
   */
  async logout(): Promise<void> {
    try {
      await api.post(API_ENDPOINTS.AUTH.LOGOUT);
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clear local storage regardless of API call success
      await AsyncStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
      await AsyncStorage.removeItem(STORAGE_KEYS.USER_DATA);
    }
  },

  /**
   * Get current user
   */
  async getCurrentUser(): Promise<User | null> {
    try {
      // First check local storage
      const userData = await AsyncStorage.getItem(STORAGE_KEYS.USER_DATA);
      if (userData) {
        const user = JSON.parse(userData);

        // Verify with server
        try {
          const response = await api.get<any>(API_ENDPOINTS.AUTH.ME);
          if (response.user || response) {
            const userData = response.user || response;
            // Update local storage with fresh data
            await AsyncStorage.setItem(
              STORAGE_KEYS.USER_DATA,
              JSON.stringify(userData)
            );
            return userData;
          }
        } catch (error) {
          // If server verification fails, clear local data
          await AsyncStorage.removeItem(STORAGE_KEYS.USER_DATA);
          await AsyncStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
          return null;
        }

        return user;
      }
      return null;
    } catch (error) {
      console.error('Get current user error:', error);
      return null;
    }
  },

  /**
   * Update user profile
   */
  async updateProfile(data: Partial<User>): Promise<User> {
    const response = await api.put<any>(
      API_ENDPOINTS.AUTH.PROFILE,
      data
    );

    if (response.user || response) {
      const userData = response.user || response;
      // Update local storage
      await AsyncStorage.setItem(
        STORAGE_KEYS.USER_DATA,
        JSON.stringify(userData)
      );
      return userData;
    }

    throw new Error('Profile update failed');
  },

  /**
   * Check if user is authenticated
   */
  async isAuthenticated(): Promise<boolean> {
    const token = await AsyncStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
    const userData = await AsyncStorage.getItem(STORAGE_KEYS.USER_DATA);
    return !!(token || userData);
  },
};
