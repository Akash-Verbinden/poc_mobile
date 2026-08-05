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
}) {
  const [openChapter, setOpenChapter] = useState(null);

  const chapters = program || [];
  console.log("Chapters in Sidebar:", chapters);

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
      {chapters.map((chapter,index) => {
        const isOpen = openChapter === chapter.chapter_id;
        return (
          <View key={chapter.chapter_id || index} style={styles.chapterCard}>
            <TouchableOpacity
              style={[styles.chapterHeader, isOpen && styles.activeChapterHeader]}
              onPress={() => {
                setOpenChapter(isOpen ? null : chapter.chapter_id);
                fetchChapterContent(chapter.chapter_id);
                setSelectedTopic(null);
                setMode("chapter");
                setIsEditing(false);
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
                <TouchableOpacity
                  onPress={() => {
                    fetchChapterContent(chapter.chapter_id);
                    setMode("chapter");
                    setIsEditing(true);
                  }}
                  style={styles.iconBtn}
                >
                  <Ionicons name="pencil" size={16} color="#000" />
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => handleDeleteChapter(chapter.chapter_id)}
                  style={styles.iconBtn}
                >
                  <Ionicons name="trash-outline" size={16} color="#ef4444" />
                </TouchableOpacity>
              </View>
            </TouchableOpacity>

            {isOpen && (
              <View style={styles.topicContainer}>
                {chapter.topics?.map((topic, tIndex) => (
                  <View key={topic.topic_id || tIndex} style={styles.topicRow}>
                    <TouchableOpacity
                      style={{ flex: 1 }}
                      onPress={() => {
                        fetchTopicContent(topic.topic_id);
                        setSelectedTopic(topic);
                        setMode("topic");
                        setIsEditing(false);
                      }}
                    >
                      <Text style={styles.topicTitle}>
                        {index + 1}.{tIndex + 1} {topic.title || topic.topic_name}
                      </Text>
                    </TouchableOpacity>

                    <View style={styles.row}>
                      <TouchableOpacity
                        onPress={() => {
                          fetchTopicContent(topic.topic_id);
                          setMode("topic");
                          setIsEditing(true);
                        }}
                        style={styles.iconBtn}
                      >
                        <Ionicons name="pencil" size={14} color="#000" />
                      </TouchableOpacity>

                      <TouchableOpacity
                        onPress={() => handleDeleteTopic(topic.topic_id)}
                        style={styles.iconBtn}
                      >
                        <Ionicons name="trash-outline" size={14} color="#ef4444" />
                      </TouchableOpacity>
                    </View>
                  </View>
                ))}

                <TouchableOpacity
                  style={styles.addTopicBtn}
                  onPress={() => handleAddTopic(chapter.chapter_id)}
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
  chapterTitle: { fontSize: 14, fontWeight: "600", color: "#000", marginLeft: 6 },
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