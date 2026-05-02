import React, { useEffect, useState } from 'react';
import { Linking, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import FactStrip from '../../components/FactStrip';
import FormulaSheet from '../../components/FormulaSheet';
import ModernistScreen from '../../components/ModernistScreen';
import RuleHeader from '../../components/RuleHeader';
import { bakePlanStorage } from '../../services/bakePlanStorage';
import { photoRescueStorage } from '../../services/photoRescueStorage';
import { starterStorage } from '../../services/starterStorage';
import { getAllRecipes } from '../../services/recipeStorage';
import { SavedBakePlanRecord, SavedDiagnosisRecord, Starter } from '../../types';
import { theme } from '../../theme';

interface ActionCell {
  title: string;
  label: string;
  icon: string;
  route?: string;
  tab?: string;
  url?: string;
  tone?: 'teal' | 'copper' | 'green';
}

export default function HomeScreen() {
  const navigation = useNavigation<any>();
  const [latestDiagnosis, setLatestDiagnosis] =
    useState<SavedDiagnosisRecord | null>(null);
  const [latestPlan, setLatestPlan] = useState<SavedBakePlanRecord | null>(null);
  const [starters, setStarters] = useState<Starter[]>([]);
  const [recipeCount, setRecipeCount] = useState(0);

  useEffect(() => {
    const load = async () => {
      const [diagnosis, plan, starterList, recipes] = await Promise.all([
        photoRescueStorage.getLatest(),
        bakePlanStorage.getLatest(),
        starterStorage.getAll(),
        getAllRecipes(),
      ]);
      setLatestDiagnosis(diagnosis);
      setLatestPlan(plan);
      setStarters(starterList);
      setRecipeCount(recipes.length);
    };

    load();
  }, []);

  const activeStarter = starters.find(starter => starter.isActive) || starters[0];

  const actions: ActionCell[] = [
    {
      title: 'Photo Rescue',
      label: 'Diagnose dough',
      icon: 'image-search-outline',
      route: 'PhotoRescue',
      tone: 'teal',
    },
    {
      title: 'Bake Planner',
      label: 'Build schedule',
      icon: 'calendar-clock',
      route: 'BakePlanner',
      tone: 'copper',
    },
    {
      title: 'Formulas',
      label: 'Baker %',
      icon: 'percent-outline',
      route: 'BakersCalculator',
      tone: 'green',
    },
    {
      title: 'Recipes',
      label: 'Formula index',
      icon: 'book-open-variant',
      tab: 'RecipesTab',
    },
    {
      title: 'Starters',
      label: 'Culture log',
      icon: 'bacteria-outline',
      tab: 'StartersTab',
    },
    {
      title: 'Academy',
      label: 'Methods',
      icon: 'school-outline',
      route: 'Learn',
    },
  ];

  const handleAction = (action: ActionCell) => {
    if (action.url) {
      Linking.openURL(action.url);
      return;
    }

    if (action.tab) {
      navigation.navigate(action.tab);
      return;
    }

    navigation.navigate('ToolsTab', {
      screen: action.route,
    });
  };

  const nextUpTitle = latestDiagnosis
    ? latestDiagnosis.diagnosis.diagnosis
    : activeStarter
      ? `${activeStarter.name} check`
      : 'Run Photo Rescue';

  const nextUpText = latestDiagnosis
    ? latestDiagnosis.diagnosis.doNow[0]?.title || 'Review diagnosis'
    : activeStarter
      ? activeStarter.nextFeedingDue
        ? `Next feed: ${new Date(activeStarter.nextFeedingDue).toLocaleString()}`
        : 'Log the next feeding and check activity.'
      : 'Use the sample dough photo to create a diagnosis and plan.';

  return (
    <ModernistScreen>
      <View style={styles.header}>
        <Text style={styles.kicker}>SOURDOUGH SUITE</Text>
        <Text style={styles.title}>Bench command sheet</Text>
        <Text style={styles.subtitle}>
          Formula-first tools for rescue, planning, starters, and recipes.
        </Text>
      </View>

      <FormulaSheet accented style={styles.nextUp}>
        <RuleHeader title="Next Up" />
        <Text style={styles.nextTitle}>{nextUpTitle}</Text>
        <Text style={styles.nextText}>{nextUpText}</Text>
        <TouchableOpacity
          style={styles.nextButton}
          onPress={() =>
            latestDiagnosis
              ? navigation.navigate('ToolsTab', {
                  screen: 'PhotoRescueResult',
                  params: { diagnosisId: latestDiagnosis.diagnosis.id },
                })
              : navigation.navigate('ToolsTab', { screen: 'PhotoRescue' })
          }
        >
          <Text style={styles.nextButtonText}>
            {latestDiagnosis ? 'Open Result' : 'Start Rescue'}
          </Text>
          <Icon
            name="arrow-right"
            size={18}
            color={theme.colors.modernist.ruleTeal}
          />
        </TouchableOpacity>
      </FormulaSheet>

      <FactStrip
        items={[
          {
            label: 'Starter',
            value: activeStarter?.name || 'none',
            icon: 'bacteria-outline',
            tone: activeStarter ? 'green' : undefined,
          },
          {
            label: 'Recipes',
            value: `${recipeCount}`,
            icon: 'book-open-variant',
          },
          {
            label: 'Last Plan',
            value: latestPlan ? latestPlan.plan.fermentationRisk : 'none',
            icon: 'calendar-clock',
            tone: latestPlan ? 'copper' : undefined,
          },
          {
            label: 'Rescue',
            value: latestDiagnosis ? latestDiagnosis.diagnosis.confidence : 'ready',
            icon: 'image-search-outline',
            tone: 'teal',
          },
        ]}
      />

      <View style={styles.actions}>
        <RuleHeader title="Quick Actions" />
        <View style={styles.actionGrid}>
          {actions.map(action => (
            <TouchableOpacity
              key={action.title}
              style={styles.action}
              onPress={() => handleAction(action)}
              activeOpacity={0.75}
            >
              <Icon
                name={action.icon}
                size={22}
                color={
                  action.tone === 'copper'
                    ? theme.colors.modernist.copper
                    : action.tone === 'green'
                      ? theme.colors.modernist.starterGreen
                      : theme.colors.modernist.ruleTeal
                }
              />
              <Text style={styles.actionTitle}>{action.title}</Text>
              <Text style={styles.actionLabel}>{action.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
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
    letterSpacing: 0.9,
    color: theme.colors.modernist.ruleTeal,
    marginBottom: theme.spacing.xs,
  },
  title: {
    fontFamily: theme.typography.fonts.heading,
    fontSize: 36,
    lineHeight: 42,
    color: theme.colors.modernist.ink,
  },
  subtitle: {
    fontFamily: theme.typography.fonts.regular,
    fontSize: theme.typography.sizes.base,
    lineHeight: 23,
    color: theme.colors.modernist.graphiteMuted,
    marginTop: theme.spacing.sm,
  },
  nextUp: {
    marginBottom: theme.spacing.lg,
  },
  nextTitle: {
    fontFamily: theme.typography.fonts.heading,
    fontSize: theme.typography.sizes['2xl'],
    color: theme.colors.modernist.ink,
    marginBottom: theme.spacing.xs,
  },
  nextText: {
    fontFamily: theme.typography.fonts.regular,
    fontSize: theme.typography.sizes.sm,
    lineHeight: 20,
    color: theme.colors.modernist.graphiteMuted,
  },
  nextButton: {
    marginTop: theme.spacing.md,
    paddingTop: theme.spacing.sm,
    borderTopWidth: 1,
    borderTopColor: theme.colors.modernist.hairline,
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xs,
  },
  nextButtonText: {
    fontFamily: theme.typography.fonts.semibold,
    color: theme.colors.modernist.ruleTeal,
  },
  actions: {
    marginTop: theme.spacing.xl,
  },
  actionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    borderTopWidth: 1,
    borderLeftWidth: 1,
    borderColor: theme.colors.modernist.hairline,
  },
  action: {
    width: '50%',
    minHeight: 116,
    padding: theme.spacing.md,
    backgroundColor: theme.colors.modernist.porcelain,
    borderRightWidth: 1,
    borderBottomWidth: 1,
    borderColor: theme.colors.modernist.hairline,
  },
  actionTitle: {
    fontFamily: theme.typography.fonts.semibold,
    fontSize: theme.typography.sizes.base,
    color: theme.colors.modernist.ink,
    marginTop: theme.spacing.sm,
  },
  actionLabel: {
    fontFamily: theme.typography.fonts.regular,
    fontSize: theme.typography.sizes.xs,
    color: theme.colors.modernist.graphiteMuted,
    marginTop: 3,
  },
});
