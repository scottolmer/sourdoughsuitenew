import React from 'react';
import { StyleSheet, Text, View, ViewStyle } from 'react-native';
import { theme } from '../theme';

interface RuleHeaderProps {
  title: string;
  meta?: string;
  style?: ViewStyle;
}

export default function RuleHeader({ title, meta, style }: RuleHeaderProps) {
  return (
    <View style={[styles.container, style]}>
      <Text style={styles.title}>{title}</Text>
      <View style={styles.rule} />
      {meta ? <Text style={styles.meta}>{meta}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.sm,
  },
  title: {
    fontFamily: theme.typography.fonts.semibold,
    fontSize: theme.typography.sizes.xs,
    letterSpacing: 0.6,
    color: theme.colors.modernist.ink,
    textTransform: 'uppercase',
  },
  rule: {
    flex: 1,
    height: 1,
    backgroundColor: theme.colors.modernist.ruleTeal,
  },
  meta: {
    fontFamily: theme.typography.fonts.medium,
    fontSize: theme.typography.sizes.xs,
    color: theme.colors.modernist.graphiteMuted,
  },
});
