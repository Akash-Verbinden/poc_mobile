import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Modal,
  Alert,
} from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { createProgram } from '../../../services/allServices';
import Ionicons from '@react-native-vector-icons/ionicons';

const schema = z.object({
  name: z.string().min(2, 'Program name is required'),
  program_level: z.string().min(1, 'Program level is required'),
  description: z.string().optional(),
});

const PROGRAM_LEVELS = ['Undergraduate', 'Graduate'];

const CreateProgram = ({ navigation }) => {
  const [loading, setLoading] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [savedData, setSavedData] = useState(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isValid },
  } = useForm({
    resolver: zodResolver(schema),
    mode: 'onChange',
  });

  const selectedLevel = watch('program_level');

  const onSubmit = async data => {
    setLoading(true);
    try {
      const response = await createProgram({
        ...data,
        status: 'published',
      });

      if (!response?.success) {
        Alert.alert('Error', response?.message || 'Something went wrong');
        return;
      }

      setSavedData(data);
      setShowSuccessModal(true);
    } catch (error) {
      Alert.alert(
        'Error',
        error?.response?.data?.message || 'Server error occurred',
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Navigation Header */}
        <View style={styles.headerRow}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={20} color="#000" />
            <Text style={styles.backText}>Back to Programs List</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Create Program</Text>
          <View style={{ width: 40 }} /> Spacer for symmetry
        </View>

        {/* Subtitle / Note */}
        <Text style={styles.subtext}>
          Please fill the fields to create a new program. You can edit the
          information even after you publish the data and this{' '}
          <Text style={styles.highlightText}>new information</Text> will be
          updated for all users.
        </Text>

        {/* Form Card */}
        <View style={styles.card}>
          {/* Program Name Input */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>
              Program Name <Text style={styles.asterisk}>*</Text>
            </Text>
            <Controller
              control={control}
              name="name"
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  style={[styles.input, errors.name && styles.inputError]}
                  placeholder="Enter Program Name"
                  placeholderTextColor="#9CA3AF"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                />
              )}
            />
            {errors.name && (
              <Text style={styles.errorText}>{errors.name.message}</Text>
            )}
          </View>

          {/* Program Level Dropdown */}
          <View style={[styles.inputGroup, { zIndex: 1000 }]}>
            <Text style={styles.label}>
              Program Level <Text style={styles.asterisk}>*</Text>
            </Text>
            <TouchableOpacity
              style={[
                styles.dropdownTrigger,
                errors.program_level && styles.inputError,
              ]}
              onPress={() => setDropdownOpen(!dropdownOpen)}
              activeOpacity={0.8}
            >
              <Text
                style={
                  selectedLevel
                    ? styles.dropdownTextSelected
                    : styles.dropdownTextPlaceholder
                }
              >
                {selectedLevel || 'Choose Program Level'}
              </Text>
              <Text style={styles.chevron}>{dropdownOpen ? '▲' : '▼'}</Text>
            </TouchableOpacity>

            {dropdownOpen && (
              <View style={styles.dropdownMenu}>
                {PROGRAM_LEVELS.map(level => (
                  <TouchableOpacity
                    key={level}
                    style={styles.dropdownItem}
                    onPress={() => {
                      setValue('program_level', level, {
                        shouldValidate: true,
                        shouldDirty: true,
                      });
                      setDropdownOpen(false);
                    }}
                  >
                    <Text style={styles.dropdownItemText}>{level}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
            {errors.program_level && (
              <Text style={styles.errorText}>
                {errors.program_level.message}
              </Text>
            )}
          </View>

          {/* Description Input */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Description</Text>
            <Controller
              control={control}
              name="description"
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  style={[styles.input, styles.textArea]}
                  placeholder="Describe..."
                  placeholderTextColor="#9CA3AF"
                  multiline
                  numberOfLines={4}
                  textAlignVertical="top"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                />
              )}
            />
          </View>

          {/* Action Buttons */}
          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={[
                styles.submitButton,
                (!isValid || loading) && styles.submitButtonDisabled,
              ]}
              disabled={!isValid || loading}
              onPress={handleSubmit(onSubmit)}
            >
              {loading ? (
                <ActivityIndicator color="#FFFFFF" size="small" />
              ) : (
                <Text style={styles.submitButtonText}>SAVE PROGRAM →</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => navigation.goBack()}
            >
              <Text style={styles.cancelButtonText}>CANCEL</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* Success Modal */}
      <Modal
        visible={showSuccessModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowSuccessModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{savedData?.name}</Text>
            <Text style={styles.modalSubtitle}>
              Program Published Successfully
            </Text>

            <View style={styles.successBadge}>
              <Text style={styles.checkmark}>✓</Text>
            </View>

            <TouchableOpacity
              style={styles.continueButton}
              onPress={() => {
                setShowSuccessModal(false);
                navigation.navigate('Programs');
              }}
            >
              <Text style={styles.continueButtonText}>CONTINUE →</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default CreateProgram;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F5F7',
  },
  scrollContent: {
    padding: 16,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    padding: 6,
  },
  arrowIcon: {
    fontSize: 18,
    fontWeight: 'bold',
    marginRight: 6,
    color: '#111827',
  },
  backText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  subtext: {
    fontSize: 13,
    color: '#4B5563',
    fontStyle: 'italic',
    lineHeight: 18,
    marginBottom: 16,
  },
  highlightText: {
    color: '#2563EB',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  inputGroup: {
    marginBottom: 16,
    position: 'relative',
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#111827',
    marginBottom: 6,
  },
  asterisk: {
    color: '#EF4444',
  },
  input: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: '#111827',
    backgroundColor: '#FFFFFF',
  },
  inputError: {
    borderColor: '#EF4444',
  },
  errorText: {
    color: '#EF4444',
    fontSize: 12,
    marginTop: 4,
  },
  dropdownTrigger: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  dropdownTextSelected: {
    fontSize: 14,
    color: '#111827',
  },
  dropdownTextPlaceholder: {
    fontSize: 14,
    color: '#9CA3AF',
  },
  chevron: {
    fontSize: 10,
    color: '#6B7280',
  },
  dropdownMenu: {
    position: 'absolute',
    top: 68,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    zIndex: 2000,
  },
  dropdownItem: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  dropdownItemText: {
    fontSize: 14,
    color: '#111827',
  },
  textArea: {
    height: 100,
  },
  buttonRow: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    marginTop: 20,
    gap: 12,
  },
  submitButton: {
    backgroundColor: '#2563EB',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
  },
  submitButtonDisabled: {
    backgroundColor: '#93C5FD',
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  cancelButton: {
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  cancelButtonText: {
    color: '#374151',
    fontSize: 14,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
  },
  modalSubtitle: {
    fontSize: 14,
    color: '#4B5563',
    marginTop: 4,
  },
  successBadge: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#DCFCE7',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 24,
  },
  checkmark: {
    fontSize: 32,
    color: '#16A34A',
    fontWeight: 'bold',
  },
  continueButton: {
    width: '100%',
    backgroundColor: '#2563EB',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  continueButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
});
