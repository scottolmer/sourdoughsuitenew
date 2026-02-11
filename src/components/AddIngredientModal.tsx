/**
 * Add Ingredient Modal
 * Modal for adding custom ingredients to recipes
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Button from './Button';
import BasicInput from './BasicInput';
import Picker, { PickerOption } from './Picker';
import { theme } from '../theme';
import { RecipeIngredient } from '../types';

interface Props {
  visible: boolean;
  onClose: () => void;
  onAdd: (ingredient: RecipeIngredient) => void;
}

export default function AddIngredientModal({ visible, onClose, onAdd }: Props) {
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [unit, setUnit] = useState('g');
  const [type, setType] = useState<RecipeIngredient['type']>('other');

  const unitOptions: PickerOption[] = [
    { label: 'Grams (g)', value: 'g', description: 'Weight in grams' },
    { label: 'Percentage (%)', value: '%', description: 'Percentage of flour weight' },
  ];

  const typeOptions: PickerOption[] = [
    { label: 'Flour', value: 'flour', description: 'Additional flour types' },
    { label: 'Fat', value: 'fat', description: 'Oils, butter, etc.' },
    { label: 'Sweetener', value: 'sweetener', description: 'Honey, sugar, etc.' },
    { label: 'Inclusion', value: 'inclusion', description: 'Seeds, nuts, fruits, etc.' },
    { label: 'Other', value: 'other', description: 'Anything else' },
  ];

  const handleAdd = () => {
    if (!name.trim()) {
      Alert.alert('Error', 'Please enter an ingredient name');
      return;
    }

    if (!amount || parseFloat(amount) <= 0) {
      Alert.alert('Error', 'Please enter a valid amount');
      return;
    }

    const ingredient: RecipeIngredient = {
      id: Date.now().toString(),
      name: name.trim(),
      amount: parseFloat(amount),
      unit,
      type,
    };

    onAdd(ingredient);

    // Reset form
    setName('');
    setAmount('');
    setUnit('g');
    setType('other');
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        style={styles.overlay}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <TouchableOpacity
          style={styles.backdrop}
          activeOpacity={1}
          onPress={onClose}
        />
        <View style={styles.modalContent}>
          <View style={styles.header}>
            <Text style={styles.title}>Add Ingredient</Text>
            <TouchableOpacity onPress={onClose}>
              <Icon name="close" size={24} color={theme.colors.text.primary} />
            </TouchableOpacity>
          </View>

          <ScrollView
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={styles.scrollContent}
          >
            <View style={styles.form}>
              <BasicInput
                label="Ingredient Name"
                placeholder="e.g., Sunflower Seeds, Olive Oil"
                value={name}
                onChangeText={setName}
              />

              <BasicInput
                label="Amount"
                placeholder="100"
                value={amount}
                onChangeText={setAmount}
                keyboardType="numeric"
              />

              <Picker
                label="Unit"
                value={unit}
                options={unitOptions}
                onValueChange={setUnit}
              />

              <Picker
                label="Type"
                value={type || 'other'}
                options={typeOptions}
                onValueChange={(value) => setType(value as RecipeIngredient['type'])}
              />
            </View>

            <View style={styles.actions}>
              <Button
                title="Cancel"
                variant="outline"
                onPress={onClose}
                style={styles.button}
              />
              <Button
                title="Add"
                onPress={handleAdd}
                style={styles.button}
                leftIcon="plus"
              />
            </View>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  modalContent: {
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.xl,
    width: '90%',
    maxHeight: '80%',
    ...theme.shadows.lg,
  },
  scrollContent: {
    flexGrow: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: theme.spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border.light,
  },
  title: {
    fontSize: theme.typography.sizes.xl,
    fontWeight: theme.typography.weights.bold as any,
    color: theme.colors.text.primary,
  },
  form: {
    padding: theme.spacing.lg,
  },
  actions: {
    flexDirection: 'row',
    gap: theme.spacing.md,
    padding: theme.spacing.lg,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border.light,
  },
  button: {
    flex: 1,
  },
});
