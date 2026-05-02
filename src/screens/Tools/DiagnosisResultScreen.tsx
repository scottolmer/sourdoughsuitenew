import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';

import { theme } from '../../theme';
import Button from '../../components/Button';
import BenchCard from '../../components/BenchCard';
import ResultHero from '../../components/ResultHero';
import SectionHeader from '../../components/SectionHeader';
import type { ToolsStackParamList } from '../../navigation/types';
import type { Confidence } from '../../types/photoRescue';
import { diagnosisStorage } from '../../services/diagnosisStorage';

type RouteType = RouteProp<ToolsStackParamList, 'DiagnosisResult'>;
type NavigationProp = NativeStackNavigationProp<ToolsStackParamList>;

const CONFIDENCE_LABEL: Record<Confidence, string> = {
  high: 'High confidence',
  medium: 'Medium confidence',
  low: 'Low confidence — review carefully',
};

const CONFIDENCE_TONE: Record<Confidence, 'high' | 'medium' | 'low'> = {
  high: 'high',
  medium: 'medium',
  low: 'low',
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

  const imageSource = imageUri ? { uri: imageUri } : undefined;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {isQuickRescue && (
        <BenchCard variant="filled" style={styles.quickRescueBanner}>
          <View style={styles.bannerRow}>
            <Icon name="clipboard-check-outline" size={18} color={theme.colors.bench.copper} />
            <Text style={styles.bannerText}>Using quick rescue checklist</Text>
          </View>
          <Text style={styles.bannerSub}>Results below are rule-based — your photo was not analyzed by AI.</Text>
        </BenchCard>
      )}

      <ResultHero
        image={imageSource}
        icon={imageSource ? undefined : 'grain'}
        title={diagnosis.diagnosis}
        confidence={1}
        confidenceTone={CONFIDENCE_TONE[diagnosis.confidence]}
        confidenceLabel={CONFIDENCE_LABEL[diagnosis.confidence]}
      />

      <View style={styles.section}>
        <BenchCard variant="default">
          <Text style={styles.summaryText}>{diagnosis.summary}</Text>
        </BenchCard>
      </View>

      {diagnosis.visualEvidence.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>WHAT I SEE</Text>
          {diagnosis.visualEvidence.map((ev, i) => (
            <View key={i} style={styles.evidenceRow}>
              <View style={styles.evidenceDot} />
              <Text style={styles.evidenceText}>{ev}</Text>
            </View>
          ))}
        </View>
      )}

      {diagnosis.doNow.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>DO NOW</Text>
          {diagnosis.doNow.map((action, i) => (
            <BenchCard key={i} variant="default" style={styles.actionCard}>
              <View style={styles.actionHeader}>
                <View style={styles.actionNumber}>
                  <Text style={styles.actionNumberText}>{i + 1}</Text>
                </View>
                <Text style={styles.actionTitle}>{action.title}</Text>
                {action.minutesFromNow !== undefined && action.minutesFromNow > 0 && (
                  <View style={styles.actionTimeBadge}>
                    <Text style={styles.actionTimeText}>{action.minutesFromNow} min</Text>
                  </View>
                )}
              </View>
              <Text style={styles.actionDetails}>{action.details}</Text>
            </BenchCard>
          ))}
        </View>
      )}

      {diagnosis.nextBake.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>NEXT BAKE — PREVENTION</Text>
          <BenchCard variant="filled">
            {diagnosis.nextBake.map((tip, i) => (
              <View key={i} style={[styles.nextBakeRow, i > 0 && styles.nextBakeRowBorder]}>
                <Icon name="arrow-right-circle-outline" size={16} color={theme.colors.bench.copper} style={styles.nextBakeIcon} />
                <Text style={styles.nextBakeText}>{tip}</Text>
              </View>
            ))}
          </BenchCard>
        </View>
      )}

      {diagnosis.risk ? (
        <View style={styles.section}>
          <BenchCard variant="outlined" style={styles.riskCard}>
            <View style={styles.riskRow}>
              <Icon name="alert-circle-outline" size={20} color={theme.colors.bench.heatRed} />
              <Text style={styles.riskText}>{diagnosis.risk}</Text>
            </View>
          </BenchCard>
        </View>
      ) : null}

      {diagnosis.missingContextQuestions?.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>THINGS TO CHECK</Text>
          <BenchCard variant="filled">
            {diagnosis.missingContextQuestions.map((q, i) => (
              <View key={i} style={[styles.nextBakeRow, i > 0 && styles.nextBakeRowBorder]}>
                <Icon name="help-circle-outline" size={16} color={theme.colors.bench.crumb} style={styles.nextBakeIcon} />
                <Text style={styles.nextBakeText}>{q}</Text>
              </View>
            ))}
          </BenchCard>
        </View>
      )}

      <Button
        title="Create Bake Plan"
        onPress={handleCreateBakePlan}
        fullWidth
        leftIcon="calendar-clock"
        style={styles.createPlanBtn}
      />

      <TouchableOpacity
        style={styles.backLink}
        onPress={() => navigation.goBack()}
      >
        <Icon name="chevron-left" size={16} color={theme.colors.bench.crumb} />
        <Text style={styles.backLinkText}>Analyze another photo</Text>
      </TouchableOpacity>
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
  quickRescueBanner: {
    marginBottom: theme.spacing.lg,
    borderColor: theme.colors.bench.border,
  },
  bannerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.xs,
  },
  bannerText: {
    fontFamily: theme.typography.fonts.semibold,
    fontSize: theme.typography.sizes.base,
    color: theme.colors.bench.copper,
  },
  bannerSub: {
    fontFamily: theme.typography.fonts.regular,
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.text.secondary,
  },
  section: {
    marginTop: theme.spacing.lg,
  },
  sectionLabel: {
    fontFamily: theme.typography.fonts.semibold,
    fontSize: theme.typography.sizes.xs,
    color: theme.colors.bench.copperDark,
    letterSpacing: 0.7,
    textTransform: 'uppercase',
    marginBottom: theme.spacing.md,
  },
  summaryText: {
    fontFamily: theme.typography.fonts.regular,
    fontSize: theme.typography.sizes.base,
    color: theme.colors.bench.crust,
    lineHeight: 24,
  },
  evidenceRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: theme.spacing.sm,
  },
  evidenceDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: theme.colors.bench.copper,
    marginTop: 6,
    marginRight: theme.spacing.sm,
    flexShrink: 0,
  },
  evidenceText: {
    flex: 1,
    fontFamily: theme.typography.fonts.regular,
    fontSize: theme.typography.sizes.base,
    color: theme.colors.bench.crust,
    lineHeight: 22,
  },
  actionCard: {
    marginBottom: theme.spacing.md,
  },
  actionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
    flexWrap: 'wrap',
    gap: theme.spacing.sm,
  },
  actionNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: theme.colors.bench.copper,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionNumberText: {
    fontFamily: theme.typography.fonts.semibold,
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.white,
  },
  actionTitle: {
    flex: 1,
    fontFamily: theme.typography.fonts.semibold,
    fontSize: theme.typography.sizes.base,
    color: theme.colors.bench.crust,
  },
  actionTimeBadge: {
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: 2,
    borderRadius: theme.borderRadius.full,
    backgroundColor: theme.colors.bench.linen,
  },
  actionTimeText: {
    fontFamily: theme.typography.fonts.semibold,
    fontSize: theme.typography.sizes.xs,
    color: theme.colors.bench.crumb,
  },
  actionDetails: {
    fontFamily: theme.typography.fonts.regular,
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.text.secondary,
    lineHeight: 20,
    marginLeft: 36,
  },
  nextBakeRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: theme.spacing.sm,
  },
  nextBakeRowBorder: {
    borderTopWidth: 1,
    borderTopColor: theme.colors.bench.borderSoft,
  },
  nextBakeIcon: {
    marginRight: theme.spacing.sm,
    marginTop: 2,
    flexShrink: 0,
  },
  nextBakeText: {
    flex: 1,
    fontFamily: theme.typography.fonts.regular,
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.bench.crust,
    lineHeight: 20,
  },
  riskCard: {
    borderColor: theme.colors.bench.heatRed + '44',
    backgroundColor: theme.colors.bench.heatRed + '0A',
  },
  riskRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: theme.spacing.sm,
  },
  riskText: {
    flex: 1,
    fontFamily: theme.typography.fonts.regular,
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.bench.heatRed,
    lineHeight: 20,
  },
  createPlanBtn: {
    marginTop: theme.spacing['2xl'],
    marginBottom: theme.spacing.md,
  },
  backLink: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
    paddingVertical: theme.spacing.md,
  },
  backLinkText: {
    fontFamily: theme.typography.fonts.regular,
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.bench.crumb,
  },
});
