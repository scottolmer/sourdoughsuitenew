import React, { useCallback, useState } from 'react';
import { RefreshControl, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Button from '../../components/Button';
import FactStrip from '../../components/FactStrip';
import FormulaSheet from '../../components/FormulaSheet';
import ModernistScreen from '../../components/ModernistScreen';
import RuleHeader from '../../components/RuleHeader';
import FloatingActionButton from '../../components/FloatingActionButton';
import { RecipesStackParamList } from '../../navigation/types';
import { getAllRecipes } from '../../services/recipeStorage';
import { starterStorage } from '../../services/starterStorage';
import { Recipe, Starter } from '../../types';
import { theme } from '../../theme';

type NavigationProp = NativeStackNavigationProp<RecipesStackParamList>;

export default function RecipesScreen() {
  const navigation = useNavigation<NavigationProp>();
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [starters, setStarters] = useState<Starter[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const loadData = async () => {
    const [loadedRecipes, loadedStarters] = await Promise.all([
      getAllRecipes(),
      starterStorage.getAll(),
    ]);
    setRecipes(loadedRecipes);
    setStarters(loadedStarters);
    setRefreshing(false);
  };

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [])
  );

  const getStarterName = (starterId?: number) => {
    if (!starterId) return 'none';
    return starters.find(starter => starter.id === starterId)?.name || 'linked';
  };

  return (
    <ModernistScreen
      scrollProps={{
        refreshControl: (
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => {
              setRefreshing(true);
              loadData();
            }}
          />
        ),
      }}
    >
      <View style={styles.header}>
        <Text style={styles.kicker}>RECIPES</Text>
        <Text style={styles.title}>Formula index</Text>
        <Text style={styles.subtitle}>
          Saved recipes formatted as compact baker's percentage cards.
        </Text>
      </View>

      {recipes.length === 0 ? (
        <FormulaSheet accented>
          <RuleHeader title="Empty Index" />
          <Text style={styles.emptyTitle}>Your formula index is ready.</Text>
          <Text style={styles.emptyText}>
            Save a calculator result or add a recipe to start building a precise
            working library.
          </Text>
          <Button
            title="Add Recipe"
            onPress={() => navigation.navigate('AddRecipe')}
            style={styles.emptyButton}
          />
        </FormulaSheet>
      ) : (
        recipes.map(recipe => (
          <TouchableOpacity
            key={recipe.id}
            onPress={() => navigation.navigate('RecipeDetail', { recipeId: recipe.id })}
            activeOpacity={0.75}
          >
            <FormulaSheet style={styles.recipeSheet} accented>
              <View style={styles.recipeTop}>
                <View style={styles.recipeTitleBlock}>
                  <Text style={styles.recipeName}>{recipe.name}</Text>
                  <Text style={styles.recipeDescription} numberOfLines={2}>
                    {recipe.description || 'Working formula'}
                  </Text>
                </View>
                <Icon
                  name="chevron-right"
                  size={20}
                  color={theme.colors.modernist.hairlineDark}
                />
              </View>
              <FactStrip
                items={[
                  {
                    label: 'Hydration',
                    value: `${recipe.hydration}%`,
                    icon: 'water-percent',
                    tone: 'teal',
                  },
                  {
                    label: 'Weight',
                    value: `${recipe.totalWeight}g`,
                    icon: 'scale',
                  },
                  {
                    label: 'Yield',
                    value: recipe.yieldAmount || 'not set',
                    icon: 'bread-slice',
                  },
                  {
                    label: 'Starter',
                    value: getStarterName(recipe.starterUsedId),
                    icon: 'bacteria-outline',
                    tone: recipe.starterUsedId ? 'green' : undefined,
                  },
                ]}
              />
              <View style={styles.formulaMini}>
                <Text style={styles.miniCell}>FLOUR {recipe.formula.flour}g</Text>
                <Text style={styles.miniCell}>WATER {recipe.formula.water}%</Text>
                <Text style={styles.miniCell}>SALT {recipe.formula.salt}%</Text>
                <Text style={styles.miniCell}>STARTER {recipe.formula.starter}%</Text>
              </View>
            </FormulaSheet>
          </TouchableOpacity>
        ))
      )}

      <FloatingActionButton icon="plus" onPress={() => navigation.navigate('AddRecipe')} />
    </ModernistScreen>
  );
}

const styles = StyleSheet.create({
  header: {
    marginBottom: theme.spacing.lg,
  },
  kicker: {
    fontFamily: theme.typography.fonts.semibold,
    fontSize: theme.typography.sizes.xs,
    letterSpacing: 0.9,
    color: theme.colors.modernist.ruleTeal,
    marginBottom: theme.spacing.xs,
  },
  title: {
    fontFamily: theme.typography.fonts.heading,
    fontSize: 36,
    color: theme.colors.modernist.ink,
  },
  subtitle: {
    fontFamily: theme.typography.fonts.regular,
    fontSize: theme.typography.sizes.base,
    lineHeight: 23,
    color: theme.colors.modernist.graphiteMuted,
    marginTop: theme.spacing.sm,
  },
  emptyTitle: {
    fontFamily: theme.typography.fonts.heading,
    fontSize: theme.typography.sizes['2xl'],
    color: theme.colors.modernist.ink,
  },
  emptyText: {
    fontFamily: theme.typography.fonts.regular,
    color: theme.colors.modernist.graphiteMuted,
    lineHeight: 21,
    marginTop: theme.spacing.sm,
  },
  emptyButton: {
    marginTop: theme.spacing.lg,
  },
  recipeSheet: {
    marginBottom: theme.spacing.lg,
  },
  recipeTop: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: theme.spacing.md,
  },
  recipeTitleBlock: {
    flex: 1,
  },
  recipeName: {
    fontFamily: theme.typography.fonts.heading,
    fontSize: theme.typography.sizes.xl,
    color: theme.colors.modernist.ink,
  },
  recipeDescription: {
    fontFamily: theme.typography.fonts.regular,
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.modernist.graphiteMuted,
    marginTop: 3,
  },
  formulaMini: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    borderTopWidth: 1,
    borderTopColor: theme.colors.modernist.ruleTeal,
    marginTop: theme.spacing.md,
    paddingTop: theme.spacing.sm,
    gap: theme.spacing.sm,
  },
  miniCell: {
    fontFamily: theme.typography.fonts.semibold,
    fontSize: 10,
    letterSpacing: 0.5,
    color: theme.colors.modernist.graphite,
  },
});
