/**
 * StageDirections
 * Two-column layout: narrow left column for stage labels (MIX, BULK, DIVIDE,
 * SHAPE, PROOF, BAKE) and a right column for procedure text.
 */

import React from 'react';
import { StyleSheet, Text, View, ViewStyle, StyleProp } from 'react-native';
import { theme } from '../theme';

export interface StageDirection {
  stage: string;
  text: string;
  detail?: string;
  duration?: string;
}

interface StageDirectionsProps {
  directions: StageDirection[];
  style?: StyleProp<ViewStyle>;
}

export default function StageDirections({ directions, style }: StageDirectionsProps) {
  return (
    <View style={[styles.container, style]}>
      {directions.map((d, idx) => {
        const isLast = idx === directions.length - 1;
        return (
          <View
            key={`${d.stage}-${idx}`}
            style={[styles.row, isLast && styles.rowLast]}
          >
            <View style={styles.stageCol}>
              <Text style={styles.stageLabel}>{d.stage}</Text>
              {d.duration ? <Text style={styles.duration}>{d.duration}</Text> : null}
            </View>
            <View style={styles.textCol}>
              <Text style={styles.text}>{d.text}</Text>
              {d.detail ? <Text style={styles.detail}>{d.detail}</Text> : null}
            </View>
          </View>
        );
      })}
    </View>
  );
}

const STAGE_COL_WIDTH = 80;

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: theme.spacing.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: theme.colors.modernist.hairline,
  },
  rowLast: {
    borderBottomWidth: 0,
  },
  stageCol: {
    width: STAGE_COL_WIDTH,
    paddingRight: theme.spacing.md,
  },
  stageLabel: {
    fontFamily: theme.typography.roles.bodyBold,
    fontSize: 12,
    color: theme.colors.modernist.ink,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
  duration: {
    fontFamily: theme.typography.roles.body,
    fontSize: 11,
    color: theme.colors.modernist.graphiteMuted,
    letterSpacing: 0.4,
    marginTop: 2,
    fontVariant: ['tabular-nums'],
  },
  textCol: {
    flex: 1,
  },
  text: {
    fontFamily: theme.typography.roles.body,
    fontSize: 15,
    color: theme.colors.modernist.graphite,
    lineHeight: 22,
  },
  detail: {
    fontFamily: theme.typography.roles.body,
    fontSize: 13,
    color: theme.colors.modernist.graphiteMuted,
    marginTop: 4,
    lineHeight: 18,
  },
});
