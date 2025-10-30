import * as ImagePicker from "expo-image-picker";
import React, { useState, useCallback, useMemo } from "react";
import {
  Alert,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import {
  Button,
  IconButton,
  Modal,
  Portal,
  TextInput,
} from "react-native-paper";
import { Ionicons } from "@expo/vector-icons";
import { styles } from "../css/restaurant/additemmodal";

// Types
interface CategoryData {
  id: string;
  name: string;
  description: string;
  image: string;
}

interface AddCategoryModalProps {
  visible: boolean;
  onDismiss: () => void;
  onSave: (categoryData: CategoryData) => void;
  onUpdate?: (categoryData: CategoryData) => void;
  isLoading?: boolean;
  editCategory?: CategoryData | null;
  isEditMode?: boolean;
  isViewMode?: boolean;
}

// Constants
const DEFAULT_IMAGE = "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400&h=300&fit=crop";
const IMAGE_PICKER_OPTIONS = {
  mediaTypes: ImagePicker.MediaTypeOptions.Images,
  allowsEditing: true,
  aspect: [4, 3] as [number, number],
  quality: 0.7,
};

const AddCategoryModal: React.FC<AddCategoryModalProps> = React.memo(({ 
  visible, 
  onDismiss, 
  onSave, 
  onUpdate,
  isLoading = false,
  editCategory = null,
  isEditMode = false,
  isViewMode = false
}) => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    image: "",
  });

  // Reset form when modal opens or populate for edit/view
  React.useEffect(() => {
    if (visible) {
      if ((isEditMode || isViewMode) && editCategory) {
        // Populate form with edit/view category data
        setFormData({
          name: editCategory.name || "",
          description: editCategory.description || "",
          image: editCategory.image || "",
        });
      } else {
        // Reset form for new category
        setFormData({ name: "", description: "", image: "" });
      }
    }
  }, [visible, isEditMode, isViewMode, editCategory]);

  // Permission handling
  const requestPermissions = useCallback(async (): Promise<boolean> => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permission needed",
        "Sorry, we need camera roll permissions to upload images!"
      );
      return false;
    }
    return true;
  }, []);

  const requestCameraPermission = useCallback(async (): Promise<boolean> => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission needed", "Camera permission is required!");
      return false;
    }
    return true;
  }, []);

  // Image picker handlers
  const handleCameraCapture = useCallback(async () => {
    const hasPermission = await requestCameraPermission();
    if (!hasPermission) return;

    const result = await ImagePicker.launchCameraAsync(IMAGE_PICKER_OPTIONS);
    if (!result.canceled && result.assets[0]) {
      setFormData(prev => ({ ...prev, image: result.assets[0].uri }));
    }
  }, [requestCameraPermission]);

  const handleGalleryPick = useCallback(async () => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) return;

    const result = await ImagePicker.launchImageLibraryAsync(IMAGE_PICKER_OPTIONS);
    if (!result.canceled && result.assets[0]) {
      setFormData(prev => ({ ...prev, image: result.assets[0].uri }));
    }
  }, [requestPermissions]);

  const handleImageUpload = useCallback(() => {
    Alert.alert("Upload Image", "Select image source", [
      { text: "Camera", onPress: handleCameraCapture },
      { text: "Gallery", onPress: handleGalleryPick },
      { text: "Cancel", style: "cancel" },
    ]);
  }, [handleCameraCapture, handleGalleryPick]);

  // Form handlers
  const updateFormData = useCallback((field: keyof typeof formData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  }, []);

  const resetForm = useCallback(() => {
    setFormData({ name: "", description: "", image: "" });
  }, []);

  const handleSave = useCallback(() => {
    if (!formData.name.trim()) {
      Alert.alert("Error", "Please enter a category name");
      return;
    }

    const categoryData: CategoryData = {
      id: isEditMode && editCategory ? editCategory.id : Date.now().toString(),
      name: formData.name.trim(),
      description: formData.description.trim(),
      image: formData.image || DEFAULT_IMAGE,
    };

    if (isEditMode && onUpdate) {
      onUpdate(categoryData);
    } else {
      onSave(categoryData);
    }
    resetForm();
    onDismiss();
  }, [formData, onSave, onUpdate, resetForm, onDismiss, isEditMode, editCategory]);

  const handleCancel = useCallback(() => {
    resetForm();
    onDismiss();
  }, [resetForm, onDismiss]);

  // Memoized components
  const ImageUploadSection = useMemo(() => (
    <TouchableOpacity
      onPress={isViewMode ? undefined : handleImageUpload}
      style={styles.imageUploadContainer}
      disabled={isViewMode}
    >
      {formData.image ? (
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: formData.image }}
            style={styles.uploadedImage}
          />
          <View style={styles.imageOverlay}>
            <IconButton
              icon="camera"
              mode="contained"
              size={20}
              style={styles.cameraIcon}
              iconColor="#fff"
              onPress={handleImageUpload}
            />
          </View>
        </View>
      ) : (
        <View style={styles.uploadPlaceholder}>
          <Image
            source={{ uri: DEFAULT_IMAGE }}
            style={styles.defaultImage}
          />
          {!isViewMode && (
            <View style={styles.uploadOverlay}>
              <IconButton
                icon="camera"
                mode="contained"
                size={24}
                style={styles.cameraIconLarge}
                iconColor="#fff"
              />
              <Text style={styles.uploadText}>UPLOAD IMAGE</Text>
            </View>
          )}
        </View>
      )}
    </TouchableOpacity>
  ), [formData.image, handleImageUpload]);

  const ActionButtons = useMemo(() => (
    !isViewMode ? (
      <View style={styles.modalButtons}>
        <Button
          mode="contained"
          onPress={handleSave}
          style={styles.saveButton}
          buttonColor="#6F32AB"
          textColor="#ffffff"
          loading={isLoading}
          disabled={isLoading}
        >
          {isLoading 
            ? (isEditMode ? "Updating..." : "Creating...") 
            : (isEditMode ? "Update Category" : "Save Category")
          }
        </Button>
      </View>
    ) : null
  ), [handleSave, isLoading, isViewMode, isEditMode]);

  return (
    <Portal>
      <Modal
        visible={visible}
        onDismiss={onDismiss}
        contentContainerStyle={[styles.modalContainer, { maxHeight: "90%" }]}
      >
        <ScrollView showsVerticalScrollIndicator={false} style={{ padding: 12 }}>
          <View style={{ position: 'relative' }}>
            {ImageUploadSection}
            <TouchableOpacity
              style={styles.closeButton}
              onPress={handleCancel}
            >
              <Ionicons name="arrow-back" size={18} color="#ffffff" />
            </TouchableOpacity>
          </View>

          <View style={styles.rowContainer}>
            <View style={{ flex: 1 }}>
              <Text style={styles.inputLabel}>CATEGORY NAME *</Text>
              <TextInput
                mode="outlined"
                value={formData.name}
                onChangeText={(value) => updateFormData("name", value)}
                style={styles.modalInput}
                contentStyle={{ borderRadius: 35 }}
                outlineColor="#e0e0e0"
                activeOutlineColor="#6F32AB"
                textColor="#333"
                editable={!isViewMode}
              />
            </View>
          </View>

          <View style={styles.rowContainer}>
            <View style={{ flex: 1 }}>
              <Text style={styles.inputLabel}>CATEGORY DESCRIPTION</Text>
              <TextInput
                mode="outlined"
                value={formData.description}
                onChangeText={(value) => updateFormData("description", value)}
                style={styles.modalInputMultiline}
                contentStyle={{ borderRadius: 30 }}
                multiline
                numberOfLines={3}
                outlineColor="#e0e0e0"
                activeOutlineColor="#6F32AB"
                textColor="#333"
                editable={!isViewMode}
              />
            </View>
          </View>

          {ActionButtons}
        </ScrollView>
      </Modal>
    </Portal>
  );
});

AddCategoryModal.displayName = "AddCategoryModal";

export default AddCategoryModal;