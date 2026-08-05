import React from "react";
import { View, ScrollView, StyleSheet } from "react-native";
import CommunicationHeader from "./CommunicationHeader";
import CommunicationTable from "./CommunicationTable";

export default function Communication() {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <CommunicationHeader />
      <CommunicationTable />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9fafb",
  },
  content: {
    padding: 16,
    gap: 24,
  },
});