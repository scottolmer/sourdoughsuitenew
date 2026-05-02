import React from 'react';
import { Image, ImageSourcePropType, StyleSheet, Text, View } from 'react-native';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import { theme } from '../theme';
import type { MaterialCommunityIconName } from '../types/icons';

export type ConfidenceTone = 'high' | 'medium' | 'low';

interface ResultHeroProps {
  image?: ImageSourcePropType;
  icon?: MaterialCommunityIconName;
  title: string;
  confidence?: number;
  confidenceTone?: ConfidenceTone;
  confidenceLabel?: string;
}

const toneColor: Record<ConfidenceTone, string> = {
  high: theme.colors.bench.starterGreen,
  medium: theme.colors.bench.copper,
  low: theme.colors.bench.heatRed,
};

export default function ResultHero({
  image,
  icon,
  title,
  confidence,
  confidenceTone = 'medium',
  confidenceLabel,
}: ResultHeroProps) {
  const badgeColor = toneColor[confidenceTone];

  return (
    <View style={styles.container}>
      <View style={styles.heroArea}>
        {image ? (
          <Image source={image} style={styles.image} resizeMode="cover" />
        ) : icon ? (
          <View style={styles.iconContainer}>
            <Icon name={icon} size={56} color={theme.colors.bench.copper} />
          </View>
        ) : null}
        {confidence !== undefined && (
          <View style={[styles.badge, { backgroundColor: badgeColor }]}>
            <Text style={styles.badgeText}>
              {confidenceLabel ?? `${Math.round(confidence * 100)}% confident`}
            </Text>
          </View>
        )}
      </View>
      <Text style={styles.title}>{title}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    borderRadius: 24,
    overflow: 'hidden',
    backgroundColor: theme.colors.background.paper,
    borderWidth: 1,
    borderColor: theme.colors.bench.borderSoft,
    ...theme.shadows.md,
    shadowColor: '#5A3A25',
  },
  heroArea: {
    width: '100%',
    minHeight: 200,
    backgroundColor: theme.colors.bench.linen,
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: '100%',
    height: 220,
  },
  iconContainer: {
    width: '100%',
    height: 200,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.bench.parchment,
  },
  badge: {
    position: 'absolute',
    top: theme.spacing.md,
    right: theme.spacing.md,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.xs,
    borderRadius: 99,
  },
  badgeText: {
    fontFamily: theme.typography.fonts.semibold,
    fontSize: theme.typography.sizes.xs,
    color: theme.colors.white,
    letterSpacing: 0.4,
  },
  title: {
    fontFamily: theme.typography.fonts.heading,
    fontSize: theme.typography.sizes['2xl'],
    color: theme.colors.bench.crust,
    textAlign: 'center',
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.lg,
  },
});
