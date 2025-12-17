/**
 * Feeding Log Local Storage Service
 * Stores feeding logs locally using AsyncStorage
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { FeedingLog } from '../types';

const FEEDING_LOGS_KEY = '@sourdough_feeding_logs';

export const feedingLogStorage = {
  // Get all feeding logs
  async getAll(): Promise<FeedingLog[]> {
    try {
      const logsJson = await AsyncStorage.getItem(FEEDING_LOGS_KEY);
      return logsJson ? JSON.parse(logsJson) : [];
    } catch (error) {
      console.error('Error loading feeding logs:', error);
      return [];
    }
  },

  // Get feeding logs for a specific starter
  async getByStarterId(starterId: number): Promise<FeedingLog[]> {
    try {
      const allLogs = await this.getAll();
      return allLogs.filter(log => log.starterId === starterId);
    } catch (error) {
      console.error('Error loading feeding logs for starter:', error);
      return [];
    }
  },

  // Get feeding log by ID
  async getById(id: number): Promise<FeedingLog | null> {
    try {
      const logs = await this.getAll();
      return logs.find(log => log.id === id) || null;
    } catch (error) {
      console.error('Error loading feeding log:', error);
      return null;
    }
  },

  // Create new feeding log
  async create(log: Omit<FeedingLog, 'id' | 'createdAt'>): Promise<FeedingLog> {
    try {
      const logs = await this.getAll();
      const newLog: FeedingLog = {
        ...log,
        id: Date.now(),
        createdAt: new Date().toISOString(),
      };
      logs.push(newLog);
      await AsyncStorage.setItem(FEEDING_LOGS_KEY, JSON.stringify(logs));
      return newLog;
    } catch (error) {
      console.error('Error creating feeding log:', error);
      throw error;
    }
  },

  // Update feeding log
  async update(id: number, updates: Partial<FeedingLog>): Promise<FeedingLog | null> {
    try {
      const logs = await this.getAll();
      const index = logs.findIndex(log => log.id === id);
      if (index === -1) return null;

      logs[index] = {
        ...logs[index],
        ...updates,
        id, // Ensure ID doesn't change
      };

      await AsyncStorage.setItem(FEEDING_LOGS_KEY, JSON.stringify(logs));
      return logs[index];
    } catch (error) {
      console.error('Error updating feeding log:', error);
      throw error;
    }
  },

  // Delete feeding log
  async delete(id: number): Promise<boolean> {
    try {
      const logs = await this.getAll();
      const filtered = logs.filter(log => log.id !== id);
      await AsyncStorage.setItem(FEEDING_LOGS_KEY, JSON.stringify(filtered));
      return true;
    } catch (error) {
      console.error('Error deleting feeding log:', error);
      return false;
    }
  },

  // Delete all logs for a starter
  async deleteByStarterId(starterId: number): Promise<boolean> {
    try {
      const logs = await this.getAll();
      const filtered = logs.filter(log => log.starterId !== starterId);
      await AsyncStorage.setItem(FEEDING_LOGS_KEY, JSON.stringify(filtered));
      return true;
    } catch (error) {
      console.error('Error deleting feeding logs for starter:', error);
      return false;
    }
  },

  // Clear all feeding logs (for testing)
  async clearAll(): Promise<void> {
    try {
      await AsyncStorage.removeItem(FEEDING_LOGS_KEY);
    } catch (error) {
      console.error('Error clearing feeding logs:', error);
    }
  },
};
