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
  Menu,
  Modal,
  Portal,
  TextInput,
} from "react-native-paper";
import { Ionicons } from '@expo/vector-icons';
import { styles } from "../css/restaurant/additemmodal";

// Types
interface Category {
  id: string;
  name: string;
  image?: string;
  description?: string;
}

interface ItemData {
  id: string;
  name: string;
  category: string;
  description: string;
  itemCategory: string;
  price: number;
  availability: string;
  isDietMeal: boolean;
  calories: number;
  image: string;
  restaurant: string;
  isVegetarian: boolean;
}

interface AddItemModalProps {
  visible: boolean;
  onDismiss: () => void;
  onSave: (itemData: ItemData) => void;
  onUpdate?: (itemData: ItemData) => void;
  isLoading?: boolean;
  categories?: Category[];
  editItem?: ItemData | null;
  isEditMode?: boolean;
  isViewMode?: boolean;
}

// Constants
const DEFAULT_IMAGE = "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop";
const IMAGE_PICKER_OPTIONS = {
  mediaTypes: ImagePicker.MediaTypeOptions.Images,
  allowsEditing: true,
  aspect: [4, 3] as [number, number],
  quality: 0.7,
};

const AVAILABILITY_OPTIONS = [
  { value: "in-stock", label: "In Stock" },
  { value: "out-of-stock", label: "Out of Stock" },
  { value: "limited", label: "Limited" },
];

const DIET_OPTIONS = ["Yes", "No"];

const AddItemModal: React.FC<AddItemModalProps> = React.memo(({ 
  visible, 
  onDismiss, 
  onSave, 
  onUpdate,
  isLoading = false, 
  categories = [],
  editItem = null,
  isEditMode = false,
  isViewMode = false
}) => {
  // Debug props
  React.useEffect(() => {
    console.log("🔍 [MODAL] AddItemModal props:", {
      visible,
      isEditMode,
      isViewMode,
      editItem: editItem ? { name: editItem.name, id: editItem.id } : null
    });
  }, [visible, isEditMode, isViewMode, editItem]);
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    description: "",
    price: "",
    availability: "in-stock",
    dietMeal: "Yes",
    calories: "",
    image: "",
  });

  const [menuStates, setMenuStates] = useState({
    category: false,
    availability: false,
    diet: false,
  });

  const [categorySearch, setCategorySearch] = useState("");

  // Reset form when modal opens or populate for edit/view
  React.useEffect(() => {
    if (visible) {
      if ((isEditMode || isViewMode) && editItem) {
        // Populate form with edit/view item data
        setFormData({
          name: editItem.name || "",
          category: editItem.itemCategory || "",
          description: editItem.description || "",
          price: editItem.price?.toString() || "",
          availability: editItem.availability || "in-stock",
          dietMeal: editItem.isDietMeal ? "Yes" : "No",
          calories: editItem.calories?.toString() || "",
          image: editItem.image || "",
        });
      } else {
        // Reset form for new item
        setFormData({
          name: "",
          category: "",
          description: "",
          price: "",
          availability: "in-stock",
          dietMeal: "Yes",
          calories: "",
          image: "",
        });
      }
      setMenuStates({ category: false, availability: false, diet: false });
      setCategorySearch("");
    }
  }, [visible, isEditMode, isViewMode, editItem]);

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

  const toggleMenu = useCallback((menu: keyof typeof menuStates) => {
    setMenuStates(prev => ({ ...prev, [menu]: !prev[menu] }));
  }, []);

  const closeMenu = useCallback((menu: keyof typeof menuStates) => {
    setMenuStates(prev => ({ ...prev, [menu]: false }));
  }, []);

  const resetForm = useCallback(() => {
    setFormData({
      name: "",
      category: "",
      description: "",
      price: "",
      availability: "in-stock",
      dietMeal: "Yes",
      calories: "",
      image: "",
    });
  }, []);

  // Computed values
  const categoryOptions = useMemo(() => 
    categories.length > 0 
      ? categories.map(cat => cat.name)
      : ["Veg", "Non-Veg", "Beverages", "Desserts", "Snacks"],
    [categories]
  );

  const filteredCategories = useMemo(() => 
    categoryOptions.filter(category => 
      category.toLowerCase().includes(categorySearch.toLowerCase())
    ),
    [categoryOptions, categorySearch]
  );

  const isFormValid = useMemo(() => {
    return formData.name.trim() && 
           formData.price.trim() && 
           formData.category.trim() &&
           categories.length > 0;
  }, [formData, categories.length]);

  const getAvailabilityDisplayText = useCallback((value: string) => {
    const option = AVAILABILITY_OPTIONS.find(opt => opt.value === value);
    return option ? option.label : value;
  }, []);

  const handleSave = useCallback(() => {
    if (!isFormValid) {
      Alert.alert("Error", "Please fill all required fields and ensure categories are available");
      return;
    }

    // Find the category object to get the ID
    const selectedCategoryObj = categories.find(cat => cat.name === formData.category);
    const categoryId = selectedCategoryObj ? selectedCategoryObj.id : formData.category;

    if (!categoryId) {
      Alert.alert("Error", "Please select a valid category");
      return;
    }

    const itemData: ItemData = {
      id: isEditMode && editItem ? editItem.id : Date.now().toString(),
      name: formData.name.trim(),
      category: categoryId,
      description: formData.description.trim(),
      itemCategory: formData.category,
      price: parseFloat(formData.price),
      availability: formData.availability,
      isDietMeal: formData.dietMeal === "Yes",
      calories: parseInt(formData.calories) || 0,
      image: formData.image || DEFAULT_IMAGE,
      restaurant: isEditMode && editItem ? editItem.restaurant : "Your Restaurant",
      isVegetarian: formData.category.toLowerCase() === "veg",
    };

    if (isEditMode && onUpdate) {
      onUpdate(itemData);
    } else {
      onSave(itemData);
    }
    
    resetForm();
    onDismiss();
  }, [formData, isFormValid, categories, onSave, onUpdate, resetForm, onDismiss, isEditMode, editItem]);

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
              <View style={styles.uploadButton}>
                <Text style={styles.uploadText}>UPLOAD IMAGE</Text>
                <IconButton
                  icon="camera"
                  mode="contained"
                  size={18}
                  style={styles.cameraIconLarge}
                  iconColor="#fff"
                />
              </View>
            </View>
          )}
        </View>
      )}
    </TouchableOpacity>
  ), [formData.image, handleImageUpload]);

  const CategoryMenu = useMemo(() => (
    <Menu
      visible={menuStates.category}
      onDismiss={() => {
        closeMenu("category");
        setCategorySearch("");
      }}
      contentStyle={{ marginTop: -100 }}
      anchor={
        <TouchableOpacity onPress={() => !isViewMode && toggleMenu("category")}>
          <TextInput
            mode="outlined"
            value={formData.category || ""}
            editable={false}
            style={styles.modalInput}
            contentStyle={{ borderRadius: 35 }}
            outlineColor="#e0e0e0"
            activeOutlineColor="#6F32AB"
            right={<TextInput.Icon icon="chevron-down" />}
            textColor={formData.category ? "#333" : "#999"}
          />
        </TouchableOpacity>
      }
    >
      <View style={{ padding: 8, maxHeight: 200 }}>
        <TextInput
          mode="outlined"
          value={categorySearch}
          onChangeText={setCategorySearch}
          placeholder="Search categories..."
          style={{ marginBottom: 8, backgroundColor: '#FDF7F1' }}
          outlineColor="#e0e0e0"
          activeOutlineColor="#6F32AB"
          textColor="#333"
        />
        <ScrollView style={{ maxHeight: 150 }}>
          {filteredCategories.length > 0 ? (
            filteredCategories.map((option: string) => (
              <TouchableOpacity
                key={option}
                onPress={() => {
                  updateFormData("category", option);
                  closeMenu("category");
                  setCategorySearch("");
                }}
                style={{ 
                  padding: 12, 
                  borderBottomWidth: 1, 
                  borderBottomColor: '#e0e0e0' 
                }}
              >
                <Text style={{ color: '#333', fontSize: 16 }}>{option}</Text>
              </TouchableOpacity>
            ))
          ) : (
            <View style={{ padding: 12 }}>
              <Text style={{ color: '#999', fontSize: 16 }}>No categories found</Text>
            </View>
          )}
        </ScrollView>
      </View>
    </Menu>
  ), [menuStates.category, formData.category, filteredCategories, categorySearch, toggleMenu, closeMenu, updateFormData]);

  const AvailabilityMenu = useMemo(() => (
    <Menu
      visible={menuStates.availability}
      onDismiss={() => closeMenu("availability")}
      contentStyle={{ marginTop: -100 }}
      anchor={
        <TouchableOpacity onPress={() => !isViewMode && toggleMenu("availability")}>
          <TextInput
            mode="outlined"
            value={getAvailabilityDisplayText(formData.availability)}
            editable={false}
            style={styles.modalInput}
            contentStyle={{ borderRadius: 35 }}
            right={<TextInput.Icon icon="chevron-down" />}
            outlineColor="#e0e0e0"
            activeOutlineColor="#6F32AB"
            textColor="#333"
          />
        </TouchableOpacity>
      }
    >
      {AVAILABILITY_OPTIONS.map((option) => (
        <Menu.Item
          key={option.value}
          onPress={() => {
            updateFormData("availability", option.value);
            closeMenu("availability");
          }}
          title={option.label}
        />
      ))}
    </Menu>
  ), [menuStates.availability, formData.availability, getAvailabilityDisplayText, toggleMenu, closeMenu, updateFormData]);

  const DietMenu = useMemo(() => (
    <Menu
      visible={menuStates.diet}
      onDismiss={() => closeMenu("diet")}
      contentStyle={{ marginTop: -100 }}
      anchor={
        <TouchableOpacity onPress={() => !isViewMode && toggleMenu("diet")}>
          <TextInput
            mode="outlined"
            value={formData.dietMeal}
            editable={false}
            style={styles.modalInput}
            contentStyle={{ borderRadius: 35 }}
            right={<TextInput.Icon icon="chevron-down" />}
            outlineColor="#e0e0e0"
            activeOutlineColor="#6F32AB"
            textColor="#333"
          />
        </TouchableOpacity>
      }
    >
      {DIET_OPTIONS.map((option) => (
        <Menu.Item
          key={option}
          onPress={() => {
            updateFormData("dietMeal", option);
            closeMenu("diet");
          }}
          title={option}
        />
      ))}
    </Menu>
  ), [menuStates.diet, formData.dietMeal, toggleMenu, closeMenu, updateFormData]);

  const ActionButtons = useMemo(() => (
    !isViewMode ? (
      <View style={styles.modalButtons}>
        <Button
          mode="contained"
          onPress={handleSave}
          style={isFormValid ? styles.saveButtonActive : styles.saveButton}
          buttonColor={isFormValid ? "#6F32AB" : "#ff6b35"}
          textColor="#ffffff"
          loading={isLoading}
          disabled={isLoading || !isFormValid}
        >
{isLoading ? (isEditMode ? "Updating..." : "Creating...") : (isEditMode ? "Update Details" : "Save Details")}
        </Button>
      </View>
    ) : null
  ), [handleSave, isLoading, isFormValid, isViewMode]);

  return (
    <Portal>
      <Modal
        visible={visible}
        onDismiss={onDismiss}
        contentContainerStyle={[styles.modalContainer, { maxHeight: "100%" }]}
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
              <Text style={styles.inputLabel}>ITEM NAME *</Text>
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

            <View style={{ flex: 1 }}>
              <Text style={styles.inputLabel}>ITEM CATEGORY *</Text>
              {categories.length === 0 && (
                <Text style={{ color: '#ff6b35', fontSize: 12, marginBottom: 8 }}>
                  ⚠️ No categories available
                </Text>
              )}
              {CategoryMenu}
            </View>
          </View>

          <View style={styles.fullWidthInput}>
            <Text style={styles.inputLabel}>ITEM DETAILS</Text>
            <TextInput
              mode="outlined"
              value={formData.description}
              onChangeText={(value) => updateFormData("description", value)}
              style={styles.modalInput}
              contentStyle={{ borderRadius: 35 }}
              outlineColor="#e0e0e0"
              activeOutlineColor="#6F32AB"
              textColor="#333"
              editable={!isViewMode}
            />
          </View>

          <View style={styles.rowContainer}>
            <View style={{ flex: 1 }}>
              <Text style={styles.inputLabel}>ITEM PRICE *</Text>
              <TextInput
                mode="outlined"
                value={formData.price}
                onChangeText={(value) => updateFormData("price", value)}
                style={styles.modalInput}
                contentStyle={{ borderRadius: 35 }}
                keyboardType="numeric"
                left={<TextInput.Icon icon="currency-inr" />}
                outlineColor="#e0e0e0"
                activeOutlineColor="#6F32AB"
                textColor="#333"
                editable={!isViewMode}
              />
            </View>

            <View style={{ flex: 1 }}>
              <Text style={styles.inputLabel}>ITEM AVAILABILITY</Text>
              {AvailabilityMenu}
            </View>
          </View>

          <View style={styles.rowContainer}>
            <View style={{ flex: 1 }}>
              <Text style={styles.inputLabel}>DIET MEAL</Text>
              {DietMenu}
            </View>

            <View style={{ flex: 1 }}>
              <Text style={styles.inputLabel}>CAL</Text>
              <TextInput
                mode="outlined"
                value={formData.calories}
                onChangeText={(value) => updateFormData("calories", value)}
                style={styles.modalInput}
                contentStyle={{ borderRadius: 35 }}
                keyboardType="numeric"
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

AddItemModal.displayName = "AddItemModal";

export default AddItemModal;