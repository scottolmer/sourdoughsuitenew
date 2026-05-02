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
            size={18}
            color={isFocused ? theme.colors.modernist.ink : theme.colors.modernist.graphiteMuted}
            style={styles.leftIcon}
          />
        )}
        <TextInput
          style={[styles.input, leftIcon && styles.inputWithIcon, style]}
          placeholderTextColor={theme.colors.modernist.graphiteMuted}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          selectionColor={theme.colors.primary[600]}
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
    borderColor: theme.colors.modernist.hairline,
    borderRadius: 8,
    backgroundColor: theme.colors.modernist.porcelain,
    paddingHorizontal: theme.spacing.md,
    minHeight: 48,
    overflow: 'hidden',
  },
  inputContainerFocused: {
    borderColor: theme.colors.modernist.ink,
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
