/**
 * EditStarter Screen
 * Form to edit an existing sourdough starter
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator,
  Switch,
} from 'react-native';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Button from '../../components/Button';
import BasicInput from '../../components/BasicInput';
import Picker, { PickerOption } from '../../components/Picker';
import Card from '../../components/Card';
import { theme } from '../../theme';
import { starterStorage } from '../../services/starterStorage';
import { QUERY_KEYS } from '../../constants';
import { Starter, StarterType } from '../../types';
import { EditStarterScreenProps } from '../../navigation/types';
import { calculateNextFeeding } from '../../utils/starterHealth';

type Props = EditStarterScreenProps;

export default function EditStarterScreen({ route, navigation }: Props) {
  const { starterId } = route.params;
  const queryClient = useQueryClient();

  const [name, setName] = useState('');
  const [type, setType] = useState<StarterType>('levain');
  const [flourType, setFlourType] = useState('');
  const [feedingRatio, setFeedingRatio] = useState('');
  const [feedingFrequencyHours, setFeedingFrequencyHours] = useState('12');
  const [notes, setNotes] = useState('');
  const [isActive, setIsActive] = useState(true);

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

  // Fetch starter details
  const { data: starter, isLoading } = useQuery({
    queryKey: [QUERY_KEYS.STARTERS, starterId],
    queryFn: () => starterStorage.getById(starterId),
  });

  // Populate form when starter data loads
  useEffect(() => {
    if (starter) {
      setName(starter.name);
      setType(starter.type);
      setFlourType(starter.flourType);
      setFeedingRatio(starter.feedingRatio);
      setFeedingFrequencyHours(starter.feedingFrequencyHours?.toString() || '12');
      setNotes(starter.notes || '');
      setIsActive(starter.isActive);
    }
  }, [starter]);

  // Update starter mutation
  const updateMutation = useMutation({
    mutationFn: async (starterData: Partial<Starter>) => {
      return await starterStorage.update(starterId, starterData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.STARTERS] });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.STARTERS, starterId],
      });
      navigation.goBack();
    },
    onError: (error: any) => {
      console.error('Error updating starter:', error);
      Alert.alert(
        'Error',
        'Failed to update starter. Please try again.'
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

    const frequencyHours = parseInt(feedingFrequencyHours, 10);

    // Only recalculate next feeding if frequency changed
    let nextFeedingDue = starter?.nextFeedingDue;
    if (starter && starter.feedingFrequencyHours !== frequencyHours && starter.lastFed) {
      nextFeedingDue = calculateNextFeeding(starter.lastFed, frequencyHours);
    }

    const starterData: Partial<Starter> = {
      name: name.trim(),
      type,
      flourType: flourType.trim(),
      feedingRatio: feedingRatio.trim(),
      feedingFrequencyHours: frequencyHours,
      nextFeedingDue,
      notes: notes.trim() || undefined,
      isActive,
    };

    updateMutation.mutate(starterData);
  };

  if (isLoading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary[600]} />
        <Text style={styles.loadingText}>Loading starter...</Text>
      </View>
    );
  }

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
          <Text style={styles.headerTitle}>Edit Starter</Text>
          <Text style={styles.headerSubtitle}>
            Update your starter information
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

              <View style={styles.switchContainer}>
                <View>
                  <Text style={styles.switchLabel}>Starter Active</Text>
                  <Text style={styles.switchHelper}>
                    {isActive
                      ? 'Being fed regularly'
                      : 'Dormant or in storage'}
                  </Text>
                </View>
                <Switch
                  value={isActive}
                  onValueChange={setIsActive}
                  trackColor={{
                    false: theme.colors.text.disabled,
                    true: theme.colors.success.light,
                  }}
                  thumbColor={
                    isActive
                      ? theme.colors.success.main
                      : theme.colors.background.paper
                  }
                />
              </View>
            </View>
          </Card>

          <View style={styles.actions}>
            <Button
              title="Cancel"
              variant="outline"
              onPress={() => navigation.goBack()}
              fullWidth
            />
            <Button
              title="Save Changes"
              onPress={handleSubmit}
              loading={updateMutation.isPending}
              fullWidth
              leftIcon="content-save"
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
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.background.default,
    padding: theme.spacing.xl,
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
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: theme.spacing.md,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border.light,
    marginTop: theme.spacing.sm,
  },
  switchLabel: {
    fontSize: theme.typography.sizes.base,
    fontWeight: theme.typography.weights.medium as any,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.xs,
  },
  switchHelper: {
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.text.secondary,
  },
  actions: {
    marginTop: theme.spacing.xl,
  },
  loadingText: {
    fontSize: theme.typography.sizes.base,
    color: theme.colors.text.secondary,
    marginTop: theme.spacing.md,
  },
});
