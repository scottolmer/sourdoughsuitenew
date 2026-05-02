/**
 * Home Screen — Modernist Command Sheet
 *
 * Answers "what should I do next?" in the first screenful:
 * - Serif title + status line
 * - NEXT UP sheet (most pressing item: overdue feed, imminent bake step,
 *   feed soon, or empty state)
 * - STATUS table (Starter / Recipe / Timeline)
 * - QUICK ACTIONS cell grid
 * - RECENT row (recipe and/or diagnosis) when data exists
 */

import React, { useCallback, useState } from 'react';
import {
  Linking,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from 'react-native';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import {
  CompositeNavigationProp,
  useFocusEffect,
  useNavigation,
} from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';

import ModernistScreen from '../../components/ModernistScreen';
import FormulaSheet from '../../components/FormulaSheet';
import RuleHeader from '../../components/RuleHeader';
import { theme } from '../../theme';
import type { MaterialCommunityIconName } from '../../types/icons';
import type {
  HomeStackParamList,
  MainTabParamList,
} from '../../navigation/types';
import type { Recipe, Starter } from '../../types';
import type {
  BakePlanStep,
  SavedBakePlanRecord,
  SavedDiagnosisRecord,
} from '../../types/photoRescue';
import { starterStorage } from '../../services/starterStorage';
import { getAllRecipes } from '../../services/recipeStorage';
import { feedingLogStorage } from '../../services/feedingLogStorage';
import { bakePlanStorage } from '../../services/bakePlanStorage';
import { diagnosisStorage } from '../../services/diagnosisStorage';
import {
  calculateAvgActivityLevel,
  getNextFeedingText,
  isFeedingOverdue,
} from '../../utils/starterHealth';
import {
  STEP_ICON_MAP,
  formatStepDay,
  formatStepTime,
} from '../../utils/bakeDayTimeline';

type HomeNavProp = CompositeNavigationProp<
  NativeStackNavigationProp<HomeStackParamList, 'Home'>,
  BottomTabNavigationProp<MainTabParamList>
>;

const SCREEN_HORIZONTAL_PADDING = theme.spacing.lg;
const ACTION_GRID_GAP = theme.spacing.sm;
const ACTION_GRID_COLUMNS = 4;
const ACTION_CELL_MIN_HEIGHT = 72;
const NEXT_BAKE_STEP_HORIZON_MS = 6 * 60 * 60 * 1000; // 6h

type StatusTone = 'green' | 'blue' | 'red' | 'amber' | 'muted';

const toneColor = (tone: StatusTone): string => {
  switch (tone) {
    case 'green':
      return theme.colors.modernist.starterGreen;
    case 'blue':
      return theme.colors.modernist.waterBlue;
    case 'red':
      return theme.colors.modernist.heatRed;
    case 'amber':
      return theme.colors.modernist.warningAmber;
    default:
      return theme.colors.modernist.graphiteMuted;
  }
};

interface NavCmd {
  type: 'tab' | 'starters' | 'tools' | 'home';
  target: string;
  params?: Record<string, unknown>;
}

interface QuickAction {
  icon: MaterialCommunityIconName;
  label: string;
  cmd: NavCmd;
}

interface StatusRow {
  label: string;
  primary: string;
  meta?: string;
  tone?: StatusTone;
  cmd: NavCmd;
}

interface NextStepInfo {
  step: BakePlanStep;
  index: number;
  total: number;
  plan: SavedBakePlanRecord;
}

function findNextBakeStep(
  record: SavedBakePlanRecord | null
): NextStepInfo | null {
  if (!record) return null;
  const now = Date.now();
  const total = record.plan.steps.length;
  const idx = record.plan.steps.findIndex(
    (s) => new Date(s.startsAt).getTime() > now
  );
  if (idx === -1) return null;
  return { step: record.plan.steps[idx], index: idx, total, plan: record };
}

function formatRelativeFrom(iso: string): string {
  const ms = new Date(iso).getTime() - Date.now();
  const abs = Math.abs(ms);
  const minutes = Math.round(abs / 60000);
  if (minutes < 60) {
    return ms >= 0 ? `in ${minutes} min` : `${minutes} min ago`;
  }
  const hours = Math.round(minutes / 60);
  if (hours < 24) {
    return ms >= 0 ? `in ${hours}h` : `${hours}h ago`;
  }
  const days = Math.round(hours / 24);
  return ms >= 0 ? `in ${days}d` : `${days}d ago`;
}

export default function HomeScreen() {
  const navigation = useNavigation<HomeNavProp>();
  const { width: windowWidth } = useWindowDimensions();
  const [soonestStarter, setSoonestStarter] = useState<Starter | null>(null);
  const [starterCount, setStarterCount] = useState(0);
  const [activityPct, setActivityPct] = useState<number | null>(null);
  const [recentRecipe, setRecentRecipe] = useState<Recipe | null>(null);
  const [recipeCount, setRecipeCount] = useState(0);
  const [activePlan, setActivePlan] = useState<SavedBakePlanRecord | null>(
    null
  );
  const [recentDiagnosis, setRecentDiagnosis] =
    useState<SavedDiagnosisRecord | null>(null);

  const cellWidth =
    (windowWidth -
      SCREEN_HORIZONTAL_PADDING * 2 -
      ACTION_GRID_GAP * (ACTION_GRID_COLUMNS - 1)) /
    ACTION_GRID_COLUMNS;

  useFocusEffect(
    useCallback(() => {
      let cancelled = false;
      (async () => {
        const [starters, recipes, plan, diag] = await Promise.all([
          starterStorage.getAll(),
          getAllRecipes(),
          bakePlanStorage.getActive(),
          diagnosisStorage.getMostRecent(),
        ]);
        if (cancelled) return;

        setStarterCount(starters.length);
        setActivePlan(plan);
        setRecentDiagnosis(diag);

        const active = starters.filter((s) => s.isActive && s.nextFeedingDue);
        const sorted = [...active].sort(
          (a, b) =>
            new Date(a.nextFeedingDue!).getTime() -
            new Date(b.nextFeedingDue!).getTime()
        );
        const nextStarter = sorted[0] ?? null;
        setSoonestStarter(nextStarter);

        if (nextStarter) {
          if (typeof nextStarter.avgActivityLevel === 'number') {
            setActivityPct(
              Math.round((nextStarter.avgActivityLevel / 5) * 100)
            );
          } else {
            const logs = await feedingLogStorage.getByStarterId(nextStarter.id);
            if (cancelled) return;
            const avg = calculateAvgActivityLevel(logs);
            setActivityPct(
              avg !== undefined ? Math.round((avg / 5) * 100) : null
            );
          }
        } else {
          setActivityPct(null);
        }

        setRecipeCount(recipes.length);
        const sortedRecipes = [...recipes].sort((a, b) => {
          const ta = new Date(a.updatedAt || a.createdAt).getTime();
          const tb = new Date(b.updatedAt || b.createdAt).getTime();
          return tb - ta;
        });
        setRecentRecipe(sortedRecipes[0] ?? null);
      })();

      return () => {
        cancelled = true;
      };
    }, [])
  );

  const goto = useCallback(
    (cmd: NavCmd) => {
      switch (cmd.type) {
        case 'tab':
          navigation.navigate(cmd.target as keyof MainTabParamList);
          break;
        case 'tools':
          navigation.navigate('ToolsTab', {
            screen: cmd.target,
            params: cmd.params,
          } as never);
          break;
        case 'starters':
          navigation.navigate('StartersTab', {
            screen: cmd.target,
            params: cmd.params,
          } as never);
          break;
        case 'home':
          navigation.navigate(cmd.target as keyof HomeStackParamList);
          break;
      }
    },
    [navigation]
  );

  const overdue = soonestStarter
    ? isFeedingOverdue(soonestStarter.nextFeedingDue)
    : false;
  const dueSoon = (() => {
    if (!soonestStarter?.nextFeedingDue) return false;
    const ms =
      new Date(soonestStarter.nextFeedingDue).getTime() - Date.now();
    return ms > 0 && ms < 2 * 60 * 60 * 1000;
  })();

  const nextStepInfo = findNextBakeStep(activePlan);
  const nextStepImminent = (() => {
    if (!nextStepInfo) return false;
    const ms = new Date(nextStepInfo.step.startsAt).getTime() - Date.now();
    return ms <= NEXT_BAKE_STEP_HORIZON_MS;
  })();

  const headerStatus = (() => {
    if (overdue && soonestStarter)
      return 'A starter is overdue. Begin with the feed below.';
    if (nextStepImminent && nextStepInfo)
      return 'A bake step is coming up. Stay close to the bench.';
    if (dueSoon && soonestStarter)
      return 'A feeding is due soon. Plan accordingly.';
    if (soonestStarter || nextStepInfo)
      return 'Bench is calm. Next move queued below.';
    if (recipeCount > 0)
      return 'No active starter. Pick up where you left off.';
    return 'Welcome. Add a starter or recipe to begin.';
  })();

  const nextUp = (() => {
    if (overdue && soonestStarter) {
      return {
        eyebrow: 'OVERDUE FEEDING',
        title: soonestStarter.name,
        meta: getNextFeedingText(soonestStarter.nextFeedingDue),
        tone: 'red' as StatusTone,
        actionLabel: 'Log Feeding',
        cmd: {
          type: 'starters',
          target: 'AddFeeding',
          params: { starterId: soonestStarter.id },
        } as NavCmd,
      };
    }
    if (nextStepImminent && nextStepInfo) {
      return {
        eyebrow: 'NEXT BAKE STEP',
        title: nextStepInfo.step.title,
        meta: `Step ${nextStepInfo.index + 1} of ${nextStepInfo.total} · ${formatStepDay(
          nextStepInfo.step.startsAt
        )} · ${formatStepTime(nextStepInfo.step.startsAt)}`,
        tone: 'amber' as StatusTone,
        actionLabel: 'Open Plan',
        cmd: {
          type: 'tools',
          target: 'BakeDayCopilot',
          params: {},
        } as NavCmd,
      };
    }
    if (dueSoon && soonestStarter) {
      return {
        eyebrow: 'FEEDING DUE SOON',
        title: soonestStarter.name,
        meta: getNextFeedingText(soonestStarter.nextFeedingDue),
        tone: 'amber' as StatusTone,
        actionLabel: 'Log Feeding',
        cmd: {
          type: 'starters',
          target: 'AddFeeding',
          params: { starterId: soonestStarter.id },
        } as NavCmd,
      };
    }
    if (soonestStarter) {
      return {
        eyebrow: 'NEXT FEEDING',
        title: soonestStarter.name,
        meta: getNextFeedingText(soonestStarter.nextFeedingDue),
        tone: 'green' as StatusTone,
        actionLabel: 'Log Feeding',
        cmd: {
          type: 'starters',
          target: 'AddFeeding',
          params: { starterId: soonestStarter.id },
        } as NavCmd,
      };
    }
    if (nextStepInfo) {
      return {
        eyebrow: 'NEXT BAKE STEP',
        title: nextStepInfo.step.title,
        meta: `Step ${nextStepInfo.index + 1} of ${nextStepInfo.total} · ${formatStepDay(
          nextStepInfo.step.startsAt
        )} · ${formatStepTime(nextStepInfo.step.startsAt)}`,
        tone: 'muted' as StatusTone,
        actionLabel: 'Open Plan',
        cmd: {
          type: 'tools',
          target: 'BakeDayCopilot',
          params: {},
        } as NavCmd,
      };
    }
    if (starterCount > 0) {
      return {
        eyebrow: 'NO ACTIVE FEEDINGS',
        title: 'All starters paused',
        meta: 'Resume one to begin tracking again.',
        tone: 'muted' as StatusTone,
        actionLabel: 'Open Starters',
        cmd: { type: 'tab', target: 'StartersTab' } as NavCmd,
      };
    }
    return {
      eyebrow: 'GET STARTED',
      title: 'Add your first starter',
      meta: 'Track feedings, activity, and health from your bench.',
      tone: 'muted' as StatusTone,
      actionLabel: 'Add Starter',
      cmd: {
        type: 'starters',
        target: 'AddStarter',
      } as NavCmd,
    };
  })();

  const statusRows: StatusRow[] = (() => {
    const rows: StatusRow[] = [];

    if (soonestStarter) {
      const activityText =
        activityPct !== null
          ? `${activityPct}% activity`
          : overdue
          ? 'Overdue — feed soon'
          : 'Awaiting first reading';
      rows.push({
        label: 'Starter',
        primary: soonestStarter.name,
        meta: activityText,
        tone:
          overdue
            ? 'red'
            : activityPct !== null && activityPct >= 70
            ? 'green'
            : 'muted',
        cmd: {
          type: 'starters',
          target: 'StarterDetail',
          params: { starterId: soonestStarter.id },
        },
      });
    } else {
      rows.push({
        label: 'Starter',
        primary: starterCount > 0 ? 'No active starter' : 'Not added',
        meta: 'Tap to add one',
        tone: 'muted',
        cmd: {
          type: 'starters',
          target: starterCount > 0 ? 'StartersList' : 'AddStarter',
        },
      });
    }

    if (recentRecipe) {
      rows.push({
        label: 'Recipe',
        primary: recentRecipe.name,
        meta: `${Math.round(recentRecipe.hydration)}% hydration · ${Math.round(
          recentRecipe.totalWeight
        )}g`,
        tone: 'blue',
        cmd: {
          type: 'tab',
          target: 'RecipesTab',
        },
      });
    } else {
      rows.push({
        label: 'Recipe',
        primary: 'No saved recipes',
        meta: 'Build a formula to begin',
        tone: 'muted',
        cmd: { type: 'tab', target: 'RecipesTab' },
      });
    }

    if (nextStepInfo) {
      rows.push({
        label: 'Timeline',
        primary: `Step ${nextStepInfo.index + 1} of ${nextStepInfo.total} · ${nextStepInfo.step.title}`,
        meta: `${formatStepDay(nextStepInfo.step.startsAt)} · ${formatStepTime(
          nextStepInfo.step.startsAt
        )}`,
        tone: nextStepImminent ? 'amber' : 'muted',
        cmd: {
          type: 'tools',
          target: 'BakeDayCopilot',
          params: {},
        },
      });
    } else if (activePlan) {
      const last = activePlan.plan.steps[activePlan.plan.steps.length - 1];
      rows.push({
        label: 'Timeline',
        primary: 'Plan complete',
        meta: last
          ? `Last step ${formatRelativeFrom(last.startsAt)}`
          : 'Build a new plan',
        tone: 'muted',
        cmd: {
          type: 'tools',
          target: 'BakeDayCopilot',
          params: {},
        },
      });
    } else {
      rows.push({
        label: 'Timeline',
        primary: 'No active bake plan',
        meta: 'Build one in the Bake Day Copilot',
        tone: 'muted',
        cmd: {
          type: 'tools',
          target: 'BakeDayCopilot',
          params: {},
        },
      });
    }

    return rows;
  })();

  const quickActions: QuickAction[] = [
    {
      icon: 'bacteria',
      label: 'Feed',
      cmd: soonestStarter
        ? {
            type: 'starters',
            target: 'AddFeeding',
            params: { starterId: soonestStarter.id },
          }
        : { type: 'tab', target: 'StartersTab' },
    },
    {
      icon: 'camera-iris',
      label: 'Photo Rescue',
      cmd: { type: 'tools', target: 'PhotoRescue' },
    },
    {
      icon: 'calendar-clock',
      label: 'Bake Day',
      cmd: { type: 'tools', target: 'BakeDayCopilot', params: {} },
    },
    {
      icon: 'calculator-variant',
      label: 'Formula',
      cmd: { type: 'tools', target: 'BakersCalculator' },
    },
    {
      icon: 'clock-outline',
      label: 'Timeline',
      cmd: { type: 'tools', target: 'TimelineCalculator' },
    },
    {
      icon: 'thermometer',
      label: 'Temp',
      cmd: { type: 'tools', target: 'TemperatureCalculator' },
    },
    {
      icon: 'book-open-variant',
      label: 'Recipes',
      cmd: { type: 'tab', target: 'RecipesTab' },
    },
    {
      icon: 'school-outline',
      label: 'Learn',
      cmd: { type: 'home', target: 'Learn' },
    },
  ];

  const socialLinks: { icon: MaterialCommunityIconName; url: string }[] = [
    { icon: 'youtube', url: 'https://youtube.com/@SourdoughSuite' },
    { icon: 'instagram', url: 'https://instagram.com/sourdoughsuite' },
    { icon: 'facebook', url: 'https://facebook.com/sourdoughsuite' },
    { icon: 'music-note-eighth', url: 'https://tiktok.com/@sourdoughsuite' },
  ];

  const showRecent = !!recentRecipe || !!recentDiagnosis;

  return (
    <ModernistScreen background="paper">
      {/* Title block */}
      <View style={styles.titleBlock}>
        <Text style={styles.title}>SourdoughSuite</Text>
        <Text style={styles.statusLine}>{headerStatus}</Text>
      </View>

      {/* NEXT UP */}
      <RuleHeader title="NEXT UP" trailing={nextUp.eyebrow} />
      <FormulaSheet
        topRule
        background="porcelain"
        radius={10}
        padding="lg"
        style={styles.nextUpSheet}
      >
        <View style={styles.nextUpRow}>
          <View style={styles.nextUpInfo}>
            <Text style={styles.nextUpTitle} numberOfLines={2}>
              {nextUp.title}
            </Text>
            <Text style={[styles.nextUpMeta, { color: toneColor(nextUp.tone) }]}>
              {nextUp.meta}
            </Text>
          </View>
        </View>
        <TouchableOpacity
          accessibilityRole="button"
          activeOpacity={0.85}
          onPress={() => goto(nextUp.cmd)}
          style={styles.nextUpButton}
        >
          <Text style={styles.nextUpButtonText}>{nextUp.actionLabel}</Text>
          <Icon
            name="arrow-right"
            size={16}
            color={theme.colors.modernist.paper}
          />
        </TouchableOpacity>
      </FormulaSheet>

      {/* STATUS */}
      <View style={styles.section}>
        <RuleHeader title="STATUS" />
        <View style={styles.statusTable}>
          {statusRows.map((row, idx) => {
            const isLast = idx === statusRows.length - 1;
            return (
              <TouchableOpacity
                key={`${row.label}-${idx}`}
                accessibilityRole="button"
                activeOpacity={0.78}
                onPress={() => goto(row.cmd)}
                style={[styles.statusRow, !isLast && styles.statusRowBorder]}
              >
                <Text style={styles.statusLabel}>{row.label}</Text>
                <View style={styles.statusValueCol}>
                  <Text style={styles.statusPrimary} numberOfLines={1}>
                    {row.primary}
                  </Text>
                  {row.meta ? (
                    <Text
                      style={[
                        styles.statusMeta,
                        { color: toneColor(row.tone ?? 'muted') },
                      ]}
                      numberOfLines={1}
                    >
                      {row.meta}
                    </Text>
                  ) : null}
                </View>
                <Icon
                  name="chevron-right"
                  size={16}
                  color={theme.colors.modernist.graphiteMuted}
                />
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* QUICK ACTIONS */}
      <View style={styles.section}>
        <RuleHeader title="QUICK ACTIONS" />
        <View style={styles.actionGrid}>
          {quickActions.map((action, idx) => (
            <TouchableOpacity
              key={`${action.label}-${idx}`}
              accessibilityRole="button"
              accessibilityLabel={action.label}
              activeOpacity={0.78}
              onPress={() => goto(action.cmd)}
              style={[styles.actionCell, { width: cellWidth }]}
            >
              <Icon
                name={action.icon}
                size={22}
                color={theme.colors.modernist.ink}
              />
              <Text style={styles.actionLabel} numberOfLines={1}>
                {action.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* RECENT */}
      {showRecent ? (
        <View style={styles.section}>
          <RuleHeader title="RECENT" />
          <View style={styles.recentList}>
            {recentRecipe ? (
              <TouchableOpacity
                accessibilityRole="button"
                activeOpacity={0.85}
                onPress={() =>
                  navigation.navigate('RecipesTab', {
                    screen: 'RecipeDetail',
                    params: { recipeId: recentRecipe.id },
                  } as never)
                }
                style={styles.recentRow}
              >
                <View style={styles.recentThumb}>
                  <Icon
                    name="book-open-page-variant"
                    size={20}
                    color={theme.colors.modernist.graphite}
                  />
                </View>
                <View style={styles.recentInfo}>
                  <Text style={styles.recentLabel}>RECIPE</Text>
                  <Text style={styles.recentName} numberOfLines={1}>
                    {recentRecipe.name}
                  </Text>
                  <Text style={styles.recentMeta} numberOfLines={1}>
                    {Math.round(recentRecipe.hydration)}% hydration ·{' '}
                    {Math.round(recentRecipe.totalWeight)}g
                    {recentRecipe.difficulty
                      ? ` · ${recentRecipe.difficulty}`
                      : ''}
                  </Text>
                </View>
                <Icon
                  name="chevron-right"
                  size={16}
                  color={theme.colors.modernist.graphiteMuted}
                />
              </TouchableOpacity>
            ) : null}

            {recentDiagnosis ? (
              <TouchableOpacity
                accessibilityRole="button"
                activeOpacity={0.85}
                onPress={() =>
                  navigation.navigate('ToolsTab', {
                    screen: 'DiagnosisResult',
                    params: {
                      diagnosis: recentDiagnosis.diagnosis,
                      imageUri: recentDiagnosis.imageUri,
                    },
                  } as never)
                }
                style={[
                  styles.recentRow,
                  recentRecipe && styles.recentRowDivider,
                ]}
              >
                <View style={styles.recentThumb}>
                  <Icon
                    name="camera-iris"
                    size={20}
                    color={theme.colors.modernist.graphite}
                  />
                </View>
                <View style={styles.recentInfo}>
                  <Text style={styles.recentLabel}>DIAGNOSIS</Text>
                  <Text style={styles.recentName} numberOfLines={1}>
                    {recentDiagnosis.diagnosis.diagnosis}
                  </Text>
                  <Text style={styles.recentMeta} numberOfLines={1}>
                    {recentDiagnosis.diagnosis.subject} ·{' '}
                    {formatRelativeFrom(recentDiagnosis.createdAt)}
                  </Text>
                </View>
                <Icon
                  name="chevron-right"
                  size={16}
                  color={theme.colors.modernist.graphiteMuted}
                />
              </TouchableOpacity>
            ) : null}
          </View>
        </View>
      ) : null}

      {/* Social footer */}
      <View style={styles.socialFooter}>
        {socialLinks.map((link, idx) => (
          <TouchableOpacity
            key={idx}
            accessibilityRole="link"
            accessibilityLabel={`Follow on ${link.icon}`}
            onPress={() =>
              Linking.openURL(link.url).catch((err) =>
                console.error("Couldn't load page", err)
              )
            }
            style={styles.socialButton}
          >
            <Icon
              name={link.icon}
              size={18}
              color={theme.colors.modernist.graphiteMuted}
            />
          </TouchableOpacity>
        ))}
      </View>
    </ModernistScreen>
  );
}

const styles = StyleSheet.create({
  titleBlock: {
    marginBottom: theme.spacing.lg,
  },
  title: {
    fontFamily: theme.typography.roles.display,
    fontSize: theme.typography.sizes['3xl'],
    color: theme.colors.modernist.ink,
    letterSpacing: -0.5,
  },
  statusLine: {
    fontFamily: theme.typography.roles.body,
    fontSize: 13,
    color: theme.colors.modernist.graphiteMuted,
    marginTop: 4,
    lineHeight: 18,
  },
  section: {
    marginTop: theme.spacing.lg,
  },
  nextUpSheet: {
    marginBottom: 0,
  },
  nextUpRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  nextUpInfo: {
    flex: 1,
    paddingRight: theme.spacing.sm,
  },
  nextUpTitle: {
    fontFamily: theme.typography.roles.bodySemibold,
    fontSize: 18,
    color: theme.colors.modernist.ink,
  },
  nextUpMeta: {
    fontFamily: theme.typography.roles.bodyMedium,
    fontSize: 13,
    marginTop: 4,
    letterSpacing: 0.2,
  },
  nextUpButton: {
    marginTop: theme.spacing.md,
    minHeight: 44,
    backgroundColor: theme.colors.modernist.copper,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: theme.spacing.md,
    gap: theme.spacing.xs,
  },
  nextUpButtonText: {
    fontFamily: theme.typography.roles.bodySemibold,
    fontSize: 14,
    color: theme.colors.modernist.paper,
    letterSpacing: 0.4,
    textTransform: 'uppercase',
  },
  statusTable: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: theme.colors.modernist.hairline,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: theme.spacing.md,
    minHeight: 56,
    gap: theme.spacing.sm,
  },
  statusRowBorder: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: theme.colors.modernist.hairline,
  },
  statusLabel: {
    fontFamily: theme.typography.roles.bodySemibold,
    fontSize: 11,
    letterSpacing: 0.7,
    textTransform: 'uppercase',
    color: theme.colors.modernist.graphiteMuted,
    width: 76,
  },
  statusValueCol: {
    flex: 1,
  },
  statusPrimary: {
    fontFamily: theme.typography.roles.bodyMedium,
    fontSize: 15,
    color: theme.colors.modernist.ink,
  },
  statusMeta: {
    fontFamily: theme.typography.roles.body,
    fontSize: 12,
    marginTop: 2,
    letterSpacing: 0.2,
  },
  actionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: ACTION_GRID_GAP,
  },
  actionCell: {
    minHeight: ACTION_CELL_MIN_HEIGHT,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: theme.colors.modernist.hairline,
    backgroundColor: theme.colors.modernist.porcelain,
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: 4,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  actionLabel: {
    fontFamily: theme.typography.roles.bodyMedium,
    fontSize: 11,
    color: theme.colors.modernist.graphite,
    letterSpacing: 0.3,
    textAlign: 'center',
  },
  recentList: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: theme.colors.modernist.hairline,
  },
  recentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: theme.spacing.md,
    minHeight: 64,
    gap: theme.spacing.md,
  },
  recentRowDivider: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: theme.colors.modernist.hairline,
  },
  recentThumb: {
    width: 40,
    height: 40,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: theme.colors.modernist.hairline,
    backgroundColor: theme.colors.modernist.porcelain,
    alignItems: 'center',
    justifyContent: 'center',
  },
  recentInfo: {
    flex: 1,
  },
  recentLabel: {
    fontFamily: theme.typography.roles.bodySemibold,
    fontSize: 10,
    color: theme.colors.modernist.graphiteMuted,
    letterSpacing: 0.6,
    textTransform: 'uppercase',
    marginBottom: 2,
  },
  recentName: {
    fontFamily: theme.typography.roles.bodySemibold,
    fontSize: 15,
    color: theme.colors.modernist.ink,
  },
  recentMeta: {
    fontFamily: theme.typography.roles.body,
    fontSize: 12,
    color: theme.colors.modernist.graphiteMuted,
    marginTop: 2,
    letterSpacing: 0.2,
  },
  socialFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing.lg,
    marginTop: theme.spacing.xl,
    paddingTop: theme.spacing.lg,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: theme.colors.modernist.hairline,
  },
  socialButton: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
