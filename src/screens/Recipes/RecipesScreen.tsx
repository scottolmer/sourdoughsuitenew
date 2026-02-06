/**
 * Recipes Screen
 * Browse and manage recipes
 */

import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useQuery } from '@tanstack/react-query';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Button from '../../components/Button';
import Card from '../../components/Card';
import FloatingActionButton from '../../components/FloatingActionButton';
import { theme } from '../../theme';
import { Recipe } from '../../types';
import { RecipesStackParamList } from '../../navigation/types';
import { getAllRecipes } from '../../services/recipeStorage';
import { starterStorage } from '../../services/starterStorage';
import { QUERY_KEYS } from '../../constants';

type NavigationProp = NativeStackNavigationProp<RecipesStackParamList>;

export default function RecipesScreen() {
  const navigation = useNavigation<NavigationProp>();
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Fetch all starters to show which starter is used in each recipe
  const { data: starters = [] } = useQuery({
    queryKey: [QUERY_KEYS.STARTERS],
    queryFn: () => starterStorage.getAll(),
  });

  const loadRecipes = async () => {
    try {
      const loadedRecipes = await getAllRecipes();
      setRecipes(loadedRecipes);
    } catch (error) {
      console.error('Error loading recipes:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadRecipes();
    }, [])
  );

  const onRefresh = () => {
    setRefreshing(true);
    loadRecipes();
  };

  const getStarterName = (starterId?: number) => {
    if (!starterId) return null;
    const starter = starters.find(s => s.id === starterId);
    return starter?.name;
  };

  const handleAddRecipe = () => {
    navigation.navigate('AddRecipe');
  };

  const handleRecipePress = (recipeId: string) => {
    navigation.navigate('RecipeDetail', { recipeId });
  };

  const renderRecipeCard = (recipe: Recipe) => {
    const starterName = getStarterName(recipe.starterUsedId);

    return (
      <TouchableOpacity
        key={recipe.id}
        onPress={() => handleRecipePress(recipe.id)}
        activeOpacity={0.7}
      >
        <Card style={styles.recipeCard}>
          <View style={styles.recipeHeader}>
            <View style={styles.recipeInfo}>
              <View style={styles.recipeNameRow}>
                <Text style={styles.recipeName}>{recipe.name}</Text>
                {starterName && (
                  <View style={styles.starterBadge}>
                    <Icon name="bacteria" size={12} color={theme.colors.primary[600]} />
                    <Text style={styles.starterBadgeText}>{starterName}</Text>
                  </View>
                )}
              </View>
              {recipe.description && (
                <Text style={styles.recipeDescription} numberOfLines={2}>
                  {recipe.description}
                </Text>
              )}
            </View>
            <Icon
              name="chevron-right"
              size={24}
              color={theme.colors.text.disabled}
            />
          </View>

          <View style={styles.recipeStats}>
            <View style={styles.stat}>
              <Icon
                name="water-percent"
                size={16}
                color={theme.colors.primary[500]}
              />
              <Text style={styles.statText}>{recipe.hydration}% hydration</Text>
            </View>
            <View style={styles.stat}>
              <Icon name="weight" size={16} color={theme.colors.primary[500]} />
              <Text style={styles.statText}>{recipe.totalWeight}g total</Text>
            </View>
            {recipe.yieldAmount && (
              <View style={styles.stat}>
                <Icon
                  name="bread-slice"
                  size={16}
                  color={theme.colors.primary[500]}
                />
                <Text style={styles.statText}>{recipe.yieldAmount}</Text>
              </View>
            )}
          </View>

          <View style={styles.recipeFormula}>
            <View style={styles.formulaItem}>
              <Text style={styles.formulaLabel}>Flour</Text>
              <Text style={styles.formulaValue}>{recipe.formula.flour}g</Text>
            </View>
            <View style={styles.formulaItem}>
              <Text style={styles.formulaLabel}>Water</Text>
              <Text style={styles.formulaValue}>{recipe.formula.water}%</Text>
            </View>
            <View style={styles.formulaItem}>
              <Text style={styles.formulaLabel}>Salt</Text>
              <Text style={styles.formulaValue}>{recipe.formula.salt}%</Text>
            </View>
            <View style={styles.formulaItem}>
              <Text style={styles.formulaLabel}>Starter</Text>
              <Text style={styles.formulaValue}>{recipe.formula.starter}%</Text>
            </View>
          </View>
        </Card>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={styles.content}>
          {recipes.length === 0 ? (
            <Card variant="outlined">
              <View style={styles.emptyState}>
                <Icon
                  name="book-open-variant"
                  size={64}
                  color={theme.colors.text.disabled}
                />
                <Text style={styles.emptyStateTitle}>Your recipe book is ready!</Text>
                <Text style={styles.emptyStateText}>
                  Build your collection of favorite formulas. Create from scratch or save directly from any calculator 📖
                </Text>
                <Button
                  title="Add Recipe"
                  onPress={handleAddRecipe}
                  style={styles.button}
                />
              </View>
            </Card>
          ) : (
            recipes.map(renderRecipeCard)
          )}
        </View>
      </ScrollView>

      <FloatingActionButton icon="plus" onPress={handleAddRecipe} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background.paper,
  },
  header: {
    padding: theme.spacing.xl,
    backgroundColor: theme.colors.white,
  },
  headerTitle: {
    fontSize: theme.typography.sizes['2xl'],
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.xs,
  },
  headerSubtitle: {
    fontSize: theme.typography.sizes.base,
    color: theme.colors.text.secondary,
  },
  content: {
    padding: theme.spacing.xl,
  },
  emptyState: {
    alignItems: 'center',
    padding: theme.spacing['3xl'],
  },
  emptyStateTitle: {
    fontSize: theme.typography.sizes['2xl'],
    fontFamily: theme.typography.fonts.heading,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.text.primary,
    marginTop: theme.spacing.lg,
    marginBottom: theme.spacing.sm,
    textAlign: 'center',
  },
  emptyStateText: {
    fontSize: theme.typography.sizes.lg,
    fontFamily: theme.typography.fonts.regular,
    color: theme.colors.text.secondary,
    textAlign: 'center',
    marginBottom: theme.spacing.xl,
    lineHeight: 28,
  },
  button: {
    minWidth: 120,
  },
  recipeCard: {
    marginBottom: theme.spacing.md,
  },
  recipeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: theme.spacing.md,
  },
  recipeInfo: {
    flex: 1,
  },
  recipeNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.xs,
  },
  recipeName: {
    fontSize: theme.typography.sizes.lg,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.text.primary,
  },
  starterBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: theme.colors.primary[50],
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: 2,
    borderRadius: theme.borderRadius.full,
  },
  starterBadgeText: {
    fontSize: theme.typography.sizes.xs,
    color: theme.colors.primary[600],
    fontWeight: theme.typography.weights.medium as any,
  },
  recipeDescription: {
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.text.secondary,
  },
  recipeStats: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: theme.spacing.md,
    gap: theme.spacing.md,
  },
  stat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xs,
  },
  statText: {
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.text.secondary,
  },
  recipeFormula: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: theme.colors.background.paper,
    padding: theme.spacing.md,
    borderRadius: theme.spacing.sm,
  },
  formulaItem: {
    alignItems: 'center',
  },
  formulaLabel: {
    fontSize: theme.typography.sizes.xs,
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing.xs,
  },
  formulaValue: {
    fontSize: theme.typography.sizes.base,
    fontWeight: theme.typography.weights.semibold,
    color: theme.colors.text.primary,
  },
});
