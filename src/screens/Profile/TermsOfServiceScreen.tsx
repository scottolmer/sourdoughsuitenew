/**
 * Terms of Service Screen
 */

import React from 'react';
import { Text, StyleSheet, ScrollView } from 'react-native';
import Card from '../../components/Card';
import { theme } from '../../theme';

export default function TermsOfServiceScreen() {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      <Text style={styles.lastUpdated}>Last updated: February 2026</Text>

      <Card variant="outlined">
        <Text style={styles.sectionTitle}>1. Acceptance of Terms</Text>
        <Text style={styles.body}>
          By downloading, installing, or using Sourdough Suite ("the app"), you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use the app.
        </Text>
      </Card>

      <Card variant="outlined" style={styles.card}>
        <Text style={styles.sectionTitle}>2. Description of Service</Text>
        <Text style={styles.body}>
          Sourdough Suite is a mobile application designed to assist with sourdough baking. The app provides tools including starter tracking, recipe management, and baking calculators. All features are provided for informational and convenience purposes.
        </Text>
      </Card>

      <Card variant="outlined" style={styles.card}>
        <Text style={styles.sectionTitle}>3. Use of the App</Text>
        <Text style={styles.body}>
          You may use Sourdough Suite for personal, non-commercial purposes. You agree not to:{'\n'}
          {'\n'}• Reverse engineer, decompile, or disassemble the app{'\n'}
          • Modify, adapt, or create derivative works from the app{'\n'}
          • Distribute, license, or sell the app or its content{'\n'}
          • Use the app for any unlawful purpose
        </Text>
      </Card>

      <Card variant="outlined" style={styles.card}>
        <Text style={styles.sectionTitle}>4. User Data</Text>
        <Text style={styles.body}>
          All data you create within the app (starters, recipes, feeding logs, etc.) is stored locally on your device. You are solely responsible for maintaining backups of your data. We are not responsible for any data loss resulting from device failure, app uninstallation, or other causes.
        </Text>
      </Card>

      <Card variant="outlined" style={styles.card}>
        <Text style={styles.sectionTitle}>5. Calculator Accuracy</Text>
        <Text style={styles.body}>
          The baking calculators and tools provided in Sourdough Suite are intended as helpful guides. While we strive for accuracy, results may vary based on environmental factors such as temperature, humidity, flour type, and starter activity. The app's calculations should be used as a starting point and adjusted based on your experience and judgment.
        </Text>
      </Card>

      <Card variant="outlined" style={styles.card}>
        <Text style={styles.sectionTitle}>6. Intellectual Property</Text>
        <Text style={styles.body}>
          All content, design, graphics, and code within Sourdough Suite are the intellectual property of Sourdough Suite and are protected by applicable copyright and trademark laws. The Sourdough Suite name, logo, and branding are trademarks of Sourdough Suite.
        </Text>
      </Card>

      <Card variant="outlined" style={styles.card}>
        <Text style={styles.sectionTitle}>7. Disclaimer of Warranties</Text>
        <Text style={styles.body}>
          Sourdough Suite is provided "as is" and "as available" without warranties of any kind, either express or implied. We do not warrant that the app will be error-free, uninterrupted, or free of harmful components. Your use of the app is at your own risk.
        </Text>
      </Card>

      <Card variant="outlined" style={styles.card}>
        <Text style={styles.sectionTitle}>8. Limitation of Liability</Text>
        <Text style={styles.body}>
          To the fullest extent permitted by law, Sourdough Suite shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising out of or related to your use of the app, including but not limited to loss of data or baking outcomes.
        </Text>
      </Card>

      <Card variant="outlined" style={styles.card}>
        <Text style={styles.sectionTitle}>9. Changes to Terms</Text>
        <Text style={styles.body}>
          We reserve the right to modify these Terms of Service at any time. Changes will be reflected within the app with an updated "Last updated" date. Your continued use of the app after any changes constitutes acceptance of the new terms.
        </Text>
      </Card>

      <Card variant="outlined" style={styles.card}>
        <Text style={styles.sectionTitle}>10. Contact</Text>
        <Text style={styles.body}>
          If you have any questions about these Terms of Service, please reach out to us through our social media channels listed on the Profile page.
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
});
