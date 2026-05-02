/**
 * Tools Screen
 * Grouped calculator suite and baking tools
 */

import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import BenchCard from '../../components/BenchCard';
import SectionHeader from '../../components/SectionHeader';
import { theme } from '../../theme';
import type { MaterialCommunityIconName } from '../../types/icons';
import type { ToolsStackParamList } from '../../navigation/types';
import { useHaptics } from '../../hooks/useHaptics';

type NavigationProp = NativeStackNavigationProp<ToolsStackParamList>;

type ToolRoute = Extract<
  keyof ToolsStackParamList,
  | 'BakersCalculator'
  | 'HydrationCalculator'
  | 'TimelineCalculator'
  | 'ScalingCalculator'
  | 'TemperatureCalculator'
  | 'LevainBuilder'
  | 'StarterPercentageCalculator'
  | 'PrefermentCalculator'
  | 'DoughWeightCalculator'
  | 'RecipeRescueCalculator'
  | 'FlourBlendCalculator'
  | 'PhotoRescue'
>;

interface ToolDef {
  icon: MaterialCommunityIconName;
  title: string;
  description: string;
  color: string;
  route?: ToolRoute;
  onPress?: () => void;
}

interface GroupDef {
  eyebrow: string;
  title: string;
  tools: ToolDef[];
}

function FeaturedToolCard({ tool, onPress }: { tool: ToolDef; onPress: () => void }) {
  return (
    <TouchableOpacity style={styles.featuredBtn} onPress={onPress} activeOpacity={0.8}>
      <BenchCard variant="hero" padding="lg" style={styles.featuredCard}>
        <View style={[styles.featuredIcon, { backgroundColor: tool.color + '20' }]}>
          <Icon name={tool.icon} size={28} color={tool.color} />
        </View>
        <Text style={styles.featuredTitle}>{tool.title}</Text>
        <Text style={styles.featuredDesc}>{tool.description}</Text>
      </BenchCard>
    </TouchableOpacity>
  );
}

function ToolRow({ tool, onPress }: { tool: ToolDef; onPress: () => void }) {
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.75}>
      <BenchCard variant="flat" padding="md" style={styles.toolRow}>
        <View style={[styles.toolIcon, { backgroundColor: tool.color + '18' }]}>
          <Icon name={tool.icon} size={22} color={tool.color} />
        </View>
        <View style={styles.toolInfo}>
          <Text style={styles.toolTitle}>{tool.title}</Text>
          <Text style={styles.toolDesc}>{tool.description}</Text>
        </View>
        <Icon name="chevron-right" size={18} color={theme.colors.text.disabled} />
      </BenchCard>
    </TouchableOpacity>
  );
}

export default function ToolsScreen() {
  const navigation = useNavigation<NavigationProp>();
  const haptics = useHaptics();

  const go = (route: ToolRoute) => {
    haptics.selection();
    navigation.navigate(route);
  };

  const goCopilot = () => {
    haptics.selection();
    navigation.navigate('BakeDayCopilot', {});
  };

  const featured: (ToolDef & { onPress: () => void })[] = [
    {
      icon: 'camera-iris',
      title: 'Photo Rescue',
      description: 'Diagnose your dough from a photo',
      color: theme.colors.bench.heatRed,
      onPress: () => go('PhotoRescue'),
    },
    {
      icon: 'calendar-clock',
      title: 'Bake Day Copilot',
      description: 'Personalized bake timeline',
      color: theme.colors.bench.copper,
      onPress: goCopilot,
    },
    {
      icon: 'percent',
      title: "Baker's %",
      description: 'Formula ratios & weights',
      color: theme.colors.primary[600],
      onPress: () => go('BakersCalculator'),
    },
  ];

  const groups: GroupDef[] = [
    {
      eyebrow: 'Schedule',
      title: 'Plan',
      tools: [
        {
          icon: 'clock-outline',
          title: 'Timeline Calculator',
          description: 'Plan your baking schedule',
          color: theme.colors.info.main,
          route: 'TimelineCalculator',
        },
        {
          icon: 'calendar-clock',
          title: 'Bake Day Copilot',
          description: 'Personalized AI bake timeline',
          color: theme.colors.bench.copper,
          onPress: goCopilot,
        },
      ],
    },
    {
      eyebrow: 'Calculations',
      title: 'Formula',
      tools: [
        {
          icon: 'percent',
          title: "Baker's Percentage",
          description: 'Calculate ingredient ratios',
          color: theme.colors.primary[600],
          route: 'BakersCalculator',
        },
        {
          icon: 'water',
          title: 'Hydration Converter',
          description: 'Adjust dough hydration',
          color: theme.colors.bench.waterBlue,
          route: 'HydrationCalculator',
        },
        {
          icon: 'resize',
          title: 'Recipe Scaler',
          description: 'Scale recipes up or down',
          color: theme.colors.error.main,
          route: 'ScalingCalculator',
        },
        {
          icon: 'grain',
          title: 'Flour Blend Calculator',
          description: 'Mix flours to target protein %',
          color: theme.colors.warning.main,
          route: 'FlourBlendCalculator',
        },
      ],
    },
    {
      eyebrow: 'Fix It',
      title: 'Rescue',
      tools: [
        {
          icon: 'camera-iris',
          title: 'Photo Rescue',
          description: 'Diagnose your dough from a photo',
          color: theme.colors.bench.heatRed,
          route: 'PhotoRescue',
        },
        {
          icon: 'lifebuoy',
          title: 'Recipe Rescue',
          description: 'Fix ingredient mistakes',
          color: theme.colors.error.main,
          route: 'RecipeRescueCalculator',
        },
      ],
    },
    {
      eyebrow: 'Build',
      title: 'Starter & Dough',
      tools: [
        {
          icon: 'flask-outline',
          title: 'Levain Builder',
          description: 'Build starter for your recipe',
          color: theme.colors.primary[500],
          route: 'LevainBuilder',
        },
        {
          icon: 'clock-time-four',
          title: 'Preferment Calculator',
          description: 'Poolish, biga, pâte fermentée',
          color: theme.colors.info.dark,
          route: 'PrefermentCalculator',
        },
        {
          icon: 'weight-gram',
          title: 'Dough Weight Calculator',
          description: 'Calculate dough portions',
          color: theme.colors.secondary[600],
          route: 'DoughWeightCalculator',
        },
        {
          icon: 'percent-circle',
          title: 'Starter Percentage',
          description: 'Calculate fermentation speed',
          color: theme.colors.bench.starterGreen,
          route: 'StarterPercentageCalculator',
        },
        {
          icon: 'thermometer',
          title: 'Temperature Calculator',
          description: 'Control dough temperature',
          color: theme.colors.warning.main,
          route: 'TemperatureCalculator',
        },
      ],
    },
  ];

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Featured Row */}
      <View style={styles.content}>
        <SectionHeader eyebrow="Featured" title="Top Tools" />
        <View style={styles.featuredRow}>
          {featured.map((tool, i) => (
            <FeaturedToolCard key={i} tool={tool} onPress={tool.onPress} />
          ))}
        </View>

        {/* Grouped tool sections */}
        {groups.map((group, gi) => (
          <View key={gi} style={styles.group}>
            <SectionHeader eyebrow={group.eyebrow} title={group.title} />
            <View style={styles.groupTools}>
              {group.tools.map((tool, ti) => (
                <ToolRow
                  key={ti}
                  tool={tool}
                  onPress={() => {
                    if (tool.route) go(tool.route);
                    else if (tool.onPress) tool.onPress();
                  }}
                />
              ))}
            </View>
          </View>
        ))}
      </View>
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
    paddingBottom: 40,
  },
  featuredRow: {
    flexDirection: 'row',
    gap: theme.spacing.md,
    marginBottom: theme.spacing.xl,
  },
  featuredBtn: {
    flex: 1,
  },
  featuredCard: {
    alignItems: 'flex-start',
    gap: theme.spacing.sm,
  },
  featuredIcon: {
    width: 48,
    height: 48,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  featuredTitle: {
    fontSize: theme.typography.sizes.base,
    fontFamily: theme.typography.fonts.semibold,
    color: theme.colors.bench.crust,
  },
  featuredDesc: {
    fontSize: theme.typography.sizes.xs,
    fontFamily: theme.typography.fonts.regular,
    color: theme.colors.text.secondary,
    lineHeight: 16,
  },
  group: {
    marginBottom: theme.spacing.xl,
  },
  groupTools: {
    gap: theme.spacing.sm,
  },
  toolRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.md,
  },
  toolIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  toolInfo: {
    flex: 1,
  },
  toolTitle: {
    fontSize: theme.typography.sizes.base,
    fontFamily: theme.typography.fonts.semibold,
    color: theme.colors.bench.crust,
    marginBottom: 2,
  },
  toolDesc: {
    fontSize: theme.typography.sizes.xs,
    fontFamily: theme.typography.fonts.regular,
    color: theme.colors.text.secondary,
  },
});
