import * as ImagePicker from "expo-image-picker";
import React, { useState } from "react";
import { Alert, Image, Text, TouchableOpacity, View } from "react-native";
import {
  Button,
  IconButton,
  Modal,
  Portal,
  TextInput,
} from "react-native-paper";
import { styles } from "../css/restaurant/addoffermodal";

const defaultImage = "https://cdn-icons-png.flaticon.com/512/1040/1040230.png"; // fallback image

const AddOfferModal = ({ visible, onDismiss, onSave }: any) => {
  const [offerTitle, setOfferTitle] = useState("");
  const [discountAmount, setDiscountAmount] = useState("");
  const [selectedImage, setSelectedImage] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const requestPermissions = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permission required",
        "Enable gallery access to upload image"
      );
      return false;
    }
    return true;
  };

  const handleImageUpload = async () => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) return;

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.7,
    });

    if (!result.canceled && result.assets[0]) {
      setSelectedImage(result.assets[0].uri);
    }
  };

  const handleSave = () => {
    if (!offerTitle || !discountAmount || !startDate || !endDate) {
      Alert.alert("Missing Info", "Please fill all fields");
      return;
    }

    const offerData = {
      title: offerTitle,
      discount: discountAmount,
      image: selectedImage || defaultImage,
      startDate: startDate,
      endDate: endDate,
    };

    onSave(offerData);
    setOfferTitle("");
    setDiscountAmount("");
    setSelectedImage("");
    setStartDate("");
    setEndDate("");
    onDismiss();
  };

  return (
    <Portal>
      <Modal
        visible={visible}
        onDismiss={onDismiss}
        contentContainerStyle={styles.modalContainer}
      >
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

        <TextInput
          label="Offer Title"
          mode="outlined"
          value={offerTitle}
          onChangeText={setOfferTitle}
          style={styles.modalInput}
          outlineColor="#e0e0e0"
          activeOutlineColor="#ff6b35"
          textColor="#333"
        />

        <TextInput
          label="Discount Amount"
          mode="outlined"
          value={discountAmount}
          onChangeText={setDiscountAmount}
          keyboardType="numeric"
          style={styles.modalInput}
          outlineColor="#e0e0e0"
          activeOutlineColor="#ff6b35"
          textColor="#333"
        />

        <TextInput
          label="Start Date (YYYY-MM-DD)"
          mode="outlined"
          value={startDate}
          onChangeText={setStartDate}
          style={styles.modalInput}
          outlineColor="#e0e0e0"
          activeOutlineColor="#ff6b35"
          placeholder="2025-07-01"
          textColor="#333"
        />

        <TextInput
          label="End Date (YYYY-MM-DD)"
          mode="outlined"
          value={endDate}
          onChangeText={setEndDate}
          style={styles.modalInput}
          outlineColor="#e0e0e0"
          activeOutlineColor="#ff6b35"
          placeholder="2025-07-10"
          textColor="#333"
        />

        <View style={styles.modalButtons}>
          <Button
            mode="outlined"
            onPress={onDismiss}
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
          >
            Save Details
          </Button>
        </View>
      </Modal>
    </Portal>
  );
};

export default AddOfferModal;
