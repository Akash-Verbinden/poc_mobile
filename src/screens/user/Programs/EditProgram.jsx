// import React, { useEffect, useState } from "react";
// import {
//   View,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   ScrollView,
//   Modal,
//   Image,
//   ActivityIndicator,
//   StyleSheet,
//   Alert,
// } from "react-native";
// import Ionicons from "@react-native-vector-icons/ionicons";

// import {
//   getProgramDetails,
//   updateProgram,
// } from "../../../services/allServices";

// export default function EditProgram({ route, navigation }) {
//   const programId = route?.params?.id;

//   const [formData, setFormData] = useState({
//     name: "",
//     program_level: "",
//     description: "",
//   });

//   const [errors, setErrors] = useState({});
//   const [initialData, setInitialData] = useState(null);
//   const [editMode, setEditMode] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [fetching, setFetching] = useState(true);

//   // Modals
//   const [openProgramLevel, setOpenProgramLevel] = useState(false);
//   const [showSuccess, setShowSuccess] = useState(false);

//   /* ---------------- Fetch Program Data ---------------- */
//   useEffect(() => {
//     if (!programId) return;

//     const loadProgram = async () => {
//       setFetching(true);
//       try {
//         const res = await getProgramDetails(programId);
//         const data = res?.data;

//         const loadedValues = {
//           name: data?.name || "",
//           program_level: data?.program_level || "",
//           description: data?.description || "",
//         };

//         setFormData(loadedValues);
//         setInitialData(loadedValues);
//       } catch (err) {
//         Alert.alert("Error", "Failed to load program");
//       } finally {
//         setFetching(false);
//       }
//     };

//     loadProgram();
//   }, [programId]);

//   /* ---------------- Validation ---------------- */
//   const validate = () => {
//     const newErrors = {};
//     if (!formData.name.trim()) {
//       newErrors.name = "Program name is required";
//     } else if (formData.name.trim().length < 2) {
//       newErrors.name = "Program name must be at least 2 characters";
//     }

//     if (!formData.program_level) {
//       newErrors.program_level = "Program level is required";
//     }

//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   /* ---------------- Dirty Form Check ---------------- */
//   const isDirty =
//     initialData &&
//     (formData.name !== initialData.name ||
//       formData.program_level !== initialData.program_level ||
//       formData.description !== initialData.description);

//   /* ---------------- Submit Handler ---------------- */
//   const handleSubmit = async () => {
//     if (!validate()) return;

//     setLoading(true);
//     try {
//       const res = await updateProgram(programId, {
//         ...formData,
//         status: "draft",
//       });

//       if (res?.success) {
//         setShowSuccess(true);
//         setEditMode(false);
//       } else {
//         Alert.alert("Update Failed", res?.message || "Failed to update program");
//       }
//     } catch (err) {
//       Alert.alert(
//         "Server Error",
//         err?.response?.data?.message || "Something went wrong"
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (fetching) {
//     return (
//       <View style={styles.loaderContainer}>
//         <ActivityIndicator size="large" color="#2563eb" />
//       </View>
//     );
//   }

//   return (
//     <View style={styles.screen}>
//       <ScrollView contentContainerStyle={styles.scrollContent}>
//         {/* Header Bar */}
//         <View style={styles.headerBar}>
//           <TouchableOpacity
//             onPress={() => navigation.goBack()}
//             style={styles.backBtn}
//           >
//             <Ionicons name="arrow-back" size={20} color="#000" />
//           </TouchableOpacity>

//           <Text style={styles.headerTitle}>Edit Program</Text>

//           {!editMode ? (
//             <TouchableOpacity
//               onPress={() => setEditMode(true)}
//               style={styles.editBtn}
//             >
//               <Text style={styles.editBtnText}>EDIT</Text>
//               <Ionicons name="pencil-sharp" size={14} color="#fff" />
//             </TouchableOpacity>
//           ) : (
//             <View style={{ width: 60 }} />
//           )}
//         </View>

//         {/* Card Form Wrapper */}
//         <View style={styles.card}>
//           {/* Program Name Input */}
//           <View style={styles.inputGroup}>
//             <Text style={styles.label}>
//               Program Name<Text style={styles.required}> *</Text>
//             </Text>
//             <TextInput
//               placeholder="Enter Program Name"
//               placeholderTextColor="#9ca3af"
//               value={formData.name}
//               editable={editMode}
//               onChangeText={(text) => {
//                 setFormData((prev) => ({ ...prev, name: text }));
//                 if (errors.name) setErrors((prev) => ({ ...prev, name: null }));
//               }}
//               style={[
//                 styles.input,
//                 !editMode && styles.disabledInput,
//                 errors.name && styles.errorBorder,
//               ]}
//             />
//             {errors.name && (
//               <Text style={styles.errorText}>{errors.name}</Text>
//             )}
//           </View>

//           {/* Program Level Select Field */}
//           <View style={styles.inputGroup}>
//             <Text style={styles.label}>
//               Program Level<Text style={styles.required}> *</Text>
//             </Text>
//             <TouchableOpacity
//               activeOpacity={editMode ? 0.7 : 1}
//               onPress={() => editMode && setOpenProgramLevel(true)}
//               style={[
//                 styles.input,
//                 styles.dropdownTrigger,
//                 !editMode && styles.disabledInput,
//                 errors.program_level && styles.errorBorder,
//               ]}
//             >
//               <Text
//                 style={
//                   formData.program_level
//                     ? styles.inputText
//                     : styles.placeholderText
//                 }
//               >
//                 {formData.program_level || "Choose Program Level"}
//               </Text>
//               <Ionicons
//                 name="chevron-down"
//                 size={16}
//                 color={editMode ? "#374151" : "#9ca3af"}
//               />
//             </TouchableOpacity>
//             {errors.program_level && (
//               <Text style={styles.errorText}>{errors.program_level}</Text>
//             )}
//           </View>

//           {/* Description Textarea */}
//           <View style={styles.inputGroup}>
//             <Text style={styles.label}>Description</Text>
//             <TextInput
//               placeholder="Describe program..."
//               placeholderTextColor="#9ca3af"
//               value={formData.description}
//               editable={editMode}
//               multiline
//               numberOfLines={4}
//               textAlignVertical="top"
//               onChangeText={(text) =>
//                 setFormData((prev) => ({ ...prev, description: text }))
//               }
//               style={[
//                 styles.input,
//                 styles.textArea,
//                 !editMode && styles.disabledInput,
//               ]}
//             />
//           </View>

//           {/* Actions */}
//           <View style={styles.actionRow}>
//             {editMode && (
//               <TouchableOpacity
//                 onPress={handleSubmit}
//                 disabled={!isDirty || loading}
//                 style={[
//                   styles.submitBtn,
//                   (!isDirty || loading) && styles.disabledSubmitBtn,
//                 ]}
//               >
//                 {loading ? (
//                   <ActivityIndicator size="small" color="#ffffff" />
//                 ) : (
//                   <Text style={styles.submitBtnText}>UPDATE →</Text>
//                 )}
//               </TouchableOpacity>
//             )}

//             <TouchableOpacity
//               onPress={() => navigation.goBack()}
//               style={styles.cancelBtn}
//             >
//               <Text style={styles.cancelBtnText}>CANCEL</Text>
//             </TouchableOpacity>
//           </View>
//         </View>
//       </ScrollView>

//       {/* Program Level Option Picker Modal */}
//       <Modal visible={openProgramLevel} transparent animationType="fade">
//         <TouchableOpacity
//           style={styles.modalOverlay}
//           activeOpacity={1}
//           onPress={() => setOpenProgramLevel(false)}
//         >
//           <View style={styles.pickerCard}>
//             <Text style={styles.pickerTitle}>Select Program Level</Text>
//             {[
//               { label: "Undergraduate", value: "Undergraduate" },
//               { label: "Graduate", value: "Graduate" },
//             ].map((item) => (
//               <TouchableOpacity
//                 key={item.value}
//                 style={[
//                   styles.pickerOption,
//                   formData.program_level === item.value &&
//                     styles.activePickerOption,
//                 ]}
//                 onPress={() => {
//                   setFormData((prev) => ({
//                     ...prev,
//                     program_level: item.value,
//                   }));
//                   if (errors.program_level) {
//                     setErrors((prev) => ({ ...prev, program_level: null }));
//                   }
//                   setOpenProgramLevel(false);
//                 }}
//               >
//                 <Text style={styles.pickerOptionText}>{item.label}</Text>
//               </TouchableOpacity>
//             ))}
//           </View>
//         </TouchableOpacity>
//       </Modal>

//       {/* Success Modal */}
//       <Modal visible={showSuccess} transparent animationType="fade">
//         <View style={styles.modalOverlay}>
//           <View style={styles.successDialog}>
//             <Text style={styles.successTitle}>{formData.name}</Text>
//             <Text style={styles.successSubtext}>
//               Program Updated Successfully
//             </Text>

//             <View style={styles.successIconWrapper}>
//               <Ionicons name="checkmark-circle" size={60} color="#22c55e" />
//             </View>

//             <TouchableOpacity
//               onPress={() => {
//                 setShowSuccess(false);
//                 navigation.navigate("Programs");
//               }}
//               style={styles.continueBtn}
//             >
//               <Text style={styles.continueBtnText}>CONTINUE →</Text>
//             </TouchableOpacity>
//           </View>
//         </View>
//       </Modal>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   screen: { flex: 1, backgroundColor: "#f3f4f6" },
//   loaderContainer: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//     backgroundColor: "#f3f4f6",
//   },
//   scrollContent: { padding: 16 },
//   headerBar: {
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "space-between",
//     marginBottom: 20,
//   },
//   backBtn: {
//     padding: 8,
//     borderRadius: 8,
//     backgroundColor: "#ffffff",
//   },
//   headerTitle: { fontSize: 18, fontWeight: "600", color: "#000000" },
//   editBtn: {
//     flexDirection: "row",
//     alignItems: "center",
//     gap: 6,
//     backgroundColor: "#2563eb",
//     paddingHorizontal: 14,
//     paddingVertical: 8,
//     borderRadius: 8,
//   },
//   editBtnText: { color: "#ffffff", fontWeight: "600", fontSize: 13 },
//   card: {
//     backgroundColor: "#ffffff",
//     borderRadius: 12,
//     padding: 20,
//     elevation: 2,
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 1 },
//     shadowOpacity: 0.05,
//     shadowRadius: 3,
//   },
//   inputGroup: { marginBottom: 18 },
//   label: { fontSize: 14, fontWeight: "500", color: "#111827", marginBottom: 6 },
//   required: { color: "#ef4444" },
//   input: {
//     borderWidth: 1,
//     borderColor: "#d1d5db",
//     borderRadius: 8,
//     paddingHorizontal: 12,
//     paddingVertical: 10,
//     fontSize: 14,
//     color: "#000000",
//     backgroundColor: "#ffffff",
//   },
//   disabledInput: { backgroundColor: "#f9fafb", borderColor: "#e5e7eb" },
//   errorBorder: { borderColor: "#ef4444" },
//   errorText: { color: "#ef4444", fontSize: 12, marginTop: 4 },
//   dropdownTrigger: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//   },
//   inputText: { color: "#000000", fontSize: 14 },
//   placeholderText: { color: "#9ca3af", fontSize: 14 },
//   textArea: { minHeight: 100, paddingTop: 10 },
//   actionRow: {
//     flexDirection: "row",
//     justifyContent: "flex-end",
//     alignItems: "center",
//     gap: 12,
//     marginTop: 20,
//   },
//   submitBtn: {
//     backgroundColor: "#2563eb",
//     paddingHorizontal: 20,
//     paddingVertical: 10,
//     borderRadius: 8,
//   },
//   disabledSubmitBtn: { backgroundColor: "#93c5fd" },
//   submitBtnText: { color: "#ffffff", fontWeight: "600", fontSize: 13 },
//   cancelBtn: { paddingHorizontal: 16, paddingVertical: 10 },
//   cancelBtnText: { color: "#374151", fontWeight: "600", fontSize: 13 },
//   modalOverlay: {
//     flex: 1,
//     backgroundColor: "rgba(0,0,0,0.4)",
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   pickerCard: {
//     backgroundColor: "#ffffff",
//     borderRadius: 12,
//     width: "80%",
//     padding: 16,
//   },
//   pickerTitle: {
//     fontSize: 16,
//     fontWeight: "600",
//     marginBottom: 12,
//     color: "#111827",
//   },
//   pickerOption: {
//     paddingVertical: 12,
//     paddingHorizontal: 12,
//     borderRadius: 6,
//   },
//   activePickerOption: { backgroundColor: "#f3f4f6" },
//   pickerOptionText: { fontSize: 14, color: "#1f2937" },
//   successDialog: {
//     backgroundColor: "#ffffff",
//     borderRadius: 16,
//     padding: 24,
//     width: "85%",
//     alignItems: "center",
//   },
//   successTitle: { fontSize: 18, fontWeight: "600", color: "#111827" },
//   successSubtext: { fontSize: 14, color: "#4b5563", marginTop: 4 },
//   successIconWrapper: { marginVertical: 20 },
//   continueBtn: {
//     backgroundColor: "#2563eb",
//     width: "100%",
//     paddingVertical: 12,
//     borderRadius: 8,
//     alignItems: "center",
//   },
//   continueBtnText: { color: "#ffffff", fontWeight: "600", fontSize: 14 },
// });

import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Modal,
  ActivityIndicator,
  StyleSheet,
  Alert,
} from "react-native";
import Ionicons from "@react-native-vector-icons/ionicons";

import {
  getProgramDetails,
  updateProgram,
} from "../../../services/allServices";

export default function EditProgram({ route, navigation }) {
  const programId = route?.params?.id;

  const [formData, setFormData] = useState({
    name: "",
    program_level: "",
    description: "",
  });

  const [errors, setErrors] = useState({});
  const [initialData, setInitialData] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  // Modals / Dropdowns
  const [openProgramLevel, setOpenProgramLevel] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  /* ---------------- Fetch Program Data ---------------- */
  useEffect(() => {
    if (!programId) return;

    const loadProgram = async () => {
      setFetching(true);
      try {
        const res = await getProgramDetails(programId);
        const data = res?.data;

        const loadedValues = {
          name: data?.name || "",
          program_level: data?.program_level || "",
          description: data?.description || "",
        };

        setFormData(loadedValues);
        setInitialData(loadedValues);
      } catch (err) {
        Alert.alert("Error", "Failed to load program");
      } finally {
        setFetching(false);
      }
    };

    loadProgram();
  }, [programId]);

  /* ---------------- Validation ---------------- */
  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) {
      newErrors.name = "Program name is required";
    } else if (formData.name.trim().length < 2) {
      newErrors.name = "Program name must be at least 2 characters";
    }

    if (!formData.program_level) {
      newErrors.program_level = "Program level is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /* ---------------- Dirty Form Check ---------------- */
  const isDirty =
    initialData &&
    (formData.name !== initialData.name ||
      formData.program_level !== initialData.program_level ||
      formData.description !== initialData.description);

  /* ---------------- Submit Handler ---------------- */
  const handleSubmit = async () => {
    if (!validate()) return;

    setLoading(true);
    try {
      const res = await updateProgram(programId, {
        ...formData,
        status: "draft",
      });

      if (res?.success) {
        setShowSuccess(true);
        setEditMode(false);
      } else {
        Alert.alert("Update Failed", res?.message || "Failed to update program");
      }
    } catch (err) {
      Alert.alert(
        "Server Error",
        err?.response?.data?.message || "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#2563eb" />
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        nestedScrollEnabled={true}
      >
        {/* Header Bar */}
        <View style={styles.headerBar}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backBtn}
          >
            <Ionicons name="arrow-back" size={20} color="#000" />
            <Text style={styles.backBtnText}>Back to Programs List</Text>
          </TouchableOpacity>

          <Text style={styles.headerTitle}>Edit Program</Text>

          {!editMode ? (
            <TouchableOpacity
              onPress={() => setEditMode(true)}
              style={styles.editBtn}
            >
              <Text style={styles.editBtnText}>EDIT</Text>
              <Ionicons name="pencil-sharp" size={14} color="#fff" />
            </TouchableOpacity>
          ) : (
            <View style={{ width: 60 }} />
          )}
        </View>

        {/* Card Form Wrapper */}
        <View style={styles.card}>
          {/* Program Name Input */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>
              Program Name<Text style={styles.required}> *</Text>
            </Text>
            <TextInput
              placeholder="Enter Program Name"
              placeholderTextColor="#9ca3af"
              value={formData.name}
              editable={editMode}
              onChangeText={(text) => {
                setFormData((prev) => ({ ...prev, name: text }));
                if (errors.name) setErrors((prev) => ({ ...prev, name: null }));
              }}
              style={[
                styles.input,
                !editMode && styles.disabledInput,
                errors.name && styles.errorBorder,
              ]}
            />
            {errors.name && (
              <Text style={styles.errorText}>{errors.name}</Text>
            )}
          </View>

          {/* Program Level Dropdown Field */}
          <View style={[styles.inputGroup, { zIndex: 1000 }]}>
            <Text style={styles.label}>
              Program Level<Text style={styles.required}> *</Text>
            </Text>
            <TouchableOpacity
              activeOpacity={editMode ? 0.7 : 1}
              onPress={() => {
                if (editMode) {
                  setOpenProgramLevel(!openProgramLevel);
                }
              }}
              style={[
                styles.input,
                styles.dropdownTrigger,
                !editMode && styles.disabledInput,
                errors.program_level && styles.errorBorder,
              ]}
            >
              <Text
                style={
                  formData.program_level
                    ? styles.inputText
                    : styles.placeholderText
                }
              >
                {formData.program_level || "Choose Program Level"}
              </Text>
              <Ionicons
                name={openProgramLevel ? "chevron-up" : "chevron-down"}
                size={16}
                color={editMode ? "#374151" : "#9ca3af"}
              />
            </TouchableOpacity>

            {/* Inline Floating Dropdown List */}
            {openProgramLevel && editMode && (
              <View style={styles.dropdownMenu}>
                {[
                  { label: "Undergraduate", value: "Undergraduate" },
                  { label: "Graduate", value: "Graduate" },
                ].map((item) => (
                  <TouchableOpacity
                    key={item.value}
                    style={[
                      styles.dropdownOption,
                      formData.program_level === item.value &&
                        styles.activeOption,
                    ]}
                    onPress={() => {
                      setFormData((prev) => ({
                        ...prev,
                        program_level: item.value,
                      }));
                      if (errors.program_level) {
                        setErrors((prev) => ({ ...prev, program_level: null }));
                      }
                      setOpenProgramLevel(false);
                    }}
                  >
                    <Text style={styles.dropdownOptionText}>{item.label}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}

            {errors.program_level && (
              <Text style={styles.errorText}>{errors.program_level}</Text>
            )}
          </View>

          {/* Description Textarea */}
          <View style={[styles.inputGroup, { zIndex: 1 }]}>
            <Text style={styles.label}>Description</Text>
            <TextInput
              placeholder="Describe program..."
              placeholderTextColor="#9ca3af"
              value={formData.description}
              editable={editMode}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
              onChangeText={(text) =>
                setFormData((prev) => ({ ...prev, description: text }))
              }
              style={[
                styles.input,
                styles.textArea,
                !editMode && styles.disabledInput,
              ]}
            />
          </View>

          {/* Actions */}
          <View style={styles.actionRow}>
            {editMode && (
              <TouchableOpacity
                onPress={handleSubmit}
                disabled={!isDirty || loading}
                style={[
                  styles.submitBtn,
                  (!isDirty || loading) && styles.disabledSubmitBtn,
                ]}
              >
                {loading ? (
                  <ActivityIndicator size="small" color="#ffffff" />
                ) : (
                  <Text style={styles.submitBtnText}>UPDATE →</Text>
                )}
              </TouchableOpacity>
            )}

            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={styles.cancelBtn}
            >
              <Text style={styles.cancelBtnText}>CANCEL</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* Success Modal */}
      <Modal visible={showSuccess} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.successDialog}>
            <Text style={styles.successTitle}>{formData.name}</Text>
            <Text style={styles.successSubtext}>
              Program Updated Successfully
            </Text>

            <View style={styles.successIconWrapper}>
              <Ionicons name="checkmark-circle" size={60} color="#22c55e" />
            </View>

            <TouchableOpacity
              onPress={() => {
                setShowSuccess(false);
                navigation.navigate("Programs");
              }}
              style={styles.continueBtn}
            >
              <Text style={styles.continueBtnText}>CONTINUE →</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#f8fafc" },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f8fafc",
  },
  scrollContent: { padding: 16 },
  headerBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  backBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    padding: 6,
  },
  backBtnText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#000000",
  },
  headerTitle: { fontSize: 16, fontWeight: "600", color: "#000000" },
  editBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#2563eb",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
  },
  editBtnText: { color: "#ffffff", fontWeight: "600", fontSize: 13 },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 20,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
  },
  inputGroup: { marginBottom: 18, position: "relative" },
  label: { fontSize: 14, fontWeight: "500", color: "#111827", marginBottom: 6 },
  required: { color: "#ef4444" },
  input: {
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: "#000000",
    backgroundColor: "#ffffff",
  },
  disabledInput: { backgroundColor: "#f9fafb", borderColor: "#e5e7eb" },
  errorBorder: { borderColor: "#ef4444" },
  errorText: { color: "#ef4444", fontSize: 12, marginTop: 4 },
  dropdownTrigger: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  inputText: { color: "#000000", fontSize: 14 },
  placeholderText: { color: "#9ca3af", fontSize: 14 },
  dropdownMenu: {
    position: "absolute",
    top: 68,
    left: 0,
    right: 0,
    backgroundColor: "#f3f4f6",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 5,
    zIndex: 9999,
    overflow: "hidden",
  },
  dropdownOption: {
    paddingVertical: 12,
    paddingHorizontal: 14,
  },
  activeOption: {
    backgroundColor: "#e5e7eb",
  },
  dropdownOptionText: {
    fontSize: 14,
    color: "#111827",
  },
  textArea: { minHeight: 100, paddingTop: 10 },
  actionRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    gap: 12,
    marginTop: 20,
    zIndex: 1,
  },
  submitBtn: {
    backgroundColor: "#2563eb",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  disabledSubmitBtn: { backgroundColor: "#93c5fd" },
  submitBtnText: { color: "#ffffff", fontWeight: "600", fontSize: 13 },
  cancelBtn: { paddingHorizontal: 16, paddingVertical: 10 },
  cancelBtnText: { color: "#374151", fontWeight: "600", fontSize: 13 },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  successDialog: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 24,
    width: "85%",
    alignItems: "center",
  },
  successTitle: { fontSize: 18, fontWeight: "600", color: "#111827" },
  successSubtext: { fontSize: 14, color: "#4b5563", marginTop: 4 },
  successIconWrapper: { marginVertical: 20 },
  continueBtn: {
    backgroundColor: "#2563eb",
    width: "100%",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  continueBtnText: { color: "#ffffff", fontWeight: "600", fontSize: 14 },
});