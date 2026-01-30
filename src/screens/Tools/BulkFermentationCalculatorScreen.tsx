/**
 * Bulk Fermentation Calculator
 * Calculate fermentation time based on temperature and starter percentage
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import BasicInput from '../../components/BasicInput';
import Card from '../../components/Card';
import { theme } from '../../theme';

type TemperatureUnit = 'celsius' | 'fahrenheit';
type StarterStrength = 'weak' | 'moderate' | 'strong' | 'very_strong';

interface FermentationResult {
  minHours: number;
  maxHours: number;
  optimalHours: number;
  riseTarget: string;
  notes: string[];
}

export default function BulkFermentationCalculatorScreen() {
  const [temperature, setTemperature] = useState('24');
  const [tempUnit, setTempUnit] = useState<TemperatureUnit>('celsius');
  const [starterPercent, setStarterPercent] = useState('20');
  const [starterStrength, setStarterStrength] = useState<StarterStrength>('strong');
  const [hydration, setHydration] = useState('75');
  const [wholeGrainPercent, setWholeGrainPercent] = useState('10');

  const convertToC = (temp: number, unit: TemperatureUnit): number => {
    return unit === 'fahrenheit' ? (temp - 32) * 5 / 9 : temp;
  };

  const calculateFermentation = (): FermentationResult | null => {
    const temp = parseFloat(temperature);
    const starter = parseFloat(starterPercent);
    const hydrationPct = parseFloat(hydration);
    const wholeGrain = parseFloat(wholeGrainPercent);

    if (!temp || !starter || isNaN(temp) || isNaN(starter)) return null;

    const tempC = convertToC(temp, tempUnit);

    // Base fermentation time at 24°C with 20% starter
    // Using exponential temperature relationship (fermentation roughly doubles every 8-10°C)
    const baseTime = 4; // hours at 24°C with 20% strong starter

    // Temperature factor (Q10 ~ 2, meaning rate doubles every 10°C)
    const tempDiff = tempC - 24;
    const tempFactor = Math.pow(2, -tempDiff / 10);

    // Starter percentage factor (more starter = faster fermentation)
    const starterFactor = 20 / starter;

    // Starter strength factor
    const strengthFactors: { [key in StarterStrength]: number } = {
      weak: 1.5,
      moderate: 1.2,
      strong: 1.0,
      very_strong: 0.85,
    };
    const strengthFactor = strengthFactors[starterStrength];

    // Hydration factor (higher hydration slightly faster)
    const hydrationFactor = hydrationPct ? Math.pow(75 / hydrationPct, 0.2) : 1;

    // Whole grain factor (more whole grain = faster fermentation)
    const wholeGrainFactor = wholeGrain ? Math.pow(0.95, wholeGrain / 10) : 1;

    // Calculate optimal time
    const optimalHours = baseTime * tempFactor * starterFactor * strengthFactor * hydrationFactor * wholeGrainFactor;

    // Range is typically ±25% around optimal
    const minHours = optimalHours * 0.75;
    const maxHours = optimalHours * 1.25;

    // Generate notes
    const notes: string[] = [];

    if (tempC < 18) {
      notes.push('Cold fermentation: expect longer rise with more flavor development');
    } else if (tempC < 22) {
      notes.push('Cool environment: slower, controlled fermentation');
    } else if (tempC > 28) {
      notes.push('Warm environment: watch closely, can over-ferment quickly');
    } else if (tempC > 32) {
      notes.push('Very warm: fermentation may be too fast, consider reducing starter');
    }

    if (starter < 10) {
      notes.push('Low starter %: long fermentation, complex flavor');
    } else if (starter > 30) {
      notes.push('High starter %: faster rise, milder flavor');
    }

    if (starterStrength === 'weak') {
      notes.push('Weak starter: consider feeding 8-12 hours before use');
    }

    if (wholeGrain > 30) {
      notes.push('High whole grain: dough will ferment faster and may not rise as tall');
    }

    // Rise target based on conditions
    let riseTarget = '50-75%';
    if (tempC > 26 || starter > 25) {
      riseTarget = '50-70%';
    } else if (tempC < 20 || starter < 15) {
      riseTarget = '75-100%';
    }

    return {
      minHours: Math.max(1, minHours),
      maxHours: Math.min(24, maxHours),
      optimalHours: Math.max(1, Math.min(24, optimalHours)),
      riseTarget,
      notes,
    };
  };

  const formatTime = (hours: number): string => {
    if (hours < 1) {
      return `${Math.round(hours * 60)} min`;
    }
    const h = Math.floor(hours);
    const m = Math.round((hours - h) * 60);
    if (m === 0) return `${h}h`;
    return `${h}h ${m}m`;
  };

  const result = calculateFermentation();

  const getTimeColor = (hours: number) => {
    if (hours < 3) return theme.colors.error.main;
    if (hours < 5) return theme.colors.warning.main;
    if (hours < 8) return theme.colors.success.main;
    if (hours < 12) return theme.colors.info.main;
    return theme.colors.primary[600];
  };

  const strengthOptions: { value: StarterStrength; label: string; description: string }[] = [
    { value: 'weak', label: 'Weak', description: 'Slow to peak, takes 12+ hours' },
    { value: 'moderate', label: 'Moderate', description: 'Peaks in 8-12 hours' },
    { value: 'strong', label: 'Strong', description: 'Peaks in 4-8 hours' },
    { value: 'very_strong', label: 'Very Strong', description: 'Peaks in 3-4 hours' },
  ];

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
          <Icon name="timer-sand" size={48} color={theme.colors.success.main} />
          <Text style={styles.headerTitle}>Bulk Fermentation Calculator</Text>
          <Text style={styles.headerSubtitle}>
            Estimate fermentation time based on conditions
          </Text>
        </View>

        <View style={styles.content}>
          {/* Temperature */}
          <Card variant="elevated">
            <Text style={styles.sectionTitle}>Environment</Text>
            <View style={styles.tempRow}>
              <View style={styles.tempInput}>
                <BasicInput
                  label="Temperature"
                  placeholder="e.g., 24"
                  value={temperature}
                  onChangeText={setTemperature}
                  keyboardType="numeric"
                  leftIcon="thermometer"
                />
              </View>
              <View style={styles.tempUnitToggle}>
                <TouchableOpacity
                  style={[
                    styles.unitButton,
                    tempUnit === 'celsius' && styles.unitButtonActive,
                  ]}
                  onPress={() => setTempUnit('celsius')}
                >
                  <Text style={[
                    styles.unitButtonText,
                    tempUnit === 'celsius' && styles.unitButtonTextActive,
                  ]}>°C</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.unitButton,
                    tempUnit === 'fahrenheit' && styles.unitButtonActive,
                  ]}
                  onPress={() => setTempUnit('fahrenheit')}
                >
                  <Text style={[
                    styles.unitButtonText,
                    tempUnit === 'fahrenheit' && styles.unitButtonTextActive,
                  ]}>°F</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Card>

          {/* Starter */}
          <Card variant="elevated">
            <Text style={styles.sectionTitle}>Starter</Text>
            <BasicInput
              label="Starter Percentage"
              placeholder="e.g., 20"
              value={starterPercent}
              onChangeText={setStarterPercent}
              keyboardType="numeric"
              leftIcon="percent"
              helperText="Percentage of flour weight"
            />

            <Text style={styles.fieldLabel}>Starter Strength</Text>
            <View style={styles.strengthGrid}>
              {strengthOptions.map((option) => (
                <TouchableOpacity
                  key={option.value}
                  style={[
                    styles.strengthButton,
                    starterStrength === option.value && styles.strengthButtonActive,
                  ]}
                  onPress={() => setStarterStrength(option.value)}
                >
                  <Text style={[
                    styles.strengthLabel,
                    starterStrength === option.value && styles.strengthLabelActive,
                  ]}>
                    {option.label}
                  </Text>
                  <Text style={[
                    styles.strengthDesc,
                    starterStrength === option.value && styles.strengthDescActive,
                  ]}>
                    {option.description}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </Card>

          {/* Dough Properties */}
          <Card variant="elevated">
            <Text style={styles.sectionTitle}>Dough Properties (Optional)</Text>
            <View style={styles.doughRow}>
              <View style={styles.doughInput}>
                <BasicInput
                  label="Hydration %"
                  placeholder="e.g., 75"
                  value={hydration}
                  onChangeText={setHydration}
                  keyboardType="numeric"
                  leftIcon="water"
                />
              </View>
              <View style={styles.doughInput}>
                <BasicInput
                  label="Whole Grain %"
                  placeholder="e.g., 10"
                  value={wholeGrainPercent}
                  onChangeText={setWholeGrainPercent}
                  keyboardType="numeric"
                  leftIcon="grain"
                />
              </View>
            </View>
          </Card>

          {/* Result */}
          {result && (
            <Card variant="filled" style={[
              styles.resultCard,
              { backgroundColor: getTimeColor(result.optimalHours) + '15' },
            ]}>
              <Text style={styles.resultTitle}>Estimated Bulk Fermentation Time</Text>

              <View style={styles.timeDisplay}>
                <View style={styles.timeRange}>
                  <Text style={styles.timeRangeLabel}>Range</Text>
                  <Text style={[styles.timeRangeValue, { color: getTimeColor(result.optimalHours) }]}>
                    {formatTime(result.minHours)} - {formatTime(result.maxHours)}
                  </Text>
                </View>
                <View style={styles.timeOptimal}>
                  <Text style={styles.timeOptimalLabel}>Target</Text>
                  <Text style={[styles.timeOptimalValue, { color: getTimeColor(result.optimalHours) }]}>
                    {formatTime(result.optimalHours)}
                  </Text>
                </View>
              </View>

              <View style={styles.riseTarget}>
                <Icon name="arrow-expand-up" size={20} color={theme.colors.text.secondary} />
                <Text style={styles.riseTargetText}>
                  Target rise: <Text style={styles.riseTargetValue}>{result.riseTarget}</Text> increase in volume
                </Text>
              </View>

              {result.notes.length > 0 && (
                <View style={styles.notesContainer}>
                  {result.notes.map((note, index) => (
                    <View key={index} style={styles.noteRow}>
                      <Icon name="information" size={16} color={theme.colors.info.main} />
                      <Text style={styles.noteText}>{note}</Text>
                    </View>
                  ))}
                </View>
              )}
            </Card>
          )}

          {/* Visual Timeline */}
          {result && (
            <Card variant="outlined">
              <Text style={styles.sectionTitle}>Fermentation Timeline</Text>
              <View style={styles.timeline}>
                <View style={styles.timelineBar}>
                  <View
                    style={[
                      styles.timelineProgress,
                      {
                        left: `${(result.minHours / 24) * 100}%`,
                        width: `${((result.maxHours - result.minHours) / 24) * 100}%`,
                        backgroundColor: getTimeColor(result.optimalHours) + '40',
                      },
                    ]}
                  />
                  <View
                    style={[
                      styles.timelineMarker,
                      {
                        left: `${(result.optimalHours / 24) * 100}%`,
                        backgroundColor: getTimeColor(result.optimalHours),
                      },
                    ]}
                  />
                </View>
                <View style={styles.timelineLabels}>
                  <Text style={styles.timelineLabel}>0h</Text>
                  <Text style={styles.timelineLabel}>6h</Text>
                  <Text style={styles.timelineLabel}>12h</Text>
                  <Text style={styles.timelineLabel}>18h</Text>
                  <Text style={styles.timelineLabel}>24h</Text>
                </View>
              </View>
            </Card>
          )}

          {/* Reference */}
          <Card variant="outlined">
            <Text style={styles.infoTitle}>Signs of Proper Fermentation</Text>
            <Text style={styles.infoText}>
              <Text style={styles.infoBold}>Volume:</Text> Dough has risen 50-100% (depends on conditions){'\n'}
              <Text style={styles.infoBold}>Bubbles:</Text> Surface shows scattered bubbles{'\n'}
              <Text style={styles.infoBold}>Dome:</Text> Top is domed, not flat or collapsed{'\n'}
              <Text style={styles.infoBold}>Jiggle:</Text> Dough jiggles when container is shaken{'\n'}
              <Text style={styles.infoBold}>Texture:</Text> Dough feels airy and less dense{'\n\n'}
              <Text style={styles.infoWarning}>Important:</Text> These are estimates. Always judge by dough appearance, not just time!
            </Text>
          </Card>

          {/* Temperature Reference */}
          <Card variant="outlined">
            <Text style={styles.infoTitle}>Temperature Reference</Text>
            <View style={styles.tempRefGrid}>
              <View style={styles.tempRefRow}>
                <View style={[styles.tempRefDot, { backgroundColor: theme.colors.info.main }]} />
                <Text style={styles.tempRefLabel}>Cold (15-18°C / 59-64°F)</Text>
                <Text style={styles.tempRefTime}>8-16 hours</Text>
              </View>
              <View style={styles.tempRefRow}>
                <View style={[styles.tempRefDot, { backgroundColor: theme.colors.success.main }]} />
                <Text style={styles.tempRefLabel}>Cool (18-22°C / 64-72°F)</Text>
                <Text style={styles.tempRefTime}>5-8 hours</Text>
              </View>
              <View style={styles.tempRefRow}>
                <View style={[styles.tempRefDot, { backgroundColor: theme.colors.warning.main }]} />
                <Text style={styles.tempRefLabel}>Warm (22-26°C / 72-79°F)</Text>
                <Text style={styles.tempRefTime}>3-5 hours</Text>
              </View>
              <View style={styles.tempRefRow}>
                <View style={[styles.tempRefDot, { backgroundColor: theme.colors.error.main }]} />
                <Text style={styles.tempRefLabel}>Hot (26-30°C / 79-86°F)</Text>
                <Text style={styles.tempRefTime}>2-3 hours</Text>
              </View>
            </View>
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
  sectionTitle: {
    fontSize: theme.typography.sizes.lg,
    fontWeight: theme.typography.weights.semibold as any,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.md,
  },
  tempRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: theme.spacing.md,
  },
  tempInput: {
    flex: 1,
  },
  tempUnitToggle: {
    flexDirection: 'row',
    marginBottom: theme.spacing.sm,
  },
  unitButton: {
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    backgroundColor: theme.colors.background.default,
    borderWidth: 1,
    borderColor: theme.colors.border.light,
  },
  unitButtonActive: {
    backgroundColor: theme.colors.primary[600],
    borderColor: theme.colors.primary[600],
  },
  unitButtonText: {
    fontSize: theme.typography.sizes.sm,
    fontWeight: theme.typography.weights.medium as any,
    color: theme.colors.text.secondary,
  },
  unitButtonTextActive: {
    color: theme.colors.white,
  },
  fieldLabel: {
    fontSize: theme.typography.sizes.sm,
    fontWeight: theme.typography.weights.medium as any,
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing.sm,
    marginTop: theme.spacing.md,
  },
  strengthGrid: {
    gap: theme.spacing.sm,
  },
  strengthButton: {
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    backgroundColor: theme.colors.background.default,
    borderWidth: 1,
    borderColor: theme.colors.border.light,
  },
  strengthButtonActive: {
    backgroundColor: theme.colors.primary[600],
    borderColor: theme.colors.primary[600],
  },
  strengthLabel: {
    fontSize: theme.typography.sizes.sm,
    fontWeight: theme.typography.weights.semibold as any,
    color: theme.colors.text.primary,
  },
  strengthLabelActive: {
    color: theme.colors.white,
  },
  strengthDesc: {
    fontSize: theme.typography.sizes.xs,
    color: theme.colors.text.secondary,
    marginTop: 2,
  },
  strengthDescActive: {
    color: theme.colors.primary[100],
  },
  doughRow: {
    flexDirection: 'row',
    gap: theme.spacing.md,
  },
  doughInput: {
    flex: 1,
  },
  resultCard: {
    padding: theme.spacing.xl,
  },
  resultTitle: {
    fontSize: theme.typography.sizes.base,
    fontWeight: theme.typography.weights.medium as any,
    color: theme.colors.text.secondary,
    textAlign: 'center',
    marginBottom: theme.spacing.lg,
  },
  timeDisplay: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: theme.spacing.lg,
  },
  timeRange: {
    alignItems: 'center',
  },
  timeRangeLabel: {
    fontSize: theme.typography.sizes.xs,
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing.xs,
  },
  timeRangeValue: {
    fontSize: theme.typography.sizes.xl,
    fontWeight: theme.typography.weights.semibold as any,
  },
  timeOptimal: {
    alignItems: 'center',
  },
  timeOptimalLabel: {
    fontSize: theme.typography.sizes.xs,
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing.xs,
  },
  timeOptimalValue: {
    fontSize: 36,
    fontWeight: theme.typography.weights.bold as any,
  },
  riseTarget: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing.sm,
    paddingTop: theme.spacing.md,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border.light,
  },
  riseTargetText: {
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.text.secondary,
  },
  riseTargetValue: {
    fontWeight: theme.typography.weights.semibold as any,
    color: theme.colors.text.primary,
  },
  notesContainer: {
    marginTop: theme.spacing.md,
    padding: theme.spacing.md,
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.md,
  },
  noteRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.xs,
  },
  noteText: {
    flex: 1,
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.text.secondary,
    lineHeight: 20,
  },
  timeline: {
    marginTop: theme.spacing.sm,
  },
  timelineBar: {
    height: 12,
    backgroundColor: theme.colors.background.default,
    borderRadius: theme.borderRadius.full,
    position: 'relative',
    overflow: 'hidden',
  },
  timelineProgress: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    borderRadius: theme.borderRadius.full,
  },
  timelineMarker: {
    position: 'absolute',
    top: -2,
    width: 16,
    height: 16,
    borderRadius: 8,
    marginLeft: -8,
    borderWidth: 2,
    borderColor: theme.colors.white,
  },
  timelineLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: theme.spacing.xs,
  },
  timelineLabel: {
    fontSize: theme.typography.sizes.xs,
    color: theme.colors.text.disabled,
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
  infoBold: {
    fontWeight: theme.typography.weights.semibold as any,
    color: theme.colors.text.primary,
  },
  infoWarning: {
    fontWeight: theme.typography.weights.semibold as any,
    color: theme.colors.warning.dark,
  },
  tempRefGrid: {
    gap: theme.spacing.sm,
  },
  tempRefRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
  tempRefDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  tempRefLabel: {
    flex: 1,
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.text.secondary,
  },
  tempRefTime: {
    fontSize: theme.typography.sizes.sm,
    fontWeight: theme.typography.weights.medium as any,
    color: theme.colors.text.primary,
  },
});
