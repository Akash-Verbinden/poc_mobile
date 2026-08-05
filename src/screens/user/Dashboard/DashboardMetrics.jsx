import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import CountCard from '../../../components/CountCard';

const DashboardMetrics = ({ data }) => {
  return (
    <View>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>University Data</Text>
        <View style={styles.cardGrid}>
          <CountCard
            title="Total Universities"
            count={data?.universities?.total ?? 0}
            iconName="school-outline"
          />
          <CountCard
            title="Total Enrolled Universities"
            count={data?.universities?.active ?? 0}
            iconName="school-outline"
          />
          <CountCard
            title="Total Active Programs"
            count={data?.programs?.total ?? 0}
            iconName="book-outline"
          />
          <CountCard
            title="Total Programs Assigned"
            count={data?.programs?.assigned ?? 0}
            iconName="book-outline"
          />
        </View>
      </View>

      {/* Section 2: Cohorts Data */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Cohorts Data</Text>
        <View style={styles.cardGrid}>
          <CountCard
            title="Total Cohort"
            count={data?.cohorts?.total ?? 0}
            iconName="people-outline"
          />
          <CountCard
            title="Total Active Cohort"
            count={data?.cohorts?.active ?? 0}
            iconName="people-outline"
          />
        </View>
      </View>

      {/* Section 3: Students Data */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Students Data</Text>
        <View style={styles.cardGrid}>
          <CountCard
            title="Total Students"
            count={data?.students?.total ?? 0}
            iconName="account-school-outline"
          />
          <CountCard
            title="Total Enrolled Students"
            count={data?.students?.approved ?? 0}
            iconName="account-school-outline"
          />
          <CountCard
            title="Total Certifications"
            count={data?.certificates?.total ?? 0}
            iconName="ribbon-outline"
          />
          <CountCard
            title="Total Capstone Projects"
            count={data?.capstones?.total ?? 0}
            iconName="document-text-outline"
          />
        </View>
      </View>
    </View>
  );
};

export default DashboardMetrics;

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
