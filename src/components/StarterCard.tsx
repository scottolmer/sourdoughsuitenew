/**
 * StarterCard Component
 * Displays a starter in a card format with health status
 */

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import { Starter } from '../types';
import { theme } from '../theme';
import BenchCard from './BenchCard';
import MetricTile from './MetricTile';
import {
  getStarterTypeName,
  getHealthStatusDescription,
  getNextFeedingText,
  isFeedingOverdue,
} from '../utils/starterHealth';

interface Props {
  starter: Starter;
  onPress: () => void;
  onDelete?: () => void;
}

export default function StarterCard({ starter, onPress, onDelete }: Props) {
  const isOverdue = isFeedingOverdue(starter.nextFeedingDue);
  const feedingText = getNextFeedingText(starter.nextFeedingDue);

  const healthTone = (): 'green' | 'red' | 'default' => {
    if (!starter.isActive) return 'default';
    switch (starter.healthStatus) {
      case 'excellent':
      case 'good':
        return 'green';
      case 'poor':
        return 'red';
      case 'fair':
        return isOverdue ? 'red' : 'default';
      default:
        return 'green';
    }
  };

  const feedingTone = (): 'red' | 'copper' | 'default' => {
    if (isOverdue) return 'red';
    return 'copper';
  };

  const handleDelete = (e: any) => {
    e.stopPropagation();
    if (onDelete) {
      onDelete();
    }
  };

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.7} style={styles.touchable}>
      <BenchCard variant="default" padding="md">
        {/* Header row */}
        <View style={styles.header}>
          <View style={styles.titleArea}>
            <Text style={styles.name} numberOfLines={1}>{starter.name}</Text>
            <View style={[
              styles.activeBadge,
              starter.isActive ? styles.activeBadgeOn : styles.activeBadgeOff
            ]}>
              <Text style={[
                styles.activeBadgeText,
                starter.isActive ? styles.activeBadgeTextOn : styles.activeBadgeTextOff
              ]}>
                {starter.isActive ? 'Active' : 'Inactive'}
              </Text>
            </View>
          </View>
          {onDelete && (
            <TouchableOpacity onPress={handleDelete} style={styles.deleteButton} hitSlop={{ top: 8, right: 8, bottom: 8, left: 8 }}>
              <Icon name="delete-outline" size={18} color={theme.colors.bench.heatRed} />
            </TouchableOpacity>
          )}
        </View>

        {/* Subtitle row: type + flour */}
        <Text style={styles.subtitle}>
          {getStarterTypeName(starter.type)}{starter.flourType ? ` · ${starter.flourType}` : ''}
        </Text>

        {/* Metric tiles row */}
        <View style={styles.tilesRow}>
          <MetricTile
            icon="heart-pulse"
            label="Health"
            value={getHealthStatusDescription(starter.healthStatus || 'good')}
            tone={healthTone()}
          />
          <MetricTile
            icon={isOverdue ? 'alert-circle-outline' : 'clock-time-four-outline'}
            label="Next feeding"
            value={feedingText}
            tone={feedingTone()}
          />
        </View>
      </BenchCard>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  touchable: {
    marginBottom: theme.spacing.md,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  titleArea: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: theme.spacing.sm,
    flexWrap: 'wrap',
  },
  name: {
    fontSize: theme.typography.sizes.xl,
    fontFamily: theme.typography.fonts.heading,
    fontWeight: theme.typography.weights.bold as any,
    color: theme.colors.bench.crust,
    flexShrink: 1,
  },
  activeBadge: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 999,
    borderWidth: 1,
  },
  activeBadgeOn: {
    backgroundColor: '#EAF4E3',
    borderColor: theme.colors.bench.starterGreen,
  },
  activeBadgeOff: {
    backgroundColor: theme.colors.background.subtle,
    borderColor: theme.colors.bench.borderSoft,
  },
  activeBadgeText: {
    fontSize: theme.typography.sizes.xs,
    fontFamily: theme.typography.fonts.semibold,
    fontWeight: theme.typography.weights.semibold as any,
    letterSpacing: 0.4,
  },
  activeBadgeTextOn: {
    color: theme.colors.bench.starterGreen,
  },
  activeBadgeTextOff: {
    color: theme.colors.text.secondary,
  },
  deleteButton: {
    padding: 2,
    marginLeft: theme.spacing.sm,
  },
  subtitle: {
    fontSize: theme.typography.sizes.sm,
    fontFamily: theme.typography.fonts.regular,
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing.md,
  },
  tilesRow: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
  },
});
