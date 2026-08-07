import React, { useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  StyleSheet,
  Alert,
} from "react-native";
import Ionicons from "@react-native-vector-icons/ionicons";

import {
  getProgramUniversities,
  shareProgram,
} from "../../../services/allServices";
import Loader from "../../../components/Loader";

export default function ShareProgram({ route, navigation }) {
  const programId = route?.params?.id;

  const [universities, setUniversities] = useState([]);
  const [selected, setSelected] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [programName, setProgramName] = useState("");

  /* ---------------- Load Universities ---------------- */

  useEffect(() => {
    if (!programId) return;

    const load = async () => {
      try {
        const res = await getProgramUniversities(programId);
        const programData = res?.data;
        setProgramName(programData?.program_name || "");
        const list = programData?.universities || [];
        setUniversities(list);

        const pre = list
          .filter((u) => u.is_shared)
          .map((u) => u.id);

        setSelected(pre);
      } catch (err) {
        Alert.alert("Error", "Failed to load universities");
      } finally {
        setPageLoading(false);
      }
    };

    load();
  }, [programId]);

  /* ---------------- Search Filter ---------------- */

  const filtered = useMemo(() => {
    if (!search) return universities;

    return universities.filter((u) =>
      u.name?.toLowerCase().includes(search.toLowerCase())
    );
  }, [search, universities]);

  /* ---------------- Toggle Single ---------------- */

  const toggle = (id) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  /* ---------------- Select All ---------------- */

  const allFilteredIds = filtered.map((u) => u.id);

  const isAllSelected =
    filtered.length > 0 &&
    allFilteredIds.every((id) => selected.includes(id));

  const toggleAll = () => {
    if (isAllSelected) {
      setSelected((prev) =>
        prev.filter((id) => !allFilteredIds.includes(id))
      );
    } else {
      setSelected((prev) => [
        ...new Set([...prev, ...allFilteredIds]),
      ]);
    }
  };

  /* ---------------- Share Handler ---------------- */

  const handleShare = async () => {
    setLoading(true);

    try {
      await shareProgram({
        program_id: programId,
        university_ids: selected,
      });

      Alert.alert("Success", "Program Shared Successfully");
      navigation.goBack();
    } catch (e) {
      Alert.alert(
        "Error",
        e?.response?.data?.message || "Share failed"
      );
    } finally {
      setLoading(false);
    }
  };


  return (
    <View style={styles.screen}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <Loader visible={pageLoading} />
        {/* Header Bar */}
        <View style={styles.headerBar}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backBtn}
          >
            <Ionicons name="arrow-back" size={20} color="#000" />
            <Text style={styles.backBtnText}>Back to Programs List</Text>
          </TouchableOpacity>

          <Text style={styles.headerTitle} numberOfLines={1}>
            {programName}
          </Text>
        </View>

        {/* Subtitle / Description */}
        <Text style={styles.subtext}>
          This tab enables you to share{" "}
          <Text style={styles.highlightText}>specific programs</Text> with
          universities.
        </Text>

        {/* Card Container */}
        <View style={styles.card}>
          {/* Search Box */}
          <View style={styles.searchRow}>
            <View style={styles.searchBox}>
              <TextInput
                placeholder="Search universities..."
                placeholderTextColor="#9ca3af"
                value={search}
                onChangeText={(text) => setSearch(text)}
                style={styles.searchInput}
              />
              <Ionicons name="search-outline" size={18} color="#9ca3af" />
            </View>
          </View>

          {/* Select All Controls */}
          <View style={styles.selectAllRow}>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={toggleAll}
              style={styles.checkboxLabelRow}
            >
              <Ionicons
                name={isAllSelected ? "checkbox" : "square-outline"}
                size={20}
                color={isAllSelected ? "#2563eb" : "#9ca3af"}
              />
              <Text style={styles.selectAllText}>
                Universities ({filtered.length})
              </Text>
            </TouchableOpacity>

            <Text style={styles.selectedCountText}>
              Selected ({selected.length})
            </Text>
          </View>

          {/* List Wrapper */}
          <View style={styles.listCard}>
            {filtered.length === 0 ? (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>No Universities Found</Text>
              </View>
            ) : (
              filtered.map((uni, index) => {
                const isChecked = selected.includes(uni.id);
                return (
                  <TouchableOpacity
                    key={uni.id}
                    activeOpacity={0.7}
                    onPress={() => toggle(uni.id)}
                    style={[
                      styles.listItem,
                      index === filtered.length - 1 && styles.lastListItem,
                    ]}
                  >
                    <Ionicons
                      name={isChecked ? "checkbox" : "square-outline"}
                      size={20}
                      color={isChecked ? "#2563eb" : "#9ca3af"}
                    />
                    <Text style={styles.itemText}>{uni.name}</Text>
                  </TouchableOpacity>
                );
              })
            )}
          </View>

          {/* Bottom Action Footer */}
          <View style={styles.actionFooter}>
            <TouchableOpacity
              onPress={handleShare}
              disabled={loading}
              style={[styles.shareBtn, loading && styles.disabledBtn]}
            >
              {loading ? (
                <ActivityIndicator size="small" color="#ffffff" />
              ) : (
                <Text style={styles.shareBtnText}>
                  SHARE ({selected.length}) →
                </Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f8fafc",
  },
  loadingText: {
    marginTop: 10,
    color: "#6b7280",
    fontSize: 14,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  headerBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  backBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingVertical: 4,
  },
  backBtnText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#000000",
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#000000",
    maxWidth: "40%",
  },
  subtext: {
    fontStyle: "italic",
    fontSize: 13,
    color: "#000000",
    marginBottom: 16,
  },
  highlightText: {
    color: "#2563eb",
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  searchRow: {
    alignItems: "flex-end",
    marginBottom: 16,
  },
  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 6,
    paddingHorizontal: 12,
    height: 38,
    width: 220,
    backgroundColor: "#ffffff",
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    color: "#000000",
    paddingVertical: 0,
  },
  selectAllRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  checkboxLabelRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  selectAllText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#000000",
  },
  selectedCountText: {
    fontSize: 13,
    color: "#6b7280",
  },
  listCard: {
    backgroundColor: "#ffffff",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    overflow: "hidden",
  },
  listItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
    backgroundColor: "#ffffff",
  },
  lastListItem: {
    borderBottomWidth: 0,
  },
  itemText: {
    fontSize: 14,
    color: "#111827",
  },
  emptyContainer: {
    padding: 24,
    alignItems: "center",
  },
  emptyText: {
    color: "#9ca3af",
    fontSize: 14,
  },
  actionFooter: {
    alignItems: "flex-end",
    marginTop: 20,
  },
  shareBtn: {
    backgroundColor: "#2563eb",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  disabledBtn: {
    backgroundColor: "#93c5fd",
  },
  shareBtnText: {
    color: "#ffffff",
    fontWeight: "600",
    fontSize: 13,
  },
});