import React, { useRef } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import {
  RichEditor,
  RichToolbar,
  actions,
} from 'react-native-pell-rich-editor';
import Toast from 'react-native-toast-message';
// import api from '@/src/lib/axios'; // adjust path to your axios instance

export default function RichTextEditor({
  model = '',
  onChange,
  readOnly = false,
  maxLength = 200000,
}) {
  const richTextRef = useRef(null);
  const [uploading, setUploading] = React.useState(false);

  /* ---------------- Plain Text Character Limiter ---------------- */
  const handleChange = htmlValue => {
    if (readOnly) return;

    // Strip HTML tags to calculate plain text character length
    const plainText = htmlValue.replace(/<[^>]*>?/gm, '');
    if (plainText.length > maxLength) {
      Toast.show({
        type: 'error',
        text1: 'Character Limit Exceeded',
        text2: `Maximum allowed limit is ${maxLength} characters.`,
      });
      return;
    }

    onChange?.(htmlValue);
  };

  /* ---------------- Custom Image Upload Handler ---------------- */
  const handleImageUpload = async () => {
    // Note: Use react-native-image-picker or similar to pick images from device if needed
    Alert.alert(
      'Upload Image',
      'Image selection requires launchImageLibrary integration.',
      [{ text: 'OK' }],
    );
  };

  /* ---------------- Inject Custom CSS for Web Consistency ---------------- */
  const customCSS = `
    body { font-family: -apple-system, Roboto, sans-serif; font-size: 14px; color: #000; padding: 10px; }
    table { border-collapse: collapse; width: 100%; margin: 8px 0; }
    td, th { border: 1px solid #dddddd; padding: 8px; text-align: left; }
    th { background-color: #f2f2f2; }
    img { max-width: 100%; height: auto; border-radius: 4px; }
    blockquote { border-left: 4px solid #2563eb; padding-left: 10px; color: #4b5563; font-style: italic; }
  `;

  return (
    <View style={[styles.container, readOnly && styles.readOnlyContainer]}>
      {/* Editor Toolbar */}
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
            actions.insertImage,
            actions.checkboxList,
            actions.undo,
            actions.redo,
          ]}
          onPressAddImage={handleImageUpload}
          iconTint="#374151"
          selectedIconTint="#2563eb"
          style={styles.toolbar}
        />
      )}

      {/* Editor Surface */}
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

        {uploading && (
          <View style={styles.loaderOverlay}>
            <ActivityIndicator size="small" color="#2563eb" />
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 8,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#d1d5db',
    overflow: 'hidden',
  },
  readOnlyContainer: {
    opacity: 0.8,
    backgroundColor: '#f9fafb',
  },
  toolbar: {
    backgroundColor: '#f3f4f6',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  editorWrapper: {
    position: 'relative',
    minHeight: 250,
  },
  loaderOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255,255,255,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
