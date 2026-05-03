/**
 * FormulaTable
 * Structured row table.
 * Default columns: ingredient (flex) | weight (right) | volume (right) | percent (right).
 * Long ingredient names wrap within the ingredient column without column drift.
 */

import React from 'react';
import { StyleSheet, Text, View, ViewStyle, StyleProp } from 'react-native';
import { theme } from '../theme';

export interface FormulaTableRow {
  name: string;
  weight?: string;
  volume?: string;
  percent?: string;
  emphasis?: boolean;
  hint?: string;
}

export interface FormulaTableColumns {
  weight?: boolean;
  volume?: boolean;
  percent?: boolean;
}

interface FormulaTableProps {
  rows: FormulaTableRow[];
  columns?: FormulaTableColumns;
  showHeader?: boolean;
  totals?: FormulaTableRow;
  style?: StyleProp<ViewStyle>;
}

const DEFAULT_COLUMNS: FormulaTableColumns = {
  weight: true,
  volume: true,
  percent: true,
};

const NUMERIC_WIDTH = 64;

export default function FormulaTable({
  rows,
  columns = DEFAULT_COLUMNS,
  showHeader = true,
  totals,
  style,
}: FormulaTableProps) {
  const cols: FormulaTableColumns = { ...DEFAULT_COLUMNS, ...columns };

  const renderRow = (row: FormulaTableRow, key: string, opts: { isTotal?: boolean } = {}) => {
    const isTotal = !!opts.isTotal;
    return (
      <View
        key={key}
        style={[
          styles.row,
          isTotal ? styles.totalRow : null,
        ]}
      >
        <View style={styles.nameCell}>
          <Text
            style={[
              styles.cellText,
              styles.nameText,
              (row.emphasis || isTotal) && styles.emphasisText,
            ]}
          >
            {row.name}
          </Text>
          {row.hint ? <Text style={styles.hintText}>{row.hint}</Text> : null}
        </View>
        {cols.weight ? (
          <Text
            style={[
              styles.cellText,
              styles.numericCell,
              (row.emphasis || isTotal) && styles.emphasisText,
            ]}
            numberOfLines={1}
          >
            {row.weight ?? '—'}
          </Text>
        ) : null}
        {cols.volume ? (
          <Text
            style={[
              styles.cellText,
              styles.numericCell,
              (row.emphasis || isTotal) && styles.emphasisText,
            ]}
            numberOfLines={1}
          >
            {row.volume ?? '—'}
          </Text>
        ) : null}
        {cols.percent ? (
          <Text
            style={[
              styles.cellText,
              styles.numericCell,
              styles.percentCell,
              (row.emphasis || isTotal) && styles.emphasisText,
            ]}
            numberOfLines={1}
          >
            {row.percent ?? '—'}
          </Text>
        ) : null}
      </View>
    );
  };

  return (
    <View style={[styles.table, style]}>
      {showHeader ? (
        <View style={[styles.row, styles.headerRow]}>
          <View style={styles.nameCell}>
            <Text style={[styles.headerText, styles.nameText]}>Ingredient</Text>
          </View>
          {cols.weight ? (
            <Text style={[styles.headerText, styles.numericCell]}>Weight</Text>
          ) : null}
          {cols.volume ? (
            <Text style={[styles.headerText, styles.numericCell]}>Volume</Text>
          ) : null}
          {cols.percent ? (
            <Text style={[styles.headerText, styles.numericCell, styles.percentCell]}>%</Text>
          ) : null}
        </View>
      ) : null}
      {rows.map((row, idx) => renderRow(row, `row-${idx}`))}
      {totals ? renderRow(totals, 'totals', { isTotal: true }) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  table: {
    width: '100%',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 8,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: theme.colors.modernist.hairline,
  },
  headerRow: {
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.modernist.ink,
    paddingBottom: 6,
  },
  totalRow: {
    borderBottomWidth: 0,
    borderTopWidth: 1,
    borderTopColor: theme.colors.modernist.ink,
    marginTop: 4,
    paddingTop: 8,
  },
  nameCell: {
    flex: 1,
    paddingRight: theme.spacing.sm,
  },
  numericCell: {
    width: NUMERIC_WIDTH,
    textAlign: 'right',
    paddingLeft: theme.spacing.xs,
    fontVariant: ['tabular-nums'],
  },
  percentCell: {
    color: theme.colors.primary[600],
  },
  cellText: {
    fontFamily: theme.typography.roles.body,
    fontSize: 14,
    color: theme.colors.modernist.graphite,
    lineHeight: 20,
  },
  nameText: {
    fontFamily: theme.typography.roles.bodyMedium,
    color: theme.colors.modernist.ink,
  },
  hintText: {
    fontFamily: theme.typography.roles.body,
    fontSize: 11,
    color: theme.colors.modernist.graphiteMuted,
    marginTop: 2,
    letterSpacing: 0.4,
  },
  headerText: {
    fontFamily: theme.typography.roles.bodySemibold,
    fontSize: 11,
    color: theme.colors.modernist.graphiteMuted,
    letterSpacing: 0.6,
    textTransform: 'uppercase',
  },
  emphasisText: {
    fontFamily: theme.typography.roles.bodyBold,
    color: theme.colors.modernist.ink,
  },
});
