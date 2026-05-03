import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import Button from '../../components/Button';
import FactStrip from '../../components/FactStrip';
import FormulaSheet from '../../components/FormulaSheet';
import ModernistScreen from '../../components/ModernistScreen';
import RuleHeader from '../../components/RuleHeader';
import StageDirections from '../../components/StageDirections';
import { ToolsStackParamList } from '../../navigation/types';
import { photoRescueStorage } from '../../services/photoRescueStorage';
import { PhotoRescueDiagnosis } from '../../types';
import { theme } from '../../theme';

type Props = NativeStackScreenProps<ToolsStackParamList, 'PhotoRescueResult'>;

export default function PhotoRescueResultScreen({ route, navigation }: Props) {
  const { diagnosisId } = route.params;
  const [diagnosis, setDiagnosis] = useState<PhotoRescueDiagnosis | null>(null);

  useEffect(() => {
    photoRescueStorage
      .getById(diagnosisId)
      .then(record => setDiagnosis(record?.diagnosis || null));
  }, [diagnosisId]);

  if (!diagnosis) {
    return (
      <ModernistScreen>
        <Text style={styles.title}>Diagnosis not found</Text>
        <Button title="Back to Photo Rescue" onPress={() => navigation.goBack()} />
      </ModernistScreen>
    );
  }

  return (
    <ModernistScreen>
      <View style={styles.header}>
        <Text style={styles.kicker}>DIAGNOSIS RESULT</Text>
        <Text style={styles.title}>{diagnosis.diagnosis}</Text>
        <Text style={styles.summary}>{diagnosis.summary}</Text>
      </View>

      <FactStrip
        items={[
          {
            label: 'Subject',
            value: diagnosis.subject,
            icon: 'crosshairs-gps',
            tone: 'teal',
          },
          {
            label: 'Stage',
            value: diagnosis.stage || 'not set',
            icon: 'timeline-clock-outline',
          },
          {
            label: 'Confidence',
            value: diagnosis.confidence,
            icon: 'gauge',
            tone:
              diagnosis.confidence === 'high'
                ? 'green'
                : diagnosis.confidence === 'medium'
                  ? 'copper'
                  : 'red',
          },
          {
            label: 'Mode',
            value: diagnosis.summary.includes('Using quick rescue checklist')
              ? 'Quick Rescue'
              : 'Photo analysis',
            icon: 'clipboard-check-outline',
          },
        ]}
      />

      <FormulaSheet style={styles.section} accented>
        <RuleHeader title="What I See" />
        {diagnosis.visualEvidence.map((item, index) => (
          <Text key={index} style={styles.bullet}>
            {index + 1}. {item}
          </Text>
        ))}
      </FormulaSheet>

      <FormulaSheet style={styles.section}>
        <RuleHeader title="Do Now" />
        <StageDirections
          stages={diagnosis.doNow.map((item, index) => ({
            stage: `${index + 1}`,
            text: `${item.title}: ${item.details}`,
          }))}
        />
      </FormulaSheet>

      <FormulaSheet style={styles.section}>
        <RuleHeader title="Next Bake" />
        {diagnosis.nextBake.map((item, index) => (
          <Text key={index} style={styles.bullet}>
            {index + 1}. {item}
          </Text>
        ))}
      </FormulaSheet>

      <FormulaSheet style={styles.section}>
        <RuleHeader title="Caution" />
        <Text style={styles.risk}>{diagnosis.risk}</Text>
      </FormulaSheet>

      <Button
        title="Create Bake Plan"
        leftIcon="calendar-clock"
        fullWidth
        onPress={() =>
          navigation.navigate('BakePlanner', {
            diagnosisId: diagnosis.id,
          })
        }
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
  summary: {
    fontFamily: theme.typography.fonts.regular,
    fontSize: theme.typography.sizes.base,
    lineHeight: 24,
    color: theme.colors.modernist.graphiteMuted,
    marginTop: theme.spacing.sm,
  },
  section: {
    marginTop: theme.spacing.lg,
  },
  bullet: {
    fontFamily: theme.typography.fonts.regular,
    fontSize: theme.typography.sizes.sm,
    lineHeight: 21,
    color: theme.colors.modernist.ink,
    paddingVertical: 4,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.modernist.hairline,
  },
  risk: {
    fontFamily: theme.typography.fonts.medium,
    fontSize: theme.typography.sizes.sm,
    lineHeight: 21,
    color: theme.colors.modernist.heatRed,
  },
});
