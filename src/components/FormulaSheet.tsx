import React, { ReactNode } from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { theme } from '../theme';

interface FormulaSheetProps {
  children: ReactNode;
  style?: ViewStyle;
  accented?: boolean;
}

export default function FormulaSheet({
  children,
  style,
  accented = false,
}: FormulaSheetProps) {
  return (
    <View style={[styles.sheet, accented && styles.accented, style]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  sheet: {
    backgroundColor: theme.colors.modernist.porcelain,
    borderWidth: 1,
    borderColor: theme.colors.modernist.hairline,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
  },
  accented: {
    borderTopWidth: 3,
    borderTopColor: theme.colors.modernist.ruleTeal,
  },
});
