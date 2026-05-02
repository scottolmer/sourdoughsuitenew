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
  steps: TimelineStep[];
}

const stateColors: Record<TimelineStepState, string> = {
  active: theme.colors.bench.copper,
  past: theme.colors.bench.crumb,
  upcoming: theme.colors.bench.borderSoft,
};

const stateIconColors: Record<TimelineStepState, string> = {
  active: theme.colors.white,
  past: theme.colors.white,
  upcoming: theme.colors.bench.crustSoft,
};

export default function TimelineRail({ steps }: TimelineRailProps) {
  return (
    <View style={styles.rail}>
      {steps.map((step, index) => {
        const state: TimelineStepState = step.state ?? 'upcoming';
        const circleBg = stateColors[state];
        const iconColor = stateIconColors[state];
        const isLast = index === steps.length - 1;

        return (
          <View key={step.id} style={styles.row}>
            <View style={styles.left}>
              <View style={[styles.circle, { backgroundColor: circleBg }]}>
                <Icon name={step.icon} size={16} color={iconColor} />
              </View>
              {!isLast && <View style={styles.connector} />}
            </View>
            <View style={[styles.content, isLast && styles.contentLast]}>
              <Text style={[
                styles.timeLabel,
                state === 'active' && styles.timeLabelActive,
              ]}>
                {step.timeLabel}
              </Text>
              <Text style={[
                styles.title,
                state === 'upcoming' && styles.titleUpcoming,
              ]}>
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
    paddingLeft: theme.spacing.xs,
  },
  row: {
    flexDirection: 'row',
  },
  left: {
    alignItems: 'center',
    width: 36,
  },
  circle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  connector: {
    width: 2,
    flex: 1,
    minHeight: 16,
    backgroundColor: theme.colors.bench.borderSoft,
    marginVertical: 2,
  },
  content: {
    flex: 1,
    paddingLeft: theme.spacing.md,
    paddingBottom: theme.spacing.lg,
  },
  contentLast: {
    paddingBottom: 0,
  },
  timeLabel: {
    fontFamily: theme.typography.fonts.semibold,
    fontSize: theme.typography.sizes.xs,
    color: theme.colors.bench.crumb,
    letterSpacing: 0.4,
    marginBottom: 2,
  },
  timeLabelActive: {
    color: theme.colors.bench.copper,
  },
  title: {
    fontFamily: theme.typography.fonts.semibold,
    fontSize: theme.typography.sizes.base,
    color: theme.colors.bench.crust,
    marginBottom: 2,
  },
  titleUpcoming: {
    color: theme.colors.bench.crustSoft,
  },
  notes: {
    fontFamily: theme.typography.fonts.regular,
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.text.secondary,
    marginTop: 2,
    lineHeight: 18,
  },
});
