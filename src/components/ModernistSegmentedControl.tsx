/**
 * ModernistSegmentedControl
 * Sharp, paper/ink/copper segmented control for the Modernist Formula Cards
 * redesign. Mirrors the API of the legacy generic `SegmentedControl` so
 * adoption by Photo Rescue subject mode, Bake Day Copilot schedule style,
 * and the calculator/bake planner mode toggles is mechanical.
 *
 * Visual rules:
 * - Paper background, single thin hairline border, 8px corner radius.
 * - Selected segment uses copper background with paper text — the spec's
 *   "one selected state" accent.
 * - Unselected segments use ink text on paper with hairline dividers between.
 * - 44px minimum tap height per segment.
 * - Inter labels, uppercase, letter-spacing 0.6 to match the rest of the
 *   Modernist primitives.
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

export interface ModernistSegmentOption<T extends string> {
  label: string;
  value: T;
  icon?: MaterialCommunityIconName;
}

interface ModernistSegmentedControlProps<T extends string> {
  options: ModernistSegmentOption<T>[];
  value: T;
  onChange: (value: T) => void;
  style?: StyleProp<ViewStyle>;
}

export default function ModernistSegmentedControl<T extends string>({
  options,
  value,
  onChange,
  style,
}: ModernistSegmentedControlProps<T>) {
  return (
    <View style={[styles.container, style]}>
      {options.map((option, idx) => {
        const active = option.value === value;
        const isFirst = idx === 0;
        return (
          <TouchableOpacity
            key={option.value}
            onPress={() => onChange(option.value)}
            activeOpacity={0.7}
            accessibilityRole="button"
            accessibilityState={{ selected: active }}
            style={[
              styles.option,
              !isFirst ? styles.optionDivider : null,
              active ? styles.optionActive : null,
            ]}
          >
            {option.icon ? (
              <Icon
                name={option.icon}
                size={16}
                color={
                  active
                    ? theme.colors.modernist.paper
                    : theme.colors.modernist.ink
                }
                style={styles.icon}
              />
            ) : null}
            <Text
              style={[styles.label, active ? styles.labelActive : null]}
              numberOfLines={1}
            >
              {option.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: theme.colors.modernist.paper,
    borderWidth: 1,
    borderColor: theme.colors.modernist.hairline,
    borderRadius: 8,
    overflow: 'hidden',
  },
  option: {
    flex: 1,
    minWidth: 0,
    minHeight: 44,
    paddingHorizontal: theme.spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.modernist.paper,
  },
  optionDivider: {
    borderLeftWidth: 1,
    borderLeftColor: theme.colors.modernist.hairline,
  },
  optionActive: {
    backgroundColor: theme.colors.modernist.copper,
  },
  icon: {
    marginRight: 6,
  },
  label: {
    fontFamily: theme.typography.roles.bodySemibold,
    fontSize: 12,
    color: theme.colors.modernist.ink,
    letterSpacing: 0.6,
    textTransform: 'uppercase',
  },
  labelActive: {
    color: theme.colors.modernist.paper,
  },
});
