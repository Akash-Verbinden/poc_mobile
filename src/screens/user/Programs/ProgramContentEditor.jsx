import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import Ionicons from "@react-native-vector-icons/ionicons";
import RichTextEditor from "../../../components/RichTextEditor";

export default function ProgramContentEditor({
  title,
  setTitle,
  subTitle,
  setSubTitle,
  description,
  setDescription,
  onDraft,
  onCancel,
  isEditing,
  setIsEditing, 
  titleLabel,
  publishProgram,
  isNew,
}) {
  const [errors, setErrors] = useState({ title: "", subTitle: "" });

  const validate = () => {
    let isValid = true;
    let newErrors = { title: "", subTitle: "" };

    if (!title.trim()) {
      newErrors.title = `${titleLabel} is required`;
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handlePublish = () => {
    if (!validate()) return;
    publishProgram();
  };

  const handleDraft = () => {
    if (!validate()) return;
    onDraft();
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        {/* Top Header Actions Bar */}
        <View style={styles.topBar}>
          {/* Edit Button visible when NOT currently editing */}
          {!isEditing ? (
            <TouchableOpacity
              onPress={() => setIsEditing(true)}
              style={styles.editBtn}
            >
              <Ionicons name="pencil" size={16} color="#2563eb" />
              <Text style={styles.editText}>Edit</Text>
            </TouchableOpacity>
          ) : (
            <View />
          )}

          {/* Publish Button */}
          <TouchableOpacity
            onPress={handlePublish}
            disabled={isNew}
            style={[styles.publishBtn, isNew && styles.disabledBtn]}
          >
            <Text style={styles.publishText}>Publish →</Text>
          </TouchableOpacity>
        </View>

        {/* Inputs */}
        <View style={styles.fieldGroup}>
          <Text style={styles.label}>{titleLabel} *</Text>
          <TextInput
            value={title}
            editable={isEditing}
            onChangeText={(v) => {
              setTitle(v);
              setErrors((p) => ({ ...p, title: "" }));
            }}
            placeholder={titleLabel}
            placeholderTextColor="#9ca3af"
            style={[
              styles.input,
              !isEditing && styles.disabledInput,
              errors.title ? styles.inputError : null,
            ]}
          />
          {errors.title ? (
            <Text style={styles.errorText}>{errors.title}</Text>
          ) : null}
        </View>

        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Sub Title</Text>
          <TextInput
            value={subTitle}
            editable={isEditing}
            onChangeText={(v) => {
              setSubTitle(v);
              setErrors((p) => ({ ...p, subTitle: "" }));
            }}
            placeholder="sub title"
            placeholderTextColor="#9ca3af"
            style={[styles.input, !isEditing && styles.disabledInput]}
          />
        </View>

        {/* Editor Area */}
        <View style={styles.fieldGroup}>
          <Text style={styles.infoText}>
            You can add content, tables, images and links in the text editor below.
          </Text>

          <View style={{ marginTop: 8 }}>
            <RichTextEditor
              model={description}
              onChange={setDescription}
              readOnly={!isEditing}
            />
          </View>
        </View>

        {/* Footer Actions (Only visible in edit mode) */}
        {isEditing && (
          <View style={styles.footer}>
            <TouchableOpacity style={styles.draftBtn} onPress={handleDraft}>
              <Text style={styles.draftText}>SAVE AS DRAFT</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.cancelBtn} onPress={onCancel}>
              <Text style={styles.cancelText}>CANCEL</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  content: { padding: 16 },
  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  editBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#eff6ff",
    borderWidth: 1,
    borderColor: "#bfdbfe",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
  },
  editText: { color: "#2563eb", fontWeight: "600", fontSize: 13 },
  publishBtn: {
    backgroundColor: "#2563eb",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  publishText: { color: "#fff", fontWeight: "bold" },
  disabledBtn: { opacity: 0.5 },
  fieldGroup: { marginBottom: 16 },
  label: { fontSize: 13, color: "#4b5563", marginBottom: 6, fontWeight: "500" },
  infoText: { fontSize: 12, color: "#6b7280", fontStyle: "italic" },
  input: {
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    color: "#000",
  },
  disabledInput: { backgroundColor: "#f9fafb", color: "#374151" },
  inputError: { borderColor: "#ef4444" },
  errorText: { color: "#ef4444", fontSize: 12, marginTop: 4 },
  footer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    gap: 12,
    marginTop: 24,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: "#e5e7eb",
  },
  draftBtn: {
    borderWidth: 1,
    borderColor: "#2563eb",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
  },
  draftText: { color: "#2563eb", fontWeight: "bold", fontSize: 13 },
  cancelBtn: { paddingHorizontal: 12, paddingVertical: 12 },
  cancelText: { color: "#000", fontWeight: "600" },
});