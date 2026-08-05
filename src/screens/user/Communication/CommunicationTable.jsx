import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  ActivityIndicator,
  StyleSheet,
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import Ionicons from "@react-native-vector-icons/ionicons";
import CommonTable from "../../../components/CommonTable";
import {
  getEmailTemplates,
  deleteEmailTemplate,
} from "../../../services/allServices";



export default function CommunicationTable() {
  const navigation = useNavigation();

  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Pagination states for CommonTable
  const [page, setPage] = useState(1);
  const pageSize = 10;

  /* ---------------- Debounce Search ---------------- */
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search.trim().toLowerCase());
    }, 400);

    return () => clearTimeout(timer);
  }, [search]);

  /* ---------------- Fetch Data ---------------- */
  const fetchTemplates = async () => {
    setLoading(true);

    try {
      const res = await getEmailTemplates();

      if (res.success) {
        const formatted = res.data.results.map((t) => ({
          id: t.id,
          template_name: t.template_name,
          template_subject: t.template_subject,
          created_at: t.created_at,
          email_count: t.email_count || 0,
          opened: t.open_count || 0,
        }));

        setData(formatted);
        setFilteredData(formatted);
      } else {
        setData([]);
        setFilteredData([]);
      }
    } catch (err) {
      console.error(err);
      Alert.alert("Error", "Failed to fetch templates");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTemplates();
  }, []);

  /* ---------------- Search Filtering ---------------- */
  useEffect(() => {
    if (!debouncedSearch) {
      setFilteredData(data);
      return;
    }

    const filtered = data.filter((item) =>
      item.template_name.toLowerCase().includes(debouncedSearch)
    );

    setFilteredData(filtered);
    setPage(1);
  }, [debouncedSearch, data]);

  /* ---------------- Delete Template ---------------- */
  const openDeleteModal = (id) => {
    setSelectedId(id);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!selectedId) return;

    setDeleteLoading(true);

    try {
      const res = await deleteEmailTemplate(selectedId);

      if (res.success) {
        Alert.alert("Success", res.message || "Template deleted successfully");
        fetchTemplates();
      } else {
        Alert.alert("Error", res.message || "Delete failed");
      }
    } catch (e) {
      Alert.alert(
        "Error",
        e?.response?.data?.message || "Server error while deleting"
      );
    } finally {
      setDeleteLoading(false);
      setShowDeleteModal(false);
      setSelectedId(null);
    }
  };

  /* ---------------- Column Definitions ---------------- */
  const columns = [
    {
      name: "Template Name",
      selector: (row) => row.template_name,
      width: 180,
    },
    {
      name: "Subject",
      selector: (row) => row.template_subject,
      width: 180,
    },
    {
      name: "Created Date",
      selector: (row) => row.created_at,
      center: true,
      width: 120,
    },
    {
      name: (
        <Text style={styles.headerMultilineText}>
          Total Emails{"\n"}Sent
        </Text>
      ),
      center: true,
      width: 110,
      cell: (row) => (
        <TouchableOpacity
          onPress={() =>
            navigation.navigate("UsageDetails", { id: row.id })
          }
        >
          <Text style={styles.linkText}>{row.email_count || 0}</Text>
        </TouchableOpacity>
      ),
    },
    {
      name: "Opened",
      center: true,
      width: 90,
      cell: (row) => (
        <Text style={styles.cellText}>{row.opened}</Text>
      ),
    },
    {
      name: "Action",
      center: true,
      width: 100,
      cell: (row) => (
        <View style={styles.actionCell}>
          <TouchableOpacity
            onPress={() =>
              navigation.navigate("EditTemplate", { id: row.id })
            }
          >
            <Ionicons name="pencil-outline" size={16} color="#2563eb" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => openDeleteModal(row.id)}>
            <Ionicons name="trash-outline" size={16} color="#dc2626" />
          </TouchableOpacity>
        </View>
      ),
    },
  ];

  const paginatedData = filteredData.slice(
    (page - 1) * pageSize,
    page * pageSize
  );

  return (
    <View style={styles.card}>
      {/* Search Input */}
      <View style={styles.searchContainer}>
        <View style={styles.inputWrapper}>
          <TextInput
            placeholder="Search Template..."
            placeholderTextColor="#9ca3af"
            value={search}
            onChangeText={setSearch}
            style={styles.searchInput}
          />
          <Ionicons
            name="search"
            size={18}
            color="#9ca3af"
            style={styles.searchIcon}
          />
        </View>
      </View>

      {/* Common Table */}
      <CommonTable
        columns={columns}
        data={paginatedData}
        loading={loading}
        totalRows={filteredData.length}
        page={page}
        pageSize={pageSize}
        onPageChange={(newPage) => setPage(newPage)}
      />

      {/* Delete Confirmation Modal */}
      <Modal
        visible={showDeleteModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowDeleteModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Delete Template</Text>
            <Text style={styles.modalSubTitle}>
              Are you sure you want to delete this template?
            </Text>

            <View style={styles.modalActions}>
              <TouchableOpacity
                disabled={deleteLoading}
                onPress={() => setShowDeleteModal(false)}
                style={styles.cancelBtn}
              >
                <Text style={styles.cancelBtnText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                disabled={deleteLoading}
                onPress={confirmDelete}
                style={styles.deleteBtn}
              >
                {deleteLoading ? (
                  <ActivityIndicator size="small" color="#ffffff" />
                ) : (
                  <Text style={styles.deleteBtnText}>Delete</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  searchContainer: {
    alignItems: "flex-end",
    marginBottom: 16,
  },
  inputWrapper: {
    position: "relative",
    width: 250,
    justifyContent: "center",
  },
  searchInput: {
    borderWidth: 1,
    borderColor: "#e9e9e9",
    borderRadius: 6,
    paddingVertical: 8,
    paddingLeft: 12,
    paddingRight: 36,
    fontSize: 13,
    color: "#000000",
  },
  searchIcon: {
    position: "absolute",
    right: 10,
  },
  headerMultilineText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#4b5563",
    textAlign: "center",
  },
  linkText: {
    color: "#2563eb",
    fontWeight: "600",
    textDecorationLine: "underline",
    fontSize: 13,
  },
  cellText: {
    fontSize: 13,
    color: "#374151",
  },
  actionCell: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 24,
    width: 320,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#000000",
  },
  modalSubTitle: {
    fontSize: 14,
    color: "#6b7280",
    marginTop: 8,
  },
  modalActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 12,
    marginTop: 24,
  },
  cancelBtn: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: "#e5e7eb",
    borderRadius: 8,
  },
  cancelBtnText: {
    color: "#000000",
    fontSize: 14,
    fontWeight: "500",
  },
  deleteBtn: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: "#dc2626",
    borderRadius: 8,
    minWidth: 70,
    alignItems: "center",
  },
  deleteBtnText: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "500",
  },
});