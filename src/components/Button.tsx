/**
 * Custom Button Component
 */

import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacityProps,
  View,
} from 'react-native';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import { theme } from '../theme';
import type { MaterialCommunityIconName } from '../types/icons';

import { useHaptics } from '../hooks/useHaptics';

interface ButtonProps extends TouchableOpacityProps {
  title: string;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'small' | 'medium' | 'large';
  loading?: boolean;
  fullWidth?: boolean;
  leftIcon?: string;
  rightIcon?: string;
}

export default function Button({
  title,
  variant = 'primary',
  size = 'medium',
  loading = false,
  fullWidth = false,
  leftIcon,
  rightIcon,
  disabled,
  style,
  onPress,
  ...props
}: ButtonProps) {
  const haptics = useHaptics();

  const handlePress = (e: any) => {
    if (disabled || loading) return;
    haptics.light();
    onPress?.(e);
  };

  const buttonStyles = [
    styles.button,
    styles[variant],
    styles[size],
    fullWidth && styles.fullWidth,
    disabled && styles.disabled,
    style,
  ];

  const textStyles = [
    styles.text,
    styles[`${variant}Text`],
    styles[`${size}Text`],
  ];

  const iconColor =
    variant === 'outline' || variant === 'ghost'
      ? theme.colors.modernist.ink
      : theme.colors.white;

  const iconSize = size === 'small' ? 16 : size === 'large' ? 24 : 20;

  return (
    <TouchableOpacity
      style={buttonStyles}
      disabled={disabled || loading}
      activeOpacity={0.7}
      onPress={handlePress}
      {...props}
    >
      {loading ? (
        <ActivityIndicator color={iconColor} />
      ) : (
        <View style={styles.content}>
          {leftIcon && (
            <Icon
              name={(leftIcon as unknown) as MaterialCommunityIconName}
              size={iconSize}
              color={iconColor}
              style={styles.leftIcon}
            />
          )}
          <Text style={textStyles}>{title}</Text>
          {rightIcon && (
            <Icon
              name={(rightIcon as unknown) as MaterialCommunityIconName}
              size={iconSize}
              color={iconColor}
              style={styles.rightIcon}
            />
          )}
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: theme.borderRadius.xl,
  },

  // Variants — Modernist: sharp radii, hairline borders, no heavy shadows.
  primary: {
    backgroundColor: theme.colors.modernist.copper,
    borderRadius: 8,
  },
  secondary: {
    backgroundColor: theme.colors.modernist.ink,
    borderRadius: 8,
  },
  outline: {
    backgroundColor: theme.colors.modernist.paper,
    borderWidth: 1,
    borderColor: theme.colors.modernist.ink,
    borderRadius: 8,
  },
  ghost: {
    backgroundColor: 'transparent',
    borderRadius: 8,
  },

  // Sizes
  small: {
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.sm,
    minHeight: 40,
  },
  medium: {
    paddingHorizontal: theme.spacing.xl,
    paddingVertical: theme.spacing.md,
    minHeight: 50,
  },
  large: {
    paddingHorizontal: theme.spacing['2xl'],
    paddingVertical: theme.spacing.lg,
    minHeight: 56,
  },

  fullWidth: {
    width: '100%',
  },

  disabled: {
    opacity: 0.5,
  },

  // Text styles
  text: {
    fontFamily: theme.typography.fonts.semibold,
    fontWeight: theme.typography.weights.semibold,
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  primaryText: {
    color: theme.colors.white,
    fontSize: theme.typography.sizes.base,
  },
  secondaryText: {
    color: theme.colors.white,
    fontSize: theme.typography.sizes.base,
  },
  outlineText: {
    color: theme.colors.modernist.ink,
    fontSize: theme.typography.sizes.base,
  },
  ghostText: {
    color: theme.colors.modernist.ink,
    fontSize: theme.typography.sizes.base,
  },

  smallText: {
    fontSize: theme.typography.sizes.sm,
  },
  mediumText: {
    fontSize: theme.typography.sizes.base,
  },
  largeText: {
    fontSize: theme.typography.sizes.lg,
  },

  // Icon and content styles
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  leftIcon: {
    marginRight: theme.spacing.sm,
  },
  rightIcon: {
    marginLeft: theme.spacing.sm,
  },
});
