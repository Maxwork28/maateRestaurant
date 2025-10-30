// Removed CITIES, PIN_CODES, STATES imports as we're using text inputs now
import * as DocumentPicker from 'expo-document-picker';
import * as ImagePicker from 'expo-image-picker';
import React, { useState, useEffect } from "react";
import { Alert, Image, Modal, ScrollView, TouchableOpacity, View } from "react-native";
import {
  Button,
  Divider,
  IconButton,
  Text,
  TextInput,
} from "react-native-paper";
import { styles } from "../css/restaurant/restaurantprofile";

// Types
export interface BankFormData {
  bankName: string;
  bankBranch: string;
  accountNumber: string;
  phoneNumber: string;
  customerId: string;
  ifscCode: string;
  accountHolder: string;
  passBook: string;
  aadhaarCard: string;
  panCard: string;
  city: string;
  pinCode: string;
  state: string;
}

interface DocumentAsset {
  uri: string;
  name: string;
  type?: string;
  size?: number;
}

interface BankDetailsSectionProps {
  onDataChange?: (data: BankFormData) => void;
  onDocumentsChange?: (documents: {
    qrImage: DocumentAsset | null;
    aadhaar: DocumentAsset | null;
    pan: DocumentAsset | null;
    passbook: DocumentAsset | null;
  }) => void;
  initialData?: BankFormData;
  existingDocuments?: {
    qrImage: DocumentAsset | null;
    aadhaar: DocumentAsset | null;
    pan: DocumentAsset | null;
    passbook: DocumentAsset | null;
  };
}

const BankDetailsSection: React.FC<BankDetailsSectionProps> = ({ onDataChange, onDocumentsChange, initialData, existingDocuments }) => {
  const [bankFormData, setBankFormData] = useState<BankFormData>({
    bankName: "",
    bankBranch: "",
    accountNumber: "",
    phoneNumber: "",
    customerId: "",
    ifscCode: "",
    accountHolder: "",
    passBook: "",
    aadhaarCard: "",
    panCard: "",
    city: "",
    pinCode: "",
    state: "",
  });

  // Handle initial data when component mounts or initialData changes
  useEffect(() => {
    if (initialData) {
      console.log("🏦 [BANK_DETAILS] Setting initial data:", initialData);
      setBankFormData(initialData);
      
      // Set existing documents from initialData if they exist
      if (initialData.aadhaarCard && initialData.aadhaarCard.startsWith('http')) {
        setDocuments(prev => ({
          ...prev,
          aadhaar: {
            uri: initialData.aadhaarCard,
            name: 'Aadhaar Card',
            type: 'image/jpeg'
          }
        }));
      }
      
      if (initialData.panCard && initialData.panCard.startsWith('http')) {
        setDocuments(prev => ({
          ...prev,
          pan: {
            uri: initialData.panCard,
            name: 'PAN Card',
            type: 'image/jpeg'
          }
        }));
      }
      
      if (initialData.passBook && initialData.passBook.startsWith('http')) {
        setDocuments(prev => ({
          ...prev,
          passbook: {
            uri: initialData.passBook,
            name: 'Passbook',
            type: 'image/jpeg'
          }
        }));
      }
      
      // Handle QR code if it exists in initialData
      // Note: QR code might be stored in a different field name in the backend
      // You may need to adjust this based on your actual backend structure
      
      console.log("🏦 [BANK_DETAILS] Existing documents loaded from initialData");
    } else {
      console.log("🏦 [BANK_DETAILS] No initial data provided, using empty form");
    }
  }, [initialData]);

  // Handle existing documents from parent component
  useEffect(() => {
    if (existingDocuments) {
      console.log("🏦 [BANK_DETAILS] Setting existing documents from parent:", existingDocuments);
      
      if (existingDocuments.aadhaar) {
        setDocuments(prev => ({
          ...prev,
          aadhaar: existingDocuments.aadhaar
        }));
      }
      
      if (existingDocuments.pan) {
        setDocuments(prev => ({
          ...prev,
          pan: existingDocuments.pan
        }));
      }
      
      if (existingDocuments.passbook) {
        setDocuments(prev => ({
          ...prev,
          passbook: existingDocuments.passbook
        }));
      }
      
      if (existingDocuments.qrImage) {
        setQrImage(existingDocuments.qrImage);
      }
      
      console.log("🏦 [BANK_DETAILS] Existing documents loaded from parent");
    }
  }, [existingDocuments]);

  // Log when component renders
  useEffect(() => {
    console.log("🏦 [BANK_DETAILS] Component rendered with bankFormData:", bankFormData);
  }, [bankFormData]);

  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [documents, setDocuments] = useState<{
    aadhaar: DocumentAsset | null;
    pan: DocumentAsset | null;
    passbook: DocumentAsset | null;
  }>({
    aadhaar: null,
    pan: null,
    passbook: null,
  });

  const [qrImage, setQrImage] = useState<DocumentAsset | null>(null);
  const [selectedImage, setSelectedImage] = useState<DocumentAsset | null>(null);
  const [imageModalVisible, setImageModalVisible] = useState(false);

  // Menu states removed as we're using text inputs now

  // Function to notify parent of document changes
  const notifyDocumentsChange = () => {
    onDocumentsChange?.({
      qrImage,
      aadhaar: documents.aadhaar,
      pan: documents.pan,
      passbook: documents.passbook,
    });
  };

  const handleBankInputChange = (
    field: keyof BankFormData,
    value: string
  ): void => {
    console.log("🏦 [BANK_DETAILS] Input changed:", { field, value, currentData: bankFormData });
    const updatedData = {
      ...bankFormData,
      [field]: value,
    };
    setBankFormData(updatedData);
    onDataChange?.(updatedData);

    // Auto-fill city and state when pin code is entered
    if (field === "pinCode" && value.length === 6) {
      handleBankPinCodeLookup(value);
    }
  };

  const handleBankPinCodeLookup = async (pinCode: string): Promise<void> => {
    try {
      console.log("🔍 [BANK_DETAILS] Looking up pin code:", pinCode);
      
      // Try Postal PIN Code API first (official and reliable)
      const response = await fetch(`https://api.postalpincode.in/pincode/${pinCode}`);
      console.log("📡 [BANK_DETAILS] Postal PIN Code API response status:", response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log("✅ [BANK_DETAILS] Postal PIN Code API response:", data);
        
        // Handle array response format
        const responseData = Array.isArray(data) ? data[0] : data;
        console.log("📋 [BANK_DETAILS] Processed response data:", responseData);
        
        if (responseData.Status === "Success" && responseData.PostOffice && responseData.PostOffice.length > 0) {
          const postOffice = responseData.PostOffice[0]; // Use first post office data
          const updatedData = {
            ...bankFormData,
            city: postOffice.District || postOffice.Circle,
            state: postOffice.State,
          };
          setBankFormData(updatedData);
          onDataChange?.(updatedData);
          console.log("📍 [BANK_DETAILS] Auto-filled city and state:", { 
            city: postOffice.District || postOffice.Circle, 
            state: postOffice.State 
          });
        } else {
          console.log("⚠️ [BANK_DETAILS] Postal PIN Code API response missing data or error:", responseData.Message);
          await tryBankAlternativePinCodeAPI(pinCode);
        }
      } else {
        console.log("⚠️ [BANK_DETAILS] Postal PIN Code API failed with status:", response.status);
        // Fallback to alternative API
        await tryBankAlternativePinCodeAPI(pinCode);
      }
    } catch (error) {
      console.log("❌ [BANK_DETAILS] Postal PIN Code API error:", error);
      // Try alternative API
      await tryBankAlternativePinCodeAPI(pinCode);
    }
  };

  const tryBankAlternativePinCodeAPI = async (pinCode: string): Promise<void> => {
    try {
      console.log("🔄 [BANK_DETAILS] Trying alternative pin code API...");
      const response = await fetch(`https://indianpincodes.co.in/api/pincode/${pinCode}`);
      
      if (response.ok) {
        const data = await response.json();
        console.log("✅ [BANK_DETAILS] Alternative API successful:", data);
        
        if (data.state && data.city) {
          const updatedData = {
            ...bankFormData,
            city: data.city,
            state: data.state,
          };
          setBankFormData(updatedData);
          onDataChange?.(updatedData);
          console.log("📍 [BANK_DETAILS] Auto-filled from alternative API:", { city: data.city, state: data.state });
        }
      }
    } catch (error) {
      console.log("❌ [BANK_DETAILS] Alternative pin code API also failed:", error);
    }
  };

  const handleFocus = (fieldName: string): void => {
    setFocusedField(fieldName);
  };

  const handleBlur = (): void => {
    setFocusedField(null);
  };

  const getInputStyle = (fieldName: string) => {
    return [styles.input, focusedField === fieldName && styles.focusedInput];
  };

  const getOutlineStyle = (fieldName: string) => {
    return focusedField === fieldName
      ? styles.focusedOutline
      : styles.inputOutline;
  };

  const openImageModal = (image: DocumentAsset) => {
    console.log("🏦 [BANK_DETAILS] Opening image modal for:", image);
    setSelectedImage(image);
    setImageModalVisible(true);
  };

  const closeImageModal = () => {
    console.log("🏦 [BANK_DETAILS] Closing image modal");
    setSelectedImage(null);
    setImageModalVisible(false);
  };

  // handleMenuItemPress function removed as we're using text inputs now

  const uploadQRImage = (): void => {
    Alert.alert(
      'Upload QR Code',
      'Choose an option',
      [
        { text: 'Camera', onPress: () => openQRCamera() },
        { text: 'Gallery', onPress: () => openQRGallery() },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  const openQRCamera = async (): Promise<void> => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Sorry, we need camera permissions to make this work!');
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });

      if (!result.canceled && result.assets && result.assets[0]) {
        const qrAsset: DocumentAsset = {
          uri: result.assets[0].uri,
          name: `qr_code_${Date.now()}.jpg`,
          type: 'image/jpeg',
        };
        // Replace old QR image with new one
        setQrImage(qrAsset);
        console.log('🔄 [BANK_DETAILS] Replaced QR image from camera:', qrAsset.name);
        notifyDocumentsChange(); // Notify parent of QR image change
      }
    } catch (error) {
      console.log('QR Camera error:', error);
      Alert.alert('Error', 'Failed to open camera');
    }
  };

  const openQRGallery = async (): Promise<void> => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Sorry, we need gallery permissions to make this work!');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });

      if (!result.canceled && result.assets && result.assets[0]) {
        const qrAsset: DocumentAsset = {
          uri: result.assets[0].uri,
          name: result.assets[0].fileName || `qr_code_${Date.now()}.jpg`,
          type: 'image/jpeg',
        };
        // Replace old QR image with new one
        setQrImage(qrAsset);
        console.log('🔄 [BANK_DETAILS] Replaced QR image from gallery:', qrAsset.name);
        notifyDocumentsChange(); // Notify parent of QR image change
      }
    } catch (error) {
      console.log('QR Gallery error:', error);
      Alert.alert('Error', 'Failed to open gallery');
    }
  };

  const pickDocument = async (type: 'aadhaar' | 'pan' | 'passbook'): Promise<void> => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['image/*', 'application/pdf'],
        copyToCacheDirectory: true,
      });

      if (!result.canceled && result.assets && result.assets[0]) {
        const document: DocumentAsset = {
          uri: result.assets[0].uri,
          name: result.assets[0].name,
          type: result.assets[0].mimeType || 'application/pdf',
          size: result.assets[0].size,
        };

        // Replace old document with new one
        setDocuments(prev => ({
          ...prev,
          [type]: document,
        }));

        // Update form data with document name
        const fieldMap = {
          aadhaar: 'aadhaarCard',
          pan: 'panCard',
          passbook: 'passBook',
        };
        handleBankInputChange(fieldMap[type] as keyof BankFormData, document.name);
        
        console.log(`🔄 [BANK_DETAILS] Replaced ${type} document:`, document.name);
        notifyDocumentsChange(); // Notify parent of document change
      }
    } catch (error) {
      console.log('Document picker error:', error);
      Alert.alert('Error', 'Failed to pick document');
    }
  };

  const removeDocument = (type: 'aadhaar' | 'pan' | 'passbook'): void => {
    setDocuments(prev => ({
      ...prev,
      [type]: null,
    }));

    // Clear form data for the removed document
    const fieldMap = {
      aadhaar: 'aadhaarCard',
      pan: 'panCard',
      passbook: 'passBook',
    };
    handleBankInputChange(fieldMap[type] as keyof BankFormData, '');
    
    console.log(`🗑️ [BANK_DETAILS] Removed ${type} document`);
    notifyDocumentsChange();
  };

  // Check if there are any existing images to display
  const hasExistingImages = () => {
    return qrImage || documents.aadhaar || documents.pan || documents.passbook;
  };

  return (
    <View style={styles.surface}>
      {/* QR Code Section */}
      <TouchableOpacity onPress={uploadQRImage}>
        <View style={styles.qrSection}>
          <View style={styles.qrContainer}>
            {qrImage ? (
              <IconButton 
                icon="check-circle" 
                size={40} 
                iconColor="#4CAF50"
                style={styles.qrIcon}
              />
            ) : (
              <IconButton 
                icon="qrcode" 
                size={40} 
                iconColor="#ff5722"
                style={styles.qrIcon}
              />
            )}
          </View>
          <Text style={styles.qrText}>Upload QR</Text>
        </View>
      </TouchableOpacity>

      <Divider style={styles.divider} />

      {/* Bank Details Form */}
      <View style={styles.formContainer}>
        <Text style={styles.sectionTitle}>Bank Details</Text>

        {/* Bank Name and Branch Row */}
        <View style={styles.row}>
          <View style={styles.halfWidth}>
            <Text style={styles.label}>Bank Name *</Text>
            <TextInput
              value={bankFormData.bankName}
              onChangeText={(text: string) =>
                handleBankInputChange("bankName", text)
              }
              onFocus={() => handleFocus("bankName")}
              onBlur={handleBlur}
              mode="outlined"
              style={getInputStyle("bankName")}
              outlineStyle={getOutlineStyle("bankName")}
              placeholder=""
              textColor="#333"

            />
          </View>
          <View style={styles.halfWidth}>
            <Text style={styles.label}>Bank Branch</Text>
            <TextInput
              value={bankFormData.bankBranch}
              onChangeText={(text: string) =>
                handleBankInputChange("bankBranch", text)
              }
              onFocus={() => handleFocus("bankBranch")}
              onBlur={handleBlur}
              mode="outlined"
              style={getInputStyle("bankBranch")}
              outlineStyle={getOutlineStyle("bankBranch")}
              placeholder=""
              textColor="#333"
            />
          </View>
        </View>

        {/* Account Number and Phone Row */}
        <View style={styles.row}>
          <View style={styles.halfWidth}>
            <Text style={styles.label}>Account Number *</Text>
            <TextInput
              value={bankFormData.accountNumber}
              onChangeText={(text: string) =>
                handleBankInputChange("accountNumber", text)
              }
              onFocus={() => handleFocus("accountNumber")}
              onBlur={handleBlur}
              mode="outlined"
              keyboardType="numeric"
              style={getInputStyle("accountNumber")}
              outlineStyle={getOutlineStyle("accountNumber")}
              textColor="#333" 
            />
          </View>
          <View style={styles.halfWidth}>
            <Text style={styles.label}>Phone Number</Text>
            <TextInput
              value={bankFormData.phoneNumber}
              onChangeText={(text: string) =>
                handleBankInputChange("phoneNumber", text)
              }
              onFocus={() => handleFocus("phoneNumber")}
              onBlur={handleBlur}
              mode="outlined"
              keyboardType="phone-pad"
              style={getInputStyle("phoneNumber")}
              outlineStyle={getOutlineStyle("phoneNumber")}
              textColor="#333"
            />
          </View>
        </View>

        {/* Customer ID and IFSC Code Row */}
        <View style={styles.row}>
          <View style={styles.halfWidth}>
            <Text style={styles.label}>Customer ID</Text>
            <TextInput
              value={bankFormData.customerId}
              onChangeText={(text: string) =>
                handleBankInputChange("customerId", text)
              }
              onFocus={() => handleFocus("customerId")}
              onBlur={handleBlur}
              mode="outlined"
              style={getInputStyle("customerId")}
              outlineStyle={getOutlineStyle("customerId")}
              textColor="#333"
            />
          </View>
          <View style={styles.halfWidth}>
            <Text style={styles.label}>IFSC Code *</Text>
            <TextInput
              value={bankFormData.ifscCode}
              onChangeText={(text: string) =>
                handleBankInputChange("ifscCode", text)
              }
              onFocus={() => handleFocus("ifscCode")}
              onBlur={handleBlur}
              mode="outlined"
              style={getInputStyle("ifscCode")}
              outlineStyle={getOutlineStyle("ifscCode")}
              placeholder=""
               textColor="#333"
            />
          </View>
        </View>

        {/* Account Holder and Pass Book Row */}
        <View style={styles.row}>
          <View style={styles.halfWidth}>
            <Text style={styles.label}>Account Holder *</Text>
            <TextInput
              value={bankFormData.accountHolder}
              onChangeText={(text: string) =>
                handleBankInputChange("accountHolder", text)
              }
              onFocus={() => handleFocus("accountHolder")}
              onBlur={handleBlur}
              mode="outlined"
              style={getInputStyle("accountHolder")}
              outlineStyle={getOutlineStyle("accountHolder")}
               textColor="#333"
            />
          </View>
          <View style={styles.halfWidth}>
            <Text style={styles.label}>Pass Book</Text>
            <Button
              mode="outlined"
              onPress={() => pickDocument('passbook')}
              style={styles.uploadButton}
              labelStyle={styles.uploadButtonText}
            >
              {documents.passbook ? documents.passbook.name : "Choose File"}
            </Button>
          </View>
        </View>

        {/* Document Upload Row */}
        <View style={styles.row}>
          <View style={styles.halfWidth}>
            <Text style={styles.label}>Upload Aadhar Card</Text>
            <Button
              mode="outlined"
              onPress={() => pickDocument('aadhaar')}
              style={styles.uploadButton}
              labelStyle={styles.uploadButtonText}
            >
              {documents.aadhaar ? documents.aadhaar.name : "Choose File"}
            </Button>
          </View>
          <View style={styles.halfWidth}>
            <Text style={styles.label}>Upload PAN Card</Text>
            <Button
              mode="outlined"
              onPress={() => pickDocument('pan')}
              style={styles.uploadButton}
              labelStyle={styles.uploadButtonText}
            >
              {documents.pan ? documents.pan.name : "Choose File"}
            </Button>
          </View>
        </View>

        {/* Pin Code and City Row */}
        <View style={styles.row}>
          <View style={styles.halfWidth}>
            <Text style={styles.label}>Pin Code</Text>
            <TextInput
              value={bankFormData.pinCode}
              onChangeText={(text: string) => handleBankInputChange("pinCode", text)}
              onFocus={() => handleFocus("pinCode")}
              onBlur={handleBlur}
              mode="outlined"
              keyboardType="numeric"
              maxLength={6}
              style={getInputStyle("pinCode")}
              outlineStyle={getOutlineStyle("pinCode")}
              placeholder=""
              textColor="#333"
            />
          </View>

          <View style={styles.halfWidth}>
            <Text style={styles.label}>City</Text>
            <TextInput
              value={bankFormData.city}
              onChangeText={(text: string) => handleBankInputChange("city", text)}
              onFocus={() => handleFocus("city")}
              onBlur={handleBlur}
              mode="outlined"
              style={getInputStyle("city")}
              outlineStyle={getOutlineStyle("city")}
              placeholder=""
              textColor="#333"
            />
          </View>
        </View>

        {/* State Row - Single */}
        <View style={styles.fullWidth}>
          <Text style={styles.label}>State</Text>
          <TextInput
            value={bankFormData.state}
            onChangeText={(text: string) => handleBankInputChange("state", text)}
            onFocus={() => handleFocus("state")}
            onBlur={handleBlur}
            mode="outlined"
            style={getInputStyle("state")}
            outlineStyle={getOutlineStyle("state")}
            placeholder=""
            textColor="#333"
          />
        </View>

        {/* Image Display Section */}
        {hasExistingImages() && (
          <View style={styles.fullWidth}>
            <Text style={styles.label}>Uploaded Documents</Text>
            <View style={styles.imageRow}>
              {qrImage && (
                <View style={styles.imageContainer}>
                  <TouchableOpacity onPress={() => openImageModal(qrImage)}>
                    <Image source={{ uri: qrImage.uri }} style={styles.thumbnail} />
                  </TouchableOpacity>
                  <Text style={styles.imageIndex}>QR Code</Text>
                  <TouchableOpacity 
                    style={styles.removeButton}
                    onPress={() => {
                      Alert.alert(
                        'Remove QR Code',
                        'Are you sure you want to remove this QR code?',
                        [
                          { text: 'Cancel', style: 'cancel' },
                          { text: 'Remove', style: 'destructive', onPress: () => setQrImage(null) }
                        ]
                      );
                    }}
                  >
                    <Text style={styles.removeButtonText}>Remove</Text>
                  </TouchableOpacity>
                </View>
              )}
              {documents.aadhaar && (
                <View style={styles.imageContainer}>
                  <TouchableOpacity onPress={() => documents.aadhaar && openImageModal(documents.aadhaar)}>
                    <Image source={{ uri: documents.aadhaar.uri }} style={styles.thumbnail} />
                  </TouchableOpacity>
                  <Text style={styles.imageIndex}>Aadhaar</Text>
                  <TouchableOpacity 
                    style={styles.removeButton}
                    onPress={() => removeDocument('aadhaar')}
                  >
                    <Text style={styles.removeButtonText}>Remove</Text>
                  </TouchableOpacity>
                </View>
              )}
              {documents.pan && (
                <View style={styles.imageContainer}>
                  <TouchableOpacity onPress={() => documents.pan && openImageModal(documents.pan)}>
                    <Image source={{ uri: documents.pan.uri }} style={styles.thumbnail} />
                  </TouchableOpacity>
                  <Text style={styles.imageIndex}>PAN Card</Text>
                  <TouchableOpacity 
                    style={styles.removeButton}
                    onPress={() => removeDocument('pan')}
                  >
                    <Text style={styles.removeButtonText}>Remove</Text>
                  </TouchableOpacity>
                </View>
              )}
              {documents.passbook && (
                <View style={styles.imageContainer}>
                  <TouchableOpacity onPress={() => documents.passbook && openImageModal(documents.passbook)}>
                    <Image source={{ uri: documents.passbook.uri }} style={styles.thumbnail} />
                  </TouchableOpacity>
                  <Text style={styles.imageIndex}>Passbook</Text>
                  <TouchableOpacity 
                    style={styles.removeButton}
                    onPress={() => removeDocument('passbook')}
                  >
                    <Text style={styles.removeButtonText}>Remove</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
            

          </View>
        )}

        {/* Image Modal */}
        <Modal
          visible={imageModalVisible}
          transparent={true}
          animationType="fade"
          onRequestClose={closeImageModal}
        >
          <View style={styles.imageModalOverlay}>
            <View style={styles.imageModalContainer}>
              {selectedImage && (
                <Image
                  source={{ uri: selectedImage.uri }}
                  style={styles.fullImage}
                  resizeMode="contain"
                />
              )}
              <IconButton
                icon="close"
                size={30}
                style={styles.closeImageModalButton}
                iconColor="#fff"
                onPress={closeImageModal}
              />
            </View>
          </View>
        </Modal>
      </View>
    </View>
  );
};

export default BankDetailsSection;