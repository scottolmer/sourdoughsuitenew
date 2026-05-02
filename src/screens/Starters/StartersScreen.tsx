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
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import Button from '../../components/Button';
import BenchCard from '../../components/BenchCard';
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

  const deleteMutation = useMutation({
    mutationFn: async (starterId: number) => {
      await feedingLogStorage.deleteByStarterId(starterId);
      return await starterStorage.delete(starterId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.STARTERS] });
    },
  });

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

  if (isLoading) {
    return (
      <View style={styles.container}>
        <SkeletonList count={3} />
      </View>
    );
  }

  if (isError) {
    return (
      <View style={styles.centerContainer}>
        <Icon name="alert-circle" size={64} color={theme.colors.bench.heatRed} />
        <Text style={styles.errorTitle}>Failed to load starters</Text>
        <Text style={styles.errorText}>
          Please check your connection and try again
        </Text>
        <Button title="Retry" onPress={() => refetch()} />
      </View>
    );
  }

  const isEmpty = !starters || starters.length === 0;

  return (
    <View style={styles.container}>
      <View style={styles.titleBlock}>
        <Text style={styles.pageTitle}>Starters</Text>
        <Text style={styles.pageSubtitle}>Track feedings, health, and activity.</Text>
      </View>
      <ScrollView
        style={styles.scrollContent}
        contentContainerStyle={isEmpty ? styles.emptyContent : undefined}
        refreshControl={
          <RefreshControl
            refreshing={isRefetching}
            onRefresh={refetch}
            colors={[theme.colors.primary[600]]}
            tintColor={theme.colors.primary[600]}
          />
        }
      >
        {isEmpty ? (
          <BenchCard variant="outlined" padding="xl">
            <View style={styles.emptyState}>
              <View style={styles.emptyIconRing}>
                <Icon
                  name="grain"
                  size={40}
                  color={theme.colors.primary[600]}
                />
              </View>
              <Text style={styles.emptyStateTitle}>Your starters live here.</Text>
              <Text style={styles.emptyStateText}>
                Add your first to get started. Track feedings, monitor health, and watch your culture thrive.
              </Text>
              <Button
                title="Add Starter"
                onPress={handleAddStarter}
                style={styles.addButton}
              />
            </View>
          </BenchCard>
        ) : (
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
        )}
      </ScrollView>

      {!isEmpty && (
        <FloatingActionButton
          icon="plus"
          onPress={handleAddStarter}
          color={theme.colors.primary[600]}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background.default,
  },
  titleBlock: {
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.lg,
    paddingBottom: theme.spacing.md,
    backgroundColor: theme.colors.background.default,
  },
  pageTitle: {
    fontSize: theme.typography.sizes['3xl'],
    fontFamily: theme.typography.fonts.heading,
    color: theme.colors.modernist.ink,
    marginBottom: 2,
  },
  pageSubtitle: {
    fontSize: theme.typography.sizes.sm,
    fontFamily: theme.typography.fonts.regular,
    color: theme.colors.text.secondary,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.background.default,
    padding: theme.spacing.xl,
  },
  scrollContent: {
    flex: 1,
  },
  emptyContent: {
    padding: theme.spacing.xl,
    flexGrow: 1,
    justifyContent: 'center',
  },
  startersList: {
    padding: theme.spacing.lg,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: theme.spacing['2xl'],
  },
  emptyIconRing: {
    width: 84,
    height: 84,
    borderRadius: 42,
    backgroundColor: theme.colors.background.subtle,
    borderWidth: 1,
    borderColor: theme.colors.bench.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing.lg,
  },
  emptyStateTitle: {
    fontSize: theme.typography.sizes.xl,
    fontFamily: theme.typography.fonts.heading,
    fontWeight: theme.typography.weights.bold as any,
    color: theme.colors.bench.crust,
    marginBottom: theme.spacing.sm,
    textAlign: 'center',
  },
  emptyStateText: {
    fontSize: theme.typography.sizes.base,
    fontFamily: theme.typography.fonts.regular,
    color: theme.colors.text.secondary,
    textAlign: 'center',
    marginBottom: theme.spacing.xl,
    lineHeight: 24,
    maxWidth: 280,
  },
  addButton: {
    minWidth: 180,
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
