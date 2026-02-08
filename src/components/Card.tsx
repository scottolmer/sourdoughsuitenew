/**
 * Card Component
 * Premium Artisan Style - Soft shadows, rounded corners, and glass effects
 */

import React, { ReactNode } from 'react';
import { View, StyleSheet, ViewProps, Platform } from 'react-native';
import { theme } from '../theme';

interface CardProps extends ViewProps {
  children: ReactNode;
  variant?: 'elevated' | 'outlined' | 'filled' | 'glass';
  padding?: keyof typeof theme.spacing;
}

export default function Card({
  children,
  variant = 'elevated',
  padding = 'md',
  style,
  ...props
}: CardProps) {
  const cardStyles = [
    styles.card,
    styles[variant],
    { padding: theme.spacing[padding] },
    style,
  ];

  return (
    <View style={cardStyles} {...props}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: theme.borderRadius.xl, // Smoother corners
  },
  elevated: {
    backgroundColor: theme.colors.white,
    ...theme.shadows.sm, // Softer shadow
    borderWidth: 1,
    borderColor: theme.colors.border.light,
  },
  outlined: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: theme.colors.border.main,
  },
  filled: {
    backgroundColor: theme.colors.cardBg.neutral,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  glass: {
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.4)',
    ...theme.shadows.sm,
  },
});
