import React, { useEffect, useState } from 'react';
import { ScrollView, Text, StyleSheet } from 'react-native';
import UniversityHeader from './UniversityHeader';
import UniversityStatus from './UniversityMetrics';
import UniversityTable from './UniversityTable';
import { getUniversityMetrics } from '../../../services/allServices';
import Loader from '../../../components/Loader';

export default function Universities({ navigation }) {
  const [stats, setStats] = useState({
    total: 0,
    assigned: 0,
    unassigned: 0,
    distributed: 0,
  });
  const [statsLoading, setStatsLoading] = useState(true);

  useEffect(() => {
    loadMetrics();
  }, []);

  const loadMetrics = async () => {
    try {
      setStatsLoading(true);
      const res = await getUniversityMetrics();
      if (res?.success) {
        setStats({
          total: res?.data?.total_universities || 0,
          assigned: res?.data?.universities_assigned || 0,
          unassigned: res?.data?.universities_unassigned || 0,
          distributed: res?.data?.total_programs_distributed || 0,
        });
      }
    } catch (e) {
      console.log('Error loading metrics:', e);
    } finally {
      setStatsLoading(false);
    }
  };

  return (
    <ScrollView
      style={styles.screenContainer}
      contentContainerStyle={styles.content}
    >
      <Loader visible={statsLoading} />
      {/* Header Component */}
      <UniversityHeader navigation={navigation} />

      {/* Stats Cards Component */}
      <UniversityStatus
        total={stats.total}
        assigned={stats.assigned}
        unassigned={stats.unassigned}
        distributed={stats.distributed}
        loading={statsLoading}
      />

      {/* Helper Description Text */}
      <Text style={styles.descriptionText}>
        This tab enables you to create and manage universities. To create a new
        university, click on the{' '}
        <Text style={styles.linkText}>“Create University”</Text> button on top.
      </Text>

      {/* Table Component */}
      <UniversityTable navigation={navigation} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  content: {
    padding: 16,
    paddingBottom: 40,
  },
  descriptionText: {
    fontSize: 13,
    fontStyle: 'italic',
    color: '#334155',
    marginBottom: 12,
  },
  linkText: {
    color: '#2563eb',
    fontWeight: '600',
  },
});