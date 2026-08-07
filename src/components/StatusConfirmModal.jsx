// import React from 'react';
// import { View, Text, Modal, TouchableOpacity, StyleSheet } from 'react-native';

// export default function StatusConfirmModal({
//   visible,
//   status,
//   title = 'Update Status',
//   message,
//   onClose,
//   onConfirm,
// }) {
//   return (
//     <Modal
//       visible={visible}
//       transparent={true}
//       animationType="fade"
//       onRequestClose={onClose}
//     >
//       <View style={styles.modalOverlay}>
//         <View style={styles.dialogBox}>
//           <Text style={styles.dialogTitle}>{title}</Text>
//           <Text style={styles.dialogMessage}>
//             {message || (
//               <>
//                 Are you sure you want to change status to{' '}
//                 <Text style={{ fontWeight: '700' }}>{status}</Text>?
//               </>
//             )}
//           </Text>
//           <View style={styles.dialogActions}>
//             <TouchableOpacity style={styles.cancelBtn} onPress={onClose}>
//               <Text style={styles.cancelBtnText}>Cancel</Text>
//             </TouchableOpacity>
//             <TouchableOpacity style={styles.confirmBtn} onPress={onConfirm}>
//               <Text style={styles.confirmBtnText}>Confirm</Text>
//             </TouchableOpacity>
//           </View>
//         </View>
//       </View>
//     </Modal>
//   );
// }

// const styles = StyleSheet.create({
//   modalOverlay: {
//     flex: 1,
//     backgroundColor: 'rgba(0, 0, 0, 0.5)',
//     justifyContent: 'center',
//     alignItems: 'center',
//     zIndex: 9999,
//   },
//   dialogBox: {
//     backgroundColor: '#fff',
//     borderRadius: 12,
//     width: '85%',
//     padding: 20,
//     elevation: 5,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.25,
//     shadowRadius: 4,
//   },
//   dialogTitle: {
//     fontSize: 16,
//     fontWeight: '600',
//     marginBottom: 8,
//     color: '#111827',
//   },
//   dialogMessage: {
//     fontSize: 14,
//     color: '#4b5563',
//     marginBottom: 20,
//   },
//   dialogActions: {
//     flexDirection: 'row',
//     justifyContent: 'flex-end',
//     gap: 10,
//   },
//   cancelBtn: {
//     paddingHorizontal: 14,
//     paddingVertical: 8,
//     backgroundColor: '#e5e7eb',
//     borderRadius: 6,
//   },
//   cancelBtnText: {
//     color: '#374151',
//     fontSize: 13,
//   },
//   confirmBtn: {
//     paddingHorizontal: 14,
//     paddingVertical: 8,
//     backgroundColor: '#2563eb',
//     borderRadius: 6,
//   },
//   confirmBtnText: {
//     color: '#fff',
//     fontSize: 13,
//     fontWeight: '500',
//   },
// });

import React from 'react';
import { View, Text, Modal, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';

export default function StatusConfirmModal({
  visible,
  type = 'confirm', // 'confirm' | 'status' | 'delete'
  title,
  message,
  status,
  loading = false,
  onClose,
  onConfirm,
  confirmText,
  cancelText = 'Cancel',
}) {
  // Determine variant defaults based on modal type
  const isDelete = type === 'delete';
  
  const defaultTitle = isDelete
    ? 'Delete Item'
    : type === 'status'
    ? 'Update Status'
    : 'Confirm Action';

  const defaultConfirmText = confirmText || (isDelete ? 'Delete' : 'Confirm');
  const confirmBtnStyle = isDelete ? styles.deleteBtn : styles.confirmBtn;

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.dialogBox}>
          <Text style={styles.dialogTitle}>{title || defaultTitle}</Text>

          <Text style={styles.dialogMessage}>
            {message ? (
              message
            ) : type === 'status' ? (
              <>
                Are you sure you want to change status to{' '}
                <Text style={styles.boldText}>{status}</Text>?
              </>
            ) : isDelete ? (
              'Are you sure you want to delete this item?'
            ) : (
              'Are you sure you want to proceed?'
            )}
          </Text>

          <View style={styles.dialogActions}>
            <TouchableOpacity
              style={styles.cancelBtn}
              onPress={onClose}
              disabled={loading}
            >
              <Text style={styles.cancelBtnText}>{cancelText}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.baseBtn, confirmBtnStyle]}
              onPress={onConfirm}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Text style={styles.confirmBtnText}>{defaultConfirmText}</Text>
              )}
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
    maxWidth: 380,
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
  boldText: {
    fontWeight: '700',
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
  baseBtn: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 6,
    minWidth: 80,
    alignItems: 'center',
  },
  confirmBtn: {
    backgroundColor: '#2563eb',
  },
  deleteBtn: {
    backgroundColor: '#dc2626',
  },
  confirmBtnText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '500',
  },
});