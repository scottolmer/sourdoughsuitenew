/**
 * Timeline Calculator
 * Result-first design with TimelineRail
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import Button from '../../components/Button';
import BasicInput from '../../components/BasicInput';
import Card from '../../components/Card';
import BenchCard from '../../components/BenchCard';
import SectionHeader from '../../components/SectionHeader';
import TimelineRail from '../../components/TimelineRail';
import type { TimelineStep as RailStep } from '../../components/TimelineRail';
import { theme } from '../../theme';
import type { MaterialCommunityIconName } from '../../types/icons';

interface TimelineStep {
  name: string;
  duration: string;
  startTime?: Date;
  endTime?: Date;
}

const DEFAULT_STEPS: TimelineStep[] = [
  { name: 'Mix dough', duration: '0.5' },
  { name: 'Bulk fermentation', duration: '4' },
  { name: 'Shape', duration: '0.25' },
  { name: 'Final proof', duration: '3' },
  { name: 'Bake', duration: '0.75' },
  { name: 'Cool down', duration: '1' },
];

const STEP_ICONS: Record<string, MaterialCommunityIconName> = {
  'mix': 'bowl-mix-outline',
  'bulk': 'timer-sand',
  'shape': 'hand-back-right-outline',
  'proof': 'clock-outline',
  'bake': 'fire',
  'cool': 'snowflake',
  'preshape': 'hand-back-right-outline',
  'score': 'pencil-outline',
  'feed': 'bacteria-outline',
};

function guessIcon(name: string): MaterialCommunityIconName {
  const lower = name.toLowerCase();
  for (const [key, icon] of Object.entries(STEP_ICONS)) {
    if (lower.includes(key)) return icon;
  }
  return 'circle-small';
}

function formatTime(date: Date | undefined): string {
  if (!date) return '';
  return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
}

export default function TimelineCalculatorScreen() {
  const [targetTime, setTargetTime] = useState('');
  const [steps, setSteps] = useState<TimelineStep[]>(DEFAULT_STEPS);
  const [calculated, setCalculated] = useState(false);
  const [inputError, setInputError] = useState('');

  const calculateTimeline = () => {
    setInputError('');
    if (!targetTime) {
      setInputError('Please enter a target finish time (e.g. 18:00)');
      return;
    }

    const [hours, minutes] = targetTime.split(':').map(Number);
    if (isNaN(hours) || isNaN(minutes) || hours < 0 || hours > 23 || minutes < 0 || minutes > 59) {
      setInputError('Invalid time format. Use HH:MM (e.g. 18:00)');
      return;
    }

    const targetDate = new Date();
    targetDate.setHours(hours, minutes, 0, 0);

    let currentTime = new Date(targetDate);
    const updatedSteps = [...steps].reverse().map((step) => {
      const durationHours = parseFloat(step.duration) || 0;
      const durationMs = durationHours * 60 * 60 * 1000;
      const endTime = new Date(currentTime);
      const startTime = new Date(currentTime.getTime() - durationMs);
      currentTime = startTime;
      return { ...step, startTime, endTime };
    });

    setSteps(updatedSteps.reverse());
    setCalculated(true);
  };

  const addStep = () => {
    setSteps([...steps, { name: '', duration: '' }]);
    if (calculated) setCalculated(false);
  };

  const updateStep = (index: number, field: keyof TimelineStep, value: string) => {
    const updated = [...steps];
    updated[index] = { ...updated[index], [field]: value };
    setSteps(updated);
    if (calculated) setCalculated(false);
  };

  const removeStep = (index: number) => {
    setSteps(steps.filter((_, i) => i !== index));
    if (calculated) setCalculated(false);
  };

  const clearAll = () => {
    setTargetTime('');
    setSteps(DEFAULT_STEPS);
    setCalculated(false);
    setInputError('');
  };

  const totalDuration = steps.reduce((sum, step) => sum + (parseFloat(step.duration) || 0), 0);
  const startTime = steps.length > 0 && steps[0].startTime ? formatTime(steps[0].startTime) : null;

  // Build TimelineRail steps from calculated data
  const railSteps: RailStep[] = calculated
    ? steps.map((step, i) => ({
        id: `step-${i}`,
        icon: guessIcon(step.name),
        timeLabel: step.startTime ? formatTime(step.startTime) : '',
        title: step.name || `Step ${i + 1}`,
        notes: step.duration ? `${parseFloat(step.duration) * 60} min` : undefined,
        state: i === 0 ? 'active' : 'upcoming',
      }))
    : [];

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
        {/* Result Hero — visible at top when calculated */}
        {calculated && startTime ? (
          <View style={styles.resultSection}>
            <BenchCard variant="hero" padding="lg">
              <View style={styles.resultHeroRow}>
                <View style={styles.resultMetric}>
                  <Text style={styles.resultMetricLabel}>Start at</Text>
                  <Text style={styles.resultMetricValue}>{startTime}</Text>
                </View>
                <View style={styles.resultDivider} />
                <View style={styles.resultMetric}>
                  <Text style={styles.resultMetricLabel}>Finish at</Text>
                  <Text style={styles.resultMetricValue}>{targetTime}</Text>
                </View>
                <View style={styles.resultDivider} />
                <View style={styles.resultMetric}>
                  <Text style={styles.resultMetricLabel}>Duration</Text>
                  <Text style={styles.resultMetricValue}>{totalDuration.toFixed(1)}h</Text>
                </View>
              </View>
            </BenchCard>

            {/* Timeline Rail */}
            <View style={styles.railSection}>
              <SectionHeader eyebrow="Your schedule" title="Bake Timeline" />
              <BenchCard variant="default" padding="lg">
                <TimelineRail steps={railSteps} />
              </BenchCard>
            </View>
          </View>
        ) : (
          /* Summary preview before calculation */
          <View style={styles.resultSection}>
            <BenchCard variant="filled" padding="lg" style={styles.previewCard}>
              <View style={styles.previewRow}>
                <Icon name="clock-outline" size={24} color={theme.colors.primary[600]} />
                <View style={styles.previewInfo}>
                  <Text style={styles.previewTitle}>
                    {totalDuration.toFixed(1)} hours total
                  </Text>
                  <Text style={styles.previewSub}>
                    {steps.length} steps · Enter target time to calculate
                  </Text>
                </View>
              </View>
            </BenchCard>
          </View>
        )}

        <View style={styles.content}>
          {/* Target Time */}
          <Card variant="elevated">
            <Text style={styles.sectionTitle}>When do you want to finish?</Text>
            <Text style={styles.label}>Target Finish Time</Text>
            <BasicInput
              placeholder="HH:MM (e.g. 18:00)"
              value={targetTime}
              onChangeText={(v) => { setTargetTime(v); setInputError(''); }}
              containerStyle={styles.timeInput}
            />
            <Text style={styles.helperText}>Enter your target finish time (24h format)</Text>
          </Card>

          {/* Inline error */}
          {inputError ? (
            <View style={styles.errorBanner}>
              <Icon name="alert-circle-outline" size={16} color={theme.colors.bench.heatRed} />
              <Text style={styles.errorText}>{inputError}</Text>
            </View>
          ) : null}

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
                {calculated && step.startTime && step.endTime && (
                  <View style={styles.stepTiming}>
                    <Icon name="clock-start" size={14} color={theme.colors.primary[600]} />
                    <Text style={styles.stepTime}>
                      {formatTime(step.startTime)} → {formatTime(step.endTime)}
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
    paddingBottom: 40,
  },
  resultSection: {
    padding: theme.spacing.lg,
    paddingBottom: 0,
  },
  resultHeroRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  resultMetric: {
    alignItems: 'center',
    flex: 1,
  },
  resultMetricLabel: {
    fontFamily: theme.typography.fonts.regular,
    fontSize: theme.typography.sizes.xs,
    color: theme.colors.bench.crumb,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
    marginBottom: 4,
  },
  resultMetricValue: {
    fontFamily: theme.typography.fonts.heading,
    fontSize: theme.typography.sizes['2xl'],
    color: theme.colors.bench.crust,
  },
  resultDivider: {
    width: 1,
    height: 48,
    backgroundColor: theme.colors.bench.borderSoft,
  },
  railSection: {
    marginTop: theme.spacing.lg,
  },
  previewCard: {
    borderRadius: 20,
  },
  previewRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.md,
  },
  previewInfo: {
    flex: 1,
  },
  previewTitle: {
    fontFamily: theme.typography.fonts.semibold,
    fontSize: theme.typography.sizes.base,
    color: theme.colors.bench.crust,
  },
  previewSub: {
    fontFamily: theme.typography.fonts.regular,
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.text.secondary,
    marginTop: 2,
  },
  content: {
    padding: theme.spacing.lg,
  },
  section: {
    marginBottom: theme.spacing.md,
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
  timeInput: {
    marginBottom: 0,
  },
  helperText: {
    fontSize: theme.typography.sizes.xs,
    color: theme.colors.text.tertiary,
    marginTop: theme.spacing.xs,
    marginLeft: theme.spacing.xs,
  },
  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xs,
    backgroundColor: theme.colors.bench.heatRed + '12',
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    marginTop: theme.spacing.sm,
    borderWidth: 1,
    borderColor: theme.colors.bench.heatRed + '30',
  },
  errorText: {
    flex: 1,
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.bench.heatRed,
    fontFamily: theme.typography.fonts.medium,
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
    backgroundColor: theme.colors.primary[600],
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
  stepNameInput: {},
  stepDurationInput: {},
  removeButton: {
    minWidth: 40,
  },
  stepTiming: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: theme.spacing.sm,
    marginLeft: 40,
    gap: theme.spacing.xs,
  },
  stepTime: {
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.primary[600],
    fontWeight: theme.typography.weights.medium as any,
  },
  actions: {
    marginBottom: theme.spacing.md,
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
