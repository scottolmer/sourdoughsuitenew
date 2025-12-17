/**
 * StarterCard Component
 * Displays a starter in a card format with health status
 */

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Starter } from '../types';
import { theme } from '../theme';
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
  // Determine health status color
  const getHealthColor = () => {
    if (!starter.isActive) return theme.colors.text.disabled;

    switch (starter.healthStatus) {
      case 'excellent':
        return theme.colors.success.dark;
      case 'good':
        return theme.colors.success.main;
      case 'fair':
        return theme.colors.warning.main;
      case 'poor':
        return theme.colors.error.main;
      case 'inactive':
        return theme.colors.text.disabled;
      default:
        return theme.colors.success.main;
    }
  };

  const healthColor = getHealthColor();
  const isOverdue = isFeedingOverdue(starter.nextFeedingDue);
  const feedingText = getNextFeedingText(starter.nextFeedingDue);

  const handleDelete = (e: any) => {
    e.stopPropagation();
    if (onDelete) {
      onDelete();
    }
  };

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
      <View style={styles.card}>
        <View style={styles.header}>
          <View style={styles.titleRow}>
            <Icon
              name="bacteria"
              size={24}
              color={theme.colors.primary[600]}
              style={styles.icon}
            />
            <Text style={styles.name}>{starter.name}</Text>
          </View>
          <View style={styles.headerRight}>
            <View style={[styles.statusBadge, { backgroundColor: healthColor }]}>
              <Text style={styles.statusText}>
                {starter.isActive ? 'Active' : 'Inactive'}
              </Text>
            </View>
            {onDelete && (
              <TouchableOpacity onPress={handleDelete} style={styles.deleteButton}>
                <Icon name="delete" size={20} color={theme.colors.error.main} />
              </TouchableOpacity>
            )}
          </View>
        </View>

        <View style={styles.details}>
          <View style={styles.detailRow}>
            <Icon name="grain" size={16} color={theme.colors.text.secondary} />
            <Text style={styles.detailLabel}>Type:</Text>
            <Text style={styles.detailValue}>{getStarterTypeName(starter.type)}</Text>
          </View>

          <View style={styles.detailRow}>
            <Icon name="wheat" size={16} color={theme.colors.text.secondary} />
            <Text style={styles.detailLabel}>Flour:</Text>
            <Text style={styles.detailValue}>{starter.flourType}</Text>
          </View>

          {starter.healthStatus && (
            <View style={styles.detailRow}>
              <Icon name="heart-pulse" size={16} color={healthColor} />
              <Text style={styles.detailLabel}>Health:</Text>
              <Text style={[styles.detailValue, { color: healthColor }]}>
                {getHealthStatusDescription(starter.healthStatus)}
              </Text>
            </View>
          )}

          {starter.nextFeedingDue && (
            <View style={styles.detailRow}>
              <Icon
                name={isOverdue ? "alert-circle" : "clock-outline"}
                size={16}
                color={isOverdue ? theme.colors.error.main : theme.colors.text.secondary}
              />
              <Text style={styles.detailLabel}>Feeding:</Text>
              <Text
                style={[
                  styles.detailValue,
                  isOverdue && { color: theme.colors.error.main, fontWeight: '600' }
                ]}
              >
                {feedingText}
              </Text>
            </View>
          )}
        </View>

        {starter.notes && (
          <View style={styles.notes}>
            <Text style={styles.notesText} numberOfLines={2}>
              {starter.notes}
            </Text>
          </View>
        )}

        <View style={styles.footer}>
          <Icon name="calendar" size={14} color={theme.colors.text.secondary} />
          <Text style={styles.dateText}>
            Created {new Date(starter.createdAt).toLocaleDateString()}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.colors.background.paper,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
    ...theme.shadows.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  icon: {
    marginRight: theme.spacing.xs,
  },
  name: {
    fontSize: theme.typography.sizes.lg,
    fontWeight: theme.typography.weights.semibold as any,
    color: theme.colors.text.primary,
    flex: 1,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusBadge: {
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.full,
  },
  statusText: {
    fontSize: theme.typography.sizes.xs,
    fontWeight: theme.typography.weights.medium as any,
    color: theme.colors.background.paper,
  },
  deleteButton: {
    padding: theme.spacing.xs,
    marginLeft: theme.spacing.xs,
  },
  details: {
    marginTop: theme.spacing.sm,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.xs,
  },
  detailLabel: {
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.text.secondary,
    marginLeft: theme.spacing.xs,
    marginRight: theme.spacing.xs,
    fontWeight: theme.typography.weights.medium as any,
  },
  detailValue: {
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.text.primary,
  },
  notes: {
    marginTop: theme.spacing.sm,
    paddingTop: theme.spacing.sm,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border.light,
  },
  notesText: {
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.text.secondary,
    fontStyle: 'italic',
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: theme.spacing.sm,
    paddingTop: theme.spacing.sm,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border.light,
  },
  dateText: {
    fontSize: theme.typography.sizes.xs,
    color: theme.colors.text.secondary,
    marginLeft: theme.spacing.xs,
  },
});
