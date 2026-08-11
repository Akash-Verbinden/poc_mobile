import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  Modal,
  Image,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import PhoneInput from 'react-native-phone-number-input';
import Ionicons from '@react-native-vector-icons/ionicons';
import { useNavigation } from '@react-navigation/native';

// Import your custom components
import BackButton from '../../../components/Buttons/BackButton';
import DescriptionText from '../../../components/DescriptionText';
import { createUniversity } from '../../../services/allServices';

/* ---------------- Form Schema ---------------- */
const schema = z.object({
  name: z.string().min(2, 'University name is required'),
  code: z.string().min(1, 'University code is required'),
  admin_firstname: z.string().min(2, 'First name is required'),
  admin_lastname: z.string().min(1, 'Last name is required'),
  contact: z
    .string()
    .min(10, 'Phone number must be at least 10 digits')
    .max(15, 'Phone number too long')
    .regex(/^[0-9]+$/, 'Only numbers allowed'),
  email: z.string().email('Enter valid email address'),
  description: z.string().optional(),
});

export default function CreateUniversity() {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [savedData, setSavedData] = useState(null);

  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm({
    resolver: zodResolver(schema),
    mode: 'onChange',
  });

  const onSubmit = async data => {
    setLoading(true);

    try {
     const response = await createUniversity({
        ...data,
        logo: "",
      });

      if(response?.success){
        setSavedData(data);
        setShowSuccess(true);
        setLoading(false);
        return;
      }
    } catch (error) {
      setLoading(false);
      console.error(error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={styles.headerRow}>
            <BackButton title="Back to Universities List" />
          </View>

          <Text style={styles.screenTitle}>Create University</Text>

          {/* Custom Description Text */}
          <DescriptionText
            text="Fill the fields of the below and click on “Save” to create a new university. This will trigger an automated email to the contact person which will allow them to create their university admin account. Once they create their account, the university list will be updated."
            highlights={['“Save”']}
            marginBottom={20}
          />

          {/* Form Card */}
          <View style={styles.card}>
            {/* Admin First Name */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>
                Admin First Name <Text style={styles.asterisk}>*</Text>
              </Text>
              <Controller
                control={control}
                name="admin_firstname"
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    style={[
                      styles.input,
                      errors.admin_firstname && styles.inputError,
                    ]}
                    placeholder="Enter First Name"
                    placeholderTextColor="#9CA3AF"
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                  />
                )}
              />
              {errors.admin_firstname && (
                <Text style={styles.errorText}>
                  {errors.admin_firstname.message}
                </Text>
              )}
            </View>

            {/* Admin Last Name */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>
                Admin Last Name <Text style={styles.asterisk}>*</Text>
              </Text>
              <Controller
                control={control}
                name="admin_lastname"
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    style={[
                      styles.input,
                      errors.admin_lastname && styles.inputError,
                    ]}
                    placeholder="Enter Last Name"
                    placeholderTextColor="#9CA3AF"
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                  />
                )}
              />
              {errors.admin_lastname && (
                <Text style={styles.errorText}>
                  {errors.admin_lastname.message}
                </Text>
              )}
            </View>

            {/* Admin Email */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>
                Admin Email Address <Text style={styles.asterisk}>*</Text>
              </Text>
              <Controller
                control={control}
                name="email"
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    style={[styles.input, errors.email && styles.inputError]}
                    placeholder="Enter Email Address"
                    placeholderTextColor="#9CA3AF"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                  />
                )}
              />
              {errors.email && (
                <Text style={styles.errorText}>{errors.email.message}</Text>
              )}
            </View>

            {/* Contact Number */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>
                Contact Number <Text style={styles.asterisk}>*</Text>
              </Text>
              <Controller
                control={control}
                name="contact"
                render={({ field: { onChange, value } }) => (
                  <PhoneInput
                    defaultValue={value}
                    defaultCode="IN"
                    layout="first"
                    onChangeFormattedText={text => {
                      // Strip "+" for digits-only schema match
                      const cleanedNumber = text.replace('+', '');
                      onChange(cleanedNumber);
                    }}
                    containerStyle={[
                      styles.phoneContainer,
                      errors.contact && styles.inputError,
                    ]}
                    textContainerStyle={styles.phoneTextContainer}
                    textInputStyle={styles.phoneTextInput}
                  />
                )}
              />
              {errors.contact && (
                <Text style={styles.errorText}>{errors.contact.message}</Text>
              )}
            </View>

            {/* University Name */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>
                University Name <Text style={styles.asterisk}>*</Text>
              </Text>
              <Controller
                control={control}
                name="name"
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    style={[styles.input, errors.name && styles.inputError]}
                    placeholder="Enter University Name"
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

            {/* University Code */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>
                University Code <Text style={styles.asterisk}>*</Text>
              </Text>
              <Controller
                control={control}
                name="code"
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    style={[styles.input, errors.code && styles.inputError]}
                    placeholder="Enter University Code"
                    placeholderTextColor="#9CA3AF"
                    autoCapitalize="characters"
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                  />
                )}
              />
              {errors.code && (
                <Text style={styles.errorText}>{errors.code.message}</Text>
              )}
            </View>

            {/* Description */}
            <View style={styles.inputContainer}>
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

            {/* Buttons */}
            <View style={styles.buttonRow}>
              <TouchableOpacity
                onPress={handleSubmit(onSubmit)}
                disabled={!isValid || loading}
                style={[
                  styles.saveBtn,
                  (!isValid || loading) && styles.saveBtnDisabled,
                ]}
                activeOpacity={0.8}
              >
                {loading ? (
                  <ActivityIndicator color="#FFFFFF" size="small" />
                ) : (
                  <Text style={styles.saveBtnText}>SAVE →</Text>
                )}
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => navigation.goBack()}
                style={styles.cancelBtn}
                activeOpacity={0.7}
              >
                <Text style={styles.cancelBtnText}>CANCEL</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Success Modal */}
      <Modal
        visible={showSuccess}
        transparent
        animationType="fade"
        onRequestClose={() => setShowSuccess(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>
              {savedData?.name} ({savedData?.code})
            </Text>
            <Text style={styles.modalSubTitle}>Added Successfully</Text>

            <View style={styles.iconCircle}>
              <Ionicons name="checkmark-sharp" size={40} color="#16A34A" />
            </View>

            <TouchableOpacity
              style={styles.continueBtn}
              onPress={() => {
                setShowSuccess(false);
                navigation.navigate('universities');
              }}
              activeOpacity={0.8}
            >
              <Text style={styles.continueBtnText}>CONTINUE →</Text>
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
    backgroundColor: '#F8FAFC',
  },
  scrollContent: {
    padding: 16,
  },
  headerRow: {
    marginBottom: 8,
  },
  screenTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#000000',
    marginBottom: 12,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#000000',
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
    color: '#000000',
    backgroundColor: '#FFFFFF',
  },
  inputError: {
    borderColor: '#EF4444',
  },
  textArea: {
    height: 100,
  },
  errorText: {
    color: '#EF4444',
    fontSize: 12,
    marginTop: 4,
  },
  phoneContainer: {
    width: '100%',
    height: 48,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    backgroundColor: '#FFFFFF',
    overflow: 'hidden',
  },
  phoneTextContainer: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 0,
    paddingHorizontal: 0,
  },
  phoneTextInput: {
    fontSize: 14,
    color: '#000000',
    height: 48,
  },
  buttonRow: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'flex-start',
    gap: 16,
    marginTop: 12,
  },
  saveBtn: {
    backgroundColor: '#2563EB',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveBtnDisabled: {
    backgroundColor: '#93C5FD',
  },
  saveBtnText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 14,
  },
  cancelBtn: {
    paddingVertical: 12,
    paddingHorizontal: 12,
  },
  cancelBtnText: {
    color: '#000000',
    fontWeight: '600',
    fontSize: 14,
  },
  /* Modal Styles */
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalCard: {
    width: '100%',
    maxWidth: 340,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#000000',
    textAlign: 'center',
  },
  modalSubTitle: {
    fontSize: 14,
    color: '#000000',
    marginTop: 4,
  },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#DCFCE7',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 24,
  },
  continueBtn: {
    width: '100%',
    backgroundColor: '#2563EB',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  continueBtnText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 14,
  },
});
