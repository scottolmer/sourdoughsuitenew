/**
 * Tools Screen
 * Calculator suite and baking tools
 */

import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import Card from '../../components/Card';
import { theme } from '../../theme';

type ToolsStackParamList = {
  ToolsList: undefined;
  BakersCalculator: undefined;
  TimelineCalculator: undefined;
  HydrationCalculator: undefined;
  TemperatureCalculator: undefined;
  ScalingCalculator: undefined;
  LevainBuilder: undefined;
  StarterPercentageCalculator: undefined;
  PrefermentCalculator: undefined;
  DoughWeightCalculator: undefined;
};

type NavigationProp = NativeStackNavigationProp<ToolsStackParamList>;

interface ToolCardProps {
  icon: string;
  title: string;
  description: string;
  color: string;
  onPress: () => void;
}

function ToolCard({ icon, title, description, color, onPress }: ToolCardProps) {
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
      <Card variant="elevated" padding="lg" style={styles.toolCard}>
        <View style={styles.toolHeader}>
          <View style={[styles.toolIcon, { backgroundColor: color + '20' }]}>
            <Icon name={icon} size={28} color={color} />
          </View>
          <View style={styles.toolInfo}>
            <Text style={styles.toolTitle}>{title}</Text>
            <Text style={styles.toolDescription}>{description}</Text>
          </View>
          <Icon name="chevron-right" size={24} color={theme.colors.text.disabled} />
        </View>
      </Card>
    </TouchableOpacity>
  );
}

export default function ToolsScreen() {
  const navigation = useNavigation<NavigationProp>();

  const tools = [
    {
      icon: 'percent',
      title: "Baker's Percentage",
      description: 'Calculate ingredient ratios',
      color: theme.colors.primary[600],
      onPress: () => navigation.navigate('BakersCalculator'),
    },
    {
      icon: 'flask-outline',
      title: 'Levain Builder',
      description: 'Build starter for your recipe',
      color: theme.colors.primary[500],
      onPress: () => navigation.navigate('LevainBuilder'),
    },
    {
      icon: 'percent-circle',
      title: 'Starter Percentage Calculator',
      description: 'Calculate fermentation speed',
      color: theme.colors.success.dark,
      onPress: () => navigation.navigate('StarterPercentageCalculator'),
    },
    {
      icon: 'water',
      title: 'Hydration Converter',
      description: 'Adjust dough hydration',
      color: theme.colors.success.main,
      onPress: () => navigation.navigate('HydrationCalculator'),
    },
    {
      icon: 'thermometer',
      title: 'Temperature Calculator',
      description: 'Control dough temperature',
      color: theme.colors.warning.main,
      onPress: () => navigation.navigate('TemperatureCalculator'),
    },
    {
      icon: 'clock-time-four',
      title: 'Preferment Calculator',
      description: 'Poolish, biga, pâte fermentée',
      color: theme.colors.info.dark,
      onPress: () => navigation.navigate('PrefermentCalculator'),
    },
    {
      icon: 'clock-outline',
      title: 'Timeline Calculator',
      description: 'Plan your baking schedule',
      color: theme.colors.info.main,
      onPress: () => navigation.navigate('TimelineCalculator'),
    },
    {
      icon: 'weight-gram',
      title: 'Dough Weight Calculator',
      description: 'Calculate dough portions',
      color: theme.colors.secondary[600],
      onPress: () => navigation.navigate('DoughWeightCalculator'),
    },
    {
      icon: 'resize',
      title: 'Recipe Scaler',
      description: 'Scale recipes up or down',
      color: theme.colors.error.main,
      onPress: () => navigation.navigate('ScalingCalculator'),
    },
  ];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Baking Tools</Text>
        <Text style={styles.headerSubtitle}>
          Professional calculators and AI-powered tools
        </Text>
      </View>

      <View style={styles.content}>
        {tools.map((tool, index) => (
          <View key={index} style={styles.toolContainer}>
            <ToolCard {...tool} />
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background.paper,
  },
  header: {
    padding: theme.spacing.xl,
    backgroundColor: theme.colors.white,
  },
  headerTitle: {
    fontSize: theme.typography.sizes['2xl'],
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.xs,
  },
  headerSubtitle: {
    fontSize: theme.typography.sizes.base,
    color: theme.colors.text.secondary,
  },
  content: {
    padding: theme.spacing.md,
  },
  toolContainer: {
    marginBottom: theme.spacing.md,
  },
  toolCard: {
    borderRadius: theme.borderRadius.lg,
  },
  toolHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  toolIcon: {
    width: 56,
    height: 56,
    borderRadius: theme.borderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  toolInfo: {
    flex: 1,
    marginLeft: theme.spacing.md,
  },
  toolTitle: {
    fontSize: theme.typography.sizes.lg,
    fontWeight: theme.typography.weights.semibold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.xs,
  },
  toolDescription: {
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.text.secondary,
  },
});
