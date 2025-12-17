/**
 * StarterDetail Screen
 * Display detailed information about a specific starter
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
} from 'react-native';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Button from '../../components/Button';
import Card from '../../components/Card';
import { theme } from '../../theme';
import { starterStorage } from '../../services/starterStorage';
import { feedingLogStorage } from '../../services/feedingLogStorage';
import { getRecipesByStarterId } from '../../services/recipeStorage';
import { QUERY_KEYS } from '../../constants';
import { Starter, FeedingLog } from '../../types';
import { StarterDetailScreenProps } from '../../navigation/types';
import {
  getStarterTypeName,
  getHealthStatusDescription,
  getNextFeedingText,
  isFeedingOverdue,
} from '../../utils/starterHealth';

type Props = StarterDetailScreenProps;

export default function StarterDetailScreen({ route, navigation }: Props) {
  const { starterId } = route.params;
  const queryClient = useQueryClient();

  // Fetch starter details
  const {
    data: starter,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: [QUERY_KEYS.STARTERS, starterId],
    queryFn: () => starterStorage.getById(starterId),
  });

  // Fetch feeding logs
  const { data: feedingLogs = [] } = useQuery({
    queryKey: [QUERY_KEYS.FEEDING_LOGS, starterId],
    queryFn: () => feedingLogStorage.getByStarterId(starterId),
  });

  // Fetch recipes that use this starter
  const { data: recipes = [] } = useQuery({
    queryKey: ['recipes', 'byStarter', starterId],
    queryFn: () => getRecipesByStarterId(starterId),
  });

  // Delete starter mutation
  const deleteMutation = useMutation({
    mutationFn: () => starterStorage.delete(starterId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.STARTERS] });
      navigation.goBack();
    },
  });

  const handleEdit = () => {
    navigation.navigate('EditStarter', { starterId });
  };

  const handleDelete = () => {
    Alert.alert(
      'Delete Starter',
      `Are you sure you want to delete ${starter?.name}? This action cannot be undone.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => deleteMutation.mutate(),
        },
      ]
    );
  };

  const handleAddFeeding = () => {
    navigation.navigate('AddFeeding', { starterId });
  };

  const handleRecipePress = (recipeId: string) => {
    // Navigate to the recipe detail in the Recipes tab
    (navigation as any).navigate('RecipesTab', {
      screen: 'RecipeDetail',
      params: { recipeId },
    });
  };

  // Loading state
  if (isLoading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary[600]} />
        <Text style={styles.loadingText}>Loading starter details...</Text>
      </View>
    );
  }

  // Error state
  if (isError || !starter) {
    return (
      <View style={styles.centerContainer}>
        <Icon name="alert-circle" size={64} color={theme.colors.error.main} />
        <Text style={styles.errorTitle}>Failed to load starter</Text>
        <Text style={styles.errorText}>
          Please check your connection and try again
        </Text>
        <Button title="Retry" onPress={() => refetch()} />
      </View>
    );
  }

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

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <Icon name="bacteria" size={48} color={theme.colors.primary[600]} />
          <View style={[styles.statusBadge, { backgroundColor: healthColor }]}>
            <Text style={styles.statusText}>
              {starter.isActive ? 'Active' : 'Inactive'}
            </Text>
          </View>
        </View>
        <Text style={styles.headerTitle}>{starter.name}</Text>
        <Text style={styles.headerSubtitle}>
          {getStarterTypeName(starter.type)} • Created {new Date(starter.createdAt).toLocaleDateString()}
        </Text>
      </View>

      {/* Health Status Section */}
      {starter.healthStatus && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Health Status</Text>
          <Card variant="elevated" style={[styles.healthCard, { borderLeftColor: healthColor }]}>
            <View style={styles.healthRow}>
              <Icon name="heart-pulse" size={32} color={healthColor} />
              <View style={styles.healthInfo}>
                <Text style={[styles.healthStatus, { color: healthColor }]}>
                  {getHealthStatusDescription(starter.healthStatus)}
                </Text>
                <Text style={styles.healthSubtext}>
                  Overall condition
                </Text>
              </View>
            </View>
          </Card>
        </View>
      )}

      {/* Feeding Schedule Section */}
      {starter.nextFeedingDue && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Feeding Schedule</Text>
          <Card
            variant="elevated"
            style={[styles.feedingCard, isOverdue && styles.feedingCardOverdue]}
          >
            <View style={styles.feedingRow}>
              <Icon
                name={isOverdue ? "alert-circle" : "clock-outline"}
                size={32}
                color={isOverdue ? theme.colors.error.main : theme.colors.primary[500]}
              />
              <View style={styles.feedingInfo}>
                <Text
                  style={[
                    styles.feedingText,
                    isOverdue && { color: theme.colors.error.main }
                  ]}
                >
                  {feedingText}
                </Text>
                <Text style={styles.feedingSubtext}>
                  Every {starter.feedingFrequencyHours} hours
                </Text>
              </View>
              <Button
                title="Feed Now"
                size="small"
                onPress={handleAddFeeding}
                leftIcon="plus"
              />
            </View>
          </Card>
        </View>
      )}

      {/* Details Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Details</Text>
        <Card variant="elevated">
          <View style={styles.detailRow}>
            <Icon name="wheat" size={20} color={theme.colors.text.secondary} />
            <Text style={styles.detailLabel}>Flour:</Text>
            <Text style={styles.detailValue}>{starter.flourType}</Text>
          </View>

          <View style={styles.detailRow}>
            <Icon
              name="chart-line"
              size={20}
              color={theme.colors.text.secondary}
            />
            <Text style={styles.detailLabel}>Feeding Ratio:</Text>
            <Text style={styles.detailValue}>{starter.feedingRatio}</Text>
          </View>

          {starter.lastFed && (
            <View style={styles.detailRow}>
              <Icon name="calendar-check" size={20} color={theme.colors.text.secondary} />
              <Text style={styles.detailLabel}>Last Fed:</Text>
              <Text style={styles.detailValue}>
                {new Date(starter.lastFed).toLocaleString()}
              </Text>
            </View>
          )}

          {starter.avgRiseTime && (
            <View style={styles.detailRow}>
              <Icon name="clock-fast" size={20} color={theme.colors.text.secondary} />
              <Text style={styles.detailLabel}>Avg Rise Time:</Text>
              <Text style={styles.detailValue}>
                {starter.avgRiseTime.toFixed(1)} hours
              </Text>
            </View>
          )}

          {starter.avgActivityLevel && (
            <View style={styles.detailRow}>
              <Icon name="chart-bell-curve" size={20} color={theme.colors.text.secondary} />
              <Text style={styles.detailLabel}>Avg Activity:</Text>
              <Text style={styles.detailValue}>
                {starter.avgActivityLevel.toFixed(1)} / 5.0
              </Text>
            </View>
          )}

          {starter.notes && (
            <>
              <View style={styles.divider} />
              <View style={styles.notesSection}>
                <Icon
                  name="note-text"
                  size={20}
                  color={theme.colors.text.secondary}
                />
                <Text style={styles.notesLabel}>Notes:</Text>
              </View>
              <Text style={styles.notesText}>{starter.notes}</Text>
            </>
          )}
        </Card>
      </View>

      {/* Recipes Using This Starter */}
      {recipes.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recipes Using This Starter</Text>
          {recipes.map((recipe) => (
            <Card
              key={recipe.id}
              variant="outlined"
              style={styles.recipeCard}
            >
              <TouchableOpacity
                onPress={() => handleRecipePress(recipe.id)}
                activeOpacity={0.7}
              >
                <View style={styles.recipeRow}>
                  <Icon
                    name="book-open-variant"
                    size={20}
                    color={theme.colors.primary[600]}
                  />
                  <View style={styles.recipeInfo}>
                    <Text style={styles.recipeName}>{recipe.name}</Text>
                    {recipe.description && (
                      <Text style={styles.recipeDescription} numberOfLines={1}>
                        {recipe.description}
                      </Text>
                    )}
                  </View>
                  <Icon
                    name="chevron-right"
                    size={20}
                    color={theme.colors.text.disabled}
                  />
                </View>
              </TouchableOpacity>
            </Card>
          ))}
        </View>
      )}

      {/* Feeding Logs Section */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Feeding History</Text>
          <Button
            title="Add"
            size="small"
            variant="outline"
            leftIcon="plus"
            onPress={handleAddFeeding}
          />
        </View>

        {feedingLogs && feedingLogs.length > 0 ? (
          feedingLogs.map((log, index) => (
            <Card key={log.id || index} variant="outlined" style={styles.logCard}>
              <View style={styles.logHeader}>
                <Icon
                  name="calendar"
                  size={16}
                  color={theme.colors.text.secondary}
                />
                <Text style={styles.logDate}>
                  {new Date(log.createdAt).toLocaleString()}
                </Text>
              </View>
              {log.notes && <Text style={styles.logNotes}>{log.notes}</Text>}
            </Card>
          ))
        ) : (
          <Card variant="outlined">
            <View style={styles.emptyLogs}>
              <Icon
                name="clipboard-text-outline"
                size={48}
                color={theme.colors.text.disabled}
              />
              <Text style={styles.emptyLogsText}>No feeding logs yet</Text>
              <Button
                title="Add First Feeding"
                variant="outline"
                size="small"
                onPress={handleAddFeeding}
                style={styles.emptyLogsButton}
              />
            </View>
          </Card>
        )}
      </View>

      {/* Actions Section */}
      <View style={styles.actions}>
        <Button
          title="Edit Starter"
          variant="outline"
          onPress={handleEdit}
          fullWidth
          leftIcon="pencil"
        />
        <Button
          title="Delete Starter"
          variant="ghost"
          onPress={handleDelete}
          fullWidth
          leftIcon="delete"
          style={styles.deleteButton}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background.default,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.background.default,
    padding: theme.spacing.xl,
  },
  header: {
    padding: theme.spacing.xl,
    backgroundColor: theme.colors.white,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border.light,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  statusBadge: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.full,
  },
  statusText: {
    fontSize: theme.typography.sizes.sm,
    fontWeight: theme.typography.weights.medium as any,
    color: theme.colors.background.paper,
  },
  headerTitle: {
    fontSize: theme.typography.sizes['3xl'],
    fontWeight: theme.typography.weights.bold as any,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.xs,
  },
  headerSubtitle: {
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.text.secondary,
  },
  section: {
    padding: theme.spacing.lg,
  },
  healthCard: {
    borderLeftWidth: 4,
  },
  healthRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  healthInfo: {
    marginLeft: theme.spacing.md,
    flex: 1,
  },
  healthStatus: {
    fontSize: theme.typography.sizes.lg,
    fontWeight: theme.typography.weights.bold as any,
    marginBottom: theme.spacing.xs,
  },
  healthSubtext: {
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.text.secondary,
  },
  feedingCard: {
    borderLeftWidth: 4,
    borderLeftColor: theme.colors.primary[500],
  },
  feedingCardOverdue: {
    borderLeftColor: theme.colors.error.main,
    backgroundColor: theme.colors.error.light + '10',
  },
  feedingRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  feedingInfo: {
    marginLeft: theme.spacing.md,
    flex: 1,
  },
  feedingText: {
    fontSize: theme.typography.sizes.lg,
    fontWeight: theme.typography.weights.semibold as any,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.xs,
  },
  feedingSubtext: {
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.text.secondary,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  sectionTitle: {
    fontSize: theme.typography.sizes.xl,
    fontWeight: theme.typography.weights.semibold as any,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.md,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  detailLabel: {
    fontSize: theme.typography.sizes.base,
    color: theme.colors.text.secondary,
    marginLeft: theme.spacing.sm,
    marginRight: theme.spacing.sm,
    fontWeight: theme.typography.weights.medium as any,
  },
  detailValue: {
    fontSize: theme.typography.sizes.base,
    color: theme.colors.text.primary,
    fontWeight: theme.typography.weights.semibold as any,
  },
  divider: {
    height: 1,
    backgroundColor: theme.colors.border.light,
    marginVertical: theme.spacing.md,
  },
  notesSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  notesLabel: {
    fontSize: theme.typography.sizes.base,
    color: theme.colors.text.secondary,
    marginLeft: theme.spacing.sm,
    fontWeight: theme.typography.weights.medium as any,
  },
  notesText: {
    fontSize: theme.typography.sizes.base,
    color: theme.colors.text.primary,
    fontStyle: 'italic',
  },
  logCard: {
    marginBottom: theme.spacing.sm,
  },
  logHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.xs,
  },
  logDate: {
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.text.secondary,
    marginLeft: theme.spacing.xs,
  },
  logNotes: {
    fontSize: theme.typography.sizes.base,
    color: theme.colors.text.primary,
  },
  emptyLogs: {
    alignItems: 'center',
    padding: theme.spacing.xl,
  },
  emptyLogsText: {
    fontSize: theme.typography.sizes.base,
    color: theme.colors.text.secondary,
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.lg,
  },
  emptyLogsButton: {
    minWidth: 150,
  },
  actions: {
    padding: theme.spacing.lg,
  },
  deleteButton: {
    borderColor: theme.colors.error.main,
  },
  loadingText: {
    fontSize: theme.typography.sizes.base,
    color: theme.colors.text.secondary,
    marginTop: theme.spacing.md,
  },
  errorTitle: {
    fontSize: theme.typography.sizes.xl,
    fontWeight: theme.typography.weights.bold as any,
    color: theme.colors.text.primary,
    marginTop: theme.spacing.lg,
    marginBottom: theme.spacing.sm,
  },
  errorText: {
    fontSize: theme.typography.sizes.base,
    color: theme.colors.text.secondary,
    textAlign: 'center',
    marginBottom: theme.spacing.xl,
  },
  recipeCard: {
    marginBottom: theme.spacing.sm,
  },
  recipeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
  recipeInfo: {
    flex: 1,
  },
  recipeName: {
    fontSize: theme.typography.sizes.base,
    fontWeight: theme.typography.weights.semibold as any,
    color: theme.colors.text.primary,
    marginBottom: 2,
  },
  recipeDescription: {
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.text.secondary,
  },
});
