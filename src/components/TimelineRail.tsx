/**
 * TimelineRail
 * Vertical timeline in the Modernist style.
 * - Thin teal rail
 * - Small circular nodes
 * - Compact time label
 * - Bold task name
 * - Optional note line below
 *
 * Status color is applied only when meaningful (active, past).
 */

import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import { theme } from '../theme';
import type { MaterialCommunityIconName } from '../types/icons';

export type TimelineStepState = 'past' | 'active' | 'upcoming';

export interface TimelineStep {
  id: string;
  icon: MaterialCommunityIconName;
  timeLabel: string;
  title: string;
  notes?: string;
  state?: TimelineStepState;
}

interface TimelineRailProps {
  steps?: TimelineStep[];
  items?: Array<{
    id: string;
    time: string;
    title: string;
    notes?: string;
    tone?: string;
  }>;
}

const NODE_SIZE = 14;
const RAIL_WIDTH = 1;
const LEFT_COL_WIDTH = 28;

const nodeFill: Record<TimelineStepState, string> = {
  active: theme.colors.primary[600],
  past: theme.colors.modernist.ruleTeal,
  upcoming: theme.colors.modernist.paper,
};

const nodeBorder: Record<TimelineStepState, string> = {
  active: theme.colors.primary[600],
  past: theme.colors.modernist.ruleTeal,
  upcoming: theme.colors.modernist.hairlineDark,
};

const titleColor: Record<TimelineStepState, string> = {
  active: theme.colors.modernist.ink,
  past: theme.colors.modernist.graphiteMuted,
  upcoming: theme.colors.modernist.ink,
};

const timeColor: Record<TimelineStepState, string> = {
  active: theme.colors.primary[600],
  past: theme.colors.modernist.graphiteMuted,
  upcoming: theme.colors.modernist.graphiteMuted,
};

export default function TimelineRail({ steps, items }: TimelineRailProps) {
  const timelineSteps: TimelineStep[] = steps ?? (items ?? []).map((item, index) => ({
    id: item.id,
    icon: index === 0 ? 'play-circle-outline' : 'clock-outline',
    timeLabel: item.time,
    title: item.title,
    notes: item.notes,
    state: item.tone === 'active' ? 'active' : 'upcoming',
  }));
  return (
    <View style={styles.rail}>
      {timelineSteps.map((step, index) => {
        const state: TimelineStepState = step.state ?? 'upcoming';
        const isLast = index === timelineSteps.length - 1;

        return (
          <View key={step.id} style={styles.row}>
            <View style={styles.left}>
              <View
                style={[
                  styles.node,
                  {
                    backgroundColor: nodeFill[state],
                    borderColor: nodeBorder[state],
                  },
                ]}
              />
              {!isLast ? <View style={styles.connector} /> : null}
            </View>
            <View style={[styles.content, isLast && styles.contentLast]}>
              <View style={styles.headerRow}>
                <Text style={[styles.timeLabel, { color: timeColor[state] }]}>
                  {step.timeLabel}
                </Text>
                <Icon
                  name={step.icon}
                  size={14}
                  color={
                    state === 'active'
                      ? theme.colors.primary[600]
                      : theme.colors.modernist.graphiteMuted
                  }
                  style={styles.headerIcon}
                />
              </View>
              <Text style={[styles.title, { color: titleColor[state] }]}>
                {step.title}
              </Text>
              {step.notes ? (
                <Text style={styles.notes}>{step.notes}</Text>
              ) : null}
            </View>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  rail: {
    paddingLeft: 0,
  },
  row: {
    flexDirection: 'row',
  },
  left: {
    alignItems: 'center',
    width: LEFT_COL_WIDTH,
    paddingTop: 4,
  },
  node: {
    width: NODE_SIZE,
    height: NODE_SIZE,
    borderRadius: NODE_SIZE / 2,
    borderWidth: 1.5,
  },
  connector: {
    width: RAIL_WIDTH,
    flex: 1,
    minHeight: 18,
    backgroundColor: theme.colors.modernist.ruleTeal,
    marginTop: 4,
    marginBottom: 2,
    opacity: 0.6,
  },
  content: {
    flex: 1,
    paddingLeft: theme.spacing.sm,
    paddingBottom: theme.spacing.lg,
  },
  contentLast: {
    paddingBottom: 0,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  headerIcon: {
    marginLeft: 6,
  },
  timeLabel: {
    fontFamily: theme.typography.roles.bodyMedium,
    fontSize: 11,
    letterSpacing: 0.6,
    textTransform: 'uppercase',
    fontVariant: ['tabular-nums'],
  },
  title: {
    fontFamily: theme.typography.roles.bodySemibold,
    fontSize: 15,
    marginBottom: 2,
  },
  notes: {
    fontFamily: theme.typography.roles.body,
    fontSize: 13,
    color: theme.colors.modernist.graphiteMuted,
    marginTop: 2,
    lineHeight: 18,
  },
});
