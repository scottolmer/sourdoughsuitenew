import React, { useEffect, useMemo, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import Button from '../../components/Button';
import BasicInput from '../../components/BasicInput';
import FactStrip from '../../components/FactStrip';
import FormulaSheet from '../../components/FormulaSheet';
import ModernistScreen from '../../components/ModernistScreen';
import ModernistSegmentedControl from '../../components/ModernistSegmentedControl';
import RuleHeader from '../../components/RuleHeader';
import { ToolsStackParamList } from '../../navigation/types';
import { bakePlanStorage } from '../../services/bakePlanStorage';
import { photoRescueStorage } from '../../services/photoRescueStorage';
import { BakePlanInput, PhotoRescueDiagnosis, ScheduleStyle, StarterReadiness } from '../../types';
import { generateBakePlan } from '../../utils/bakePlanner';
import { theme } from '../../theme';

type Props = NativeStackScreenProps<ToolsStackParamList, 'BakePlanner'>;

const defaultTarget = () => {
  const target = new Date();
  target.setDate(target.getDate() + 1);
  target.setHours(18, 0, 0, 0);
  return target.toISOString();
};

export default function BakePlannerScreen({ route, navigation }: Props) {
  const [targetBakeAt, setTargetBakeAt] = useState(defaultTarget());
  const [roomTempF, setRoomTempF] = useState('72');
  const [starterReadiness, setStarterReadiness] =
    useState<StarterReadiness>('okay');
  const [scheduleStyle, setScheduleStyle] =
    useState<ScheduleStyle>('overnight-cold-proof');
  const [hydrationPercent, setHydrationPercent] = useState('78');
  const [loafCount, setLoafCount] = useState('2');
  const [doughWeightG, setDoughWeightG] = useState('1800');
  const [remindersEnabled, setRemindersEnabled] = useState(false);
  const [diagnosis, setDiagnosis] = useState<PhotoRescueDiagnosis | undefined>();

  useEffect(() => {
    if (!route.params?.diagnosisId) return;
    photoRescueStorage.getById(route.params.diagnosisId).then(record => {
      if (record?.diagnosis) {
        setDiagnosis(record.diagnosis);
        setScheduleStyle(
          record.diagnosis.bakePlanSeed?.suggestedStyle ||
            'overnight-cold-proof'
        );
      }
    });
  }, [route.params?.diagnosisId]);

  const input: BakePlanInput = useMemo(
    () => ({
      targetBakeAt,
      roomTempF: Number(roomTempF) || 72,
      starterReadiness,
      scheduleStyle,
      hydrationPercent: Number(hydrationPercent) || 75,
      loafCount: Number(loafCount) || 1,
      doughWeightG: Number(doughWeightG) || undefined,
      starterPercent: 20,
      diagnosis,
      remindersEnabled,
    }),
    [
      diagnosis,
      doughWeightG,
      hydrationPercent,
      loafCount,
      remindersEnabled,
      roomTempF,
      scheduleStyle,
      starterReadiness,
      targetBakeAt,
    ]
  );

  const preview = useMemo(() => generateBakePlan(input), [input]);

  const createPlan = async () => {
    const record = await bakePlanStorage.save(generateBakePlan(input));
    navigation.navigate('BakePlanDetail', { planId: record.id });
  };

  return (
    <ModernistScreen>
      <View style={styles.header}>
        <Text style={styles.kicker}>BAKE DAY COPILOT</Text>
        <Text style={styles.title}>Build a production schedule.</Text>
        <Text style={styles.subtitle}>
          Deterministic timing first. Diagnosis context can tune the plan, but
          the schedule never depends on invented AI times.
        </Text>
      </View>

      <FactStrip
        items={[
          {
            label: 'Risk',
            value: preview.fermentationRisk,
            icon: 'alert-circle-outline',
            tone:
              preview.fermentationRisk === 'high'
                ? 'red'
                : preview.fermentationRisk === 'medium'
                  ? 'copper'
                  : 'green',
          },
          {
            label: 'Style',
            value:
              scheduleStyle === 'overnight-cold-proof'
                ? 'Overnight'
                : 'Same day',
            icon: 'snowflake',
            tone: 'teal',
          },
          {
            label: 'Hydration',
            value: `${input.hydrationPercent}%`,
            icon: 'water-percent',
          },
          {
            label: 'Loaves',
            value: `${input.loafCount}`,
            icon: 'bread-slice',
          },
        ]}
      />

      <FormulaSheet style={styles.section} accented>
        <RuleHeader title="Target" />
        <BasicInput
          label="Target bake time"
          value={targetBakeAt}
          onChangeText={setTargetBakeAt}
          helperText="ISO timestamp for now; the detail view formats it for humans."
        />
        <ModernistSegmentedControl
          value={scheduleStyle}
          onChange={setScheduleStyle}
          options={[
            { label: 'Overnight', value: 'overnight-cold-proof' },
            { label: 'Same Day', value: 'same-day' },
          ]}
        />
      </FormulaSheet>

      <FormulaSheet style={styles.section}>
        <RuleHeader title="Formula Inputs" />
        <View style={styles.row}>
          <BasicInput
            label="Room temp F"
            value={roomTempF}
            keyboardType="numeric"
            onChangeText={setRoomTempF}
            containerStyle={styles.inputHalf}
          />
          <BasicInput
            label="Hydration %"
            value={hydrationPercent}
            keyboardType="numeric"
            onChangeText={setHydrationPercent}
            containerStyle={styles.inputHalf}
          />
        </View>
        <View style={styles.row}>
          <BasicInput
            label="Loaf count"
            value={loafCount}
            keyboardType="numeric"
            onChangeText={setLoafCount}
            containerStyle={styles.inputHalf}
          />
          <BasicInput
            label="Dough weight"
            value={doughWeightG}
            keyboardType="numeric"
            onChangeText={setDoughWeightG}
            containerStyle={styles.inputHalf}
          />
        </View>
        <RuleHeader title="Starter" />
        <ModernistSegmentedControl
          value={starterReadiness}
          onChange={setStarterReadiness}
          options={[
            { label: 'Weak', value: 'weak' },
            { label: 'Okay', value: 'okay' },
            { label: 'Strong', value: 'strong' },
          ]}
        />
      </FormulaSheet>

      {diagnosis ? (
        <FormulaSheet style={styles.section}>
          <RuleHeader title="Diagnosis Seed" />
          <Text style={styles.seed}>{diagnosis.diagnosis}</Text>
          {diagnosis.bakePlanSeed?.adjustments.map((item, index) => (
            <Text key={index} style={styles.adjustment}>
              {index + 1}. {item}
            </Text>
          ))}
        </FormulaSheet>
      ) : null}

      <FormulaSheet style={styles.section}>
        <RuleHeader title="Planner Notes" />
        <Text style={styles.note}>{preview.temperatureNote}</Text>
        <Text style={styles.note}>{preview.starterNote}</Text>
        <Text style={styles.note}>{preview.hydrationNote}</Text>
      </FormulaSheet>

      <Button
        title="Create Bake Plan"
        fullWidth
        leftIcon="calendar-clock"
        onPress={createPlan}
        style={styles.createButton}
      />
      <Button
        title={remindersEnabled ? 'Reminders On' : 'Reminders Off'}
        variant="outline"
        fullWidth
        leftIcon="bell-outline"
        onPress={() => setRemindersEnabled(value => !value)}
        style={styles.reminderButton}
      />
    </ModernistScreen>
  );
}

const styles = StyleSheet.create({
  header: {
    marginBottom: theme.spacing.lg,
  },
  kicker: {
    fontFamily: theme.typography.fonts.semibold,
    fontSize: theme.typography.sizes.xs,
    letterSpacing: 0.8,
    color: theme.colors.modernist.ruleTeal,
    marginBottom: theme.spacing.xs,
  },
  title: {
    fontFamily: theme.typography.fonts.heading,
    fontSize: 34,
    lineHeight: 40,
    color: theme.colors.modernist.ink,
  },
  subtitle: {
    fontFamily: theme.typography.fonts.regular,
    fontSize: theme.typography.sizes.sm,
    lineHeight: 20,
    color: theme.colors.modernist.graphiteMuted,
    marginTop: theme.spacing.sm,
  },
  section: {
    marginTop: theme.spacing.lg,
  },
  row: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
  },
  inputHalf: {
    flex: 1,
  },
  seed: {
    fontFamily: theme.typography.fonts.semibold,
    color: theme.colors.modernist.ink,
    marginBottom: theme.spacing.sm,
  },
  adjustment: {
    fontFamily: theme.typography.fonts.regular,
    color: theme.colors.modernist.graphiteMuted,
    lineHeight: 20,
  },
  note: {
    fontFamily: theme.typography.fonts.regular,
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.modernist.graphiteMuted,
    lineHeight: 20,
    paddingVertical: 5,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.modernist.hairline,
  },
  createButton: {
    marginTop: theme.spacing.lg,
  },
  reminderButton: {
    marginTop: theme.spacing.sm,
  },
});
