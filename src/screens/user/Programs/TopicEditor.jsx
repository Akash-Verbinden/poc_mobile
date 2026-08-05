import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Toast from 'react-native-toast-message';
import ProgramContentEditor from './ProgramContentEditor';
import {
  createTopic,
  updateTopic,
  publishProgram,
} from '../../../services/allServices';

export default function TopicEditor({
  topic,
  programId,
  fetchProgram,
  isEditing,
  setIsEditing,
  navigation,
}) {
  const [title, setTitle] = useState('');
  const [subTitle, setSubTitle] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    if (topic) {
      setTitle(topic.topic_name || '');
      setSubTitle(topic.sub_title || '');
      setDescription(topic.description || '');
    }
  }, [topic]);

  const handleDraft = async () => {
    let res;
    if (topic?.isNew) {
      res = await createTopic({
        chapter_id: topic.chapter_id,
        topic_name: title,
        sub_title: subTitle,
        description,
      });
    } else {
      res = await updateTopic(topic._id, {
        topic_name: title,
        sub_title: subTitle,
        description,
      });
    }

    if (res?.success) {
      Toast.show({ type: 'success', text1: res.message || 'Topic saved' });
      setIsEditing(false);
      await fetchProgram();
    }
  };

  const handleCancel = () => {
    if (topic) {
      setTitle(topic.topic_name || '');
      setSubTitle(topic.sub_title || '');
      setDescription(topic.description || '');
    }
    setIsEditing(false);
  };

  const handlePublishProgram = async () => {
    if (!programId) return;
    const res = await publishProgram(programId);
    if (res?.success) {
      Toast.show({ type: 'success', text1: res.message });
      navigation.goBack();
    } else {
      Toast.show({ type: 'error', text1: res?.message });
    }
  };

  if (!topic) {
    return (
      <View style={styles.center}>
        <Text style={styles.emptyText}>Select Topic</Text>
      </View>
    );
  }

  return (
    <ProgramContentEditor
      title={title}
      setTitle={setTitle}
      subTitle={subTitle}
      setSubTitle={setSubTitle}
      description={description}
      setDescription={setDescription}
      onDraft={handleDraft}
      onCancel={handleCancel}
      isEditing={isEditing}
      setIsEditing={setIsEditing}
      titleLabel="Topic Name"
      publishProgram={handlePublishProgram}
      isNew={topic.isNew}
    />
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyText: { color: '#6b7280', fontSize: 16 },
});
