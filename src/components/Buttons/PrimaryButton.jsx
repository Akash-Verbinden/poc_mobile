import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";
import Ionicons from "@react-native-vector-icons/ionicons";

export default function PrimaryButton({ title, onPress, iconName, style, textStyle }) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.primaryBtn, style]}
      activeOpacity={0.7}
    >
      {iconName && <Ionicons name={iconName} size={16} color="#ffffff" />}
      <Text style={[styles.primaryBtnText, textStyle]}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  primaryBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: "#2563eb",
  },
  primaryBtnText: {
    fontSize: 14,
    color: "#ffffff",
    fontWeight: "500",
  },
});