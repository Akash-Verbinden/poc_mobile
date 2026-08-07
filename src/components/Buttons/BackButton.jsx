import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";
import Ionicons from "@react-native-vector-icons/ionicons";
import { useNavigation } from "@react-navigation/native";

export default function BackButton({title,style,textStyle}) {
    const navigation = useNavigation();
  return (
    <TouchableOpacity
      onPress={() => navigation.goBack()}
      style={[styles.backBtn, style]}
      activeOpacity={0.7}
    >
     <Ionicons name="arrow-back" size={20} color="#000" />
      <Text style={[styles.backText, textStyle]}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
     backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 4,
    flexShrink: 1,
  },
   backText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#000000',
  },
});