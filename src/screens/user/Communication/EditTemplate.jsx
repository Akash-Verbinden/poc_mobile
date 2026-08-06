import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Modal,
  Image,
  StyleSheet,
  SafeAreaView,
  Alert,
} from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import Ionicons from '@react-native-vector-icons/ionicons';
import RichTextEditor from '../../../components/RichTextEditor';
import {
  updateEmailTemplate,
  getEmailTemplate,
} from '../../../services/allServices';
import Loader from '../../../components/Loader';

export default function EditTemplate({ route, navigation }) {
  const templateId = route?.params?.id;

  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isDirty },
  } = useForm({
    defaultValues: {
      name: '',
      subject: '',
      body: '',
    },
  });

  const bodyValue = watch('body');

  /* Fetch Template */
  useEffect(() => {
    if (!templateId) return;

    const fetchTemplate = async () => {
      try {
        const res = await getEmailTemplate(templateId);
        const t = res?.data?.data || res?.data || res;

        reset({
          name: t.template_name || '',
          subject: t.template_subject || '',
          body: t.template_body || '',
        });
      } catch (err) {
        Alert.alert('Error', 'Failed to load template');
      } finally {
        setPageLoading(false);
      }
    };

    fetchTemplate();
  }, [templateId, reset]);

  /* Submit Handler */
  const onSubmit = async data => {
    try {
      setLoading(true);

      const res = await updateEmailTemplate(templateId, {
        template_name: data.name.trim(),
        template_subject: data.subject.trim(),
        template_body: data.body,
      });

      if (res?.success !== false) {
        setShowSuccess(true);
        setEditMode(false);
      }
    } catch (e) {
      Alert.alert(
        'Update Failed',
        e?.response?.data?.message || 'Failed to update template',
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <Loader visible={pageLoading} />
        {/* Top Navigation Row: Back Link & Action */}
        <View style={styles.topBar}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
            activeOpacity={0.7}
          >
            <Ionicons name="arrow-back" size={18} color="#1F2937" />
            <Text style={styles.backText}>Back to Template List</Text>
          </TouchableOpacity>

          {!editMode && (
            <TouchableOpacity
              onPress={() => setEditMode(true)}
              style={styles.editBtn}
              activeOpacity={0.8}
            >
              <Text style={styles.editBtnText}>EDIT</Text>
              <Ionicons name="pencil" size={12} color="#FFF" />
            </TouchableOpacity>
          )}
        </View>

        {/* Dedicated Page Heading */}
        <View style={styles.titleSection}>
          <Text style={styles.pageTitle}>Edit Template</Text>
          <Text style={styles.instructionText}>
            To send emails, select the audience, the email template that you
            created. It will auto populate the subject and the body of the
            email. Make any changes to the content and click on “Send”.
          </Text>
        </View>

        {/* Main Card */}
        <View style={styles.card}>
          <View style={styles.rowGrid}>
            {/* Template Name */}
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>
                Template Name<Text style={styles.required}> *</Text>
              </Text>
              <Controller
                control={control}
                name="name"
                rules={{ required: true }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    style={[
                      styles.input,
                      !editMode && styles.disabledInput,
                      errors.name && styles.errorInput,
                    ]}
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    editable={editMode}
                    placeholder="Template Name"
                    placeholderTextColor="#9CA3AF"
                  />
                )}
              />
            </View>

            {/* Subject */}
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>
                Subject<Text style={styles.required}> *</Text>
              </Text>
              <Controller
                control={control}
                name="subject"
                rules={{ required: true }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    style={[
                      styles.input,
                      !editMode && styles.disabledInput,
                      errors.subject && styles.errorInput,
                    ]}
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    editable={editMode}
                    placeholder="Subject"
                    placeholderTextColor="#9CA3AF"
                  />
                )}
              />
            </View>
          </View>

          {/* Email Body */}
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>
              Email Body<Text style={styles.required}> *</Text>
            </Text>

            <RichTextEditor
              key={editMode ? 'edit' : 'view'}
              model={bodyValue}
              readOnly={!editMode}
              onChange={val =>
                setValue('body', val, {
                  shouldValidate: true,
                  shouldDirty: true,
                  shouldTouch: true,
                })
              }
            />
          </View>

          {/* Action Buttons */}
          <View style={styles.actionRow}>
            {editMode && (
              <TouchableOpacity
                onPress={handleSubmit(onSubmit)}
                disabled={!isDirty || loading}
                style={[
                  styles.submitBtn,
                  (!isDirty || loading) && styles.disabledSubmitBtn,
                ]}
              >
                {loading ? (
                  <ActivityIndicator size="small" color="#FFF" />
                ) : (
                  <Text style={styles.submitText}>UPDATE →</Text>
                )}
              </TouchableOpacity>
            )}

            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={styles.cancelBtn}
            >
              <Text style={styles.cancelText}>CANCEL</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* Success Modal */}
      <Modal visible={showSuccess} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Template Updated Successfully</Text>

            {/* Un-comment if image exists */}
            {/* <Image
              source={require('../../../assets/success.png')}
              style={styles.successImage}
              resizeMode="contain"
            /> */}

            <TouchableOpacity
              onPress={() => {
                setShowSuccess(false);
                navigation.navigate('Communication');
              }}
              style={styles.continueBtn}
            >
              <Text style={styles.continueText}>CONTINUE →</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    color: '#6B7280',
  },
  scrollContent: {
    padding: 16,
  },
  /* Layout Changes for Header */
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  backText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
  },
  editBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2563EB',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    gap: 4,
  },
  editBtnText: {
    color: '#FFF',
    fontWeight: '600',
    fontSize: 12,
  },
  titleSection: {
    marginBottom: 16,
  },
  pageTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 6,
  },
  instructionText: {
    fontStyle: 'italic',
    fontSize: 12,
    color: '#4B5563',
    lineHeight: 18,
  },
  /* Form Card Styles */
  card: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  rowGrid: {
    flexDirection: 'column',
  },
  fieldGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 6,
  },
  required: {
    color: '#EF4444',
  },
  input: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: '#000',
    backgroundColor: '#FFF',
  },
  disabledInput: {
    backgroundColor: '#F9FAFB',
    borderColor: '#E5E7EB',
    color: '#374151',
  },
  errorInput: {
    borderColor: '#EF4444',
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    gap: 12,
    marginTop: 20,
  },
  cancelBtn: {
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  cancelText: {
    color: '#000',
    fontWeight: '600',
    fontSize: 13,
  },
  submitBtn: {
    backgroundColor: '#2563EB',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  disabledSubmitBtn: {
    backgroundColor: '#93C5FD',
  },
  submitText: {
    color: '#FFF',
    fontWeight: '600',
    fontSize: 13,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#FFF',
    width: '100%',
    maxWidth: 340,
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    textAlign: 'center',
  },
  successImage: {
    width: 80,
    height: 80,
    marginVertical: 20,
  },
  continueBtn: {
    backgroundColor: '#2563EB',
    width: '100%',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  continueText: {
    color: '#FFF',
    fontWeight: '600',
  },
});
