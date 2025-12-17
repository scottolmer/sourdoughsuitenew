/**
 * Home Screen
 * Main dashboard for the app
 */

import React from 'react';
import {View, Text, StyleSheet, ScrollView, TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {useNavigation} from '@react-navigation/native';
import Card from '../../components/Card';
import {theme} from '../../theme';

export default function HomeScreen() {
  const navigation = useNavigation();

  const quickActions = [
    {
      icon: 'calculator',
      title: 'Calculators',
      description: '9 professional tools',
      color: theme.colors.primary[500],
      onPress: () => navigation.navigate('ToolsTab' as never),
    },
    {
      icon: 'bacteria',
      title: 'My Starters',
      description: 'Track your starters',
      color: theme.colors.success.main,
      onPress: () => navigation.navigate('StartersTab' as never),
    },
  ];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Icon name="bread-slice" size={40} color={theme.colors.primary[500]} />
          <View style={styles.headerText}>
            <Text style={styles.headerTitle}>Sourdough Suite</Text>
            <Text style={styles.headerSubtitle}>Your baking companion</Text>
          </View>
        </View>
      </View>

      <View style={styles.content}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        {quickActions.map((action, index) => (
          <TouchableOpacity
            key={index}
            onPress={action.onPress}
            activeOpacity={0.7}
          >
            <Card
              variant="elevated"
              padding="lg"
              style={styles.actionCard}
            >
              <View style={styles.actionContent}>
                <View
                  style={[
                    styles.actionIcon,
                    {backgroundColor: action.color + '20'},
                  ]}
                >
                  <Icon name={action.icon} size={32} color={action.color} />
                </View>
                <View style={styles.actionInfo}>
                  <Text style={styles.actionTitle}>{action.title}</Text>
                  <Text style={styles.actionDescription}>
                    {action.description}
                  </Text>
                </View>
                <Icon
                  name="chevron-right"
                  size={24}
                  color={theme.colors.text.disabled}
                />
              </View>
            </Card>
          </TouchableOpacity>
        ))}

        <Card variant="filled" padding="lg" style={styles.infoCard}>
          <View style={styles.infoHeader}>
            <Icon
              name="information"
              size={24}
              color={theme.colors.info.main}
            />
            <Text style={styles.infoTitle}>Welcome!</Text>
          </View>
          <Text style={styles.infoText}>
            Use the tabs below to navigate between Calculators and Starters.
            All your data is stored locally on your device.
          </Text>
        </Card>
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
    backgroundColor: theme.colors.white,
    padding: theme.spacing.xl,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border.light,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerText: {
    marginLeft: theme.spacing.md,
  },
  headerTitle: {
    fontSize: theme.typography.sizes['2xl'],
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.text.primary,
  },
  headerSubtitle: {
    fontSize: theme.typography.sizes.base,
    color: theme.colors.text.secondary,
    marginTop: theme.spacing.xs,
  },
  content: {
    padding: theme.spacing.md,
  },
  sectionTitle: {
    fontSize: theme.typography.sizes.xl,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.md,
  },
  actionCard: {
    marginBottom: theme.spacing.md,
  },
  actionContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionIcon: {
    width: 64,
    height: 64,
    borderRadius: theme.borderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionInfo: {
    flex: 1,
    marginLeft: theme.spacing.md,
  },
  actionTitle: {
    fontSize: theme.typography.sizes.lg,
    fontWeight: theme.typography.weights.semibold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.xs,
  },
  actionDescription: {
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.text.secondary,
  },
  infoCard: {
    marginTop: theme.spacing.lg,
  },
  infoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  infoTitle: {
    fontSize: theme.typography.sizes.lg,
    fontWeight: theme.typography.weights.semibold,
    color: theme.colors.text.primary,
    marginLeft: theme.spacing.sm,
  },
  infoText: {
    fontSize: theme.typography.sizes.base,
    color: theme.colors.text.secondary,
    lineHeight: 24,
  },
});
