// components/AddItemModal.js
import * as ImagePicker from "expo-image-picker";
import React, { useState, useEffect } from "react";
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
  Menu,
  Modal,
  Portal,
  TextInput,
} from "react-native-paper";
import { styles } from "../css/restaurant/additemmodal";

const AddItemModal = ({ visible, onDismiss, onSave, isLoading = false, categories = [] }: any) => {
  const [itemName, setItemName] = useState("");
  const [itemCategory, setItemCategory] = useState("");
  const [itemDetails, setItemDetails] = useState("");
  const [itemPrice, setItemPrice] = useState("");
  const [itemAvailability, setItemAvailability] = useState("in-stock");
  const [dietMeal, setDietMeal] = useState("Yes");
  const [calories, setCalories] = useState("");
  const [selectedImage, setSelectedImage] = useState("");
  const [showCategoryMenu, setShowCategoryMenu] = useState(false);
  const [showAvailabilityMenu, setShowAvailabilityMenu] = useState(false);
  const [showDietMenu, setShowDietMenu] = useState(false);

  // Debug component lifecycle
  useEffect(() => {
    console.log("🔍 [ADD_ITEM_MODAL] Component mounted/updated");
    console.log("🔍 [ADD_ITEM_MODAL] Initial state:", {
      visible,
      categories: categories.length,
      itemCategory
    });
    
    // Cleanup function to log when component unmounts
    return () => {
      console.log("🔍 [ADD_ITEM_MODAL] Component unmounting");
      console.log("🔍 [ADD_ITEM_MODAL] Final state before unmount:", {
        visible,
        categories: categories.length,
        itemCategory
      });
    };
  }, []); // Only run once on mount

  // Debug categories when they change
  useEffect(() => {
    console.log("🔍 [ADD_ITEM_MODAL] Categories updated:", categories);
    console.log("🔍 [ADD_ITEM_MODAL] Current itemCategory state:", itemCategory);
    
    // Check if the currently selected category is still valid
    if (itemCategory && categories.length > 0) {
      const categoryStillExists = categories.some((cat: any) => cat.name === itemCategory);
      if (!categoryStillExists) {
        console.log("🔍 [ADD_ITEM_MODAL] Selected category no longer exists, resetting selection");
        setItemCategory("");
      } else {
        console.log("🔍 [ADD_ITEM_MODAL] Selected category still valid:", itemCategory);
      }
    }
  }, [categories]);

  // Debug itemCategory changes
  useEffect(() => {
    console.log("🔍 [ADD_ITEM_MODAL] itemCategory changed to:", itemCategory);
  }, [itemCategory]);

  // Debug modal visibility
  useEffect(() => {
    console.log("🔍 [ADD_ITEM_MODAL] Modal visibility changed to:", visible);
    if (visible) {
      console.log("🔍 [ADD_ITEM_MODAL] Modal opened with categories:", categories);
      console.log("🔍 [ADD_ITEM_MODAL] Current itemCategory state:", itemCategory);
      
      // Reset form fields but preserve category selection
      console.log("🔍 [ADD_ITEM_MODAL] Resetting form fields (preserving category selection)");
      setItemName("");
      setItemDetails("");
      setItemPrice("");
      setItemAvailability("in-stock");
      setDietMeal("Yes");
      setCalories("");
      setSelectedImage("");
      // Note: We're NOT resetting itemCategory here to preserve the selection
      
      console.log("🔍 [ADD_ITEM_MODAL] After reset - itemCategory state:", itemCategory);
    } else {
      console.log("🔍 [ADD_ITEM_MODAL] Modal closed");
      console.log("🔍 [ADD_ITEM_MODAL] Final itemCategory state before close:", itemCategory);
      
      // Don't reset itemCategory when modal closes - preserve it for next open
      console.log("🔍 [ADD_ITEM_MODAL] Preserving itemCategory for next modal open:", itemCategory);
    }
  }, [visible]); // Remove categories and itemCategory from dependency array

  // Use categories from API if available, otherwise fallback to defaults
  const categoryOptions = categories.length > 0 
    ? categories.map((cat: any) => cat.name)
    : ["Veg", "Non-Veg", "Beverages", "Desserts", "Snacks"];
  
  // Debug category options
  useEffect(() => {
    console.log("🔍 [ADD_ITEM_MODAL] Category options generated:", categoryOptions);
    console.log("🔍 [ADD_ITEM_MODAL] Source categories:", categories);
  }, [categoryOptions, categories]);
  
  const availabilityOptions = ["in-stock", "out-of-stock", "limited"];
  
  // Display text for availability options
  const getAvailabilityDisplayText = (value: string) => {
    switch (value) {
      case 'in-stock': return 'In Stock';
      case 'out-of-stock': return 'Out of Stock';
      case 'limited': return 'Limited';
      default: return value;
    }
  };
  const dietOptions = ["Yes", "No"];

  // Default burger image (you can replace with your default image)
  const defaultImage =
    "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop";

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
    console.log("🔍 [ADD_ITEM_MODAL] handleSave called");
    console.log("🔍 [ADD_ITEM_MODAL] Current form state:", {
      itemName,
      itemCategory,
      itemDetails,
      itemPrice,
      itemAvailability,
      dietMeal,
      calories,
      selectedImage
    });
    console.log("🔍 [ADD_ITEM_MODAL] Available categories:", categories);

    if (!itemName || !itemPrice) {
      Alert.alert("Error", "Please fill all required fields");
      return;
    }

    if (!itemCategory || itemCategory.trim() === "") {
      Alert.alert("Error", "Please select a category");
      return;
    }

    if (categories.length === 0) {
      Alert.alert("Error", "No categories available. Please create a category first.");
      return;
    }

    // Debug category selection
    console.log("🔍 [ADD_ITEM_MODAL] Category selection debug:", {
      selectedCategory: itemCategory,
      availableCategories: categories,
      itemCategoryType: typeof itemCategory
    });

    // Find the category object to get the ID
    const selectedCategoryObj = categories.find((cat: any) => cat.name === itemCategory);
    const categoryId = selectedCategoryObj ? selectedCategoryObj.id : itemCategory;

    console.log("🔍 [ADD_ITEM_MODAL] Category mapping:", {
      selectedCategoryObj,
      categoryId,
      categoryIdType: typeof categoryId
    });

    if (!categoryId || categoryId === 'undefined') {
      Alert.alert("Error", "Please select a valid category");
      return;
    }

    const newItem = {
      id: Date.now().toString(),
      name: itemName,
      category: categoryId, // Use category ID for API
      description: itemDetails,
      itemCategory: itemCategory, // Keep the name for display
      price: parseFloat(itemPrice),
      availability: itemAvailability,
      isDietMeal: dietMeal === "Yes",
      calories: parseInt(calories) || 0,
      image: selectedImage || defaultImage,
      restaurant: "Your Restaurant",
      isVegetarian: itemCategory.toLowerCase() === "veg",
    };

    console.log("🚀 [ADD_ITEM_MODAL] Sending item data:", newItem);

    // Pass data to parent first
    onSave(newItem);

    // Reset form after data is passed to parent
    console.log("🔍 [ADD_ITEM_MODAL] Resetting form after save");
    setItemName("");
    setItemCategory("");
    setItemDetails("");
    setItemPrice("");
    setItemAvailability("in-stock");
    setDietMeal("Yes");
    setCalories("");
    setSelectedImage("");
    
    // Close modal last
    onDismiss();
  };

  return (
    <Portal>
      <Modal
        visible={visible}
        onDismiss={onDismiss}
        contentContainerStyle={[styles.modalContainer, { maxHeight: "100%" }]}
      >
        <ScrollView showsVerticalScrollIndicator={false}>
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
          <View style={styles.rowContainer}>
            <TextInput
              label="Item Name"
              mode="outlined"
              value={itemName}
              onChangeText={setItemName}
              style={styles.modalInput}
              outlineColor="#e0e0e0"
              activeOutlineColor="#ff6b35"
              textColor="#333"
            />

            {categories.length === 0 && (
              <Text style={{ color: '#ff6b35', fontSize: 12, marginBottom: 8 }}>
                ⚠️ No categories available. Please create a category first.
              </Text>
            )}

         

            <Menu
              visible={showCategoryMenu}
              onDismiss={() => setShowCategoryMenu(false)}
              anchor={
                <TouchableOpacity onPress={() => setShowCategoryMenu(true)}>
                  <TextInput
                    label="Item Category *"
                    mode="outlined"
                    value={itemCategory || "Select Category"}
                    editable={false}
                    style={styles.modalInput}
                    outlineColor="#e0e0e0"
                    activeOutlineColor="#ff6b35"
                    right={<TextInput.Icon icon="chevron-down" />}
                    textColor={itemCategory ? "#333" : "#999"}
                  />
                </TouchableOpacity>
              }
            >
              {categoryOptions.length > 0 ? (
                categoryOptions.map((option: string) => (
                  <Menu.Item
                    key={option}
                    onPress={() => {
                      console.log("🔍 [ADD_ITEM_MODAL] Category selected from menu:", option);
                      console.log("🔍 [ADD_ITEM_MODAL] Available categories:", categories);
                      console.log("🔍 [ADD_ITEM_MODAL] Finding category object for:", option);
                      
                      const selectedCategoryObj = categories.find((cat: any) => cat.name === option);
                      console.log("🔍 [ADD_ITEM_MODAL] Found category object:", selectedCategoryObj);
                      
                      setItemCategory(option);
                      setShowCategoryMenu(false);
                      
                      console.log("🔍 [ADD_ITEM_MODAL] itemCategory set to:", option);
                    }}
                    title={option}
                  />
                ))
              ) : (
                <Menu.Item
                  title="No categories available"
                  disabled
                />
              )}
            </Menu>
          </View>

          {/* Item Details */}
          <TextInput
            label="Item Details"
            mode="outlined"
            value={itemDetails}
            onChangeText={setItemDetails}
            style={styles.modalInput}
            multiline
            numberOfLines={3}
            outlineColor="#e0e0e0"
            activeOutlineColor="#ff6b35"
            placeholder="Don't eat too much"
            textColor="#333"
          />

          {/* Price and Availability Row */}
          <View style={styles.rowContainer}>
            <TextInput
              label="Item Price *"
              mode="outlined"
              value={itemPrice}
              onChangeText={setItemPrice}
              style={styles.modalInput}
              keyboardType="numeric"
              left={<TextInput.Icon icon="currency-inr" />}
              outlineColor="#e0e0e0"
              activeOutlineColor="#ff6b35"
              textColor="#333"
            />

            <Menu
              visible={showAvailabilityMenu}
              onDismiss={() => setShowAvailabilityMenu(false)}
              anchor={
                <TouchableOpacity onPress={() => setShowAvailabilityMenu(true)}>
                  <TextInput
                    label="Item Availability"
                    mode="outlined"
                    value={getAvailabilityDisplayText(itemAvailability)}
                    editable={false}
                    style={styles.modalInput}
                    right={<TextInput.Icon icon="chevron-down" />}
                    outlineColor="#e0e0e0"
                    activeOutlineColor="#ff6b35"
                    textColor="#333"
                  />
                </TouchableOpacity>
              }
            >
              {availabilityOptions.map((option) => (
                <Menu.Item
                  key={option}
                  onPress={() => {
                    setItemAvailability(option);
                    setShowAvailabilityMenu(false);
                  }}
                  title={getAvailabilityDisplayText(option)}
                />
              ))}
            </Menu>
          </View>

          {/* Diet Meal and Calories Row */}
          <View style={styles.rowContainer}>
            <Menu
              visible={showDietMenu}
              onDismiss={() => setShowDietMenu(false)}
              anchor={
                <TouchableOpacity onPress={() => setShowDietMenu(true)}>
                  <TextInput
                    label="Diet Meal"
                    mode="outlined"
                    value={dietMeal}
                    editable={false}
                    style={styles.modalInput}
                    right={<TextInput.Icon icon="chevron-down" />}
                    outlineColor="#e0e0e0"
                    activeOutlineColor="#ff6b35"
                    textColor="#333"
                  />
                </TouchableOpacity>
              }
            >
              {dietOptions.map((option) => (
                <Menu.Item
                  key={option}
                  onPress={() => {
                    setDietMeal(option);
                    setShowDietMenu(false);
                  }}
                  title={option}
                />
              ))}
            </Menu>

            <TextInput
              label="Calories"
              mode="outlined"
              value={calories}
              onChangeText={setCalories}
              style={styles.modalInput}
              keyboardType="numeric"
              outlineColor="#e0e0e0"
              activeOutlineColor="#ff6b35"
              textColor="#333"
            />
          </View>

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
              loading={isLoading}
              disabled={isLoading || categories.length === 0 || !itemCategory || itemCategory.trim() === ""}
            >
              {isLoading ? "Creating..." : "Save Details"}
            </Button>
          </View>
        </ScrollView>
      </Modal>
    </Portal>
  );
};

export default AddItemModal;
