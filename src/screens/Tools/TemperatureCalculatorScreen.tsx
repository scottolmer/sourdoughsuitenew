/**
 * Temperature Calculator
 * Calculate desired dough temperature (DDT)
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Button from '../../components/Button';
import BasicInput from '../../components/BasicInput';
import Card from '../../components/Card';
import { theme } from '../../theme';

export default function TemperatureCalculatorScreen() {
  const [targetTemp, setTargetTemp] = useState('78');
  const [roomTemp, setRoomTemp] = useState('');
  const [flourTemp, setFlourTemp] = useState('');
  const [starterTemp, setStarterTemp] = useState('');
  const [frictionFactor, setFrictionFactor] = useState('25');
  const [waterTemp, setWaterTemp] = useState('');

  const calculateWaterTemp = () => {
    const target = parseFloat(targetTemp);
    const room = parseFloat(roomTemp);
    const flour = parseFloat(flourTemp);
    const starter = parseFloat(starterTemp);
    const friction = parseFloat(frictionFactor);

    if (!target || !room || !flour || !starter) return;

    // DDT formula: Target Temp × 4 = Room Temp + Flour Temp + Starter Temp + Water Temp + Friction Factor
    const calculatedWaterTemp =
      target * 4 - room - flour - starter - friction;

    setWaterTemp(calculatedWaterTemp.toFixed(1));
  };

  const clearAll = () => {
    setTargetTemp('78');
    setRoomTemp('');
    setFlourTemp('');
    setStarterTemp('');
    setFrictionFactor('25');
    setWaterTemp('');
  };

  const getWaterTempNote = () => {
    const temp = parseFloat(waterTemp);
    if (!temp) return null;

    if (temp < 32) return { text: 'Use ice water', color: theme.colors.info.main };
    if (temp > 100)
      return { text: 'Temp too high! Adjust inputs', color: theme.colors.error.main };
    if (temp > 85)
      return { text: 'Warm water needed', color: theme.colors.warning.main };
    return { text: 'Cold/room temp water', color: theme.colors.success.main };
  };

  const waterTempNote = getWaterTempNote();

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header}>
          <Icon name="thermometer" size={48} color={theme.colors.warning.main} />
          <Text style={styles.headerTitle}>Temperature Calculator</Text>
          <Text style={styles.headerSubtitle}>
            Calculate water temperature for desired dough temperature
          </Text>
        </View>

        <View style={styles.content}>
          {/* Target Temperature */}
          <Card variant="elevated">
            <Text style={styles.sectionTitle}>Target Dough Temperature (DDT)</Text>
            <BasicInput
              label="Desired Final Dough Temp"
              placeholder="e.g., 78"
              value={targetTemp}
              onChangeText={setTargetTemp}
              keyboardType="numeric"
              leftIcon="target"
              helperText="°F (typically 75-80°F for bread)"
            />
          </Card>

          {/* Temperature Inputs */}
          <Card variant="elevated">
            <Text style={styles.sectionTitle}>Current Temperatures</Text>

            <BasicInput
              label="Room Temperature"
              placeholder="e.g., 72"
              value={roomTemp}
              onChangeText={setRoomTemp}
              keyboardType="numeric"
              leftIcon="home-thermometer"
              helperText="°F"
            />

            <BasicInput
              label="Flour Temperature"
              placeholder="e.g., 70"
              value={flourTemp}
              onChangeText={setFlourTemp}
              keyboardType="numeric"
              leftIcon="thermometer-lines"
              helperText="°F (use room temp if unsure)"
            />

            <BasicInput
              label="Starter/Preferment Temperature"
              placeholder="e.g., 75"
              value={starterTemp}
              onChangeText={setStarterTemp}
              keyboardType="numeric"
              leftIcon="bacteria"
              helperText="°F"
            />

            <BasicInput
              label="Friction Factor"
              placeholder="e.g., 25"
              value={frictionFactor}
              onChangeText={setFrictionFactor}
              keyboardType="numeric"
              leftIcon="cog"
              helperText="Heat from mixing (20-30°F typical)"
            />
          </Card>

          {/* Result */}
          {waterTemp && (
            <Card variant="filled" style={styles.resultCard}>
              <Text style={styles.resultLabel}>Required Water Temperature</Text>
              <Text style={styles.resultValue}>{waterTemp}°F</Text>
              {waterTempNote && (
                <View
                  style={[
                    styles.noteBadge,
                    { backgroundColor: waterTempNote.color + '20' },
                  ]}
                >
                  <Icon name="information" size={16} color={waterTempNote.color} />
                  <Text style={[styles.noteText, { color: waterTempNote.color }]}>
                    {waterTempNote.text}
                  </Text>
                </View>
              )}
            </Card>
          )}

          {/* Actions */}
          <View style={styles.actions}>
            <Button
              title="Calculate Water Temp"
              onPress={calculateWaterTemp}
              fullWidth
              leftIcon="calculator"
            />
            <Button
              title="Clear All"
              variant="outline"
              onPress={clearAll}
              fullWidth
            />
          </View>

          {/* Info Card */}
          <Card variant="outlined">
            <Text style={styles.infoTitle}>Desired Dough Temperature (DDT)</Text>
            <Text style={styles.infoText}>
              <Text style={styles.infoBold}>Formula:</Text>{'\n'}
              DDT × 4 = Room Temp + Flour Temp + Starter Temp + Water Temp + Friction Factor{'\n\n'}
              <Text style={styles.infoBold}>Typical DDT ranges:</Text>{'\n'}
              • 75-78°F: Standard bread dough{'\n'}
              • 78-82°F: Faster fermentation{'\n'}
              • 72-75°F: Slower, more flavor{'\n\n'}
              <Text style={styles.infoBold}>Friction Factor:</Text>{'\n'}
              Heat generated by mixing. Start with 25°F for stand mixer, adjust based on experience.
            </Text>
          </Card>

          {/* Quick Reference */}
          <Card variant="outlined" style={styles.referenceCard}>
            <Text style={styles.infoTitle}>Temperature Quick Reference</Text>
            <View style={styles.referenceRow}>
              <Text style={styles.referenceLabel}>Slow fermentation:</Text>
              <Text style={styles.referenceValue}>72-75°F</Text>
            </View>
            <View style={styles.referenceRow}>
              <Text style={styles.referenceLabel}>Standard bread:</Text>
              <Text style={styles.referenceValue}>75-78°F</Text>
            </View>
            <View style={styles.referenceRow}>
              <Text style={styles.referenceLabel}>Fast fermentation:</Text>
              <Text style={styles.referenceValue}>78-82°F</Text>
            </View>
            <View style={styles.referenceRow}>
              <Text style={styles.referenceLabel}>Pizza dough:</Text>
              <Text style={styles.referenceValue}>80-85°F</Text>
            </View>
          </Card>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background.default,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  header: {
    padding: theme.spacing.xl,
    backgroundColor: theme.colors.white,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border.light,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: theme.typography.sizes['2xl'],
    fontWeight: theme.typography.weights.bold as any,
    color: theme.colors.text.primary,
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.xs,
  },
  headerSubtitle: {
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.text.secondary,
    textAlign: 'center',
  },
  content: {
    padding: theme.spacing.lg,
  },
  sectionTitle: {
    fontSize: theme.typography.sizes.lg,
    fontWeight: theme.typography.weights.semibold as any,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.md,
  },
  resultCard: {
    backgroundColor: theme.colors.warning.light + '40',
    alignItems: 'center',
    padding: theme.spacing.xl,
  },
  resultLabel: {
    fontSize: theme.typography.sizes.base,
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing.sm,
  },
  resultValue: {
    fontSize: 48,
    fontWeight: theme.typography.weights.bold as any,
    color: theme.colors.warning.main,
    marginBottom: theme.spacing.md,
  },
  noteBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.full,
  },
  noteText: {
    fontSize: theme.typography.sizes.sm,
    fontWeight: theme.typography.weights.medium as any,
    marginLeft: theme.spacing.xs,
  },
  actions: {
    marginBottom: theme.spacing.md,
  },
  infoTitle: {
    fontSize: theme.typography.sizes.base,
    fontWeight: theme.typography.weights.semibold as any,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.sm,
  },
  infoText: {
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.text.secondary,
    lineHeight: 20,
  },
  infoBold: {
    fontWeight: theme.typography.weights.semibold as any,
    color: theme.colors.text.primary,
  },
  referenceCard: {
    backgroundColor: theme.colors.background.paper,
  },
  referenceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: theme.spacing.xs,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border.light,
  },
  referenceLabel: {
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.text.secondary,
  },
  referenceValue: {
    fontSize: theme.typography.sizes.sm,
    fontWeight: theme.typography.weights.semibold as any,
    color: theme.colors.text.primary,
  },
});
