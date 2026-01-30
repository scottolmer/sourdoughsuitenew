/**
 * Unit Converter
 * Convert between common baking measurements
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import BasicInput from '../../components/BasicInput';
import Card from '../../components/Card';
import { theme } from '../../theme';

type UnitCategory = 'weight' | 'volume' | 'temperature';

interface ConversionUnit {
  name: string;
  abbrev: string;
  toBase: (value: number) => number; // Convert to base unit (grams, ml, celsius)
  fromBase: (value: number) => number; // Convert from base unit
}

const weightUnits: ConversionUnit[] = [
  { name: 'Grams', abbrev: 'g', toBase: (v) => v, fromBase: (v) => v },
  { name: 'Kilograms', abbrev: 'kg', toBase: (v) => v * 1000, fromBase: (v) => v / 1000 },
  { name: 'Ounces', abbrev: 'oz', toBase: (v) => v * 28.3495, fromBase: (v) => v / 28.3495 },
  { name: 'Pounds', abbrev: 'lb', toBase: (v) => v * 453.592, fromBase: (v) => v / 453.592 },
];

const volumeUnits: ConversionUnit[] = [
  { name: 'Milliliters', abbrev: 'ml', toBase: (v) => v, fromBase: (v) => v },
  { name: 'Liters', abbrev: 'L', toBase: (v) => v * 1000, fromBase: (v) => v / 1000 },
  { name: 'Teaspoons', abbrev: 'tsp', toBase: (v) => v * 4.929, fromBase: (v) => v / 4.929 },
  { name: 'Tablespoons', abbrev: 'tbsp', toBase: (v) => v * 14.787, fromBase: (v) => v / 14.787 },
  { name: 'Fluid Ounces', abbrev: 'fl oz', toBase: (v) => v * 29.574, fromBase: (v) => v / 29.574 },
  { name: 'Cups (US)', abbrev: 'cup', toBase: (v) => v * 236.588, fromBase: (v) => v / 236.588 },
];

const temperatureUnits: ConversionUnit[] = [
  { name: 'Celsius', abbrev: '°C', toBase: (v) => v, fromBase: (v) => v },
  { name: 'Fahrenheit', abbrev: '°F', toBase: (v) => (v - 32) * 5 / 9, fromBase: (v) => v * 9 / 5 + 32 },
];

// Common ingredient densities (g per cup) for volume-to-weight conversions
const ingredientDensities: { [key: string]: { name: string; gramsPerCup: number } } = {
  flour_ap: { name: 'All-Purpose Flour', gramsPerCup: 125 },
  flour_bread: { name: 'Bread Flour', gramsPerCup: 127 },
  flour_whole_wheat: { name: 'Whole Wheat Flour', gramsPerCup: 120 },
  flour_rye: { name: 'Rye Flour', gramsPerCup: 102 },
  water: { name: 'Water', gramsPerCup: 237 },
  sugar: { name: 'Granulated Sugar', gramsPerCup: 200 },
  salt: { name: 'Table Salt', gramsPerCup: 288 },
  honey: { name: 'Honey', gramsPerCup: 340 },
  olive_oil: { name: 'Olive Oil', gramsPerCup: 216 },
  butter: { name: 'Butter', gramsPerCup: 227 },
};

export default function UnitConverterScreen() {
  const [category, setCategory] = useState<UnitCategory>('weight');
  const [inputValue, setInputValue] = useState('');
  const [fromUnit, setFromUnit] = useState(0);
  const [selectedIngredient, setSelectedIngredient] = useState<string | null>(null);
  const [showIngredients, setShowIngredients] = useState(false);

  const getUnits = () => {
    switch (category) {
      case 'weight': return weightUnits;
      case 'volume': return volumeUnits;
      case 'temperature': return temperatureUnits;
    }
  };

  const units = getUnits();

  const calculateConversions = () => {
    const value = parseFloat(inputValue);
    if (!value || isNaN(value)) return null;

    const baseValue = units[fromUnit].toBase(value);

    return units.map((unit, index) => ({
      unit,
      value: unit.fromBase(baseValue),
      isSource: index === fromUnit,
    }));
  };

  const conversions = calculateConversions();

  const calculateIngredientWeight = () => {
    if (!selectedIngredient || !inputValue) return null;

    const value = parseFloat(inputValue);
    if (!value || isNaN(value)) return null;

    const density = ingredientDensities[selectedIngredient];
    const unit = volumeUnits[fromUnit];

    // Convert input to ml first
    const mlValue = unit.toBase(value);
    // Convert ml to cups (236.588 ml per cup)
    const cups = mlValue / 236.588;
    // Calculate grams
    const grams = cups * density.gramsPerCup;

    return {
      ingredient: density.name,
      grams: grams.toFixed(1),
      ounces: (grams / 28.3495).toFixed(2),
    };
  };

  const formatValue = (value: number) => {
    if (value >= 1000) return value.toFixed(1);
    if (value >= 100) return value.toFixed(1);
    if (value >= 10) return value.toFixed(2);
    if (value >= 1) return value.toFixed(2);
    return value.toFixed(3);
  };

  const clearAll = () => {
    setInputValue('');
    setSelectedIngredient(null);
  };

  const ingredientWeight = category === 'volume' ? calculateIngredientWeight() : null;

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
          <Icon name="swap-horizontal" size={48} color={theme.colors.info.main} />
          <Text style={styles.headerTitle}>Unit Converter</Text>
          <Text style={styles.headerSubtitle}>
            Convert between common baking measurements
          </Text>
        </View>

        <View style={styles.content}>
          {/* Category Selector */}
          <Card variant="elevated">
            <Text style={styles.sectionTitle}>Category</Text>
            <View style={styles.categoryRow}>
              {(['weight', 'volume', 'temperature'] as UnitCategory[]).map((cat) => (
                <TouchableOpacity
                  key={cat}
                  style={[
                    styles.categoryButton,
                    category === cat && styles.categoryButtonActive,
                  ]}
                  onPress={() => {
                    setCategory(cat);
                    setFromUnit(0);
                    setSelectedIngredient(null);
                  }}
                >
                  <Icon
                    name={cat === 'weight' ? 'scale' : cat === 'volume' ? 'cup' : 'thermometer'}
                    size={20}
                    color={category === cat ? theme.colors.white : theme.colors.text.secondary}
                  />
                  <Text
                    style={[
                      styles.categoryText,
                      category === cat && styles.categoryTextActive,
                    ]}
                  >
                    {cat.charAt(0).toUpperCase() + cat.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </Card>

          {/* Input */}
          <Card variant="elevated">
            <Text style={styles.sectionTitle}>Convert From</Text>
            <BasicInput
              label="Amount"
              placeholder="Enter value"
              value={inputValue}
              onChangeText={setInputValue}
              keyboardType="numeric"
              leftIcon={category === 'weight' ? 'scale' : category === 'volume' ? 'cup' : 'thermometer'}
            />

            <Text style={styles.unitLabel}>Unit</Text>
            <View style={styles.unitGrid}>
              {units.map((unit, index) => (
                <TouchableOpacity
                  key={unit.abbrev}
                  style={[
                    styles.unitButton,
                    fromUnit === index && styles.unitButtonActive,
                  ]}
                  onPress={() => setFromUnit(index)}
                >
                  <Text
                    style={[
                      styles.unitButtonText,
                      fromUnit === index && styles.unitButtonTextActive,
                    ]}
                  >
                    {unit.abbrev}
                  </Text>
                  <Text
                    style={[
                      styles.unitButtonName,
                      fromUnit === index && styles.unitButtonNameActive,
                    ]}
                  >
                    {unit.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </Card>

          {/* Results */}
          {conversions && (
            <Card variant="filled" style={styles.resultsCard}>
              <Text style={styles.sectionTitle}>Conversions</Text>
              {conversions.map(({ unit, value, isSource }) => (
                <View
                  key={unit.abbrev}
                  style={[
                    styles.resultRow,
                    isSource && styles.resultRowSource,
                  ]}
                >
                  <View style={styles.resultInfo}>
                    <Text style={styles.resultUnit}>{unit.name}</Text>
                    <Text style={styles.resultAbbrev}>{unit.abbrev}</Text>
                  </View>
                  <Text style={[
                    styles.resultValue,
                    isSource && styles.resultValueSource,
                  ]}>
                    {formatValue(value)}
                  </Text>
                </View>
              ))}
            </Card>
          )}

          {/* Volume to Weight (Ingredient-specific) */}
          {category === 'volume' && inputValue && (
            <Card variant="elevated">
              <TouchableOpacity
                style={styles.ingredientHeader}
                onPress={() => setShowIngredients(!showIngredients)}
              >
                <View>
                  <Text style={styles.sectionTitle}>Volume to Weight</Text>
                  <Text style={styles.ingredientSubtitle}>
                    Convert cups/tbsp to grams for specific ingredients
                  </Text>
                </View>
                <Icon
                  name={showIngredients ? 'chevron-up' : 'chevron-down'}
                  size={24}
                  color={theme.colors.text.secondary}
                />
              </TouchableOpacity>

              {showIngredients && (
                <View style={styles.ingredientList}>
                  {Object.entries(ingredientDensities).map(([key, { name }]) => (
                    <TouchableOpacity
                      key={key}
                      style={[
                        styles.ingredientButton,
                        selectedIngredient === key && styles.ingredientButtonActive,
                      ]}
                      onPress={() => setSelectedIngredient(key === selectedIngredient ? null : key)}
                    >
                      <Text
                        style={[
                          styles.ingredientButtonText,
                          selectedIngredient === key && styles.ingredientButtonTextActive,
                        ]}
                      >
                        {name}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}

              {ingredientWeight && (
                <View style={styles.ingredientResult}>
                  <Text style={styles.ingredientResultLabel}>
                    {ingredientWeight.ingredient}
                  </Text>
                  <View style={styles.ingredientResultValues}>
                    <View style={styles.ingredientResultItem}>
                      <Text style={styles.ingredientResultValue}>{ingredientWeight.grams}</Text>
                      <Text style={styles.ingredientResultUnit}>grams</Text>
                    </View>
                    <View style={styles.ingredientResultItem}>
                      <Text style={styles.ingredientResultValue}>{ingredientWeight.ounces}</Text>
                      <Text style={styles.ingredientResultUnit}>oz</Text>
                    </View>
                  </View>
                </View>
              )}
            </Card>
          )}

          {/* Quick Reference */}
          <Card variant="outlined">
            <Text style={styles.infoTitle}>Quick Reference</Text>
            {category === 'weight' && (
              <Text style={styles.infoText}>
                <Text style={styles.infoBold}>1 oz</Text> = 28.35 g{'\n'}
                <Text style={styles.infoBold}>1 lb</Text> = 453.6 g (16 oz){'\n'}
                <Text style={styles.infoBold}>1 kg</Text> = 1000 g (2.2 lb){'\n\n'}
                Pro tip: Always weigh ingredients for consistent results!
              </Text>
            )}
            {category === 'volume' && (
              <Text style={styles.infoText}>
                <Text style={styles.infoBold}>1 cup</Text> = 237 ml (16 tbsp){'\n'}
                <Text style={styles.infoBold}>1 tbsp</Text> = 15 ml (3 tsp){'\n'}
                <Text style={styles.infoBold}>1 fl oz</Text> = 30 ml (2 tbsp){'\n\n'}
                Note: Volume measurements vary by ingredient density. Use weight for accuracy.
              </Text>
            )}
            {category === 'temperature' && (
              <Text style={styles.infoText}>
                <Text style={styles.infoBold}>Water freezes:</Text> 0°C / 32°F{'\n'}
                <Text style={styles.infoBold}>Room temp:</Text> 20-22°C / 68-72°F{'\n'}
                <Text style={styles.infoBold}>Bread baking:</Text> 220-250°C / 425-480°F{'\n'}
                <Text style={styles.infoBold}>Internal done:</Text> 93-99°C / 200-210°F{'\n\n'}
                Formula: °F = (°C × 9/5) + 32
              </Text>
            )}
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
  categoryRow: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
  },
  categoryButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing.xs,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.sm,
    borderRadius: theme.borderRadius.md,
    backgroundColor: theme.colors.background.default,
  },
  categoryButtonActive: {
    backgroundColor: theme.colors.primary[600],
  },
  categoryText: {
    fontSize: theme.typography.sizes.sm,
    fontWeight: theme.typography.weights.medium as any,
    color: theme.colors.text.secondary,
  },
  categoryTextActive: {
    color: theme.colors.white,
  },
  unitLabel: {
    fontSize: theme.typography.sizes.sm,
    fontWeight: theme.typography.weights.medium as any,
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing.sm,
    marginTop: theme.spacing.md,
  },
  unitGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.sm,
  },
  unitButton: {
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    backgroundColor: theme.colors.background.default,
    borderWidth: 1,
    borderColor: theme.colors.border.light,
    minWidth: '30%',
    alignItems: 'center',
  },
  unitButtonActive: {
    backgroundColor: theme.colors.primary[600],
    borderColor: theme.colors.primary[600],
  },
  unitButtonText: {
    fontSize: theme.typography.sizes.base,
    fontWeight: theme.typography.weights.semibold as any,
    color: theme.colors.text.primary,
  },
  unitButtonTextActive: {
    color: theme.colors.white,
  },
  unitButtonName: {
    fontSize: theme.typography.sizes.xs,
    color: theme.colors.text.secondary,
    marginTop: 2,
  },
  unitButtonNameActive: {
    color: theme.colors.primary[100],
  },
  resultsCard: {
    backgroundColor: theme.colors.primary[50],
  },
  resultRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: theme.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border.light,
  },
  resultRowSource: {
    backgroundColor: theme.colors.primary[100],
    marginHorizontal: -theme.spacing.md,
    paddingHorizontal: theme.spacing.md,
    borderRadius: theme.borderRadius.sm,
  },
  resultInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
  resultUnit: {
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.text.secondary,
  },
  resultAbbrev: {
    fontSize: theme.typography.sizes.xs,
    color: theme.colors.text.disabled,
    backgroundColor: theme.colors.background.default,
    paddingHorizontal: theme.spacing.xs,
    paddingVertical: 2,
    borderRadius: theme.borderRadius.sm,
  },
  resultValue: {
    fontSize: theme.typography.sizes.lg,
    fontWeight: theme.typography.weights.semibold as any,
    color: theme.colors.text.primary,
  },
  resultValueSource: {
    color: theme.colors.primary[700],
  },
  ingredientHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  ingredientSubtitle: {
    fontSize: theme.typography.sizes.xs,
    color: theme.colors.text.secondary,
    marginTop: -theme.spacing.sm,
  },
  ingredientList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.sm,
    marginTop: theme.spacing.md,
  },
  ingredientButton: {
    paddingVertical: theme.spacing.xs,
    paddingHorizontal: theme.spacing.sm,
    borderRadius: theme.borderRadius.full,
    backgroundColor: theme.colors.background.default,
    borderWidth: 1,
    borderColor: theme.colors.border.light,
  },
  ingredientButtonActive: {
    backgroundColor: theme.colors.success.main,
    borderColor: theme.colors.success.main,
  },
  ingredientButtonText: {
    fontSize: theme.typography.sizes.xs,
    color: theme.colors.text.secondary,
  },
  ingredientButtonTextActive: {
    color: theme.colors.white,
    fontWeight: theme.typography.weights.medium as any,
  },
  ingredientResult: {
    marginTop: theme.spacing.md,
    padding: theme.spacing.md,
    backgroundColor: theme.colors.success.main + '15',
    borderRadius: theme.borderRadius.md,
  },
  ingredientResultLabel: {
    fontSize: theme.typography.sizes.sm,
    fontWeight: theme.typography.weights.medium as any,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.sm,
  },
  ingredientResultValues: {
    flexDirection: 'row',
    gap: theme.spacing.xl,
  },
  ingredientResultItem: {
    alignItems: 'center',
  },
  ingredientResultValue: {
    fontSize: theme.typography.sizes['2xl'],
    fontWeight: theme.typography.weights.bold as any,
    color: theme.colors.success.dark,
  },
  ingredientResultUnit: {
    fontSize: theme.typography.sizes.xs,
    color: theme.colors.text.secondary,
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
