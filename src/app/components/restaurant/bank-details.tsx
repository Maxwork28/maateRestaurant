import { CITIES, PIN_CODES, STATES } from "@/constant/restaurant/country";
import * as DocumentPicker from 'expo-document-picker';
import * as ImagePicker from 'expo-image-picker';
import React, { useState } from "react";
import { Alert, ScrollView, TouchableOpacity, View } from "react-native";
import {
  Button,
  Divider,
  IconButton,
  Menu,
  Surface,
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
}

const BankDetailsSection: React.FC<BankDetailsSectionProps> = ({ onDataChange, onDocumentsChange }) => {
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

  // Dropdown menu states
  const [cityMenuVisible, setCityMenuVisible] = useState<boolean>(false);
  const [stateMenuVisible, setStateMenuVisible] = useState<boolean>(false);
  const [pinCodeMenuVisible, setPinCodeMenuVisible] = useState<boolean>(false);

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
    const updatedData = {
      ...bankFormData,
      [field]: value,
    };
    setBankFormData(updatedData);
    onDataChange?.(updatedData);
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

  const handleMenuItemPress = (
    field: keyof BankFormData,
    value: string,
    setMenuVisible: (visible: boolean) => void
  ): void => {
    handleBankInputChange(field, value);
    setMenuVisible(false);
  };

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
        setQrImage(qrAsset);
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
        setQrImage(qrAsset);
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
        notifyDocumentsChange(); // Notify parent of document change
      }
    } catch (error) {
      console.log('Document picker error:', error);
      Alert.alert('Error', 'Failed to pick document');
    }
  };

  return (
    <Surface style={styles.surface}>
      {/* QR Code Section */}
      <TouchableOpacity onPress={uploadQRImage}>
        <View style={styles.qrSection}>
          <View style={styles.qrContainer}>
            {qrImage ? (
              <View style={styles.qrImageContainer}>
                <IconButton 
                  icon="check-circle" 
                  size={40} 
                  iconColor="#4CAF50"
                  style={styles.qrIcon}
                />
                <Text style={styles.qrUploadedText}>QR Uploaded</Text>
              </View>
            ) : (
              <View>
                <IconButton 
                  icon="qrcode" 
                  size={40} 
                  iconColor="#ff5722"
                  style={styles.qrIcon}
                />
                <Text style={styles.qrText}>Upload QR</Text>
              </View>
            )}
          </View>
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
              placeholder="123445"
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
              placeholder="XYZ"
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
              placeholder="XYZ"
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

        {/* City, Pin Code, State Row - FIXED FOR iOS */}
        <View style={styles.row}>
          <View style={styles.thirdWidth}>
            <Text style={styles.label}>City</Text>
            <Menu
              visible={cityMenuVisible}
              onDismiss={() => setCityMenuVisible(false)}
              contentStyle={{ maxHeight: 200 }}
              anchor={
                <Button
                  mode="outlined"
                  onPress={() => setCityMenuVisible(true)}
                  style={[getInputStyle("city"), { justifyContent: 'flex-start' }]}
                  labelStyle={{ fontSize: 16, color: bankFormData.city ? '#333' : '#333' }}
                  contentStyle={{ flexDirection: 'row-reverse' }}
                  icon="chevron-down"
                >
                  {bankFormData.city || "city"}
                </Button>
              }
            >
              <ScrollView style={{ maxHeight: 150 }}>
                {CITIES.map((city: string) => (
                  <Menu.Item
                    key={city}
                    onPress={() =>
                      handleMenuItemPress("city", city, setCityMenuVisible)
                    }
                    title={city}
                    titleStyle={{ fontSize: 14 }}
                  />
                ))}
              </ScrollView>
            </Menu>
          </View>

          <View style={styles.thirdWidth}>
            <Text style={styles.label}>Pin Code</Text>
            <Menu
              visible={pinCodeMenuVisible}
              onDismiss={() => setPinCodeMenuVisible(false)}
              contentStyle={{ maxHeight: 200 }}
              anchor={
                <Button
                  mode="outlined"
                  onPress={() => setPinCodeMenuVisible(true)}
                  style={[getInputStyle("pinCode"), { justifyContent: 'flex-start' }]}
                  labelStyle={{ fontSize: 16, color: bankFormData.pinCode ? '#333' : '#333' }}
                  contentStyle={{ flexDirection: 'row-reverse' }}
                  icon="chevron-down"
                >
                  {bankFormData.pinCode || "XXXXXX"}
                </Button>
              }
            >
              <ScrollView style={{ maxHeight: 150 }}>
                {PIN_CODES.map((pin: string) => (
                  <Menu.Item
                    key={pin}
                    onPress={() =>
                      handleMenuItemPress("pinCode", pin, setPinCodeMenuVisible)
                    }
                    title={pin}
                    titleStyle={{ fontSize: 14 }}
                  />
                ))}
              </ScrollView>
            </Menu>
          </View>

          <View style={styles.thirdWidth}>
            <Text style={styles.label}>State</Text>
            <Menu
              visible={stateMenuVisible}
              onDismiss={() => setStateMenuVisible(false)}
              contentStyle={{ maxHeight: 200 }}
              anchor={
                <Button
                  mode="outlined"
                  onPress={() => setStateMenuVisible(true)}
                  style={[getInputStyle("state"), { justifyContent: 'flex-start' }]}
                  labelStyle={{ fontSize: 16, color: bankFormData.state ? '#333' : '#333' }}
                  contentStyle={{ flexDirection: 'row-reverse' }}
                  icon="chevron-down"
                >
                  {bankFormData.state || "state"}
                </Button>
              }
            >
              <ScrollView style={{ maxHeight: 150 }}>
                {STATES.map((state: string) => (
                  <Menu.Item
                    key={state}
                    onPress={() =>
                      handleMenuItemPress("state", state, setStateMenuVisible)
                    }
                    title={state}
                    titleStyle={{ fontSize: 14 }}
                  />
                ))}
              </ScrollView>
            </Menu>
          </View>
        </View>
      </View>
    </Surface>
  );
};

export default BankDetailsSection;