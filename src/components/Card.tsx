/**
 * Card Component
 */

import React, { ReactNode } from 'react';
import { View, StyleSheet, ViewProps } from 'react-native';
import { theme } from '../theme';

interface CardProps extends ViewProps {
  children: ReactNode;
  variant?: 'elevated' | 'outlined' | 'filled';
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
    borderRadius: theme.borderRadius.lg,
    backgroundColor: theme.colors.white,
  },
  elevated: {
    ...theme.shadows.md,
  },
  outlined: {
    borderWidth: 1,
    borderColor: theme.colors.border.main,
  },
  filled: {
    backgroundColor: theme.colors.background.paper,
  },
});
