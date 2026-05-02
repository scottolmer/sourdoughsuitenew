import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { theme } from '../theme';

export interface FactItem {
  icon?: string;
  label: string;
  value: string;
  tone?: 'default' | 'teal' | 'green' | 'red' | 'copper';
}

interface FactStripProps {
  items: FactItem[];
}

const toneColor = (tone: FactItem['tone']) => {
  switch (tone) {
    case 'green':
      return theme.colors.modernist.starterGreen;
    case 'red':
      return theme.colors.modernist.heatRed;
    case 'copper':
      return theme.colors.modernist.copper;
    case 'teal':
      return theme.colors.modernist.ruleTeal;
    default:
      return theme.colors.modernist.graphite;
  }
};

export default function FactStrip({ items }: FactStripProps) {
  return (
    <View style={styles.container}>
      {items.map((item, index) => {
        const color = toneColor(item.tone);
        return (
          <View
            key={`${item.label}-${index}`}
            style={[styles.item, index > 0 && styles.itemBorder]}
          >
            {item.icon ? <Icon name={item.icon} size={18} color={color} /> : null}
            <Text style={styles.label}>{item.label}</Text>
            <Text style={[styles.value, { color }]} numberOfLines={2}>
              {item.value}
            </Text>
          </View>
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
  item: {
    flex: 1,
    minWidth: 0,
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: 6,
    alignItems: 'center',
    gap: 3,
  },
  itemBorder: {
    borderLeftWidth: 1,
    borderLeftColor: theme.colors.modernist.hairline,
  },
  label: {
    fontFamily: theme.typography.fonts.semibold,
    fontSize: 10,
    letterSpacing: 0.6,
    color: theme.colors.modernist.graphite,
    textTransform: 'uppercase',
    textAlign: 'center',
  },
  value: {
    fontFamily: theme.typography.fonts.medium,
    fontSize: theme.typography.sizes.sm,
    textAlign: 'center',
  },
});
