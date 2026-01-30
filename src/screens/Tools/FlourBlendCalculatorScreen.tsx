/**
 * Flour Blend Calculator
 * Mix different flours to achieve target protein percentage
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
import Button from '../../components/Button';
import BasicInput from '../../components/BasicInput';
import Card from '../../components/Card';
import { theme } from '../../theme';

interface FlourType {
  id: string;
  name: string;
  protein: number;
  color: string;
}

interface BlendFlour {
  id: string;
  flourType: FlourType;
  percentage: string;
  weight: string;
}

const flourTypes: FlourType[] = [
  { id: 'bread', name: 'Bread Flour', protein: 12.5, color: theme.colors.primary[500] },
  { id: 'ap', name: 'All-Purpose Flour', protein: 10.5, color: theme.colors.info.main },
  { id: 'whole_wheat', name: 'Whole Wheat Flour', protein: 14, color: theme.colors.warning.dark },
  { id: 'rye', name: 'Rye Flour', protein: 8.5, color: theme.colors.secondary[600] },
  { id: 'spelt', name: 'Spelt Flour', protein: 12, color: theme.colors.success.main },
  { id: 'einkorn', name: 'Einkorn Flour', protein: 13.5, color: theme.colors.warning.main },
  { id: 'tipo00', name: 'Tipo 00 Flour', protein: 11, color: theme.colors.error.light },
  { id: 'semolina', name: 'Semolina Flour', protein: 13, color: theme.colors.warning.light },
  { id: 'cake', name: 'Cake Flour', protein: 8, color: theme.colors.primary[300] },
  { id: 'pastry', name: 'Pastry Flour', protein: 9, color: theme.colors.primary[400] },
];

export default function FlourBlendCalculatorScreen() {
  const [totalWeight, setTotalWeight] = useState('500');
  const [targetProtein, setTargetProtein] = useState('');
  const [blendFlours, setBlendFlours] = useState<BlendFlour[]>([
    { id: '1', flourType: flourTypes[0], percentage: '70', weight: '' },
    { id: '2', flourType: flourTypes[2], percentage: '30', weight: '' },
  ]);
  const [showFlourPicker, setShowFlourPicker] = useState<string | null>(null);
  const [calculationMode, setCalculationMode] = useState<'percentage' | 'target'>('percentage');

  // Calculate weights from percentages
  useEffect(() => {
    const total = parseFloat(totalWeight) || 0;
    if (total > 0 && calculationMode === 'percentage') {
      setBlendFlours(prev => prev.map(flour => ({
        ...flour,
        weight: ((parseFloat(flour.percentage) || 0) / 100 * total).toFixed(0),
      })));
    }
  }, [totalWeight, blendFlours.map(f => f.percentage).join(','), calculationMode]);

  const calculateBlendProtein = () => {
    let totalPercentage = 0;
    let weightedProtein = 0;

    blendFlours.forEach(flour => {
      const pct = parseFloat(flour.percentage) || 0;
      totalPercentage += pct;
      weightedProtein += (pct / 100) * flour.flourType.protein;
    });

    return {
      protein: weightedProtein.toFixed(1),
      totalPercentage: totalPercentage.toFixed(0),
      isValid: Math.abs(totalPercentage - 100) < 0.1,
    };
  };

  const calculateForTargetProtein = () => {
    if (blendFlours.length !== 2) return null;

    const target = parseFloat(targetProtein);
    if (!target || isNaN(target)) return null;

    const flour1 = blendFlours[0].flourType;
    const flour2 = blendFlours[1].flourType;

    // Using algebra: target = (p1 * x) + (p2 * (100 - x)) / 100
    // Solving for x: x = (target - p2) / (p1 - p2) * 100
    const pctFlour1 = ((target - flour2.protein) / (flour1.protein - flour2.protein)) * 100;
    const pctFlour2 = 100 - pctFlour1;

    if (pctFlour1 < 0 || pctFlour1 > 100) {
      return { achievable: false, message: `Target ${target}% is outside the range achievable with these flours (${Math.min(flour1.protein, flour2.protein)}% - ${Math.max(flour1.protein, flour2.protein)}%)` };
    }

    const total = parseFloat(totalWeight) || 0;

    return {
      achievable: true,
      flour1Pct: pctFlour1.toFixed(1),
      flour2Pct: pctFlour2.toFixed(1),
      flour1Weight: (pctFlour1 / 100 * total).toFixed(0),
      flour2Weight: (pctFlour2 / 100 * total).toFixed(0),
    };
  };

  const applyTargetCalculation = () => {
    const result = calculateForTargetProtein();
    if (result && result.achievable) {
      setBlendFlours(prev => [
        { ...prev[0], percentage: result.flour1Pct!, weight: result.flour1Weight! },
        { ...prev[1], percentage: result.flour2Pct!, weight: result.flour2Weight! },
      ]);
      setCalculationMode('percentage');
    }
  };

  const addFlour = () => {
    const usedIds = blendFlours.map(f => f.flourType.id);
    const availableFlour = flourTypes.find(f => !usedIds.includes(f.id)) || flourTypes[0];

    setBlendFlours([...blendFlours, {
      id: Date.now().toString(),
      flourType: availableFlour,
      percentage: '0',
      weight: '',
    }]);
  };

  const removeFlour = (id: string) => {
    if (blendFlours.length > 2) {
      setBlendFlours(blendFlours.filter(f => f.id !== id));
    }
  };

  const updateFlourPercentage = (id: string, percentage: string) => {
    setBlendFlours(prev => prev.map(flour =>
      flour.id === id ? { ...flour, percentage } : flour
    ));
  };

  const updateFlourType = (id: string, flourType: FlourType) => {
    setBlendFlours(prev => prev.map(flour =>
      flour.id === id ? { ...flour, flourType } : flour
    ));
    setShowFlourPicker(null);
  };

  const blendResult = calculateBlendProtein();
  const targetResult = calculationMode === 'target' ? calculateForTargetProtein() : null;

  const getProteinCategory = (protein: number) => {
    if (protein < 9) return { label: 'Low (Pastries)', color: theme.colors.info.main };
    if (protein < 11) return { label: 'Medium (All-Purpose)', color: theme.colors.success.main };
    if (protein < 13) return { label: 'High (Bread)', color: theme.colors.warning.main };
    return { label: 'Very High (Strong Bread)', color: theme.colors.error.main };
  };

  const proteinCategory = getProteinCategory(parseFloat(blendResult.protein));

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
          <Icon name="grain" size={48} color={theme.colors.warning.dark} />
          <Text style={styles.headerTitle}>Flour Blend Calculator</Text>
          <Text style={styles.headerSubtitle}>
            Mix flours to achieve your target protein level
          </Text>
        </View>

        <View style={styles.content}>
          {/* Mode Toggle */}
          <Card variant="elevated">
            <Text style={styles.sectionTitle}>Calculation Mode</Text>
            <View style={styles.modeRow}>
              <TouchableOpacity
                style={[
                  styles.modeButton,
                  calculationMode === 'percentage' && styles.modeButtonActive,
                ]}
                onPress={() => setCalculationMode('percentage')}
              >
                <Icon
                  name="percent"
                  size={20}
                  color={calculationMode === 'percentage' ? theme.colors.white : theme.colors.text.secondary}
                />
                <Text style={[
                  styles.modeText,
                  calculationMode === 'percentage' && styles.modeTextActive,
                ]}>
                  Set Percentages
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.modeButton,
                  calculationMode === 'target' && styles.modeButtonActive,
                ]}
                onPress={() => setCalculationMode('target')}
              >
                <Icon
                  name="target"
                  size={20}
                  color={calculationMode === 'target' ? theme.colors.white : theme.colors.text.secondary}
                />
                <Text style={[
                  styles.modeText,
                  calculationMode === 'target' && styles.modeTextActive,
                ]}>
                  Target Protein
                </Text>
              </TouchableOpacity>
            </View>
          </Card>

          {/* Total Weight */}
          <Card variant="elevated">
            <BasicInput
              label="Total Flour Weight"
              placeholder="e.g., 500"
              value={totalWeight}
              onChangeText={setTotalWeight}
              keyboardType="numeric"
              leftIcon="scale"
              helperText="Total flour needed in grams"
            />

            {calculationMode === 'target' && (
              <BasicInput
                label="Target Protein %"
                placeholder="e.g., 12"
                value={targetProtein}
                onChangeText={setTargetProtein}
                keyboardType="numeric"
                leftIcon="target"
                helperText="Desired protein percentage for your blend"
              />
            )}
          </Card>

          {/* Flour Blend */}
          <Card variant="elevated">
            <View style={styles.flourHeader}>
              <Text style={styles.sectionTitle}>Flour Blend</Text>
              {blendFlours.length < flourTypes.length && calculationMode === 'percentage' && (
                <TouchableOpacity onPress={addFlour} style={styles.addButton}>
                  <Icon name="plus" size={20} color={theme.colors.primary[600]} />
                  <Text style={styles.addButtonText}>Add Flour</Text>
                </TouchableOpacity>
              )}
            </View>

            {blendFlours.map((flour, index) => (
              <View key={flour.id} style={styles.flourRow}>
                <TouchableOpacity
                  style={[styles.flourTypeButton, { borderColor: flour.flourType.color }]}
                  onPress={() => setShowFlourPicker(flour.id)}
                >
                  <View style={[styles.flourColorDot, { backgroundColor: flour.flourType.color }]} />
                  <View style={styles.flourTypeInfo}>
                    <Text style={styles.flourTypeName}>{flour.flourType.name}</Text>
                    <Text style={styles.flourTypeProtein}>{flour.flourType.protein}% protein</Text>
                  </View>
                  <Icon name="chevron-down" size={20} color={theme.colors.text.secondary} />
                </TouchableOpacity>

                {showFlourPicker === flour.id && (
                  <View style={styles.flourPicker}>
                    {flourTypes.map(type => (
                      <TouchableOpacity
                        key={type.id}
                        style={styles.flourPickerItem}
                        onPress={() => updateFlourType(flour.id, type)}
                      >
                        <View style={[styles.flourColorDot, { backgroundColor: type.color }]} />
                        <Text style={styles.flourPickerName}>{type.name}</Text>
                        <Text style={styles.flourPickerProtein}>{type.protein}%</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                )}

                <View style={styles.flourInputRow}>
                  <View style={styles.flourPercentageInput}>
                    <BasicInput
                      label="Percentage"
                      placeholder="0"
                      value={flour.percentage}
                      onChangeText={(val) => updateFlourPercentage(flour.id, val)}
                      keyboardType="numeric"
                      disabled={calculationMode === 'target'}
                    />
                  </View>
                  <View style={styles.flourWeightDisplay}>
                    <Text style={styles.flourWeightLabel}>Weight</Text>
                    <Text style={styles.flourWeightValue}>{flour.weight || '0'}g</Text>
                  </View>
                  {blendFlours.length > 2 && (
                    <TouchableOpacity
                      onPress={() => removeFlour(flour.id)}
                      style={styles.removeButton}
                    >
                      <Icon name="close-circle" size={24} color={theme.colors.error.main} />
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            ))}

            {/* Percentage Warning */}
            {!blendResult.isValid && calculationMode === 'percentage' && (
              <View style={styles.warningBanner}>
                <Icon name="alert" size={20} color={theme.colors.warning.dark} />
                <Text style={styles.warningText}>
                  Total is {blendResult.totalPercentage}% (should be 100%)
                </Text>
              </View>
            )}
          </Card>

          {/* Target Mode Results */}
          {calculationMode === 'target' && targetResult && (
            <Card variant="filled" style={[
              styles.resultCard,
              { backgroundColor: targetResult.achievable ? theme.colors.success.main + '15' : theme.colors.error.main + '15' },
            ]}>
              {targetResult.achievable ? (
                <>
                  <View style={styles.targetResultHeader}>
                    <Icon name="check-circle" size={24} color={theme.colors.success.main} />
                    <Text style={styles.targetResultTitle}>Blend Found!</Text>
                  </View>
                  <View style={styles.targetResultRow}>
                    <Text style={styles.targetResultFlour}>{blendFlours[0].flourType.name}</Text>
                    <Text style={styles.targetResultValue}>{targetResult.flour1Pct}% ({targetResult.flour1Weight}g)</Text>
                  </View>
                  <View style={styles.targetResultRow}>
                    <Text style={styles.targetResultFlour}>{blendFlours[1].flourType.name}</Text>
                    <Text style={styles.targetResultValue}>{targetResult.flour2Pct}% ({targetResult.flour2Weight}g)</Text>
                  </View>
                  <Button
                    title="Apply This Blend"
                    onPress={applyTargetCalculation}
                    fullWidth
                    leftIcon="check"
                    style={styles.applyButton}
                  />
                </>
              ) : (
                <>
                  <View style={styles.targetResultHeader}>
                    <Icon name="alert-circle" size={24} color={theme.colors.error.main} />
                    <Text style={[styles.targetResultTitle, { color: theme.colors.error.main }]}>
                      Not Achievable
                    </Text>
                  </View>
                  <Text style={styles.targetResultMessage}>{targetResult.message}</Text>
                </>
              )}
            </Card>
          )}

          {/* Blend Result */}
          {calculationMode === 'percentage' && (
            <Card variant="filled" style={[
              styles.resultCard,
              { backgroundColor: proteinCategory.color + '20' },
            ]}>
              <View style={styles.resultHeader}>
                <Text style={styles.resultLabel}>Blend Protein Content</Text>
                <View style={[styles.levelBadge, { backgroundColor: proteinCategory.color }]}>
                  <Text style={styles.levelText}>{proteinCategory.label}</Text>
                </View>
              </View>
              <Text style={[styles.resultValue, { color: proteinCategory.color }]}>
                {blendResult.protein}%
              </Text>
              <Text style={styles.resultDescription}>
                Weighted average based on flour percentages
              </Text>
            </Card>
          )}

          {/* Flour Reference */}
          <Card variant="outlined">
            <Text style={styles.infoTitle}>Flour Protein Guide</Text>
            <Text style={styles.infoText}>
              <Text style={styles.infoBold}>Low (7-9%):</Text> Cake flour, pastry flour - tender baked goods{'\n'}
              <Text style={styles.infoBold}>Medium (10-11%):</Text> All-purpose, Tipo 00 - versatile{'\n'}
              <Text style={styles.infoBold}>High (12-13%):</Text> Bread flour, spelt - chewy bread{'\n'}
              <Text style={styles.infoBold}>Very High (14%+):</Text> Whole wheat, vital wheat gluten{'\n\n'}
              Tip: Higher protein = more gluten = chewier texture and better rise.
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
  modeRow: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
  },
  modeButton: {
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
  modeButtonActive: {
    backgroundColor: theme.colors.primary[600],
  },
  modeText: {
    fontSize: theme.typography.sizes.sm,
    fontWeight: theme.typography.weights.medium as any,
    color: theme.colors.text.secondary,
  },
  modeTextActive: {
    color: theme.colors.white,
  },
  flourHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xs,
  },
  addButtonText: {
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.primary[600],
    fontWeight: theme.typography.weights.medium as any,
  },
  flourRow: {
    marginBottom: theme.spacing.md,
    paddingBottom: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border.light,
  },
  flourTypeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.spacing.sm,
    borderRadius: theme.borderRadius.md,
    borderWidth: 2,
    backgroundColor: theme.colors.white,
    marginBottom: theme.spacing.sm,
  },
  flourColorDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: theme.spacing.sm,
  },
  flourTypeInfo: {
    flex: 1,
  },
  flourTypeName: {
    fontSize: theme.typography.sizes.sm,
    fontWeight: theme.typography.weights.medium as any,
    color: theme.colors.text.primary,
  },
  flourTypeProtein: {
    fontSize: theme.typography.sizes.xs,
    color: theme.colors.text.secondary,
  },
  flourPicker: {
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing.sm,
    ...theme.shadows.md,
  },
  flourPickerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border.light,
  },
  flourPickerName: {
    flex: 1,
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.text.primary,
  },
  flourPickerProtein: {
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.text.secondary,
    fontWeight: theme.typography.weights.medium as any,
  },
  flourInputRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: theme.spacing.sm,
  },
  flourPercentageInput: {
    flex: 1,
  },
  flourWeightDisplay: {
    alignItems: 'center',
    paddingBottom: theme.spacing.sm,
  },
  flourWeightLabel: {
    fontSize: theme.typography.sizes.xs,
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing.xs,
  },
  flourWeightValue: {
    fontSize: theme.typography.sizes.lg,
    fontWeight: theme.typography.weights.bold as any,
    color: theme.colors.text.primary,
  },
  removeButton: {
    paddingBottom: theme.spacing.sm,
  },
  warningBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
    padding: theme.spacing.sm,
    backgroundColor: theme.colors.warning.main + '20',
    borderRadius: theme.borderRadius.md,
    marginTop: theme.spacing.sm,
  },
  warningText: {
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.warning.dark,
    fontWeight: theme.typography.weights.medium as any,
  },
  resultCard: {
    padding: theme.spacing.xl,
  },
  resultHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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
    textAlign: 'center',
    marginBottom: theme.spacing.xs,
  },
  resultDescription: {
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.text.secondary,
    textAlign: 'center',
  },
  targetResultHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.md,
  },
  targetResultTitle: {
    fontSize: theme.typography.sizes.lg,
    fontWeight: theme.typography.weights.semibold as any,
    color: theme.colors.success.dark,
  },
  targetResultRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: theme.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border.light,
  },
  targetResultFlour: {
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.text.secondary,
  },
  targetResultValue: {
    fontSize: theme.typography.sizes.base,
    fontWeight: theme.typography.weights.semibold as any,
    color: theme.colors.text.primary,
  },
  targetResultMessage: {
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.text.secondary,
    lineHeight: 20,
  },
  applyButton: {
    marginTop: theme.spacing.md,
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
