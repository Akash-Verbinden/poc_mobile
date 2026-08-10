import React from "react";
import { useNavigation } from "@react-navigation/native";
import CommonHeader from "../../../components/CommonHeader";
import PrimaryButton from "../../../components/Buttons/PrimaryButton";

export default function ProgramsHeader() {
  const navigation = useNavigation();

  return (
    <CommonHeader
      title="List of programs and their Status"
      actionButtons={[
        <PrimaryButton
          title="Create Program"
          onPress={() => navigation.navigate("createProgram")}
          iconName="add-circle-outline"
        />,
      ]}
    />
  );
}