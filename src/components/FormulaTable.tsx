import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { theme } from '../theme';

export interface FormulaTableRow {
  label: string;
  weight?: string;
  volume?: string;
  percent?: string;
  isSection?: boolean;
}

interface FormulaTableProps {
  rows: FormulaTableRow[];
  columns?: {
    label?: string;
    weight?: string;
    volume?: string;
    percent?: string;
  };
}

export default function FormulaTable({
  rows,
  columns = {
    label: 'Ingredient',
    weight: 'Weight',
    volume: 'Volume',
    percent: '%',
  },
}: FormulaTableProps) {
  return (
    <View style={styles.table}>
      <View style={[styles.row, styles.header]}>
        <Text style={[styles.headerText, styles.name]}>{columns.label}</Text>
        <Text style={[styles.headerText, styles.amount]}>{columns.weight}</Text>
        <Text style={[styles.headerText, styles.amount]}>{columns.volume}</Text>
        <Text style={[styles.headerText, styles.percent]}>{columns.percent}</Text>
      </View>

      {rows.map((row, index) =>
        row.isSection ? (
          <View key={`${row.label}-${index}`} style={styles.sectionRow}>
            <Text style={styles.sectionText}>{row.label}</Text>
          </View>
        ) : (
          <View key={`${row.label}-${index}`} style={styles.row}>
            <Text style={[styles.cell, styles.name]}>{row.label}</Text>
            <Text style={[styles.cell, styles.amount]}>{row.weight || ''}</Text>
            <Text style={[styles.cell, styles.amount]}>{row.volume || ''}</Text>
            <Text style={[styles.cell, styles.percent]}>{row.percent || ''}</Text>
          </View>
        )
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  table: {
    borderTopWidth: 1,
    borderTopColor: theme.colors.modernist.ruleTeal,
  },
  row: {
    flexDirection: 'row',
    minHeight: 34,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.modernist.hairline,
  },
  header: {
    minHeight: 32,
  },
  headerText: {
    fontFamily: theme.typography.fonts.semibold,
    fontSize: theme.typography.sizes.xs,
    letterSpacing: 0.6,
    color: theme.colors.modernist.ink,
    textTransform: 'uppercase',
  },
  cell: {
    fontFamily: theme.typography.fonts.regular,
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.modernist.ink,
  },
  name: {
    flex: 1.8,
    paddingRight: theme.spacing.sm,
  },
  amount: {
    flex: 0.9,
    textAlign: 'right',
  },
  percent: {
    flex: 0.7,
    textAlign: 'right',
  },
  sectionRow: {
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.modernist.ruleTeal,
    paddingVertical: 5,
  },
  sectionText: {
    fontFamily: theme.typography.fonts.semibold,
    fontSize: theme.typography.sizes.xs,
    color: theme.colors.modernist.ruleTeal,
  },
});
