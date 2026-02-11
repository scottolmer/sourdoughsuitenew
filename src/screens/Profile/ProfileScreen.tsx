/**
 * Profile Screen
 * App profile and settings
 */

import React from 'react';
import { View, Text, StyleSheet, ScrollView, Linking, TouchableOpacity } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Card from '../../components/Card';
import { theme } from '../../theme';
import type { ProfileStackParamList } from '../../navigation/types';

type Props = NativeStackScreenProps<ProfileStackParamList, 'Profile'>;

export default function ProfileScreen({ navigation }: Props) {
  const handleSocialPress = (url: string) => {
    Linking.openURL(url).catch((err) => console.error("Couldn't load page", err));
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.logoContainer}>
          <Icon name="bread-slice" size={64} color={theme.colors.primary[600]} />
        </View>
        <Text style={styles.appName}>Sourdough Suite</Text>
        <Text style={styles.appTagline}>Your sourdough baking companion</Text>
      </View>

      <View style={styles.content}>
        <Text style={styles.sectionTitle}>Community</Text>
        <Card variant="outlined" padding="none">
          <TouchableOpacity onPress={() => handleSocialPress('https://youtube.com/@SourdoughSuite')}>
            <View style={styles.menuItem}>
              <Icon name="youtube" size={24} color="#FF0000" />
              <Text style={styles.menuItemText}>Subscribe on YouTube</Text>
              <Icon name="open-in-new" size={20} color={theme.colors.text.disabled} />
            </View>
          </TouchableOpacity>
          <View style={styles.divider} />
          <TouchableOpacity onPress={() => handleSocialPress('https://instagram.com/sourdoughsuite')}>
            <View style={styles.menuItem}>
              <Icon name="instagram" size={24} color="#E1306C" />
              <Text style={styles.menuItemText}>Follow on Instagram</Text>
              <Icon name="open-in-new" size={20} color={theme.colors.text.disabled} />
            </View>
          </TouchableOpacity>
          <View style={styles.divider} />
          <TouchableOpacity onPress={() => handleSocialPress('https://facebook.com/sourdoughsuite')}>
            <View style={styles.menuItem}>
              <Icon name="facebook" size={24} color="#1877F2" />
              <Text style={styles.menuItemText}>Like us on Facebook</Text>
              <Icon name="open-in-new" size={20} color={theme.colors.text.disabled} />
            </View>
          </TouchableOpacity>
          <View style={styles.divider} />
          <TouchableOpacity onPress={() => handleSocialPress('https://tiktok.com/@sourdoughsuite')}>
            <View style={styles.menuItem}>
              <Icon name="music-note-eighth" size={24} color="#000000" />
              <Text style={styles.menuItemText}>Follow on TikTok</Text>
              <Icon name="open-in-new" size={20} color={theme.colors.text.disabled} />
            </View>
          </TouchableOpacity>
        </Card>

        <Text style={[styles.sectionTitle, { marginTop: theme.spacing.xl }]}>
          Support
        </Text>
        <Card variant="outlined" padding="none">
          <TouchableOpacity onPress={() => navigation.navigate('HelpFaq')}>
            <View style={styles.menuItem}>
              <Icon name="help-circle" size={24} color={theme.colors.text.secondary} />
              <Text style={styles.menuItemText}>Help & FAQ</Text>
              <Icon name="chevron-right" size={24} color={theme.colors.text.disabled} />
            </View>
          </TouchableOpacity>
          <View style={styles.divider} />
          <TouchableOpacity onPress={() => navigation.navigate('About')}>
            <View style={styles.menuItem}>
              <Icon name="information" size={24} color={theme.colors.text.secondary} />
              <Text style={styles.menuItemText}>About</Text>
              <Icon name="chevron-right" size={24} color={theme.colors.text.disabled} />
            </View>
          </TouchableOpacity>
        </Card>

        <Text style={styles.version}>Version 1.0.0</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background.paper,
  },
  header: {
    padding: theme.spacing.xl,
    backgroundColor: theme.colors.white,
    alignItems: 'center',
  },
  logoContainer: {
    marginBottom: theme.spacing.md,
  },
  appName: {
    fontSize: theme.typography.sizes['2xl'],
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.xs,
  },
  appTagline: {
    fontSize: theme.typography.sizes.base,
    color: theme.colors.text.secondary,
  },
  content: {
    padding: theme.spacing.xl,
  },
  sectionTitle: {
    fontSize: theme.typography.sizes.sm,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.text.secondary,
    textTransform: 'uppercase',
    marginBottom: theme.spacing.md,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.spacing.lg,
  },
  menuItemText: {
    flex: 1,
    fontSize: theme.typography.sizes.base,
    color: theme.colors.text.primary,
    marginLeft: theme.spacing.md,
  },
  divider: {
    height: 1,
    backgroundColor: theme.colors.border.light,
    marginLeft: theme.spacing.lg + 24 + theme.spacing.md,
  },
  version: {
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.text.disabled,
    textAlign: 'center',
    marginTop: theme.spacing.xl,
  },
});
