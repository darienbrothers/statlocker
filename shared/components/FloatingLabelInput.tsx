import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TextInput, Animated, StyleSheet, TextInputProps, Pressable } from 'react-native';
import { Colors, Typography, Spacing, BorderRadius } from '../theme';

interface FloatingLabelInputProps extends TextInputProps {
  label: string;
  value: string;
  containerStyle?: object;
}

const FloatingLabelInput = React.forwardRef<TextInput, FloatingLabelInputProps>(({ label, value, containerStyle, ...props }, ref) => {
  const inputRef = useRef<TextInput>(null);
  const [isFocused, setIsFocused] = useState(false);
  const labelAnim = useRef(new Animated.Value(value ? 1 : 0)).current;

  useEffect(() => {
    Animated.timing(labelAnim, {
      toValue: isFocused || value ? 1 : 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  }, [isFocused, value]);

  const handleFocus = (e: any) => {
    setIsFocused(true);
    props.onFocus?.(e);
  };

  const handleBlur = (e: any) => {
    setIsFocused(false);
    props.onBlur?.(e);
  };

  const labelStyle = {
    position: 'absolute' as 'absolute',
    left: Spacing.lg,
    top: labelAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [18, -8],
    }),
    fontSize: labelAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [16, 12],
    }),
    color: isFocused ? Colors.brand.primary : Colors.text.secondary,
    backgroundColor: Colors.surface.elevated,
    paddingHorizontal: 4,
    zIndex: 1,
    fontFamily: Typography.fonts.bodyMedium,
    fontWeight: '600' as '600',
  };

  return (
    <Pressable 
      style={containerStyle}
      onPress={() => inputRef.current?.focus()}
    >
      <Animated.Text style={labelStyle}>{label}</Animated.Text>
      <TextInput
        ref={inputRef}
        style={[
          styles.input,
          {
            borderColor: isFocused ? Colors.brand.primary : Colors.border.secondary,
          },
        ]}
        value={value}
        onFocus={handleFocus}
        onBlur={handleBlur}
        placeholder=''
        placeholderTextColor={Colors.text.tertiary}
        {...props}
      />
    </Pressable>
  );
});

const styles = StyleSheet.create({
  input: {
    fontSize: 18,
    lineHeight: 24,
    fontFamily: Typography.fonts.body,
    color: Colors.text.primary,
    backgroundColor: Colors.surface.primary,
    borderRadius: BorderRadius.lg,
    borderWidth: 2,
    borderColor: Colors.border.secondary,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.lg,
    minHeight: 56,
  },
});

export default FloatingLabelInput;
