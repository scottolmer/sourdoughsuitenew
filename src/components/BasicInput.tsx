/**
 * Basic Input Component
 * Modern, clean, and accessible
 */

import React, { useState } from 'react';
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  TextInputProps,
} from 'react-native';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import { theme } from '../theme';
import type { MaterialCommunityIconName } from '../types/icons';

interface BasicInputProps extends TextInputProps {
  label?: string;
  helperText?: string;
  leftIcon?: string;
  containerStyle?: any;
}

export default function BasicInput({
  label,
  helperText,
  leftIcon,
  containerStyle,
  style,
  ...props
}: BasicInputProps) {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View style={[styles.wrapper, containerStyle]}>
      {label && <Text style={styles.label}>{label}</Text>}
      <View style={[
        styles.inputContainer,
        isFocused && styles.inputContainerFocused,
      ]}>
        {leftIcon && (
          <Icon
            name={(leftIcon as unknown) as MaterialCommunityIconName}
            size={20}
            color={isFocused ? theme.colors.primary[500] : theme.colors.text.tertiary}
            style={styles.leftIcon}
          />
        )}
        <TextInput
          style={[styles.input, leftIcon && styles.inputWithIcon, style]}
          placeholderTextColor={theme.colors.text.disabled}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          selectionColor={theme.colors.primary[500]}
          {...props}
        />
      </View>
      {helperText && <Text style={styles.helperText}>{helperText}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: theme.spacing.md,
  },
  label: {
    fontSize: theme.typography.sizes.sm,
    fontFamily: theme.typography.fonts.medium,
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing.xs,
    marginLeft: theme.spacing.xs, // Slight alignment with input
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E3CDAA',
    borderRadius: theme.borderRadius.lg,
    backgroundColor: '#FFF9ED',
    paddingHorizontal: theme.spacing.md,
    minHeight: 52,
    shadowColor: '#5A3A25',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 3,
    elevation: 1,
  },
  inputContainerFocused: {
    borderColor: '#C88A1D',
    backgroundColor: '#FFF9ED',
    shadowColor: '#C88A1D',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.18,
    shadowRadius: 6,
    elevation: 3,
  },
  leftIcon: {
    marginRight: theme.spacing.sm,
  },
  input: {
    flex: 1,
    paddingVertical: theme.spacing.md,
    fontSize: theme.typography.sizes.base,
    fontFamily: theme.typography.fonts.regular,
    color: theme.colors.text.primary,
  },
  inputWithIcon: {
    paddingLeft: 0,
  },
  helperText: {
    fontSize: theme.typography.sizes.xs,
    fontFamily: theme.typography.fonts.regular,
    color: theme.colors.text.tertiary,
    marginTop: theme.spacing.xs,
    marginLeft: theme.spacing.xs,
  },
});
