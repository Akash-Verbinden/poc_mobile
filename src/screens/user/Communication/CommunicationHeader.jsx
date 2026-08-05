import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import Ionicons from "@react-native-vector-icons/ionicons";

export default function CommunicationHeader() {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      {/* Title & Action Buttons */}
      <View style={styles.topRow}>
        <Text style={styles.title}>
          List of emails templates and their Status
        </Text>

        <View style={styles.buttonGroup}>
          {/* Bulk Email */}
          <TouchableOpacity
            onPress={() => navigation.navigate("bulkEmail")}
            style={styles.outlineBtn}
            activeOpacity={0.7}
          >
            <Ionicons name="add-circle-outline" size={16} color="#1d4ed8" />
            <Text style={styles.outlineBtnText}>Bulk Email</Text>
          </TouchableOpacity>

          {/* Create Template */}
          <TouchableOpacity
            onPress={() => navigation.navigate("createTemplate")}
            style={styles.primaryBtn}
            activeOpacity={0.7}
          >
            <Ionicons name="add-circle-outline" size={16} color="#ffffff" />
            <Text style={styles.primaryBtnText}>Create Template</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Description Text */}
      <Text style={styles.description}>
        This tab enables you to create and manage email templates. The email
        templates can be reused at any time. To create a new email template,
        click on <Text style={styles.highlightText}>“Create Template”</Text>{" "}
        button. To send emails, click on{" "}
        <Text style={styles.highlightText}>“Bulk Email”</Text> button.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 16,
  },
  topRow: {
    flexDirection: "column",
    gap: 12,
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
    color: "#111827",
  },
  buttonGroup: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
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
  description: {
    fontStyle: "italic",
    fontSize: 13,
    color: "#000000",
    lineHeight: 20,
  },
  highlightText: {
    color: "#2563eb",
    fontWeight: "500",
  },
});