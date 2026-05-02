import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { theme } from '../theme';

export interface StageDirection {
  stage: string;
  text: string;
}

interface StageDirectionsProps {
  stages: StageDirection[];
}

export default function StageDirections({ stages }: StageDirectionsProps) {
  return (
    <View style={styles.container}>
      {stages.map((stage, index) => (
        <View key={`${stage.stage}-${index}`} style={styles.row}>
          <Text style={styles.stage}>{stage.stage}</Text>
          <Text style={styles.text}>{stage.text}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderTopWidth: 1,
    borderTopColor: theme.colors.modernist.ruleTeal,
  },
  row: {
    flexDirection: 'row',
    gap: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.modernist.hairline,
  },
  stage: {
    width: 72,
    fontFamily: theme.typography.fonts.semibold,
    fontSize: theme.typography.sizes.xs,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    color: theme.colors.modernist.ink,
  },
  text: {
    flex: 1,
    fontFamily: theme.typography.fonts.regular,
    fontSize: theme.typography.sizes.sm,
    lineHeight: 20,
    color: theme.colors.modernist.ink,
  },
});
