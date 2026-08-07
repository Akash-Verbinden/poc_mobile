import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  Modal,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import Ionicons from '@react-native-vector-icons/ionicons';
import Toast from 'react-native-toast-message';
import ChapterSidebar from './ChapterSidebar';
import ChapterEditor from './ChapterEditor';
import TopicEditor from './TopicEditor';

import {
  getProgramTree,
  getChapterContents,
  getTopicContents,
} from '../../../services/allServices';
import Loader from '../../../components/Loader';

export default function ProgramBuilder({ route, navigation }) {
  const programId = route?.params?.id || {};

  const [program, setProgram] = useState([]);
  const [programName, setProgramName] = useState('');
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [selectedChapter, setSelectedChapter] = useState(null);
  const [mode, setMode] = useState('chapter');
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  console.log('Program ID:', programId);

  const fetchProgram = async () => {
    try {
      setLoading(true);
      const res = await getProgramTree(programId);
      console.log('Program Tree Response:', res);
      if (res?.success) {
        setProgram(res.data.chapters);
        setProgramName(res.data.program_name);
        if (res.data.chapters?.length > 0) {
          const firstChapterId =
            res.data.chapters[0].chapter_id || res.data.chapters[0]._id;
          await fetchChapterContent(firstChapterId);
        }
        setIsEditing(false);
      } else {
        Toast.show({
          type: 'error',
          text1: res?.message || 'Failed to fetch tree',
        });
      }
    } catch (error) {
      Toast.show({ type: 'error', text1: 'Failed to load program tree.' });
    } finally {
      setLoading(false);
    }
  };

  const fetchChapterContent = async chapterId => {
    setLoading(true);
    try {
      const res = await getChapterContents(chapterId);
      if (res?.success) {
        setSelectedChapter(res.data);
        setMode('chapter');
      }
    } catch (error) {
      Toast.show({ type: 'error', text1: 'Failed to load chapter content' });
    } finally {
      setLoading(false);
    }
  };

  const fetchTopicContent = async topicId => {
    setLoading(true);
    try {
      const res = await getTopicContents(topicId);
      if (res?.success) {
        setSelectedTopic(res.data);
        setMode('topic');
      }
    } catch (error) {
      Toast.show({ type: 'error', text1: 'Failed to load topic content' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (programId) fetchProgram();
  }, [programId]);

  return (
    <SafeAreaView style={styles.container}>
      <Loader visible={loading} />
      {/* Top Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.navBtn}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={22} color="#000" />
        </TouchableOpacity>

        <Text style={styles.headerTitle} numberOfLines={1}>
          {programName || 'Program Builder'}
        </Text>

        <TouchableOpacity
          style={styles.menuBtn}
          onPress={() => setIsSidebarOpen(true)}
        >
          <Ionicons name="list" size={20} color="#2563eb" />
          <Text style={styles.menuBtnText}>Structure</Text>
        </TouchableOpacity>
      </View>

      {/* Editor Surface */}
      <View style={styles.editorContainer}>
        {mode === 'chapter' && (
          <ChapterEditor
            program={program}
            chapter={selectedChapter}
            fetchProgram={fetchProgram}
            setProgram={setProgram}
            isEditing={isEditing}
            setIsEditing={setIsEditing}
            programId={programId}
            navigation={navigation}
          />
        )}

        {mode === 'topic' && (
          <TopicEditor
            topic={selectedTopic}
            programId={programId}
            fetchProgram={fetchProgram}
            isEditing={isEditing}
            setIsEditing={setIsEditing}
            navigation={navigation}
          />
        )}
      </View>

      {/* Structure Modal Sheet */}
      <Modal
        visible={isSidebarOpen}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setIsSidebarOpen(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.sidebarSheet}>
            <View style={styles.sheetHeader}>
              <Text style={styles.sheetTitle}>Chapters & Topics</Text>
              <TouchableOpacity
                style={styles.doneBtn}
                onPress={() => setIsSidebarOpen(false)}
              >
                <Text style={styles.doneBtnText}>Close</Text>
                <Ionicons name="close" size={20} color="#2563eb" />
              </TouchableOpacity>
            </View>
            <ChapterSidebar
              program={program}
              setProgram={setProgram}
              setSelectedTopic={setSelectedTopic}
              setSelectedChapter={setSelectedChapter}
              setMode={setMode}
              setIsEditing={setIsEditing}
              fetchProgram={fetchProgram}
              fetchChapterContent={fetchChapterContent}
              fetchTopicContent={fetchTopicContent}
              closeSidebar={() => setIsSidebarOpen(false)} 
            />
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9fafb' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  navBtn: { padding: 4 },
  headerTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    flex: 1,
    marginHorizontal: 12,
  },
  menuBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#eff6ff',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  menuBtnText: { color: '#2563eb', fontWeight: '600', fontSize: 13 },
  editorContainer: { flex: 1 },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  sidebarSheet: {
    height: '80%',
    backgroundColor: '#fff',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: 16,
  },
  sheetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sheetTitle: { fontSize: 18, fontWeight: 'bold', color: '#000' },
  doneBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#eff6ff',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
  },
  doneBtnText: { color: '#2563eb', fontWeight: '600', fontSize: 13 },
});
