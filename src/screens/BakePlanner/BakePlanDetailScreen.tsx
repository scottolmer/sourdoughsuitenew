import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import Button from '../../components/Button';
import FactStrip from '../../components/FactStrip';
import FormulaSheet from '../../components/FormulaSheet';
import ModernistScreen from '../../components/ModernistScreen';
import RuleHeader from '../../components/RuleHeader';
import TimelineRail from '../../components/TimelineRail';
import { ToolsStackParamList } from '../../navigation/types';
import { bakePlanStorage } from '../../services/bakePlanStorage';
import { BakePlan } from '../../types';
import { theme } from '../../theme';

type Props = NativeStackScreenProps<ToolsStackParamList, 'BakePlanDetail'>;

const formatTime = (iso: string) =>
  new Date(iso).toLocaleString([], {
    weekday: 'short',
    hour: 'numeric',
    minute: '2-digit',
  });

export default function BakePlanDetailScreen({ route, navigation }: Props) {
  const { planId } = route.params;
  const [plan, setPlan] = useState<BakePlan | null>(null);

  useEffect(() => {
    bakePlanStorage.getById(planId).then(record => setPlan(record?.plan || null));
  }, [planId]);

  if (!plan) {
    return (
      <ModernistScreen>
        <Text style={styles.title}>Bake plan not found</Text>
        <Button title="Back to Planner" onPress={() => navigation.goBack()} />
      </ModernistScreen>
    );
  }

  return (
    <ModernistScreen>
      <View style={styles.header}>
        <Text style={styles.kicker}>BAKE PLAN</Text>
        <Text style={styles.title}>Overnight production schedule</Text>
        <Text style={styles.subtitle}>
          Target bake: {new Date(plan.input.targetBakeAt).toLocaleString()}
        </Text>
      </View>

      <FactStrip
        items={[
          {
            label: 'Risk',
            value: plan.fermentationRisk,
            icon: 'alert-circle-outline',
            tone:
              plan.fermentationRisk === 'high'
                ? 'red'
                : plan.fermentationRisk === 'medium'
                  ? 'copper'
                  : 'green',
          },
          {
            label: 'Room',
            value: `${plan.input.roomTempF}F`,
            icon: 'thermometer',
          },
          {
            label: 'Hydration',
            value: `${plan.input.hydrationPercent}%`,
            icon: 'water-percent',
            tone: 'teal',
          },
          {
            label: 'Reminders',
            value: plan.input.remindersEnabled ? 'on' : 'off',
            icon: 'bell-outline',
          },
        ]}
      />

      <FormulaSheet style={styles.section} accented>
        <RuleHeader title="Timeline" />
        <TimelineRail
          items={plan.steps.map(step => ({
            id: step.id,
            time: formatTime(step.startsAt),
            title: step.title,
            notes: step.notes,
            tone:
              step.type === 'bake'
                ? 'copper'
                : step.type === 'bulk-check'
                  ? 'green'
                  : undefined,
          }))}
        />
      </FormulaSheet>

      <FormulaSheet style={styles.section}>
        <RuleHeader title="Notes" />
        <Text style={styles.note}>{plan.temperatureNote}</Text>
        <Text style={styles.note}>{plan.starterNote}</Text>
        <Text style={styles.note}>{plan.hydrationNote}</Text>
      </FormulaSheet>

      <Button
        title="Adjust Plan"
        variant="outline"
        fullWidth
        onPress={() => navigation.navigate('BakePlanner', {})}
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
    fontSize: 32,
    lineHeight: 38,
    color: theme.colors.modernist.ink,
  },
  subtitle: {
    fontFamily: theme.typography.fonts.regular,
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.modernist.graphiteMuted,
    marginTop: theme.spacing.sm,
  },
  section: {
    marginTop: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
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
});
