/**
 * Hydration Calculator
 * Calculate and adjust dough hydration percentage
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { CompositeNavigationProp } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Button from '../../components/Button';
import BasicInput from '../../components/BasicInput';
import Card from '../../components/Card';
import { theme } from '../../theme';
import { ToolsStackParamList, MainTabParamList } from '../../navigation/types';

type HydrationCalculatorNavigationProp = CompositeNavigationProp<
  NativeStackScreenProps<ToolsStackParamList, 'HydrationCalculator'>['navigation'],
  BottomTabNavigationProp<MainTabParamList>
>;

type Props = {
  navigation: HydrationCalculatorNavigationProp;
};

export default function HydrationCalculatorScreen({ navigation }: Props) {
  const [flourWeight, setFlourWeight] = useState('');
  const [waterWeight, setWaterWeight] = useState('');
  const [hydration, setHydration] = useState('');
  const [targetHydration, setTargetHydration] = useState('');

  // Calculate hydration when flour or water changes
  useEffect(() => {
    const flour = parseFloat(flourWeight);
    const water = parseFloat(waterWeight);

    if (flour && water && flour > 0) {
      const calculatedHydration = ((water / flour) * 100).toFixed(1);
      setHydration(calculatedHydration);
    } else {
      setHydration('');
    }
  }, [flourWeight, waterWeight]);

  const calculateWaterNeeded = () => {
    const flour = parseFloat(flourWeight);
    const target = parseFloat(targetHydration);

    if (!flour || !target || flour <= 0 || target <= 0) {
      return null;
    }

    const waterNeeded = (flour * target) / 100;
    return waterNeeded.toFixed(1);
  };

  const calculateFlourNeeded = () => {
    const water = parseFloat(waterWeight);
    const target = parseFloat(targetHydration);

    if (!water || !target || water <= 0 || target <= 0) {
      return null;
    }

    const flourNeeded = (water * 100) / target;
    return flourNeeded.toFixed(1);
  };

  const adjustToTarget = () => {
    const flour = parseFloat(flourWeight);
    const target = parseFloat(targetHydration);

    if (flour && target) {
      const waterNeeded = (flour * target) / 100;
      setWaterWeight(waterNeeded.toFixed(1));
    }
  };

  const clearAll = () => {
    setFlourWeight('');
    setWaterWeight('');
    setHydration('');
    setTargetHydration('');
  };

  const handleSaveAsRecipe = () => {
    // Navigate to AddRecipe with flour and water values, plus default salt/starter
    (navigation as any).navigate('RecipesTab', {
      screen: 'AddRecipe',
      params: {
        prefilledFormula: {
          flour: flourWeight,
          water: hydration, // Hydration percentage
          salt: '2', // Default salt percentage
          starter: '20', // Default starter percentage
        },
      },
    });
  };

  const getHydrationLevel = () => {
    const h = parseFloat(hydration);
    if (!h) return null;

    if (h < 60) return { label: 'Low', color: theme.colors.warning.main };
    if (h < 70) return { label: 'Medium', color: theme.colors.info.main };
    if (h < 80) return { label: 'High', color: theme.colors.success.main };
    return { label: 'Very High', color: theme.colors.primary[600] };
  };

  const waterNeeded = calculateWaterNeeded();
  const flourNeeded = calculateFlourNeeded();
  const hydrationLevel = getHydrationLevel();

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header}>
          <Icon name="water" size={48} color={theme.colors.success.main} />
          <Text style={styles.headerTitle}>Hydration Calculator</Text>
          <Text style={styles.headerSubtitle}>
            Calculate dough hydration and adjust recipes
          </Text>
        </View>

        <View style={styles.content}>
          {/* Current Recipe */}
          <Card variant="elevated">
            <Text style={styles.sectionTitle}>Current Recipe</Text>
            <BasicInput
              label="Flour Weight"
              placeholder="e.g., 500"
              value={flourWeight}
              onChangeText={setFlourWeight}
              keyboardType="numeric"
              leftIcon="wheat"
              helperText="Total flour in grams"
            />
            <BasicInput
              label="Water Weight"
              placeholder="e.g., 350"
              value={waterWeight}
              onChangeText={setWaterWeight}
              keyboardType="numeric"
              leftIcon="water"
              helperText="Total water in grams"
            />
          </Card>

          {/* Current Hydration Result */}
          {hydration && (
            <Card variant="filled" style={[
              styles.resultCard,
              { backgroundColor: hydrationLevel?.color + '20' }
            ]}>
              <View style={styles.resultHeader}>
                <Text style={styles.resultLabel}>Current Hydration</Text>
                {hydrationLevel && (
                  <View style={[
                    styles.levelBadge,
                    { backgroundColor: hydrationLevel.color }
                  ]}>
                    <Text style={styles.levelText}>{hydrationLevel.label}</Text>
                  </View>
                )}
              </View>
              <Text style={[
                styles.resultValue,
                { color: hydrationLevel?.color }
              ]}>
                {hydration}%
              </Text>
              <Text style={styles.resultDescription}>
                Hydration = (Water ÷ Flour) × 100
              </Text>
            </Card>
          )}

          {/* Target Hydration */}
          <Card variant="elevated">
            <Text style={styles.sectionTitle}>Adjust to Target Hydration</Text>
            <BasicInput
              label="Target Hydration %"
              placeholder="e.g., 75"
              value={targetHydration}
              onChangeText={setTargetHydration}
              keyboardType="numeric"
              leftIcon="target"
            />

            {targetHydration && flourWeight && (
              <View style={styles.targetResults}>
                <View style={styles.targetRow}>
                  <Icon name="water" size={20} color={theme.colors.info.main} />
                  <Text style={styles.targetLabel}>
                    Water needed for {targetHydration}%:
                  </Text>
                  <Text style={styles.targetValue}>{waterNeeded}g</Text>
                </View>
                <Button
                  title="Apply This Amount"
                  variant="outline"
                  size="small"
                  onPress={adjustToTarget}
                  leftIcon="check"
                />
              </View>
            )}

            {targetHydration && waterWeight && (
              <View style={styles.targetResults}>
                <View style={styles.targetRow}>
                  <Icon name="wheat" size={20} color={theme.colors.warning.main} />
                  <Text style={styles.targetLabel}>
                    Flour needed for {targetHydration}%:
                  </Text>
                  <Text style={styles.targetValue}>{flourNeeded}g</Text>
                </View>
              </View>
            )}
          </Card>

          {/* Actions */}
          <View style={styles.actions}>
            {hydration && flourWeight && (
              <Button
                title="Save as Recipe"
                onPress={handleSaveAsRecipe}
                fullWidth
                leftIcon="content-save"
                variant="secondary"
                style={styles.saveButton}
              />
            )}
            <Button
              title="Clear All"
              variant="outline"
              onPress={clearAll}
              fullWidth
            />
          </View>

          {/* Info Card */}
          <Card variant="outlined">
            <Text style={styles.infoTitle}>Hydration Levels</Text>
            <Text style={styles.infoText}>
              <Text style={styles.infoBold}>Low (50-60%):</Text> Bagels, pretzels{'\n'}
              <Text style={styles.infoBold}>Medium (60-70%):</Text> Sandwich bread{'\n'}
              <Text style={styles.infoBold}>High (70-80%):</Text> Artisan bread, pizza{'\n'}
              <Text style={styles.infoBold}>Very High (80%+):</Text> Ciabatta, focaccia{'\n\n'}
              Higher hydration creates more open crumb and chewier texture, but is stickier to work with.
            </Text>
          </Card>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background.default,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  header: {
    padding: theme.spacing.xl,
    backgroundColor: theme.colors.white,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border.light,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: theme.typography.sizes['2xl'],
    fontWeight: theme.typography.weights.bold as any,
    color: theme.colors.text.primary,
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.xs,
  },
  headerSubtitle: {
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.text.secondary,
    textAlign: 'center',
  },
  content: {
    padding: theme.spacing.lg,
  },
  sectionTitle: {
    fontSize: theme.typography.sizes.lg,
    fontWeight: theme.typography.weights.semibold as any,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.md,
  },
  resultCard: {
    alignItems: 'center',
    padding: theme.spacing.xl,
  },
  resultHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  resultLabel: {
    fontSize: theme.typography.sizes.base,
    fontWeight: theme.typography.weights.medium as any,
    color: theme.colors.text.secondary,
  },
  levelBadge: {
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.full,
  },
  levelText: {
    fontSize: theme.typography.sizes.xs,
    fontWeight: theme.typography.weights.medium as any,
    color: theme.colors.white,
  },
  resultValue: {
    fontSize: 48,
    fontWeight: theme.typography.weights.bold as any,
    marginBottom: theme.spacing.xs,
  },
  resultDescription: {
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.text.secondary,
  },
  targetResults: {
    marginTop: theme.spacing.md,
    padding: theme.spacing.md,
    backgroundColor: theme.colors.background.default,
    borderRadius: theme.borderRadius.md,
  },
  targetRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  targetLabel: {
    flex: 1,
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.text.secondary,
  },
  targetValue: {
    fontSize: theme.typography.sizes.lg,
    fontWeight: theme.typography.weights.bold as any,
    color: theme.colors.text.primary,
  },
  actions: {
  },
  saveButton: {
    marginBottom: theme.spacing.sm,
  },
  infoTitle: {
    fontSize: theme.typography.sizes.base,
    fontWeight: theme.typography.weights.semibold as any,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.sm,
  },
  infoText: {
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.text.secondary,
    lineHeight: 20,
  },
  infoBold: {
    fontWeight: theme.typography.weights.semibold as any,
    color: theme.colors.text.primary,
  },
});
