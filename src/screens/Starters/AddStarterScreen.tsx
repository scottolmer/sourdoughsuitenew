/**
 * AddStarter Screen
 * Form to create a new sourdough starter
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
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import Button from '../../components/Button';
import BasicInput from '../../components/BasicInput';
import Picker, { PickerOption } from '../../components/Picker';
import Card from '../../components/Card';
import { theme } from '../../theme';
import { starterStorage } from '../../services/starterStorage';
import { QUERY_KEYS } from '../../constants';
import { Starter, StarterType } from '../../types';
import { calculateNextFeeding } from '../../utils/starterHealth';

type StartersStackParamList = {
  StartersList: undefined;
  StarterDetail: { starterId: number };
  AddStarter: undefined;
  EditStarter: { starterId: number };
};

type Props = NativeStackScreenProps<StartersStackParamList, 'AddStarter'>;

export default function AddStarterScreen({ navigation }: Props) {
  const queryClient = useQueryClient();

  const [name, setName] = useState('');
  const [type, setType] = useState<StarterType>('levain');
  const [flourType, setFlourType] = useState('');
  const [feedingRatio, setFeedingRatio] = useState('1:1:1');
  const [feedingFrequencyHours, setFeedingFrequencyHours] = useState('12');
  const [notes, setNotes] = useState('');

  const starterTypeOptions: PickerOption[] = [
    { label: 'Levain', value: 'levain', description: 'Classic sourdough starter' },
    { label: 'Liquid Levain', value: 'liquid-levain', description: '100% hydration or higher' },
    { label: 'Stiff Levain', value: 'stiff-levain', description: '50-65% hydration' },
    { label: 'Poolish', value: 'poolish', description: '100% hydration pre-ferment' },
    { label: 'Biga', value: 'biga', description: '50-60% hydration pre-ferment' },
    { label: 'Pâte Fermentée', value: 'pate-fermentee', description: 'Old dough method' },
    { label: 'Sourdough', value: 'sourdough', description: 'General sourdough culture' },
  ];

  const feedingFrequencyOptions: PickerOption[] = [
    { label: 'Every 6 hours', value: '6', description: 'Very active maintenance' },
    { label: 'Every 12 hours', value: '12', description: 'Standard maintenance' },
    { label: 'Once daily (24 hours)', value: '24', description: 'Daily feeding' },
    { label: 'Every 2 days (48 hours)', value: '48', description: 'Refrigerated maintenance' },
    { label: 'Weekly (168 hours)', value: '168', description: 'Cold storage' },
  ];

  // Create starter mutation
  const createMutation = useMutation({
    mutationFn: async (starterData: Omit<Starter, 'id' | 'createdAt'>) => {
      const newStarter = await starterStorage.create(starterData);
      return newStarter;
    },
    onSuccess: () => {
      // Invalidate and refetch starters
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.STARTERS] });
      // Navigate back to show the new starter
      navigation.goBack();
    },
    onError: (error: any) => {
      console.error('Error creating starter:', error);
      Alert.alert(
        'Error',
        'Failed to create starter. Please try again.'
      );
    },
  });

  const handleSubmit = () => {
    // Validation
    if (!name.trim()) {
      Alert.alert('Validation Error', 'Please enter a starter name');
      return;
    }
    if (!flourType.trim()) {
      Alert.alert('Validation Error', 'Please enter a flour type');
      return;
    }

    const now = new Date().toISOString();
    const frequencyHours = parseInt(feedingFrequencyHours, 10);
    const nextFeeding = calculateNextFeeding(now, frequencyHours);

    const starterData: Omit<Starter, 'id' | 'createdAt'> = {
      name: name.trim(),
      type,
      flourType: flourType.trim(),
      feedingRatio: feedingRatio.trim(),
      notes: notes.trim() || undefined,
      isActive: true,
      lastFed: now,
      nextFeedingDue: nextFeeding,
      feedingFrequencyHours: frequencyHours,
      healthStatus: 'good',
    };

    createMutation.mutate(starterData);
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
          <Text style={styles.headerTitle}>Create New Starter</Text>
          <Text style={styles.headerSubtitle}>
            Add a new sourdough starter to track
          </Text>
        </View>

        <View style={styles.content}>
          <Card variant="elevated">
            <View style={styles.form}>
              <BasicInput
                label="Starter Name *"
                placeholder="e.g., My White Starter"
                value={name}
                onChangeText={setName}
              />

              <Picker
                label="Starter Type *"
                value={type}
                options={starterTypeOptions}
                onValueChange={(value) => setType(value as StarterType)}
              />

              <BasicInput
                label="Flour Type *"
                placeholder="e.g., Whole Wheat, Rye, All-Purpose"
                value={flourType}
                onChangeText={setFlourType}
              />

              <BasicInput
                label="Feeding Ratio"
                placeholder="e.g., 1:1:1, 1:2:2"
                value={feedingRatio}
                onChangeText={setFeedingRatio}
                helperText="Starter:Flour:Water ratio"
              />

              <Picker
                label="Feeding Frequency *"
                value={feedingFrequencyHours}
                options={feedingFrequencyOptions}
                onValueChange={setFeedingFrequencyHours}
                helperText="How often this starter needs feeding"
              />

              <BasicInput
                label="Notes (Optional)"
                placeholder="Additional notes about this starter..."
                value={notes}
                onChangeText={setNotes}
                multiline
                numberOfLines={4}
                style={styles.notesInput}
              />
            </View>
          </Card>

          <View style={styles.helpCard}>
            <Card variant="outlined">
              <Text style={styles.helpTitle}>Quick Tips</Text>
              <Text style={styles.helpText}>
                • Give your starter a memorable name{'\n'}
                • Set feeding frequency based on your schedule{'\n'}
                • Common ratios: 1:1:1 (maintenance), 1:5:5 (build){'\n'}
                • You'll receive reminders when feeding is due
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
              title="Create Starter"
              onPress={handleSubmit}
              loading={createMutation.isPending}
              fullWidth
              leftIcon="plus"
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
  notesInput: {
    height: 100,
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
