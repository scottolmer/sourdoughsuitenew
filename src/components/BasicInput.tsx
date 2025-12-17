/**
 * Basic Input Component - Simple and functional
 */

import React from 'react';
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
  return (
    <View style={[styles.wrapper, containerStyle]}>
      {label && <Text style={styles.label}>{label}</Text>}
      <View style={styles.inputContainer}>
        {leftIcon && (
          <Icon
            name={leftIcon}
            size={20}
            color={theme.colors.text.tertiary}
            style={styles.leftIcon}
          />
        )}
        <TextInput
          style={[styles.input, leftIcon && styles.inputWithIcon, style]}
          placeholderTextColor={theme.colors.text.disabled}
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
    fontWeight: theme.typography.weights.medium as any,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.xs,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.colors.border.main,
    borderRadius: theme.borderRadius.md,
    backgroundColor: theme.colors.white,
    paddingHorizontal: theme.spacing.md,
    minHeight: 48,
  },
  leftIcon: {
    marginRight: theme.spacing.xs,
  },
  input: {
    flex: 1,
    paddingVertical: theme.spacing.md,
    fontSize: theme.typography.sizes.base,
    color: theme.colors.text.primary,
  },
  inputWithIcon: {
    paddingLeft: 0,
  },
  helperText: {
    fontSize: theme.typography.sizes.xs,
    color: theme.colors.text.tertiary,
    marginTop: theme.spacing.xs,
    marginLeft: theme.spacing.xs,
  },
});
