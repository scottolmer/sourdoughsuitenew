/**
 * RuleHeader
 * Uppercase section header followed by a teal hairline rule.
 * Examples: "FORMULA", "DO NOW", "FEEDING LOG".
 */

import React from 'react';
import { StyleSheet, Text, View, ViewStyle, StyleProp } from 'react-native';
import { theme } from '../theme';

interface RuleHeaderProps {
  title: string;
  trailing?: string;
  style?: StyleProp<ViewStyle>;
}

export default function RuleHeader({ title, trailing, style }: RuleHeaderProps) {
  return (
    <View style={[styles.container, style]}>
      <View style={styles.row}>
        <Text style={styles.title}>{title}</Text>
        {trailing ? <Text style={styles.trailing}>{trailing}</Text> : null}
      </View>
      <View style={styles.rule} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: theme.spacing.sm,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  title: {
    fontFamily: theme.typography.roles.bodySemibold,
    fontSize: 13,
    color: theme.colors.modernist.ink,
    letterSpacing: 0.6,
    textTransform: 'uppercase',
  },
  trailing: {
    fontFamily: theme.typography.roles.body,
    fontSize: 11,
    color: theme.colors.modernist.graphiteMuted,
    letterSpacing: 0.4,
    textTransform: 'uppercase',
  },
  rule: {
    height: 1,
    backgroundColor: theme.colors.modernist.ruleTeal,
  },
});
