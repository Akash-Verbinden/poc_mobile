import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import CountCard from '../../../components/CountCard';

export default function UniversityMetrics({
  total = 0,
  assigned = 0,
  unassigned = 0,
  distributed = 0,
  loading = false,
}) {
  if (loading) {
    return (
      <ActivityIndicator
        size="small"
        color="#2563eb"
        style={{ marginVertical: 12 }}
      />
    );
  }

  return (
    <View style={styles.statsContainer}>
      <CountCard
        title="Total Universities"
        count={total}
        iconName="school-outline"
      />
      <CountCard
        title="Universities Assigned"
        count={assigned}
        iconName="document-text-outline"
      />
      <CountCard
        title="Universities Unassigned"
        count={unassigned}
        iconName="close-circle-outline"
      />
      <CountCard
        title="Total Programs Distributed"
        count={distributed}
        iconName="hourglass-outline"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  statsContainer: {
    marginBottom: 12,
  },
});