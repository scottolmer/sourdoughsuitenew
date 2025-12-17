/**
 * AddFeeding Screen
 * Form to log a starter feeding
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import Button from '../../components/Button';
import BasicInput from '../../components/BasicInput';
import Card from '../../components/Card';
import { theme } from '../../theme';
import { feedingLogStorage } from '../../services/feedingLogStorage';
import { starterStorage } from '../../services/starterStorage';
import { QUERY_KEYS } from '../../constants';
import { FeedingLog } from '../../types';
import { AddFeedingScreenProps } from '../../navigation/types';
import { calculateNextFeeding } from '../../utils/starterHealth';
import { scheduleFeedingReminder } from '../../services/notificationService';

type Props = AddFeedingScreenProps;

export default function AddFeedingScreen({ route, navigation }: Props) {
  const { starterId } = route.params;
  const queryClient = useQueryClient();

  const [notes, setNotes] = useState('');

  // Fetch starter to get feeding frequency
  const { data: starter } = useQuery({
    queryKey: [QUERY_KEYS.STARTERS, starterId],
    queryFn: () => starterStorage.getById(starterId),
  });

  // Create feeding log mutation
  const createMutation = useMutation({
    mutationFn: async (feedingData: Omit<FeedingLog, 'id' | 'createdAt'>) => {
      // Create feeding log
      const newLog = await feedingLogStorage.create(feedingData);

      // Update starter's lastFed and nextFeedingDue
      if (starter) {
        const now = new Date().toISOString();
        const frequencyHours = starter.feedingFrequencyHours || 12;
        const nextFeeding = calculateNextFeeding(now, frequencyHours);

        await starterStorage.update(starterId, {
          lastFed: now,
          nextFeedingDue: nextFeeding,
        });
      }

      return newLog;
    },
    onSuccess: async () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.FEEDING_LOGS, starterId],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.STARTERS],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.STARTERS, starterId],
      });

      // Schedule notification for next feeding
      if (starter) {
        const updatedStarter = {
          ...starter,
          lastFed: new Date().toISOString(),
          nextFeedingDue: calculateNextFeeding(
            new Date().toISOString(),
            starter.feedingFrequencyHours || 12
          ),
        };
        await scheduleFeedingReminder(updatedStarter);
      }

      navigation.goBack();
    },
    onError: (error: any) => {
      console.error('Error logging feeding:', error);
      Alert.alert(
        'Error',
        'Failed to log feeding. Please try again.'
      );
    },
  });

  const handleSubmit = () => {
    const feedingData: Omit<FeedingLog, 'id' | 'createdAt'> = {
      starterId,
      notes: notes.trim() || undefined,
    };

    createMutation.mutate(feedingData);
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Log Feeding</Text>
          <Text style={styles.headerSubtitle}>
            Record a feeding for this starter
          </Text>
        </View>

        <View style={styles.content}>
          <Card variant="elevated">
            <View style={styles.form}>
              <View style={styles.timestampCard}>
                <Card variant="filled">
                  <View style={styles.timestampContent}>
                    <Text style={styles.timestampLabel}>Feeding Time:</Text>
                    <Text style={styles.timestampValue}>
                      {new Date().toLocaleString()}
                    </Text>
                  </View>
                </Card>
              </View>

              <BasicInput
                label="Notes (Optional)"
                placeholder="e.g., Fed 1:2:2 ratio, bubbling well, 72°F room temp..."
                value={notes}
                onChangeText={setNotes}
                multiline
                numberOfLines={6}
                style={styles.notesInput}
              />
            </View>
          </Card>

          <View style={styles.helpCard}>
            <Card variant="outlined">
              <Text style={styles.helpTitle}>What to Note</Text>
              <Text style={styles.helpText}>
                • Feeding ratio used (e.g., 1:1:1, 1:2:2){'\n'}
                • Starter appearance and smell{'\n'}
                • Activity level (bubbles, rise){'\n'}
                • Room temperature{'\n'}
                • Any changes or observations
              </Text>
            </Card>
          </View>

          <View style={styles.actions}>
            <Button
              title="Cancel"
              variant="outline"
              onPress={() => navigation.goBack()}
              fullWidth
            />
            <Button
              title="Log Feeding"
              onPress={handleSubmit}
              loading={createMutation.isPending}
              fullWidth
              leftIcon="check"
            />
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background.default,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  header: {
    padding: theme.spacing.xl,
    backgroundColor: theme.colors.white,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border.light,
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
  content: {
    padding: theme.spacing.lg,
  },
  form: {
  },
  timestampCard: {
    marginBottom: theme.spacing.sm,
  },
  timestampContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  timestampLabel: {
    fontSize: theme.typography.sizes.base,
    fontWeight: theme.typography.weights.medium as any,
    color: theme.colors.text.primary,
  },
  timestampValue: {
    fontSize: theme.typography.sizes.base,
    color: theme.colors.text.secondary,
  },
  notesInput: {
    height: 120,
    textAlignVertical: 'top',
  },
  helpCard: {
    marginTop: theme.spacing.lg,
  },
  helpTitle: {
    fontSize: theme.typography.sizes.base,
    fontWeight: theme.typography.weights.semibold as any,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.sm,
  },
  helpText: {
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.text.secondary,
    lineHeight: 20,
  },
  actions: {
    marginTop: theme.spacing.xl,
  },
});
