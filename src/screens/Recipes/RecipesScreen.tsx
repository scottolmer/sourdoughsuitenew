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
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import Button from '../../components/Button';
import BenchCard from '../../components/BenchCard';
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
        style={styles.cardTouchable}
      >
        <BenchCard variant="default" padding="md">
          {/* Name row + starter badge */}
          <View style={styles.nameRow}>
            <Text style={styles.recipeName} numberOfLines={2}>{recipe.name}</Text>
            {starterName && (
              <View style={styles.starterBadge}>
                <Icon name="grain" size={11} color={theme.colors.bench.starterGreen} />
                <Text style={styles.starterBadgeText} numberOfLines={1}>{starterName}</Text>
              </View>
            )}
          </View>

          {/* Stats row */}
          <View style={styles.statsRow}>
            <View style={styles.stat}>
              <Icon name="water-percent" size={14} color={theme.colors.bench.waterBlue} />
              <Text style={styles.statValue}>{recipe.hydration}%</Text>
              <Text style={styles.statLabel}>hydration</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.stat}>
              <Icon name="scale" size={14} color={theme.colors.primary[600]} />
              <Text style={styles.statValue}>{recipe.totalWeight}g</Text>
              <Text style={styles.statLabel}>total</Text>
            </View>
            {recipe.yieldAmount ? (
              <>
                <View style={styles.statDivider} />
                <View style={styles.stat}>
                  <Icon name="bread-slice-outline" size={14} color={theme.colors.bench.crustSoft} />
                  <Text style={styles.statValue}>{recipe.yieldAmount}</Text>
                  <Text style={styles.statLabel}>yield</Text>
                </View>
              </>
            ) : null}
          </View>

          {/* Formula mini-grid */}
          <View style={styles.formulaGrid}>
            <View style={styles.formulaCell}>
              <Text style={styles.formulaValue}>{recipe.formula.flour}g</Text>
              <Text style={styles.formulaLabel}>Flour</Text>
            </View>
            <View style={styles.formulaCell}>
              <Text style={styles.formulaValue}>{recipe.formula.water}%</Text>
              <Text style={styles.formulaLabel}>Water</Text>
            </View>
            <View style={styles.formulaCell}>
              <Text style={styles.formulaValue}>{recipe.formula.salt}%</Text>
              <Text style={styles.formulaLabel}>Salt</Text>
            </View>
            <View style={styles.formulaCell}>
              <Text style={styles.formulaValue}>{recipe.formula.starter}%</Text>
              <Text style={styles.formulaLabel}>Starter</Text>
            </View>
          </View>
        </BenchCard>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={recipes.length === 0 ? styles.emptyContent : styles.content}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[theme.colors.primary[600]]}
            tintColor={theme.colors.primary[600]}
          />
        }
      >
        {recipes.length === 0 ? (
          <BenchCard variant="outlined" padding="xl">
            <View style={styles.emptyState}>
              <View style={styles.emptyIconRing}>
                <Icon
                  name="book-open-page-variant-outline"
                  size={40}
                  color={theme.colors.primary[600]}
                />
              </View>
              <Text style={styles.emptyStateTitle}>Your recipe book is ready.</Text>
              <Text style={styles.emptyStateText}>
                Save your first recipe here. Build from scratch or save directly from any calculator.
              </Text>
              <Button
                title="Add Recipe"
                onPress={handleAddRecipe}
                style={styles.button}
              />
            </View>
          </BenchCard>
        ) : (
          recipes.map(renderRecipeCard)
        )}
      </ScrollView>

      <FloatingActionButton icon="plus" onPress={handleAddRecipe} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background.default,
  },
  content: {
    padding: theme.spacing.lg,
  },
  emptyContent: {
    padding: theme.spacing.xl,
    flexGrow: 1,
    justifyContent: 'center' as const,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: theme.spacing['2xl'],
  },
  emptyIconRing: {
    width: 84,
    height: 84,
    borderRadius: 42,
    backgroundColor: theme.colors.background.subtle,
    borderWidth: 1,
    borderColor: theme.colors.bench.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing.lg,
  },
  emptyStateTitle: {
    fontSize: theme.typography.sizes.xl,
    fontFamily: theme.typography.fonts.heading,
    fontWeight: theme.typography.weights.bold as any,
    color: theme.colors.bench.crust,
    marginBottom: theme.spacing.sm,
    textAlign: 'center',
  },
  emptyStateText: {
    fontSize: theme.typography.sizes.base,
    fontFamily: theme.typography.fonts.regular,
    color: theme.colors.text.secondary,
    textAlign: 'center',
    marginBottom: theme.spacing.xl,
    lineHeight: 24,
    maxWidth: 280,
  },
  button: {
    minWidth: 160,
  },
  cardTouchable: {
    marginBottom: theme.spacing.md,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.sm,
  },
  recipeName: {
    fontSize: theme.typography.sizes.lg,
    fontFamily: theme.typography.fonts.heading,
    fontWeight: theme.typography.weights.bold as any,
    color: theme.colors.bench.crust,
    flex: 1,
    flexShrink: 1,
  },
  starterBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#EAF4E3',
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: theme.colors.bench.starterGreen,
    flexShrink: 0,
    maxWidth: 120,
  },
  starterBadgeText: {
    fontSize: theme.typography.sizes.xs,
    color: theme.colors.bench.starterGreen,
    fontFamily: theme.typography.fonts.semibold,
    fontWeight: theme.typography.weights.semibold as any,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
    gap: theme.spacing.sm,
  },
  stat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statValue: {
    fontSize: theme.typography.sizes.sm,
    fontFamily: theme.typography.fonts.semibold,
    fontWeight: theme.typography.weights.semibold as any,
    color: theme.colors.bench.crust,
  },
  statLabel: {
    fontSize: theme.typography.sizes.xs,
    color: theme.colors.text.secondary,
  },
  statDivider: {
    width: 1,
    height: 14,
    backgroundColor: theme.colors.bench.borderSoft,
    marginHorizontal: 2,
  },
  formulaGrid: {
    flexDirection: 'row',
    backgroundColor: theme.colors.background.subtle,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: theme.colors.bench.borderSoft,
    overflow: 'hidden',
  },
  formulaCell: {
    flex: 1,
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.xs,
    alignItems: 'center',
    borderRightWidth: 1,
    borderRightColor: theme.colors.bench.borderSoft,
  },
  formulaValue: {
    fontSize: theme.typography.sizes.sm,
    fontFamily: theme.typography.fonts.semibold,
    fontWeight: theme.typography.weights.semibold as any,
    color: theme.colors.bench.crustSoft,
    marginBottom: 2,
  },
  formulaLabel: {
    fontSize: theme.typography.sizes.xs,
    color: theme.colors.text.secondary,
  },
});
