import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { theme } from '../theme';

export interface TimelineItem {
  id: string;
  time: string;
  title: string;
  notes: string;
  tone?: 'default' | 'green' | 'red' | 'copper';
}

interface TimelineRailProps {
  items: TimelineItem[];
}

const toneColor = (tone: TimelineItem['tone']) => {
  switch (tone) {
    case 'green':
      return theme.colors.modernist.starterGreen;
    case 'red':
      return theme.colors.modernist.heatRed;
    case 'copper':
      return theme.colors.modernist.copper;
    default:
      return theme.colors.modernist.ruleTeal;
  }
};

export default function TimelineRail({ items }: TimelineRailProps) {
  return (
    <View style={styles.container}>
      {items.map((item, index) => {
        const color = toneColor(item.tone);
        return (
          <View key={item.id} style={styles.item}>
            <View style={styles.railColumn}>
              <View style={[styles.node, { borderColor: color }]} />
              {index < items.length - 1 ? <View style={styles.rail} /> : null}
            </View>
            <View style={styles.content}>
              <Text style={styles.time}>{item.time}</Text>
              <Text style={styles.title}>{item.title}</Text>
              <Text style={styles.notes}>{item.notes}</Text>
            </View>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: theme.spacing.xs,
  },
  item: {
    flexDirection: 'row',
    minHeight: 74,
  },
  railColumn: {
    width: 24,
    alignItems: 'center',
  },
  node: {
    width: 13,
    height: 13,
    borderRadius: 999,
    borderWidth: 2,
    backgroundColor: theme.colors.modernist.paper,
    marginTop: 4,
  },
  rail: {
    flex: 1,
    width: 1,
    backgroundColor: theme.colors.modernist.hairlineDark,
    marginTop: 4,
  },
  content: {
    flex: 1,
    paddingBottom: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.modernist.hairline,
  },
  time: {
    fontFamily: theme.typography.fonts.semibold,
    fontSize: theme.typography.sizes.xs,
    color: theme.colors.modernist.ruleTeal,
    marginBottom: 2,
  },
  title: {
    fontFamily: theme.typography.fonts.semibold,
    fontSize: theme.typography.sizes.base,
    color: theme.colors.modernist.ink,
    marginBottom: 3,
  },
  notes: {
    fontFamily: theme.typography.fonts.regular,
    fontSize: theme.typography.sizes.sm,
    lineHeight: 19,
    color: theme.colors.modernist.graphiteMuted,
  },
});
