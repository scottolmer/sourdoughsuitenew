/**
 * Starters Screen
 * List and manage sourdough starters
 */

import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  Alert,
  InteractionManager,
} from 'react-native';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import Button from '../../components/Button';
import Card from '../../components/Card';
import StarterCard from '../../components/StarterCard';
import FloatingActionButton from '../../components/FloatingActionButton';
import { SkeletonList } from '../../components/SkeletonLoader';
import { theme } from '../../theme';
import { starterStorage } from '../../services/starterStorage';
import { feedingLogStorage } from '../../services/feedingLogStorage';
import { initializeNotifications } from '../../services/notificationService';
import { QUERY_KEYS } from '../../constants';
import { Starter } from '../../types';

type StartersStackParamList = {
  StartersList: undefined;
  StarterDetail: { starterId: number };
  AddStarter: undefined;
  EditStarter: { starterId: number };
};

type NavigationProp = NativeStackNavigationProp<StartersStackParamList>;

export default function StartersScreen() {
  const notificationsInitialized = useRef(false);
  const navigation = useNavigation<NavigationProp>();
  const queryClient = useQueryClient();

  // Fetch starters using React Query
  const {
    data: starters = [],
    isLoading,
    isError,
    refetch,
    isRefetching,
  } = useQuery({
    queryKey: [QUERY_KEYS.STARTERS],
    queryFn: () => starterStorage.getAll(),
  });

  // Delete starter mutation
  const deleteMutation = useMutation({
    mutationFn: async (starterId: number) => {
      await feedingLogStorage.deleteByStarterId(starterId);
      return await starterStorage.delete(starterId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.STARTERS] });
    },
  });

  // Initialize notifications lazily (after screen is interactive)
  useEffect(() => {
    if (notificationsInitialized.current) return;

    const task = InteractionManager.runAfterInteractions(async () => {
      try {
        await initializeNotifications();
        notificationsInitialized.current = true;
        console.log('Notifications initialized successfully');
      } catch (error) {
        console.error('Failed to initialize notifications:', error);
      }
    });

    return () => task.cancel();
  }, []);

  const handleAddStarter = () => {
    navigation.navigate('AddStarter');
  };

  const handleStarterPress = (starterId: number) => {
    navigation.navigate('StarterDetail', { starterId });
  };

  const handleDeleteStarter = (starter: Starter) => {
    Alert.alert(
      'Delete Starter',
      `Are you sure you want to delete ${starter.name}? This will also delete all feeding logs.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => deleteMutation.mutate(starter.id),
        },
      ]
    );
  };

  // Loading state
  if (isLoading) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>My Starters</Text>
        </View>
        <SkeletonList count={3} />
      </View>
    );
  }

  // Error state
  if (isError) {
    return (
      <View style={styles.centerContainer}>
        <Icon name="alert-circle" size={64} color={theme.colors.error.main} />
        <Text style={styles.errorTitle}>Failed to load starters</Text>
        <Text style={styles.errorText}>
          Please check your connection and try again
        </Text>
        <Button title="Retry" onPress={() => refetch()} />
      </View>
    );
  }

  // Empty state
  if (!starters || starters.length === 0) {
    return (
      <ScrollView
        style={styles.container}
        refreshControl={
          <RefreshControl refreshing={isRefetching} onRefresh={refetch} />
        }
      >
        <View style={styles.header}>
          <Text style={styles.headerTitle}>My Starters</Text>
          <Text style={styles.headerSubtitle}>
            Track and manage your sourdough starters
          </Text>
        </View>

        <View style={styles.content}>
          <Card variant="outlined">
            <View style={styles.emptyState}>
              <Icon
                name="bacteria"
                size={64}
                color={theme.colors.text.disabled}
              />
              <Text style={styles.emptyStateTitle}>No starters yet</Text>
              <Text style={styles.emptyStateText}>
                Create your first starter to begin tracking feedings and
                performance
              </Text>
              <Button
                title="Add Starter"
                onPress={handleAddStarter}
                style={styles.addButton}
              />
            </View>
          </Card>
        </View>
      </ScrollView>
    );
  }

  // List of starters
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.headerTitle}>My Starters</Text>
            <Text style={styles.headerSubtitle}>
              {starters.length} starter{starters.length !== 1 ? 's' : ''}
            </Text>
          </View>
        </View>
      </View>

      <ScrollView
        style={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={isRefetching}
            onRefresh={refetch}
            colors={[theme.colors.primary[500]]}
            tintColor={theme.colors.primary[500]}
          />
        }
      >
        <View style={styles.startersList}>
          {starters.map((starter) => (
            <StarterCard
              key={starter.id}
              starter={starter}
              onPress={() => handleStarterPress(starter.id)}
              onDelete={() => handleDeleteStarter(starter)}
            />
          ))}
        </View>
      </ScrollView>

      <FloatingActionButton
        icon="plus"
        onPress={handleAddStarter}
        color={theme.colors.primary[500]}
      />
    </View>
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
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: theme.typography.sizes['2xl'],
    fontWeight: theme.typography.weights.bold as any,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.xs,
  },
  headerSubtitle: {
    fontSize: theme.typography.sizes.base,
    color: theme.colors.text.secondary,
  },
  scrollContent: {
    flex: 1,
  },
  content: {
    padding: theme.spacing.xl,
  },
  startersList: {
    padding: theme.spacing.lg,
  },
  emptyState: {
    alignItems: 'center',
    padding: theme.spacing['3xl'],
  },
  emptyStateTitle: {
    fontSize: theme.typography.sizes.xl,
    fontWeight: theme.typography.weights.bold as any,
    color: theme.colors.text.primary,
    marginTop: theme.spacing.lg,
    marginBottom: theme.spacing.sm,
  },
  emptyStateText: {
    fontSize: theme.typography.sizes.base,
    color: theme.colors.text.secondary,
    textAlign: 'center',
    marginBottom: theme.spacing.xl,
  },
  addButton: {
    minWidth: 200,
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
});
