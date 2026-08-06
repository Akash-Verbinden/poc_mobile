import React from 'react';
import { View, Text, Modal, TouchableOpacity, StyleSheet } from 'react-native';

export default function StatusConfirmModal({
  visible,
  status,
  title = 'Update Status',
  message,
  onClose,
  onConfirm,
}) {
  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.dialogBox}>
          <Text style={styles.dialogTitle}>{title}</Text>
          <Text style={styles.dialogMessage}>
            {message || (
              <>
                Are you sure you want to change status to{' '}
                <Text style={{ fontWeight: '700' }}>{status}</Text>?
              </>
            )}
          </Text>
          <View style={styles.dialogActions}>
            <TouchableOpacity style={styles.cancelBtn} onPress={onClose}>
              <Text style={styles.cancelBtnText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.confirmBtn} onPress={onConfirm}>
              <Text style={styles.confirmBtnText}>Confirm</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 9999,
  },
  dialogBox: {
    backgroundColor: '#fff',
    borderRadius: 12,
    width: '85%',
    padding: 20,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  dialogTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#111827',
  },
  dialogMessage: {
    fontSize: 14,
    color: '#4b5563',
    marginBottom: 20,
  },
  dialogActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
  },
  cancelBtn: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    backgroundColor: '#e5e7eb',
    borderRadius: 6,
  },
  cancelBtnText: {
    color: '#374151',
    fontSize: 13,
  },
  confirmBtn: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    backgroundColor: '#2563eb',
    borderRadius: 6,
  },
  confirmBtnText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '500',
  },
});