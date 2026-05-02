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
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { theme } from '../theme';

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
            name={leftIcon}
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
    fontSize: theme.typography.sizes.xs,
    fontFamily: theme.typography.fonts.semibold,
    color: theme.colors.modernist.graphite,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    marginBottom: theme.spacing.xs,
    marginLeft: theme.spacing.xs, // Slight alignment with input
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.colors.modernist.hairlineDark,
    borderRadius: theme.borderRadius.md,
    backgroundColor: theme.colors.modernist.porcelain,
    paddingHorizontal: theme.spacing.md,
    minHeight: 52, // Taller touch target
  },
  inputContainerFocused: {
    borderColor: theme.colors.modernist.ruleTeal,
    backgroundColor: theme.colors.modernist.porcelain,
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
