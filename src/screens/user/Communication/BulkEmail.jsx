import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  StyleSheet,
  Pressable,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Ionicons from '@react-native-vector-icons/ionicons';
import Toast from 'react-native-toast-message';
import RichTextEditor from '../../../components/RichTextEditor';
import {
  getEmailTemplates,
  getUniversityUsers,
  bulkShareEmail,
  getEmailTemplate,
} from '../../../services/allServices';
import Loader from '../../../components/Loader';
import BackButton from '../../../components/Buttons/BackButton';

const audienceOptions = ['student', 'university', 'faculty'];

export default function BulkEmailPage() {
  const navigation = useNavigation();

  // Dropdown visibility states
  const [openAudienceType, setOpenAudienceType] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [openTemplate, setOpenTemplate] = useState(false);

  // Form & Data states
  const [templates, setTemplates] = useState([]);
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [audienceType, setAudienceType] = useState('student');
  const [templateSearch, setTemplateSearch] = useState('');

  const [selectedUsers, setSelectedUsers] = useState([]);
  const [selectedTemplateId, setSelectedTemplateId] = useState('');

  const [templateName, setTemplateName] = useState('');
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');

  const [search, setSearch] = useState('');

  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);

  const closeAllDropdowns = () => {
    setOpenAudienceType(false);
    setShowDropdown(false);
    setOpenTemplate(false);
  };

  const isFormChanged =
    selectedUsers.length > 0 ||
    selectedTemplateId !== '' ||
    subject.trim() !== '' ||
    body.trim() !== '';

  /* ---------------- Fetch Templates & Audience ---------------- */
  useEffect(() => {
    const load = async () => {
      setPageLoading(true);

      try {
        const t = await getEmailTemplates();
        setTemplates(t?.data?.results || []);
      } catch (err) {
        console.error('Templates fetch error:', err);
      }

      try {
        const u = await getUniversityUsers({ audience_type: audienceType });
        if (!u?.data?.length) {
          const dummy = Array.from({ length: 200 }).map((_, i) => ({
            id: String(i),
            email: `demo${i}@gmail.com`,
          }));
          setUsers(dummy);
          setFilteredUsers(dummy);
        } else {
          setUsers(u.data);
          setFilteredUsers(u.data);
        }
      } catch (err) {
        console.error('Users fetch error:', err);
      } finally {
        setPageLoading(false);
      }
    };

    load();
  }, [audienceType]);

  /* ---------------- Search Filtering ---------------- */
  useEffect(() => {
    const f = users.filter(u =>
      u.email.toLowerCase().includes(search.toLowerCase()),
    );
    setFilteredUsers(f);
  }, [search, users]);

  /* ---------------- Template Selection ---------------- */
  const handleTemplateChange = async id => {
    setSelectedTemplateId(id);

    try {
      const res = await getEmailTemplate(id);
      const data = res?.data?.data || res?.data || res;
      if (res?.success || data) {
        setTemplateName(data.template_name || '');
        setSubject(data.template_subject || '');
        setBody(data.template_body || '');
      }
    } catch {
      Toast.show({
        type: 'error',
        text1: 'Failed to load template',
      });
    }
  };

  /* ---------------- Audience Selection Handlers ---------------- */
  const toggleUser = email => {
    if (selectedUsers.includes(email)) {
      setSelectedUsers(selectedUsers.filter(e => e !== email));
    } else {
      setSelectedUsers([...selectedUsers, email]);
    }
  };

  const selectAll = () => {
    setSelectedUsers(filteredUsers.map(u => u.email));
  };

  const unselectAll = () => setSelectedUsers([]);

  /* ---------------- Submit Handler ---------------- */
  const handleSend = async () => {
    if (!selectedUsers.length) {
      return Toast.show({ type: 'error', text1: 'Select Audience' });
    }
    if (!selectedTemplateId) {
      return Toast.show({ type: 'error', text1: 'Select Template' });
    }
    if (!subject.trim()) {
      return Toast.show({ type: 'error', text1: 'Subject required' });
    }
    if (!body.trim()) {
      return Toast.show({ type: 'error', text1: 'Email Body required' });
    }

    try {
      setLoading(true);

      await bulkShareEmail({
        audience_type: audienceType,
        recipient_list: selectedUsers,
        template_id: selectedTemplateId,
        template_name: templateName,
        template_subject: subject,
        template_body: body,
      });

      Toast.show({
        type: 'success',
        text1: 'Bulk Email Sent',
      });

      setTimeout(() => {
        navigation.goBack();
      }, 700);
    } catch (e) {
      Toast.show({
        type: 'error',
        text1: e?.response?.data?.message || 'Failed',
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
        <Loader visible={pageLoading} />
      {/* Tap anywhere outside to close dropdowns */}
      <Pressable onPress={closeAllDropdowns} style={styles.pressableContainer}>
        {/* Top Header */}
        <View style={styles.headerRow}>
          <BackButton title="Back to Template List" />

          <Text style={styles.headerTitle}>Bulk Email Communication</Text>
        </View>

        {/* Description Text */}
        <Text style={styles.descriptionText}>
          To send emails, select the audience, the email template that you
          created. It will auto populate the subject and the body of the email.
          Make any changes to the content and click on{' '}
          <Text style={styles.highlightText}>“Send”.</Text>
        </Text>

        {/* Form Card */}
        <View style={styles.card}>
          {/* 1. Audience Type Dropdown */}
          <View
            style={[
              styles.fieldContainer,
              { zIndex: openAudienceType ? 30 : 3 },
            ]}
          >
            <Text style={styles.label}>
              Audience Type <Text style={styles.required}>*</Text>
            </Text>

            <TouchableOpacity
              onPress={() => {
                setOpenAudienceType(!openAudienceType);
                setShowDropdown(false);
                setOpenTemplate(false);
              }}
              style={styles.dropdownTrigger}
              activeOpacity={0.8}
            >
              <Text style={styles.dropdownTextCapitalize}>{audienceType}</Text>
              <Ionicons
                name={openAudienceType ? 'chevron-up' : 'chevron-down'}
                size={18}
                color="#6b7280"
              />
            </TouchableOpacity>

            {openAudienceType && (
              <View style={styles.dropdownMenu}>
                {audienceOptions.map(item => (
                  <TouchableOpacity
                    key={item}
                    onPress={() => {
                      setAudienceType(item);
                      setOpenAudienceType(false);
                      setSelectedUsers([]);
                    }}
                    style={[
                      styles.dropdownItem,
                      audienceType === item && styles.activeDropdownItem,
                    ]}
                  >
                    <Text style={styles.dropdownItemText}>{item}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>

          {/* 2. Audience List Multi-select (Separate Line) */}
          <View
            style={[styles.fieldContainer, { zIndex: showDropdown ? 25 : 2 }]}
          >
            <Text style={styles.label}>
              Audience List <Text style={styles.required}>*</Text>
            </Text>

            <TouchableOpacity
              onPress={() => {
                setShowDropdown(!showDropdown);
                setOpenAudienceType(false);
                setOpenTemplate(false);
              }}
              style={styles.dropdownTriggerMulti}
              activeOpacity={0.8}
            >
              <View style={styles.tagsWrapper}>
                {selectedUsers.length === 0 ? (
                  <Text style={styles.placeholderText}>Choose Audience</Text>
                ) : (
                  <View style={styles.tagsContainer}>
                    {selectedUsers.map(email => (
                      <View key={email} style={styles.tag}>
                        <Text style={styles.tagText} numberOfLines={1}>
                          {email}
                        </Text>
                        <TouchableOpacity onPress={() => toggleUser(email)}>
                          <Ionicons name="close" size={14} color="#000" />
                        </TouchableOpacity>
                      </View>
                    ))}
                  </View>
                )}
              </View>

              <View style={styles.iconFixedContainer}>
                <Ionicons
                  name={showDropdown ? 'chevron-up' : 'chevron-down'}
                  size={18}
                  color="#6b7280"
                />
              </View>
            </TouchableOpacity>

            {showDropdown && (
              <View style={styles.dropdownMenuLarge}>
                <View style={styles.searchWrapper}>
                  <TextInput
                    placeholder="Search sender email..."
                    placeholderTextColor="#9ca3af"
                    value={search}
                    onChangeText={setSearch}
                    style={styles.modalSearchInput}
                  />
                </View>

                <View style={styles.multiSelectActions}>
                  <TouchableOpacity onPress={selectAll}>
                    <Text style={styles.selectAllText}>Select All</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={unselectAll}>
                    <Text style={styles.unselectAllText}>Unselect All</Text>
                  </TouchableOpacity>
                </View>

                <ScrollView
                  style={{ maxHeight: 180 }}
                  nestedScrollEnabled
                  keyboardShouldPersistTaps="handled"
                >
                  {filteredUsers.map(u => {
                    const isSelected = selectedUsers.includes(u.email);
                    return (
                      <TouchableOpacity
                        key={u.id}
                        onPress={() => toggleUser(u.email)}
                        style={styles.checkboxRow}
                      >
                        <Ionicons
                          name={isSelected ? 'checkbox' : 'square-outline'}
                          size={16}
                          color={isSelected ? '#2563eb' : '#9ca3af'}
                        />
                        <Text style={styles.checkboxLabel}>{u.email}</Text>
                      </TouchableOpacity>
                    );
                  })}
                </ScrollView>
              </View>
            )}
          </View>

          {/* 3. Email Template Dropdown (Separate Line) */}
          <View
            style={[styles.fieldContainer, { zIndex: openTemplate ? 20 : 1 }]}
          >
            <Text style={styles.label}>
              Email Template <Text style={styles.required}>*</Text>
            </Text>

            <TouchableOpacity
              onPress={() => {
                setOpenTemplate(!openTemplate);
                setOpenAudienceType(false);
                setShowDropdown(false);
              }}
              style={styles.dropdownTrigger}
              activeOpacity={0.8}
            >
              <Text
                style={[
                  styles.templateTextWrapper,
                  selectedTemplateId
                    ? styles.valueText
                    : styles.placeholderText,
                ]}
                numberOfLines={1}
              >
                {selectedTemplateId
                  ? templates.find(t => t.id === selectedTemplateId)
                      ?.template_name
                  : 'Choose Template'}
              </Text>

              <View style={styles.iconFixedContainer}>
                <Ionicons
                  name={openTemplate ? 'chevron-up' : 'chevron-down'}
                  size={18}
                  color="#6b7280"
                />
              </View>
            </TouchableOpacity>

            {openTemplate && (
              <View style={styles.dropdownMenuLarge}>
                <View style={styles.searchWrapper}>
                  <TextInput
                    value={templateSearch}
                    onChangeText={setTemplateSearch}
                    placeholder="Search template..."
                    placeholderTextColor="#9ca3af"
                    style={styles.modalSearchInput}
                  />
                </View>

                <ScrollView
                  style={{ maxHeight: 180 }}
                  nestedScrollEnabled
                  keyboardShouldPersistTaps="handled"
                >
                  {templates
                    .filter(t =>
                      t.template_name
                        .toLowerCase()
                        .includes(templateSearch.toLowerCase()),
                    )
                    .map(t => (
                      <TouchableOpacity
                        key={t.id}
                        onPress={() => {
                          handleTemplateChange(t.id);
                          setOpenTemplate(false);
                        }}
                        style={[
                          styles.dropdownItem,
                          selectedTemplateId === t.id &&
                            styles.activeDropdownItem,
                        ]}
                      >
                        <Text style={styles.dropdownItemText}>
                          {t.template_name}
                        </Text>
                      </TouchableOpacity>
                    ))}
                </ScrollView>
              </View>
            )}
          </View>

          {/* Subject Input */}
          <View style={[styles.fieldContainer, { zIndex: 1 }]}>
            <Text style={styles.label}>
              Subject <Text style={styles.required}>*</Text>
            </Text>
            <TextInput
              value={subject}
              placeholder="Subject"
              placeholderTextColor="#9ca3af"
              onChangeText={setSubject}
              style={styles.input}
            />
          </View>

          {/* Email Body Rich Text Editor */}
          <View style={[styles.fieldContainer, { zIndex: 1 }]}>
            <Text style={styles.label}>
              Email Body <Text style={styles.required}>*</Text>
            </Text>
            <View style={styles.editorContainer}>
              <RichTextEditor model={body} onChange={val => setBody(val)} />
            </View>
          </View>

          {/* Action Buttons */}
          <View style={styles.footerActions}>
            <TouchableOpacity
              onPress={handleSend}
              disabled={loading || !isFormChanged}
              style={[
                styles.sendBtn,
                (loading || !isFormChanged) && styles.sendBtnDisabled,
              ]}
            >
              {loading ? (
                <ActivityIndicator size="small" color="#ffffff" />
              ) : (
                <Text style={styles.sendBtnText}>SEND →</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Text style={styles.cancelText}>CANCEL</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Pressable>
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
  },
  pressableContainer: {
    gap: 12,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 4,
    gap: 16,
  },
  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 4,
    flexShrink: 1,
  },
  backText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#000000',
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
    position: 'relative',
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

  dropdownTrigger: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    paddingLeft: 12,
    paddingRight: 8,
    height: 44,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#ffffff',
  },
  dropdownTriggerMulti: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    paddingLeft: 10,
    paddingRight: 8,
    paddingVertical: 6,
    minHeight: 44,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#ffffff',
  },
  tagsWrapper: {
    flex: 1,
    paddingRight: 6,
  },
  templateTextWrapper: {
    flex: 1,
    paddingRight: 6,
  },
  iconFixedContainer: {
    width: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dropdownTextCapitalize: {
    fontSize: 14,
    color: '#000000',
    textTransform: 'capitalize',
  },
  placeholderText: {
    fontSize: 14,
    color: '#6b7280',
  },
  valueText: {
    fontSize: 14,
    color: '#000000',
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  tag: {
    backgroundColor: '#f3f4f6',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    maxWidth: 180,
  },
  tagText: {
    fontSize: 12,
    color: '#000000',
  },
  dropdownMenu: {
    position: 'absolute',
    top: 70,
    left: 0,
    right: 0,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    zIndex: 9999,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
  },
  dropdownMenuLarge: {
    position: 'absolute',
    top: 70,
    left: 0,
    right: 0,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    zIndex: 9999,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    paddingBottom: 8,
  },
  dropdownItem: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: '#ffffff',
  },
  activeDropdownItem: {
    backgroundColor: '#f3f4f6',
  },
  dropdownItemText: {
    fontSize: 13,
    color: '#000000',
  },
  searchWrapper: {
    padding: 8,
    backgroundColor: '#ffffff',
  },
  modalSearchInput: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 6,
    fontSize: 13,
    color: '#000000',
    backgroundColor: '#ffffff',
  },
  multiSelectActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingBottom: 8,
    backgroundColor: '#ffffff',
  },
  selectAllText: {
    fontSize: 12,
    color: '#2563eb',
    fontWeight: '500',
  },
  unselectAllText: {
    fontSize: 12,
    color: '#ef4444',
    fontWeight: '500',
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#ffffff',
  },
  checkboxLabel: {
    fontSize: 13,
    color: '#000000',
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
  sendBtn: {
    backgroundColor: '#2563eb',
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 8,
  },
  sendBtnDisabled: {
    backgroundColor: '#93c5fd',
  },
  sendBtnText: {
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
