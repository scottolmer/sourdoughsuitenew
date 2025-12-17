/**
 * Starter Health Utility
 * Calculate health metrics and status for sourdough starters
 */

import { Starter, StarterHealthStatus, FeedingLog } from '../types';

/**
 * Calculate the next feeding due time based on last feeding and frequency
 */
export function calculateNextFeeding(
  lastFed: string,
  frequencyHours: number
): string {
  const lastFedDate = new Date(lastFed);
  const nextFeeding = new Date(
    lastFedDate.getTime() + frequencyHours * 60 * 60 * 1000
  );
  return nextFeeding.toISOString();
}

/**
 * Check if a feeding is overdue
 */
export function isFeedingOverdue(nextFeedingDue?: string): boolean {
  if (!nextFeedingDue) return false;
  return new Date(nextFeedingDue) < new Date();
}

/**
 * Get hours until next feeding (negative if overdue)
 */
export function getHoursUntilFeeding(nextFeedingDue?: string): number | null {
  if (!nextFeedingDue) return null;
  const now = new Date();
  const due = new Date(nextFeedingDue);
  const diffMs = due.getTime() - now.getTime();
  return diffMs / (1000 * 60 * 60);
}

/**
 * Calculate average rise time from recent feeding logs
 */
export function calculateAvgRiseTime(feedingLogs: FeedingLog[]): number | undefined {
  const logsWithPeakTime = feedingLogs.filter(log => log.peakTime != null);
  if (logsWithPeakTime.length === 0) return undefined;

  const total = logsWithPeakTime.reduce((sum, log) => sum + (log.peakTime || 0), 0);
  return total / logsWithPeakTime.length;
}

/**
 * Calculate average activity level from recent feeding logs
 */
export function calculateAvgActivityLevel(feedingLogs: FeedingLog[]): number | undefined {
  const logsWithActivity = feedingLogs.filter(log => log.activityLevel != null);
  if (logsWithActivity.length === 0) return undefined;

  const total = logsWithActivity.reduce((sum, log) => sum + (log.activityLevel || 0), 0);
  return total / logsWithActivity.length;
}

/**
 * Determine health status based on various factors
 */
export function calculateHealthStatus(
  starter: Starter,
  recentLogs: FeedingLog[]
): StarterHealthStatus {
  // If marked inactive, return inactive
  if (!starter.isActive) {
    return 'inactive';
  }

  // Check if overdue for feeding
  const overdue = isFeedingOverdue(starter.nextFeedingDue);
  const hoursUntilFeeding = getHoursUntilFeeding(starter.nextFeedingDue);

  // Very overdue (more than 24 hours past due)
  if (hoursUntilFeeding !== null && hoursUntilFeeding < -24) {
    return 'poor';
  }

  // Overdue but not critical
  if (overdue) {
    return 'fair';
  }

  // Check activity level from recent logs
  const avgActivity = calculateAvgActivityLevel(recentLogs);
  if (avgActivity !== undefined) {
    if (avgActivity >= 4.5) return 'excellent';
    if (avgActivity >= 3.5) return 'good';
    if (avgActivity >= 2.5) return 'fair';
    return 'poor';
  }

  // Default to good if no issues detected
  return 'good';
}

/**
 * Get a human-readable description of the health status
 */
export function getHealthStatusDescription(status: StarterHealthStatus): string {
  switch (status) {
    case 'excellent':
      return 'Very active and healthy';
    case 'good':
      return 'Healthy and active';
    case 'fair':
      return 'Needs attention';
    case 'poor':
      return 'Requires immediate feeding';
    case 'inactive':
      return 'Not currently maintained';
    default:
      return 'Unknown status';
  }
}

/**
 * Get a human-readable time until next feeding
 */
export function getNextFeedingText(nextFeedingDue?: string): string {
  if (!nextFeedingDue) return 'Not scheduled';

  const hours = getHoursUntilFeeding(nextFeedingDue);
  if (hours === null) return 'Not scheduled';

  if (hours < 0) {
    const overdueHours = Math.abs(hours);
    if (overdueHours < 1) {
      return `Overdue by ${Math.round(overdueHours * 60)} minutes`;
    }
    if (overdueHours < 24) {
      return `Overdue by ${Math.round(overdueHours)} hours`;
    }
    const overdueDays = Math.floor(overdueHours / 24);
    return `Overdue by ${overdueDays} day${overdueDays !== 1 ? 's' : ''}`;
  }

  if (hours < 1) {
    return `Due in ${Math.round(hours * 60)} minutes`;
  }
  if (hours < 24) {
    return `Due in ${Math.round(hours)} hours`;
  }
  const days = Math.floor(hours / 24);
  return `Due in ${days} day${days !== 1 ? 's' : ''}`;
}

/**
 * Get the display name for a starter type
 */
export function getStarterTypeName(type: string): string {
  const typeMap: Record<string, string> = {
    'levain': 'Levain',
    'liquid-levain': 'Liquid Levain',
    'stiff-levain': 'Stiff Levain',
    'poolish': 'Poolish',
    'biga': 'Biga',
    'pate-fermentee': 'Pâte Fermentée',
    'sourdough': 'Sourdough',
  };
  return typeMap[type] || type;
}

/**
 * Update starter health metrics based on recent feeding logs
 * Returns updated starter object
 */
export function updateStarterHealth(
  starter: Starter,
  recentLogs: FeedingLog[]
): Starter {
  const avgRiseTime = calculateAvgRiseTime(recentLogs);
  const avgActivityLevel = calculateAvgActivityLevel(recentLogs);
  const healthStatus = calculateHealthStatus(starter, recentLogs);

  return {
    ...starter,
    avgRiseTime,
    avgActivityLevel,
    healthStatus,
  };
}
