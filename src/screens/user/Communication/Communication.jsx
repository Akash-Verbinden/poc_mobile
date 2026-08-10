import React from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import CommunicationHeader from './CommunicationHeader';
import CommunicationTable from './CommunicationTable';
import DescriptionText from '../../../components/DescriptionText';

export default function Communication() {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <CommunicationHeader />
      <DescriptionText
        text="This tab enables you to create and manage email templates. The email templates can be reused at any time. To create a new email template, click on “Create Template” button. To send emails, click on “Bulk Email” button."
        highlights={['“Create Template”', '“Bulk Email”']}
        fontSize={13}
        color="#000000"
      />
      <CommunicationTable />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  content: {
    padding: 16,
    gap: 24,
  },
});
