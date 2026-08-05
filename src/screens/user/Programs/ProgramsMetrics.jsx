import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import CountCard from '../../../components/CountCard';

const ProgramsMetrics = ({ metrics }) => {
  return (
    <View>
      <View style={styles.section}>
        <View style={styles.cardGrid}>
          <CountCard
            title="Total Programs"
            count={metrics?.total ?? 0}
            iconName="book-outline"
          />
          <CountCard
            title="Programs Shared"
            count={metrics?.shared ?? 0}
            iconName="share-outline"
          />
          <CountCard
            title="Archived Programs"
            count={metrics?.archived ?? 0}
            iconName="archive-outline"
          />
          <CountCard
            title="Pending Distribution"
            count={metrics?.pending ?? 0}
            iconName="hourglass-outline"
          />
        </View>
      </View>
    </View>
  );
};
export default ProgramsMetrics;

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
