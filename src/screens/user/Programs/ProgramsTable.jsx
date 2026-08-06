// import React, { useState, useEffect } from 'react';
// import {
//   View,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   Modal,
//   Switch,
//   StyleSheet,
//   Alert,
// } from 'react-native';
// import Ionicons from '@react-native-vector-icons/ionicons';
// import CommonTable from '../../../components/CommonTable';
// import {
//   getPrograms,
//   deleteProgram,
//   updateProgramStatus,
// } from '../../../services/allServices';
// import { useNavigation } from '@react-navigation/native';

// export default function ProgramTable() {
//   const [data, setData] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [page, setPage] = useState(1);
//   const [totalRows, setTotalRows] = useState(0);

//   const [searchText, setSearchText] = useState('');
//   const [search, setSearch] = useState('');

//   const [programLevel, setProgramLevel] = useState('');
//   const [programStatus, setProgramStatus] = useState('');

//   const [openLevel, setOpenLevel] = useState(false);
//   const [openStatus, setOpenStatus] = useState(false);

//   const [deleteModal, setDeleteModal] = useState({
//     open: false,
//     id: null,
//   });

//   const [statusModal, setStatusModal] = useState({
//     open: false,
//     row: null,
//     status: 'archived',
//   });

//   const navigation = useNavigation();

//   /* ---------- Debounce Search ---------- */
//   useEffect(() => {
//     const timer = setTimeout(() => {
//       setPage(1);
//       setSearch(searchText);
//     }, 500);
//     return () => clearTimeout(timer);
//   }, [searchText]);

//   /* ---------- Fetch Data ---------- */
//   const fetchPrograms = async () => {
//     setLoading(true);
//     try {
//       const res = await getPrograms({
//         search,
//         page,
//         page_size: 10,
//         sort_order: -1,
//         sort_by: 'created_at',
//         filter: {
//           ...(programLevel && { program_level: programLevel }),
//           ...(programStatus && { status: programStatus }),
//         },
//       });

//       if (res?.success) {
//         const filtered = (res.data.results || []).filter(
//           item => item.status !== 'inactive',
//         );
//         setData(filtered);
//         setTotalRows(res.data.total || 0);
//       }
//     } catch (err) {
//       Alert.alert('Error', 'Failed to fetch programs');
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchPrograms();
//   }, [page, search, programLevel, programStatus]);

//   /* ---------- Handlers ---------- */
//   const handleDeleteConfirm = async () => {
//     if (!deleteModal.id) return;
//     try {
//       setLoading(true);
//       const res = await deleteProgram(deleteModal.id);
//       if (res?.success) {
//         Alert.alert('Success', res.message || 'Deleted Successfully');
//         setDeleteModal({ open: false, id: null });
//         fetchPrograms();
//       } else {
//         Alert.alert('Error', res?.message || 'Delete Failed');
//       }
//     } catch (err) {
//       Alert.alert('Error', 'Something went wrong');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleStatusConfirm = async () => {
//     try {
//       await updateProgramStatus(statusModal.row.id, statusModal.status);
//       Alert.alert('Success', `Program ${statusModal.status} successfully`);
//       fetchPrograms();
//     } catch (error) {
//       Alert.alert('Error', 'Failed to update status');
//     } finally {
//       setStatusModal({ open: false, row: null, status: 'archived' });
//     }
//   };

//   /* ---------- Column Definitions ---------- */
//   const columns = [
//     {
//       name: 'Program Name',
//       selector: row => row.name,
//       width: 180,
//     },
//     {
//       name: 'Program Level',
//       selector: row => row.program_level,
//       width: 120,
//       center: true,
//     },
//     {
//       name: 'Modules',
//       selector: row => row.chapter_count,
//       width: 90,
//       center: true,
//     },
//     {
//       name: 'Created Date',
//       selector: row => row.created_at,
//       width: 120,
//       center: true,
//     },
//     {
//       name: 'Last Updated',
//       selector: row => row.updated_at,
//       width: 120,
//       center: true,
//     },
//     {
//       name: 'Assigned Univ.',
//       selector: row => row.university_count,
//       width: 110,
//       center: true,
//     },
//     {
//       name: 'Status',
//       width: 120,
//       center: true,
//       cell: row => {
//         const isPublished = row.status === 'published';
//         return (
//           <View style={{ flexDirection: 'row', alignItems: 'center' }}>
//             <Switch
//               value={isPublished}
//               onValueChange={() =>
//                 setStatusModal({
//                   open: true,
//                   row,
//                   status: isPublished ? 'archived' : 'published',
//                 })
//               }
//               trackColor={{ false: '#9ca3af', true: '#3b82f6' }}
//               thumbColor="#ffffff"
//             />
//             <Text style={{ fontSize: 11, marginLeft: 4, color: '#374151' }}>
//               {isPublished ? 'Pub' : 'Arch'}
//             </Text>
//           </View>
//         );
//       },
//     },
//     {
//       name: 'Actions',
//       width: 120,
//       center: true,
//       cell: row => (
//         <View style={styles.actionRow}>
//           {/* Navigate to edit program inside the programs tab stack */}
//           <TouchableOpacity
//             onPress={() => navigation.navigate('editProgram', { id: row.id })}
//           >
//             <Ionicons name="pencil-outline" size={16} color="#2563eb" />
//           </TouchableOpacity>

//           <TouchableOpacity
//             onPress={() => navigation.navigate('shareProgram', { id: row.id })}
//           >
//             <Ionicons name="share-social-outline" size={16} color="#6b7280" />
//           </TouchableOpacity>

//           <TouchableOpacity
//             onPress={() =>
//               navigation.navigate('programBuilder', { id: row.id })
//             }
//           >
//             <Ionicons name="eye-outline" size={16} color="#6b7280" />
//           </TouchableOpacity>
//         </View>
//       ),
//     },
//   ];

//   return (
//     <View style={styles.screen}>
//       <Text style={styles.instructionText}>
//         This screen allows you to manage programs. Create a new program, edit to
//         add content, and share with universities.
//       </Text>

//       <View style={styles.controlsContainer}>
//         <View style={styles.searchBox}>
//           <Ionicons name="search-outline" size={16} color="#9ca3af" />
//           <TextInput
//             placeholder="Search programs..."
//             value={searchText}
//             onChangeText={text => {
//               setSearchText(text);
//               setPage(1);
//             }}
//             style={styles.searchInput}
//           />
//         </View>

//         <View style={styles.filterRow}>
//           {/* Level Dropdown */}
//           <TouchableOpacity
//             style={styles.dropdownBtn}
//             onPress={() => setOpenLevel(true)}
//           >
//             <Text style={styles.dropdownBtnText}>
//               {programLevel || 'Program Level'}
//             </Text>
//             <Ionicons name="chevron-down" size={16} color="#fff" />
//           </TouchableOpacity>

//           {/* Status Dropdown */}
//           <TouchableOpacity
//             style={styles.dropdownBtn}
//             onPress={() => setOpenStatus(true)}
//           >
//             <Text style={styles.dropdownBtnText}>
//               {programStatus
//                 ? programStatus === 'published'
//                   ? 'Published'
//                   : 'Draft'
//                 : 'Status'}
//             </Text>
//             <Ionicons name="chevron-down" size={16} color="#fff" />
//           </TouchableOpacity>
//         </View>
//       </View>

//       {/* Main Table */}
//       <CommonTable
//         columns={columns}
//         data={data}
//         loading={loading}
//         totalRows={totalRows}
//         page={page}
//         onPageChange={p => setPage(p)}
//       />

//       {/* Level Picker Modal */}
//       <Modal visible={openLevel} transparent animationType="fade">
//         <TouchableOpacity
//           style={styles.modalOverlay}
//           activeOpacity={1}
//           onPress={() => setOpenLevel(false)}
//         >
//           <View style={styles.pickerModalContent}>
//             {['', 'Graduate', 'Undergraduate'].map(lvl => (
//               <TouchableOpacity
//                 key={lvl}
//                 style={styles.pickerOption}
//                 onPress={() => {
//                   setProgramLevel(lvl);
//                   setPage(1);
//                   setOpenLevel(false);
//                 }}
//               >
//                 <Text style={styles.pickerOptionText}>
//                   {lvl || 'All Levels'}
//                 </Text>
//               </TouchableOpacity>
//             ))}
//           </View>
//         </TouchableOpacity>
//       </Modal>

//       {/* Status Picker Modal */}
//       <Modal visible={openStatus} transparent animationType="fade">
//         <TouchableOpacity
//           style={styles.modalOverlay}
//           activeOpacity={1}
//           onPress={() => setOpenStatus(false)}
//         >
//           <View style={styles.pickerModalContent}>
//             {[
//               { label: 'All Statuses', value: '' },
//               { label: 'Published', value: 'published' },
//               { label: 'Draft', value: 'draft' },
//             ].map(st => (
//               <TouchableOpacity
//                 key={st.value}
//                 style={styles.pickerOption}
//                 onPress={() => {
//                   setProgramStatus(st.value);
//                   setPage(1);
//                   setOpenStatus(false);
//                 }}
//               >
//                 <Text style={styles.pickerOptionText}>{st.label}</Text>
//               </TouchableOpacity>
//             ))}
//           </View>
//         </TouchableOpacity>
//       </Modal>

//       {/* Confirmation Status Modal */}
//       <Modal visible={statusModal.open} transparent animationType="fade">
//         <View style={styles.modalOverlay}>
//           <View style={styles.dialogBox}>
//             <Text style={styles.dialogTitle}>Update Program Status</Text>
//             <Text style={styles.dialogMessage}>
//               Are you sure you want to change status to{' '}
//               <Text style={{ fontWeight: '700' }}>{statusModal.status}</Text>?
//             </Text>
//             <View style={styles.dialogActions}>
//               <TouchableOpacity
//                 style={styles.cancelBtn}
//                 onPress={() =>
//                   setStatusModal({ open: false, row: null, status: 'archived' })
//                 }
//               >
//                 <Text style={styles.cancelBtnText}>Cancel</Text>
//               </TouchableOpacity>
//               <TouchableOpacity
//                 style={styles.confirmBtn}
//                 onPress={handleStatusConfirm}
//               >
//                 <Text style={styles.confirmBtnText}>Confirm</Text>
//               </TouchableOpacity>
//             </View>
//           </View>
//         </View>
//       </Modal>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   instructionText: {
//     fontStyle: 'italic',
//     fontSize: 12,
//     color: '#374151',
//     marginBottom: 12,
//   },
//   controlsContainer: { marginBottom: 12 },
//   searchBox: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#fff',
//     borderWidth: 1,
//     borderColor: '#e5e7eb',
//     borderRadius: 6,
//     paddingHorizontal: 10,
//     marginBottom: 10,
//     height: 40,
//   },
//   searchInput: { flex: 1, marginLeft: 8, fontSize: 13, color: '#111827' },
//   filterRow: { flexDirection: 'row', gap: 10 },
//   dropdownBtn: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#2563eb',
//     paddingHorizontal: 12,
//     paddingVertical: 8,
//     borderRadius: 6,
//     gap: 6,
//   },
//   dropdownBtnText: { color: '#fff', fontSize: 12, fontWeight: '500' },
//   actionRow: { flexDirection: 'row', gap: 14, alignItems: 'center' },
//   modalOverlay: {
//     flex: 1,
//     backgroundColor: 'rgba(0,0,0,0.4)',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   pickerModalContent: {
//     backgroundColor: '#fff',
//     borderRadius: 8,
//     width: '70%',
//     padding: 8,
//   },
//   pickerOption: { paddingVertical: 12, paddingHorizontal: 16 },
//   pickerOptionText: { fontSize: 14, color: '#1f2937' },
//   dialogBox: {
//     backgroundColor: '#fff',
//     borderRadius: 12,
//     width: '85%',
//     padding: 20,
//   },
//   dialogTitle: { fontSize: 16, fontWeight: '600', marginBottom: 8 },
//   dialogMessage: { fontSize: 14, color: '#4b5563', marginBottom: 20 },
//   dialogActions: { flexDirection: 'row', justifyContent: 'flex-end', gap: 10 },
//   cancelBtn: {
//     paddingHorizontal: 14,
//     paddingVertical: 8,
//     backgroundColor: '#e5e7eb',
//     borderRadius: 6,
//   },
//   cancelBtnText: { color: '#374151', fontSize: 13 },
//   confirmBtn: {
//     paddingHorizontal: 14,
//     paddingVertical: 8,
//     backgroundColor: '#2563eb',
//     borderRadius: 6,
//   },
//   confirmBtnText: { color: '#fff', fontSize: 13, fontWeight: '500' },
// });

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';
import Ionicons from '@react-native-vector-icons/ionicons';
import CommonTable from '../../../components/CommonTable';
import {
  getPrograms,
  deleteProgram,
  updateProgramStatus,
} from '../../../services/allServices';
import { useNavigation } from '@react-navigation/native';
import StatusConfirmModal from '../../../components/StatusConfirmModal';

export default function ProgramTable() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalRows, setTotalRows] = useState(0);

  const [searchText, setSearchText] = useState('');
  const [search, setSearch] = useState('');

  const [programLevel, setProgramLevel] = useState('');
  const [programStatus, setProgramStatus] = useState('');

  const [openLevel, setOpenLevel] = useState(false);
  const [openStatus, setOpenStatus] = useState(false);

  // Status Confirmation Modal State
  const [statusModal, setStatusModal] = useState({
    open: false,
    row: null,
    status: 'archived',
  });

  const navigation = useNavigation();

  /* ---------- Debounce Search ---------- */
  useEffect(() => {
    const timer = setTimeout(() => {
      setPage(1);
      setSearch(searchText);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchText]);

  /* ---------- Fetch Data ---------- */
  const fetchPrograms = async () => {
    setLoading(true);
    try {
      const res = await getPrograms({
        search,
        page,
        page_size: 10,
        sort_order: -1,
        sort_by: 'created_at',
        filter: {
          ...(programLevel && { program_level: programLevel }),
          ...(programStatus && { status: programStatus }),
        },
      });

      if (res?.success) {
        const filtered = (res.data.results || []).filter(
          item => item.status !== 'inactive',
        );
        setData(filtered);
        setTotalRows(res.data.total || 0);
      }
    } catch (err) {
      Alert.alert('Error', 'Failed to fetch programs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPrograms();
  }, [page, search, programLevel, programStatus]);

  /* ---------- Handle Status Change ---------- */
  const handleStatusConfirm = async () => {
    if (!statusModal.row?.id) return;

    const targetId = statusModal.row.id;
    const newStatus = statusModal.status;

    // Close modal first
    setStatusModal({ open: false, row: null, status: 'archived' });

    try {
      setLoading(true);
      const res = await updateProgramStatus(targetId, newStatus);

      // Optimistically update local data state
      setData(prevData =>
        prevData.map(item =>
          item.id === targetId ? { ...item, status: newStatus } : item,
        ),
      );

      Alert.alert('Success', `Program status updated to ${newStatus}`);
    } catch (error) {
      Alert.alert('Error', 'Failed to update status');
    } finally {
      setLoading(false);
    }
  };

  /* ---------- Column Definitions ---------- */
  const columns = [
    {
      name: 'Program Name',
      selector: row => row.name,
      width: 180,
    },
    {
      name: 'Program Level',
      selector: row => row.program_level,
      width: 120,
      center: true,
    },
    {
      name: 'Modules',
      selector: row => row.chapter_count,
      width: 90,
      center: true,
    },
    {
      name: 'Created Date',
      selector: row => row.created_at,
      width: 120,
      center: true,
    },
    {
      name: 'Last Updated',
      selector: row => row.updated_at,
      width: 120,
      center: true,
    },
    {
      name: 'Assigned Univ.',
      selector: row => row.university_count,
      width: 110,
      center: true,
    },
    {
      name: 'Status',
      width: 130,
      center: true,
      cell: row => {
        const isPublished =
          String(row?.status || '').toLowerCase() === 'published';

        return (
          <TouchableOpacity
            activeOpacity={0.7}
            style={styles.toggleContainer}
            onPress={() => {
              setStatusModal({
                open: true,
                row,
                status: isPublished ? 'archived' : 'published',
              });
            }}
          >
            <View
              style={[
                styles.toggleTrack,
                { backgroundColor: isPublished ? '#3b82f6' : '#9ca3af' },
              ]}
            >
              <View
                style={[
                  styles.toggleThumb,
                  { alignSelf: isPublished ? 'flex-end' : 'flex-start' },
                ]}
              />
            </View>
            <Text style={styles.toggleLabel}>
              {isPublished ? 'Published' : 'Archived'}
            </Text>
          </TouchableOpacity>
        );
      },
    },
    {
      name: 'Actions',
      width: 120,
      center: true,
      cell: row => (
        <View style={styles.actionRow}>
          <TouchableOpacity
            onPress={() => navigation.navigate('editProgram', { id: row.id })}
          >
            <Ionicons name="pencil-outline" size={16} color="#2563eb" />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => navigation.navigate('shareProgram', { id: row.id })}
          >
            <Ionicons name="share-social-outline" size={16} color="#6b7280" />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() =>
              navigation.navigate('programBuilder', { id: row.id })
            }
          >
            <Ionicons name="eye-outline" size={16} color="#6b7280" />
          </TouchableOpacity>
        </View>
      ),
    },
  ];

  return (
    <View style={styles.screen}>
      <Text style={styles.instructionText}>
        This screen allows you to manage programs. Create a new program, edit to
        add content, and share with universities.
      </Text>

      <View style={styles.controlsContainer}>
        <View style={styles.searchBox}>
          <Ionicons name="search-outline" size={16} color="#9ca3af" />
          <TextInput
            placeholder="Search programs..."
            value={searchText}
            onChangeText={text => setSearchText(text)}
            style={styles.searchInput}
          />
        </View>

        <View style={styles.filterRow}>
          <TouchableOpacity
            style={styles.dropdownBtn}
            onPress={() => setOpenLevel(true)}
          >
            <Text style={styles.dropdownBtnText}>
              {programLevel || 'Program Level'}
            </Text>
            <Ionicons name="chevron-down" size={16} color="#fff" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.dropdownBtn}
            onPress={() => setOpenStatus(true)}
          >
            <Text style={styles.dropdownBtnText}>
              {programStatus
                ? programStatus === 'published'
                  ? 'Published'
                  : 'Draft'
                : 'Status'}
            </Text>
            <Ionicons name="chevron-down" size={16} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Table Component */}
      <CommonTable
        columns={columns}
        data={data}
        loading={loading}
        totalRows={totalRows}
        page={page}
        onPageChange={p => setPage(p)}
      />

      {/* Level Picker Modal */}
      <Modal visible={openLevel} transparent animationType="fade">
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setOpenLevel(false)}
        >
          <View style={styles.pickerModalContent}>
            {['', 'Graduate', 'Undergraduate'].map(lvl => (
              <TouchableOpacity
                key={lvl}
                style={styles.pickerOption}
                onPress={() => {
                  setProgramLevel(lvl);
                  setPage(1);
                  setOpenLevel(false);
                }}
              >
                <Text style={styles.pickerOptionText}>
                  {lvl || 'All Levels'}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Status Picker Modal */}
      <Modal visible={openStatus} transparent animationType="fade">
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setOpenStatus(false)}
        >
          <View style={styles.pickerModalContent}>
            {[
              { label: 'All Statuses', value: '' },
              { label: 'Published', value: 'published' },
              { label: 'Draft', value: 'draft' },
            ].map(st => (
              <TouchableOpacity
                key={st.value}
                style={styles.pickerOption}
                onPress={() => {
                  setProgramStatus(st.value);
                  setPage(1);
                  setOpenStatus(false);
                }}
              >
                <Text style={styles.pickerOptionText}>{st.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Root-Level Status Confirmation Modal */}
      <StatusConfirmModal
        visible={statusModal.open}
        status={statusModal.status}
        title="Update Program Status"
        onClose={() =>
          setStatusModal({ open: false, row: null, status: 'archived' })
        }
        onConfirm={handleStatusConfirm}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, padding: 16, backgroundColor: '#f9fafb' },
  instructionText: {
    fontStyle: 'italic',
    fontSize: 12,
    color: '#374151',
    marginBottom: 12,
  },
  controlsContainer: { marginBottom: 12 },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 6,
    paddingHorizontal: 10,
    marginBottom: 10,
    height: 40,
  },
  searchInput: { flex: 1, marginLeft: 8, fontSize: 13, color: '#111827' },
  filterRow: { flexDirection: 'row', gap: 10 },
  dropdownBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2563eb',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    gap: 6,
  },
  dropdownBtnText: { color: '#fff', fontSize: 12, fontWeight: '500' },
  toggleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
    paddingHorizontal: 4,
  },
  toggleTrack: {
    width: 38,
    height: 22,
    borderRadius: 11,
    padding: 2,
    justifyContent: 'center',
  },
  toggleThumb: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#ffffff',
  },
  toggleLabel: {
    fontSize: 11,
    marginLeft: 6,
    color: '#374151',
    fontWeight: '500',
  },
  actionRow: { flexDirection: 'row', gap: 14, alignItems: 'center' },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 9999,
  },
  pickerModalContent: {
    backgroundColor: '#fff',
    borderRadius: 8,
    width: '70%',
    padding: 8,
  },
  pickerOption: { paddingVertical: 12, paddingHorizontal: 16 },
  pickerOptionText: { fontSize: 14, color: '#1f2937' },
  dialogBox: {
    backgroundColor: '#fff',
    borderRadius: 12,
    width: '85%',
    padding: 20,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  dialogTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#111827',
  },
  dialogMessage: { fontSize: 14, color: '#4b5563', marginBottom: 20 },
  dialogActions: { flexDirection: 'row', justifyContent: 'flex-end', gap: 10 },
  cancelBtn: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    backgroundColor: '#e5e7eb',
    borderRadius: 6,
  },
  cancelBtnText: { color: '#374151', fontSize: 13 },
  confirmBtn: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    backgroundColor: '#2563eb',
    borderRadius: 6,
  },
  confirmBtnText: { color: '#fff', fontSize: 13, fontWeight: '500' },
});
