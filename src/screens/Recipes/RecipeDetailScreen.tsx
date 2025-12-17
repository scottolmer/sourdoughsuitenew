/**
 * Recipe Detail Screen
 * View full recipe details
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  TouchableOpacity,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useQuery } from '@tanstack/react-query';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Button from '../../components/Button';
import Card from '../../components/Card';
import { theme } from '../../theme';
import { Recipe, Starter } from '../../types';
import { RecipesStackParamList } from '../../navigation/types';
import { getRecipeById, deleteRecipe } from '../../services/recipeStorage';
import { starterStorage } from '../../services/starterStorage';
import { QUERY_KEYS } from '../../constants';
import {
  getStarterTypeName,
  getHealthStatusDescription,
  getNextFeedingText,
  isFeedingOverdue,
} from '../../utils/starterHealth';

type Props = NativeStackScreenProps<RecipesStackParamList, 'RecipeDetail'>;

export default function RecipeDetailScreen({ route, navigation }: Props) {
  const { recipeId } = route.params;
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch the starter if one is linked to this recipe
  const { data: starter } = useQuery({
    queryKey: [QUERY_KEYS.STARTERS, recipe?.starterUsedId],
    queryFn: () =>
      recipe?.starterUsedId ? starterStorage.getById(recipe.starterUsedId) : null,
    enabled: !!recipe?.starterUsedId,
  });

  useEffect(() => {
    loadRecipe();
  }, [recipeId]);

  const loadRecipe = async () => {
    try {
      const loadedRecipe = await getRecipeById(recipeId);
      setRecipe(loadedRecipe);
    } catch (error) {
      console.error('Error loading recipe:', error);
      Alert.alert('Error', 'Could not load recipe');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    if (recipe) {
      navigation.navigate('EditRecipe', { recipeId: recipe.id });
    }
  };

  const handleDelete = () => {
    Alert.alert(
      'Delete Recipe',
      'Are you sure you want to delete this recipe? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteRecipe(recipeId);
              navigation.goBack();
            } catch (error) {
              Alert.alert('Error', 'Could not delete recipe');
            }
          },
        },
      ]
    );
  };

  const handleUseInCalculator = () => {
    // TODO: Navigate to Baker's Calculator with pre-filled values
    Alert.alert(
      'Coming Soon',
      'Calculator integration will be added in the next step!'
    );
  };

  if (loading || !recipe) {
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
        <View style={styles.header}>
          <Text style={styles.recipeName}>{recipe.name}</Text>
          {recipe.description && (
            <Text style={styles.recipeDescription}>{recipe.description}</Text>
          )}
        </View>

        {/* Starter Info Card */}
        {starter && (
          <Card style={styles.card}>
            <View style={styles.starterHeader}>
              <Text style={styles.sectionTitle}>Starter Used</Text>
              <TouchableOpacity
                style={styles.viewStarterButton}
                onPress={() => {
                  // Navigate to starter detail
                  (navigation as any).navigate('StartersTab', {
                    screen: 'StartersList',
                    params: { starterId: starter.id },
                  });
                }}
              >
                <Text style={styles.viewStarterText}>View Details</Text>
                <Icon name="arrow-right" size={16} color={theme.colors.primary[600]} />
              </TouchableOpacity>
            </View>

            <View style={styles.starterInfo}>
              <View style={styles.starterMainInfo}>
                <Icon name="bacteria" size={32} color={theme.colors.primary[600]} />
                <View style={styles.starterDetails}>
                  <Text style={styles.starterName}>{starter.name}</Text>
                  <Text style={styles.starterType}>
                    {getStarterTypeName(starter.type)} • {starter.flourType}
                  </Text>
                </View>
              </View>

              {starter.healthStatus && (
                <View style={styles.starterMetrics}>
                  <View style={styles.metricRow}>
                    <Icon
                      name="heart-pulse"
                      size={16}
                      color={theme.colors.text.secondary}
                    />
                    <Text style={styles.metricLabel}>Health:</Text>
                    <Text style={styles.metricValue}>
                      {getHealthStatusDescription(starter.healthStatus)}
                    </Text>
                  </View>
                  {starter.nextFeedingDue && (
                    <View style={styles.metricRow}>
                      <Icon
                        name={
                          isFeedingOverdue(starter.nextFeedingDue)
                            ? 'alert-circle'
                            : 'clock-outline'
                        }
                        size={16}
                        color={
                          isFeedingOverdue(starter.nextFeedingDue)
                            ? theme.colors.error.main
                            : theme.colors.text.secondary
                        }
                      />
                      <Text style={styles.metricLabel}>Next Feeding:</Text>
                      <Text
                        style={[
                          styles.metricValue,
                          isFeedingOverdue(starter.nextFeedingDue) && {
                            color: theme.colors.error.main,
                            fontWeight: '600',
                          },
                        ]}
                      >
                        {getNextFeedingText(starter.nextFeedingDue)}
                      </Text>
                    </View>
                  )}
                  {starter.lastFed && (
                    <View style={styles.metricRow}>
                      <Icon
                        name="calendar-check"
                        size={16}
                        color={theme.colors.text.secondary}
                      />
                      <Text style={styles.metricLabel}>Last Fed:</Text>
                      <Text style={styles.metricValue}>
                        {new Date(starter.lastFed).toLocaleString()}
                      </Text>
                    </View>
                  )}
                </View>
              )}
            </View>
          </Card>
        )}

        {/* Stats Card */}
        <Card style={styles.card}>
          <Text style={styles.sectionTitle}>Recipe Stats</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statBox}>
              <Icon
                name="water-percent"
                size={24}
                color={theme.colors.primary[500]}
              />
              <Text style={styles.statValue}>{recipe.hydration}%</Text>
              <Text style={styles.statLabel}>Hydration</Text>
            </View>
            <View style={styles.statBox}>
              <Icon name="weight" size={24} color={theme.colors.primary[500]} />
              <Text style={styles.statValue}>{recipe.totalWeight}g</Text>
              <Text style={styles.statLabel}>Total Weight</Text>
            </View>
            {recipe.yieldAmount && (
              <View style={styles.statBox}>
                <Icon
                  name="bread-slice"
                  size={24}
                  color={theme.colors.primary[500]}
                />
                <Text style={styles.statValue}>{recipe.yieldAmount}</Text>
                <Text style={styles.statLabel}>Yield</Text>
              </View>
            )}
          </View>
        </Card>

        {/* Formula Card */}
        <Card style={styles.card}>
          <Text style={styles.sectionTitle}>Baker's Formula</Text>
          <View style={styles.formulaTable}>
            <View style={styles.formulaRow}>
              <Text style={styles.formulaIngredient}>Flour (base)</Text>
              <Text style={styles.formulaAmount}>{recipe.formula.flour}g</Text>
              <Text style={styles.formulaPercentage}>100%</Text>
            </View>
            <View style={styles.formulaRow}>
              <Text style={styles.formulaIngredient}>Water</Text>
              <Text style={styles.formulaAmount}>
                {Math.round((recipe.formula.flour * recipe.formula.water) / 100)}g
              </Text>
              <Text style={styles.formulaPercentage}>
                {recipe.formula.water}%
              </Text>
            </View>
            <View style={styles.formulaRow}>
              <Text style={styles.formulaIngredient}>Salt</Text>
              <Text style={styles.formulaAmount}>
                {Math.round((recipe.formula.flour * recipe.formula.salt) / 100)}g
              </Text>
              <Text style={styles.formulaPercentage}>
                {recipe.formula.salt}%
              </Text>
            </View>
            <View style={styles.formulaRow}>
              <Text style={styles.formulaIngredient}>Starter</Text>
              <Text style={styles.formulaAmount}>
                {Math.round((recipe.formula.flour * recipe.formula.starter) / 100)}g
              </Text>
              <Text style={styles.formulaPercentage}>
                {recipe.formula.starter}%
              </Text>
            </View>
          </View>
        </Card>

        {/* Additional Ingredients Card */}
        {recipe.additionalIngredients && recipe.additionalIngredients.length > 0 && (
          <Card style={styles.card}>
            <Text style={styles.sectionTitle}>Additional Ingredients</Text>
            <View style={styles.ingredientsList}>
              {recipe.additionalIngredients.map((ingredient) => (
                <View key={ingredient.id} style={styles.ingredientItem}>
                  <View style={styles.ingredientInfo}>
                    <Text style={styles.ingredientName}>{ingredient.name}</Text>
                    <Text style={styles.ingredientDetails}>
                      {ingredient.amount}{ingredient.unit}
                      {ingredient.type && ` • ${ingredient.type}`}
                    </Text>
                  </View>
                  <Icon name="check-circle" size={20} color={theme.colors.success.main} />
                </View>
              ))}
            </View>
          </Card>
        )}

        {/* Timing Card */}
        {recipe.timing && (
          <Card style={styles.card}>
            <Text style={styles.sectionTitle}>Timing</Text>
            <View style={styles.timingGrid}>
              {recipe.timing.bulk && (
                <View style={styles.timingItem}>
                  <Icon
                    name="clock-outline"
                    size={20}
                    color={theme.colors.primary[500]}
                  />
                  <Text style={styles.timingLabel}>Bulk Fermentation</Text>
                  <Text style={styles.timingValue}>
                    {Math.floor(recipe.timing.bulk / 60)}h {recipe.timing.bulk % 60}m
                  </Text>
                </View>
              )}
              {recipe.timing.proof && (
                <View style={styles.timingItem}>
                  <Icon
                    name="clock-outline"
                    size={20}
                    color={theme.colors.primary[500]}
                  />
                  <Text style={styles.timingLabel}>Final Proof</Text>
                  <Text style={styles.timingValue}>
                    {Math.floor(recipe.timing.proof / 60)}h {recipe.timing.proof % 60}m
                  </Text>
                </View>
              )}
              {recipe.timing.bake && (
                <View style={styles.timingItem}>
                  <Icon
                    name="fire"
                    size={20}
                    color={theme.colors.primary[500]}
                  />
                  <Text style={styles.timingLabel}>Bake Time</Text>
                  <Text style={styles.timingValue}>{recipe.timing.bake}m</Text>
                </View>
              )}
            </View>
          </Card>
        )}

        {/* Instructions Card */}
        <Card style={styles.card}>
          <Text style={styles.sectionTitle}>Instructions</Text>
          <Text style={styles.instructions}>{recipe.instructions}</Text>
        </Card>

        {/* Notes Card */}
        {recipe.notes && (
          <Card style={styles.card}>
            <Text style={styles.sectionTitle}>Notes</Text>
            <Text style={styles.notes}>{recipe.notes}</Text>
          </Card>
        )}

        {/* Action Buttons */}
        <View style={styles.actions}>
          <Button
            title="Use in Calculator"
            onPress={handleUseInCalculator}
            style={styles.actionButton}
          />
          <Button
            title="Edit"
            onPress={handleEdit}
            variant="outline"
            style={styles.actionButton}
          />
          <TouchableOpacity
            onPress={handleDelete}
            style={styles.deleteButton}
            activeOpacity={0.7}
          >
            <Icon name="delete-outline" size={20} color={theme.colors.error[500]} />
            <Text style={styles.deleteText}>Delete Recipe</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
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
  header: {
    padding: theme.spacing.xl,
    backgroundColor: theme.colors.white,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border.light,
  },
  recipeName: {
    fontSize: theme.typography.sizes['2xl'],
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.sm,
  },
  recipeDescription: {
    fontSize: theme.typography.sizes.base,
    color: theme.colors.text.secondary,
    lineHeight: 24,
  },
  card: {
    margin: theme.spacing.xl,
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.md,
  },
  sectionTitle: {
    fontSize: theme.typography.sizes.lg,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.md,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statBox: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: theme.typography.sizes.xl,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.text.primary,
    marginTop: theme.spacing.sm,
  },
  statLabel: {
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.text.secondary,
    marginTop: theme.spacing.xs,
  },
  formulaTable: {
    gap: theme.spacing.sm,
  },
  formulaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: theme.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border.light,
  },
  formulaIngredient: {
    flex: 2,
    fontSize: theme.typography.sizes.base,
    color: theme.colors.text.primary,
  },
  formulaAmount: {
    flex: 1,
    fontSize: theme.typography.sizes.base,
    color: theme.colors.text.secondary,
    textAlign: 'right',
  },
  formulaPercentage: {
    flex: 1,
    fontSize: theme.typography.sizes.base,
    fontWeight: theme.typography.weights.semibold,
    color: theme.colors.primary[500],
    textAlign: 'right',
  },
  timingGrid: {
    gap: theme.spacing.md,
  },
  timingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
  timingLabel: {
    flex: 1,
    fontSize: theme.typography.sizes.base,
    color: theme.colors.text.primary,
  },
  timingValue: {
    fontSize: theme.typography.sizes.base,
    fontWeight: theme.typography.weights.semibold,
    color: theme.colors.text.primary,
  },
  instructions: {
    fontSize: theme.typography.sizes.base,
    color: theme.colors.text.primary,
    lineHeight: 24,
  },
  notes: {
    fontSize: theme.typography.sizes.base,
    color: theme.colors.text.secondary,
    lineHeight: 24,
    fontStyle: 'italic',
  },
  actions: {
    padding: theme.spacing.xl,
    gap: theme.spacing.md,
  },
  actionButton: {
    width: '100%',
  },
  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing.md,
    gap: theme.spacing.sm,
  },
  deleteText: {
    fontSize: theme.typography.sizes.base,
    color: theme.colors.error[500],
    fontWeight: theme.typography.weights.semibold,
  },
  starterHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  viewStarterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  viewStarterText: {
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.primary[600],
    fontWeight: theme.typography.weights.semibold as any,
  },
  starterInfo: {
    gap: theme.spacing.md,
  },
  starterMainInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.md,
  },
  starterDetails: {
    flex: 1,
  },
  starterName: {
    fontSize: theme.typography.sizes.lg,
    fontWeight: theme.typography.weights.semibold as any,
    color: theme.colors.text.primary,
    marginBottom: 2,
  },
  starterType: {
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.text.secondary,
  },
  starterMetrics: {
    gap: theme.spacing.sm,
    marginTop: theme.spacing.sm,
    paddingTop: theme.spacing.sm,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border.light,
  },
  metricRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xs,
  },
  metricLabel: {
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.text.secondary,
    marginLeft: theme.spacing.xs,
  },
  metricValue: {
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.text.primary,
    fontWeight: theme.typography.weights.medium as any,
  },
  ingredientsList: {
    gap: theme.spacing.sm,
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
  ingredientDetails: {
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.text.secondary,
  },
});
