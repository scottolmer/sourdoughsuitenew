import React, { ReactNode } from 'react';
import { StyleSheet, View, ViewProps } from 'react-native';
import { theme } from '../theme';

interface BenchCardProps extends ViewProps {
  children: ReactNode;
  variant?: 'default' | 'filled' | 'outlined' | 'hero' | 'flat';
  padding?: keyof typeof theme.spacing;
}

export default function BenchCard({
  children,
  variant = 'default',
  padding = 'lg',
  style,
  ...props
}: BenchCardProps) {
  return (
    <View
      style={[
        styles.base,
        styles[variant],
        { padding: theme.spacing[padding] },
        style,
      ]}
      {...props}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: 24,
    borderWidth: 1,
    borderColor: theme.colors.bench.borderSoft,
  },
  default: {
    backgroundColor: theme.colors.background.paper,
    ...theme.shadows.sm,
    shadowColor: '#5A3A25',
  },
  filled: {
    backgroundColor: theme.colors.background.subtle,
    borderColor: theme.colors.bench.borderSoft,
  },
  outlined: {
    backgroundColor: 'transparent',
    borderColor: theme.colors.bench.border,
  },
  hero: {
    backgroundColor: theme.colors.background.paper,
    borderColor: theme.colors.bench.border,
    ...theme.shadows.md,
    shadowColor: '#5A3A25',
  },
  flat: {
    backgroundColor: theme.colors.background.paper,
    borderColor: theme.colors.border.light,
  },
});
