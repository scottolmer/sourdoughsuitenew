/**
 * Floating Action Button Component
 */

import React from 'react';
import {
  TouchableOpacity,
  StyleSheet,
  ViewStyle,
  Animated,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { theme } from '../theme';

interface FloatingActionButtonProps {
  icon: string;
  onPress: () => void;
  style?: ViewStyle;
  color?: string;
  size?: 'small' | 'medium' | 'large';
}

export default function FloatingActionButton({
  icon,
  onPress,
  style,
  color = theme.colors.primary[500],
  size = 'medium',
}: FloatingActionButtonProps) {
  const scaleValue = new Animated.Value(1);

  const handlePressIn = () => {
    Animated.spring(scaleValue, {
      toValue: 0.9,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleValue, {
      toValue: 1,
      friction: 3,
      tension: 40,
      useNativeDriver: true,
    }).start();
  };

  const sizeMap = {
    small: 48,
    medium: 56,
    large: 64,
  };

  const iconSizeMap = {
    small: 20,
    medium: 24,
    large: 28,
  };

  const fabSize = sizeMap[size];
  const iconSize = iconSizeMap[size];

  return (
    <Animated.View
      style={[
        styles.container,
        {
          transform: [{ scale: scaleValue }],
        },
        style,
      ]}
    >
      <TouchableOpacity
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={0.9}
        style={[
          styles.fab,
          {
            backgroundColor: color,
            width: fabSize,
            height: fabSize,
            borderRadius: fabSize / 2,
          },
        ]}
      >
        <Icon name={icon} size={iconSize} color={theme.colors.white} />
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    zIndex: 1000,
  },
  fab: {
    justifyContent: 'center',
    alignItems: 'center',
    ...theme.shadows.lg,
  },
});
