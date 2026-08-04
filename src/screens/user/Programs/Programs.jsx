import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { getProgramMetrics } from '../../../services/allServices';
import ProgramsMetrics from './ProgramsMetrics';
import ProgramsTable from './ProgramsTable';
import { ScrollView } from 'react-native-gesture-handler';

const Programs = () => {
  const [metrics, setMetrics] = useState({
    total: 0,
    shared: 0,
    archived: 0,
    pending: 0,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMetrics();
  }, []);

  const loadMetrics = async () => {
    try {
      const res = await getProgramMetrics();

      if (res?.success) {
        setMetrics({
          total: res?.data?.total_programs || 0,
          shared: res?.data?.shared_programs || 0,
          archived: res?.data?.archived_programs || 0,
          pending: res?.data?.pending_programs || 0,
        });
      }
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };
  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.mainHeader}>
          List of Program Data and their Status
        </Text>
      <ProgramsMetrics metrics={metrics} />
      <ProgramsTable/>
      </ScrollView>
    </View>
  );
};

export default Programs;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F5F7',
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 24,
  },
  mainHeader: {
    fontSize: 22,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 16,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 12,
  },
  cardGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
});
