/**
 * Dough Weight/Portion Calculator
 * Calculate total dough needed for multiple loaves
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
import { calculatePreBakeWeight, calculateWeightLoss, roundTo } from '../../utils/sourdoughCalculations';

export default function DoughWeightCalculatorScreen() {
  const [numberOfLoaves, setNumberOfLoaves] = useState('');
  const [targetWeight, setTargetWeight] = useState('');
  const [bakingLoss, setBakingLoss] = useState('15');
  const [calculated, setCalculated] = useState(false);
  const [result, setResult] = useState({
    preBakeWeight: 0,
    postBakeWeight: 0,
    totalDoughNeeded: 0,
    weightLoss: 0,
    perLoafPreBake: 0,
    perLoafPostBake: 0,
  });

  const calculateDoughWeight = () => {
    const loaves = parseFloat(numberOfLoaves);
    const weight = parseFloat(targetWeight);
    const loss = parseFloat(bakingLoss);

    if (!loaves || loaves <= 0 || !weight || weight <= 0 || !loss || loss < 0) return;

    // Total post-bake weight desired
    const totalPostBake = loaves * weight;

    // Calculate pre-bake weight accounting for baking loss
    const preBakePerLoaf = calculatePreBakeWeight(weight, loss);
    const totalPreBake = loaves * preBakePerLoaf;
    const totalLoss = calculateWeightLoss(totalPreBake, totalPostBake);

    setResult({
      preBakeWeight: roundTo(totalPreBake, 0),
      postBakeWeight: roundTo(totalPostBake, 0),
      totalDoughNeeded: roundTo(totalPreBake, 0),
      weightLoss: roundTo(totalLoss, 0),
      perLoafPreBake: roundTo(preBakePerLoaf, 0),
      perLoafPostBake: roundTo(weight, 0),
    });
    setCalculated(true);
  };

  const clearAll = () => {
    setNumberOfLoaves('');
    setTargetWeight('');
    setBakingLoss('15');
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
          <Icon name="weight-gram" size={48} color={theme.colors.primary[600]} />
          <Text style={styles.headerTitle}>Dough Weight Calculator</Text>
          <Text style={styles.headerSubtitle}>
            Calculate how much dough to make for your desired loaf size
          </Text>
        </View>

        <View style={styles.content}>
        <Card variant="elevated" padding="lg" style={styles.card}>
          <Text style={styles.sectionTitle}>Loaf Details</Text>
          <BasicInput
            label="Number of loaves"
            value={numberOfLoaves}
            onChangeText={setNumberOfLoaves}
            keyboardType="numeric"
            placeholder="e.g., 2"
          />
          <BasicInput
            label="Target weight per loaf (g)"
            value={targetWeight}
            onChangeText={setTargetWeight}
            keyboardType="numeric"
            placeholder="e.g., 800"
            helperText="Final baked weight you want"
          />
        </Card>

        <Card variant="elevated" padding="lg" style={styles.card}>
          <Text style={styles.sectionTitle}>Baking Loss</Text>
          <BasicInput
            label="Baking loss percentage (%)"
            value={bakingLoss}
            onChangeText={setBakingLoss}
            keyboardType="numeric"
            placeholder="15"
            helperText="Typical: 12-18% (moisture loss during baking)"
          />

          <View style={styles.lossExamples}>
            <Text style={styles.exampleTitle}>Typical Loss Rates:</Text>
            <Text style={styles.exampleText}>• 12-15%: High hydration loaves</Text>
            <Text style={styles.exampleText}>• 15-18%: Standard loaves</Text>
            <Text style={styles.exampleText}>• 18-20%: Lean doughs, rolls</Text>
          </View>
        </Card>

        <View style={styles.buttonContainer}>
          <Button
            title="Calculate Dough Weight"
            onPress={calculateDoughWeight}
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
                <Icon name="scale-balance" size={32} color={theme.colors.primary[600]} />
                <Text style={styles.resultTitle}>Dough Requirements</Text>
              </View>

              <View style={styles.mainResultBox}>
                <Text style={styles.mainResultLabel}>Total Dough Needed:</Text>
                <Text style={styles.mainResultValue}>{result.totalDoughNeeded}g</Text>
              </View>

              <View style={styles.divider} />

              <View style={styles.detailsBox}>
                <Text style={styles.detailsTitle}>Per Loaf:</Text>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Pre-bake weight:</Text>
                  <Text style={styles.detailValue}>{result.perLoafPreBake}g</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Post-bake weight:</Text>
                  <Text style={styles.detailValue}>{result.perLoafPostBake}g</Text>
                </View>
              </View>

              <View style={styles.divider} />

              <View style={styles.detailsBox}>
                <Text style={styles.detailsTitle}>Total Batch:</Text>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Pre-bake (dough):</Text>
                  <Text style={styles.detailValue}>{result.preBakeWeight}g</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Post-bake (bread):</Text>
                  <Text style={styles.detailValue}>{result.postBakeWeight}g</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Weight loss:</Text>
                  <Text style={[styles.detailValue, styles.lossValue]}>
                    -{result.weightLoss}g
                  </Text>
                </View>
              </View>

              <View style={styles.tipBox}>
                <Icon name="information" size={18} color={theme.colors.info.main} />
                <Text style={styles.tipText}>
                  Divide your {result.totalDoughNeeded}g of dough into {numberOfLoaves} pieces
                  of {result.perLoafPreBake}g each before shaping.
                </Text>
              </View>
            </Card>

            <Card variant="elevated" padding="lg" style={styles.card}>
              <View style={styles.workflowHeader}>
                <Icon name="clipboard-check" size={24} color={theme.colors.success.main} />
                <Text style={styles.workflowTitle}>Workflow</Text>
              </View>
              <View style={styles.stepBox}>
                <View style={styles.step}>
                  <View style={styles.stepNumber}>
                    <Text style={styles.stepNumberText}>1</Text>
                  </View>
                  <Text style={styles.stepText}>
                    Mix dough with total flour/water to make {result.totalDoughNeeded}g
                  </Text>
                </View>
                <View style={styles.step}>
                  <View style={styles.stepNumber}>
                    <Text style={styles.stepNumberText}>2</Text>
                  </View>
                  <Text style={styles.stepText}>
                    After bulk fermentation, divide into {numberOfLoaves} pieces
                  </Text>
                </View>
                <View style={styles.step}>
                  <View style={styles.stepNumber}>
                    <Text style={styles.stepNumberText}>3</Text>
                  </View>
                  <Text style={styles.stepText}>
                    Weigh each piece to {result.perLoafPreBake}g
                  </Text>
                </View>
                <View style={styles.step}>
                  <View style={styles.stepNumber}>
                    <Text style={styles.stepNumberText}>4</Text>
                  </View>
                  <Text style={styles.stepText}>
                    Shape, proof, and bake. Final loaves will be ~{result.perLoafPostBake}g each
                  </Text>
                </View>
              </View>
            </Card>
          </>
        )}

        <Card variant="filled" padding="lg" style={styles.card}>
          <Text style={styles.guideTitle}>Understanding Baking Loss</Text>
          <Text style={styles.guideText}>
            During baking, bread loses weight primarily through moisture evaporation. This
            "baking loss" is typically 12-18% of the dough's pre-bake weight.
          </Text>
          <Text style={styles.guideText}>
            <Text style={styles.bold}>Example:</Text> If you want a 800g loaf and expect 15%
            loss, you need to start with about 941g of dough. After baking, it will weigh 800g.
          </Text>
          <Text style={styles.guideText}>
            <Text style={styles.bold}>Factors affecting loss:</Text> Baking time, temperature,
            crust thickness, and dough hydration all influence how much weight is lost.
          </Text>
        </Card>

        <Card variant="filled" padding="lg" style={styles.card}>
          <Text style={styles.guideTitle}>Common Loaf Sizes</Text>

          <View style={styles.sizeTable}>
            <View style={styles.sizeRow}>
              <Text style={styles.sizeName}>Small boule</Text>
              <Text style={styles.sizeWeight}>400-500g</Text>
            </View>
            <View style={styles.sizeRow}>
              <Text style={styles.sizeName}>Medium boule</Text>
              <Text style={styles.sizeWeight}>700-900g</Text>
            </View>
            <View style={styles.sizeRow}>
              <Text style={styles.sizeName}>Large boule</Text>
              <Text style={styles.sizeWeight}>1000-1200g</Text>
            </View>
            <View style={styles.sizeRow}>
              <Text style={styles.sizeName}>Batard</Text>
              <Text style={styles.sizeWeight}>600-800g</Text>
            </View>
            <View style={styles.sizeRow}>
              <Text style={styles.sizeName}>Baguette</Text>
              <Text style={styles.sizeWeight}>250-350g</Text>
            </View>
          </View>
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
  lossExamples: {
    marginTop: theme.spacing.md,
    padding: theme.spacing.md,
    backgroundColor: theme.colors.background.subtle,
    borderRadius: theme.borderRadius.md,
  },
  exampleTitle: {
    fontSize: theme.typography.sizes.base,
    fontFamily: theme.typography.fonts.semibold,
    fontWeight: theme.typography.weights.semibold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.xs,
  },
  exampleText: {
    fontSize: theme.typography.sizes.base,
    fontFamily: theme.typography.fonts.regular,
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
    borderWidth: 2,
    borderColor: theme.colors.primary[300],
  },
  resultHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
  },
  resultTitle: {
    fontSize: theme.typography.sizes['2xl'],
    fontFamily: theme.typography.fonts.semibold,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.text.primary,
    marginLeft: theme.spacing.md,
  },
  mainResultBox: {
    alignItems: 'center',
    paddingVertical: theme.spacing.xl,
    backgroundColor: theme.colors.primary[50],
    borderRadius: theme.borderRadius.lg,
    marginBottom: theme.spacing.md,
  },
  mainResultLabel: {
    fontSize: theme.typography.sizes.lg,
    fontFamily: theme.typography.fonts.regular,
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing.sm,
  },
  mainResultValue: {
    fontSize: theme.typography.sizes['5xl'],
    fontFamily: theme.typography.fonts.bold,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.primary[600],
    letterSpacing: theme.typography.letterSpacing.tight,
  },
  divider: {
    height: 1,
    backgroundColor: theme.colors.border.main,
    marginVertical: theme.spacing.md,
  },
  detailsBox: {
    backgroundColor: theme.colors.background.subtle,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing.sm,
  },
  detailsTitle: {
    fontSize: theme.typography.sizes.base,
    fontWeight: theme.typography.weights.semibold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.sm,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: theme.spacing.xs,
  },
  detailLabel: {
    fontSize: theme.typography.sizes.base,
    color: theme.colors.text.secondary,
  },
  detailValue: {
    fontSize: theme.typography.sizes.base,
    fontWeight: theme.typography.weights.semibold,
    color: theme.colors.text.primary,
  },
  lossValue: {
    color: theme.colors.error.main,
  },
  tipBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.info.light + '20',
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    marginTop: theme.spacing.md,
  },
  tipText: {
    flex: 1,
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.info.dark,
    marginLeft: theme.spacing.sm,
    lineHeight: 20,
  },
  workflowHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  workflowTitle: {
    fontSize: theme.typography.sizes.lg,
    fontWeight: theme.typography.weights.semibold,
    color: theme.colors.text.primary,
    marginLeft: theme.spacing.sm,
  },
  stepBox: {
    backgroundColor: theme.colors.background.subtle,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
  },
  step: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: theme.spacing.md,
  },
  stepNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: theme.colors.success.main,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.md,
  },
  stepNumberText: {
    fontSize: theme.typography.sizes.base,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.white,
  },
  stepText: {
    flex: 1,
    fontSize: theme.typography.sizes.base,
    color: theme.colors.text.primary,
    lineHeight: 22,
    paddingTop: 2,
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
  sizeTable: {
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.sm,
  },
  sizeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border.light,
  },
  sizeName: {
    fontSize: theme.typography.sizes.base,
    color: theme.colors.text.primary,
  },
  sizeWeight: {
    fontSize: theme.typography.sizes.base,
    fontWeight: theme.typography.weights.semibold,
    color: theme.colors.text.secondary,
  },
});
