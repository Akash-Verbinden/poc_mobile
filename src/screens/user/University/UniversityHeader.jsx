import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Ionicons from '@react-native-vector-icons/ionicons';
import PrimaryButton from '../../../components/Buttons/PrimaryButton';

export default function UniversityHeader({ navigation }) {
  return (
    <View style={styles.header}>
      <Text style={styles.headerTitle}>
        List of Universities and their Status
      </Text>
      <PrimaryButton
        title="Create University"
        onPress={() => navigation?.navigate("createUniversity")}
        iconName="add-circle-outline"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
    flexWrap: 'wrap',
    gap: 12,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0f172a',
    flex: 1,
  },
  createBtn: {
    backgroundColor: '#2563eb',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  createBtnText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '600',
  },
});