import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";
import Ionicons from "@react-native-vector-icons/ionicons";

export default function SecondaryButton({ title, onPress, iconName, style, textStyle }) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.outlineBtn, style]}
      activeOpacity={0.7}
    >
      {iconName && <Ionicons name={iconName} size={16} color="#1d4ed8" />}
      <Text style={[styles.outlineBtnText, textStyle]}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  outlineBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#93c5fd",
    backgroundColor: "transparent",
  },
  outlineBtnText: {
    fontSize: 14,
    color: "#1d4ed8",
    fontWeight: "500",
  },
});