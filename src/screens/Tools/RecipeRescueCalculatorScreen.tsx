/**
 * Recipe Rescue Calculator
 * Fix recipe mistakes when ingredients are mis-measured
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
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Button from '../../components/Button';
import BasicInput from '../../components/BasicInput';
import Card from '../../components/Card';
import { theme } from '../../theme';
import { Picker } from '@react-native-picker/picker';

type ProblemType = 'too_much' | 'not_enough';
type Ingredient = 'flour' | 'water' | 'salt' | 'starter';

export default function RecipeRescueCalculatorScreen() {
  // Original recipe
  const [flourOriginal, setFlourOriginal] = useState('500');
  const [waterOriginal, setWaterOriginal] = useState('350');
  const [saltOriginal, setSaltOriginal] = useState('10');
  const [starterOriginal, setStarterOriginal] = useState('100');

  // Problem details
  const [problemIngredient, setProblemIngredient] = useState<Ingredient>('water');
  const [problemType, setProblemType] = useState<ProblemType>('too_much');
  const [actualAmount, setActualAmount] = useState('');

  const [calculated, setCalculated] = useState(false);
  const [solutions, setSolutions] = useState({
    fixForward: {
      flour: 0,
      water: 0,
      salt: 0,
      starter: 0,
      total: 0,
      addFlour: 0,
      addWater: 0,
      addSalt: 0,
      addStarter: 0,
    },
    acceptChange: {
      flour: 0,
      water: 0,
      salt: 0,
      starter: 0,
      total: 0,
      waterPercent: 0,
      saltPercent: 0,
      starterPercent: 0,
    },
  });

  const calculateRescue = () => {
    const flour = parseFloat(flourOriginal);
    const water = parseFloat(waterOriginal);
    const salt = parseFloat(saltOriginal);
    const starter = parseFloat(starterOriginal);
    const actual = parseFloat(actualAmount);

    if (!flour || !water || !salt || !starter || !actual || actual <= 0) {
      Alert.alert('Error', 'Please enter all recipe amounts and the actual amount');
      return;
    }

    // Calculate original percentages
    const waterPercent = (water / flour) * 100;
    const saltPercent = (salt / flour) * 100;
    const starterPercent = (starter / flour) * 100;

    if (problemType === 'too_much') {
      // Added too much - scale up other ingredients
      let scaleFactor = 1;
      let newFlour = flour;
      let newWater = water;
      let newSalt = salt;
      let newStarter = starter;

      if (problemIngredient === 'flour') {
        scaleFactor = actual / flour;
        newFlour = actual;
        newWater = newFlour * (waterPercent / 100);
        newSalt = newFlour * (saltPercent / 100);
        newStarter = newFlour * (starterPercent / 100);
      } else if (problemIngredient === 'water') {
        // Water added too much - need more flour to maintain hydration
        newWater = actual;
        newFlour = newWater / (waterPercent / 100);
        newSalt = newFlour * (saltPercent / 100);
        newStarter = newFlour * (starterPercent / 100);
      } else if (problemIngredient === 'salt') {
        newSalt = actual;
        newFlour = newSalt / (saltPercent / 100);
        newWater = newFlour * (waterPercent / 100);
        newStarter = newFlour * (starterPercent / 100);
      } else if (problemIngredient === 'starter') {
        newStarter = actual;
        newFlour = newStarter / (starterPercent / 100);
        newWater = newFlour * (waterPercent / 100);
        newSalt = newFlour * (saltPercent / 100);
      }

      // Solution 1: Fix forward (add more)
      setSolutions({
        fixForward: {
          flour: parseFloat(newFlour.toFixed(1)),
          water: parseFloat(newWater.toFixed(1)),
          salt: parseFloat(newSalt.toFixed(1)),
          starter: parseFloat(newStarter.toFixed(1)),
          total: parseFloat((newFlour + newWater + newSalt + newStarter).toFixed(1)),
          addFlour: parseFloat((newFlour - flour).toFixed(1)),
          addWater: parseFloat((newWater - water).toFixed(1)),
          addSalt: parseFloat((newSalt - salt).toFixed(1)),
          addStarter: parseFloat((newStarter - starter).toFixed(1)),
        },
        acceptChange: {
          flour: problemIngredient === 'flour' ? actual : flour,
          water: problemIngredient === 'water' ? actual : water,
          salt: problemIngredient === 'salt' ? actual : salt,
          starter: problemIngredient === 'starter' ? actual : starter,
          total: parseFloat((
            (problemIngredient === 'flour' ? actual : flour) +
            (problemIngredient === 'water' ? actual : water) +
            (problemIngredient === 'salt' ? actual : salt) +
            (problemIngredient === 'starter' ? actual : starter)
          ).toFixed(1)),
          waterPercent: parseFloat(((problemIngredient === 'water' ? actual : water) / (problemIngredient === 'flour' ? actual : flour) * 100).toFixed(1)),
          saltPercent: parseFloat(((problemIngredient === 'salt' ? actual : salt) / (problemIngredient === 'flour' ? actual : flour) * 100).toFixed(2)),
          starterPercent: parseFloat(((problemIngredient === 'starter' ? actual : starter) / (problemIngredient === 'flour' ? actual : flour) * 100).toFixed(1)),
        },
      });
    } else {
      // Don't have enough - scale everything down
      let scaleFactor = 1;

      if (problemIngredient === 'flour') {
        scaleFactor = actual / flour;
      } else if (problemIngredient === 'water') {
        scaleFactor = actual / water;
      } else if (problemIngredient === 'salt') {
        scaleFactor = actual / salt;
      } else if (problemIngredient === 'starter') {
        scaleFactor = actual / starter;
      }

      const scaledFlour = flour * scaleFactor;
      const scaledWater = water * scaleFactor;
      const scaledSalt = salt * scaleFactor;
      const scaledStarter = starter * scaleFactor;

      setSolutions({
        fixForward: {
          flour: parseFloat(scaledFlour.toFixed(1)),
          water: parseFloat(scaledWater.toFixed(1)),
          salt: parseFloat(scaledSalt.toFixed(1)),
          starter: parseFloat(scaledStarter.toFixed(1)),
          total: parseFloat((scaledFlour + scaledWater + scaledSalt + scaledStarter).toFixed(1)),
          addFlour: 0,
          addWater: 0,
          addSalt: 0,
          addStarter: 0,
        },
        acceptChange: {
          flour: scaledFlour,
          water: scaledWater,
          salt: scaledSalt,
          starter: scaledStarter,
          total: parseFloat((scaledFlour + scaledWater + scaledSalt + scaledStarter).toFixed(1)),
          waterPercent: waterPercent,
          saltPercent: saltPercent,
          starterPercent: starterPercent,
        },
      });
    }

    setCalculated(true);
  };

  const clearAll = () => {
    setFlourOriginal('500');
    setWaterOriginal('350');
    setSaltOriginal('10');
    setStarterOriginal('100');
    setActualAmount('');
    setCalculated(false);
  };

  const getIngredientName = () => {
    const names = {
      flour: 'Flour',
      water: 'Water',
      salt: 'Salt',
      starter: 'Starter',
    };
    return names[problemIngredient];
  };

  const getOriginalAmount = () => {
    const amounts = {
      flour: flourOriginal,
      water: waterOriginal,
      salt: saltOriginal,
      starter: starterOriginal,
    };
    return amounts[problemIngredient];
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
          <Icon name="lifebuoy" size={48} color={theme.colors.error.main} />
          <Text style={styles.headerTitle}>Recipe Rescue</Text>
          <Text style={styles.headerSubtitle}>
            Fix recipe mistakes and ingredient miscalculations
          </Text>
        </View>

        <View style={styles.content}>
          {/* Original Recipe */}
          <Card variant="elevated" style={styles.card}>
            <Text style={styles.sectionTitle}>Original Recipe</Text>
            <BasicInput
              label="Flour (g)"
              value={flourOriginal}
              onChangeText={setFlourOriginal}
              keyboardType="numeric"
              placeholder="500"
            />
            <BasicInput
              label="Water (g)"
              value={waterOriginal}
              onChangeText={setWaterOriginal}
              keyboardType="numeric"
              placeholder="350"
            />
            <BasicInput
              label="Salt (g)"
              value={saltOriginal}
              onChangeText={setSaltOriginal}
              keyboardType="numeric"
              placeholder="10"
            />
            <BasicInput
              label="Starter (g)"
              value={starterOriginal}
              onChangeText={setStarterOriginal}
              keyboardType="numeric"
              placeholder="100"
            />
          </Card>

          {/* Problem Details */}
          <Card variant="elevated" style={styles.card}>
            <Text style={styles.sectionTitle}>What Went Wrong?</Text>

            <Text style={styles.label}>Which ingredient?</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={problemIngredient}
                onValueChange={(value) => setProblemIngredient(value as Ingredient)}
                style={styles.picker}
              >
                <Picker.Item label="Flour" value="flour" />
                <Picker.Item label="Water" value="water" />
                <Picker.Item label="Salt" value="salt" />
                <Picker.Item label="Starter" value="starter" />
              </Picker>
            </View>

            <Text style={styles.label}>What's the problem?</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={problemType}
                onValueChange={(value) => setProblemType(value as ProblemType)}
                style={styles.picker}
              >
                <Picker.Item label="Added too much" value="too_much" />
                <Picker.Item label="Don't have enough" value="not_enough" />
              </Picker>
            </View>

            <BasicInput
              label={`Actual ${getIngredientName()} amount (g)`}
              value={actualAmount}
              onChangeText={setActualAmount}
              keyboardType="numeric"
              placeholder={`Original: ${getOriginalAmount()}g`}
              helperText={
                problemType === 'too_much'
                  ? `You added ${actualAmount || '?'}g instead of ${getOriginalAmount()}g`
                  : `You only have ${actualAmount || '?'}g instead of ${getOriginalAmount()}g`
              }
            />
          </Card>

          {/* Actions */}
          <View style={styles.actions}>
            <Button
              title="Calculate Rescue"
              onPress={calculateRescue}
              fullWidth
              leftIcon="calculator"
            />
            <Button
              title="Clear All"
              variant="outline"
              onPress={clearAll}
              fullWidth
            />
          </View>

          {/* Solutions */}
          {calculated && (
            <>
              {problemType === 'too_much' ? (
                <>
                  {/* Solution 1: Fix Forward */}
                  <Card variant="elevated" style={[styles.card, styles.solutionCard]}>
                    <View style={styles.solutionHeader}>
                      <Icon name="plus-circle" size={28} color={theme.colors.success.main} />
                      <Text style={styles.solutionTitle}>Solution 1: Fix the Ratios</Text>
                    </View>
                    <Text style={styles.solutionDescription}>
                      Add more of the other ingredients to maintain proper percentages
                    </Text>

                    <View style={styles.divider} />

                    <Text style={styles.addMoreTitle}>Add to your dough:</Text>
                    {solutions.fixForward.addFlour > 0 && (
                      <View style={styles.addRow}>
                        <Icon name="plus" size={20} color={theme.colors.success.main} />
                        <Text style={styles.addText}>
                          {solutions.fixForward.addFlour}g more flour
                        </Text>
                      </View>
                    )}
                    {solutions.fixForward.addWater > 0 && (
                      <View style={styles.addRow}>
                        <Icon name="plus" size={20} color={theme.colors.success.main} />
                        <Text style={styles.addText}>
                          {solutions.fixForward.addWater}g more water
                        </Text>
                      </View>
                    )}
                    {solutions.fixForward.addSalt > 0 && (
                      <View style={styles.addRow}>
                        <Icon name="plus" size={20} color={theme.colors.success.main} />
                        <Text style={styles.addText}>
                          {solutions.fixForward.addSalt}g more salt
                        </Text>
                      </View>
                    )}
                    {solutions.fixForward.addStarter > 0 && (
                      <View style={styles.addRow}>
                        <Icon name="plus" size={20} color={theme.colors.success.main} />
                        <Text style={styles.addText}>
                          {solutions.fixForward.addStarter}g more starter
                        </Text>
                      </View>
                    )}

                    <View style={styles.divider} />

                    <Text style={styles.finalLabel}>Final recipe:</Text>
                    <View style={styles.resultRow}>
                      <Text style={styles.resultIngredient}>Flour:</Text>
                      <Text style={styles.resultAmount}>{solutions.fixForward.flour}g</Text>
                    </View>
                    <View style={styles.resultRow}>
                      <Text style={styles.resultIngredient}>Water:</Text>
                      <Text style={styles.resultAmount}>{solutions.fixForward.water}g</Text>
                    </View>
                    <View style={styles.resultRow}>
                      <Text style={styles.resultIngredient}>Salt:</Text>
                      <Text style={styles.resultAmount}>{solutions.fixForward.salt}g</Text>
                    </View>
                    <View style={styles.resultRow}>
                      <Text style={styles.resultIngredient}>Starter:</Text>
                      <Text style={styles.resultAmount}>{solutions.fixForward.starter}g</Text>
                    </View>
                    <View style={[styles.resultRow, styles.totalRow]}>
                      <Text style={styles.totalLabel}>Total Dough:</Text>
                      <Text style={styles.totalAmount}>{solutions.fixForward.total}g</Text>
                    </View>
                  </Card>

                  {/* Solution 2: Accept Change */}
                  <Card variant="outlined" style={styles.card}>
                    <View style={styles.solutionHeader}>
                      <Icon name="alert-circle" size={28} color={theme.colors.warning.main} />
                      <Text style={styles.solutionTitle}>Solution 2: Accept the Change</Text>
                    </View>
                    <Text style={styles.solutionDescription}>
                      Keep other ingredients as-is, but ratios will be different
                    </Text>

                    <View style={styles.divider} />

                    <View style={styles.resultRow}>
                      <Text style={styles.resultIngredient}>Flour:</Text>
                      <Text style={styles.resultAmount}>{solutions.acceptChange.flour}g</Text>
                    </View>
                    <View style={styles.resultRow}>
                      <Text style={styles.resultIngredient}>Water:</Text>
                      <Text style={styles.resultAmount}>
                        {solutions.acceptChange.water}g ({solutions.acceptChange.waterPercent}%)
                      </Text>
                    </View>
                    <View style={styles.resultRow}>
                      <Text style={styles.resultIngredient}>Salt:</Text>
                      <Text style={styles.resultAmount}>
                        {solutions.acceptChange.salt}g ({solutions.acceptChange.saltPercent}%)
                      </Text>
                    </View>
                    <View style={styles.resultRow}>
                      <Text style={styles.resultIngredient}>Starter:</Text>
                      <Text style={styles.resultAmount}>
                        {solutions.acceptChange.starter}g ({solutions.acceptChange.starterPercent}%)
                      </Text>
                    </View>
                    <View style={[styles.resultRow, styles.totalRow]}>
                      <Text style={styles.totalLabel}>Total Dough:</Text>
                      <Text style={styles.totalAmount}>{solutions.acceptChange.total}g</Text>
                    </View>

                    <View style={styles.warningBox}>
                      <Icon name="information" size={16} color={theme.colors.warning.dark} />
                      <Text style={styles.warningText}>
                        Note: Dough characteristics may be different from your original recipe
                      </Text>
                    </View>
                  </Card>
                </>
              ) : (
                // Not enough ingredient - scale down
                <Card variant="elevated" style={[styles.card, styles.solutionCard]}>
                  <View style={styles.solutionHeader}>
                    <Icon name="arrow-collapse-down" size={28} color={theme.colors.info.main} />
                    <Text style={styles.solutionTitle}>Scaled Down Recipe</Text>
                  </View>
                  <Text style={styles.solutionDescription}>
                    All ingredients scaled proportionally to match what you have
                  </Text>

                  <View style={styles.divider} />

                  <View style={styles.resultRow}>
                    <Text style={styles.resultIngredient}>Flour:</Text>
                    <Text style={styles.resultAmount}>{solutions.fixForward.flour}g</Text>
                  </View>
                  <View style={styles.resultRow}>
                    <Text style={styles.resultIngredient}>Water:</Text>
                    <Text style={styles.resultAmount}>{solutions.fixForward.water}g</Text>
                  </View>
                  <View style={styles.resultRow}>
                    <Text style={styles.resultIngredient}>Salt:</Text>
                    <Text style={styles.resultAmount}>{solutions.fixForward.salt}g</Text>
                  </View>
                  <View style={styles.resultRow}>
                    <Text style={styles.resultIngredient}>Starter:</Text>
                    <Text style={styles.resultAmount}>{solutions.fixForward.starter}g</Text>
                  </View>
                  <View style={[styles.resultRow, styles.totalRow]}>
                    <Text style={styles.totalLabel}>Total Dough:</Text>
                    <Text style={styles.totalAmount}>{solutions.fixForward.total}g</Text>
                  </View>

                  <View style={styles.infoBox}>
                    <Icon name="check-circle" size={16} color={theme.colors.success.dark} />
                    <Text style={styles.infoText}>
                      Ratios maintained - smaller batch, same quality
                    </Text>
                  </View>
                </Card>
              )}
            </>
          )}

          {/* Info Card */}
          <Card variant="filled" style={styles.card}>
            <Text style={styles.infoTitle}>How to Use</Text>
            <Text style={styles.infoDescription}>
              <Text style={styles.bold}>1. Enter your original recipe{'\n'}</Text>
              <Text style={styles.bold}>2. Select which ingredient went wrong{'\n'}</Text>
              <Text style={styles.bold}>3. Choose the problem type{'\n'}</Text>
              <Text style={styles.bold}>4. Enter the actual amount{'\n'}</Text>
              <Text style={styles.bold}>5. Get rescue solutions!{'\n\n'}</Text>
              Common scenarios:{'\n'}
              • Added 400g water instead of 350g{'\n'}
              • Only have 80g starter instead of 100g{'\n'}
              • Accidentally used 600g flour instead of 500g
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
    marginBottom: theme.spacing.md,
  },
  label: {
    fontSize: theme.typography.sizes.sm,
    fontWeight: theme.typography.weights.medium as any,
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing.xs,
    marginTop: theme.spacing.sm,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: theme.colors.border.default,
    borderRadius: theme.borderRadius.md,
    backgroundColor: theme.colors.white,
    marginBottom: theme.spacing.sm,
  },
  picker: {
    height: 50,
  },
  actions: {
    marginBottom: theme.spacing.md,
  },
  solutionCard: {
    backgroundColor: theme.colors.success.light + '10',
    borderWidth: 2,
    borderColor: theme.colors.success.light,
  },
  solutionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  solutionTitle: {
    fontSize: theme.typography.sizes.xl,
    fontWeight: theme.typography.weights.bold as any,
    color: theme.colors.text.primary,
    marginLeft: theme.spacing.sm,
    flex: 1,
  },
  solutionDescription: {
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing.md,
  },
  divider: {
    height: 1,
    backgroundColor: theme.colors.border.light,
    marginVertical: theme.spacing.md,
  },
  addMoreTitle: {
    fontSize: theme.typography.sizes.base,
    fontWeight: theme.typography.weights.semibold as any,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.sm,
  },
  addRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: theme.spacing.xs,
    gap: theme.spacing.sm,
  },
  addText: {
    fontSize: theme.typography.sizes.base,
    color: theme.colors.success.dark,
    fontWeight: theme.typography.weights.medium as any,
  },
  finalLabel: {
    fontSize: theme.typography.sizes.base,
    fontWeight: theme.typography.weights.semibold as any,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.sm,
  },
  resultRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: theme.spacing.xs,
  },
  resultIngredient: {
    fontSize: theme.typography.sizes.base,
    color: theme.colors.text.secondary,
  },
  resultAmount: {
    fontSize: theme.typography.sizes.base,
    fontWeight: theme.typography.weights.semibold as any,
    color: theme.colors.text.primary,
  },
  totalRow: {
    marginTop: theme.spacing.sm,
    paddingTop: theme.spacing.sm,
    borderTopWidth: 2,
    borderTopColor: theme.colors.border.default,
  },
  totalLabel: {
    fontSize: theme.typography.sizes.lg,
    fontWeight: theme.typography.weights.bold as any,
    color: theme.colors.text.primary,
  },
  totalAmount: {
    fontSize: theme.typography.sizes.lg,
    fontWeight: theme.typography.weights.bold as any,
    color: theme.colors.success.dark,
  },
  warningBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: theme.colors.warning.light + '30',
    padding: theme.spacing.sm,
    borderRadius: theme.borderRadius.sm,
    marginTop: theme.spacing.md,
    gap: theme.spacing.xs,
  },
  warningText: {
    flex: 1,
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.warning.dark,
  },
  infoBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: theme.colors.success.light + '30',
    padding: theme.spacing.sm,
    borderRadius: theme.borderRadius.sm,
    marginTop: theme.spacing.md,
    gap: theme.spacing.xs,
  },
  infoText: {
    flex: 1,
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.success.dark,
  },
  infoTitle: {
    fontSize: theme.typography.sizes.base,
    fontWeight: theme.typography.weights.semibold as any,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.sm,
  },
  infoDescription: {
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.text.secondary,
    lineHeight: 20,
  },
  bold: {
    fontWeight: theme.typography.weights.semibold as any,
    color: theme.colors.text.primary,
  },
});
