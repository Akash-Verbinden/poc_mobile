import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { getProgramMetrics } from '../../../services/allServices';
import ProgramsMetrics from './ProgramsMetrics';
import ProgramsTable from './ProgramsTable';
import { useNavigation } from '@react-navigation/native';
import Loader from '../../../components/Loader';
import CommonHeader from '../../../components/CommonHeader';
import ProgramsHeader from './ProgramsHeader';
import PrimaryButton from '../../../components/Buttons/PrimaryButton';
import DescriptionText from '../../../components/DescriptionText';

const Programs = () => {
  const [metrics, setMetrics] = useState({
    total: 0,
    shared: 0,
    archived: 0,
    pending: 0,
  });

  const [loading, setLoading] = useState(true);

  const navigation = useNavigation();

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
      <Loader visible={loading} />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <ProgramsHeader />
        <ProgramsMetrics metrics={metrics} />
        <DescriptionText
          text="This tab allows you to create and manage programs. First create a new program using the “Create Program” button on top right. Once a new program has been created, then click on the “edit icon” to add content. Once the content has been published, then click on the “Share” icon to share with universities."
          highlights={['“Create Program”', '“edit icon”', '“Share”']}
        />
        <ProgramsTable />
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
  headerContainer: {
    marginBottom: 16,
  },
  mainHeader: {
    fontSize: 22,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 12,
  },
  createButton: {
    flexDirection: 'row',
    gap: 5,
    backgroundColor: '#2563EB',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  createButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
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
