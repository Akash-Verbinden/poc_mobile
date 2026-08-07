import React from 'react';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';

export default function SwitchButton({
  value = false,
  onValueChange,
  activeText = 'Active',
  inactiveText = 'Inactive',
  activeColor = '#3b82f6',
  inactiveColor = '#9ca3af',
  disabled = false,
}) {
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      disabled={disabled}
      onPress={() => onValueChange && onValueChange(!value)}
      style={[
        styles.switchPill,
        { backgroundColor: value ? activeColor : inactiveColor },
      ]}
    >
      <View
        style={[
          styles.switchThumb,
          value ? styles.thumbActive : styles.thumbInactive,
        ]}
      />
      <Text
        style={[
          styles.switchText,
          value ? styles.textActive : styles.textInactive,
        ]}
      >
        {value ? activeText : inactiveText}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  switchPill: {
    width: 90,
    height: 26,
    borderRadius: 13,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 3,
    position: 'relative',
  },
  switchThumb: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#ffffff',
    position: 'absolute',
  },
  thumbActive: {
    right: 3,
  },
  thumbInactive: {
    left: 3,
  },
  switchText: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight: '600',
    width: '100%',
  },
  textActive: {
    textAlign: 'left',
    paddingLeft: 8,
  },
  textInactive: {
    textAlign: 'right',
    paddingRight: 8,
  },
});