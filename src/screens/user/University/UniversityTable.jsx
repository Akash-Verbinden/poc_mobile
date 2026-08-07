import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  ActivityIndicator,
  StyleSheet,
  Alert,
} from 'react-native';
import Ionicons from '@react-native-vector-icons/ionicons';
import CommonTable from '../../../components/CommonTable';
import {
  getUniversities,
  deleteUniversity,
  updateUniversityStatus,
} from '../../../services/allServices';
import SwitchButton from '../../../components/SwitchButton';
import StatusConfirmModal from '../../../components/StatusConfirmModal';

export default function UniversityTable({ navigation }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalRows, setTotalRows] = useState(0);

  // Modal states
  const [deleteModal, setDeleteModal] = useState({ open: false, id: null });
  const [deleteLoading, setDeleteLoading] = useState(false);

  const [statusModal, setStatusModal] = useState({
    open: false,
    row: null,
    status: 'inactive',
  });
  const [statusLoading, setStatusLoading] = useState(false);

  /* ---------------- Fetching Data ---------------- */
  const fetchUniversities = useCallback(async () => {
    setLoading(true);
    try {
      const response = await getUniversities({
        page,
        page_size: 10,
        sort_order: -1,
        sort_by: 'created_at',
        search: debouncedSearch,
      });

      if (response?.success) {
        setData(response.data.results || []);
        setTotalRows(response.data.total || 0);
      } else {
        setData([]);
      }
    } catch {
      Alert.alert('Error', 'Failed to fetch universities');
    } finally {
      setLoading(false);
    }
  }, [page, debouncedSearch]);

  /* ---------------- Debounce & Lifecycle ---------------- */
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search.trim());
      setPage(1);
    }, 400);

    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    fetchUniversities();
  }, [page, debouncedSearch, fetchUniversities]);

  /* ---------------- Modal Actions ---------------- */
  const confirmDelete = async () => {
    if (!deleteModal.id) return;
    setDeleteLoading(true);

    try {
      const response = await deleteUniversity(deleteModal.id);
      if (response?.success) {
        Alert.alert('Success', response.message || 'University deleted');
        setData((prev) => prev.filter((item) => item.id !== deleteModal.id));
      } else {
        Alert.alert('Error', 'Delete failed');
      }
    } catch {
      Alert.alert('Error', 'Server error');
    } finally {
      setDeleteLoading(false);
      setDeleteModal({ open: false, id: null });
    }
  };

  const confirmStatusUpdate = async () => {
    if (!statusModal.row) return;
    setStatusLoading(true);

    try {
      await updateUniversityStatus(statusModal.row.id, statusModal.status);
      Alert.alert('Success', `University ${statusModal.status} successfully`);
      fetchUniversities();
    } catch {
      Alert.alert('Error', 'Failed to update status');
    } finally {
      setStatusLoading(false);
      setStatusModal({ open: false, row: null, status: 'inactive' });
    }
  };

  /* ---------------- Columns Config ---------------- */
  const columns = [
    {
      name: 'University Name',
      selector: (row) => row.name,
      width: 180,
    },
    {
      name: 'University Code',
      selector: (row) => row.code,
      width: 140,
      center: true,
    },
    {
      name: 'Total Programs',
      selector: (row) => row.program_count,
      width: 130,
      center: true,
    },
    {
      name: 'Created Date',
      selector: (row) => row.created_at,
      width: 140,
      center: true,
    },
    {
      name: 'Admin',
      selector: (row) => `${row.admin_firstname} ${row.admin_lastname}`,
      width: 160,
      center: true,
    },
    {
      name: 'Contact',
      selector: (row) => row.contact,
      width: 140,
      center: true,
    },
    {
      name: 'Email Address',
      selector: (row) => row.email,
      width: 220,
      center: true,
    },
    {
      name: 'Status',
      width: 140,
      center: true,
      cell: (row) => {
        const isActive = row.status === 'active';
        return (
            <SwitchButton
              value={isActive}
              onValueChange={() =>
                setStatusModal({
                  open: true,
                  row,
                  status: isActive ? 'inactive' : 'active',
                })
              }
              activeText="Active"
              inactiveText="Inactive"
            />
          );
        }
    },
    {
      name: 'Action',
      width: 100,
      center: true,
      cell: (row) => (
        <View style={styles.actionRow}>
          <TouchableOpacity
            onPress={() =>
              navigation?.navigate('EditUniversity', { id: row.id })
            }
          >
            <Ionicons name="pencil" size={16} color="#2563eb" />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setDeleteModal({ open: true, id: row.id })}
          >
            <Ionicons name="trash-outline" size={16} color="#dc2626" />
          </TouchableOpacity>
        </View>
      ),
    },
  ];

  return (
    <View style={styles.tableCard}>
      {/* Search Input */}
      <View style={styles.searchWrapper}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search Universities..."
          placeholderTextColor="#9ca3af"
          value={search}
          onChangeText={setSearch}
        />
        <Ionicons
          name="search"
          size={18}
          color="#9ca3af"
          style={styles.searchIcon}
        />
      </View>

      {/* Common Table */}
      <CommonTable
        columns={columns}
        data={data}
        loading={loading}
        totalRows={totalRows}
        page={page}
        pageSize={10}
        onPageChange={(p) => setPage(p)}
      />

      {/* Status Modal */}

      <StatusConfirmModal 
        visible={statusModal.open}
        type="confirm"
        title="Update University Status"
        message={`Are you sure you want to change status to ${statusModal.status}?`}
        onClose={() =>
          setStatusModal({ open: false, row: null, status: 'inactive' })
        }
        onConfirm={confirmStatusUpdate}
        loading={statusLoading}
      />

      {/* Delete Modal */}
      <StatusConfirmModal
        visible={deleteModal.open}
        type="delete"
        title="Delete University"
        message="Are you sure you want to delete this university?"
        onClose={() => setDeleteModal({ open: false, id: null })}
        onConfirm={confirmDelete}
        loading={deleteLoading}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  tableCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  searchWrapper: {
    alignSelf: 'flex-end',
    position: 'relative',
    width: '100%',
    maxWidth: 260,
    marginBottom: 12,
  },
  searchInput: {
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 6,
    paddingVertical: 8,
    paddingLeft: 12,
    paddingRight: 36,
    fontSize: 13,
    color: '#0f172a',
    backgroundColor: '#fff',
  },
  searchIcon: {
    position: 'absolute',
    right: 10,
    top: 10,
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  statusPill: {
    width: 90,
    height: 26,
    borderRadius: 13,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 3,
    position: 'relative',
  },
  bgActive: { backgroundColor: '#3b82f6' },
  bgInactive: { backgroundColor: '#9ca3af' },
  statusThumb: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#ffffff',
    position: 'absolute',
  },
  thumbActive: { right: 3 },
  thumbInactive: { left: 3 },
  statusText: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight: '600',
    width: '100%',
  },
  textActive: { textAlign: 'left', paddingLeft: 8 },
  textInactive: { textAlign: 'right', paddingRight: 8 },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 20,
    width: '100%',
    maxWidth: 380,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 8,
  },
  modalBody: {
    fontSize: 14,
    color: '#475569',
    marginBottom: 20,
  },
  boldText: {
    fontWeight: '700',
    textTransform: 'capitalize',
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
  },
  cancelBtn: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 6,
    backgroundColor: '#e2e8f0',
  },
  cancelBtnText: {
    color: '#0f172a',
    fontSize: 13,
    fontWeight: '600',
  },
  confirmBtn: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 6,
    backgroundColor: '#2563eb',
  },
  deleteBtn: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 6,
    backgroundColor: '#dc2626',
  },
  confirmBtnText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '600',
  },
});