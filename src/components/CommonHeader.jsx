import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function CommonHeader({
  title,
  actionButtons = [],
  containerStyle,
}) {
  return (
    <View style={[styles.container, containerStyle]}>
      {/* Title & Action Buttons */}
      <View style={styles.topRow}>
        {title && <Text style={styles.title}>{title}</Text>}

        {actionButtons.length > 0 && (
          <View style={styles.buttonGroup}>
            {actionButtons.map((button, index) => (
              <React.Fragment key={index}>{button}</React.Fragment>
            ))}
          </View>
        )}
      </View>

      {/* Description Text */}
      {/* {description && (
        <Text style={styles.description}>{description}</Text>
      )} */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 16,
    marginBottom: 16,
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
//   description: {
//     fontStyle: "italic",
//     fontSize: 13,
//     color: "#000000",
//     lineHeight: 20,
//   },
});