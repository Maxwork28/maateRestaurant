import * as ImagePicker from "expo-image-picker";
import React, { useState } from "react";
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
import { styles } from "../css/restaurant/additemmodal"; // Reusing the same styles

interface AddCategoryModalProps {
  visible: boolean;
  onDismiss: () => void;
  onSave: (categoryData: any) => void;
  isLoading?: boolean;
}

const AddCategoryModal: React.FC<AddCategoryModalProps> = ({ visible, onDismiss, onSave, isLoading }) => {
  const [categoryName, setCategoryName] = useState("");
  const [categoryDescription, setCategoryDescription] = useState("");
  const [selectedImage, setSelectedImage] = useState("");

  // Default category image
  const defaultImage =
    "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400&h=300&fit=crop";

  const requestPermissions = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permission needed",
        "Sorry, we need camera roll permissions to upload images!"
      );
      return false;
    }
    return true;
  };

  const handleImageUpload = async () => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) return;

    Alert.alert("Upload Image", "Select image source", [
      {
        text: "Camera",
        onPress: async () => {
          const cameraPermission =
            await ImagePicker.requestCameraPermissionsAsync();
          if (cameraPermission.status !== "granted") {
            Alert.alert("Permission needed", "Camera permission is required!");
            return;
          }

          const result = await ImagePicker.launchCameraAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 0.7,
          });

          if (!result.canceled && result.assets[0]) {
            setSelectedImage(result.assets[0].uri);
          }
        },
      },
      {
        text: "Gallery",
        onPress: async () => {
          const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 0.7,
          });

          if (!result.canceled && result.assets[0]) {
            setSelectedImage(result.assets[0].uri);
          }
        },
      },
      { text: "Cancel", style: "cancel" },
    ]);
  };

  const handleSave = () => {
    if (!categoryName.trim()) {
      Alert.alert("Error", "Please enter a category name");
      return;
    }

    const newCategory = {
      id: Date.now().toString(),
      name: categoryName.trim(),
      description: categoryDescription.trim(),
      image: selectedImage || defaultImage,
    };

    onSave(newCategory);

    // Reset form
    setCategoryName("");
    setCategoryDescription("");
    setSelectedImage("");
    onDismiss();
  };

  const handleCancel = () => {
    // Reset form
    setCategoryName("");
    setCategoryDescription("");
    setSelectedImage("");
    onDismiss();
  };

  return (
    <Portal>
      <Modal
        visible={visible}
        onDismiss={onDismiss}
        contentContainerStyle={[styles.modalContainer, { maxHeight: "90%" }]}
      >
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Image Upload Section */}
          <TouchableOpacity
            onPress={handleImageUpload}
            style={styles.imageUploadContainer}
          >
            {selectedImage ? (
              <View style={styles.imageContainer}>
                <Image
                  source={{ uri: selectedImage }}
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
                  source={{ uri: defaultImage }}
                  style={styles.defaultImage}
                />
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
              </View>
            )}
          </TouchableOpacity>

          {/* Category Name */}
          <TextInput
            label="Category Name *"
            mode="outlined"
            value={categoryName}
            onChangeText={setCategoryName}
            style={styles.modalInput}
            outlineColor="#e0e0e0"
            activeOutlineColor="#ff6b35"
            textColor="#333"
            placeholder="e.g., Appetizers, Main Course, Desserts"
          />

          {/* Category Description */}
          <TextInput
            label="Category Description"
            mode="outlined"
            value={categoryDescription}
            onChangeText={setCategoryDescription}
            style={styles.modalInput}
            multiline
            numberOfLines={3}
            outlineColor="#e0e0e0"
            activeOutlineColor="#ff6b35"
            textColor="#333"
            placeholder="Brief description of this category (optional)"
          />

          {/* Action Buttons */}
          <View style={styles.modalButtons}>
            <Button
              mode="outlined"
              onPress={handleCancel}
              style={styles.cancelButton}
              textColor="#ff6b35"
            >
              Cancel
            </Button>
            <Button
              mode="contained"
              onPress={handleSave}
              style={styles.saveButton}
              buttonColor="#ff6b35"
              textColor="#ffffff"
              loading={isLoading}
              disabled={isLoading}
            >
              {isLoading ? "Creating..." : "Save Category"}
            </Button>
          </View>
        </ScrollView>
      </Modal>
    </Portal>
  );
};

export default AddCategoryModal;