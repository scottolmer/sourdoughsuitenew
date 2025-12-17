/**
 * Profile Screen
 * User profile and settings
 */

import React from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
// import { useAuth } from '../../hooks/useAuth';
import Button from '../../components/Button';
import Card from '../../components/Card';
import { theme } from '../../theme';

export default function ProfileScreen() {
  // const { user, logout } = useAuth();
  const user: any = null; // Temporary: auth disabled
  const logout = async () => {}; // Temporary: auth disabled

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            try {
              await logout();
            } catch (error) {
              console.error('Logout error:', error);
            }
          },
        },
      ]
    );
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.avatarContainer}>
          <Icon name="account-circle" size={80} color={theme.colors.primary[600]} />
        </View>
        <Text style={styles.username}>{user?.username}</Text>
        <Text style={styles.email}>{user?.email}</Text>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{user?.role?.toUpperCase() || 'FREE'}</Text>
        </View>
      </View>

      <View style={styles.content}>
        <Text style={styles.sectionTitle}>Account</Text>
        <Card variant="outlined" padding="none">
          <View style={styles.menuItem}>
            <Icon name="account-edit" size={24} color={theme.colors.text.secondary} />
            <Text style={styles.menuItemText}>Edit Profile</Text>
            <Icon name="chevron-right" size={24} color={theme.colors.text.disabled} />
          </View>
          <View style={styles.divider} />
          <View style={styles.menuItem}>
            <Icon name="cog" size={24} color={theme.colors.text.secondary} />
            <Text style={styles.menuItemText}>Settings</Text>
            <Icon name="chevron-right" size={24} color={theme.colors.text.disabled} />
          </View>
        </Card>

        <Text style={[styles.sectionTitle, { marginTop: theme.spacing.xl }]}>
          Support
        </Text>
        <Card variant="outlined" padding="none">
          <View style={styles.menuItem}>
            <Icon name="help-circle" size={24} color={theme.colors.text.secondary} />
            <Text style={styles.menuItemText}>Help & FAQ</Text>
            <Icon name="chevron-right" size={24} color={theme.colors.text.disabled} />
          </View>
          <View style={styles.divider} />
          <View style={styles.menuItem}>
            <Icon name="information" size={24} color={theme.colors.text.secondary} />
            <Text style={styles.menuItemText}>About</Text>
            <Icon name="chevron-right" size={24} color={theme.colors.text.disabled} />
          </View>
        </Card>

        <Button
          title="Logout"
          variant="outline"
          onPress={handleLogout}
          fullWidth
          style={styles.logoutButton}
        />

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
  avatarContainer: {
    marginBottom: theme.spacing.md,
  },
  username: {
    fontSize: theme.typography.sizes['2xl'],
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.xs,
  },
  email: {
    fontSize: theme.typography.sizes.base,
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing.md,
  },
  badge: {
    backgroundColor: theme.colors.primary[100],
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.full,
  },
  badgeText: {
    fontSize: theme.typography.sizes.xs,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.primary[700],
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
  logoutButton: {
    marginTop: theme.spacing['2xl'],
  },
  version: {
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.text.disabled,
    textAlign: 'center',
    marginTop: theme.spacing.xl,
  },
});
