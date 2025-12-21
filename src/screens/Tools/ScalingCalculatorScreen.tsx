/**
 * Scaling Calculator
 * Scale recipes up or down
 */

import React, { useState } from 'react';
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

interface Ingredient {
  name: string;
  amount: string;
  unit: string;
  scaled: string;
}

type ScalingCalculatorNavigationProp = CompositeNavigationProp<
  NativeStackScreenProps<ToolsStackParamList, 'ScalingCalculator'>['navigation'],
  BottomTabNavigationProp<MainTabParamList>
>;

type Props = {
  navigation: ScalingCalculatorNavigationProp;
};

export default function ScalingCalculatorScreen({ navigation }: Props) {
  const [originalYield, setOriginalYield] = useState('');
  const [targetYield, setTargetYield] = useState('');
  const [ingredients, setIngredients] = useState<Ingredient[]>([
    { name: 'Bread flour', amount: '500', unit: 'g', scaled: '' },
    { name: 'Water', amount: '350', unit: 'g', scaled: '' },
    { name: 'Salt', amount: '10', unit: 'g', scaled: '' },
    { name: 'Starter', amount: '100', unit: 'g', scaled: '' },
  ]);

  const calculateScaling = () => {
    const original = parseFloat(originalYield);
    const target = parseFloat(targetYield);

    if (!original || !target || original <= 0) return;

    const scaleFactor = target / original;

    const scaled = ingredients.map((ing) => {
      const amount = parseFloat(ing.amount) || 0;
      const scaledAmount = (amount * scaleFactor).toFixed(1);
      return { ...ing, scaled: scaledAmount };
    });

    setIngredients(scaled);
  };

  const addIngredient = () => {
    setIngredients([
      ...ingredients,
      { name: '', amount: '', unit: 'g', scaled: '' },
    ]);
  };

  const updateIngredient = (
    index: number,
    field: keyof Ingredient,
    value: string
  ) => {
    const updated = [...ingredients];
    updated[index][field] = value;
    setIngredients(updated);
  };

  const removeIngredient = (index: number) => {
    setIngredients(ingredients.filter((_, i) => i !== index));
  };

  const clearAll = () => {
    setOriginalYield('');
    setTargetYield('');
    setIngredients([
      { name: 'Bread flour', amount: '500', unit: 'g', scaled: '' },
      { name: 'Water', amount: '350', unit: 'g', scaled: '' },
      { name: 'Salt', amount: '10', unit: 'g', scaled: '' },
      { name: 'Starter', amount: '100', unit: 'g', scaled: '' },
    ]);
  };

  const handleSaveAsRecipe = () => {
    // Use scaled amounts if available, otherwise use original amounts
    const amounts = ingredients.map(ing => ({
      name: ing.name,
      amount: parseFloat(ing.scaled || ing.amount) || 0,
    }));

    // Find flour ingredient (look for "flour" in name)
    const flourIng = amounts.find(ing =>
      ing.name.toLowerCase().includes('flour')
    );

    // If no flour found, use the first ingredient as base
    const flourAmount = flourIng?.amount || amounts[0]?.amount || 500;

    // Find core ingredients and calculate percentages
    const waterIng = amounts.find(ing =>
      ing.name.toLowerCase() === 'water'
    );
    const saltIng = amounts.find(ing =>
      ing.name.toLowerCase() === 'salt'
    );
    const starterIng = amounts.find(ing =>
      ing.name.toLowerCase().includes('starter') || ing.name.toLowerCase().includes('levain')
    );

    const waterPercent = waterIng ? ((waterIng.amount / flourAmount) * 100).toFixed(1) : '70';
    const saltPercent = saltIng ? ((saltIng.amount / flourAmount) * 100).toFixed(1) : '2';
    const starterPercent = starterIng ? ((starterIng.amount / flourAmount) * 100).toFixed(1) : '20';

    // Collect additional ingredients (not flour, water, salt, or starter)
    const additionalIngredients = amounts
      .filter(ing => {
        const name = ing.name.toLowerCase();
        return !name.includes('flour') &&
               name !== 'water' &&
               name !== 'salt' &&
               !name.includes('starter') &&
               !name.includes('levain') &&
               ing.name.trim() !== '' &&
               ing.amount > 0;
      })
      .map(ing => ({
        name: ing.name,
        amount: parseFloat(((ing.amount / flourAmount) * 100).toFixed(1)),
        unit: '%',
        type: 'other' as const,
      }));

    // Navigate to AddRecipe
    (navigation as any).navigate('RecipesTab', {
      screen: 'AddRecipe',
      params: {
        prefilledFormula: {
          flour: flourAmount.toFixed(0),
          water: waterPercent,
          salt: saltPercent,
          starter: starterPercent,
          additionalIngredients: additionalIngredients.length > 0 ? additionalIngredients : undefined,
        },
      },
    });
  };

  const scaleFactor =
    originalYield && targetYield
      ? (parseFloat(targetYield) / parseFloat(originalYield)).toFixed(2)
      : null;

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
          <Icon name="resize" size={48} color={theme.colors.error.main} />
          <Text style={styles.headerTitle}>Recipe Scaler</Text>
          <Text style={styles.headerSubtitle}>
            Scale recipes up or down proportionally
          </Text>
        </View>

        <View style={styles.content}>
          {/* Yield Settings */}
          <Card variant="elevated">
            <Text style={styles.sectionTitle}>Recipe Yield</Text>
            <View style={styles.yieldRow}>
              <BasicInput
                label="Original Yield"
                placeholder="e.g., 1"
                value={originalYield}
                onChangeText={setOriginalYield}
                keyboardType="numeric"
                editable={true}
                leftIcon="bread-slice"
                style={styles.yieldInput}
                helperText="Loaves or servings"
              />
              <Icon
                name="arrow-right"
                size={24}
                color={theme.colors.text.disabled}
                style={styles.arrowIcon}
              />
              <BasicInput
                label="Target Yield"
                placeholder="e.g., 3"
                value={targetYield}
                onChangeText={setTargetYield}
                keyboardType="numeric"
                editable={true}
                leftIcon="bread-slice-outline"
                style={styles.yieldInput}
                helperText="Loaves or servings"
              />
            </View>

            {scaleFactor && (
              <View style={styles.scaleFactorBadge}>
                <Text style={styles.scaleFactorText}>
                  Scale Factor: {scaleFactor}x
                </Text>
              </View>
            )}
          </Card>

          {/* Ingredients */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Ingredients</Text>
            {ingredients.map((ingredient, index) => (
              <Card key={index} variant="outlined" style={styles.ingredientCard}>
                <View style={styles.ingredientRow}>
                  <BasicInput
                    placeholder="Ingredient"
                    value={ingredient.name}
                    onChangeText={(value) =>
                      updateIngredient(index, 'name', value)
                    }
                    editable={true}
                    containerStyle={styles.ingredientName}
                  />
                  <View style={styles.amountRow}>
                    <BasicInput
                      placeholder="Amount"
                      value={ingredient.amount}
                      onChangeText={(value) =>
                        updateIngredient(index, 'amount', value)
                      }
                      keyboardType="numeric"
                      editable={true}
                      containerStyle={styles.amountInput}
                    />
                    <BasicInput
                      placeholder="Unit"
                      value={ingredient.unit}
                      onChangeText={(value) =>
                        updateIngredient(index, 'unit', value)
                      }
                      editable={true}
                      containerStyle={styles.unitInput}
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
                {ingredient.scaled && (
                  <View style={styles.scaledResult}>
                    <Icon
                      name="arrow-right"
                      size={16}
                      color={theme.colors.success.main}
                    />
                    <Text style={styles.scaledText}>
                      {ingredient.scaled} {ingredient.unit}
                    </Text>
                  </View>
                )}
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

          {/* Actions */}
          <View style={styles.actions}>
            <Button
              title="Calculate Scaled Recipe"
              onPress={calculateScaling}
              fullWidth
              leftIcon="calculator"
            />
            {ingredients.some(ing => ing.scaled) && (
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
            <Text style={styles.infoTitle}>How it works</Text>
            <Text style={styles.infoText}>
              Enter the original yield and your target yield, then add ingredients with their amounts.{'\n\n'}
              The calculator multiplies all ingredients by the scale factor to maintain the same ratios.{'\n\n'}
              <Text style={styles.infoBold}>Example:</Text>{'\n'}
              Recipe for 1 loaf → 3 loaves{'\n'}
              Scale factor = 3x{'\n'}
              500g flour → 1500g flour
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
  },
  sectionTitle: {
    fontSize: theme.typography.sizes.lg,
    fontWeight: theme.typography.weights.semibold as any,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.sm,
  },
  yieldRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  yieldInput: {
    flex: 1,
  },
  arrowIcon: {
    marginTop: 20,
  },
  scaleFactorBadge: {
    marginTop: theme.spacing.md,
    padding: theme.spacing.sm,
    backgroundColor: theme.colors.error.light + '40',
    borderRadius: theme.borderRadius.md,
    alignItems: 'center',
  },
  scaleFactorText: {
    fontSize: theme.typography.sizes.base,
    fontWeight: theme.typography.weights.semibold as any,
    color: theme.colors.error.main,
  },
  ingredientCard: {
    marginBottom: theme.spacing.sm,
  },
  ingredientRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  ingredientName: {
    flex: 2,
  },
  amountRow: {
    flex: 2,
    flexDirection: 'row',
  },
  amountInput: {
    flex: 2,
  },
  unitInput: {
    flex: 1,
  },
  removeButton: {
    minWidth: 40,
  },
  scaledResult: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: theme.spacing.sm,
    paddingTop: theme.spacing.sm,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border.light,
  },
  scaledText: {
    fontSize: theme.typography.sizes.base,
    fontWeight: theme.typography.weights.semibold as any,
    color: theme.colors.success.main,
  },
  actions: {
  },
  saveButton: {
    marginVertical: theme.spacing.sm,
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
