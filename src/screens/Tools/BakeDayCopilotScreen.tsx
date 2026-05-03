import React, { useState, useMemo, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Switch,
  Platform,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useRoute, RouteProp, useFocusEffect } from '@react-navigation/native';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';

import { theme } from '../../theme';
import Button from '../../components/Button';
import ModernistScreen from '../../components/ModernistScreen';
import FormulaSheet from '../../components/FormulaSheet';
import RuleHeader from '../../components/RuleHeader';
import FactStrip from '../../components/FactStrip';
import type { FactCell } from '../../components/FactStrip';
import SegmentedControl from '../../components/SegmentedControl';
import BasicInput from '../../components/BasicInput';
import TimelineRail from '../../components/TimelineRail';
import type { TimelineStep } from '../../components/TimelineRail';
import type { ToolsStackParamList } from '../../navigation/types';
import type {
  BakePlanInput,
  StarterReadiness,
  ScheduleStyle,
  BakeStepType,
  SavedBakePlanRecord,
} from '../../types/photoRescue';
import {
  generateBakePlan,
  STEP_ICON_MAP,
  formatStepTime,
  formatStepDay,
} from '../../utils/bakeDayTimeline';
import { bakePlanStorage } from '../../services/bakePlanStorage';
import { saveRecipe } from '../../services/recipeStorage';

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

const SCHEDULE_LABEL: Record<ScheduleStyle, string> = {
  'same-day': 'Same day',
  'overnight-cold-proof': 'Overnight cold proof',
};

const STARTER_LABEL: Record<StarterReadiness, string> = {
  weak: 'Weak',
  okay: 'Okay',
  strong: 'Strong',
};

const RISK_TONE: Record<'low' | 'medium' | 'high', FactCell['tone']> = {
  low: 'green',
  medium: 'amber',
  high: 'red',
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

function formatTotalElapsed(steps: { startsAt: string }[]): string {
  if (steps.length < 2) return '—';
  const first = new Date(steps[0].startsAt).getTime();
  const last = new Date(steps[steps.length - 1].startsAt).getTime();
  const totalMin = Math.max(0, Math.round((last - first) / 60000));
  const hours = Math.floor(totalMin / 60);
  const mins = totalMin % 60;
  if (hours === 0) return `${mins}m`;
  if (mins === 0) return `${hours}h`;
  return `${hours}h ${mins}m`;
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
  const [bakeHour, setBakeHour] = useState(10);
  const [bakeDayOffset, setBakeDayOffset] = useState(1);
  const [recipeName, setRecipeName] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [savedId, setSavedId] = useState<string | null>(null);
  const [pastPlans, setPastPlans] = useState<SavedBakePlanRecord[]>([]);
  const [expandedPlanId, setExpandedPlanId] = useState<string | null>(null);
  const [savedRecord, setSavedRecord] = useState<SavedBakePlanRecord | null>(null);
  const [isStarting, setIsStarting] = useState(false);

  const input: BakePlanInput = useMemo(
    () => ({
      targetBakeAt: buildBakeAt(bakeDayOffset, bakeHour),
      roomTempF: parseFloat(roomTemp) || 72,
      starterReadiness,
      scheduleStyle,
      hydrationPercent: parseFloat(hydration) || 78,
      loafCount: parseInt(loafCount, 10) || 1,
      diagnosis,
      remindersEnabled: remindersEnabled && !remindersUnavailable,
    }),
    [
      roomTemp,
      starterReadiness,
      scheduleStyle,
      hydration,
      loafCount,
      diagnosis,
      remindersEnabled,
      remindersUnavailable,
      bakeDayOffset,
      bakeHour,
    ]
  );

  // Plan auto-generates on every input change so the golden demo path
  // surfaces a timeline immediately.
  const plan = useMemo(() => generateBakePlan(input), [input]);

  useEffect(() => {
    bakePlanStorage.save(plan).then(setSavedRecord).catch((err) => {
      console.error('Failed to persist bake plan', err);
    });
  }, [plan]);

  // Reload past plans and the active record whenever the screen comes into focus
  useFocusEffect(
    useCallback(() => {
      bakePlanStorage.getAll().then(setPastPlans).catch(() => {});
      bakePlanStorage.getActive().then(setSavedRecord).catch(() => {});
    }, [])
  );

  const isStarted = !!savedRecord?.startedAt;

  const handleStartBake = useCallback(async () => {
    if (!savedRecord) return;
    setIsStarting(true);
    try {
      const updated = await bakePlanStorage.startPlan(savedRecord.id);
      setSavedRecord(updated);
      const all = await bakePlanStorage.getAll();
      setPastPlans(all);
    } catch (err) {
      Alert.alert('Could not start bake plan', 'Please try again.');
    } finally {
      setIsStarting(false);
    }
  }, [savedRecord]);

  // When a bake has been started, show live timestamps from the started record.
  const displaySteps = isStarted && savedRecord ? savedRecord.plan.steps : plan.steps;

  const timelineSteps: TimelineStep[] = useMemo(() => {
    const now = new Date();
    return displaySteps.map((step) => {
      const stepTime = new Date(step.startsAt);
      const state =
        stepTime < now
          ? 'past'
          : stepTime.getTime() - now.getTime() < 30 * 60000
          ? 'active'
          : 'upcoming';
      return {
        id: step.id,
        icon: STEP_ICON_MAP[step.type as BakeStepType] ?? 'clock-outline',
        timeLabel: `${formatStepDay(step.startsAt)} · ${formatStepTime(step.startsAt)}`,
        title: step.title,
        notes: step.notes,
        state,
      };
    });
  }, [displaySteps]);

  const handleReminderToggle = (val: boolean) => {
    if (remindersUnavailable) return;
    setRemindersEnabled(val);
  };

  // Top fact strip
  const targetBakeAt = new Date(input.targetBakeAt);
  const topFacts: FactCell[] = [
    {
      label: 'TARGET BAKE TIME',
      value: `${formatStepDay(input.targetBakeAt)} · ${formatStepTime(input.targetBakeAt)}`,
      icon: 'pot-steam',
    },
    {
      label: 'TOTAL ELAPSED',
      value: formatTotalElapsed(plan.steps),
      icon: 'timer-sand',
      numeric: true,
    },
    {
      label: 'SCHEDULE STYLE',
      value: SCHEDULE_LABEL[scheduleStyle],
      icon: 'calendar-blank-outline',
    },
  ];

  // Notes table data — label flex, value right-aligned.
  const notes: { label: string; value: string }[] = [
    { label: 'Starter', value: STARTER_LABEL[starterReadiness] },
    { label: 'Room temp', value: `${input.roomTempF}°F` },
    { label: 'Hydration', value: `${input.hydrationPercent}%` },
    { label: 'Schedule style', value: SCHEDULE_LABEL[scheduleStyle] },
    { label: 'Loaves', value: String(input.loafCount) },
    {
      label: 'Bake at',
      value: targetBakeAt.toLocaleString([], {
        weekday: 'short',
        hour: '2-digit',
        minute: '2-digit',
      }),
    },
  ];

  const riskNonLow = plan.fermentationRisk !== 'low';

  const defaultRecipeName = useMemo(() => {
    const style = scheduleStyle === 'overnight-cold-proof' ? 'Overnight' : 'Same Day';
    return `${style} Sourdough ${input.hydrationPercent}%`;
  }, [scheduleStyle, input.hydrationPercent]);

  const handleSaveRecipe = async () => {
    const name = recipeName.trim() || defaultRecipeName;
    setIsSaving(true);
    try {
      const flourBase = 500 * (parseInt(loafCount, 10) || 1);
      const hydPct = input.hydrationPercent;
      const saved = await saveRecipe({
        name,
        description: `${SCHEDULE_LABEL[scheduleStyle]} · ${hydPct}% hydration · ${input.loafCount} loaf${input.loafCount !== 1 ? 'es' : ''} · Room ${input.roomTempF}°F`,
        formula: {
          flour: flourBase,
          water: hydPct,
          salt: 2,
          starter: 20,
        },
        hydration: hydPct,
        totalWeight: Math.round(flourBase * (1 + hydPct / 100 + 0.02 + 0.2)),
        instructions: plan.steps
          .map((s, i) => `${i + 1}. ${s.title}${s.notes ? ': ' + s.notes : ''}`)
          .join('\n'),
      });
      setSavedId(saved.id);
      Alert.alert('Saved!', `"${name}" has been added to My Recipes.`);
    } catch {
      Alert.alert('Error', 'Could not save the recipe. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <ModernistScreen background="paper">
      <View style={styles.titleBlock}>
        <Text style={styles.eyebrow}>BAKE DAY COPILOT</Text>
        <Text style={styles.title}>Your bake plan</Text>
      </View>

      {/* Diagnosis handoff (when arriving from Photo Rescue) */}
      {diagnosis ? (
        <FormulaSheet
          background="porcelain"
          padding="md"
          style={styles.diagnosisSheet}
        >
          <View style={styles.diagnosisRow}>
            <Icon
              name="camera-outline"
              size={14}
              color={theme.colors.primary[600]}
            />
            <Text style={styles.diagnosisLabel}>FROM PHOTO RESCUE</Text>
          </View>
          <Text style={styles.diagnosisDiag}>{diagnosis.diagnosis}</Text>
          {seedAdjustments.length > 0 ? (
            <View style={styles.adjustments}>
              {seedAdjustments.map((adj, i) => (
                <Text key={i} style={styles.adjustmentText}>
                  · {adj}
                </Text>
              ))}
            </View>
          ) : null}
        </FormulaSheet>
      ) : null}

      {/* Top fact strip */}
      <FormulaSheet
        topRule
        background="porcelain"
        padding="md"
        style={styles.factSheet}
      >
        <FactStrip facts={topFacts} />
      </FormulaSheet>

      {/* Inputs */}
      <View style={styles.section}>
        <RuleHeader title="PLAN INPUTS" />
        <FormulaSheet background="porcelain" padding="lg">
          <Text style={styles.fieldLabel}>BAKE DAY</Text>
          <View style={styles.chipsRow}>
            {BAKE_DAY_OPTIONS.map((opt) => {
              const active = bakeDayOffset === opt.offset;
              return (
                <TouchableOpacity
                  key={opt.offset}
                  onPress={() => setBakeDayOffset(opt.offset)}
                  style={[styles.chip, active && styles.chipActive]}
                  activeOpacity={0.8}
                >
                  <Text style={[styles.chipText, active && styles.chipTextActive]}>
                    {opt.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          <Text style={[styles.fieldLabel, styles.gapTop]}>BAKE TIME</Text>
          <View style={styles.chipsRow}>
            {BAKE_TIME_OPTIONS.map((opt) => {
              const active = bakeHour === opt.hours;
              return (
                <TouchableOpacity
                  key={opt.hours}
                  onPress={() => setBakeHour(opt.hours)}
                  style={[styles.chip, active && styles.chipActive]}
                  activeOpacity={0.8}
                >
                  <Text style={[styles.chipText, active && styles.chipTextActive]}>
                    {opt.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          <Text style={[styles.fieldLabel, styles.gapTop]}>SCHEDULE STYLE</Text>
          <SegmentedControl
            options={SCHEDULE_OPTIONS}
            value={scheduleStyle}
            onChange={setScheduleStyle}
          />

          <Text style={[styles.fieldLabel, styles.gapTop]}>STARTER READINESS</Text>
          <SegmentedControl
            options={STARTER_OPTIONS}
            value={starterReadiness}
            onChange={setStarterReadiness}
          />

          <View style={[styles.splitRow, styles.gapTop]}>
            <BasicInput
              label="Room temp (°F)"
              value={roomTemp}
              onChangeText={setRoomTemp}
              keyboardType="numeric"
              placeholder="72"
              containerStyle={styles.splitField}
            />
            <BasicInput
              label="Hydration %"
              value={hydration}
              onChangeText={setHydration}
              keyboardType="numeric"
              placeholder="78"
              containerStyle={styles.splitField}
            />
          </View>

          <BasicInput
            label="Loaves"
            value={loafCount}
            onChangeText={setLoafCount}
            keyboardType="numeric"
            placeholder="1"
          />
        </FormulaSheet>
      </View>

      {/* Fermentation risk */}
      <View style={styles.section}>
        <RuleHeader title="FERMENTATION RISK" />
        <FormulaSheet
          background="porcelain"
          padding="lg"
          style={riskNonLow ? styles.riskSheetWarn : undefined}
        >
          <View style={styles.riskHeader}>
            {riskNonLow ? (
              <Icon
                name="alert-outline"
                size={16}
                color={theme.colors.modernist.ruleTeal}
              />
            ) : (
              <Icon
                name="check-circle-outline"
                size={16}
                color={theme.colors.modernist.starterGreen}
              />
            )}
            <Text
              style={[
                styles.riskBadge,
                {
                  color:
                    plan.fermentationRisk === 'high'
                      ? theme.colors.modernist.heatRed
                      : plan.fermentationRisk === 'medium'
                      ? theme.colors.modernist.ruleTeal
                      : theme.colors.modernist.starterGreen,
                },
              ]}
            >
              {plan.fermentationRisk.toUpperCase()} RISK
            </Text>
          </View>
          <Text style={styles.riskNote}>{plan.temperatureNote}</Text>
          <Text style={[styles.riskNote, styles.gapTopSm]}>{plan.starterNote}</Text>
          {input.hydrationPercent >= 80 ? (
            <Text style={[styles.riskNote, styles.gapTopSm, styles.warnLine]}>
              High hydration — expect a slack, sticky dough. Use wet hands throughout.
            </Text>
          ) : null}
        </FormulaSheet>
      </View>

      {/* Bake plan timeline */}
      <View style={styles.section}>
        <RuleHeader
          title="BAKE PLAN"
          trailing={`${displaySteps.length} STEPS`}
        />

        {/* Start / status row */}
        {isStarted ? (
          <View style={styles.startedBanner}>
            <View style={styles.startedBadge}>
              <Icon name="timer-play-outline" size={14} color={theme.colors.modernist.paper} />
              <Text style={styles.startedBadgeText}>BAKE IN PROGRESS</Text>
            </View>
            <TouchableOpacity
              onPress={handleStartBake}
              disabled={isStarting}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Text style={styles.restartLink}>
                {isStarting ? 'Restarting…' : 'Restart from now'}
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          <Button
            title={isStarting ? 'STARTING…' : 'START THIS BAKE'}
            onPress={handleStartBake}
            loading={isStarting}
            fullWidth
            leftIcon="play-circle-outline"
            style={styles.startButton}
          />
        )}

        <FormulaSheet background="porcelain" padding="lg">
          <TimelineRail steps={timelineSteps} />
        </FormulaSheet>
      </View>

      {/* Notes table */}
      <View style={styles.section}>
        <RuleHeader title="NOTES" />
        <FormulaSheet background="porcelain" padding="lg">
          {notes.map((row, i) => (
            <View
              key={row.label}
              style={[styles.noteRow, i > 0 && styles.noteRowBorder]}
            >
              <Text style={styles.noteLabel}>{row.label}</Text>
              <Text style={styles.noteValue} numberOfLines={1}>
                {row.value}
              </Text>
            </View>
          ))}
        </FormulaSheet>
      </View>

      {/* Reminder toggle */}
      <View style={styles.section}>
        <RuleHeader title="REMINDERS" />
        <FormulaSheet background="porcelain" padding="md">
          {remindersUnavailable ? (
            <View style={styles.reminderRow}>
              <Icon
                name="bell-off-outline"
                size={16}
                color={theme.colors.modernist.graphiteMuted}
              />
              <Text style={styles.reminderText}>
                Reminders aren't available on web. Open the app on your phone to enable
                step alerts.
              </Text>
            </View>
          ) : (
            <View style={styles.reminderRow}>
              <Icon
                name={remindersEnabled ? 'bell-outline' : 'bell-off-outline'}
                size={16}
                color={
                  remindersEnabled
                    ? theme.colors.primary[600]
                    : theme.colors.modernist.graphiteMuted
                }
              />
              <Text style={styles.reminderText}>
                {remindersEnabled
                  ? 'Step reminders are on. We\'ll alert you before each step.'
                  : 'Step reminders are off.'}
              </Text>
              <Switch
                value={remindersEnabled}
                onValueChange={handleReminderToggle}
                trackColor={{
                  true: theme.colors.primary[600],
                  false: theme.colors.modernist.hairlineDark,
                }}
                thumbColor={theme.colors.modernist.paper}
              />
            </View>
          )}
        </FormulaSheet>
      </View>

      {/* Save to My Recipes */}
      <View style={styles.section}>
        <RuleHeader title="SAVE TO MY RECIPES" />
        <FormulaSheet background="porcelain" padding="lg">
          <BasicInput
            label="Recipe name"
            placeholder={defaultRecipeName}
            value={recipeName}
            onChangeText={setRecipeName}
          />
          {savedId ? (
            <View style={styles.savedRow}>
              <Icon name="check-circle-outline" size={16} color={theme.colors.modernist.starterGreen} />
              <Text style={styles.savedText}>Saved to My Recipes</Text>
            </View>
          ) : null}
          <Button
            title={savedId ? 'SAVE AGAIN' : 'SAVE TO MY RECIPES'}
            onPress={handleSaveRecipe}
            loading={isSaving}
            fullWidth
            leftIcon="bookmark-outline"
          />
        </FormulaSheet>
      </View>

      {/* Past Plans */}
      {pastPlans.length > 0 && (
        <View style={styles.section}>
          <RuleHeader
            title="PAST PLANS"
            trailing={`${pastPlans.length} SAVED`}
          />
          <FormulaSheet background="porcelain" padding="none">
            {pastPlans.map((record, idx) => {
              const bakeStep = record.plan.steps.find(s => s.type === 'bake');
              const targetStep = bakeStep ?? record.plan.steps[record.plan.steps.length - 1];
              const bakeLabel = targetStep
                ? `${formatStepDay(targetStep.startsAt)} · ${formatStepTime(targetStep.startsAt)}`
                : '—';
              const style = record.plan.input.scheduleStyle === 'overnight-cold-proof'
                ? 'Overnight'
                : 'Same Day';
              const isExpanded = expandedPlanId === record.id;
              const pastSteps: TimelineStep[] = record.plan.steps.map(step => ({
                id: step.id,
                icon: STEP_ICON_MAP[step.type as BakeStepType] ?? 'clock-outline',
                timeLabel: `${formatStepDay(step.startsAt)} · ${formatStepTime(step.startsAt)}`,
                title: step.title,
                notes: step.notes,
                state: new Date(step.startsAt) < new Date() ? 'past' : 'upcoming',
              }));

              return (
                <TouchableOpacity
                  key={record.id}
                  activeOpacity={0.8}
                  onPress={() => setExpandedPlanId(isExpanded ? null : record.id)}
                  style={[
                    styles.pastPlanRow,
                    idx > 0 && styles.pastPlanRowBorder,
                  ]}
                >
                  <View style={styles.pastPlanHeader}>
                    <View style={styles.pastPlanInfo}>
                      <Text style={styles.pastPlanBakeAt}>{bakeLabel}</Text>
                      <Text style={styles.pastPlanMeta}>
                        {style} · {record.plan.input.hydrationPercent}% hydration · {record.plan.steps.length} steps
                      </Text>
                    </View>
                    <Icon
                      name={isExpanded ? 'chevron-up' : 'chevron-down'}
                      size={18}
                      color={theme.colors.modernist.graphiteMuted}
                    />
                  </View>
                  {isExpanded && (
                    <View style={styles.pastPlanTimeline}>
                      <TimelineRail steps={pastSteps} />
                    </View>
                  )}
                </TouchableOpacity>
              );
            })}
          </FormulaSheet>
        </View>
      )}

      <View style={styles.actions}>
        <Button
          title="REFRESH PLAN"
          onPress={() => bakePlanStorage.save(plan).catch(() => undefined)}
          fullWidth
          variant="outline"
          leftIcon="refresh"
        />
      </View>
    </ModernistScreen>
  );
}

const styles = StyleSheet.create({
  titleBlock: {
    marginBottom: theme.spacing.md,
  },
  eyebrow: {
    fontFamily: theme.typography.roles.bodySemibold,
    fontSize: 11,
    color: theme.colors.modernist.graphiteMuted,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  title: {
    fontFamily: theme.typography.roles.display,
    fontSize: theme.typography.sizes['2xl'],
    color: theme.colors.modernist.ink,
  },

  diagnosisSheet: {
    marginBottom: theme.spacing.md,
    borderColor: theme.colors.modernist.tealSoft,
  },
  diagnosisRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  diagnosisLabel: {
    fontFamily: theme.typography.roles.bodySemibold,
    fontSize: 11,
    color: theme.colors.primary[600],
    letterSpacing: 0.6,
  },
  diagnosisDiag: {
    fontFamily: theme.typography.roles.bodyMedium,
    fontSize: 14,
    color: theme.colors.modernist.ink,
    lineHeight: 20,
  },
  adjustments: {
    marginTop: theme.spacing.sm,
    paddingTop: theme.spacing.sm,
    borderTopWidth: 1,
    borderTopColor: theme.colors.modernist.hairline,
  },
  adjustmentText: {
    fontFamily: theme.typography.roles.body,
    fontSize: 13,
    color: theme.colors.modernist.graphiteMuted,
    lineHeight: 18,
  },

  factSheet: {
    marginTop: theme.spacing.sm,
  },

  section: {
    marginTop: theme.spacing.lg,
  },

  fieldLabel: {
    fontFamily: theme.typography.roles.bodySemibold,
    fontSize: 11,
    color: theme.colors.modernist.graphiteMuted,
    letterSpacing: 0.6,
    textTransform: 'uppercase',
    marginBottom: theme.spacing.sm,
  },
  gapTop: {
    marginTop: theme.spacing.lg,
  },
  gapTopSm: {
    marginTop: theme.spacing.sm,
  },
  chipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.xs,
  },
  chip: {
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: 6,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: theme.colors.modernist.hairlineDark,
    backgroundColor: theme.colors.modernist.paper,
  },
  chipActive: {
    backgroundColor: theme.colors.modernist.ink,
    borderColor: theme.colors.modernist.ink,
  },
  chipText: {
    fontFamily: theme.typography.roles.bodyMedium,
    fontSize: 12,
    color: theme.colors.modernist.ink,
  },
  chipTextActive: {
    color: theme.colors.modernist.paper,
  },
  splitRow: {
    flexDirection: 'row',
    gap: theme.spacing.md,
  },
  splitField: {
    flex: 1,
    marginBottom: theme.spacing.sm,
  },

  riskSheetWarn: {
    borderColor: theme.colors.modernist.ruleTeal,
  },
  riskHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: theme.spacing.sm,
  },
  riskBadge: {
    fontFamily: theme.typography.roles.bodySemibold,
    fontSize: 11,
    letterSpacing: 0.6,
  },
  riskNote: {
    fontFamily: theme.typography.roles.body,
    fontSize: 14,
    color: theme.colors.modernist.graphite,
    lineHeight: 20,
  },
  warnLine: {
    color: theme.colors.modernist.ruleTeal,
  },

  noteRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },
  noteRowBorder: {
    borderTopWidth: 1,
    borderTopColor: theme.colors.modernist.hairline,
  },
  noteLabel: {
    flex: 1,
    fontFamily: theme.typography.roles.bodyMedium,
    fontSize: 13,
    color: theme.colors.modernist.ink,
  },
  noteValue: {
    fontFamily: theme.typography.roles.bodySemibold,
    fontSize: 13,
    color: theme.colors.modernist.graphite,
    textAlign: 'right',
    fontVariant: ['tabular-nums'],
  },

  reminderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
  reminderText: {
    flex: 1,
    fontFamily: theme.typography.roles.body,
    fontSize: 13,
    color: theme.colors.modernist.graphite,
    lineHeight: 18,
  },

  savedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: theme.spacing.sm,
  },
  savedText: {
    fontFamily: theme.typography.roles.bodyMedium,
    fontSize: 13,
    color: theme.colors.modernist.starterGreen,
  },
  startButton: {
    marginBottom: theme.spacing.sm,
  },
  startedBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: theme.colors.modernist.starterGreen,
    borderRadius: 8,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    marginBottom: theme.spacing.sm,
  },
  startedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  startedBadgeText: {
    fontFamily: theme.typography.roles.bodySemibold,
    fontSize: 12,
    color: theme.colors.modernist.paper,
    letterSpacing: 0.8,
  },
  restartLink: {
    fontFamily: theme.typography.roles.bodyMedium,
    fontSize: 12,
    color: theme.colors.modernist.paper,
    textDecorationLine: 'underline',
    opacity: 0.85,
  },
  pastPlanRow: {
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
  },
  pastPlanRowBorder: {
    borderTopWidth: 1,
    borderTopColor: theme.colors.modernist.hairline,
  },
  pastPlanHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  pastPlanInfo: {
    flex: 1,
    paddingRight: theme.spacing.sm,
  },
  pastPlanBakeAt: {
    fontFamily: theme.typography.roles.bodySemibold,
    fontSize: 14,
    color: theme.colors.modernist.ink,
    marginBottom: 2,
  },
  pastPlanMeta: {
    fontFamily: theme.typography.roles.body,
    fontSize: 12,
    color: theme.colors.modernist.graphiteMuted,
  },
  pastPlanTimeline: {
    marginTop: theme.spacing.md,
    paddingTop: theme.spacing.md,
    borderTopWidth: 1,
    borderTopColor: theme.colors.modernist.hairline,
  },
  actions: {
    marginTop: theme.spacing.xl,
    marginBottom: theme.spacing.lg,
  },
});
