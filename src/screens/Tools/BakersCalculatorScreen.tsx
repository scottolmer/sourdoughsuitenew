/**
 * Baker's Percentage Calculator
 * Result-first design with FormulaPreview at top
 */

import React, { useState, useMemo, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { CompositeNavigationProp } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import Button from '../../components/Button';
import BasicInput from '../../components/BasicInput';
import Card from '../../components/Card';
import BenchCard from '../../components/BenchCard';
import FormulaPreview from '../../components/FormulaPreview';
import SectionHeader from '../../components/SectionHeader';
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
  route: NativeStackScreenProps<ToolsStackParamList, 'BakersCalculator'>['route'];
};

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

export default function BakersCalculatorScreen({ navigation, route }: Props) {
  const [calculationMode, setCalculationMode] = useState<CalculationMode>('flour');
  const [flourWeight, setFlourWeight] = useState('');
  const [totalWeight, setTotalWeight] = useState('');
  const [ingredients, setIngredients] = useState<Ingredient[]>([
    { name: 'Water', percentage: '70', amount: '' },
    { name: 'Salt', percentage: '2', amount: '' },
    { name: 'Starter', percentage: '20', amount: '' },
  ]);
  const [showResults, setShowResults] = useState(false);
  const [inputError, setInputError] = useState('');
  const [prefilledName, setPrefilledName] = useState<string | undefined>();

  useEffect(() => {
    const pf = route?.params?.prefilledFormula;
    if (!pf) return;
    setFlourWeight(pf.flour);
    setIngredients([
      { name: 'Water', percentage: pf.water, amount: '' },
      { name: 'Salt', percentage: pf.salt, amount: '' },
      { name: 'Starter', percentage: pf.starter, amount: '' },
    ]);
    if (pf.name) setPrefilledName(pf.name);
    setShowResults(false);
    setInputError('');
  }, [route?.params?.prefilledFormula]);

  // Live hydration preview (water percentage / flour)
  const liveHydration = useMemo(() => {
    const waterIng = ingredients.find((i) => i.name.toLowerCase() === 'water');
    const waterPct = waterIng ? parseFloat(waterIng.percentage) : NaN;
    return isNaN(waterPct) ? null : waterPct;
  }, [ingredients]);

  // Live total percentage
  const totalPercentage = useMemo(
    () =>
      ingredients.reduce((sum, ing) => sum + (parseFloat(ing.percentage) || 0), 100),
    [ingredients]
  );

  // FormulaPreview data when results are available
  const previewIngredients = useMemo(() => {
    if (!showResults) return [];
    const list = [{ name: 'Flour', weight: parseFloat(flourWeight) || 0, percentage: 100 }];
    ingredients.forEach((ing) => {
      if (ing.name && ing.amount) {
        list.push({
          name: ing.name,
          weight: parseFloat(ing.amount) || 0,
          percentage: parseFloat(ing.percentage) || 0,
        });
      }
    });
    return list;
  }, [showResults, flourWeight, ingredients]);

  const calculateAmounts = () => {
    setInputError('');
    if (calculationMode === 'flour') {
      const flourWeightNum = parseFloat(flourWeight);
      if (!flourWeightNum || flourWeightNum <= 0) {
        setInputError('Please enter a valid flour weight (e.g. 500)');
        return;
      }

      const updatedIngredients = ingredients.map((ing) => {
        const percentage = parseFloat(ing.percentage) || 0;
        const amount = roundTo(calculateAmountFromPercentage(flourWeightNum, percentage), 1).toString();
        return { ...ing, amount };
      });

      setIngredients(updatedIngredients);

      const calculatedTotal = roundTo(
        calculateAmountFromPercentage(flourWeightNum, totalPercentage),
        1
      );
      setTotalWeight(calculatedTotal.toString());
      setShowResults(true);
    } else {
      const totalWeightNum = parseFloat(totalWeight);
      if (!totalWeightNum || totalWeightNum <= 0) {
        setInputError('Please enter a valid total dough weight (e.g. 1000)');
        return;
      }

      const calculatedFlour = totalWeightNum / (totalPercentage / 100);
      setFlourWeight(calculatedFlour.toFixed(1));

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
      const flourWeightNum = parseFloat(flourWeight);
      const calculatedTotal = roundTo(calculateAmountFromPercentage(flourWeightNum, totalPercentage), 1);
      setTotalWeight(calculatedTotal.toString());
    } else if (newMode === 'flour' && totalWeight) {
      const totalWeightNum = parseFloat(totalWeight);
      const calculatedFlour = (totalWeightNum / (totalPercentage / 100)).toFixed(1);
      setFlourWeight(calculatedFlour);
    }

    setCalculationMode(newMode);
    setShowResults(false);
    setInputError('');
  };

  const setPresetTotalWeight = (weight: number) => {
    setTotalWeight(weight.toString());
    setShowResults(false);
  };

  const addIngredient = () => {
    setIngredients([...ingredients, { name: '', percentage: '', amount: '' }]);
  };

  const updateIngredient = (index: number, field: keyof Ingredient, value: string) => {
    const updated = [...ingredients];
    updated[index][field] = value;
    setIngredients(updated);
    if (showResults) setShowResults(false);
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
    setInputError('');
  };

  const loadPreset = (presetName: string) => {
    const preset = RECIPE_PRESETS.find((p) => p.name === presetName);
    if (preset) {
      const presetIngredients = preset.formula.map((ing) => ({ ...ing, amount: '' }));
      setIngredients(presetIngredients);
      setShowResults(false);
      setInputError('');
    }
  };

  const handleSaveAsRecipe = () => {
    const waterIng = ingredients.find((ing) => ing.name.toLowerCase() === 'water');
    const saltIng = ingredients.find((ing) => ing.name.toLowerCase() === 'salt');
    const starterIng = ingredients.find((ing) => ing.name.toLowerCase() === 'starter');

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

    (navigation as any).navigate('RecipesTab', {
      screen: 'AddRecipe',
      params: {
        prefilledFormula: {
          flour: flourWeight,
          water: waterIng?.percentage || '0',
          salt: saltIng?.percentage || '0',
          starter: starterIng?.percentage || '0',
          additionalIngredients: additionalIngredients.length > 0 ? additionalIngredients : undefined,
        },
      },
    });
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
      >
        {/* Recipe pre-fill banner */}
        {prefilledName ? (
          <View style={styles.prefilledBanner}>
            <Icon name="bookmark-outline" size={14} color={theme.colors.primary[600]} />
            <Text style={styles.prefilledBannerText}>
              Loaded from: <Text style={styles.prefilledBannerName}>{prefilledName}</Text>
            </Text>
          </View>
        ) : null}

        {/* Result-first: FormulaPreview always at top */}
        <View style={styles.previewSection}>
          {showResults && previewIngredients.length > 0 ? (
            <FormulaPreview
              hydration={liveHydration ?? 0}
              ingredients={previewIngredients}
              totalWeight={parseFloat(totalWeight) || undefined}
              title={calculationMode === 'flour'
                ? `${flourWeight}g flour base`
                : `${totalWeight}g total dough`}
            />
          ) : (
            <BenchCard variant="filled" padding="lg" style={styles.livePreview}>
              <View style={styles.livePreviewRow}>
                <View style={styles.liveMetric}>
                  <Text style={styles.liveMetricValue}>
                    {liveHydration !== null ? `${liveHydration.toFixed(0)}%` : '—'}
                  </Text>
                  <Text style={styles.liveMetricLabel}>Hydration</Text>
                </View>
                <View style={styles.liveMetricDivider} />
                <View style={styles.liveMetric}>
                  <Text style={styles.liveMetricValue}>{totalPercentage.toFixed(0)}%</Text>
                  <Text style={styles.liveMetricLabel}>Total %</Text>
                </View>
                <View style={styles.liveMetricDivider} />
                <View style={styles.liveMetric}>
                  <Text style={styles.liveMetricValue}>{ingredients.length + 1}</Text>
                  <Text style={styles.liveMetricLabel}>Ingredients</Text>
                </View>
              </View>
              <Text style={styles.livePreviewHint}>Enter values below and tap Calculate</Text>
            </BenchCard>
          )}
        </View>

        <View style={styles.content}>
          {/* Calculation Mode Toggle */}
          <Card variant="outlined" style={styles.modeCard}>
            <Text style={styles.modeLabel}>Calculate by:</Text>
            <View style={styles.modeToggle}>
              <TouchableOpacity
                style={[styles.modeButton, calculationMode === 'flour' && styles.modeButtonActive]}
                onPress={() => handleModeChange('flour')}
              >
                <Icon
                  name="grain"
                  size={20}
                  color={calculationMode === 'flour' ? theme.colors.white : theme.colors.text.secondary}
                />
                <Text
                  style={[styles.modeButtonText, calculationMode === 'flour' && styles.modeButtonTextActive]}
                >
                  Flour Weight
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modeButton, calculationMode === 'total' && styles.modeButtonActive]}
                onPress={() => handleModeChange('total')}
              >
                <Icon
                  name="scale-balance"
                  size={20}
                  color={calculationMode === 'total' ? theme.colors.white : theme.colors.text.secondary}
                />
                <Text
                  style={[styles.modeButtonText, calculationMode === 'total' && styles.modeButtonTextActive]}
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

          {/* Total Weight Presets (only in total mode) */}
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

          {/* Weight Input */}
          <Card variant="elevated">
            {calculationMode === 'flour' ? (
              <>
                <Text style={styles.sectionTitle}>Flour Weight (Base at 100%)</Text>
                <BasicInput
                  label="Total Flour"
                  placeholder="e.g., 500"
                  value={flourWeight}
                  onChangeText={(v) => { setFlourWeight(v); setInputError(''); }}
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
                  onChangeText={(v) => { setTotalWeight(v); setInputError(''); }}
                  keyboardType="numeric"
                  helperText="Final dough weight in grams"
                />
                {showResults && flourWeight && (
                  <View style={styles.calculatedFlourInfo}>
                    <Icon name="information" size={16} color={theme.colors.primary[600]} />
                    <Text style={styles.calculatedFlourText}>
                      Uses {flourWeight}g flour to reach {totalWeight}g total
                    </Text>
                  </View>
                )}
              </>
            )}
          </Card>

          {/* Inline validation error */}
          {inputError ? (
            <View style={styles.errorBanner}>
              <Icon name="alert-circle-outline" size={16} color={theme.colors.bench.heatRed} />
              <Text style={styles.errorText}>{inputError}</Text>
            </View>
          ) : null}

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
                      onChangeText={(value) => updateIngredient(index, 'percentage', value)}
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

          {/* Summary when results exist */}
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
              <Text style={styles.infoBold}>Total Weight Mode:</Text> Enter desired total, get flour amount needed
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
  previewSection: {
    padding: theme.spacing.lg,
    paddingBottom: 0,
  },
  livePreview: {
    borderRadius: 22,
  },
  livePreviewRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    marginBottom: theme.spacing.sm,
  },
  liveMetric: {
    alignItems: 'center',
    flex: 1,
  },
  liveMetricValue: {
    fontFamily: theme.typography.fonts.heading,
    fontSize: theme.typography.sizes['3xl'],
    color: theme.colors.primary[600],
    lineHeight: 40,
  },
  liveMetricLabel: {
    fontFamily: theme.typography.fonts.regular,
    fontSize: theme.typography.sizes.xs,
    color: theme.colors.text.secondary,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
    marginTop: 2,
  },
  liveMetricDivider: {
    width: 1,
    height: 40,
    backgroundColor: theme.colors.bench.borderSoft,
  },
  prefilledBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginHorizontal: theme.spacing.lg,
    marginTop: theme.spacing.md,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    backgroundColor: theme.colors.primary[50],
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.primary[200],
  },
  prefilledBannerText: {
    fontFamily: theme.typography.fonts.regular,
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.text.secondary,
  },
  prefilledBannerName: {
    fontFamily: theme.typography.fonts.semibold,
    color: theme.colors.primary[700],
  },
  livePreviewHint: {
    fontFamily: theme.typography.fonts.regular,
    fontSize: theme.typography.sizes.xs,
    color: theme.colors.text.tertiary,
    textAlign: 'center',
    marginTop: theme.spacing.xs,
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
  summaryCard: {
    backgroundColor: theme.colors.primary[50],
    marginBottom: theme.spacing.md,
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
    gap: theme.spacing.md,
    rowGap: theme.spacing.sm,
  },
  presetButton: {
    flex: 0,
    minWidth: 100,
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
    borderColor: theme.colors.border.dark,
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
  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xs,
    backgroundColor: theme.colors.bench.heatRed + '12',
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    marginTop: theme.spacing.sm,
    borderWidth: 1,
    borderColor: theme.colors.bench.heatRed + '30',
  },
  errorText: {
    flex: 1,
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.bench.heatRed,
    fontFamily: theme.typography.fonts.medium,
  },
});
