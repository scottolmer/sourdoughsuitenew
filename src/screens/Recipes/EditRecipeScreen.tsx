/**
 * Edit Recipe Screen
 * Edit an existing recipe
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useQuery } from '@tanstack/react-query';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Button from '../../components/Button';
import Input from '../../components/Input';
import Picker, { PickerOption } from '../../components/Picker';
import AddIngredientModal from '../../components/AddIngredientModal';
import Card from '../../components/Card';
import { theme } from '../../theme';
import { RecipesStackParamList } from '../../navigation/types';
import { RecipeIngredient } from '../../types';
import { getRecipeById, updateRecipe } from '../../services/recipeStorage';
import { starterStorage } from '../../services/starterStorage';
import { QUERY_KEYS } from '../../constants';

type Props = NativeStackScreenProps<RecipesStackParamList, 'EditRecipe'>;

export default function EditRecipeScreen({ route, navigation }: Props) {
  const { recipeId } = route.params;
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [starterUsedId, setStarterUsedId] = useState<number | undefined>(undefined);
  const [flour, setFlour] = useState('');
  const [water, setWater] = useState('');
  const [salt, setSalt] = useState('');
  const [starter, setStarter] = useState('');
  const [yieldAmount, setYieldAmount] = useState('');
  const [instructions, setInstructions] = useState('');
  const [notes, setNotes] = useState('');
  const [additionalIngredients, setAdditionalIngredients] = useState<RecipeIngredient[]>([]);
  const [showIngredientModal, setShowIngredientModal] = useState(false);
  const [saving, setSaving] = useState(false);

  // Fetch all starters for the picker
  const { data: starters = [] } = useQuery({
    queryKey: [QUERY_KEYS.STARTERS],
    queryFn: () => starterStorage.getAll(),
  });

  // Build starter options for picker
  const starterOptions: PickerOption[] = [
    { label: 'None (No specific starter)', value: 'none', description: 'Not tracking a specific starter' },
    ...starters
      .filter(s => s.isActive)
      .map(s => ({
        label: s.name,
        value: s.id.toString(),
        description: `${s.type} • ${s.flourType}`,
      })),
  ];

  useEffect(() => {
    loadRecipe();
  }, [recipeId]);

  const loadRecipe = async () => {
    try {
      const recipe = await getRecipeById(recipeId);
      if (recipe) {
        setName(recipe.name);
        setDescription(recipe.description || '');
        setStarterUsedId(recipe.starterUsedId);
        setFlour(recipe.formula.flour.toString());
        setWater(recipe.formula.water.toString());
        setSalt(recipe.formula.salt.toString());
        setStarter(recipe.formula.starter.toString());
        setYieldAmount(recipe.yieldAmount || '');
        setInstructions(recipe.instructions);
        setNotes(recipe.notes || '');
        setAdditionalIngredients(recipe.additionalIngredients || []);
      } else {
        Alert.alert('Error', 'Recipe not found', [
          { text: 'OK', onPress: () => navigation.goBack() },
        ]);
      }
    } catch (error) {
      console.error('Error loading recipe:', error);
      Alert.alert('Error', 'Could not load recipe');
    } finally {
      setLoading(false);
    }
  };

  const calculateHydration = () => {
    const waterPercent = parseFloat(water) || 0;
    return waterPercent;
  };

  const calculateTotalWeight = () => {
    const flourGrams = parseFloat(flour) || 0;
    const waterPercent = parseFloat(water) || 0;
    const saltPercent = parseFloat(salt) || 0;
    const starterPercent = parseFloat(starter) || 0;

    const waterGrams = (flourGrams * waterPercent) / 100;
    const saltGrams = (flourGrams * saltPercent) / 100;
    const starterGrams = (flourGrams * starterPercent) / 100;

    // Add additional ingredients
    const additionalWeight = additionalIngredients.reduce((sum, ing) => {
      if (ing.unit === '%') {
        return sum + (flourGrams * ing.amount) / 100;
      }
      return sum + ing.amount;
    }, 0);

    return Math.round(flourGrams + waterGrams + saltGrams + starterGrams + additionalWeight);
  };

  const handleAddIngredient = (ingredient: RecipeIngredient) => {
    setAdditionalIngredients([...additionalIngredients, ingredient]);
  };

  const handleRemoveIngredient = (id: string) => {
    setAdditionalIngredients(additionalIngredients.filter(ing => ing.id !== id));
  };

  const handleSave = async () => {
    if (!name.trim()) {
      Alert.alert('Error', 'Please enter a recipe name');
      return;
    }

    if (!flour || parseFloat(flour) <= 0) {
      Alert.alert('Error', 'Please enter a valid flour amount');
      return;
    }

    if (!instructions.trim()) {
      Alert.alert('Error', 'Please enter instructions');
      return;
    }

    setSaving(true);
    try {
      await updateRecipe(recipeId, {
        name: name.trim(),
        description: description.trim() || undefined,
        starterUsedId,
        formula: {
          flour: parseFloat(flour),
          water: parseFloat(water) || 0,
          salt: parseFloat(salt) || 0,
          starter: parseFloat(starter) || 0,
        },
        additionalIngredients: additionalIngredients.length > 0 ? additionalIngredients : undefined,
        hydration: calculateHydration(),
        totalWeight: calculateTotalWeight(),
        instructions: instructions.trim(),
        yieldAmount: yieldAmount.trim() || undefined,
        notes: notes.trim() || undefined,
      });

      Alert.alert('Success', 'Recipe updated successfully', [
        {
          text: 'OK',
          onPress: () => navigation.goBack(),
        },
      ]);
    } catch (error) {
      console.error('Error updating recipe:', error);
      Alert.alert('Error', 'Could not update recipe');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text>Loading...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView>
        <View style={styles.content}>
          <Card style={styles.section}>
            <Text style={styles.sectionTitle}>Basic Info</Text>
            <Input
              label="Recipe Name"
              value={name}
              onChangeText={setName}
              placeholder="e.g., Country Loaf, Baguette"
              required
            />
            <Input
              label="Description"
              value={description}
              onChangeText={setDescription}
              placeholder="Brief description of the recipe"
              multiline
              numberOfLines={2}
            />
            <Picker
              label="Starter Used (Optional)"
              value={starterUsedId?.toString() || 'none'}
              options={starterOptions}
              onValueChange={(value) =>
                setStarterUsedId(value === 'none' ? undefined : parseInt(value, 10))
              }
              helperText="Track which starter you'll use for this recipe"
            />
            <Input
              label="Yield"
              value={yieldAmount}
              onChangeText={setYieldAmount}
              placeholder="e.g., 2 loaves, 1 boule"
            />
          </Card>

          <Card style={styles.section}>
            <Text style={styles.sectionTitle}>Baker's Formula</Text>
            <Text style={styles.helperText}>
              Enter flour in grams, other ingredients as percentages
            </Text>
            <Input
              label="Flour (grams)"
              value={flour}
              onChangeText={setFlour}
              keyboardType="numeric"
              placeholder="500"
              required
            />
            <Input
              label="Water (%)"
              value={water}
              onChangeText={setWater}
              keyboardType="numeric"
              placeholder="75"
              required
            />
            <Input
              label="Salt (%)"
              value={salt}
              onChangeText={setSalt}
              keyboardType="numeric"
              placeholder="2"
              required
            />
            <Input
              label="Starter (%)"
              value={starter}
              onChangeText={setStarter}
              keyboardType="numeric"
              placeholder="20"
              required
            />

            <View style={styles.calculatedValues}>
              <View style={styles.calcRow}>
                <Text style={styles.calcLabel}>Hydration:</Text>
                <Text style={styles.calcValue}>{calculateHydration()}%</Text>
              </View>
              <View style={styles.calcRow}>
                <Text style={styles.calcLabel}>Total Weight:</Text>
                <Text style={styles.calcValue}>{calculateTotalWeight()}g</Text>
              </View>
            </View>
          </Card>

          {/* Additional Ingredients Section */}
          <Card style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Additional Ingredients</Text>
              <Button
                title="Add"
                size="small"
                variant="outline"
                leftIcon="plus"
                onPress={() => setShowIngredientModal(true)}
              />
            </View>
            <Text style={styles.helperText}>
              Add seeds, nuts, oils, sweeteners, or other inclusions
            </Text>

            {additionalIngredients.length > 0 ? (
              <View style={styles.ingredientsList}>
                {additionalIngredients.map((ingredient) => (
                  <View key={ingredient.id} style={styles.ingredientItem}>
                    <View style={styles.ingredientInfo}>
                      <Text style={styles.ingredientName}>{ingredient.name}</Text>
                      <Text style={styles.ingredientAmount}>
                        {ingredient.amount}{ingredient.unit}
                        {ingredient.type && ` • ${ingredient.type}`}
                      </Text>
                    </View>
                    <TouchableOpacity
                      onPress={() => handleRemoveIngredient(ingredient.id)}
                      style={styles.removeButton}
                    >
                      <Icon name="close-circle" size={24} color={theme.colors.error.main} />
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            ) : (
              <View style={styles.emptyIngredients}>
                <Icon name="seed-outline" size={48} color={theme.colors.text.disabled} />
                <Text style={styles.emptyText}>No additional ingredients</Text>
                <Text style={styles.emptySubtext}>
                  Tap "Add" to include extras like seeds or oils
                </Text>
              </View>
            )}
          </Card>

          <Card style={styles.section}>
            <Text style={styles.sectionTitle}>Instructions</Text>
            <TextInput
              style={styles.textArea}
              value={instructions}
              onChangeText={setInstructions}
              placeholder="Enter step-by-step instructions..."
              multiline
              numberOfLines={8}
              textAlignVertical="top"
            />
          </Card>

          <Card style={styles.section}>
            <Text style={styles.sectionTitle}>Notes (Optional)</Text>
            <TextInput
              style={styles.textArea}
              value={notes}
              onChangeText={setNotes}
              placeholder="Any additional notes or tips..."
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
          </Card>

          <View style={styles.actions}>
            <Button
              title={saving ? 'Saving...' : 'Save Changes'}
              onPress={handleSave}
              disabled={saving}
            />
            <Button
              title="Cancel"
              onPress={() => navigation.goBack()}
              variant="outline"
            />
          </View>
        </View>
      </ScrollView>

      <AddIngredientModal
        visible={showIngredientModal}
        onClose={() => setShowIngredientModal(false)}
        onAdd={handleAddIngredient}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background.paper,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    padding: theme.spacing.xl,
  },
  section: {
    marginBottom: theme.spacing.md,
  },
  sectionTitle: {
    fontSize: theme.typography.sizes.lg,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.md,
  },
  helperText: {
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing.md,
    fontStyle: 'italic',
  },
  textArea: {
    backgroundColor: theme.colors.white,
    borderWidth: 1,
    borderColor: theme.colors.border.medium,
    borderRadius: theme.spacing.sm,
    padding: theme.spacing.md,
    fontSize: theme.typography.sizes.base,
    color: theme.colors.text.primary,
    minHeight: 120,
  },
  calculatedValues: {
    backgroundColor: theme.colors.background.paper,
    padding: theme.spacing.md,
    borderRadius: theme.spacing.sm,
    marginTop: theme.spacing.md,
  },
  calcRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: theme.spacing.xs,
  },
  calcLabel: {
    fontSize: theme.typography.sizes.base,
    color: theme.colors.text.secondary,
  },
  calcValue: {
    fontSize: theme.typography.sizes.base,
    fontWeight: theme.typography.weights.semibold,
    color: theme.colors.primary[500],
  },
  actions: {
    gap: theme.spacing.md,
    marginTop: theme.spacing.md,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  ingredientsList: {
    gap: theme.spacing.sm,
    marginTop: theme.spacing.md,
  },
  ingredientItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: theme.spacing.md,
    backgroundColor: theme.colors.background.paper,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.border.light,
  },
  ingredientInfo: {
    flex: 1,
  },
  ingredientName: {
    fontSize: theme.typography.sizes.base,
    fontWeight: theme.typography.weights.semibold,
    color: theme.colors.text.primary,
    marginBottom: 2,
  },
  ingredientAmount: {
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.text.secondary,
  },
  removeButton: {
    padding: theme.spacing.xs,
  },
  emptyIngredients: {
    alignItems: 'center',
    padding: theme.spacing.xl,
  },
  emptyText: {
    fontSize: theme.typography.sizes.base,
    fontWeight: theme.typography.weights.medium,
    color: theme.colors.text.secondary,
    marginTop: theme.spacing.md,
  },
  emptySubtext: {
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.text.disabled,
    marginTop: theme.spacing.xs,
    textAlign: 'center',
  },
});
