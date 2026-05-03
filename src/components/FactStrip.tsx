/**
 * FactStrip
 * Single horizontal row of cells.
 * Each cell = small icon + tiny uppercase label + value.
 * Numeric content is right-aligned within its cell when `numeric` is true.
 *
 * The strip is always one row: cells use `flex: 1` and `minWidth: 0`,
 * never `flexWrap`, `flexBasis`, or fixed minimum widths. The deprecated
 * `wrap` prop is accepted for source compatibility but has no effect.
 */

import React from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
  StyleProp,
} from 'react-native';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import { theme } from '../theme';
import type { MaterialCommunityIconName } from '../types/icons';

export interface FactCell {
  label: string;
  value: string;
  icon?: MaterialCommunityIconName;
  numeric?: boolean;
  tone?: 'default' | 'copper' | 'teal' | 'green' | 'blue' | 'red' | 'amber';
  onPress?: () => void;
  accessibilityLabel?: string;
}

interface FactStripProps {
  facts?: FactCell[];
  items?: FactCell[];
  /**
   * @deprecated FactStrip is always a single horizontal row.
   * This prop is accepted for source compatibility and ignored.
   */
  wrap?: boolean;
  style?: StyleProp<ViewStyle>;
}

const toneToColor = (tone: FactCell['tone']): string => {
  switch (tone) {
    case 'copper':
      return theme.colors.primary[600];
    case 'teal':
      return theme.colors.modernist.ruleTeal;
    case 'green':
      return theme.colors.modernist.starterGreen;
    case 'blue':
      return theme.colors.modernist.waterBlue;
    case 'red':
      return theme.colors.modernist.heatRed;
    case 'amber':
      return theme.colors.modernist.ruleTeal;
    default:
      return theme.colors.modernist.graphite;
  }
};

let warnedAboutWrap = false;

export default function FactStrip({ facts, items, wrap, style }: FactStripProps) {
  const cells = facts ?? items ?? [];
  if (wrap && !warnedAboutWrap && __DEV__) {
    warnedAboutWrap = true;
    // eslint-disable-next-line no-console
    console.warn(
      '[FactStrip] The `wrap` prop is deprecated and has no effect. FactStrip is always a single horizontal row.',
    );
  }
  return (
    <View style={[styles.row, style]}>
      {cells.map((fact, idx) => {
        const valueColor = toneToColor(fact.tone);
        const cellStyle = [
          styles.cell,
          idx > 0 ? styles.cellDivider : null,
        ];
        const inner = (
          <>
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
          </>
        );
        if (fact.onPress) {
          return (
            <TouchableOpacity
              key={`${fact.label}-${idx}`}
              accessibilityRole="button"
              accessibilityLabel={fact.accessibilityLabel ?? `${fact.label}: ${fact.value}`}
              activeOpacity={0.78}
              onPress={fact.onPress}
              style={cellStyle}
            >
              {inner}
            </TouchableOpacity>
          );
        }
        return (
          <View key={`${fact.label}-${idx}`} style={cellStyle}>
            {inner}
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
  cell: {
    flex: 1,
    minWidth: 0,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: 2,
  },
  cellDivider: {
    borderLeftWidth: StyleSheet.hairlineWidth,
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
    fontSize: 13,
    color: theme.colors.modernist.ink,
  },
  valueNumeric: {
    textAlign: 'right',
    fontVariant: ['tabular-nums'],
  },
});
