/**
 * Swipeable Card Component
 * Card with swipe actions (delete, edit, etc.)
 */

import React, { useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  PanResponder,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { theme } from '../theme';

export interface SwipeAction {
  icon: string;
  color: string;
  onPress: () => void;
  label?: string;
}

interface SwipeableCardProps {
  children: React.ReactNode;
  leftActions?: SwipeAction[];
  rightActions?: SwipeAction[];
  onPress?: () => void;
}

export default function SwipeableCard({
  children,
  leftActions = [],
  rightActions = [],
  onPress,
}: SwipeableCardProps) {
  const translateX = useRef(new Animated.Value(0)).current;
  const lastOffset = useRef(0);

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gestureState) => {
        return Math.abs(gestureState.dx) > 10;
      },
      onPanResponderMove: (_, gestureState) => {
        const newTranslateX = lastOffset.current + gestureState.dx;

        // Limit swipe distance
        const maxLeftSwipe = leftActions.length * 80;
        const maxRightSwipe = -rightActions.length * 80;

        if (newTranslateX > maxLeftSwipe) {
          translateX.setValue(maxLeftSwipe);
        } else if (newTranslateX < maxRightSwipe) {
          translateX.setValue(maxRightSwipe);
        } else {
          translateX.setValue(newTranslateX);
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        const threshold = 60;

        if (Math.abs(gestureState.dx) > threshold) {
          const direction = gestureState.dx > 0 ? 1 : -1;
          const actions = direction > 0 ? leftActions : rightActions;
          const targetValue = direction * actions.length * 80;

          lastOffset.current = targetValue;
          Animated.spring(translateX, {
            toValue: targetValue,
            useNativeDriver: true,
          }).start();
        } else {
          // Reset
          lastOffset.current = 0;
          Animated.spring(translateX, {
            toValue: 0,
            useNativeDriver: true,
          }).start();
        }
      },
    })
  ).current;

  const handleActionPress = (action: SwipeAction) => {
    action.onPress();
    // Reset swipe
    lastOffset.current = 0;
    Animated.spring(translateX, {
      toValue: 0,
      useNativeDriver: true,
    }).start();
  };

  const renderActions = (actions: SwipeAction[], isLeft: boolean) => {
    return actions.map((action, index) => (
      <TouchableOpacity
        key={index}
        style={[styles.action, { backgroundColor: action.color }]}
        onPress={() => handleActionPress(action)}
      >
        <Icon name={action.icon} size={24} color={theme.colors.white} />
        {action.label && <Text style={styles.actionLabel}>{action.label}</Text>}
      </TouchableOpacity>
    ));
  };

  return (
    <View style={styles.container}>
      {/* Left Actions */}
      {leftActions.length > 0 && (
        <View style={[styles.actionsContainer, styles.leftActions]}>
          {renderActions(leftActions, true)}
        </View>
      )}

      {/* Right Actions */}
      {rightActions.length > 0 && (
        <View style={[styles.actionsContainer, styles.rightActions]}>
          {renderActions(rightActions, false)}
        </View>
      )}

      {/* Card Content */}
      <Animated.View
        style={[
          styles.card,
          {
            transform: [{ translateX }],
          },
        ]}
        {...panResponder.panHandlers}
      >
        <TouchableOpacity
          activeOpacity={onPress ? 0.7 : 1}
          onPress={onPress}
          disabled={!onPress}
        >
          {children}
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    marginBottom: theme.spacing.md,
  },
  card: {
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.lg,
    ...theme.shadows.md,
  },
  actionsContainer: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    flexDirection: 'row',
    alignItems: 'center',
  },
  leftActions: {
    left: 0,
  },
  rightActions: {
    right: 0,
  },
  action: {
    width: 80,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionLabel: {
    color: theme.colors.white,
    fontSize: theme.typography.sizes.xs,
    fontWeight: theme.typography.weights.semibold,
    marginTop: theme.spacing.xs,
  },
});
