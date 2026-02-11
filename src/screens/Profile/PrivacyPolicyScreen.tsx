/**
 * Privacy Policy Screen
 */

import React from 'react';
import { Text, StyleSheet, ScrollView } from 'react-native';
import Card from '../../components/Card';
import { theme } from '../../theme';

export default function PrivacyPolicyScreen() {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      <Text style={styles.lastUpdated}>Last updated: February 2026</Text>

      <Card variant="outlined">
        <Text style={styles.sectionTitle}>Introduction</Text>
        <Text style={styles.body}>
          Sourdough Suite ("we", "our", or "the app") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, and safeguard your information when you use our mobile application.
        </Text>
      </Card>

      <Card variant="outlined" style={styles.card}>
        <Text style={styles.sectionTitle}>Information We Collect</Text>
        <Text style={styles.body}>
          Sourdough Suite is designed to work entirely offline. All data you create — including starters, recipes, feeding logs, and calculator inputs — is stored locally on your device. We do not collect, transmit, or store any of your personal data on external servers.
        </Text>
        <Text style={styles.body}>
          Specifically, we do <Text style={styles.bold}>not</Text> collect:{'\n'}
          {'\n'}• Personal information (name, email, phone number){'\n'}
          • Location data{'\n'}
          • Usage analytics or tracking data{'\n'}
          • Photos, camera, or microphone access{'\n'}
          • Contact lists or other device data
        </Text>
      </Card>

      <Card variant="outlined" style={styles.card}>
        <Text style={styles.sectionTitle}>Local Data Storage</Text>
        <Text style={styles.body}>
          All app data is stored locally on your device using on-device storage. This data is only accessible to the Sourdough Suite app and is not shared with any third parties.
        </Text>
        <Text style={styles.body}>
          If you uninstall the app, all locally stored data will be permanently deleted. We recommend exporting any important recipes or data before uninstalling.
        </Text>
      </Card>

      <Card variant="outlined" style={styles.card}>
        <Text style={styles.sectionTitle}>Third-Party Services</Text>
        <Text style={styles.body}>
          The app may contain links to external websites (such as our social media pages). These third-party sites have their own privacy policies, and we are not responsible for their content or practices. We encourage you to review their privacy policies before interacting with them.
        </Text>
      </Card>

      <Card variant="outlined" style={styles.card}>
        <Text style={styles.sectionTitle}>Children's Privacy</Text>
        <Text style={styles.body}>
          Sourdough Suite does not knowingly collect any personal information from children under 13. Since the app does not collect personal data from any user, it is safe for users of all ages.
        </Text>
      </Card>

      <Card variant="outlined" style={styles.card}>
        <Text style={styles.sectionTitle}>Changes to This Policy</Text>
        <Text style={styles.body}>
          We may update this Privacy Policy from time to time. Any changes will be reflected in the app with an updated "Last updated" date. Continued use of the app after changes constitutes acceptance of the revised policy.
        </Text>
      </Card>

      <Card variant="outlined" style={styles.card}>
        <Text style={styles.sectionTitle}>Contact Us</Text>
        <Text style={styles.body}>
          If you have any questions about this Privacy Policy, please reach out to us through our social media channels listed on the Profile page.
        </Text>
      </Card>
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
  lastUpdated: {
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.text.disabled,
    marginBottom: theme.spacing.lg,
  },
  card: {
    marginTop: theme.spacing.md,
  },
  sectionTitle: {
    fontSize: theme.typography.sizes.base,
    fontWeight: theme.typography.weights.semibold as any,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.sm,
  },
  body: {
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.text.secondary,
    lineHeight: 20,
    marginBottom: theme.spacing.sm,
  },
  bold: {
    fontWeight: theme.typography.weights.bold as any,
  },
});
