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
    borderRadius: theme.borderRadius.lg,
  },
  elevated: {
    backgroundColor: theme.colors.modernist.porcelain,
    borderWidth: 1,
    borderColor: theme.colors.modernist.hairline,
  },
  outlined: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: theme.colors.modernist.hairlineDark,
  },
  filled: {
    backgroundColor: theme.colors.modernist.paperWarm,
    borderWidth: 1,
    borderColor: theme.colors.modernist.hairline,
  },
  glass: {
    backgroundColor: theme.colors.modernist.porcelain,
    borderWidth: 1,
    borderColor: theme.colors.modernist.hairline,
  },
});
