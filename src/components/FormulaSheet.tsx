/**
 * FormulaSheet
 * Flat sheet with thin border and optional top teal rule.
 * The base unit of the Modernist redesign — replaces bulky rounded cards.
 */

import React, { ReactNode } from 'react';
import { StyleSheet, View, ViewStyle, StyleProp } from 'react-native';
import { theme } from '../theme';

interface FormulaSheetProps {
  children: ReactNode;
  topRule?: boolean;
  accented?: boolean;
  background?: 'paper' | 'porcelain' | 'paperWarm';
  padding?: keyof typeof theme.spacing;
  radius?: number;
  style?: StyleProp<ViewStyle>;
}

export default function FormulaSheet({
  children,
  topRule = false,
  accented = false,
  background = 'porcelain',
  padding = 'lg',
  radius = 10,
  style,
}: FormulaSheetProps) {
  return (
    <View
      style={[
        styles.sheet,
        {
          backgroundColor: theme.colors.modernist[background],
          borderRadius: radius,
          padding: theme.spacing[padding],
        },
        style,
      ]}
    >
      {topRule || accented ? <View style={styles.topRule} /> : null}
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  sheet: {
    borderWidth: 1,
    borderColor: theme.colors.modernist.hairline,
    overflow: 'hidden',
  },
  topRule: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: theme.colors.modernist.ruleTeal,
  },
});
