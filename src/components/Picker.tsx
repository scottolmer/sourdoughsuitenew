/**
 * Picker Component
 * A dropdown selector for forms
 */

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { theme } from '../theme';

export interface PickerOption {
  label: string;
  value: string;
  description?: string;
}

interface Props {
  label: string;
  value: string;
  options: PickerOption[];
  onValueChange: (value: string) => void;
  placeholder?: string;
  helperText?: string;
  error?: string;
}

export default function Picker({
  label,
  value,
  options,
  onValueChange,
  placeholder = 'Select an option',
  helperText,
  error,
}: Props) {
  const [modalVisible, setModalVisible] = React.useState(false);

  const selectedOption = options.find(opt => opt.value === value);

  const handleSelect = (optionValue: string) => {
    onValueChange(optionValue);
    setModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>

      <TouchableOpacity
        style={[styles.selector, error && styles.selectorError]}
        onPress={() => setModalVisible(true)}
        activeOpacity={0.7}
      >
        <Text style={[styles.selectorText, !selectedOption && styles.placeholder]}>
          {selectedOption ? selectedOption.label : placeholder}
        </Text>
        <Icon name="chevron-down" size={20} color={theme.colors.text.secondary} />
      </TouchableOpacity>

      {helperText && !error && (
        <Text style={styles.helperText}>{helperText}</Text>
      )}
      {error && (
        <Text style={styles.errorText}>{error}</Text>
      )}

      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <TouchableOpacity
            style={styles.modalBackdrop}
            activeOpacity={1}
            onPress={() => setModalVisible(false)}
          />
          <View style={styles.modalContentWrapper}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>{label}</Text>
                <TouchableOpacity onPress={() => setModalVisible(false)}>
                  <Icon name="close" size={24} color={theme.colors.text.primary} />
                </TouchableOpacity>
              </View>

              <ScrollView style={styles.optionsList}>
                {options.map((option) => (
                  <TouchableOpacity
                    key={option.value}
                    style={[
                      styles.option,
                      option.value === value && styles.optionSelected,
                    ]}
                    onPress={() => handleSelect(option.value)}
                    activeOpacity={0.7}
                  >
                    <View style={styles.optionContent}>
                      <Text
                        style={[
                          styles.optionLabel,
                          option.value === value && styles.optionLabelSelected,
                        ]}
                      >
                        {option.label}
                      </Text>
                      {option.description && (
                        <Text style={styles.optionDescription}>{option.description}</Text>
                      )}
                    </View>
                    {option.value === value && (
                      <Icon name="check" size={20} color={theme.colors.primary[500]} />
                    )}
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: theme.spacing.lg,
  },
  label: {
    fontSize: theme.typography.sizes.sm,
    fontWeight: theme.typography.weights.medium as any,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.xs,
  },
  selector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: theme.colors.background.paper,
    borderWidth: 1,
    borderColor: theme.colors.border.main,
    borderRadius: theme.borderRadius.md,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    minHeight: 48,
  },
  selectorError: {
    borderColor: theme.colors.error.main,
  },
  selectorText: {
    fontSize: theme.typography.sizes.base,
    color: theme.colors.text.primary,
    flex: 1,
  },
  placeholder: {
    color: theme.colors.text.disabled,
  },
  helperText: {
    fontSize: theme.typography.sizes.xs,
    color: theme.colors.text.secondary,
    marginTop: theme.spacing.xs,
  },
  errorText: {
    fontSize: theme.typography.sizes.xs,
    color: theme.colors.error.main,
    marginTop: theme.spacing.xs,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalBackdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  modalContentWrapper: {
    width: '90%',
    maxHeight: '80%',
  },
  modalContent: {
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.xl,
    overflow: 'hidden',
    maxHeight: '100%',
    ...theme.shadows.lg,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: theme.spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border.light,
  },
  modalTitle: {
    fontSize: theme.typography.sizes.lg,
    fontWeight: theme.typography.weights.semibold as any,
    color: theme.colors.text.primary,
  },
  optionsList: {
    maxHeight: 400,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: theme.spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border.light,
  },
  optionSelected: {
    backgroundColor: theme.colors.primary[50],
  },
  optionContent: {
    flex: 1,
  },
  optionLabel: {
    fontSize: theme.typography.sizes.base,
    color: theme.colors.text.primary,
    marginBottom: 2,
  },
  optionLabelSelected: {
    fontWeight: theme.typography.weights.semibold as any,
    color: theme.colors.primary[600],
  },
  optionDescription: {
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.text.secondary,
    marginTop: 2,
  },
});
