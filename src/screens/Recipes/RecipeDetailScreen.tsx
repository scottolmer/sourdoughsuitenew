import React, { useEffect, useMemo, useState } from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import Button from '../../components/Button';
import FactStrip from '../../components/FactStrip';
import FormulaSheet from '../../components/FormulaSheet';
import FormulaTable, { FormulaTableRow } from '../../components/FormulaTable';
import ModernistScreen from '../../components/ModernistScreen';
import RuleHeader from '../../components/RuleHeader';
import StageDirections from '../../components/StageDirections';
import { RecipesStackParamList } from '../../navigation/types';
import { deleteRecipe, getRecipeById } from '../../services/recipeStorage';
import { starterStorage } from '../../services/starterStorage';
import { Recipe, Starter } from '../../types';
import { theme } from '../../theme';

type Props = NativeStackScreenProps<RecipesStackParamList, 'RecipeDetail'>;

const grams = (value: number) => `${Math.round(value)}g`;

export default function RecipeDetailScreen({ route, navigation }: Props) {
  const { recipeId } = route.params;
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [starter, setStarter] = useState<Starter | null>(null);

  useEffect(() => {
    const load = async () => {
      const loadedRecipe = await getRecipeById(recipeId);
      setRecipe(loadedRecipe);
      if (loadedRecipe?.starterUsedId) {
        setStarter(await starterStorage.getById(loadedRecipe.starterUsedId));
      }
    };
    load();
  }, [recipeId]);

  const formulaRows: FormulaTableRow[] = useMemo(() => {
    if (!recipe) return [];
    const flour = recipe.formula.flour;
    const rows: FormulaTableRow[] = [
      { label: 'For the Dough', isSection: true },
      {
        label: 'Flour',
        weight: grams(flour),
        volume: 'base',
        percent: '100',
      },
      {
        label: 'Water',
        weight: grams((flour * recipe.formula.water) / 100),
        volume: '',
        percent: `${recipe.formula.water}`,
      },
      {
        label: 'Salt',
        weight: grams((flour * recipe.formula.salt) / 100),
        volume: '',
        percent: `${recipe.formula.salt}`,
      },
      {
        label: 'Starter',
        weight: grams((flour * recipe.formula.starter) / 100),
        volume: '',
        percent: `${recipe.formula.starter}`,
      },
    ];

    if (recipe.additionalIngredients?.length) {
      rows.push({ label: 'Inclusions', isSection: true });
      recipe.additionalIngredients.forEach(ingredient => {
        rows.push({
          label: ingredient.name,
          weight:
            ingredient.unit === '%'
              ? grams((flour * ingredient.amount) / 100)
              : `${ingredient.amount}${ingredient.unit}`,
          volume: ingredient.unit,
          percent:
            ingredient.unit === '%'
              ? `${ingredient.amount}`
              : ingredient.percentage?.toString() || '',
        });
      });
    }

    rows.push({
      label: 'Yield',
      weight: grams(recipe.totalWeight),
      volume: recipe.yieldAmount || '',
      percent: '',
    });

    return rows;
  }, [recipe]);

  if (!recipe) {
    return (
      <ModernistScreen>
        <Text style={styles.title}>Recipe not found</Text>
      </ModernistScreen>
    );
  }

  const instructionParts = recipe.instructions
    .split(/\n+|(?<=\.)\s+(?=[A-Z])/)
    .map(part => part.trim())
    .filter(Boolean);

  const stageLabels = ['MIX', 'BULK', 'SHAPE', 'PROOF', 'BAKE'];
  const stageDirections = stageLabels.map((stage, index) => ({
    stage,
    text:
      instructionParts[index] ||
      (stage === 'BAKE'
        ? 'Bake according to your formula notes and cool completely before slicing.'
        : 'Follow the formula cues and adjust by dough strength, temperature, and rise.'),
  }));

  const handleDelete = () => {
    Alert.alert('Delete Recipe', 'Delete this recipe from your formula index?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          await deleteRecipe(recipeId);
          navigation.goBack();
        },
      },
    ]);
  };

  return (
    <ModernistScreen>
      <View style={styles.header}>
        <Text style={styles.kicker}>RECIPE FORMULA</Text>
        <Text style={styles.title}>{recipe.name}</Text>
        {recipe.description ? (
          <Text style={styles.subtitle}>{recipe.description}</Text>
        ) : null}
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
            value: starter?.name || 'none',
            icon: 'bacteria-outline',
            tone: starter ? 'green' : undefined,
          },
        ]}
      />

      <FormulaSheet style={styles.section} accented>
        <RuleHeader title="Ingredients" />
        <FormulaTable rows={formulaRows} />
      </FormulaSheet>

      <FormulaSheet style={styles.section}>
        <RuleHeader title="General Directions" />
        <StageDirections stages={stageDirections} />
      </FormulaSheet>

      {recipe.notes ? (
        <FormulaSheet style={styles.section}>
          <RuleHeader title="Notes" />
          <Text style={styles.notes}>{recipe.notes}</Text>
        </FormulaSheet>
      ) : null}

      <View style={styles.actions}>
        <Button
          title="Edit"
          leftIcon="pencil"
          onPress={() => navigation.navigate('EditRecipe', { recipeId })}
          style={styles.actionButton}
        />
        <Button
          title="Delete"
          variant="outline"
          leftIcon="delete-outline"
          onPress={handleDelete}
          style={styles.actionButton}
        />
      </View>
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
    fontSize: 34,
    lineHeight: 40,
    color: theme.colors.modernist.ink,
  },
  subtitle: {
    fontFamily: theme.typography.fonts.regular,
    fontSize: theme.typography.sizes.base,
    lineHeight: 23,
    color: theme.colors.modernist.graphiteMuted,
    marginTop: theme.spacing.sm,
  },
  section: {
    marginTop: theme.spacing.lg,
  },
  notes: {
    fontFamily: theme.typography.fonts.regular,
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.modernist.graphiteMuted,
    lineHeight: 21,
  },
  actions: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
    marginTop: theme.spacing.lg,
  },
  actionButton: {
    flex: 1,
  },
});
