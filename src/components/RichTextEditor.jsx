import React, { useRef, useEffect } from "react";
import { View, StyleSheet, ActivityIndicator } from "react-native";
import { RichEditor, RichToolbar, actions } from "react-native-pell-rich-editor";
import Toast from "react-native-toast-message";

export default function RichTextEditor({
  model = "",
  onChange,
  readOnly = false,
  maxLength = 200000,
}) {
  const richTextRef = useRef(null);

  useEffect(() => {
    if (richTextRef.current) {
      richTextRef.current.setContentHTML(model || "");
    }
  }, [model]);

  const handleChange = (htmlValue) => {
    if (readOnly) return;
    const plainText = htmlValue.replace(/<[^>]*>?/gm, "");
    if (plainText.length > maxLength) {
      Toast.show({
        type: "error",
        text1: "Character Limit Exceeded",
        text2: `Maximum allowed limit is ${maxLength} characters.`,
      });
      return;
    }
    onChange?.(htmlValue);
  };

  const customCSS = `
    body { font-family: -apple-system, Roboto, sans-serif; font-size: 14px; color: #000; padding: 10px; }
    table { border-collapse: collapse; width: 100%; margin: 8px 0; }
    td, th { border: 1px solid #dddddd; padding: 8px; text-align: left; }
    th { background-color: #f2f2f2; }
    img { max-width: 100%; height: auto; border-radius: 4px; }
  `;

  return (
    <View style={[styles.container, readOnly && styles.readOnlyContainer]}>
      {!readOnly && (
        <RichToolbar
          editor={richTextRef}
          actions={[
            actions.setBold,
            actions.setItalic,
            actions.setUnderline,
            actions.setStrikethrough,
            actions.alignLeft,
            actions.alignCenter,
            actions.alignRight,
            actions.insertBulletsList,
            actions.insertOrderedList,
            actions.insertLink,
            actions.undo,
            actions.redo,
          ]}
          iconTint="#374151"
          selectedIconTint="#2563eb"
          style={styles.toolbar}
        />
      )}

      <View style={styles.editorWrapper}>
        <RichEditor
          ref={richTextRef}
          initialContentHTML={model}
          onChange={handleChange}
          placeholder="Write content here..."
          disabled={readOnly}
          customCSS={customCSS}
          initialHeight={250}
          style={{ minHeight: 250 }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { borderRadius: 8, backgroundColor: "#fff", borderWidth: 1, borderColor: "#d1d5db", overflow: "hidden" },
  readOnlyContainer: { opacity: 0.85, backgroundColor: "#f9fafb" },
  toolbar: { backgroundColor: "#f3f4f6", borderBottomWidth: 1, borderBottomColor: "#e5e7eb" },
  editorWrapper: { position: "relative", minHeight: 250 },
});