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
  const [flourWeight, setFlourWeight] = useState('');
  const [ingredients, setIngredients] = useState<Ingredient[]>([
    { name: 'Water', percentage: '70', amount: '' },
    { name: 'Salt', percentage: '2', amount: '' },
    { name: 'Starter', percentage: '20', amount: '' },
  ]);
  const [showResults, setShowResults] = useState(false);

  const calculateAmounts = () => {
    const flourWeightNum = parseFloat(flourWeight);
    if (!flourWeightNum || flourWeightNum <= 0) {
      Alert.alert('Error', 'Please enter a valid flour weight');
      return;
    }

    const updatedIngredients = ingredients.map((ing) => {
      const percentage = parseFloat(ing.percentage) || 0;
      const amount = ((flourWeightNum * percentage) / 100).toFixed(1);
      return { ...ing, amount };
    });

    setIngredients(updatedIngredients);
    setShowResults(true);
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

  const totalWeight = ingredients.reduce(
    (sum, ing) => sum + (parseFloat(ing.amount) || 0),
    parseFloat(flourWeight) || 0
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
            Enter flour weight and percentages to calculate ingredient amounts
          </Text>
        </View>

        <View style={styles.content}>
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

          {/* Flour Weight Input */}
          <Card variant="elevated">
            <Text style={styles.sectionTitle}>Flour Weight (Base at 100%)</Text>
            <BasicInput
              label="Total Flour"
              placeholder="e.g., 500"
              value={flourWeight}
              onChangeText={setFlourWeight}
              keyboardType="numeric"
              helperText="Weight in grams"
            />
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
                  <Text style={styles.resultName}>Flour</Text>
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
              <Text style={styles.summaryTitle}>Total</Text>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Total Percentage:</Text>
                <Text style={styles.summaryValue}>{totalPercentage.toFixed(1)}%</Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Total Dough Weight:</Text>
                <Text style={styles.summaryValue}>{totalWeight.toFixed(1)}g</Text>
              </View>
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
              Enter your flour weight and percentages, then tap Calculate to get precise amounts.
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
  section: {
    marginBottom: theme.spacing.md,
  },
  sectionTitle: {
    fontSize: theme.typography.sizes.lg,
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
    fontSize: theme.typography.sizes.xl,
    fontWeight: theme.typography.weights.bold as any,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.md,
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
    fontSize: theme.typography.sizes.base,
    fontWeight: theme.typography.weights.medium as any,
    color: theme.colors.text.primary,
  },
  resultAmount: {
    fontSize: theme.typography.sizes.lg,
    fontWeight: theme.typography.weights.bold as any,
    color: theme.colors.success.dark,
  },
  summaryCard: {
    backgroundColor: theme.colors.primary[50],
  },
  summaryTitle: {
    fontSize: theme.typography.sizes.lg,
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
    color: theme.colors.text.secondary,
  },
  summaryValue: {
    fontSize: theme.typography.sizes.base,
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
});
