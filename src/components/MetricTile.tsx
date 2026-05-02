import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import { theme } from '../theme';
import type { MaterialCommunityIconName } from '../types/icons';

interface MetricTileProps {
  icon?: MaterialCommunityIconName;
  label: string;
  value: string;
  tone?: 'default' | 'copper' | 'green' | 'blue' | 'red';
}

const toneColor = (tone: MetricTileProps['tone']): string => {
  switch (tone) {
    case 'green':
      return theme.colors.bench.starterGreen;
    case 'blue':
      return theme.colors.bench.waterBlue;
    case 'red':
      return theme.colors.bench.heatRed;
    case 'copper':
      return theme.colors.bench.copper;
    default:
      return theme.colors.bench.crustSoft;
  }
};

export default function MetricTile({ icon, label, value, tone = 'default' }: MetricTileProps) {
  const color = toneColor(tone);

  return (
    <View style={styles.tile}>
      {icon ? <Icon name={icon} size={20} color={color} /> : null}
      <Text style={styles.value}>{value}</Text>
      <Text style={styles.label}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  tile: {
    flex: 1,
    minHeight: 76,
    borderRadius: 18,
    padding: theme.spacing.md,
    backgroundColor: theme.colors.background.subtle,
    borderWidth: 1,
    borderColor: theme.colors.bench.borderSoft,
    justifyContent: 'center',
    gap: 4,
  },
  value: {
    fontFamily: theme.typography.fonts.semibold,
    fontSize: theme.typography.sizes.lg,
    color: theme.colors.bench.crust,
  },
  label: {
    fontFamily: theme.typography.fonts.regular,
    fontSize: theme.typography.sizes.xs,
    color: theme.colors.text.secondary,
  },
});
