/**
 * Timeline Calculator
 * Plan baking schedule and timing
 */

import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Button from '../../components/Button';
import BasicInput from '../../components/BasicInput';
import Card from '../../components/Card';
import { theme } from '../../theme';

interface TimelineStep {
  name: string;
  duration: string;
  startTime?: Date;
  endTime?: Date;
}

export default function TimelineCalculatorScreen() {
  const [targetTime, setTargetTime] = useState('');
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [selectedTime, setSelectedTime] = useState(new Date());
  const [steps, setSteps] = useState<TimelineStep[]>([
    { name: 'Mix dough', duration: '0.5' },
    { name: 'Bulk fermentation', duration: '4' },
    { name: 'Shape', duration: '0.25' },
    { name: 'Final proof', duration: '3' },
    { name: 'Bake', duration: '0.75' },
    { name: 'Cool down', duration: '1' },
  ]);

  const calculateTimeline = () => {
    if (!targetTime) return;

    // Parse target time (format: HH:MM)
    const [hours, minutes] = targetTime.split(':').map(Number);
    if (isNaN(hours) || isNaN(minutes)) return;

    const targetDate = new Date();
    targetDate.setHours(hours, minutes, 0, 0);

    // Calculate backwards from target time
    let currentTime = new Date(targetDate);
    const updatedSteps = [...steps].reverse().map((step) => {
      const durationHours = parseFloat(step.duration) || 0;
      const durationMs = durationHours * 60 * 60 * 1000;

      const endTime = new Date(currentTime);
      const startTime = new Date(currentTime.getTime() - durationMs);

      currentTime = startTime;

      return {
        ...step,
        startTime,
        endTime,
      };
    });

    setSteps(updatedSteps.reverse());
  };

  const addStep = () => {
    setSteps([...steps, { name: '', duration: '' }]);
  };

  const updateStep = (index: number, field: keyof TimelineStep, value: string) => {
    const updated = [...steps];
    updated[index] = { ...updated[index], [field]: value };
    setSteps(updated);
  };

  const removeStep = (index: number) => {
    setSteps(steps.filter((_, i) => i !== index));
  };

  const clearAll = () => {
    setTargetTime('');
    setSteps([
      { name: 'Mix dough', duration: '0.5' },
      { name: 'Bulk fermentation', duration: '4' },
      { name: 'Shape', duration: '0.25' },
      { name: 'Final proof', duration: '3' },
      { name: 'Bake', duration: '0.75' },
      { name: 'Cool down', duration: '1' },
    ]);
  };

  const handleTimeChange = useCallback((event: any, time?: Date) => {
    if (Platform.OS === 'android') {
      setShowTimePicker(false);
    }
    if (event.type === 'set' && time) {
      setSelectedTime(time);
      const hours = time.getHours().toString().padStart(2, '0');
      const minutes = time.getMinutes().toString().padStart(2, '0');
      setTargetTime(`${hours}:${minutes}`);
    }
  }, []);

  const formatTime = (date: Date | undefined) => {
    if (!date) return '';
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const totalDuration = steps.reduce(
    (sum, step) => sum + (parseFloat(step.duration) || 0),
    0
  );

  const startTime = steps.length > 0 && steps[0].startTime
    ? formatTime(steps[0].startTime)
    : null;

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      enabled={Platform.OS === 'ios'}
    >
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
      >
        <View style={styles.header}>
          <Icon name="clock-outline" size={48} color={theme.colors.info.main} />
          <Text style={styles.headerTitle}>Timeline Calculator</Text>
          <Text style={styles.headerSubtitle}>
            Plan your baking schedule from start to finish
          </Text>
        </View>

        <View style={styles.content}>
          {/* Target Time */}
          <Card variant="elevated">
            <Text style={styles.sectionTitle}>When do you want to finish?</Text>
            <Text style={styles.label}>Target Finish Time</Text>
            <TouchableOpacity
              style={styles.timePickerButton}
              onPress={() => setShowTimePicker(true)}
            >
              <Icon name="clock-outline" size={20} color={theme.colors.primary[600]} />
              <Text style={styles.timePickerText}>
                {targetTime || 'Select time'}
              </Text>
              <Icon name="chevron-down" size={20} color={theme.colors.text.tertiary} />
            </TouchableOpacity>
            <Text style={styles.helperText}>Tap to select your target finish time</Text>
            {showTimePicker && (
              <DateTimePicker
                value={selectedTime}
                mode="time"
                is24Hour={false}
                display="spinner"
                themeVariant="light"
                onChange={handleTimeChange}
              />
            )}
          </Card>

          {/* Steps */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Baking Steps</Text>
            {steps.map((step, index) => (
              <Card key={index} variant="outlined" style={styles.stepCard}>
                <View style={styles.stepHeader}>
                  <View style={styles.stepNumber}>
                    <Text style={styles.stepNumberText}>{index + 1}</Text>
                  </View>
                  <View style={styles.stepInputs}>
                    <BasicInput
                      placeholder="Step name"
                      value={step.name}
                      onChangeText={(value) => updateStep(index, 'name', value)}
                      editable={true}
                      containerStyle={styles.stepNameInput}
                    />
                    <BasicInput
                      placeholder="Hours"
                      value={step.duration}
                      onChangeText={(value) => updateStep(index, 'duration', value)}
                      keyboardType="numeric"
                      editable={true}
                      containerStyle={styles.stepDurationInput}
                    />
                  </View>
                  <Button
                    title=""
                    variant="ghost"
                    size="small"
                    leftIcon="close"
                    onPress={() => removeStep(index)}
                    style={styles.removeButton}
                  />
                </View>
                {step.startTime && step.endTime && (
                  <View style={styles.stepTiming}>
                    <Icon name="clock-start" size={14} color={theme.colors.info.main} />
                    <Text style={styles.stepTime}>
                      {formatTime(step.startTime)} - {formatTime(step.endTime)}
                    </Text>
                  </View>
                )}
              </Card>
            ))}

            <Button
              title="Add Step"
              variant="outline"
              onPress={addStep}
              fullWidth
              leftIcon="plus"
            />
          </View>

          {/* Summary */}
          <Card variant="filled" style={styles.summaryCard}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Total Duration:</Text>
              <Text style={styles.summaryValue}>
                {totalDuration.toFixed(2)} hours
              </Text>
            </View>
            {startTime && (
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Start Time:</Text>
                <Text style={styles.summaryValue}>{startTime}</Text>
              </View>
            )}
          </Card>

          {/* Actions */}
          <View style={styles.actions}>
            <Button
              title="Calculate Timeline"
              onPress={calculateTimeline}
              fullWidth
              leftIcon="calculator"
            />
            <Button
              title="Clear All"
              variant="outline"
              onPress={clearAll}
              fullWidth
            />
          </View>

          {/* Info Card */}
          <Card variant="outlined">
            <Text style={styles.infoTitle}>How to use</Text>
            <Text style={styles.infoText}>
              1. Enter when you want bread finished (e.g., 18:00){'\n'}
              2. Add or adjust baking steps{'\n'}
              3. Enter duration for each step in hours{'\n'}
              4. Tap "Calculate" to see when to start{'\n\n'}
              The calculator works backwards from your target time to tell you exactly when to begin.
            </Text>
          </Card>
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
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: theme.typography.sizes['2xl'],
    fontWeight: theme.typography.weights.bold as any,
    color: theme.colors.text.primary,
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.xs,
  },
  headerSubtitle: {
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.text.secondary,
    textAlign: 'center',
  },
  content: {
    padding: theme.spacing.lg,
  },
  section: {
  },
  sectionTitle: {
    fontSize: theme.typography.sizes.lg,
    fontWeight: theme.typography.weights.semibold as any,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.sm,
  },
  label: {
    fontSize: theme.typography.sizes.sm,
    fontWeight: theme.typography.weights.medium as any,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.xs,
  },
  timePickerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.colors.border.main,
    borderRadius: theme.borderRadius.md,
    backgroundColor: theme.colors.white,
    paddingHorizontal: theme.spacing.md,
    minHeight: 48,
    gap: theme.spacing.sm,
  },
  timePickerText: {
    flex: 1,
    fontSize: theme.typography.sizes.base,
    color: theme.colors.text.primary,
  },
  helperText: {
    fontSize: theme.typography.sizes.xs,
    color: theme.colors.text.tertiary,
    marginTop: theme.spacing.xs,
    marginLeft: theme.spacing.xs,
  },
  stepCard: {
    marginBottom: theme.spacing.sm,
  },
  stepHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  stepNumber: {
    width: 32,
    height: 32,
    borderRadius: theme.borderRadius.full,
    backgroundColor: theme.colors.info.main,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepNumberText: {
    fontSize: theme.typography.sizes.sm,
    fontWeight: theme.typography.weights.bold as any,
    color: theme.colors.white,
  },
  stepInputs: {
    flex: 1,
    flexDirection: 'column',
  },
  stepNameInput: {
  },
  stepDurationInput: {
  },
  removeButton: {
    minWidth: 40,
  },
  stepTiming: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: theme.spacing.sm,
    marginLeft: 40,
  },
  stepTime: {
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.info.main,
    fontWeight: theme.typography.weights.medium as any,
  },
  summaryCard: {
    backgroundColor: theme.colors.info.light + '40',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.sm,
  },
  summaryLabel: {
    fontSize: theme.typography.sizes.base,
    color: theme.colors.text.secondary,
  },
  summaryValue: {
    fontSize: theme.typography.sizes.base,
    fontWeight: theme.typography.weights.semibold as any,
    color: theme.colors.text.primary,
  },
  actions: {
  },
  infoTitle: {
    fontSize: theme.typography.sizes.base,
    fontWeight: theme.typography.weights.semibold as any,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.sm,
  },
  infoText: {
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.text.secondary,
    lineHeight: 20,
  },
});
