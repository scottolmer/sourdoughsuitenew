import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { theme } from '../theme';

export interface FormulaIngredient {
  name: string;
  weight: number;
  percentage?: number;
}

interface FormulaPreviewProps {
  hydration: number;
  ingredients: FormulaIngredient[];
  totalWeight?: number;
  title?: string;
}

export default function FormulaPreview({
  hydration,
  ingredients,
  totalWeight,
  title,
}: FormulaPreviewProps) {
  return (
    <View style={styles.container}>
      <View style={styles.heroRow}>
        <View style={styles.hydrationBlock}>
          <Text style={styles.hydrationValue}>{hydration.toFixed(1)}%</Text>
          <Text style={styles.hydrationLabel}>Hydration</Text>
        </View>
        {totalWeight !== undefined && (
          <View style={styles.weightBlock}>
            <Text style={styles.weightValue}>{totalWeight}g</Text>
            <Text style={styles.weightLabel}>Total Dough</Text>
          </View>
        )}
      </View>
      {title ? <Text style={styles.title}>{title}</Text> : null}
      <View style={styles.divider} />
      {ingredients.map((ing, index) => (
        <View key={index} style={styles.row}>
          <Text style={styles.ingName}>{ing.name}</Text>
          <View style={styles.ingRight}>
            {ing.percentage !== undefined && (
              <Text style={styles.ingPct}>{ing.percentage.toFixed(1)}%</Text>
            )}
            <Text style={styles.ingWeight}>{ing.weight}g</Text>
          </View>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 22,
    backgroundColor: theme.colors.background.paper,
    borderWidth: 1,
    borderColor: theme.colors.bench.border,
    overflow: 'hidden',
    ...theme.shadows.sm,
    shadowColor: '#3A3A3A',
  },
  heroRow: {
    flexDirection: 'row',
    backgroundColor: theme.colors.bench.parchment,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.lg,
    gap: theme.spacing.xl,
  },
  hydrationBlock: {
    flex: 1,
    alignItems: 'flex-start',
  },
  hydrationValue: {
    fontFamily: theme.typography.fonts.heading,
    fontSize: theme.typography.sizes['4xl'],
    color: theme.colors.primary[600],
    lineHeight: 44,
  },
  hydrationLabel: {
    fontFamily: theme.typography.fonts.semibold,
    fontSize: theme.typography.sizes.xs,
    color: theme.colors.primary[700],
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    marginTop: 2,
  },
  weightBlock: {
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  weightValue: {
    fontFamily: theme.typography.fonts.semibold,
    fontSize: theme.typography.sizes.xl,
    color: theme.colors.bench.crustSoft,
  },
  weightLabel: {
    fontFamily: theme.typography.fonts.regular,
    fontSize: theme.typography.sizes.xs,
    color: theme.colors.text.secondary,
    marginTop: 2,
  },
  title: {
    fontFamily: theme.typography.fonts.heading,
    fontSize: theme.typography.sizes.lg,
    color: theme.colors.bench.crust,
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.md,
    paddingBottom: theme.spacing.xs,
  },
  divider: {
    height: 1,
    backgroundColor: theme.colors.bench.borderSoft,
    marginHorizontal: theme.spacing.lg,
    marginVertical: theme.spacing.sm,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.sm,
  },
  ingName: {
    fontFamily: theme.typography.fonts.medium,
    fontSize: theme.typography.sizes.base,
    color: theme.colors.bench.crustSoft,
    flex: 1,
  },
  ingRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.md,
  },
  ingPct: {
    fontFamily: theme.typography.fonts.regular,
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.text.secondary,
    minWidth: 48,
    textAlign: 'right',
  },
  ingWeight: {
    fontFamily: theme.typography.fonts.semibold,
    fontSize: theme.typography.sizes.base,
    color: theme.colors.bench.crust,
    minWidth: 48,
    textAlign: 'right',
  },
});
