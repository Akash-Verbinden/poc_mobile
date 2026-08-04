// import React, { useEffect, useState } from 'react';
// import {
//   StyleSheet,
//   Text,
//   View,
//   TextInput,
//   TouchableOpacity,
//   ActivityIndicator,
//   FlatList,
// } from 'react-native';
// import Ionicons from '@react-native-vector-icons/ionicons';
// import { getDashboardUniversities } from '../../../services/allServices';

// const UniversityActivityTable = () => {
//   const [data, setData] = useState([]);
//   const [loading, setLoading] = useState(false);

//   const [page, setPage] = useState(1);
//   const [totalRows, setTotalRows] = useState(0);

//   const [search, setSearch] = useState('');
//   const [debouncedSearch, setDebouncedSearch] = useState('');

//   const pageSize = 10;
//   const totalPages = Math.ceil(totalRows / pageSize) || 1;

//   /* ---------------- Debounce Search ---------------- */
//   useEffect(() => {
//     const t = setTimeout(() => {
//       setDebouncedSearch(search.trim());
//       setPage(1);
//     }, 500);

//     return () => clearTimeout(t);
//   }, [search]);

//   /* ---------------- Fetch Universities ---------------- */
//   const fetchUniversities = async () => {
//     setLoading(true);
//     try {
//       const payload = {
//         page,
//         page_size: pageSize,
//         sort_order: -1,
//         sort_by: 'created_at',
//         ...(debouncedSearch && { search: debouncedSearch }),
//       };

//       const res = await getDashboardUniversities(payload);

//       const results = res?.results || res?.data?.results || [];
//       const total = res?.total || res?.data?.total || 0;

//       setData(results);
//       setTotalRows(total);
//     } catch (err) {
//       console.error('Error fetching university activity:', err);
//       setData([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchUniversities();
//   }, [page, debouncedSearch]);

//   /* ---------------- Render Single University Card ---------------- */
//   const renderItem = ({ item }) => (
//     <View style={styles.card}>
//       <Text style={styles.universityName}>{item.name}</Text>

//       <View style={styles.statsGrid}>
//         <View style={styles.statBox}>
//           <Text style={styles.statLabel}>Enrolled Programs</Text>
//           <Text style={styles.statValue}>{item.total_shared_programs ?? 0}</Text>
//         </View>

//         <View style={styles.statBox}>
//           <Text style={styles.statLabel}>Active Cohorts</Text>
//           <Text style={styles.statValue}>{item.total_active_cohorts ?? 0}</Text>
//         </View>

//         <View style={styles.statBox}>
//           <Text style={styles.statLabel}>Total Faculty</Text>
//           <Text style={styles.statValue}>{item.total_faculty ?? 0}</Text>
//         </View>

//         <View style={styles.statBox}>
//           <Text style={styles.statLabel}>Total Students</Text>
//           <Text style={styles.statValue}>{item.total_students ?? 0}</Text>
//         </View>

//         <View style={styles.statBox}>
//           <Text style={styles.statLabel}>Enrolled Students</Text>
//           <Text style={styles.statValue}>{item.total_approved_students ?? 0}</Text>
//         </View>

//         <View style={styles.statBox}>
//           <Text style={styles.statLabel}>Certifications</Text>
//           <Text style={styles.statValue}>{item.total_certification ?? 0}</Text>
//         </View>
//       </View>
//     </View>
//   );

//   return (
//     <View style={styles.container}>
//       {/* Header & Search */}
//       <Text style={styles.headerTitle}>University Activity</Text>

//       <View style={styles.searchContainer}>
//         <TextInput
//           style={styles.searchInput}
//           placeholder="Search Universities..."
//           placeholderTextColor="#9CA3AF"
//           value={search}
//           onChangeText={setSearch}
//         />
//         <Ionicons name="search-outline" size={20} color="#9CA3AF" style={styles.searchIcon} />
//       </View>

//       {/* Content */}
//       {loading ? (
//         <View style={styles.loadingContainer}>
//           <ActivityIndicator size="small" color="#2563EB" />
//         </View>
//       ) : data.length === 0 ? (
//         <View style={styles.emptyContainer}>
//           <Text style={styles.emptyText}>No universities found</Text>
//         </View>
//       ) : (
//         <FlatList
//           data={data}
//           keyExtractor={(item, index) => item.id?.toString() || index.toString()}
//           renderItem={renderItem}
//           scrollEnabled={false}
//         />
//       )}

//       {/* Pagination Controls */}
//       <View style={styles.paginationContainer}>
//         <TouchableOpacity
//           disabled={page === 1}
//           onPress={() => setPage(1)}
//           style={[styles.pageBtn, page === 1 && styles.disabledBtn]}>
//           <Ionicons name="play-skip-back-outline" size={16} color={page === 1 ? '#D1D5DB' : '#374151'} />
//         </TouchableOpacity>

//         <TouchableOpacity
//           disabled={page === 1}
//           onPress={() => setPage((p) => Math.max(p - 1, 1))}
//           style={[styles.pageBtn, page === 1 && styles.disabledBtn]}>
//           <Ionicons name="chevron-back-outline" size={16} color={page === 1 ? '#D1D5DB' : '#374151'} />
//         </TouchableOpacity>

//         <Text style={styles.pageIndicator}>
//           Page {page} of {totalPages}
//         </Text>

//         <TouchableOpacity
//           disabled={page >= totalPages}
//           onPress={() => setPage((p) => Math.min(p + 1, totalPages))}
//           style={[styles.pageBtn, page >= totalPages && styles.disabledBtn]}>
//           <Ionicons name="chevron-forward-outline" size={16} color={page >= totalPages ? '#D1D5DB' : '#374151'} />
//         </TouchableOpacity>

//         <TouchableOpacity
//           disabled={page >= totalPages}
//           onPress={() => setPage(totalPages)}
//           style={[styles.pageBtn, page >= totalPages && styles.disabledBtn]}>
//           <Ionicons name="play-skip-forward-outline" size={16} color={page >= totalPages ? '#D1D5DB' : '#374151'} />
//         </TouchableOpacity>
//       </View>
//     </View>
//   );
// };

// export default UniversityActivityTable;

// const styles = StyleSheet.create({
//   container: {
//     backgroundColor: '#FFFFFF',
//     borderRadius: 12,
//     padding: 16,
//     marginBottom: 24,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.04,
//     shadowRadius: 8,
//     elevation: 2,
//   },
//   headerTitle: {
//     fontSize: 18,
//     fontWeight: '700',
//     color: '#111827',
//     marginBottom: 12,
//   },
//   searchContainer: {
//     position: 'relative',
//     marginBottom: 16,
//   },
//   searchInput: {
//     borderWidth: 1,
//     borderColor: '#E5E7EB',
//     borderRadius: 8,
//     paddingVertical: 10,
//     paddingLeft: 12,
//     paddingRight: 40,
//     fontSize: 14,
//     color: '#111827',
//     backgroundColor: '#FAFAFA',
//   },
//   searchIcon: {
//     position: 'absolute',
//     right: 12,
//     top: 12,
//   },
//   card: {
//     backgroundColor: '#F9FAFB',
//     borderColor: '#E5E7EB',
//     borderWidth: 1,
//     borderRadius: 8,
//     padding: 14,
//     marginBottom: 12,
//   },
//   universityName: {
//     fontSize: 16,
//     fontWeight: '700',
//     color: '#111827',
//     marginBottom: 12,
//     borderBottomWidth: 1,
//     borderBottomColor: '#E5E7EB',
//     paddingBottom: 8,
//   },
//   statsGrid: {
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//     rowGap: 10,
//   },
//   statBox: {
//     width: '50%',
//   },
//   statLabel: {
//     fontSize: 12,
//     color: '#6B7280',
//     marginBottom: 2,
//   },
//   statValue: {
//     fontSize: 14,
//     fontWeight: '600',
//     color: '#1F2937',
//   },
//   loadingContainer: {
//     paddingVertical: 24,
//     alignItems: 'center',
//   },
//   emptyContainer: {
//     paddingVertical: 24,
//     alignItems: 'center',
//   },
//   emptyText: {
//     color: '#6B7280',
//     fontSize: 14,
//   },
//   paginationContainer: {
//     flexDirection: 'row',
//     justifyContent: 'center',
//     alignItems: 'center',
//     gap: 8,
//     marginTop: 12,
//     paddingTop: 12,
//     borderTopWidth: 1,
//     borderTopColor: '#F3F4F6',
//   },
//   pageBtn: {
//     padding: 8,
//     borderRadius: 6,
//     backgroundColor: '#F3F4F6',
//   },
//   disabledBtn: {
//     backgroundColor: '#F9FAFB',
//   },
//   pageIndicator: {
//     fontSize: 13,
//     color: '#4B5563',
//     fontWeight: '500',
//     marginHorizontal: 8,
//   },
// });


import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Alert,
} from "react-native";
import Ionicons from "@react-native-vector-icons/ionicons";
import CommonTable from "../../../components/CommonTable";
import { getDashboardUniversities } from "../../../services/allServices";


export default function UniversityActivityTable({ navigation }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const [page, setPage] = useState(1);
  const [totalRows, setTotalRows] = useState(0);

  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const [sortOrder, setSortOrder] = useState(-1);

  /* ---------------- Debounce Search ---------------- */

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search.trim());
      setPage(1);
    }, 500);

    return () => clearTimeout(timer);
  }, [search]);

  /* ---------------- Fetch Data ---------------- */

  const fetchUniversities = async () => {
    setLoading(true);
    try {
      const payload = {
        page,
        page_size: 10,
        sort_order: sortOrder,
        sort_by: "created_at",
        ...(debouncedSearch && { search: debouncedSearch }),
      };

      const res = await getDashboardUniversities(payload);

      // SINGLE SOURCE OF TRUTH
      const results = res?.results || res?.data?.results || [];
      const total = res?.total || res?.data?.total || 0;

      setData(results);
      setTotalRows(total);
    } catch (err) {
      console.error(err);
      setData([]);
      Alert.alert("Error", "Failed to fetch dashboard data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUniversities();
  }, [page, debouncedSearch, sortOrder]);

  /* ---------------- Columns Definitions ---------------- */

  const columns = [
    {
      name: "University Name",
      selector: (row) => row.name,
      width: 180,
    },
    {
      name: "Total Enrolled Programs",
      selector: (row) => row.total_shared_programs,
      width: 150,
      center: true,
    },
    {
      name: "Total Active Cohorts",
      selector: (row) => row.total_active_cohorts,
      width: 140,
      center: true,
    },
    {
      name: "Total Faculty",
      selector: (row) => row.total_faculty,
      width: 110,
      center: true,
    },
    {
      name: "Total Student",
      selector: (row) => row.total_students,
      width: 110,
      center: true,
    },
    {
      name: "Total Enrolled Students",
      selector: (row) => row.total_approved_students,
      width: 150,
      center: true,
    },
    {
      name: "Total Certifications",
      selector: (row) => row.total_certification,
      width: 140,
      center: true,
    },
  ];

  /* ---------------- Render UI ---------------- */

  return (
    <View style={styles.cardContainer}>
      {/* Search Header */}
      <View style={styles.headerRow}>
        <Text style={styles.title}>University Activity</Text>
        <View style={styles.searchBox}>
          <Ionicons name="search-outline" size={16} color="#9ca3af" />
          <TextInput
            placeholder="Search Universities..."
            placeholderTextColor="#9ca3af"
            value={search}
            onChangeText={(text) => setSearch(text)}
            style={styles.searchInput}
          />
        </View>
      </View>

      {/* Shared Common Table */}
      <CommonTable
        columns={columns}
        data={data}
        loading={loading}
        totalRows={totalRows}
        page={page}
        onPageChange={(p) => setPage(p)}
        noDataComponent={<Text style={styles.noDataText}>No universities found</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 16,
    marginVertical: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  headerRow: {
    marginBottom: 16,
    gap: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
  },
  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 6,
    paddingHorizontal: 10,
    height: 40,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 13,
    color: "#111827",
  },
  noDataText: {
    color: "#6b7280",
    fontSize: 14,
    paddingVertical: 16,
  },
});