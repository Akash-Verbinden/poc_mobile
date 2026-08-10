import React from "react";
import { Text, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import CommonHeader from "../../../components/CommonHeader";
import PrimaryButton from "../../../components/Buttons/PrimaryButton";
import SecondaryButton from "../../../components/Buttons/SecondaryButton";

export default function CommunicationHeader() {
  const navigation = useNavigation();

  return (
    <CommonHeader
      title="List of emails templates and their Status"
      containerStyle={{ marginBottom: 0 }} // Override container style if needed
      actionButtons={[
        <SecondaryButton
          title="Bulk Email"
          onPress={() => navigation.navigate("bulkEmail")}
          iconName="add-circle-outline"
        />,
        <PrimaryButton
          title="Create Template"
          onPress={() => navigation.navigate("createTemplate")}
          iconName="add-circle-outline"
        />,
      ]}
      description={
        <>
          This tab enables you to create and manage email templates. The email
          templates can be reused at any time. To create a new email template,
          click on <Text style={styles.highlightText}>“Create Template”</Text>{" "}
          button. To send emails, click on{" "}
          <Text style={styles.highlightText}>“Bulk Email”</Text> button.
        </>
      }
    />
  );
}

const styles = StyleSheet.create({
  highlightText: {
    color: "#2563eb",
    fontWeight: "500",
  },
});