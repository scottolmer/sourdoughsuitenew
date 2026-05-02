/**
 * FactStrip
 * Horizontal/wrapped row of cells.
 * Each cell = small icon + tiny uppercase label + value.
 * Numeric content is right-aligned within its cell when `numeric` is true.
 */

import React from 'react';
import { StyleSheet, Text, View, ViewStyle, StyleProp } from 'react-native';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import { theme } from '../theme';
import type { MaterialCommunityIconName } from '../types/icons';

export interface FactCell {
  label: string;
  value: string;
  icon?: MaterialCommunityIconName;
  numeric?: boolean;
  tone?: 'default' | 'copper' | 'teal' | 'green' | 'blue' | 'red' | 'amber';
}

interface FactStripProps {
  facts: FactCell[];
  wrap?: boolean;
  style?: StyleProp<ViewStyle>;
}

const toneToColor = (tone: FactCell['tone']): string => {
  switch (tone) {
    case 'copper':
      return theme.colors.modernist.copper;
    case 'teal':
      return theme.colors.modernist.ruleTeal;
    case 'green':
      return theme.colors.modernist.starterGreen;
    case 'blue':
      return theme.colors.modernist.waterBlue;
    case 'red':
      return theme.colors.modernist.heatRed;
    case 'amber':
      return theme.colors.modernist.warningAmber;
    default:
      return theme.colors.modernist.graphite;
  }
};

export default function FactStrip({ facts, wrap = false, style }: FactStripProps) {
  return (
    <View
      style={[
        styles.row,
        wrap ? styles.rowWrap : null,
        style,
      ]}
    >
      {facts.map((fact, idx) => {
        const valueColor = toneToColor(fact.tone);
        return (
          <View
            key={`${fact.label}-${idx}`}
            style={[
              styles.cell,
              wrap ? styles.cellWrap : null,
              idx > 0 && !wrap ? styles.cellDivider : null,
            ]}
          >
            <View style={styles.headerRow}>
              {fact.icon ? (
                <Icon
                  name={fact.icon}
                  size={14}
                  color={theme.colors.modernist.graphiteMuted}
                  style={styles.icon}
                />
              ) : null}
              <Text style={styles.label} numberOfLines={1}>
                {fact.label}
              </Text>
            </View>
            <Text
              style={[
                styles.value,
                { color: valueColor },
                fact.numeric ? styles.valueNumeric : null,
              ]}
              numberOfLines={1}
            >
              {fact.value}
            </Text>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'stretch',
  },
  rowWrap: {
    flexWrap: 'wrap',
    rowGap: theme.spacing.sm,
  },
  cell: {
    flex: 1,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: 2,
    minWidth: 72,
  },
  cellWrap: {
    flex: 0,
    flexBasis: '33.333%',
    minWidth: 96,
  },
  cellDivider: {
    borderLeftWidth: 1,
    borderLeftColor: theme.colors.modernist.hairline,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  icon: {
    marginRight: 4,
  },
  label: {
    fontFamily: theme.typography.roles.bodyMedium,
    fontSize: 10,
    color: theme.colors.modernist.graphiteMuted,
    letterSpacing: 0.6,
    textTransform: 'uppercase',
    flexShrink: 1,
  },
  value: {
    fontFamily: theme.typography.roles.bodySemibold,
    fontSize: 16,
    color: theme.colors.modernist.ink,
  },
  valueNumeric: {
    textAlign: 'right',
    fontVariant: ['tabular-nums'],
  },
});
