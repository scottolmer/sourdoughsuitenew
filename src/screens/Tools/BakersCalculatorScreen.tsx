/**
 * Baker's Percentage Calculator
 * Calculate ingredient amounts based on baker's percentages
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  TouchableOpacity,
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
import { calculateAmountFromPercentage, roundTo } from '../../utils/sourdoughCalculations';

type CalculationMode = 'flour' | 'total';

interface Ingredient {
  name: string;
  percentage: string;
  amount: string;
}

type BakersCalculatorNavigationProp = CompositeNavigationProp<
  NativeStackScreenProps<ToolsStackParamList, 'BakersCalculator'>['navigation'],
  BottomTabNavigationProp<MainTabParamList>
>;

type Props = {
  navigation: BakersCalculatorNavigationProp;
};

// Recipe presets
const RECIPE_PRESETS = [
  {
    name: 'Country Loaf',
    formula: [
      { name: 'Water', percentage: '70' },
      { name: 'Salt', percentage: '2' },
      { name: 'Starter', percentage: '20' },
    ],
  },
  {
    name: 'Baguette',
    formula: [
      { name: 'Water', percentage: '75' },
      { name: 'Salt', percentage: '2' },
      { name: 'Starter', percentage: '15' },
    ],
  },
  {
    name: 'Ciabatta',
    formula: [
      { name: 'Water', percentage: '80' },
      { name: 'Salt', percentage: '2' },
      { name: 'Starter', percentage: '20' },
      { name: 'Olive Oil', percentage: '3' },
    ],
  },
  {
    name: 'Pizza Dough',
    formula: [
      { name: 'Water', percentage: '65' },
      { name: 'Salt', percentage: '2' },
      { name: 'Starter', percentage: '20' },
      { name: 'Olive Oil', percentage: '2' },
    ],
  },
  {
    name: 'Bagels',
    formula: [
      { name: 'Water', percentage: '55' },
      { name: 'Salt', percentage: '2' },
      { name: 'Starter', percentage: '15' },
      { name: 'Malt Syrup', percentage: '2' },
    ],
  },
];

export default function BakersCalculatorScreen({ navigation }: Props) {
  const [calculationMode, setCalculationMode] = useState<CalculationMode>('flour');
  const [flourWeight, setFlourWeight] = useState('');
  const [totalWeight, setTotalWeight] = useState('');
  const [ingredients, setIngredients] = useState<Ingredient[]>([
    { name: 'Water', percentage: '70', amount: '' },
    { name: 'Salt', percentage: '2', amount: '' },
    { name: 'Starter', percentage: '20', amount: '' },
  ]);
  const [showResults, setShowResults] = useState(false);

  const calculateAmounts = () => {
    if (calculationMode === 'flour') {
      // Flour-based calculation (existing behavior)
      const flourWeightNum = parseFloat(flourWeight);
      if (!flourWeightNum || flourWeightNum <= 0) {
        Alert.alert('Error', 'Please enter a valid flour weight');
        return;
      }

      const updatedIngredients = ingredients.map((ing) => {
        const percentage = parseFloat(ing.percentage) || 0;
        const amount = roundTo(calculateAmountFromPercentage(flourWeightNum, percentage), 1).toString();
        return { ...ing, amount };
      });

      setIngredients(updatedIngredients);

      // Calculate and update total weight
      const totalPercentage = ingredients.reduce(
        (sum, ing) => sum + (parseFloat(ing.percentage) || 0),
        100
      );
      const calculatedTotal = roundTo(calculateAmountFromPercentage(flourWeightNum, totalPercentage), 1);
      setTotalWeight(calculatedTotal.toString());

      setShowResults(true);
    } else {
      // Total weight-based calculation (new feature)
      const totalWeightNum = parseFloat(totalWeight);
      if (!totalWeightNum || totalWeightNum <= 0) {
        Alert.alert('Error', 'Please enter a valid total dough weight');
        return;
      }

      // Calculate total percentage
      const totalPercentage = ingredients.reduce(
        (sum, ing) => sum + (parseFloat(ing.percentage) || 0),
        100 // flour is always 100%
      );

      // Work backwards to find flour weight
      const calculatedFlour = totalWeightNum / (totalPercentage / 100);
      setFlourWeight(calculatedFlour.toFixed(1));

      // Calculate all ingredient amounts based on calculated flour weight
      const updatedIngredients = ingredients.map((ing) => {
        const percentage = parseFloat(ing.percentage) || 0;
        const amount = roundTo(calculateAmountFromPercentage(calculatedFlour, percentage), 1).toString();
        return { ...ing, amount };
      });

      setIngredients(updatedIngredients);
      setShowResults(true);
    }
  };

  const handleModeChange = (newMode: CalculationMode) => {
    if (newMode === calculationMode) return;

    if (newMode === 'total' && flourWeight) {
      // Switching from flour to total - calculate current total
      const flourWeightNum = parseFloat(flourWeight);
      const totalPercentage = ingredients.reduce(
        (sum, ing) => sum + (parseFloat(ing.percentage) || 0),
        100
      );
      const calculatedTotal = roundTo(calculateAmountFromPercentage(flourWeightNum, totalPercentage), 1);
      setTotalWeight(calculatedTotal.toString());
    } else if (newMode === 'flour' && totalWeight) {
      // Switching from total to flour - calculate flour needed
      const totalWeightNum = parseFloat(totalWeight);
      const totalPercentage = ingredients.reduce(
        (sum, ing) => sum + (parseFloat(ing.percentage) || 0),
        100
      );
      const calculatedFlour = (totalWeightNum / (totalPercentage / 100)).toFixed(1);
      setFlourWeight(calculatedFlour);
    }

    setCalculationMode(newMode);
    setShowResults(false);
  };

  const setPresetTotalWeight = (weight: number) => {
    setTotalWeight(weight.toString());
    setShowResults(false);
  };

  const addIngredient = () => {
    setIngredients([
      ...ingredients,
      { name: '', percentage: '', amount: '' },
    ]);
  };

  const updateIngredient = (index: number, field: keyof Ingredient, value: string) => {
    const updated = [...ingredients];
    updated[index][field] = value;
    setIngredients(updated);
  };

  const removeIngredient = (index: number) => {
    setIngredients(ingredients.filter((_, i) => i !== index));
  };

  const clearAll = () => {
    setFlourWeight('');
    setTotalWeight('');
    setIngredients([
      { name: 'Water', percentage: '70', amount: '' },
      { name: 'Salt', percentage: '2', amount: '' },
      { name: 'Starter', percentage: '20', amount: '' },
    ]);
    setShowResults(false);
  };

  const loadPreset = (presetName: string) => {
    const preset = RECIPE_PRESETS.find(p => p.name === presetName);
    if (preset) {
      const presetIngredients = preset.formula.map(ing => ({
        ...ing,
        amount: '',
      }));
      setIngredients(presetIngredients);
      setShowResults(false);
    }
  };

  const handleSaveAsRecipe = () => {
    // Extract core ingredients
    const waterIng = ingredients.find(
      (ing) => ing.name.toLowerCase() === 'water'
    );
    const saltIng = ingredients.find(
      (ing) => ing.name.toLowerCase() === 'salt'
    );
    const starterIng = ingredients.find(
      (ing) => ing.name.toLowerCase() === 'starter'
    );

    // Collect additional ingredients (anything that's not water, salt, or starter)
    const additionalIngredients = ingredients
      .filter(
        (ing) =>
          ing.name.toLowerCase() !== 'water' &&
          ing.name.toLowerCase() !== 'salt' &&
          ing.name.toLowerCase() !== 'starter' &&
          ing.name.trim() !== ''
      )
      .map((ing) => ({
        name: ing.name,
        amount: parseFloat(ing.percentage) || 0,
        unit: '%',
        type: 'other' as const,
      }));

    // Navigate to AddRecipe with prefilled data
    (navigation as any).navigate('RecipesTab', {
      screen: 'AddRecipe',
      params: {
        prefilledFormula: {
          flour: flourWeight,
          water: waterIng?.percentage || '0',
          salt: saltIng?.percentage || '0',
          starter: starterIng?.percentage || '0',
          additionalIngredients:
            additionalIngredients.length > 0 ? additionalIngredients : undefined,
        },
      },
    });
  };

  const totalPercentage = ingredients.reduce(
    (sum, ing) => sum + (parseFloat(ing.percentage) || 0),
    100 // Include flour at 100%
  );

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
          <Icon name="percent" size={48} color={theme.colors.primary[600]} />
          <Text style={styles.headerTitle}>Baker's Percentage</Text>
          <Text style={styles.headerSubtitle}>
            Calculate by flour weight or total dough weight
          </Text>
        </View>

        <View style={styles.content}>
          {/* Calculation Mode Toggle */}
          <Card variant="outlined" style={styles.modeCard}>
            <Text style={styles.modeLabel}>Calculate by:</Text>
            <View style={styles.modeToggle}>
              <TouchableOpacity
                style={[
                  styles.modeButton,
                  calculationMode === 'flour' && styles.modeButtonActive,
                ]}
                onPress={() => handleModeChange('flour')}
              >
                <Icon
                  name="grain"
                  size={20}
                  color={
                    calculationMode === 'flour'
                      ? theme.colors.white
                      : theme.colors.text.secondary
                  }
                />
                <Text
                  style={[
                    styles.modeButtonText,
                    calculationMode === 'flour' && styles.modeButtonTextActive,
                  ]}
                >
                  Flour Weight
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.modeButton,
                  calculationMode === 'total' && styles.modeButtonActive,
                ]}
                onPress={() => handleModeChange('total')}
              >
                <Icon
                  name="scale-balance"
                  size={20}
                  color={
                    calculationMode === 'total'
                      ? theme.colors.white
                      : theme.colors.text.secondary
                  }
                />
                <Text
                  style={[
                    styles.modeButtonText,
                    calculationMode === 'total' && styles.modeButtonTextActive,
                  ]}
                >
                  Total Weight
                </Text>
              </TouchableOpacity>
            </View>
          </Card>

          {/* Recipe Presets */}
          <Card variant="outlined" style={styles.presetsCard}>
            <Text style={styles.presetTitle}>Quick Presets</Text>
            <View style={styles.presetButtons}>
              {RECIPE_PRESETS.map((preset) => (
                <Button
                  key={preset.name}
                  title={preset.name}
                  variant="outline"
                  size="small"
                  onPress={() => loadPreset(preset.name)}
                  style={styles.presetButton}
                />
              ))}
            </View>
          </Card>

          {/* Total Weight Presets (only show in total mode) */}
          {calculationMode === 'total' && (
            <Card variant="outlined" style={styles.presetsCard}>
              <Text style={styles.presetTitle}>Common Loaf Sizes</Text>
              <View style={styles.presetButtons}>
                {[500, 750, 1000, 1500, 2000].map((weight) => (
                  <Button
                    key={weight}
                    title={`${weight}g`}
                    variant="outline"
                    size="small"
                    onPress={() => setPresetTotalWeight(weight)}
                    style={styles.presetButton}
                  />
                ))}
              </View>
            </Card>
          )}

          {/* Dynamic Input - Flour or Total Weight */}
          <Card variant="elevated">
            {calculationMode === 'flour' ? (
              <>
                <Text style={styles.sectionTitle}>Flour Weight (Base at 100%)</Text>
                <BasicInput
                  label="Total Flour"
                  placeholder="e.g., 500"
                  value={flourWeight}
                  onChangeText={setFlourWeight}
                  keyboardType="numeric"
                  helperText="Weight in grams"
                />
              </>
            ) : (
              <>
                <Text style={styles.sectionTitle}>Total Dough Weight</Text>
                <BasicInput
                  label="Desired Total Weight"
                  placeholder="e.g., 1000"
                  value={totalWeight}
                  onChangeText={setTotalWeight}
                  keyboardType="numeric"
                  helperText="Final dough weight in grams"
                />
                {showResults && flourWeight && (
                  <View style={styles.calculatedFlourInfo}>
                    <Icon
                      name="information"
                      size={16}
                      color={theme.colors.primary[600]}
                    />
                    <Text style={styles.calculatedFlourText}>
                      Uses {flourWeight}g flour to reach {totalWeight}g total
                    </Text>
                  </View>
                )}
              </>
            )}
          </Card>

          {/* Ingredients */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Ingredients</Text>
            {ingredients.map((ingredient, index) => (
              <Card key={index} variant="outlined" style={styles.ingredientCard}>
                <View style={styles.ingredientRow}>
                  <View style={styles.ingredientInputs}>
                    <BasicInput
                      label="Name"
                      placeholder="e.g., Water"
                      value={ingredient.name}
                      onChangeText={(value) => updateIngredient(index, 'name', value)}
                      containerStyle={styles.nameInput}
                    />
                    <BasicInput
                      label="%"
                      placeholder="0"
                      value={ingredient.percentage}
                      onChangeText={(value) =>
                        updateIngredient(index, 'percentage', value)
                      }
                      keyboardType="numeric"
                      containerStyle={styles.percentInput}
                    />
                  </View>
                  <Button
                    title=""
                    variant="ghost"
                    size="small"
                    leftIcon="close"
                    onPress={() => removeIngredient(index)}
                    style={styles.removeButton}
                  />
                </View>
              </Card>
            ))}

            <Button
              title="Add Ingredient"
              variant="outline"
              onPress={addIngredient}
              fullWidth
              leftIcon="plus"
            />
          </View>

          {/* Calculated Results */}
          {showResults && (
            <Card variant="elevated" style={styles.resultsCard}>
              <Text style={styles.resultsTitle}>Recipe</Text>
              <View style={styles.resultsList}>
                <View style={styles.resultItem}>
                  <View style={styles.resultNameContainer}>
                    <Text style={styles.resultName}>Flour</Text>
                    {calculationMode === 'total' && (
                      <Text style={styles.calculatedBadge}>(calculated)</Text>
                    )}
                  </View>
                  <Text style={styles.resultAmount}>{flourWeight}g</Text>
                </View>
                {ingredients.map((ingredient, index) => (
                  ingredient.name && ingredient.amount && (
                    <View key={index} style={styles.resultItem}>
                      <Text style={styles.resultName}>{ingredient.name}</Text>
                      <Text style={styles.resultAmount}>{ingredient.amount}g</Text>
                    </View>
                  )
                ))}
              </View>
            </Card>
          )}

          {/* Results Summary */}
          {showResults && (
            <Card variant="filled" style={styles.summaryCard}>
              <Text style={styles.summaryTitle}>Summary</Text>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Total Percentage:</Text>
                <Text style={styles.summaryValue}>{totalPercentage.toFixed(1)}%</Text>
              </View>
              <View style={styles.summaryRow}>
                <View style={styles.resultNameContainer}>
                  <Text style={styles.summaryLabel}>Total Dough Weight:</Text>
                  {calculationMode === 'flour' && (
                    <Text style={styles.calculatedBadge}>(calculated)</Text>
                  )}
                </View>
                <Text style={styles.summaryValue}>{totalWeight}g</Text>
              </View>
              {calculationMode === 'total' && (
                <View style={styles.yieldEstimate}>
                  <Icon name="bread-slice" size={16} color={theme.colors.text.secondary} />
                  <Text style={styles.yieldText}>
                    ≈ {Math.round(parseFloat(totalWeight) / 500)} standard loaves (500g each)
                  </Text>
                </View>
              )}
            </Card>
          )}

          {/* Actions */}
          <View style={styles.actions}>
            <Button
              title="Calculate"
              onPress={calculateAmounts}
              fullWidth
              leftIcon="calculator"
            />
            {showResults && (
              <Button
                title="Save as Recipe"
                onPress={handleSaveAsRecipe}
                fullWidth
                leftIcon="content-save"
                variant="secondary"
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
            <Text style={styles.infoTitle}>How it works</Text>
            <Text style={styles.infoText}>
              Baker's percentage expresses each ingredient as a percentage of the total flour weight.{'\n\n'}
              • Flour is always 100%{'\n'}
              • Water at 70% = 70g per 100g flour{'\n'}
              • Salt at 2% = 2g per 100g flour{'\n\n'}
              <Text style={styles.infoBold}>Flour Weight Mode:</Text> Enter flour amount, get total weight{'\n'}
              <Text style={styles.infoBold}>Total Weight Mode:</Text> Enter desired total, get flour amount needed{'\n\n'}
              Perfect when a recipe says "makes 1000g dough" but doesn't specify ingredient amounts.
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
    backgroundColor: theme.colors.cardBg.cream,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border.light,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: theme.typography.sizes['3xl'],
    fontFamily: theme.typography.fonts.heading,
    fontWeight: theme.typography.weights.bold as any,
    color: theme.colors.text.primary,
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.xs,
    letterSpacing: theme.typography.letterSpacing.tight,
  },
  headerSubtitle: {
    fontSize: theme.typography.sizes.base,
    fontFamily: theme.typography.fonts.regular,
    color: theme.colors.text.secondary,
    textAlign: 'center',
  },
  content: {
    padding: theme.spacing.lg,
  },
  section: {
    marginBottom: theme.spacing.md,
  },
  sectionTitle: {
    fontSize: theme.typography.sizes.xl,
    fontFamily: theme.typography.fonts.semibold,
    fontWeight: theme.typography.weights.semibold as any,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.sm,
  },
  ingredientCard: {
    marginBottom: theme.spacing.sm,
  },
  ingredientRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  ingredientInputs: {
    flex: 1,
    flexDirection: 'row',
  },
  nameInput: {
    flex: 3,
    marginRight: theme.spacing.sm,
  },
  percentInput: {
    flex: 1,
  },
  removeButton: {
    minWidth: 40,
    marginLeft: theme.spacing.sm,
  },
  resultsCard: {
    marginBottom: theme.spacing.md,
    backgroundColor: theme.colors.success.light + '20',
  },
  resultsTitle: {
    fontSize: theme.typography.sizes['2xl'],
    fontFamily: theme.typography.fonts.heading,
    fontWeight: theme.typography.weights.bold as any,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.md,
    letterSpacing: theme.typography.letterSpacing.tight,
  },
  resultsList: {
    gap: theme.spacing.sm,
  },
  resultItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: theme.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border.light,
  },
  resultName: {
    fontSize: theme.typography.sizes.lg,
    fontFamily: theme.typography.fonts.medium,
    fontWeight: theme.typography.weights.medium as any,
    color: theme.colors.text.primary,
  },
  resultAmount: {
    fontSize: theme.typography.sizes['2xl'],
    fontFamily: theme.typography.fonts.bold,
    fontWeight: theme.typography.weights.bold as any,
    color: theme.colors.success.dark,
  },
  summaryCard: {
    backgroundColor: theme.colors.primary[50],
  },
  summaryTitle: {
    fontSize: theme.typography.sizes.xl,
    fontFamily: theme.typography.fonts.semibold,
    fontWeight: theme.typography.weights.bold as any,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.md,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.sm,
  },
  summaryLabel: {
    fontSize: theme.typography.sizes.base,
    fontFamily: theme.typography.fonts.regular,
    color: theme.colors.text.secondary,
  },
  summaryValue: {
    fontSize: theme.typography.sizes.lg,
    fontFamily: theme.typography.fonts.semibold,
    fontWeight: theme.typography.weights.semibold as any,
    color: theme.colors.text.primary,
  },
  actions: {
    marginBottom: theme.spacing.md,
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
  presetsCard: {
    marginBottom: theme.spacing.md,
    backgroundColor: theme.colors.primary[50],
  },
  presetTitle: {
    fontSize: theme.typography.sizes.base,
    fontWeight: theme.typography.weights.semibold as any,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.sm,
  },
  presetButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.sm,
  },
  presetButton: {
    flex: 0,
    minWidth: 0,
    paddingHorizontal: theme.spacing.md,
  },
  modeCard: {
    marginBottom: theme.spacing.md,
    backgroundColor: theme.colors.white,
  },
  modeLabel: {
    fontSize: theme.typography.sizes.sm,
    fontWeight: theme.typography.weights.semibold as any,
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing.sm,
  },
  modeToggle: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
  },
  modeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.sm,
    borderRadius: theme.borderRadius.md,
    borderWidth: 2,
    borderColor: theme.colors.border.default,
    backgroundColor: theme.colors.white,
    gap: theme.spacing.xs,
  },
  modeButtonActive: {
    backgroundColor: theme.colors.primary[600],
    borderColor: theme.colors.primary[600],
  },
  modeButtonText: {
    fontSize: theme.typography.sizes.sm,
    fontFamily: theme.typography.fonts.medium,
    fontWeight: theme.typography.weights.medium as any,
    color: theme.colors.text.secondary,
  },
  modeButtonTextActive: {
    color: theme.colors.white,
    fontWeight: theme.typography.weights.semibold as any,
  },
  calculatedFlourInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: theme.spacing.sm,
    padding: theme.spacing.sm,
    backgroundColor: theme.colors.primary[50],
    borderRadius: theme.borderRadius.sm,
    gap: theme.spacing.xs,
  },
  calculatedFlourText: {
    flex: 1,
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.primary[700],
  },
  resultNameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xs,
  },
  calculatedBadge: {
    fontSize: theme.typography.sizes.xs,
    color: theme.colors.text.tertiary,
    fontStyle: 'italic',
  },
  yieldEstimate: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: theme.spacing.sm,
    paddingTop: theme.spacing.sm,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border.light,
    gap: theme.spacing.xs,
  },
  yieldText: {
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.text.secondary,
    fontStyle: 'italic',
  },
  infoBold: {
    fontWeight: theme.typography.weights.semibold as any,
    color: theme.colors.text.primary,
  },
});
