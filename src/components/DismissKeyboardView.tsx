/**
 * DismissKeyboardView - Wraps content to allow tapping outside to dismiss keyboard
 * Essential for iOS numeric keyboards that don't have a "Done" button
 */

import React from 'react';
import { TouchableWithoutFeedback, Keyboard, View, ViewStyle } from 'react-native';

interface Props {
    children: React.ReactNode;
    style?: ViewStyle;
}

export default function DismissKeyboardView({ children, style }: Props) {
    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
            <View style={[{ flex: 1 }, style]}>{children}</View>
        </TouchableWithoutFeedback>
    );
}
