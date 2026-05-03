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
      <Text style={styles.lastUpdated}>Last updated: May 2026</Text>

      <Card variant="outlined">
        <Text style={styles.sectionTitle}>Introduction</Text>
        <Text style={styles.body}>
          Sourdough Suite ("we", "our", or "the app") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, and safeguard your information when you use our mobile application.
        </Text>
      </Card>

      <Card variant="outlined" style={styles.card}>
        <Text style={styles.sectionTitle}>Information We Collect</Text>
        <Text style={styles.body}>
          Most Sourdough Suite data is stored locally on your device, including starters, recipes, feeding logs, saved bake plans, diagnoses, and calculator inputs.
        </Text>
        <Text style={styles.body}>
          If you use Photo Rescue, the app may send the photo you choose, along with the context you provide, to our Photo Rescue service so the image can be analyzed and a baking diagnosis can be returned. Photo Rescue is optional, and you may use the quick rescue checklist instead.
        </Text>
        <Text style={styles.body}>
          We do <Text style={styles.bold}>not</Text> collect:{'\n'}
          {'\n'}• Personal information (name, email, phone number){'\n'}
          • Location data{'\n'}
          • Usage analytics or tracking data{'\n'}
          • Microphone data{'\n'}
          • Contact lists or other device data
        </Text>
      </Card>

      <Card variant="outlined" style={styles.card}>
        <Text style={styles.sectionTitle}>Local Data Storage</Text>
        <Text style={styles.body}>
          Starters, recipes, feeding logs, calculator inputs, saved diagnoses, and bake plans are stored locally on your device using on-device storage. This data is only accessible to the Sourdough Suite app and is not shared with any third parties unless you choose to submit a photo for Photo Rescue.
        </Text>
        <Text style={styles.body}>
          If you uninstall the app, all locally stored data will be permanently deleted. We recommend exporting any important recipes or data before uninstalling.
        </Text>
      </Card>

      <Card variant="outlined" style={styles.card}>
        <Text style={styles.sectionTitle}>Third-Party Services</Text>
        <Text style={styles.body}>
          Photo Rescue may use a third-party AI service to analyze the baking photo and context you submit. Do not submit photos that contain faces, personal documents, addresses, or other sensitive information.
        </Text>
        <Text style={styles.body}>
          The app may contain links to external websites. These third-party sites have their own privacy policies, and we are not responsible for their content or practices.
        </Text>
      </Card>

      <Card variant="outlined" style={styles.card}>
        <Text style={styles.sectionTitle}>Photo Library and Camera Access</Text>
        <Text style={styles.body}>
          Sourdough Suite requests photo library or camera access only when you choose to add a baking photo for Photo Rescue. The app does not access your photos in the background.
        </Text>
      </Card>

      <Card variant="outlined" style={styles.card}>
        <Text style={styles.sectionTitle}>Children's Privacy</Text>
        <Text style={styles.body}>
          Sourdough Suite does not knowingly collect any personal information from children under 13.
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
          If you have any questions about this Privacy Policy, visit the support page linked from the App Store listing or contact @scottolmer on X.
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
