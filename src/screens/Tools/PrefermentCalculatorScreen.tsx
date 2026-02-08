/**
 * Preferment Calculator
 * Calculate poolish, biga, or pâte fermentée amounts
 */

import React, { useState } from 'react';
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
import Button from '../../components/Button';
import BasicInput from '../../components/BasicInput';
import Card from '../../components/Card';
import { theme } from '../../theme';
import { calculatePrefermentFlour, roundTo } from '../../utils/sourdoughCalculations';

type PrefermentType = 'poolish' | 'biga' | 'pate';

export default function PrefermentCalculatorScreen() {
  const [prefermentType, setPrefermentType] = useState<PrefermentType>('poolish');
  const [totalFlour, setTotalFlour] = useState('');
  const [prefermentPercent, setPrefermentPercent] = useState('20');
  const [calculated, setCalculated] = useState(false);
  const [result, setResult] = useState({
    prefermentFlour: 0,
    prefermentWater: 0,
    prefermentYeast: 0,
    prefermentSalt: 0,
    mainDoughFlour: 0,
    mainDoughWater: 0,
    totalPreferment: 0,
    hydration: 0,
  });

  const calculatePreferment = () => {
    const flour = parseFloat(totalFlour);
    const percent = parseFloat(prefermentPercent);

    if (!flour || flour <= 0 || !percent || percent <= 0 || percent > 100) return;

    // Calculate preferment flour
    const prefFlour = calculatePrefermentFlour(flour, percent);

    // Hydration and other ingredients vary by type
    let prefWater = 0;
    let prefYeast = 0;
    let prefSalt = 0;
    let hydration = 0;

    if (prefermentType === 'poolish') {
      // Poolish is 100% hydration
      prefWater = prefFlour;
      prefYeast = prefFlour * 0.001; // 0.1% instant yeast
      hydration = 100;
    } else if (prefermentType === 'biga') {
      // Biga is 50-60% hydration
      prefWater = prefFlour * 0.55;
      prefYeast = prefFlour * 0.001; // 0.1% instant yeast
      hydration = 55;
    } else if (prefermentType === 'pate') {
      // Pâte fermentée is typical dough (60-65% hydration with salt)
      prefWater = prefFlour * 0.65;
      prefYeast = prefFlour * 0.02; // 2% yeast
      prefSalt = prefFlour * 0.02; // 2% salt
      hydration = 65;
    }

    const totalPref = prefFlour + prefWater + prefYeast + prefSalt;
    const mainFlour = flour - prefFlour;

    setResult({
      prefermentFlour: roundTo(prefFlour, 1),
      prefermentWater: roundTo(prefWater, 1),
      prefermentYeast: roundTo(prefYeast, 2),
      prefermentSalt: roundTo(prefSalt, 1),
      mainDoughFlour: roundTo(mainFlour, 1),
      mainDoughWater: 0, // User calculates based on target hydration
      totalPreferment: roundTo(totalPref, 1),
      hydration,
    });
    setCalculated(true);
  };

  const clearAll = () => {
    setTotalFlour('');
    setPrefermentPercent('20');
    setCalculated(false);
  };

  const TypeButton = ({ type, label, description }: { type: PrefermentType; label: string; description: string }) => (
    <TouchableOpacity
      style={[styles.typeButton, prefermentType === type && styles.typeButtonActive]}
      onPress={() => {
        setPrefermentType(type);
        setCalculated(false);
      }}
    >
      <View style={styles.typeButtonContent}>
        <Text style={[styles.typeButtonLabel, prefermentType === type && styles.typeButtonLabelActive]}>
          {label}
        </Text>
        <Text style={[styles.typeButtonDescription, prefermentType === type && styles.typeButtonDescriptionActive]}>
          {description}
        </Text>
      </View>
      {prefermentType === type && (
        <Icon name="check-circle" size={24} color={theme.colors.primary[500]} />
      )}
    </TouchableOpacity>
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
        keyboardDismissMode="on-drag"
      >
        <View style={styles.header}>
          <Icon name="clock-time-four" size={48} color={theme.colors.primary[600]} />
          <Text style={styles.headerTitle}>Preferment Calculator</Text>
          <Text style={styles.headerSubtitle}>
            Calculate poolish, biga, or pâte fermentée for your recipe
          </Text>
        </View>

        <View style={styles.content}>
        <Card variant="elevated" padding="lg" style={styles.card}>
          <Text style={styles.sectionTitle}>Select Preferment Type</Text>
          <TypeButton
            type="poolish"
            label="Poolish"
            description="100% hydration, 12-16 hours, light and airy"
          />
          <TypeButton
            type="biga"
            label="Biga"
            description="55% hydration, 12-16 hours, chewy texture"
          />
          <TypeButton
            type="pate"
            label="Pâte Fermentée"
            description="Old dough, 8-24 hours, complex flavor"
          />
        </Card>

        <Card variant="elevated" padding="lg" style={styles.card}>
          <Text style={styles.sectionTitle}>Recipe Details</Text>
          <BasicInput
            label="Total flour in recipe (g)"
            value={totalFlour}
            onChangeText={setTotalFlour}
            keyboardType="numeric"
            placeholder="e.g., 500"
          />
          <BasicInput
            label="Preferment percentage (%)"
            value={prefermentPercent}
            onChangeText={setPrefermentPercent}
            keyboardType="numeric"
            placeholder="20"
            helperText="Typical: 15-30% of total flour"
          />
        </Card>

        <View style={styles.buttonContainer}>
          <Button
            title="Calculate Preferment"
            onPress={calculatePreferment}
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
                <Icon name="beaker" size={32} color={theme.colors.primary[600]} />
                <Text style={styles.resultTitle}>Preferment Recipe</Text>
              </View>

              <View style={styles.ingredientBox}>
                <View style={styles.ingredientRow}>
                  <Icon name="grain" size={20} color={theme.colors.text.secondary} />
                  <Text style={styles.ingredientLabel}>Flour</Text>
                  <Text style={styles.ingredientValue}>{result.prefermentFlour}g</Text>
                </View>
                <View style={styles.ingredientRow}>
                  <Icon name="water" size={20} color={theme.colors.text.secondary} />
                  <Text style={styles.ingredientLabel}>Water ({result.hydration}%)</Text>
                  <Text style={styles.ingredientValue}>{result.prefermentWater}g</Text>
                </View>
                <View style={styles.ingredientRow}>
                  <Icon name="shimmer" size={20} color={theme.colors.text.secondary} />
                  <Text style={styles.ingredientLabel}>Instant Yeast</Text>
                  <Text style={styles.ingredientValue}>{result.prefermentYeast}g</Text>
                </View>
                {result.prefermentSalt > 0 && (
                  <View style={styles.ingredientRow}>
                    <Icon name="shaker" size={20} color={theme.colors.text.secondary} />
                    <Text style={styles.ingredientLabel}>Salt</Text>
                    <Text style={styles.ingredientValue}>{result.prefermentSalt}g</Text>
                  </View>
                )}
              </View>

              <View style={styles.totalBox}>
                <Text style={styles.totalLabel}>Total Preferment:</Text>
                <Text style={styles.totalValue}>{result.totalPreferment}g</Text>
              </View>

              <View style={styles.timeBox}>
                <Icon name="clock-outline" size={20} color={theme.colors.info.main} />
                <Text style={styles.timeText}>
                  {prefermentType === 'poolish' && 'Ferment 12-16 hours at room temperature'}
                  {prefermentType === 'biga' && 'Ferment 12-16 hours, cool room preferred'}
                  {prefermentType === 'pate' && 'Ferment 8-24 hours, refrigerate if longer'}
                </Text>
              </View>
            </Card>

            <Card variant="elevated" padding="lg" style={styles.card}>
              <View style={styles.mainDoughHeader}>
                <Icon name="bread-slice" size={24} color={theme.colors.success.main} />
                <Text style={styles.mainDoughTitle}>Main Dough Adjustment</Text>
              </View>
              <Text style={styles.adjustmentText}>
                When mixing your main dough, use:
              </Text>
              <View style={styles.adjustmentBox}>
                <Text style={styles.adjustmentItem}>
                  • {result.mainDoughFlour}g flour (remaining)
                </Text>
                <Text style={styles.adjustmentItem}>
                  • Calculate water based on target hydration
                </Text>
                <Text style={styles.adjustmentItem}>
                  • Add all preferment ({result.totalPreferment}g)
                </Text>
                <Text style={styles.adjustmentItem}>
                  • Adjust yeast in main dough (use less or none)
                </Text>
                {prefermentType !== 'pate' && (
                  <Text style={styles.adjustmentItem}>
                    • Add salt to main dough as normal
                  </Text>
                )}
              </View>
            </Card>
          </>
        )}

        <Card variant="filled" padding="lg" style={styles.card}>
          <Text style={styles.guideTitle}>About Preferments</Text>
          <Text style={styles.guideText}>
            <Text style={styles.bold}>Poolish:</Text> Wet preferment (100% hydration) that creates
            an open crumb and subtle flavor. Popular for baguettes and ciabatta.
          </Text>
          <Text style={styles.guideText}>
            <Text style={styles.bold}>Biga:</Text> Stiff preferment (50-60% hydration) that adds
            strength and a nutty, sweet flavor. Common in Italian breads.
          </Text>
          <Text style={styles.guideText}>
            <Text style={styles.bold}>Pâte Fermentée:</Text> "Old dough" - leftover dough used as
            preferment. Adds complex flavor and improves texture.
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
  typeButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    borderWidth: 2,
    borderColor: theme.colors.border.main,
    backgroundColor: theme.colors.white,
    marginBottom: theme.spacing.sm,
  },
  typeButtonActive: {
    borderColor: theme.colors.primary[500],
    backgroundColor: theme.colors.primary[50],
  },
  typeButtonContent: {
    flex: 1,
  },
  typeButtonLabel: {
    fontSize: theme.typography.sizes.lg,
    fontWeight: theme.typography.weights.semibold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.xs,
  },
  typeButtonLabelActive: {
    color: theme.colors.primary[700],
  },
  typeButtonDescription: {
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.text.secondary,
  },
  typeButtonDescriptionActive: {
    color: theme.colors.primary[600],
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
  ingredientBox: {
    backgroundColor: theme.colors.background.subtle,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
  },
  ingredientRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: theme.spacing.sm,
  },
  ingredientLabel: {
    flex: 1,
    fontSize: theme.typography.sizes.base,
    color: theme.colors.text.secondary,
    marginLeft: theme.spacing.sm,
  },
  ingredientValue: {
    fontSize: theme.typography.sizes.lg,
    fontWeight: theme.typography.weights.semibold,
    color: theme.colors.text.primary,
  },
  totalBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: theme.spacing.md,
    borderTopWidth: 2,
    borderTopColor: theme.colors.primary[200],
  },
  totalLabel: {
    fontSize: theme.typography.sizes.lg,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.text.primary,
  },
  totalValue: {
    fontSize: theme.typography.sizes.xl,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.primary[600],
  },
  timeBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.info.light + '20',
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    marginTop: theme.spacing.md,
  },
  timeText: {
    flex: 1,
    fontSize: theme.typography.sizes.base,
    color: theme.colors.info.dark,
    marginLeft: theme.spacing.sm,
  },
  mainDoughHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  mainDoughTitle: {
    fontSize: theme.typography.sizes.lg,
    fontWeight: theme.typography.weights.semibold,
    color: theme.colors.text.primary,
    marginLeft: theme.spacing.sm,
  },
  adjustmentText: {
    fontSize: theme.typography.sizes.base,
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing.md,
  },
  adjustmentBox: {
    backgroundColor: theme.colors.background.subtle,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
  },
  adjustmentItem: {
    fontSize: theme.typography.sizes.base,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.sm,
    lineHeight: 22,
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
});
