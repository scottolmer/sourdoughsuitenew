import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { theme } from '../theme';

export interface SegmentOption<T extends string> {
  label: string;
  value: T;
}

interface ModernistSegmentedControlProps<T extends string> {
  options: SegmentOption<T>[];
  value: T;
  onChange: (value: T) => void;
}

export default function ModernistSegmentedControl<T extends string>({
  options,
  value,
  onChange,
}: ModernistSegmentedControlProps<T>) {
  return (
    <View style={styles.container}>
      {options.map(option => {
        const selected = option.value === value;
        return (
          <TouchableOpacity
            key={option.value}
            style={[styles.option, selected && styles.selected]}
            onPress={() => onChange(option.value)}
            activeOpacity={0.75}
          >
            <Text style={[styles.label, selected && styles.selectedLabel]}>
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
    borderWidth: 1,
    borderColor: theme.colors.modernist.hairlineDark,
    backgroundColor: theme.colors.modernist.porcelain,
  },
  option: {
    flex: 1,
    minHeight: 42,
    alignItems: 'center',
    justifyContent: 'center',
    borderRightWidth: 1,
    borderRightColor: theme.colors.modernist.hairline,
  },
  selected: {
    backgroundColor: theme.colors.modernist.tealSoft,
  },
  label: {
    fontFamily: theme.typography.fonts.semibold,
    fontSize: theme.typography.sizes.xs,
    letterSpacing: 0.4,
    color: theme.colors.modernist.graphiteMuted,
    textTransform: 'uppercase',
  },
  selectedLabel: {
    color: theme.colors.modernist.ruleTeal,
  },
});
