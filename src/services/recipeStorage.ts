/**
 * Recipe Storage Service
 * Manages recipe data in AsyncStorage
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { Recipe } from '../types';

const RECIPES_KEY = '@recipes:all';
const RECIPE_PREFIX = '@recipe:';

/**
 * Get all recipes
 */
export const getAllRecipes = async (): Promise<Recipe[]> => {
  try {
    const recipesJson = await AsyncStorage.getItem(RECIPES_KEY);
    if (!recipesJson) {
      return [];
    }
    return JSON.parse(recipesJson);
  } catch (error) {
    console.error('Error getting recipes:', error);
    return [];
  }
};

/**
 * Get a single recipe by ID
 */
export const getRecipeById = async (id: string): Promise<Recipe | null> => {
  try {
    const recipes = await getAllRecipes();
    return recipes.find((recipe) => recipe.id === id) || null;
  } catch (error) {
    console.error('Error getting recipe:', error);
    return null;
  }
};

/**
 * Get recipes by starter ID
 */
export const getRecipesByStarterId = async (
  starterId: number
): Promise<Recipe[]> => {
  try {
    const recipes = await getAllRecipes();
    return recipes.filter((recipe) => recipe.starterUsedId === starterId);
  } catch (error) {
    console.error('Error getting recipes by starter:', error);
    return [];
  }
};

/**
 * Save a new recipe
 */
export const saveRecipe = async (recipe: Omit<Recipe, 'id' | 'createdAt' | 'updatedAt'>): Promise<Recipe> => {
  try {
    const newRecipe: Recipe = {
      ...recipe,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const recipes = await getAllRecipes();
    recipes.push(newRecipe);
    await AsyncStorage.setItem(RECIPES_KEY, JSON.stringify(recipes));

    return newRecipe;
  } catch (error) {
    console.error('Error saving recipe:', error);
    throw error;
  }
};

/**
 * Update an existing recipe
 */
export const updateRecipe = async (
  id: string,
  updates: Partial<Omit<Recipe, 'id' | 'createdAt'>>
): Promise<Recipe | null> => {
  try {
    const recipes = await getAllRecipes();
    const index = recipes.findIndex((recipe) => recipe.id === id);

    if (index === -1) {
      return null;
    }

    const updatedRecipe: Recipe = {
      ...recipes[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    recipes[index] = updatedRecipe;
    await AsyncStorage.setItem(RECIPES_KEY, JSON.stringify(recipes));

    return updatedRecipe;
  } catch (error) {
    console.error('Error updating recipe:', error);
    throw error;
  }
};

/**
 * Delete a recipe
 */
export const deleteRecipe = async (id: string): Promise<boolean> => {
  try {
    const recipes = await getAllRecipes();
    const filteredRecipes = recipes.filter((recipe) => recipe.id !== id);

    if (filteredRecipes.length === recipes.length) {
      return false; // Recipe not found
    }

    await AsyncStorage.setItem(RECIPES_KEY, JSON.stringify(filteredRecipes));
    return true;
  } catch (error) {
    console.error('Error deleting recipe:', error);
    throw error;
  }
};

/**
 * Clear all recipes (for testing/development)
 */
export const clearAllRecipes = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(RECIPES_KEY);
  } catch (error) {
    console.error('Error clearing recipes:', error);
    throw error;
  }
};
