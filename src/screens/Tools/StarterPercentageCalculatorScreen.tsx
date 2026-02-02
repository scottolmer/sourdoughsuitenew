/**
 * Starter Percentage Calculator
 * Calculate starter percentage relative to total flour
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
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Button from '../../components/Button';
import BasicInput from '../../components/BasicInput';
import Card from '../../components/Card';
import { theme } from '../../theme';
import {
  decomposeLevain,
  calculateStarterPercentage,
  roundTo,
} from '../../utils/sourdoughCalculations';

export default function StarterPercentageCalculatorScreen() {
  const [totalFlour, setTotalFlour] = useState('');
  const [starterAmount, setStarterAmount] = useState('');
  const [starterHydration, setStarterHydration] = useState('100');
  const [calculated, setCalculated] = useState(false);
  const [result, setResult] = useState({
    starterPercent: 0,
    starterFlour: 0,
    starterWater: 0,
    fermentationSpeed: '',
    recommendation: '',
  });

  const calculateStarterPercentageHandler = () => {
    const flour = parseFloat(totalFlour);
    const starter = parseFloat(starterAmount);
    const hydration = parseFloat(starterHydration);

    if (!flour || flour <= 0 || !starter || starter <= 0 || !hydration || hydration <= 0) return;

    // Decompose starter into flour and water components
    const { flour: starterFlourAmount, water: starterWaterAmount } = decomposeLevain(starter, hydration);

    // Calculate starter percentage relative to total flour
    const starterPercentage = calculateStarterPercentage(starterFlourAmount, flour);

    // Determine fermentation speed and recommendation
    let speed = '';
    let recommendation = '';

    if (starterPercentage < 5) {
      speed = 'Very Slow';
      recommendation = 'Long bulk fermentation (12-24 hours). Great for developing complex flavors.';
    } else if (starterPercentage < 10) {
      speed = 'Slow';
      recommendation = 'Extended bulk fermentation (8-12 hours). Good flavor development.';
    } else if (starterPercentage < 15) {
      speed = 'Moderate';
      recommendation = 'Standard bulk fermentation (6-8 hours). Balanced flavor and timing.';
    } else if (starterPercentage < 25) {
      speed = 'Fast';
      recommendation = 'Shorter bulk fermentation (4-6 hours). Less sour, convenient timing.';
    } else {
      speed = 'Very Fast';
      recommendation = 'Quick bulk fermentation (3-5 hours). Mild flavor, risk of over-fermentation.';
    }

    setResult({
      starterPercent: roundTo(starterPercentage, 2),
      starterFlour: roundTo(starterFlourAmount, 1),
      starterWater: roundTo(starterWaterAmount, 1),
      fermentationSpeed: speed,
      recommendation,
    });
    setCalculated(true);
  };

  const clearAll = () => {
    setTotalFlour('');
    setStarterAmount('');
    setStarterHydration('100');
    setCalculated(false);
  };

  const getSpeedColor = () => {
    if (result.starterPercent < 10) return theme.colors.info.main;
    if (result.starterPercent < 20) return theme.colors.success.main;
    if (result.starterPercent < 30) return theme.colors.warning.main;
    return theme.colors.error.main;
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
      >
        <View style={styles.header}>
          <Icon name="percent-circle" size={48} color={theme.colors.primary[600]} />
          <Text style={styles.headerTitle}>Starter Percentage Calculator</Text>
          <Text style={styles.headerSubtitle}>
            Calculate starter percentage and predict fermentation speed
          </Text>
        </View>

        <Card variant="elevated" padding="lg" style={styles.card}>
          <Text style={styles.sectionTitle}>Recipe Details</Text>
          <BasicInput
            label="Total flour in recipe (g)"
            value={totalFlour}
            onChangeText={setTotalFlour}
            keyboardType="numeric"
            placeholder="e.g., 500"
            helperText="Include all flour (bread flour, whole wheat, etc.)"
          />
          <BasicInput
            label="Starter/levain amount (g)"
            value={starterAmount}
            onChangeText={setStarterAmount}
            keyboardType="numeric"
            placeholder="e.g., 100"
          />
          <BasicInput
            label="Starter hydration (%)"
            value={starterHydration}
            onChangeText={setStarterHydration}
            keyboardType="numeric"
            placeholder="100"
            helperText="Most starters are 100% hydration (equal flour and water)"
          />
        </Card>

        <View style={styles.buttonContainer}>
          <Button
            title="Calculate"
            onPress={calculateStarterPercentageHandler}
            leftIcon="calculator"
            fullWidth
          />
          <Button
            title="Clear All"
            variant="outline"
            onPress={clearAll}
            fullWidth
            style={styles.clearButton}
          />
        </View>

        {calculated && (
          <>
            <Card variant="elevated" padding="lg" style={[styles.card, styles.resultCard]}>
              <View style={styles.resultHeader}>
                <Icon name="gauge" size={32} color={getSpeedColor()} />
                <Text style={styles.resultTitle}>Starter Percentage</Text>
              </View>

              <View style={styles.percentageBox}>
                <Text style={[styles.percentageValue, { color: getSpeedColor() }]}>
                  {result.starterPercent}%
                </Text>
                <Text style={styles.percentageLabel}>of total flour</Text>
              </View>

              <View style={styles.speedBox}>
                <Text style={styles.speedLabel}>Fermentation Speed:</Text>
                <Text style={[styles.speedValue, { color: getSpeedColor() }]}>
                  {result.fermentationSpeed}
                </Text>
              </View>

              <View style={styles.divider} />

              <View style={styles.breakdownBox}>
                <Text style={styles.breakdownTitle}>Starter Composition:</Text>
                <View style={styles.breakdownRow}>
                  <Text style={styles.breakdownLabel}>Flour:</Text>
                  <Text style={styles.breakdownValue}>{result.starterFlour}g</Text>
                </View>
                <View style={styles.breakdownRow}>
                  <Text style={styles.breakdownLabel}>Water:</Text>
                  <Text style={styles.breakdownValue}>{result.starterWater}g</Text>
                </View>
              </View>
            </Card>

            <Card variant="elevated" padding="lg" style={styles.card}>
              <View style={styles.recommendationHeader}>
                <Icon name="lightbulb-on" size={24} color={theme.colors.warning.main} />
                <Text style={styles.recommendationTitle}>Recommendation</Text>
              </View>
              <Text style={styles.recommendationText}>{result.recommendation}</Text>
            </Card>
          </>
        )}

        <Card variant="filled" padding="lg" style={styles.card}>
          <Text style={styles.guideTitle}>Understanding Starter Percentage</Text>
          <Text style={styles.guideText}>
            <Text style={styles.bold}>Starter percentage</Text> is the amount of starter flour
            compared to total flour in your recipe.
          </Text>
          <Text style={styles.guideText}>
            <Text style={styles.bold}>Low percentage (5-10%):</Text> Longer fermentation, more
            complex flavors, better for cold overnight proofs.
          </Text>
          <Text style={styles.guideText}>
            <Text style={styles.bold}>Medium percentage (10-20%):</Text> Standard timing, balanced
            flavor, most common in recipes.
          </Text>
          <Text style={styles.guideText}>
            <Text style={styles.bold}>High percentage (20%+):</Text> Fast fermentation, milder
            flavor, convenient for same-day baking.
          </Text>
        </Card>

        <Card variant="filled" padding="lg" style={styles.card}>
          <Text style={styles.guideTitle}>Quick Reference</Text>
          <View style={styles.referenceTable}>
            <View style={styles.referenceRow}>
              <Text style={styles.referencePercent}>5-10%</Text>
              <Text style={styles.referenceTime}>12-24 hrs</Text>
              <Text style={styles.referenceFlavor}>Complex</Text>
            </View>
            <View style={styles.referenceRow}>
              <Text style={styles.referencePercent}>10-15%</Text>
              <Text style={styles.referenceTime}>8-12 hrs</Text>
              <Text style={styles.referenceFlavor}>Balanced</Text>
            </View>
            <View style={styles.referenceRow}>
              <Text style={styles.referencePercent}>15-20%</Text>
              <Text style={styles.referenceTime}>6-8 hrs</Text>
              <Text style={styles.referenceFlavor}>Mild</Text>
            </View>
            <View style={styles.referenceRow}>
              <Text style={styles.referencePercent}>20%+</Text>
              <Text style={styles.referenceTime}>4-6 hrs</Text>
              <Text style={styles.referenceFlavor}>Very Mild</Text>
            </View>
          </View>
        </Card>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background.paper,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: theme.spacing.md,
  },
  header: {
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
    paddingTop: theme.spacing.md,
  },
  headerTitle: {
    fontSize: theme.typography.sizes['2xl'],
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.text.primary,
    marginTop: theme.spacing.md,
  },
  headerSubtitle: {
    fontSize: theme.typography.sizes.base,
    color: theme.colors.text.secondary,
    textAlign: 'center',
    marginTop: theme.spacing.xs,
  },
  card: {
    marginBottom: theme.spacing.md,
  },
  sectionTitle: {
    fontSize: theme.typography.sizes.lg,
    fontWeight: theme.typography.weights.semibold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.md,
  },
  buttonContainer: {
    marginBottom: theme.spacing.md,
  },
  clearButton: {
    marginTop: theme.spacing.sm,
  },
  resultCard: {
    borderWidth: 2,
    borderColor: theme.colors.primary[300],
  },
  resultHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
  },
  resultTitle: {
    fontSize: theme.typography.sizes.xl,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.text.primary,
    marginLeft: theme.spacing.md,
  },
  percentageBox: {
    alignItems: 'center',
    paddingVertical: theme.spacing.lg,
    backgroundColor: theme.colors.background.subtle,
    borderRadius: theme.borderRadius.lg,
    marginBottom: theme.spacing.md,
  },
  percentageValue: {
    fontSize: 56,
    fontWeight: theme.typography.weights.bold,
  },
  percentageLabel: {
    fontSize: theme.typography.sizes.base,
    color: theme.colors.text.secondary,
    marginTop: theme.spacing.xs,
  },
  speedBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: theme.spacing.md,
  },
  speedLabel: {
    fontSize: theme.typography.sizes.lg,
    color: theme.colors.text.secondary,
  },
  speedValue: {
    fontSize: theme.typography.sizes.xl,
    fontWeight: theme.typography.weights.bold,
  },
  divider: {
    height: 1,
    backgroundColor: theme.colors.border.main,
    marginVertical: theme.spacing.md,
  },
  breakdownBox: {
    backgroundColor: theme.colors.background.subtle,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
  },
  breakdownTitle: {
    fontSize: theme.typography.sizes.base,
    fontWeight: theme.typography.weights.semibold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.sm,
  },
  breakdownRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: theme.spacing.xs,
  },
  breakdownLabel: {
    fontSize: theme.typography.sizes.base,
    color: theme.colors.text.secondary,
  },
  breakdownValue: {
    fontSize: theme.typography.sizes.base,
    fontWeight: theme.typography.weights.semibold,
    color: theme.colors.text.primary,
  },
  recommendationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  recommendationTitle: {
    fontSize: theme.typography.sizes.lg,
    fontWeight: theme.typography.weights.semibold,
    color: theme.colors.text.primary,
    marginLeft: theme.spacing.sm,
  },
  recommendationText: {
    fontSize: theme.typography.sizes.base,
    color: theme.colors.text.secondary,
    lineHeight: 24,
  },
  guideTitle: {
    fontSize: theme.typography.sizes.lg,
    fontWeight: theme.typography.weights.semibold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.md,
  },
  guideText: {
    fontSize: theme.typography.sizes.base,
    color: theme.colors.text.secondary,
    lineHeight: 24,
    marginBottom: theme.spacing.sm,
  },
  bold: {
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.text.primary,
  },
  referenceTable: {
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.sm,
  },
  referenceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border.light,
  },
  referencePercent: {
    flex: 1,
    fontSize: theme.typography.sizes.base,
    fontWeight: theme.typography.weights.semibold,
    color: theme.colors.text.primary,
  },
  referenceTime: {
    flex: 1,
    fontSize: theme.typography.sizes.base,
    color: theme.colors.text.secondary,
    textAlign: 'center',
  },
  referenceFlavor: {
    flex: 1,
    fontSize: theme.typography.sizes.base,
    color: theme.colors.text.secondary,
    textAlign: 'right',
  },
});
