import * as ImagePicker from "expo-image-picker";
import React, { useState, useCallback, useMemo } from "react";
import { Alert, Image, Text, TouchableOpacity, View, ScrollView } from "react-native";
import {
  Button,
  IconButton,
  Modal,
  Portal,
  SegmentedButtons,
  TextInput,
  Chip,
} from "react-native-paper";
import { Ionicons } from "@expo/vector-icons";
import { styles } from "../css/restaurant/addoffermodal";

// Types
interface OfferData {
  id: string;
  title: string;
  description: string;
  image: string;
  discountType: 'percentage' | 'flat';
  discountValue: string;
  minOrderValue: string;
  maxDiscountAmount: string;
  usageLimit: string;
  usagePerUser: string;
  validFrom: string;
  validTo: string;
  isActive: boolean;
  applicableCategories: string[];
  applicableItems: string[];
  termsAndConditions: string;
}

interface AddOfferModalProps {
  visible: boolean;
  onDismiss: () => void;
  onSave: (offerData: OfferData) => void;
  onUpdate?: (offerData: OfferData) => void;
  isLoading?: boolean;
  editOffer?: OfferData | null;
  isEditMode?: boolean;
  isViewMode?: boolean;
}

// Constants
const DEFAULT_IMAGE = "https://cdn-icons-png.flaticon.com/512/1040/1040230.png";
const IMAGE_PICKER_OPTIONS = {
  mediaTypes: ImagePicker.MediaTypeOptions.Images,
  allowsEditing: true,
  quality: 0.7,
};

const AddOfferModal: React.FC<AddOfferModalProps> = React.memo(({ 
  visible, 
  onDismiss, 
  onSave, 
  onUpdate,
  isLoading = false,
  editOffer = null,
  isEditMode = false,
  isViewMode = false
}) => {
  const [activeTab, setActiveTab] = useState<'basic' | 'discount' | 'usage' | 'terms'>('basic');
  
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    image: "",
    discountType: 'percentage' as 'percentage' | 'flat',
    discountValue: "",
    minOrderValue: "",
    maxDiscountAmount: "",
    usageLimit: "",
    usagePerUser: "1",
    validFrom: "",
    validTo: "",
    isActive: true,
    applicableCategories: [] as string[],
    applicableItems: [] as string[],
    termsAndConditions: "",
  });

  // Reset form when modal opens or populate for edit/view
  React.useEffect(() => {
    if (visible) {
      if ((isEditMode || isViewMode) && editOffer) {
        // Populate form with edit/view offer data
        setFormData({
          title: editOffer.title || "",
          description: editOffer.description || "",
          image: editOffer.image || "",
          discountType: editOffer.discountType || 'percentage',
          discountValue: editOffer.discountValue || "",
          minOrderValue: editOffer.minOrderValue || "",
          maxDiscountAmount: editOffer.maxDiscountAmount || "",
          usageLimit: editOffer.usageLimit || "",
          usagePerUser: editOffer.usagePerUser || "1",
          validFrom: editOffer.validFrom || "",
          validTo: editOffer.validTo || "",
          isActive: editOffer.isActive !== false,
          applicableCategories: editOffer.applicableCategories || [],
          applicableItems: editOffer.applicableItems || [],
          termsAndConditions: editOffer.termsAndConditions || "",
        });
      } else {
        // Reset form for new offer
      setFormData({
        title: "",
          description: "",
        image: "",
          discountType: 'percentage',
          discountValue: "",
          minOrderValue: "",
          maxDiscountAmount: "",
          usageLimit: "",
          usagePerUser: "1",
          validFrom: "",
          validTo: "",
          isActive: true,
          applicableCategories: [],
          applicableItems: [],
          termsAndConditions: "",
        });
      }
    }
  }, [visible, isEditMode, isViewMode, editOffer]);

  // Permission handling
  const requestPermissions = useCallback(async (): Promise<boolean> => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permission required",
        "Enable gallery access to upload image"
      );
      return false;
    }
    return true;
  }, []);

  // Image picker handler
  const handleImageUpload = useCallback(async () => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) return;

    const result = await ImagePicker.launchImageLibraryAsync(IMAGE_PICKER_OPTIONS);
    if (!result.canceled && result.assets[0]) {
      setFormData(prev => ({ ...prev, image: result.assets[0].uri }));
    }
  }, [requestPermissions]);

  // Form handlers
  const updateFormData = useCallback((field: keyof typeof formData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  }, []);

  const resetForm = useCallback(() => {
    setFormData({
      title: "",
      description: "",
      image: "",
      discountType: 'percentage',
      discountValue: "",
      minOrderValue: "",
      maxDiscountAmount: "",
      usageLimit: "",
      usagePerUser: "1",
      validFrom: "",
      validTo: "",
      isActive: true,
      applicableCategories: [],
      applicableItems: [],
      termsAndConditions: "",
    });
  }, []);

  // Validation
  const isFormValid = useMemo(() => {
    return formData.title.trim() && 
           formData.discountValue.trim() && 
           formData.validFrom.trim() && 
           formData.validTo.trim() &&
           formData.minOrderValue.trim();
  }, [formData]);

  const handleSave = useCallback(() => {
    if (!isFormValid) {
      Alert.alert("Missing Info", "Please fill all required fields");
      return;
    }

    const offerData: OfferData = {
      id: isEditMode && editOffer ? editOffer.id : Date.now().toString(),
      title: formData.title.trim(),
      description: formData.description.trim(),
      image: formData.image || DEFAULT_IMAGE,
      discountType: formData.discountType,
      discountValue: formData.discountValue.trim(),
      minOrderValue: formData.minOrderValue.trim(),
      maxDiscountAmount: formData.maxDiscountAmount.trim(),
      usageLimit: formData.usageLimit.trim(),
      usagePerUser: formData.usagePerUser.trim(),
      validFrom: formData.validFrom.trim(),
      validTo: formData.validTo.trim(),
      isActive: formData.isActive,
      applicableCategories: formData.applicableCategories,
      applicableItems: formData.applicableItems,
      termsAndConditions: formData.termsAndConditions.trim(),
    };

    if (isEditMode && onUpdate) {
      onUpdate(offerData);
    } else {
    onSave(offerData);
    }
    resetForm();
    onDismiss();
  }, [formData, isFormValid, onSave, onUpdate, resetForm, onDismiss, isEditMode, editOffer]);

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
          {!isViewMode && (
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
          )}
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

  // Tab Navigation Component
  const TabNavigation = useMemo(() => (
    <View style={styles.tabContainer}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tabScrollView}>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'basic' && styles.activeTab]}
          onPress={() => setActiveTab('basic')}
        >
          <Text style={[styles.tabText, activeTab === 'basic' && styles.activeTabText]}>
            Basic Info
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'discount' && styles.activeTab]}
          onPress={() => setActiveTab('discount')}
        >
          <Text style={[styles.tabText, activeTab === 'discount' && styles.activeTabText]}>
            Discount
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'usage' && styles.activeTab]}
          onPress={() => setActiveTab('usage')}
        >
          <Text style={[styles.tabText, activeTab === 'usage' && styles.activeTabText]}>
            Usage & Validity
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'terms' && styles.activeTab]}
          onPress={() => setActiveTab('terms')}
        >
          <Text style={[styles.tabText, activeTab === 'terms' && styles.activeTabText]}>
            Terms
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  ), [activeTab]);

  const ActionButtons = useMemo(() => (
    !isViewMode ? (
    <View style={styles.modalButtons}>
      <Button
        mode="contained"
        onPress={handleSave}
          style={isFormValid ? styles.saveButtonActive : styles.saveButton}
          buttonColor="#6F32AB"
        textColor="#ffffff"
        loading={isLoading}
        disabled={isLoading || !isFormValid}
      >
          {isLoading 
            ? (isEditMode ? "Updating..." : "Creating...") 
            : (isEditMode ? "Update Offer" : "Save Offer")
          }
      </Button>
    </View>
    ) : null
  ), [handleSave, isLoading, isFormValid, isViewMode, isEditMode]);

  // Tab Content Components
  const BasicInfoTab = useMemo(() => (
    <ScrollView 
      style={styles.tabContent} 
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ flexGrow: 1 }}
    >
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
          <Text style={styles.inputLabel}>OFFER TITLE *</Text>
          <TextInput
            mode="outlined"
            value={formData.title}
            onChangeText={(value) => updateFormData("title", value)}
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
          <Text style={styles.inputLabel}>OFFER DESCRIPTION</Text>
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
    </ScrollView>
  ), [formData.title, formData.description, formData.image, ImageUploadSection, handleCancel, updateFormData, isViewMode]);

  const DiscountTab = useMemo(() => (
    <ScrollView 
      style={styles.tabContent} 
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ flexGrow: 1 }}
    >
      <View style={styles.rowContainer}>
        <View style={{ flex: 1 }}>
          <Text style={styles.inputLabel}>DISCOUNT TYPE *</Text>
          <SegmentedButtons
            value={formData.discountType}
            onValueChange={(value) => setFormData(prev => ({ ...prev, discountType: value as 'percentage' | 'flat' }))}
            buttons={[
              { value: 'percentage', label: 'Percentage' },
              { value: 'flat', label: 'Flat Amount' }
            ]}
            style={{ marginBottom: 8 }}
            disabled={isViewMode}
          />
        </View>
      </View>

      <View style={styles.rowContainer}>
        <View style={{ flex: 1 }}>
          <Text style={styles.inputLabel}>
            DISCOUNT VALUE * {formData.discountType === 'percentage' ? '(%)' : '(₹)'}
          </Text>
          <TextInput
            mode="outlined"
            value={formData.discountValue}
            onChangeText={(value) => updateFormData("discountValue", value)}
            keyboardType="numeric"
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
          <Text style={styles.inputLabel}>MINIMUM ORDER VALUE (₹) *</Text>
          <TextInput
            mode="outlined"
            value={formData.minOrderValue}
            onChangeText={(value) => updateFormData("minOrderValue", value)}
            keyboardType="numeric"
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
          <Text style={styles.inputLabel}>MAX DISCOUNT AMOUNT (₹)</Text>
          <TextInput
            mode="outlined"
            value={formData.maxDiscountAmount}
            onChangeText={(value) => updateFormData("maxDiscountAmount", value)}
            keyboardType="numeric"
            style={styles.modalInput}
            contentStyle={{ borderRadius: 35 }}
            outlineColor="#e0e0e0"
            activeOutlineColor="#6F32AB"
            textColor="#333"
            editable={!isViewMode}
          />
        </View>
      </View>
    </ScrollView>
  ), [formData.discountType, formData.discountValue, formData.minOrderValue, formData.maxDiscountAmount, updateFormData, isViewMode]);

  const UsageValidityTab = useMemo(() => (
    <ScrollView 
      style={styles.tabContent} 
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ flexGrow: 1 }}
    >
      <View style={styles.rowContainer}>
        <View style={{ flex: 1 }}>
          <Text style={styles.inputLabel}>USAGE LIMIT (Total)</Text>
          <TextInput
            mode="outlined"
            value={formData.usageLimit}
            onChangeText={(value) => updateFormData("usageLimit", value)}
            keyboardType="numeric"
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
          <Text style={styles.inputLabel}>USAGE PER USER *</Text>
          <TextInput
            mode="outlined"
            value={formData.usagePerUser}
            onChangeText={(value) => updateFormData("usagePerUser", value)}
            keyboardType="numeric"
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
          <Text style={styles.inputLabel}>VALID FROM (YYYY-MM-DD) *</Text>
          <TextInput
            mode="outlined"
            value={formData.validFrom}
            onChangeText={(value) => updateFormData("validFrom", value)}
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
          <Text style={styles.inputLabel}>VALID TO (YYYY-MM-DD) *</Text>
          <TextInput
            mode="outlined"
            value={formData.validTo}
            onChangeText={(value) => updateFormData("validTo", value)}
            style={styles.modalInput}
            contentStyle={{ borderRadius: 35 }}
            outlineColor="#e0e0e0"
            activeOutlineColor="#6F32AB"
            textColor="#333"
            editable={!isViewMode}
          />
        </View>
      </View>
    </ScrollView>
  ), [formData.usageLimit, formData.usagePerUser, formData.validFrom, formData.validTo, updateFormData, isViewMode]);

  const TermsTab = useMemo(() => (
    <ScrollView 
      style={styles.tabContent} 
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ flexGrow: 1 }}
    >
      <View style={styles.rowContainer}>
        <View style={{ flex: 1 }}>
          <Text style={styles.inputLabel}>TERMS & CONDITIONS</Text>
          <TextInput
            mode="outlined"
            value={formData.termsAndConditions}
            onChangeText={(value) => updateFormData("termsAndConditions", value)}
            style={styles.modalInputMultiline}
            contentStyle={{ borderRadius: 30 }}
            multiline
            numberOfLines={8}
            outlineColor="#e0e0e0"
            activeOutlineColor="#6F32AB"
            textColor="#333"
            editable={!isViewMode}
          />
        </View>
      </View>
    </ScrollView>
  ), [formData.termsAndConditions, updateFormData, isViewMode]);

  const renderTabContent = () => {
    switch (activeTab) {
      case 'basic':
        return BasicInfoTab;
      case 'discount':
        return DiscountTab;
      case 'usage':
        return UsageValidityTab;
      case 'terms':
        return TermsTab;
      default:
        return BasicInfoTab;
    }
  };

  return (
    <Portal>
      <Modal
        visible={visible}
        onDismiss={onDismiss}
        contentContainerStyle={styles.modalContainer}
      >
        <View style={{ flex: 1 }}>
          {TabNavigation}
          <View style={{ flex: 1 }}>
            {renderTabContent()}
          </View>
        {ActionButtons}
        </View>
      </Modal>
    </Portal>
  );
});

AddOfferModal.displayName = "AddOfferModal";

export default AddOfferModal;