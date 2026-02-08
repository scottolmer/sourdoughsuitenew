/**
 * Levain/Starter Builder Calculator
 * Calculate how much starter to feed for your recipe
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
import { roundTo } from '../../utils/sourdoughCalculations';

export default function LevainBuilderScreen() {
  const [recipeStarter, setRecipeStarter] = useState('');
  const [currentStarter, setCurrentStarter] = useState('');
  const [feedingRatio, setFeedingRatio] = useState('1:1:1'); // starter:flour:water
  const [calculated, setCalculated] = useState(false);
  const [result, setResult] = useState({
    starterNeeded: 0,
    flourNeeded: 0,
    waterNeeded: 0,
    totalLevain: 0,
    discardAmount: 0,
  });

  const calculateLevain = () => {
    const recipeAmount = parseFloat(recipeStarter);
    const currentAmount = parseFloat(currentStarter);

    if (!recipeAmount || recipeAmount <= 0) return;
    if (!currentAmount || currentAmount <= 0) return;

    // Parse feeding ratio (e.g., "1:1:1" or "1:2:2")
    const ratios = feedingRatio.split(':').map(r => parseFloat(r.trim()));
    if (ratios.length !== 3 || ratios.some(r => isNaN(r) || r <= 0)) return;

    const [starterRatio, flourRatio, waterRatio] = ratios;
    const totalRatio = starterRatio + flourRatio + waterRatio;

    // Calculate how much starter to use in the feeding
    // We want to end up with at least recipeAmount
    const starterNeeded = (recipeAmount * starterRatio) / totalRatio;
    const flourNeeded = (recipeAmount * flourRatio) / totalRatio;
    const waterNeeded = (recipeAmount * waterRatio) / totalRatio;

    // Calculate discard if current starter is more than needed
    const discardAmount = currentAmount > starterNeeded ? currentAmount - starterNeeded : 0;

    setResult({
      starterNeeded: roundTo(starterNeeded, 1),
      flourNeeded: roundTo(flourNeeded, 1),
      waterNeeded: roundTo(waterNeeded, 1),
      totalLevain: roundTo(recipeAmount, 1),
      discardAmount: roundTo(discardAmount, 1),
    });
    setCalculated(true);
  };

  const clearAll = () => {
    setRecipeStarter('');
    setCurrentStarter('');
    setFeedingRatio('1:1:1');
    setCalculated(false);
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
        <View style={styles.header}>
          <Icon name="flask-outline" size={48} color={theme.colors.primary[600]} />
          <Text style={styles.headerTitle}>Levain Builder</Text>
          <Text style={styles.headerSubtitle}>
            Calculate how much starter to feed for your recipe
          </Text>
        </View>

        <View style={styles.content}>
        <Card variant="elevated" padding="lg" style={styles.card}>
          <Text style={styles.sectionTitle}>Recipe Requirements</Text>
          <BasicInput
            label="Starter needed for recipe (g)"
            value={recipeStarter}
            onChangeText={setRecipeStarter}
            keyboardType="numeric"
            placeholder="e.g., 200"
          />
        </Card>

        <Card variant="elevated" padding="lg" style={styles.card}>
          <Text style={styles.sectionTitle}>Your Current Starter</Text>
          <BasicInput
            label="Current starter amount (g)"
            value={currentStarter}
            onChangeText={setCurrentStarter}
            keyboardType="numeric"
            placeholder="e.g., 50"
          />
        </Card>

        <Card variant="elevated" padding="lg" style={styles.card}>
          <Text style={styles.sectionTitle}>Feeding Ratio</Text>
          <Text style={styles.helperText}>
            Format: starter:flour:water (e.g., 1:1:1 or 1:2:2)
          </Text>
          <BasicInput
            label="Feeding ratio"
            value={feedingRatio}
            onChangeText={setFeedingRatio}
            placeholder="1:1:1"
          />

          <View style={styles.ratioExamples}>
            <Text style={styles.exampleTitle}>Common Ratios:</Text>
            <Text style={styles.exampleText}>• 1:1:1 - Standard feeding</Text>
            <Text style={styles.exampleText}>• 1:2:2 - Stronger feeding</Text>
            <Text style={styles.exampleText}>• 1:5:5 - Very strong feeding</Text>
          </View>
        </Card>

        <View style={styles.buttonContainer}>
          <Button
            title="Calculate Feeding"
            onPress={calculateLevain}
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
          <Card variant="elevated" padding="lg" style={[styles.card, styles.resultCard]}>
            <View style={styles.resultHeader}>
              <Icon name="check-circle" size={32} color={theme.colors.success.main} />
              <Text style={styles.resultTitle}>Feeding Instructions</Text>
            </View>

            {result.discardAmount > 0 && (
              <View style={styles.discardNotice}>
                <Icon name="alert-circle" size={20} color={theme.colors.warning.main} />
                <Text style={styles.discardText}>
                  Discard {result.discardAmount}g of starter first
                </Text>
              </View>
            )}

            <View style={styles.resultRow}>
              <Text style={styles.resultLabel}>Use starter:</Text>
              <Text style={styles.resultValue}>{result.starterNeeded}g</Text>
            </View>

            <View style={styles.resultRow}>
              <Text style={styles.resultLabel}>Add flour:</Text>
              <Text style={styles.resultValue}>{result.flourNeeded}g</Text>
            </View>

            <View style={styles.resultRow}>
              <Text style={styles.resultLabel}>Add water:</Text>
              <Text style={styles.resultValue}>{result.waterNeeded}g</Text>
            </View>

            <View style={styles.divider} />

            <View style={styles.resultRow}>
              <Text style={styles.totalLabel}>Total levain:</Text>
              <Text style={styles.totalValue}>{result.totalLevain}g</Text>
            </View>

            <View style={styles.infoBox}>
              <Icon name="information" size={18} color={theme.colors.info.main} />
              <Text style={styles.infoText}>
                Feed your starter 8-12 hours before using in your recipe
              </Text>
            </View>
          </Card>
        )}

        <Card variant="filled" padding="lg" style={styles.card}>
          <Text style={styles.guideTitle}>How It Works</Text>
          <Text style={styles.guideText}>
            1. Enter how much starter your recipe needs{'\n'}
            2. Enter how much starter you currently have{'\n'}
            3. Choose your feeding ratio{'\n'}
            4. The calculator tells you exactly how much flour and water to add
          </Text>
          <Text style={styles.guideText}>
            <Text style={styles.bold}>Tip:</Text> Use a 1:1:1 ratio for maintenance feeding,
            or 1:2:2 or higher for building a large levain.
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
  card: {
    marginBottom: theme.spacing.md,
  },
  sectionTitle: {
    fontSize: theme.typography.sizes.lg,
    fontWeight: theme.typography.weights.semibold as any,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.sm,
  },
  helperText: {
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing.sm,
  },
  ratioExamples: {
    marginTop: theme.spacing.md,
    padding: theme.spacing.md,
    backgroundColor: theme.colors.background.subtle,
    borderRadius: theme.borderRadius.md,
  },
  exampleTitle: {
    fontSize: theme.typography.sizes.sm,
    fontWeight: theme.typography.weights.semibold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.xs,
  },
  exampleText: {
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.text.secondary,
    marginTop: theme.spacing.xs,
  },
  buttonContainer: {
    marginBottom: theme.spacing.md,
  },
  clearButton: {
    marginTop: theme.spacing.sm,
  },
  resultCard: {
    backgroundColor: theme.colors.success.light + '10',
    borderWidth: 2,
    borderColor: theme.colors.success.main,
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
  discardNotice: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.warning.light + '20',
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing.md,
  },
  discardText: {
    fontSize: theme.typography.sizes.base,
    fontWeight: theme.typography.weights.medium,
    color: theme.colors.warning.dark,
    marginLeft: theme.spacing.sm,
  },
  resultRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: theme.spacing.sm,
  },
  resultLabel: {
    fontSize: theme.typography.sizes.base,
    color: theme.colors.text.secondary,
  },
  resultValue: {
    fontSize: theme.typography.sizes.lg,
    fontWeight: theme.typography.weights.semibold,
    color: theme.colors.text.primary,
  },
  divider: {
    height: 1,
    backgroundColor: theme.colors.border.main,
    marginVertical: theme.spacing.md,
  },
  totalLabel: {
    fontSize: theme.typography.sizes.lg,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.text.primary,
  },
  totalValue: {
    fontSize: theme.typography.sizes.xl,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.success.main,
  },
  infoBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.info.main + '10',
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    marginTop: theme.spacing.md,
  },
  infoText: {
    flex: 1,
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.info.dark,
    marginLeft: theme.spacing.sm,
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
  },
});
