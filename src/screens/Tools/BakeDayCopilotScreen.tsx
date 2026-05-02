import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Switch,
  Platform,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { useRoute, RouteProp } from '@react-navigation/native';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';

import { theme } from '../../theme';
import Button from '../../components/Button';
import BenchCard from '../../components/BenchCard';
import SegmentedControl from '../../components/SegmentedControl';
import SectionHeader from '../../components/SectionHeader';
import TimelineRail from '../../components/TimelineRail';
import type { TimelineStep } from '../../components/TimelineRail';
import type { ToolsStackParamList } from '../../navigation/types';
import type {
  BakePlanInput,
  StarterReadiness,
  ScheduleStyle,
  BakeStepType,
} from '../../types/photoRescue';
import { generateBakePlan, STEP_ICON_MAP, formatStepTime, formatStepDay } from '../../utils/bakeDayTimeline';

type RouteType = RouteProp<ToolsStackParamList, 'BakeDayCopilot'>;

const STARTER_OPTIONS: { label: string; value: StarterReadiness }[] = [
  { label: 'Weak', value: 'weak' },
  { label: 'Okay', value: 'okay' },
  { label: 'Strong', value: 'strong' },
];

const SCHEDULE_OPTIONS: { label: string; value: ScheduleStyle }[] = [
  { label: 'Same Day', value: 'same-day' },
  { label: 'Overnight', value: 'overnight-cold-proof' },
];

const RISK_COLORS = {
  low: theme.colors.bench.starterGreen,
  medium: theme.colors.bench.crumb,
  high: theme.colors.bench.heatRed,
};

const BAKE_TIME_OPTIONS = [
  { label: '6 AM', hours: 6 },
  { label: '8 AM', hours: 8 },
  { label: '10 AM', hours: 10 },
  { label: '12 PM', hours: 12 },
  { label: '2 PM', hours: 14 },
  { label: '4 PM', hours: 16 },
  { label: '6 PM', hours: 18 },
];

const BAKE_DAY_OPTIONS = [
  { label: 'Today', offset: 0 },
  { label: 'Tomorrow', offset: 1 },
  { label: 'In 2 days', offset: 2 },
];

function buildBakeAt(dayOffset: number, bakeHour: number): string {
  const d = new Date();
  d.setDate(d.getDate() + dayOffset);
  d.setHours(bakeHour, 0, 0, 0);
  return d.toISOString();
}

export default function BakeDayCopilotScreen() {
  const route = useRoute<RouteType>();
  const { diagnosis } = route.params ?? {};

  const seedStyle = diagnosis?.bakePlanSeed?.suggestedStyle ?? 'overnight-cold-proof';
  const seedAdjustments = diagnosis?.bakePlanSeed?.adjustments ?? [];

  const [scheduleStyle, setScheduleStyle] = useState<ScheduleStyle>(seedStyle);
  const [roomTemp, setRoomTemp] = useState('72');
  const [starterReadiness, setStarterReadiness] = useState<StarterReadiness>('okay');
  const [hydration, setHydration] = useState('78');
  const [loafCount, setLoafCount] = useState('1');
  const [remindersEnabled, setRemindersEnabled] = useState(false);
  const [remindersUnavailable] = useState(Platform.OS === 'web');
  const [planGenerated, setPlanGenerated] = useState(false);
  const [bakeHour, setBakeHour] = useState(10);
  const [bakeDayOffset, setBakeDayOffset] = useState(1);

  const input: BakePlanInput = useMemo(() => ({
    targetBakeAt: buildBakeAt(bakeDayOffset, bakeHour),
    roomTempF: parseFloat(roomTemp) || 72,
    starterReadiness,
    scheduleStyle,
    hydrationPercent: parseFloat(hydration) || 78,
    loafCount: parseInt(loafCount, 10) || 1,
    diagnosis,
    remindersEnabled: remindersEnabled && !remindersUnavailable,
  }), [roomTemp, starterReadiness, scheduleStyle, hydration, loafCount, diagnosis, remindersEnabled, remindersUnavailable, bakeDayOffset, bakeHour]);

  const plan = useMemo(() => {
    if (planGenerated) return generateBakePlan(input);
    return null;
  }, [planGenerated, input]);

  const timelineSteps: TimelineStep[] = useMemo(() => {
    if (!plan) return [];
    const now = new Date();
    return plan.steps.map(step => {
      const stepTime = new Date(step.startsAt);
      const state = stepTime < now ? 'past' : stepTime.getTime() - now.getTime() < 30 * 60000 ? 'active' : 'upcoming';
      return {
        id: step.id,
        icon: STEP_ICON_MAP[step.type as BakeStepType] ?? 'clock-outline',
        timeLabel: `${formatStepDay(step.startsAt)} · ${formatStepTime(step.startsAt)}`,
        title: step.title,
        notes: step.notes,
        state,
      };
    });
  }, [plan]);

  const handleGenerate = () => {
    setPlanGenerated(true);
  };

  const handleReminderToggle = (val: boolean) => {
    if (remindersUnavailable) return;
    setRemindersEnabled(val);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <SectionHeader
        eyebrow="Bake Day Copilot"
        title="Your personalized bake timeline"
        subtitle="Fill in your details and generate a step-by-step overnight bake plan."
      />

      {diagnosis && (
        <BenchCard variant="filled" style={styles.diagnosisCard}>
          <View style={styles.diagnosisRow}>
            <Icon name="camera-outline" size={16} color={theme.colors.bench.copper} />
            <Text style={styles.diagnosisLabel}>From Photo Rescue: </Text>
            <Text style={styles.diagnosisDiag} numberOfLines={1}>{diagnosis.diagnosis}</Text>
          </View>
          {seedAdjustments.length > 0 && (
            <View style={styles.adjustments}>
              {seedAdjustments.map((adj, i) => (
                <Text key={i} style={styles.adjustmentText}>· {adj}</Text>
              ))}
            </View>
          )}
        </BenchCard>
      )}

      <BenchCard variant="default" style={styles.controlStrip}>
        <Text style={styles.controlLabel}>Bake-By Day</Text>
        <View style={styles.chipsRow}>
          {BAKE_DAY_OPTIONS.map(opt => (
            <TouchableOpacity
              key={opt.offset}
              onPress={() => setBakeDayOffset(opt.offset)}
              style={[styles.chip, bakeDayOffset === opt.offset && styles.chipActive]}
            >
              <Text style={[styles.chipText, bakeDayOffset === opt.offset && styles.chipTextActive]}>
                {opt.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={[styles.controlLabel, styles.mt]}>Bake-By Time</Text>
        <View style={styles.chipsRow}>
          {BAKE_TIME_OPTIONS.map(opt => (
            <TouchableOpacity
              key={opt.hours}
              onPress={() => setBakeHour(opt.hours)}
              style={[styles.chip, bakeHour === opt.hours && styles.chipActive]}
            >
              <Text style={[styles.chipText, bakeHour === opt.hours && styles.chipTextActive]}>
                {opt.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={[styles.controlLabel, styles.mt]}>Schedule Style</Text>
        <SegmentedControl
          options={SCHEDULE_OPTIONS}
          value={scheduleStyle}
          onChange={setScheduleStyle}
        />

        <View style={styles.controlRow}>
          <View style={styles.controlHalf}>
            <Text style={styles.controlLabel}>Room Temp (°F)</Text>
            <BenchCard variant="outlined" padding="md" style={styles.inputCard}>
              <TextInput
                value={roomTemp}
                onChangeText={setRoomTemp}
                keyboardType="numeric"
                style={styles.inputText}
                placeholder="72"
                placeholderTextColor={theme.colors.bench.border}
              />
            </BenchCard>
          </View>
          <View style={styles.controlHalf}>
            <Text style={styles.controlLabel}>Hydration %</Text>
            <BenchCard variant="outlined" padding="md" style={styles.inputCard}>
              <TextInput
                value={hydration}
                onChangeText={setHydration}
                keyboardType="numeric"
                style={styles.inputText}
                placeholder="78"
                placeholderTextColor={theme.colors.bench.border}
              />
            </BenchCard>
          </View>
        </View>

        <Text style={styles.controlLabel}>Starter Readiness</Text>
        <SegmentedControl
          options={STARTER_OPTIONS}
          value={starterReadiness}
          onChange={setStarterReadiness}
        />

        <View style={styles.controlRow}>
          <View style={styles.controlHalf}>
            <Text style={styles.controlLabel}>Loaves</Text>
            <BenchCard variant="outlined" padding="md" style={styles.inputCard}>
              <TextInput
                value={loafCount}
                onChangeText={setLoafCount}
                keyboardType="numeric"
                style={styles.inputText}
                placeholder="1"
                placeholderTextColor={theme.colors.bench.border}
              />
            </BenchCard>
          </View>
          <View style={styles.controlHalf}>
            <Text style={styles.controlLabel}>Reminders</Text>
            <BenchCard variant="outlined" padding="md" style={styles.reminderCard}>
              {remindersUnavailable ? (
                <Text style={styles.remindersUnavailableText}>Reminders unavailable here</Text>
              ) : (
                <View style={styles.switchRow}>
                  <Text style={styles.switchLabel}>{remindersEnabled ? 'On' : 'Off'}</Text>
                  <Switch
                    value={remindersEnabled}
                    onValueChange={handleReminderToggle}
                    trackColor={{ true: theme.colors.bench.copper, false: theme.colors.bench.border }}
                    thumbColor={theme.colors.white}
                  />
                </View>
              )}
            </BenchCard>
          </View>
        </View>
      </BenchCard>

      <Button
        title="Generate Bake Plan"
        onPress={handleGenerate}
        fullWidth
        leftIcon="calendar-clock"
        style={styles.generateBtn}
      />

      {plan && (
        <>
          <BenchCard variant="filled" style={styles.insightCard}>
            <View style={styles.insightHeader}>
              <View style={[styles.riskBadge, { backgroundColor: RISK_COLORS[plan.fermentationRisk] + '20' }]}>
                <Text style={[styles.riskLabel, { color: RISK_COLORS[plan.fermentationRisk] }]}>
                  {plan.fermentationRisk.toUpperCase()} RISK
                </Text>
              </View>
            </View>
            <Text style={styles.insightNote}>{plan.temperatureNote}</Text>
            <Text style={[styles.insightNote, styles.mt8]}>{plan.starterNote}</Text>
            {parseFloat(hydration) >= 80 && (
              <BenchCard variant="outlined" style={styles.hydrationWarn} padding="sm">
                <View style={styles.warnRow}>
                  <Icon name="alert-outline" size={16} color={theme.colors.warning.dark} />
                  <Text style={styles.warnText}>High hydration — expect sticky, extensible dough. Use wet hands throughout.</Text>
                </View>
              </BenchCard>
            )}
          </BenchCard>

          <View style={styles.timelineSection}>
            <Text style={styles.sectionLabel}>YOUR BAKE TIMELINE</Text>
            <BenchCard variant="default">
              <TimelineRail steps={timelineSteps} />
            </BenchCard>
          </View>
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background.default,
  },
  content: {
    padding: theme.spacing.lg,
    paddingBottom: theme.spacing['2xl'],
  },
  diagnosisCard: {
    marginBottom: theme.spacing.lg,
    borderColor: theme.colors.bench.border,
  },
  diagnosisRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xs,
    flexWrap: 'wrap',
  },
  diagnosisLabel: {
    fontFamily: theme.typography.fonts.semibold,
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.bench.copper,
  },
  diagnosisDiag: {
    flex: 1,
    fontFamily: theme.typography.fonts.regular,
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.bench.crust,
  },
  adjustments: {
    marginTop: theme.spacing.sm,
    paddingTop: theme.spacing.sm,
    borderTopWidth: 1,
    borderTopColor: theme.colors.bench.borderSoft,
  },
  adjustmentText: {
    fontFamily: theme.typography.fonts.regular,
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.text.secondary,
    lineHeight: 20,
  },
  chipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.sm,
  },
  chip: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.full,
    borderWidth: 1,
    borderColor: theme.colors.bench.border,
    backgroundColor: theme.colors.background.paper,
  },
  chipActive: {
    backgroundColor: theme.colors.bench.copper,
    borderColor: theme.colors.bench.copper,
  },
  chipText: {
    fontFamily: theme.typography.fonts.semibold,
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.bench.crustSoft,
  },
  chipTextActive: {
    color: theme.colors.white,
  },
  mt: {
    marginTop: theme.spacing.md,
  },
  controlStrip: {
    marginBottom: theme.spacing.lg,
    gap: theme.spacing.lg,
  },
  controlRow: {
    flexDirection: 'row',
    gap: theme.spacing.md,
  },
  controlHalf: {
    flex: 1,
  },
  controlLabel: {
    fontFamily: theme.typography.fonts.semibold,
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.bench.crustSoft,
    marginBottom: theme.spacing.sm,
  },
  inputCard: {
    borderRadius: theme.borderRadius.lg,
  },
  inputText: {
    fontFamily: theme.typography.fonts.regular,
    fontSize: theme.typography.sizes.base,
    color: theme.colors.bench.crust,
  },
  reminderCard: {
    borderRadius: theme.borderRadius.lg,
    justifyContent: 'center',
  },
  remindersUnavailableText: {
    fontFamily: theme.typography.fonts.regular,
    fontSize: theme.typography.sizes.xs,
    color: theme.colors.text.disabled,
    textAlign: 'center',
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  switchLabel: {
    fontFamily: theme.typography.fonts.regular,
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.bench.crustSoft,
  },
  generateBtn: {
    marginBottom: theme.spacing.lg,
  },
  insightCard: {
    marginBottom: theme.spacing.lg,
    borderColor: theme.colors.bench.border,
  },
  insightHeader: {
    flexDirection: 'row',
    marginBottom: theme.spacing.sm,
  },
  riskBadge: {
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: 4,
    borderRadius: theme.borderRadius.full,
  },
  riskLabel: {
    fontFamily: theme.typography.fonts.semibold,
    fontSize: theme.typography.sizes.xs,
    letterSpacing: 0.5,
  },
  insightNote: {
    fontFamily: theme.typography.fonts.regular,
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.bench.crust,
    lineHeight: 20,
  },
  mt8: {
    marginTop: theme.spacing.sm,
  },
  hydrationWarn: {
    marginTop: theme.spacing.md,
    borderColor: theme.colors.warning.main + '44',
    backgroundColor: theme.colors.warning.light,
  },
  warnRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: theme.spacing.sm,
  },
  warnText: {
    flex: 1,
    fontFamily: theme.typography.fonts.regular,
    fontSize: theme.typography.sizes.xs,
    color: theme.colors.warning.dark,
    lineHeight: 18,
  },
  timelineSection: {
    marginBottom: theme.spacing.lg,
  },
  sectionLabel: {
    fontFamily: theme.typography.fonts.semibold,
    fontSize: theme.typography.sizes.xs,
    color: theme.colors.bench.copperDark,
    letterSpacing: 0.7,
    textTransform: 'uppercase',
    marginBottom: theme.spacing.md,
  },
});
