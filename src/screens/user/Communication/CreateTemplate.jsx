import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Ionicons from '@react-native-vector-icons/ionicons';
import Toast from 'react-native-toast-message';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import RichTextEditor from '../../../components/RichTextEditor';
import { createEmailTemplate } from '../../../services/allServices';
import BackButton from '../../../components/Buttons/BackButton';

/* ---------------- Schema ---------------- */
const schema = z.object({
  name: z.string().min(2, 'Template name is required'),
  subject: z.string().min(2, 'Subject is required'),
  body: z.string().min(1, 'Email body is required'),
});

export default function CreateTemplatePage() {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isValid },
  } = useForm({
    resolver: zodResolver(schema),
    mode: 'onChange',
    defaultValues: {
      name: '',
      subject: '',
      body: '',
    },
  });

  const bodyValue = watch('body');

  /* ---------------- Submit ---------------- */
  const onSubmit = async data => {
    try {
      setLoading(true);

      await createEmailTemplate({
        template_name: data.name,
        template_subject: data.subject,
        template_body: data.body,
      });

      Toast.show({
        type: 'success',
        text1: 'Template Created Successfully',
      });

      navigation.goBack();
    } catch (e) {
      Toast.show({
        type: 'error',
        text1: e?.response?.data?.message || 'Failed to create template',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
    >
      {/* Top Header */}
      <View style={styles.headerRow}>
        <BackButton title="Back to Template List" />

        <Text style={styles.headerTitle}>Create Template</Text>
      </View>

      {/* Description Text */}
      <Text style={styles.descriptionText}>
        Craft your <Text style={styles.highlightText}>email template</Text> by
        filling in the fields. You can add a variety of content in the email
        body using the text editor.
      </Text>

      {/* Form Card */}
      <View style={styles.card}>
        {/* 1. Template Name (Separate Line) */}
        <View style={styles.fieldContainer}>
          <Text style={styles.label}>
            Template Name <Text style={styles.required}>*</Text>
          </Text>

          <Controller
            control={control}
            name="name"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                placeholder="Enter Template Name"
                placeholderTextColor="#9ca3af"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                style={[styles.input, errors.name && styles.inputError]}
              />
            )}
          />

          {errors.name && (
            <Text style={styles.errorText}>{errors.name.message}</Text>
          )}
        </View>

        {/* 2. Subject (Separate Line) */}
        <View style={styles.fieldContainer}>
          <Text style={styles.label}>
            Subject <Text style={styles.required}>*</Text>
          </Text>

          <Controller
            control={control}
            name="subject"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                placeholder="Enter Subject"
                placeholderTextColor="#9ca3af"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                style={[styles.input, errors.subject && styles.inputError]}
              />
            )}
          />

          {errors.subject && (
            <Text style={styles.errorText}>{errors.subject.message}</Text>
          )}
        </View>

        {/* 3. Email Body */}
        <View style={styles.fieldContainer}>
          <Text style={styles.label}>
            Email Body <Text style={styles.required}>*</Text>
          </Text>

          <View style={styles.editorContainer}>
            <RichTextEditor
              model={bodyValue}
              onChange={val => setValue('body', val, { shouldValidate: true })}
              removeClippedSubviews={false}
              keyboardShouldPersistTaps="handled"
            />
          </View>

          {errors.body && (
            <Text style={styles.errorText}>{errors.body.message}</Text>
          )}
        </View>

        {/* Action Buttons */}
        <View style={styles.footerActions}>
          <TouchableOpacity
            onPress={handleSubmit(onSubmit)}
            disabled={!isValid || loading}
            style={[
              styles.saveBtn,
              (!isValid || loading) && styles.saveBtnDisabled,
            ]}
          >
            {loading ? (
              <ActivityIndicator size="small" color="#ffffff" />
            ) : (
              <Text style={styles.saveBtnText}>SAVE →</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.cancelText}>CANCEL</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  content: {
    padding: 16,
    gap: 12,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 4,
    gap: 16,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#000000',
    textAlign: 'right',
  },
  descriptionText: {
    fontSize: 13,
    fontStyle: 'italic',
    color: '#374151',
    lineHeight: 18,
    marginBottom: 4,
  },
  highlightText: {
    color: '#2563eb',
    fontWeight: '500',
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 20,
    gap: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  fieldContainer: {
    gap: 6,
  },
  label: {
    fontSize: 13,
    fontWeight: '500',
    color: '#000000',
  },
  required: {
    color: '#ef4444',
  },
  input: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 44,
    fontSize: 14,
    color: '#000000',
    backgroundColor: '#ffffff',
  },
  inputError: {
    borderColor: '#ef4444',
  },
  errorText: {
    fontSize: 12,
    color: '#ef4444',
    marginTop: 2,
  },
  editorContainer: {
    marginTop: 4,
  },
  footerActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    gap: 16,
    marginTop: 8,
  },
  saveBtn: {
    backgroundColor: '#2563eb',
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 8,
  },
  saveBtnDisabled: {
    backgroundColor: '#93c5fd',
  },
  saveBtnText: {
    color: '#ffffff',
    fontWeight: '600',
    fontSize: 14,
  },
  cancelText: {
    color: '#4b5563',
    fontWeight: '500',
    fontSize: 14,
  },
});
