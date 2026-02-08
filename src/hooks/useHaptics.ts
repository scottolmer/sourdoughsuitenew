/**
 * Haptic Feedback Hook
 * Provides easy access to haptic feedback methods
 */

import * as Haptics from 'expo-haptics';
import { useCallback } from 'react';
import { Platform } from 'react-native';

export const useHaptics = () => {
    const isAvailable = Platform.OS === 'ios' || Platform.OS === 'android';

    const light = useCallback(() => {
        if (isAvailable) {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }
    }, [isAvailable]);

    const medium = useCallback(() => {
        if (isAvailable) {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        }
    }, [isAvailable]);

    const heavy = useCallback(() => {
        if (isAvailable) {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
        }
    }, [isAvailable]);

    const success = useCallback(() => {
        if (isAvailable) {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        }
    }, [isAvailable]);

    const error = useCallback(() => {
        if (isAvailable) {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        }
    }, [isAvailable]);

    const warning = useCallback(() => {
        if (isAvailable) {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
        }
    }, [isAvailable]);

    const selection = useCallback(() => {
        if (isAvailable) {
            Haptics.selectionAsync();
        }
    }, [isAvailable]);

    return {
        light,
        medium,
        heavy,
        success,
        error,
        warning,
        selection,
    };
};
