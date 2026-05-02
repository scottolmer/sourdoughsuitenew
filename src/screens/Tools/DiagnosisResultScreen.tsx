import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';

import { theme } from '../../theme';
import Button from '../../components/Button';
import ModernistScreen from '../../components/ModernistScreen';
import FormulaSheet from '../../components/FormulaSheet';
import RuleHeader from '../../components/RuleHeader';
import FactStrip from '../../components/FactStrip';
import type { FactCell } from '../../components/FactStrip';
import StageDirections from '../../components/StageDirections';
import type { StageDirection } from '../../components/StageDirections';
import type { ToolsStackParamList } from '../../navigation/types';
import type { Confidence } from '../../types/photoRescue';
import { diagnosisStorage } from '../../services/diagnosisStorage';

type RouteType = RouteProp<ToolsStackParamList, 'DiagnosisResult'>;
type NavigationProp = NativeStackNavigationProp<ToolsStackParamList>;

const SUBJECT_LABEL: Record<string, string> = {
  dough: 'Dough',
  starter: 'Starter',
  crumb: 'Crumb',
  loaf: 'Loaf',
};

const CONFIDENCE_WORD: Record<Confidence, string> = {
  high: 'High',
  medium: 'Medium',
  low: 'Low',
};

const CONFIDENCE_TONE: Record<Confidence, FactCell['tone']> = {
  high: 'green',
  medium: 'copper',
  low: 'red',
};

export default function DiagnosisResultScreen() {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<RouteType>();
  const { diagnosis, imageUri, isQuickRescue } = route.params;

  useEffect(() => {
    diagnosisStorage.save(diagnosis, imageUri).catch((err) => {
      console.error('Failed to persist diagnosis', err);
    });
  }, [diagnosis, imageUri]);

  const handleCreateBakePlan = () => {
    navigation.navigate('BakeDayCopilot', { diagnosis });
  };

  const modeValue = isQuickRescue ? 'Quick rescue' : 'AI analysis';
  const modeTone: FactCell['tone'] = isQuickRescue ? 'amber' : 'teal';

  const facts: FactCell[] = [
    {
      label: 'SUBJECT',
      value: SUBJECT_LABEL[diagnosis.subject] ?? diagnosis.subject,
      icon: 'shape-outline',
    },
    {
      label: 'STAGE',
      value: diagnosis.stage ?? '—',
      icon: 'progress-clock',
    },
    {
      label: 'CONFIDENCE',
      value: CONFIDENCE_WORD[diagnosis.confidence],
      icon: 'gauge',
      tone: CONFIDENCE_TONE[diagnosis.confidence],
    },
    {
      label: 'MODE',
      value: modeValue,
      icon: isQuickRescue ? 'clipboard-check-outline' : 'robot-outline',
      tone: modeTone,
    },
  ];

  // Map "doNow" actions onto StageDirections rows. Action label is the narrow
  // left column; details are the right column. Numbered as ACT 1, ACT 2…
  const directions: StageDirection[] = diagnosis.doNow.map((a, i) => ({
    stage: `ACT ${i + 1}`,
    text: a.title,
    detail: a.details,
    duration:
      a.minutesFromNow !== undefined && a.minutesFromNow > 0
        ? `+${a.minutesFromNow} min`
        : undefined,
  }));

  return (
    <ModernistScreen background="paper">
      {/* Title block */}
      <View style={styles.titleBlock}>
        <Text style={styles.eyebrow}>DIAGNOSIS</Text>
        <Text style={styles.title}>{diagnosis.diagnosis}</Text>
        {isQuickRescue ? (
          <Text style={styles.fallbackLine}>Using quick rescue checklist</Text>
        ) : null}
      </View>

      {/* Fact strip */}
      <FormulaSheet
        topRule
        background="porcelain"
        padding="md"
        style={styles.factSheet}
      >
        <FactStrip facts={facts} />
      </FormulaSheet>

      {imageUri ? (
        <FormulaSheet background="porcelain" padding="none" style={styles.imageSheet}>
          <Image source={{ uri: imageUri }} style={styles.image} resizeMode="cover" />
        </FormulaSheet>
      ) : null}

      {/* Summary */}
      {diagnosis.summary ? (
        <View style={styles.section}>
          <Text style={styles.summaryText}>{diagnosis.summary}</Text>
        </View>
      ) : null}

      {/* WHAT I SEE */}
      {diagnosis.visualEvidence.length > 0 ? (
        <View style={styles.section}>
          <RuleHeader title="WHAT I SEE" />
          <FormulaSheet background="porcelain" padding="lg">
            {diagnosis.visualEvidence.map((ev, i) => (
              <View
                key={i}
                style={[styles.evidenceRow, i > 0 && styles.evidenceRowBorder]}
              >
                <View style={styles.evidenceDot} />
                <Text style={styles.evidenceText}>{ev}</Text>
              </View>
            ))}
          </FormulaSheet>
        </View>
      ) : null}

      {/* DO NOW */}
      {directions.length > 0 ? (
        <View style={styles.section}>
          <RuleHeader title="DO NOW" />
          <FormulaSheet background="porcelain" padding="lg">
            <StageDirections directions={directions} />
          </FormulaSheet>
        </View>
      ) : null}

      {/* NEXT BAKE */}
      {diagnosis.nextBake.length > 0 ? (
        <View style={styles.section}>
          <RuleHeader title="NEXT BAKE" />
          <FormulaSheet background="porcelain" padding="lg">
            {diagnosis.nextBake.map((tip, i) => (
              <View
                key={i}
                style={[styles.evidenceRow, i > 0 && styles.evidenceRowBorder]}
              >
                <Icon
                  name="arrow-right"
                  size={14}
                  color={theme.colors.modernist.ruleTeal}
                  style={styles.nextBakeIcon}
                />
                <Text style={styles.evidenceText}>{tip}</Text>
              </View>
            ))}
          </FormulaSheet>
        </View>
      ) : null}

      {/* CAUTION */}
      {diagnosis.risk ? (
        <View style={styles.section}>
          <RuleHeader title="CAUTION" />
          <FormulaSheet background="porcelain" padding="md" style={styles.cautionSheet}>
            <View style={styles.cautionRow}>
              <Icon
                name="alert-circle-outline"
                size={18}
                color={theme.colors.modernist.heatRed}
              />
              <Text style={styles.cautionText}>{diagnosis.risk}</Text>
            </View>
          </FormulaSheet>
        </View>
      ) : null}

      {/* Things to check (only when present — doesn't break the fixed order) */}
      {diagnosis.missingContextQuestions?.length > 0 ? (
        <View style={styles.section}>
          <RuleHeader title="THINGS TO CHECK" />
          <FormulaSheet background="porcelain" padding="lg">
            {diagnosis.missingContextQuestions.map((q, i) => (
              <View
                key={i}
                style={[styles.evidenceRow, i > 0 && styles.evidenceRowBorder]}
              >
                <Icon
                  name="help-circle-outline"
                  size={14}
                  color={theme.colors.modernist.graphiteMuted}
                  style={styles.nextBakeIcon}
                />
                <Text style={styles.evidenceText}>{q}</Text>
              </View>
            ))}
          </FormulaSheet>
        </View>
      ) : null}

      {/* Actions */}
      <View style={styles.actions}>
        <Button
          title="CREATE BAKE PLAN"
          onPress={handleCreateBakePlan}
          fullWidth
          leftIcon="calendar-clock"
        />
        <TouchableOpacity
          style={styles.backLink}
          onPress={() => navigation.goBack()}
          activeOpacity={0.7}
        >
          <Icon
            name="chevron-left"
            size={16}
            color={theme.colors.modernist.graphiteMuted}
          />
          <Text style={styles.backLinkText}>Analyze another photo</Text>
        </TouchableOpacity>
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
    lineHeight: 34,
  },
  fallbackLine: {
    fontFamily: theme.typography.roles.bodyMedium,
    fontSize: 13,
    color: theme.colors.modernist.copper,
    marginTop: 6,
    letterSpacing: 0.3,
  },

  factSheet: {
    marginTop: theme.spacing.sm,
  },

  imageSheet: {
    marginTop: theme.spacing.lg,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: 200,
  },

  section: {
    marginTop: theme.spacing.lg,
  },
  summaryText: {
    fontFamily: theme.typography.roles.body,
    fontSize: 15,
    color: theme.colors.modernist.graphite,
    lineHeight: 22,
  },

  evidenceRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: theme.spacing.sm,
  },
  evidenceRowBorder: {
    borderTopWidth: 1,
    borderTopColor: theme.colors.modernist.hairline,
  },
  evidenceDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: theme.colors.modernist.ruleTeal,
    marginTop: 8,
    marginRight: theme.spacing.sm,
    flexShrink: 0,
  },
  nextBakeIcon: {
    marginRight: theme.spacing.sm,
    marginTop: 4,
    flexShrink: 0,
  },
  evidenceText: {
    flex: 1,
    fontFamily: theme.typography.roles.body,
    fontSize: 14,
    color: theme.colors.modernist.graphite,
    lineHeight: 20,
  },

  cautionSheet: {
    borderColor: theme.colors.modernist.heatRed,
  },
  cautionRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: theme.spacing.sm,
  },
  cautionText: {
    flex: 1,
    fontFamily: theme.typography.roles.body,
    fontSize: 14,
    color: theme.colors.modernist.heatRed,
    lineHeight: 20,
  },

  actions: {
    marginTop: theme.spacing.xl,
    marginBottom: theme.spacing.lg,
  },
  backLink: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
    paddingVertical: theme.spacing.md,
    marginTop: theme.spacing.sm,
  },
  backLinkText: {
    fontFamily: theme.typography.roles.body,
    fontSize: 13,
    color: theme.colors.modernist.graphiteMuted,
  },
});
