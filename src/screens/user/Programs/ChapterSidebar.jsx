import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
} from "react-native";
import Ionicons from "@react-native-vector-icons/ionicons";
import { deleteChapter, deleteTopic } from "../../../services/allServices";

export default function ChapterSidebar({
  program,
  setSelectedTopic,
  setSelectedChapter,
  setMode,
  setIsEditing,
  fetchProgram,
  fetchChapterContent,
  fetchTopicContent,
  closeSidebar,
}) {
  const [openChapter, setOpenChapter] = useState(null);

  const chapters = program || [];

  const handleAddTopic = (chapterId) => {
    setSelectedChapter(null);
    setSelectedTopic({
      chapter_id: chapterId,
      topic_name: "",
      sub_title: "",
      description: "",
      isNew: true,
    });
    setMode("topic");
    setIsEditing(true);
    closeSidebar();
  };

  const handleDeleteChapter = (chapterId) => {
    Alert.alert("Delete Chapter", "Are you sure you want to delete this chapter?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          const res = await deleteChapter(chapterId);
          if (res?.success) fetchProgram();
        },
      },
    ]);
  };

  const handleDeleteTopic = (topicId) => {
    Alert.alert("Delete Topic", "Are you sure you want to delete this topic?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          const res = await deleteTopic(topicId);
          if (res?.success) fetchProgram();
        },
      },
    ]);
  };

  return (
    <ScrollView style={styles.container}>
      {chapters.map((chapter, index) => {
        const chapterId = chapter.chapter_id || chapter._id;
        const isOpen = openChapter === chapterId;

        return (
          <View key={chapterId || index} style={styles.chapterCard}>
            <TouchableOpacity
              style={[styles.chapterHeader, isOpen && styles.activeChapterHeader]}
              onPress={() => {
                if (isOpen) {
                  // Rule 2: Clicking the open chapter again closes the modal
                  closeSidebar();
                } else {
                  // Expanding a new chapter keeps modal open
                  setOpenChapter(chapterId);
                  fetchChapterContent(chapterId);
                  setSelectedTopic(null);
                  setMode("chapter");
                  setIsEditing(false);
                }
              }}
            >
              <View style={styles.row}>
                <Ionicons
                  name={isOpen ? "chevron-down" : "chevron-forward"}
                  size={16}
                  color="#000"
                />
                <Text style={styles.chapterTitle}>
                  Chapter {index + 1}: {chapter.title || chapter.chapter_name}
                </Text>
              </View>

              <View style={styles.row}>
                {/* Pencil Edit Icon -> Closes modal */}
                <TouchableOpacity
                  onPress={(e) => {
                    e.stopPropagation();
                    fetchChapterContent(chapterId);
                    setMode("chapter");
                    setIsEditing(true);
                    closeSidebar();
                  }}
                  style={styles.iconBtn}
                >
                  <Ionicons name="pencil" size={16} color="#000" />
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={(e) => {
                    e.stopPropagation();
                    handleDeleteChapter(chapterId);
                  }}
                  style={styles.iconBtn}
                >
                  <Ionicons name="trash-outline" size={16} color="#ef4444" />
                </TouchableOpacity>
              </View>
            </TouchableOpacity>

            {/* Topics Nested Items */}
            {isOpen && (
              <View style={styles.topicContainer}>
                {chapter.topics?.map((topic, tIndex) => {
                  const topicId = topic.topic_id || topic._id;
                  return (
                    <View key={topicId || tIndex} style={styles.topicRow}>
                      {/* Selecting Topic -> Fetches content & Closes Modal */}
                      <TouchableOpacity
                        style={{ flex: 1 }}
                        onPress={() => {
                          fetchTopicContent(topicId);
                          setSelectedTopic(topic);
                          setMode("topic");
                          setIsEditing(false);
                          closeSidebar();
                        }}
                      >
                        <Text style={styles.topicTitle}>
                          {index + 1}.{tIndex + 1} {topic.title || topic.topic_name}
                        </Text>
                      </TouchableOpacity>

                      <View style={styles.row}>
                        {/* Topic Pencil Edit -> Closes Modal */}
                        <TouchableOpacity
                          onPress={() => {
                            fetchTopicContent(topicId);
                            setMode("topic");
                            setIsEditing(true);
                            closeSidebar();
                          }}
                          style={styles.iconBtn}
                        >
                          <Ionicons name="pencil" size={14} color="#000" />
                        </TouchableOpacity>

                        <TouchableOpacity
                          onPress={() => handleDeleteTopic(topicId)}
                          style={styles.iconBtn}
                        >
                          <Ionicons name="trash-outline" size={14} color="#ef4444" />
                        </TouchableOpacity>
                      </View>
                    </View>
                  );
                })}

                <TouchableOpacity
                  style={styles.addTopicBtn}
                  onPress={() => handleAddTopic(chapterId)}
                >
                  <Ionicons name="add-circle-outline" size={18} color="#2563eb" />
                  <Text style={styles.addTopicText}>Topic</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        );
      })}

      <TouchableOpacity
        style={styles.addChapterBtn}
        onPress={() => {
          setMode("chapter");
          setSelectedChapter(null);
          setIsEditing(true);
          closeSidebar();
        }}
      >
        <Ionicons name="add-circle" size={20} color="#fff" />
        <Text style={styles.addChapterText}>Add Chapter</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  chapterCard: { marginBottom: 10, borderRadius: 8, backgroundColor: "#fff", borderWidth: 1, borderColor: "#f3f4f6" },
  chapterHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", padding: 12, backgroundColor: "#f9fafb" },
  activeChapterHeader: { backgroundColor: "#e0e7ff" },
  chapterTitle: { fontSize: 14, fontWeight: "600", color: "#000", marginLeft: 6, flex: 1 },
  row: { flexDirection: "row", alignItems: "center" },
  iconBtn: { padding: 4, marginLeft: 8 },
  topicContainer: { paddingLeft: 24, paddingRight: 12, paddingVertical: 8, backgroundColor: "#fff" },
  topicRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: "#f3f4f6" },
  topicTitle: { fontSize: 13, color: "#374151" },
  addTopicBtn: { flexDirection: "row", alignItems: "center", gap: 6, marginTop: 8, paddingVertical: 4 },
  addTopicText: { color: "#2563eb", fontWeight: "600", fontSize: 13 },
  addChapterBtn: { flexDirection: "row", justifyContent: "center", alignItems: "center", gap: 8, backgroundColor: "#2563eb", paddingVertical: 14, borderRadius: 10, marginTop: 16, marginBottom: 32 },
  addChapterText: { color: "#fff", fontWeight: "bold", fontSize: 15 },
});