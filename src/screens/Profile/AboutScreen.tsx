/**
 * About Screen
 */

import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Card from '../../components/Card';
import { theme } from '../../theme';
import type { ProfileStackParamList } from '../../navigation/types';

type Props = NativeStackScreenProps<ProfileStackParamList, 'About'>;

export default function AboutScreen({ navigation }: Props) {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      <View style={styles.header}>
        <Icon name="bread-slice" size={64} color={theme.colors.primary[600]} />
        <Text style={styles.appName}>Sourdough Suite</Text>
        <Text style={styles.version}>Version 1.0.0</Text>
      </View>

      <Card variant="outlined">
        <Text style={styles.description}>
          Sourdough Suite is your all-in-one companion for sourdough baking. Track your starters, manage recipes, and use our collection of baking calculators to perfect your craft.
        </Text>
        <Text style={styles.description}>
          Whether you're a beginner learning the basics or an experienced baker fine-tuning your process, Sourdough Suite has the tools you need.
        </Text>
      </Card>

      <View style={styles.sectionSpacing}>
        <Text style={styles.sectionTitle}>Features</Text>
        <Card variant="outlined" padding="none">
          <View style={styles.featureItem}>
            <Icon name="bacteria" size={22} color={theme.colors.primary[600]} />
            <View style={styles.featureText}>
              <Text style={styles.featureTitle}>Starter Tracking</Text>
              <Text style={styles.featureDescription}>Monitor health, log feedings, and get reminders</Text>
            </View>
          </View>
          <View style={styles.divider} />
          <View style={styles.featureItem}>
            <Icon name="book-open-variant" size={22} color={theme.colors.primary[600]} />
            <View style={styles.featureText}>
              <Text style={styles.featureTitle}>Recipe Management</Text>
              <Text style={styles.featureDescription}>Store and organize your sourdough recipes</Text>
            </View>
          </View>
          <View style={styles.divider} />
          <View style={styles.featureItem}>
            <Icon name="calculator" size={22} color={theme.colors.primary[600]} />
            <View style={styles.featureText}>
              <Text style={styles.featureTitle}>Baking Calculators</Text>
              <Text style={styles.featureDescription}>11 specialized tools for every baking calculation</Text>
            </View>
          </View>
        </Card>
      </View>

      <View style={styles.sectionSpacing}>
        <Text style={styles.sectionTitle}>Legal</Text>
        <Card variant="outlined" padding="none">
          <TouchableOpacity onPress={() => navigation.navigate('PrivacyPolicy')}>
            <View style={styles.linkItem}>
              <Text style={styles.linkText}>Privacy Policy</Text>
              <Icon name="chevron-right" size={20} color={theme.colors.text.disabled} />
            </View>
          </TouchableOpacity>
          <View style={styles.divider} />
          <TouchableOpacity onPress={() => navigation.navigate('TermsOfService')}>
            <View style={styles.linkItem}>
              <Text style={styles.linkText}>Terms of Service</Text>
              <Icon name="chevron-right" size={20} color={theme.colors.text.disabled} />
            </View>
          </TouchableOpacity>
        </Card>
      </View>

      <Text style={styles.copyright}>Made with love for bakers everywhere.</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background.paper,
  },
  scrollContent: {
    padding: theme.spacing.lg,
    paddingBottom: theme.spacing['2xl'],
  },
  header: {
    alignItems: 'center',
    marginBottom: theme.spacing.xl,
    paddingTop: theme.spacing.lg,
  },
  appName: {
    fontSize: theme.typography.sizes['2xl'],
    fontWeight: theme.typography.weights.bold as any,
    color: theme.colors.text.primary,
    marginTop: theme.spacing.md,
  },
  version: {
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.text.secondary,
    marginTop: theme.spacing.xs,
  },
  description: {
    fontSize: theme.typography.sizes.base,
    color: theme.colors.text.secondary,
    lineHeight: 22,
    marginBottom: theme.spacing.sm,
  },
  sectionSpacing: {
    marginTop: theme.spacing.xl,
  },
  sectionTitle: {
    fontSize: theme.typography.sizes.sm,
    fontWeight: theme.typography.weights.bold as any,
    color: theme.colors.text.secondary,
    textTransform: 'uppercase',
    marginBottom: theme.spacing.md,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.spacing.lg,
  },
  featureText: {
    marginLeft: theme.spacing.md,
    flex: 1,
  },
  featureTitle: {
    fontSize: theme.typography.sizes.base,
    fontWeight: theme.typography.weights.medium as any,
    color: theme.colors.text.primary,
  },
  featureDescription: {
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.text.secondary,
    marginTop: 2,
  },
  linkItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: theme.spacing.lg,
  },
  linkText: {
    fontSize: theme.typography.sizes.base,
    color: theme.colors.text.primary,
  },
  divider: {
    height: 1,
    backgroundColor: theme.colors.border.light,
    marginHorizontal: theme.spacing.lg,
  },
  copyright: {
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.text.disabled,
    textAlign: 'center',
    marginTop: theme.spacing.xl,
  },
});
