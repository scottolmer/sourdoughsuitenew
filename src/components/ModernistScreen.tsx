/**
 * ModernistScreen
 * Page wrapper for the Modernist Formula Cards redesign.
 * - Safe-area handling
 * - Paper background
 * - Consistent horizontal padding
 * - Optional scroll
 * - Optional bottom action inset (reserves room for a fixed footer/CTA)
 */

import React, { ReactNode } from 'react';
import {
  ScrollView,
  StyleSheet,
  View,
  ViewStyle,
  StyleProp,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { theme } from '../theme';

interface ModernistScreenProps {
  children: ReactNode;
  scroll?: boolean;
  padded?: boolean;
  bottomActionInset?: number;
  background?: 'paper' | 'paperWarm' | 'porcelain';
  style?: StyleProp<ViewStyle>;
  contentStyle?: StyleProp<ViewStyle>;
}

export default function ModernistScreen({
  children,
  scroll = true,
  padded = true,
  bottomActionInset = 0,
  background = 'paper',
  style,
  contentStyle,
}: ModernistScreenProps) {
  const bg = theme.colors.modernist[background];

  const innerContent = (
    <View
      style={[
        padded && styles.padded,
        bottomActionInset
          ? { paddingBottom: bottomActionInset + theme.spacing.lg }
          : null,
        contentStyle,
      ]}
    >
      {children}
    </View>
  );

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: bg }, style]}
      edges={['top']}
    >
      {scroll ? (
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {innerContent}
        </ScrollView>
      ) : (
        innerContent
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  padded: {
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.lg,
  },
});
