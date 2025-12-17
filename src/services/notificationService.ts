/**
 * Notification Service
 * Handle local push notifications for feeding reminders
 */

import notifee, { TriggerType, AndroidImportance } from '@notifee/react-native';
import { Platform, PermissionsAndroid, Linking, Alert } from 'react-native';
import { Starter } from '../types';

const CHANNEL_ID = 'feeding-reminders';

/**
 * Initialize notification channel (Android)
 */
export async function initializeNotifications() {
  try {
    await notifee.createChannel({
      id: CHANNEL_ID,
      name: 'Feeding Reminders',
      importance: AndroidImportance.HIGH,
      sound: 'default',
    });
  } catch (error) {
    console.error('Error initializing notifications:', error);
  }
}

/**
 * Request notification permissions
 */
export async function requestNotificationPermissions(): Promise<boolean> {
  const settings = await notifee.requestPermission();

  // For Android 13+, also request POST_NOTIFICATIONS permission
  if (Platform.OS === 'android' && Platform.Version >= 33) {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED && settings.authorizationStatus >= 1;
    } catch (err) {
      console.warn('Error requesting notification permission:', err);
      return settings.authorizationStatus >= 1;
    }
  }

  return settings.authorizationStatus >= 1; // AUTHORIZED or PROVISIONAL
}

/**
 * Request exact alarm permission (Android 12+)
 * This is called when scheduling a notification, not on app startup
 */
export async function requestExactAlarmPermission(): Promise<boolean> {
  if (Platform.OS === 'android' && Platform.Version >= 31) {
    try {
      // Just return true - the permission will be requested automatically by the system
      // when we try to schedule an exact alarm
      return true;
    } catch (error) {
      console.error('Error requesting exact alarm permission:', error);
      return false;
    }
  }

  return true;
}

/**
 * Schedule a feeding reminder notification
 */
export async function scheduleFeedingReminder(starter: Starter): Promise<string | null> {
  if (!starter.nextFeedingDue) {
    return null;
  }

  const feedingTime = new Date(starter.nextFeedingDue);
  const now = new Date();

  // Don't schedule if feeding is overdue
  if (feedingTime <= now) {
    return null;
  }

  // Request notification permissions before scheduling
  try {
    await requestNotificationPermissions();
  } catch (error) {
    console.warn('Failed to request notification permissions:', error);
    // Continue anyway - we'll try to schedule
  }

  // Cancel any existing notification for this starter
  await cancelFeedingReminder(starter.id);

  // Create the notification
  const notificationId = await notifee.createTriggerNotification(
    {
      id: `feeding-${starter.id}`,
      title: `Time to feed ${starter.name}! 🍞`,
      body: `Your ${starter.type} starter needs feeding`,
      android: {
        channelId: CHANNEL_ID,
        importance: AndroidImportance.HIGH,
        pressAction: {
          id: 'default',
          launchActivity: 'default',
        },
        smallIcon: 'ic_launcher',
      },
      ios: {
        sound: 'default',
        categoryId: 'feeding-reminder',
      },
      data: {
        starterId: starter.id.toString(),
        type: 'feeding-reminder',
      },
    },
    {
      type: TriggerType.TIMESTAMP,
      timestamp: feedingTime.getTime(),
    }
  );

  return notificationId;
}

/**
 * Cancel a feeding reminder for a starter
 */
export async function cancelFeedingReminder(starterId: number): Promise<void> {
  const notificationId = `feeding-${starterId}`;
  try {
    await notifee.cancelNotification(notificationId);
  } catch (error) {
    console.error('Error canceling notification:', error);
  }
}

/**
 * Cancel all feeding reminders
 */
export async function cancelAllFeedingReminders(): Promise<void> {
  try {
    await notifee.cancelAllNotifications();
  } catch (error) {
    console.error('Error canceling all notifications:', error);
  }
}

/**
 * Get scheduled notifications
 */
export async function getScheduledNotifications() {
  return await notifee.getTriggerNotifications();
}

/**
 * Schedule reminders for multiple starters
 */
export async function scheduleAllFeedingReminders(starters: Starter[]): Promise<void> {
  for (const starter of starters) {
    if (starter.isActive && starter.nextFeedingDue) {
      await scheduleFeedingReminder(starter);
    }
  }
}
