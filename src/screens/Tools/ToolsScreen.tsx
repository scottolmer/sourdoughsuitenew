import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import FormulaSheet from '../../components/FormulaSheet';
import ModernistScreen from '../../components/ModernistScreen';
import RuleHeader from '../../components/RuleHeader';
import { ToolsStackParamList } from '../../navigation/types';
import { theme } from '../../theme';
import { useHaptics } from '../../hooks/useHaptics';

type NavigationProp = NativeStackNavigationProp<ToolsStackParamList>;

interface ToolRow {
  route: keyof ToolsStackParamList;
  title: string;
  label: string;
  icon: string;
  featured?: boolean;
}

const groups: Array<{ title: string; tools: ToolRow[] }> = [
  {
    title: 'Hackathon Path',
    tools: [
      {
        route: 'PhotoRescue',
        title: 'Photo Rescue',
        label: 'Analyze dough, starter, crumb, or loaf',
        icon: 'image-search-outline',
        featured: true,
      },
      {
        route: 'BakePlanner',
        title: 'Bake Day Copilot',
        label: 'Create an overnight production schedule',
        icon: 'calendar-clock',
        featured: true,
      },
    ],
  },
  {
    title: 'Formula',
    tools: [
      {
        route: 'BakersCalculator',
        title: "Baker's Percentage",
        label: 'Calculate ratios and save recipes',
        icon: 'percent-outline',
      },
      {
        route: 'HydrationCalculator',
        title: 'Hydration Converter',
        label: 'Adjust dough water percentage',
        icon: 'water-percent',
      },
      {
        route: 'FlourBlendCalculator',
        title: 'Flour Blend',
        label: 'Target protein from mixed flours',
        icon: 'grain',
      },
    ],
  },
  {
    title: 'Schedule And Build',
    tools: [
      {
        route: 'TimelineCalculator',
        title: 'Timeline Calculator',
        label: 'Back-time a bake day',
        icon: 'timeline-clock-outline',
      },
      {
        route: 'LevainBuilder',
        title: 'Levain Builder',
        label: 'Build starter for a formula',
        icon: 'flask-outline',
      },
      {
        route: 'PrefermentCalculator',
        title: 'Preferment Calculator',
        label: 'Poolish, biga, and preferments',
        icon: 'clock-time-four-outline',
      },
    ],
  },
  {
    title: 'Adjust',
    tools: [
      {
        route: 'RecipeRescueCalculator',
        title: 'Recipe Rescue',
        label: 'Fix ingredient mistakes',
        icon: 'lifebuoy',
      },
      {
        route: 'ScalingCalculator',
        title: 'Recipe Scaler',
        label: 'Scale formulas up or down',
        icon: 'resize',
      },
      {
        route: 'TemperatureCalculator',
        title: 'Temperature Calculator',
        label: 'Control final dough temperature',
        icon: 'thermometer',
      },
      {
        route: 'DoughWeightCalculator',
        title: 'Dough Weight',
        label: 'Calculate dough portions',
        icon: 'scale',
      },
      {
        route: 'StarterPercentageCalculator',
        title: 'Starter Percentage',
        label: 'Estimate fermentation speed',
        icon: 'bacteria-outline',
      },
    ],
  },
];

export default function ToolsScreen() {
  const navigation = useNavigation<NavigationProp>();
  const haptics = useHaptics();

  const openTool = (route: keyof ToolsStackParamList) => {
    haptics.selection();
    navigation.navigate(route as any);
  };

  return (
    <ModernistScreen>
      <View style={styles.header}>
        <Text style={styles.kicker}>TOOLS</Text>
        <Text style={styles.title}>Formula workbench</Text>
        <Text style={styles.subtitle}>
          Rescue, plan, calculate, and save formulas without leaving the bench.
        </Text>
      </View>

      {groups.map(group => (
        <FormulaSheet key={group.title} style={styles.group} accented>
          <RuleHeader title={group.title} />
          {group.tools.map(tool => (
            <TouchableOpacity
              key={tool.title}
              style={[styles.toolRow, tool.featured && styles.featuredRow]}
              onPress={() => openTool(tool.route)}
              activeOpacity={0.75}
            >
              <Icon
                name={tool.icon}
                size={22}
                color={
                  tool.featured
                    ? theme.colors.modernist.copper
                    : theme.colors.modernist.ruleTeal
                }
              />
              <View style={styles.toolText}>
                <Text style={styles.toolTitle}>{tool.title}</Text>
                <Text style={styles.toolLabel}>{tool.label}</Text>
              </View>
              <Icon
                name="chevron-right"
                size={20}
                color={theme.colors.modernist.hairlineDark}
              />
            </TouchableOpacity>
          ))}
        </FormulaSheet>
      ))}
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
  group: {
    marginBottom: theme.spacing.lg,
  },
  toolRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.md,
    paddingVertical: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.modernist.hairline,
  },
  featuredRow: {
    backgroundColor: theme.colors.modernist.paperWarm,
    paddingHorizontal: theme.spacing.sm,
  },
  toolText: {
    flex: 1,
  },
  toolTitle: {
    fontFamily: theme.typography.fonts.semibold,
    fontSize: theme.typography.sizes.base,
    color: theme.colors.modernist.ink,
  },
  toolLabel: {
    fontFamily: theme.typography.fonts.regular,
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.modernist.graphiteMuted,
    marginTop: 2,
  },
});
