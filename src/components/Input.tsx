/**
 * Input Component
 */

import React from 'react';
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  TextInputProps,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: string;
  rightIcon?: string;
  onRightIconPress?: () => void;
  floatingLabel?: boolean;
}

export default function Input({
  label,
  error,
  helperText,
  leftIcon,
  rightIcon,
  onRightIconPress,
  style,
  secureTextEntry,
  floatingLabel = true,
  ...props
}: InputProps) {
  const [isPasswordVisible, setIsPasswordVisible] = React.useState(false);

  const showPasswordToggle = secureTextEntry;
  const actualSecureTextEntry = secureTextEntry && !isPasswordVisible;

  return (
    <View style={styles.wrapper}>
      {label && <Text style={styles.label}>{label}</Text>}

      <View style={[styles.container, error && styles.containerError]}>
        {leftIcon && (
          <Icon
            name={leftIcon}
            size={20}
            color="#78716c"
            style={styles.leftIcon}
          />
        )}

        <TextInput
          style={[styles.input, style]}
          placeholderTextColor="#a8a29e"
          secureTextEntry={actualSecureTextEntry}
          {...props}
        />

        {showPasswordToggle && (
          <TouchableOpacity
            onPress={() => setIsPasswordVisible(!isPasswordVisible)}
            style={styles.rightIcon}
          >
            <Icon
              name={isPasswordVisible ? 'eye-off' : 'eye'}
              size={20}
              color="#78716c"
            />
          </TouchableOpacity>
        )}

        {!showPasswordToggle && rightIcon && (
          <TouchableOpacity
            onPress={onRightIconPress}
            style={styles.rightIcon}
            disabled={!onRightIconPress}
          >
            <Icon
              name={rightIcon}
              size={20}
              color="#78716c"
            />
          </TouchableOpacity>
        )}
      </View>

      {error && <Text style={styles.errorText}>{error}</Text>}
      {!error && helperText && (
        <Text style={styles.helperText}>{helperText}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#0c0a09',
    marginBottom: 8,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#d6d3d1',
    borderRadius: 8,
    backgroundColor: '#ffffff',
    paddingHorizontal: 12,
    minHeight: 56,
  },
  containerError: {
    borderColor: '#dc2626',
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#000000',
    paddingVertical: 12,
    minHeight: 48,
  },
  leftIcon: {
    marginRight: 12,
  },
  rightIcon: {
    marginLeft: 12,
    padding: 4,
  },
  errorText: {
    fontSize: 12,
    color: '#dc2626',
    marginTop: 4,
    marginLeft: 4,
  },
  helperText: {
    fontSize: 12,
    color: '#78716c',
    marginTop: 4,
    marginLeft: 4,
  },
});
