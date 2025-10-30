/* eslint-disable react/display-name */
// Removed CITIES, PIN_CODES, STATES imports as we're using text inputs now
import { useRouter } from "expo-router";
import DateTimePicker from "@react-native-community/datetimepicker";
import * as ImagePicker from "expo-image-picker";
import React, { useState, useEffect } from "react";
import {
  Alert,
  Image,
  Modal,
  Platform,
  ScrollView,
  TouchableOpacity,
  View,
} from "react-native";
import {
  Avatar,
  Button,
  Divider,
  IconButton,
  RadioButton,
  Text,
  TextInput,
} from "react-native-paper";
import { styles } from "../css/restaurant/restaurantprofile";
import BankDetailsSection, { BankFormData } from "./bank-details";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import { updateUserProfile, setLoading, setError, clearError } from "../../../store/slices/authSlice";
import { apiConnector } from "../../../utils";
import { API_URLS } from "../../../services/apiConfig";
import { useOrder } from "../../hooks/useOrder";

// Types
interface FormData {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  dateOfBirth: Date;
  businessName: string;
  email: string;
  address: string;
  city: string;
  pinCode: string;
  state: string;
  category: string;
  specialization: string;
  fssaiNumber: string;
}

interface ImageAsset {
  uri: string;
  type?: string;
  fileName?: string;
  fileSize?: number;
}

// MenuDropdown component removed as we're using text inputs now

const RestaurantProfile: React.FC = () => {
  console.log("🔄 [PROFILE_COMPONENT] Component rendering...");
  
  // ALL HOOKS MUST BE CALLED FIRST - before any conditional logic
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { user, token, isLoading: authLoading } = useAppSelector((state) => state.auth);
  const { setTooltipEnabled } = useOrder();
  
  // Initialize all state hooks first
  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    phoneNumber: "",
    dateOfBirth: new Date(1900, 0, 0), // Default date that displays as "0/00/0000"
    businessName: "",
    email: "",
    address: "",
    city: "",
    pinCode: "",
    state: "",
    category: "Veg",
    specialization: "",
    fssaiNumber: "",
  });

  const [showDatePicker, setShowDatePicker] = useState<boolean>(false);
  const [tempDate, setTempDate] = useState<Date>(new Date());
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [profileImage, setProfileImage] = useState<ImageAsset | null>(null);
  const [messImages, setMessImages] = useState<ImageAsset[]>([]);
  const [bankData, setBankData] = useState<BankFormData | null>(null);
  const [bankDocuments, setBankDocuments] = useState<{
    qrImage: any | null;
    aadhaar: any | null;
    pan: any | null;
    passbook: any | null;
  }>({
    qrImage: null,
    aadhaar: null,
    pan: null,
    passbook: null,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<ImageAsset | null>(null);
  const [imageModalVisible, setImageModalVisible] = useState(false);
  
  // Disable order completion tooltip when profile component is active
  useEffect(() => {
    console.log("🚫 [PROFILE_COMPONENT] Disabling order completion tooltip");
    setTooltipEnabled(false);
    
    // Re-enable tooltip when component unmounts
    return () => {
      console.log("✅ [PROFILE_COMPONENT] Re-enabling order completion tooltip");
      setTooltipEnabled(true);
    };
  }, [setTooltipEnabled]);

  // Load existing profile data when component mounts
  useEffect(() => {
    console.log("🔄 [PROFILE_COMPONENT] useEffect triggered with user:", user);
    console.log("🔍 [PROFILE_COMPONENT] User object details:", {
      id: user?.id,
      firstName: user?.firstName,
      lastName: user?.lastName,
      businessName: user?.businessName,
      email: user?.email,
      phone: user?.phone,
      address: user?.address,
      city: user?.city,
      state: user?.state,
      pinCode: user?.pinCode,
      category: user?.category,
      specialization: user?.specialization,
      isProfile: user?.isProfile,
      hasBankDetails: !!user?.bankDetails,
      hasDocuments: !!user?.documents
    });
    
    if (user) {
      console.log("📝 [PROFILE_COMPONENT] User data available, isProfile:", user.isProfile);
      
      if (user.isProfile === true) {
        // Profile is complete - populate form with all backend data
        console.log("✅ [PROFILE_COMPONENT] Profile is complete, populating form with all backend data");
        
        const newFormData = {
          firstName: user.firstName || "",
          lastName: user.lastName || "",
          phoneNumber: user.phone || "", // Always keep phone number
          dateOfBirth: user.dateOfBirth ? new Date(user.dateOfBirth) : new Date(1900, 0, 0),
          businessName: user.businessName || "",
          email: user.email || "",
          address: user.address || "",
          city: user.city || "",
          pinCode: user.pinCode || "",
          state: user.state || "",
          category: user.category || "Veg",
          specialization: user.specialization || "",
          fssaiNumber: user.fssaiNumber || "",
        };
        
        console.log("📝 [PROFILE_COMPONENT] Form data populated from backend:", newFormData);
        setFormData(newFormData);

        // Set bank data from backend
        if (user.bankDetails) {
          console.log("🏦 [PROFILE_COMPONENT] Setting bank data from backend");
          setBankData({
            bankName: user.bankDetails.bankName || "",
            bankBranch: user.bankDetails.bankBranch || "",
            accountNumber: user.bankDetails.accountNumber || "",
            accountHolder: user.bankDetails.accountHolder || "",
            ifscCode: user.bankDetails.ifscCode || "",
            customerId: user.bankDetails.customerId || "",
            phoneNumber: user.bankDetails.bankPhoneNumber || user.phone || "", // Use bank phone or fallback to user phone
            passBook: "",
            aadhaarCard: "",
            panCard: "",
            city: user.city || "",
            pinCode: user.pinCode || "",
            state: user.state || "",
          });
        }

        // Set existing images from backend
        if (user.documents?.profileImage) {
          console.log("🖼️ [PROFILE_COMPONENT] Setting existing profile image from backend");
          setProfileImage({
            uri: user.documents.profileImage,
            type: "image/jpeg",
            fileName: "profile.jpg"
          });
        }

        if (user.documents?.messImages && user.documents.messImages.length > 0) {
          console.log("🖼️ [PROFILE_COMPONENT] Setting existing mess images from backend:", user.documents.messImages.length);
          const existingMessImages = user.documents.messImages.map((uri: string, index: number) => ({
            uri,
            type: "image/jpeg",
            fileName: `mess_${index}.jpg`
          }));
          setMessImages(existingMessImages);
        }

        // Set existing bank documents from backend
        if (user.documents?.aadharCard) {
          console.log("🆔 [PROFILE_COMPONENT] Setting existing Aadhaar card from backend");
          setBankDocuments(prev => ({
            ...prev,
            aadhaar: {
              uri: user.documents.aadharCard,
              name: 'Aadhaar Card',
              type: 'image/jpeg'
            }
          }));
        }

        if (user.documents?.panCard) {
          console.log("🆔 [PROFILE_COMPONENT] Setting existing PAN card from backend");
          setBankDocuments(prev => ({
            ...prev,
            pan: {
              uri: user.documents.panCard,
              name: 'PAN Card',
              type: 'image/jpeg'
            }
          }));
        }

        if (user.documents?.passbook) {
          console.log("📄 [PROFILE_COMPONENT] Setting existing passbook from backend");
          setBankDocuments(prev => ({
            ...prev,
            passbook: {
              uri: user.documents.passbook,
              name: 'Passbook',
              type: 'image/jpeg'
            }
          }));
        }


        
      } else {
        // Profile is NOT complete - show empty form with only phone number
        console.log("🆕 [PROFILE_COMPONENT] Profile is NOT complete, showing empty form with only phone number");
        
        const emptyFormData = {
          firstName: "", // Empty - no placeholder
          lastName: "", // Empty - no placeholder
          phoneNumber: user.phone || "", // Keep phone number from auth
          dateOfBirth: new Date(1900, 0, 0), // Default date that displays as "0/00/0000" // Default date
          businessName: "", // Empty - no placeholder
          email: "", // Empty - no placeholder
          address: "", // Empty - no placeholder
          city: "", // Empty - no placeholder
          pinCode: "", // Empty - no placeholder
          state: "", // Empty - no placeholder
          category: "Veg", // Default category
          specialization: "", // Empty - no placeholder
          fssaiNumber: "", // Empty - no placeholder
        };
        
        console.log("📝 [PROFILE_COMPONENT] Empty form data set (only phone number populated):", emptyFormData);
        setFormData(emptyFormData);

        // Initialize empty bank data
        console.log("🏦 [PROFILE_COMPONENT] Initializing empty bank data for new profile");
        setBankData({
          bankName: "",
          bankBranch: "",
          accountNumber: "",
          accountHolder: "",
          ifscCode: "",
          customerId: "",
          phoneNumber: user.phone || "", // Keep phone number
          passBook: "",
          aadhaarCard: "",
          panCard: "",
          city: "",
          pinCode: "",
          state: "",
        });

        // Clear images for new profile
        setProfileImage(null);
        setMessImages([]);
      }
      
      console.log("✅ [PROFILE_COMPONENT] Form setup completed:", {
        isProfile: user.isProfile,
        hasPhoneNumber: !!user.phone,
        formDataPopulated: user.isProfile === true ? "Full backend data" : "Empty form with phone only"
      });
    } else {
      console.log("⚠️ [PROFILE_COMPONENT] No user data available in useEffect");
    }
  }, [user]);
  
  // Debug effect to track form data changes
  useEffect(() => {
    console.log("📝 [PROFILE_COMPONENT] Form data updated:", {
      firstName: formData.firstName,
      lastName: formData.lastName,
      businessName: formData.businessName,
      email: formData.email,
      phoneNumber: formData.phoneNumber,
      city: formData.city,
      state: formData.state,
      pinCode: formData.pinCode
    });
  }, [formData]);
  
  // Debug effect to track bank data changes
  useEffect(() => {
    console.log("🏦 [PROFILE_COMPONENT] Bank data updated:", {
      bankName: bankData?.bankName,
      accountHolder: bankData?.accountHolder,
      accountNumber: bankData?.accountNumber,
      ifscCode: bankData?.ifscCode
    });
  }, [bankData]);
  
  console.log("🔍 [PROFILE_COMPONENT] Redux state:", {
    hasUser: !!user,
    hasToken: !!token,
    authLoading,
    userId: user?.id,
    isProfile: user?.isProfile,
    userData: user
  });
  
  // Early return checks - AFTER all hooks have been called
  if (!user || !token) {
    console.log("❌ [PROFILE_COMPONENT] User not authenticated, showing login message");
    return (
      <View style={styles.container}>
        <Text style={styles.label}>Please login to access your profile</Text>
      </View>
    );
  }

  // Show loading state while auth is loading
  if (authLoading) {
    console.log("⏳ [PROFILE_COMPONENT] Auth loading, showing loading message");
    return (
      <View style={styles.container}>
        <Text style={styles.label}>Loading profile...</Text>
      </View>
    );
  }

  console.log("📱 [PROFILE_COMPONENT] Local state:", {
    formData,
    profileImage: !!profileImage,
    messImagesCount: messImages.length,
    bankData: !!bankData,
    isLoading
  });

  const handleBankDataChange = (data: BankFormData): void => {
    console.log("🏦 [PROFILE_COMPONENT] Bank data changed:", data);
    setBankData(data);
  };

  const handleBankDocumentsChange = (documents: any): void => {
    console.log("📄 [PROFILE_COMPONENT] Bank documents changed:", documents);
    setBankDocuments(documents);
  };

  const handleSaveProfile = async (): Promise<void> => {
    console.log("🚀 [PROFILE_COMPONENT] handleSaveProfile called");
    
    const requiredProfileFields = [
      "firstName",
      "email",
      "businessName",
      "fssaiNumber",
    ];
    const requiredBankFields = [
      "accountHolder",
      "accountNumber",
      "ifscCode",
      "bankName",
    ];

    console.log("🔍 [PROFILE_COMPONENT] Validating required fields...");
    console.log("📝 [PROFILE_COMPONENT] Form data:", formData);
    console.log("🏦 [PROFILE_COMPONENT] Bank data:", bankData);

    const missingProfileFields = requiredProfileFields.filter(
      (field) => !formData[field as keyof typeof formData]
    );

    if (!bankData) {
      console.log("❌ [PROFILE_COMPONENT] Bank data is missing");
      Alert.alert("Error", "Bank data is missing");
      return;
    }

    const missingBankFields = requiredBankFields.filter(
      (field) => !bankData[field as keyof typeof bankData]
    );

    console.log("❌ [PROFILE_COMPONENT] Missing profile fields:", missingProfileFields);
    console.log("❌ [PROFILE_COMPONENT] Missing bank fields:", missingBankFields);

    if (missingProfileFields.length > 0 || missingBankFields.length > 0) {
      Alert.alert(
        "Error",
        "Please fill in all required profile and bank fields"
      );
      return;
    }

    if (!token) {
      console.log("❌ [PROFILE_COMPONENT] Authentication token not found");
      Alert.alert("Error", "Authentication token not found. Please login again.");
      return;
    }

    console.log("✅ [PROFILE_COMPONENT] All validations passed, starting profile update...");
    
    setIsLoading(true);
    dispatch(setLoading(true));
    dispatch(clearError());

    try {
      console.log("🔄 [PROFILE_COMPONENT] Starting profile update...");
      console.log("🔑 [PROFILE_COMPONENT] Token available:", !!token);
      
      // Test network connectivity first using the configured API URL
      try {
        console.log("🌐 [PROFILE_COMPONENT] Testing network connectivity...");
        const testResponse = await fetch(`${API_URLS.PROFILE}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        console.log("✅ [PROFILE_COMPONENT] Network test successful, status:", testResponse.status);
      } catch (networkError: any) {
        console.error("❌ [PROFILE_COMPONENT] Network test failed:", networkError);
        Alert.alert(
          "Network Error", 
          "Cannot connect to the server. Please check:\n\n1. Backend server is running\n2. IP address is correct\n3. Network connectivity\n\nError: " + networkError.message
        );
        return;
      }
      
      // Prepare profile data with proper type casting
      const profileData = {
        // Map formData fields to backend expected names
        phone: formData.phoneNumber, // Backend expects 'phone', not 'phoneNumber'
        firstName: formData.firstName,
        lastName: formData.lastName,
        dateOfBirth: formData.dateOfBirth.toISOString(),
        businessName: formData.businessName,
        email: formData.email,
        address: formData.address,
        city: formData.city,
        pinCode: formData.pinCode,
        state: formData.state,
        category: formData.category as "Veg" | "Non Veg" | "Mix",
        specialization: formData.specialization,
        fssaiNumber: formData.fssaiNumber,
        
        // Bank details - these should match backend field names
        bankName: bankData?.bankName,
        bankBranch: bankData?.bankBranch,
        accountNumber: bankData?.accountNumber,
        accountHolder: bankData?.accountHolder,
        ifscCode: bankData?.ifscCode,
        customerId: bankData?.customerId,
        bankPhoneNumber: bankData?.phoneNumber, // Map to bankPhoneNumber field
      };

      console.log("📝 [PROFILE_COMPONENT] Profile data prepared:", profileData);
      console.log("🔍 [PROFILE_COMPONENT] Individual fields:", {
        phone: profileData.phone,
        firstName: profileData.firstName,
        lastName: profileData.lastName,
        businessName: profileData.businessName,
        email: profileData.email,
        address: profileData.address,
        city: profileData.city,
        pinCode: profileData.pinCode,
        state: profileData.state,
        category: profileData.category,
        specialization: profileData.specialization,
        bankName: profileData.bankName,
        bankBranch: profileData.bankBranch,
        accountNumber: profileData.accountNumber,
        accountHolder: profileData.accountHolder,
        ifscCode: profileData.ifscCode,
        customerId: profileData.customerId,
        bankPhoneNumber: profileData.bankPhoneNumber,
        dateOfBirth: profileData.dateOfBirth
      });

      // Prepare files for upload
      const files: any = {};
      
      if (profileImage) {
        console.log("🖼️ [PROFILE_COMPONENT] Adding profile image to files");
        files.profileImage = profileImage;
      }
      
      if (messImages.length > 0) {
        console.log("🖼️ [PROFILE_COMPONENT] Adding mess images to files:", messImages.length);
        files.messImages = messImages;
      }

      // Add bank documents
      if (bankDocuments.qrImage) {
        console.log("📄 [PROFILE_COMPONENT] Adding QR code to files");
        files.qrCode = bankDocuments.qrImage;
      }

      if (bankDocuments.aadhaar) {
        console.log("📄 [PROFILE_COMPONENT] Adding Aadhaar card to files");
        files.aadharCard = bankDocuments.aadhaar;
      }

      if (bankDocuments.pan) {
        console.log("📄 [PROFILE_COMPONENT] Adding PAN card to files");
        files.panCard = bankDocuments.pan;
      }

      if (bankDocuments.passbook) {
        console.log("📄 [PROFILE_COMPONENT] Adding passbook to files");
        files.passbook = bankDocuments.passbook;
      }

      console.log("📁 [PROFILE_COMPONENT] Files prepared:", Object.keys(files));
      console.log("📁 [PROFILE_COMPONENT] Files details:", files);

      console.log("📤 [PROFILE_COMPONENT] Calling apiConnector.updateProfileWithMedia...");
      
      // Update profile with media files
      const response = await apiConnector.updateProfileWithMedia(profileData, files, token);
      
      console.log("📥 [PROFILE_COMPONENT] API response received:", response);
      
      if (response.success && response.data) {
        console.log("✅ [PROFILE_COMPONENT] Profile updated successfully");
        
        // Update Redux state with new profile data
        console.log("🔄 [PROFILE_COMPONENT] Dispatching updateUserProfile to Redux");
        dispatch(updateUserProfile(response.data));
        
        // Show success message and navigate to dashboard
        console.log("🎯 [PROFILE_COMPONENT] Profile update successful, preparing navigation to dashboard");
        
        // Auto-navigate to dashboard after 3 seconds (fallback)
        const autoNavigateTimer = setTimeout(() => {
          console.log("⏰ [PROFILE_COMPONENT] Auto-navigation to dashboard triggered");
          router.push("/(restaurant)");
        }, 3000);
        
        Alert.alert(
          "Success", 
          "Profile updated successfully! You will be redirected to the dashboard.",
          [
            {
              text: "OK",
              onPress: () => {
                // Clear auto-navigation timer
                clearTimeout(autoNavigateTimer);
                // Navigate to dashboard after successful profile update
                console.log("🎯 [PROFILE_COMPONENT] Profile update completed, navigating to dashboard");
                // Small delay to ensure user sees the success message
                setTimeout(() => {
                  console.log("🚀 [PROFILE_COMPONENT] Starting navigation to dashboard");
                  router.push("/(restaurant)");
                }, 500);
              }
            }
          ]
        );
      } else {
        const errorMessage = response.message || "Failed to update profile";
        console.log("❌ [PROFILE_COMPONENT] Profile update failed:", errorMessage);
        dispatch(setError(errorMessage));
        Alert.alert("Error", errorMessage);
      }
    } catch (error: any) {
      console.error("❌ [PROFILE_COMPONENT] Profile update error:", error);
      const errorMessage = error.message || "Failed to update profile. Please try again.";
      dispatch(setError(errorMessage));
      
      // Show more detailed error information
      if (error.message?.includes('Network request failed')) {
        Alert.alert(
          "Network Error",
          "The request failed due to network issues. Please check:\n\n" +
          "• Backend server is running on port 3001\n" +
          "• IP address 192.168.1.4 is correct\n" +
          "• Device and server are on same network\n" +
          "• Firewall allows connections to port 3001"
        );
      } else {
        Alert.alert("Error", errorMessage);
      }
    } finally {
      console.log("🏁 [PROFILE_COMPONENT] Profile update operation completed, setting loading to false");
      setIsLoading(false);
      dispatch(setLoading(false));
    }
  };

  const handleInputChange = (
    field: keyof FormData,
    value: string | Date
  ): void => {
    console.log("✏️ [PROFILE_COMPONENT] Input changed:", { field, value, type: typeof value });
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Auto-fill city and state when pin code is entered
    if (field === "pinCode" && typeof value === "string" && value.length === 6) {
      console.log("🚀 [PROFILE_COMPONENT] Triggering pin code lookup for:", value);
      handlePinCodeLookup(value);
    } else if (field === "pinCode") {
      console.log("🔍 [PROFILE_COMPONENT] Pin code field changed but not triggering lookup:", { field, value, length: typeof value === "string" ? value.length : "not string" });
    }
  };

  const handlePinCodeLookup = async (pinCode: string): Promise<void> => {
    try {
      console.log("🔍 [PROFILE_COMPONENT] Looking up pin code:", pinCode);
      
      // Try Postal PIN Code API first (official and reliable)
      const apiUrl = `https://api.postalpincode.in/pincode/${pinCode}`;
      console.log("🌐 [PROFILE_COMPONENT] Making API call to:", apiUrl);
      const response = await fetch(apiUrl);
      console.log("📡 [PROFILE_COMPONENT] Postal PIN Code API response status:", response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log("✅ [PROFILE_COMPONENT] Postal PIN Code API response:", data);
        
        // Handle array response format
        const responseData = Array.isArray(data) ? data[0] : data;
        console.log("📋 [PROFILE_COMPONENT] Processed response data:", responseData);
        
        if (responseData.Status === "Success" && responseData.PostOffice && responseData.PostOffice.length > 0) {
          const postOffice = responseData.PostOffice[0]; // Use first post office data
          setFormData((prev) => ({
            ...prev,
            city: postOffice.District || postOffice.Circle,
            state: postOffice.State,
          }));
          console.log("📍 [PROFILE_COMPONENT] Auto-filled city and state:", { 
            city: postOffice.District || postOffice.Circle, 
            state: postOffice.State 
          });
        } else {
          console.log("⚠️ [PROFILE_COMPONENT] Postal PIN Code API response missing data or error:", responseData.Message);
          await tryAlternativePinCodeAPI(pinCode);
        }
      } else {
        console.log("⚠️ [PROFILE_COMPONENT] Postal PIN Code API failed with status:", response.status);
        // Fallback to alternative API
        await tryAlternativePinCodeAPI(pinCode);
      }
    } catch (error) {
      console.log("❌ [PROFILE_COMPONENT] Postal PIN Code API error:", error);
      // Try alternative API
      await tryAlternativePinCodeAPI(pinCode);
    }
  };

  const tryAlternativePinCodeAPI = async (pinCode: string): Promise<void> => {
    try {
      console.log("🔄 [PROFILE_COMPONENT] Trying alternative pin code API...");
      const response = await fetch(`https://indianpincodes.co.in/api/pincode/${pinCode}`);
      console.log("📡 [PROFILE_COMPONENT] Alternative API response status:", response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log("✅ [PROFILE_COMPONENT] Alternative API response:", data);
        
        if (data.state && data.city) {
          setFormData((prev) => ({
            ...prev,
            city: data.city,
            state: data.state,
          }));
          console.log("📍 [PROFILE_COMPONENT] Auto-filled from alternative API:", { city: data.city, state: data.state });
        } else {
          console.log("⚠️ [PROFILE_COMPONENT] Alternative API response missing city/state data");
          // Try third API as final fallback
          await tryThirdPinCodeAPI(pinCode);
        }
      } else {
        console.log("⚠️ [PROFILE_COMPONENT] Alternative API failed with status:", response.status);
        // Try third API as final fallback
        await tryThirdPinCodeAPI(pinCode);
      }
    } catch (error) {
      console.log("❌ [PROFILE_COMPONENT] Alternative pin code API error:", error);
      // Try third API as final fallback
      await tryThirdPinCodeAPI(pinCode);
    }
  };

  const tryThirdPinCodeAPI = async (pinCode: string): Promise<void> => {
    try {
      console.log("🔄 [PROFILE_COMPONENT] Trying third pin code API (Pintastic)...");
      const response = await fetch(`https://pintastic.in/api/pincode/${pinCode}`);
      console.log("📡 [PROFILE_COMPONENT] Third API response status:", response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log("✅ [PROFILE_COMPONENT] Third API response:", data);
        
        if (data.state && data.city) {
          setFormData((prev) => ({
            ...prev,
            city: data.city,
            state: data.state,
          }));
          console.log("📍 [PROFILE_COMPONENT] Auto-filled from third API:", { city: data.city, state: data.state });
        } else {
          console.log("⚠️ [PROFILE_COMPONENT] Third API response missing city/state data");
          // Try fourth API as final fallback
          await tryFourthPinCodeAPI(pinCode);
        }
      } else {
        console.log("⚠️ [PROFILE_COMPONENT] Third API failed with status:", response.status);
        // Try fourth API as final fallback
        await tryFourthPinCodeAPI(pinCode);
      }
    } catch (error) {
      console.log("❌ [PROFILE_COMPONENT] Third pin code API error:", error);
      // Try fourth API as final fallback
      await tryFourthPinCodeAPI(pinCode);
    }
  };

  const tryFourthPinCodeAPI = async (pinCode: string): Promise<void> => {
    try {
      console.log("🔄 [PROFILE_COMPONENT] Trying fourth pin code API (Indian Cities API)...");
      const response = await fetch(`https://indian-cities-api-nocbegfhqg.now.sh/`);
      console.log("📡 [PROFILE_COMPONENT] Fourth API response status:", response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log("✅ [PROFILE_COMPONENT] Fourth API response received, searching for pin code:", pinCode);
        
        // Search for city with matching pin code pattern
        const matchingCity = data.find((city: any) => 
          city.pincode && city.pincode.toString().startsWith(pinCode.substring(0, 3))
        );
        
        if (matchingCity) {
          setFormData((prev) => ({
            ...prev,
            city: matchingCity.name,
            state: matchingCity.state,
          }));
          console.log("📍 [PROFILE_COMPONENT] Auto-filled from fourth API:", { city: matchingCity.name, state: matchingCity.state });
        } else {
          console.log("⚠️ [PROFILE_COMPONENT] No matching city found in fourth API");
          // Try local fallback
          await tryLocalPinCodeFallback(pinCode);
        }
      } else {
        console.log("⚠️ [PROFILE_COMPONENT] Fourth API failed with status:", response.status);
        // Try local fallback
        await tryLocalPinCodeFallback(pinCode);
      }
    } catch (error) {
      console.log("❌ [PROFILE_COMPONENT] Fourth pin code API error:", error);
      // Try local fallback
      await tryLocalPinCodeFallback(pinCode);
    }
  };

  const tryLocalPinCodeFallback = async (pinCode: string): Promise<void> => {
    console.log("🔄 [PROFILE_COMPONENT] Trying local pin code fallback...");
    
    // Common Indian pin codes with their cities and states
    const pinCodeData: { [key: string]: { city: string; state: string } } = {
      "110001": { city: "New Delhi", state: "Delhi" },
      "110002": { city: "New Delhi", state: "Delhi" },
      "110003": { city: "New Delhi", state: "Delhi" },
      "400001": { city: "Mumbai", state: "Maharashtra" },
      "400002": { city: "Mumbai", state: "Maharashtra" },
      "400003": { city: "Mumbai", state: "Maharashtra" },
      "560001": { city: "Bangalore", state: "Karnataka" },
      "560002": { city: "Bangalore", state: "Karnataka" },
      "560003": { city: "Bangalore", state: "Karnataka" },
      "600001": { city: "Chennai", state: "Tamil Nadu" },
      "600002": { city: "Chennai", state: "Tamil Nadu" },
      "600003": { city: "Chennai", state: "Tamil Nadu" },
      "700001": { city: "Kolkata", state: "West Bengal" },
      "700002": { city: "Kolkata", state: "West Bengal" },
      "700003": { city: "Kolkata", state: "West Bengal" },
      "380001": { city: "Ahmedabad", state: "Gujarat" },
      "380002": { city: "Ahmedabad", state: "Gujarat" },
      "380003": { city: "Ahmedabad", state: "Gujarat" },
      "500001": { city: "Hyderabad", state: "Telangana" },
      "500002": { city: "Hyderabad", state: "Telangana" },
      "500003": { city: "Hyderabad", state: "Telangana" },
      "302001": { city: "Jaipur", state: "Rajasthan" },
      "302002": { city: "Jaipur", state: "Rajasthan" },
      "302003": { city: "Jaipur", state: "Rajasthan" },
      "201301": { city: "Noida", state: "Uttar Pradesh" },
      "201302": { city: "Noida", state: "Uttar Pradesh" },
      "201303": { city: "Noida", state: "Uttar Pradesh" },
    };

    const locationData = pinCodeData[pinCode];
    if (locationData) {
      setFormData((prev) => ({
        ...prev,
        city: locationData.city,
        state: locationData.state,
      }));
      console.log("📍 [PROFILE_COMPONENT] Auto-filled from local fallback:", { city: locationData.city, state: locationData.state });
    } else {
      console.log("⚠️ [PROFILE_COMPONENT] Pin code not found in local fallback data");
    }
  };

  const handleDateChange = (event: any, selectedDate?: Date): void => {
    console.log("📅 [PROFILE_COMPONENT] Date change event:", { event, selectedDate });
    if (Platform.OS === "android") {
      setShowDatePicker(false);
      if (selectedDate) {
        console.log("📅 [PROFILE_COMPONENT] Android date selected:", selectedDate);
        handleInputChange("dateOfBirth", selectedDate);
      }
    } else {
      // On iOS, just update the temporary date
      if (selectedDate) {
        console.log("📅 [PROFILE_COMPONENT] iOS date selected:", selectedDate);
        setTempDate(selectedDate);
      }
    }
  };

  const handleIOSDateConfirm = (): void => {
    console.log("✅ [PROFILE_COMPONENT] iOS date confirmed:", tempDate);
    handleInputChange("dateOfBirth", tempDate);
    setShowDatePicker(false);
  };

  const handleIOSDateCancel = (): void => {
    console.log("❌ [PROFILE_COMPONENT] iOS date cancelled, resetting to:", formData.dateOfBirth);
    setTempDate(formData.dateOfBirth); // Reset to original date
    setShowDatePicker(false);
  };

  const openDatePicker = (): void => {
    console.log("📅 [PROFILE_COMPONENT] Opening date picker with current date:", formData.dateOfBirth);
    setTempDate(formData.dateOfBirth); // Initialize temp date
    setShowDatePicker(true);
  };

  const formatDate = (date: Date): string => {
    // Check if it's the default date (year 1900, month 0, day 0)
    if (date.getFullYear() === 1900 && date.getMonth() === 0 && date.getDate() === 0) {
      return "0/00/0000";
    }
    // Check if it's the default date (year 1900, month 11, day 31) - alternative representation
    if (date.getFullYear() === 1899 && date.getMonth() === 11 && date.getDate() === 31) {
      return "0/00/0000";
    }
    const formatted = date.toLocaleDateString("en-GB");
    console.log("📅 [PROFILE_COMPONENT] Formatting date:", { original: date, formatted });
    return formatted;
  };

  const handleFocus = (fieldName: string): void => {
    console.log("🎯 [PROFILE_COMPONENT] Field focused:", fieldName);
    setFocusedField(fieldName);
  };

  const handleBlur = (): void => {
    console.log("👋 [PROFILE_COMPONENT] Field blurred, clearing focus");
    setFocusedField(null);
  };

  const uploadProfileImage = (): void => {
    console.log("📸 [PROFILE_COMPONENT] Profile image upload requested");
    Alert.alert("Select Profile Image", "Choose an option", [
      { text: "Camera", onPress: () => openCamera("profile") },
      { text: "Gallery", onPress: () => openGallery("profile") },
      { text: "Cancel", style: "cancel" },
    ]);
  };

  const uploadMessImages = (): void => {
    console.log("📸 [PROFILE_COMPONENT] Mess images upload requested");
    Alert.alert("Select Mess Images", "Choose an option", [
      { text: "Camera", onPress: () => openCamera("mess") },
      { text: "Gallery", onPress: () => openGallery("mess") },
      { text: "Cancel", style: "cancel" },
    ]);
  };

  const openCamera = async (type: "profile" | "mess"): Promise<void> => {
    console.log("📸 [PROFILE_COMPONENT] Opening camera for:", type);
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      console.log("📸 [PROFILE_COMPONENT] Camera permission status:", status);
      if (status !== "granted") {
        Alert.alert("Sorry, we need camera permissions to make this work!");
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      console.log("📸 [PROFILE_COMPONENT] Camera result:", result);

      if (!result.canceled && result.assets && result.assets[0]) {
        const imageAsset: ImageAsset = {
          uri: result.assets[0].uri,
          type: "image/jpeg",
          fileName: `image_${Date.now()}.jpg`,
        };

        console.log("📸 [PROFILE_COMPONENT] Image asset created:", imageAsset);

        if (type === "profile") {
          console.log("🖼️ [PROFILE_COMPONENT] Setting profile image");
          setProfileImage(imageAsset);
        } else {
          console.log("🖼️ [PROFILE_COMPONENT] Adding mess image");
          setMessImages((prev) => [...prev, imageAsset]);
        }
      }
    } catch (error) {
      console.log("❌ [PROFILE_COMPONENT] Camera error:", error);
      Alert.alert("Error", "Failed to open camera");
    }
  };

  const openGallery = async (type: "profile" | "mess"): Promise<void> => {
    console.log("🖼️ [PROFILE_COMPONENT] Opening gallery for:", type);
    try {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      console.log("🖼️ [PROFILE_COMPONENT] Gallery permission status:", status);
      if (status !== "granted") {
        Alert.alert("Sorry, we need gallery permissions to make this work!");
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: type === "profile",
        aspect: [4, 3],
        quality: 1,
        allowsMultipleSelection: type === "mess",
        selectionLimit: type === "mess" ? 5 : 1,
      });

      console.log("🖼️ [PROFILE_COMPONENT] Gallery result:", result);

      if (!result.canceled && result.assets) {
        const imageAssets: ImageAsset[] = result.assets.map((asset, index) => ({
          uri: asset.uri,
          type: "image/jpeg",
          fileName: `image_${Date.now()}_${index}.jpg`,
        }));

        console.log("🖼️ [PROFILE_COMPONENT] Image assets created:", imageAssets);

        if (type === "profile") {
          console.log("🖼️ [PROFILE_COMPONENT] Setting profile image from gallery");
          setProfileImage(imageAssets[0]);
        } else {
          console.log("🖼️ [PROFILE_COMPONENT] Adding mess images from gallery");
          setMessImages((prev) => [...prev, ...imageAssets]);
        }
      }
    } catch (error) {
      console.log("❌ [PROFILE_COMPONENT] Gallery error:", error);
      Alert.alert("Error", "Failed to open gallery");
    }
  };

  const getInputStyle = (fieldName: string) => {
    const style = [styles.input, focusedField === fieldName && styles.focusedInput];
    console.log("🎨 [PROFILE_COMPONENT] Input style for", fieldName, ":", { focusedField, style });
    return style;
  };

  const getOutlineStyle = (fieldName: string) => {
    const style = focusedField === fieldName
      ? styles.focusedOutline
      : styles.inputOutline;
    console.log("🎨 [PROFILE_COMPONENT] Outline style for", fieldName, ":", { focusedField, style });
    return style;
  };

  const openImageModal = (image: ImageAsset) => {
    console.log("🖼️ [PROFILE_COMPONENT] Opening image modal for:", image);
    setSelectedImage(image);
    setImageModalVisible(true);
  };

  const closeImageModal = () => {
    console.log("🖼️ [PROFILE_COMPONENT] Closing image modal");
    setSelectedImage(null);
    setImageModalVisible(false);
  };

  console.log("🏦 [PROFILE_COMPONENT] About to render BankDetailsSection with data:", bankData);

  return (
    <ScrollView style={styles.container} keyboardShouldPersistTaps="handled">
      <View style={styles.surface}>
        <View style={styles.header}>
          <View style={styles.avatarContainer}>
            {profileImage ? (
              <Avatar.Image
                size={60}
                source={{ uri: profileImage.uri }}
                style={styles.avatar}
              />
            ) : (
              <Avatar.Text size={60} label="AR" style={styles.avatar} />
            )}
            <IconButton
              icon="camera"
              mode="contained"
              size={16}
              style={styles.cameraIcon}
              iconColor="#fff"
              onPress={uploadProfileImage}
            />
          </View>
          <View style={styles.headerText}>
            <Text variant="titleMedium" style={styles.name}>
              {user?.firstName || "Restaurant"} {user?.lastName || "Profile"}
            </Text>
          </View>
        </View>

        <Divider style={styles.divider} />

        <View style={styles.formContainer}>
          <View style={styles.row}>
            <View style={styles.halfWidth}>
              <Text style={styles.label}>First Name *</Text>
              <TextInput
                value={formData.firstName}
                onChangeText={(text: string) =>
                  handleInputChange("firstName", text)
                }
                onFocus={() => handleFocus("firstName")}
                onBlur={handleBlur}
                mode="outlined"
                style={getInputStyle("firstName")}
                outlineStyle={getOutlineStyle("firstName")}
                textColor="#333"
              />
            </View>
            <View style={styles.halfWidth}>
              <Text style={styles.label}>Last Name</Text>
              <TextInput
                value={formData.lastName}
                onChangeText={(text: string) =>
                  handleInputChange("lastName", text)
                }
                onFocus={() => handleFocus("lastName")}
                onBlur={handleBlur}
                mode="outlined"
                style={getInputStyle("lastName")}
                outlineStyle={getOutlineStyle("lastName")}
                textColor="#333"
              />
            </View>
          </View>

          <View style={styles.row}>
            <View style={styles.halfWidth}>
              <Text style={styles.label}>Phone Number</Text>
              <TextInput
                value={formData.phoneNumber}
                onChangeText={(text: string) =>
                  handleInputChange("phoneNumber", text)
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
            <View style={styles.halfWidth}>
              <Text style={styles.label}>Date of Birth</Text>
              <TouchableOpacity onPress={openDatePicker} activeOpacity={0.7}>
                <TextInput
                  value={formatDate(formData.dateOfBirth)}
                  mode="outlined"
                  style={[
                    getInputStyle("dateOfBirth"),
                    styles.dateInput
                  ]}
                  outlineStyle={getOutlineStyle("dateOfBirth")}
                  editable={false}
                  right={<TextInput.Icon icon="calendar" />}
                  pointerEvents="none"
                  textColor="#333"
                />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.row}>
            <View style={styles.halfWidth}>
              <Text style={styles.label}>Business Name *</Text>
              <TextInput
                value={formData.businessName}
                onChangeText={(text: string) =>
                  handleInputChange("businessName", text)
                }
                onFocus={() => handleFocus("businessName")}
                onBlur={handleBlur}
                mode="outlined"
                style={getInputStyle("businessName")}
                outlineStyle={getOutlineStyle("businessName")}
                textColor="#333"
              />
            </View>
            <View style={styles.halfWidth}>
              <Text style={styles.label}>Upload Mess Images</Text>
              <Button
                mode="outlined"
                onPress={uploadMessImages}
                style={styles.uploadButton}
                labelStyle={styles.uploadButtonText}
              >
                {messImages.length > 0
                  ? `${messImages.length} Selected`
                  : "Choose File"}
              </Button>
            </View>
          </View>

          <View style={styles.fullWidth}>
            <Text style={styles.label}>FSSAI Number *</Text>
            <TextInput
              value={formData.fssaiNumber}
              onChangeText={(text: string) =>
                handleInputChange("fssaiNumber", text)
              }
              onFocus={() => handleFocus("fssaiNumber")}
              onBlur={handleBlur}
              mode="outlined"
              keyboardType="numeric"
              maxLength={14}
              style={getInputStyle("fssaiNumber")}
              outlineStyle={getOutlineStyle("fssaiNumber")}
              placeholder=""
              textColor="#333"
            />
          </View>

          <View style={styles.fullWidth}>
            <Text style={styles.label}>E-mail Address *</Text>
            <TextInput
              value={formData.email}
              onChangeText={(text: string) => handleInputChange("email", text)}
              onFocus={() => handleFocus("email")}
              onBlur={handleBlur}
              mode="outlined"
              keyboardType="email-address"
              style={getInputStyle("email")}
              outlineStyle={getOutlineStyle("email")}
              placeholder=""
              textColor="#333"
            />
          </View>

          <View style={styles.fullWidth}>
            <Text style={styles.label}>Address</Text>
            <TextInput
              value={formData.address}
              onChangeText={(text: string) =>
                handleInputChange("address", text)
              }
              onFocus={() => handleFocus("address")}
              onBlur={handleBlur}
              mode="outlined"
              style={getInputStyle("address")}
              outlineStyle={getOutlineStyle("address")}
              placeholder=""
              textColor="#333"
            />
          </View>

          <View style={styles.row}>
            <View style={styles.halfWidth}>
              <Text style={styles.label}>Pin Code</Text>
              <TextInput
                value={formData.pinCode}
                onChangeText={(text: string) => handleInputChange("pinCode", text)}
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
                value={formData.city}
                onChangeText={(text: string) => handleInputChange("city", text)}
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

          <View style={styles.fullWidth}>
            <Text style={styles.label}>State</Text>
            <TextInput
              value={formData.state}
              onChangeText={(text: string) => handleInputChange("state", text)}
              onFocus={() => handleFocus("state")}
              onBlur={handleBlur}
              mode="outlined"
              style={getInputStyle("state")}
              outlineStyle={getOutlineStyle("state")}
              placeholder=""
              textColor="#333"
            />
          </View>

          <View style={styles.fullWidth}>
            <Text style={styles.label}>Choose Category</Text>
            <RadioButton.Group
              onValueChange={(value: string) =>
                handleInputChange("category", value)
              }
              value={formData.category}
            >
              <View style={styles.radioContainer}>
                <View style={styles.radioItem}>
                  <RadioButton value="Veg" color="#ff5722" />
                  <Text>Veg</Text>
                </View>
                <View style={styles.radioItem}>
                  <RadioButton value="Non Veg" color="#ff5722" />
                  <Text>Non Veg</Text>
                </View>
                <View style={styles.radioItem}>
                  <RadioButton
                    value="Mix"
                    status={
                      formData.category === "Mix" ? "checked" : "unchecked"
                    }
                    color="#ff5722"
                  />
                  <Text>Mix</Text>
                </View>
              </View>
            </RadioButton.Group>
          </View>

          <View style={styles.fullWidth}>
            <Text style={styles.label}>Specialization</Text>
            <TextInput
              value={formData.specialization}
              onChangeText={(text: string) =>
                handleInputChange("specialization", text)
              }
              onFocus={() => handleFocus("specialization")}
              onBlur={handleBlur}
              mode="outlined"
              style={getInputStyle("specialization")}
              outlineStyle={getOutlineStyle("specialization")}
              placeholder=""
              textColor="#333"
            />
          </View>

          {/* Image Display Section */}
          <View style={styles.fullWidth}>
            <Text style={styles.label}>Uploaded Images</Text>
            
            {/* Profile Image */}
            {profileImage && (
              <View style={styles.imageSection}>
                <Text style={styles.imageLabel}>Profile Image</Text>
                <TouchableOpacity onPress={() => openImageModal(profileImage)}>
                  <Image source={{ uri: profileImage.uri }} style={styles.thumbnail} />
                </TouchableOpacity>
              </View>
            )}

            {/* Mess Images */}
            {messImages.length > 0 && (
              <View style={styles.imageSection}>
                <Text style={styles.imageLabel}>Mess Images ({messImages.length})</Text>
                <View style={styles.imageRow}>
                  {messImages.map((image, index) => (
                    <TouchableOpacity 
                      key={`mess_${index}`} 
                      onPress={() => openImageModal(image)}
                      style={styles.imageContainer}
                    >
                      <Image source={{ uri: image.uri }} style={styles.thumbnail} />
                      <Text style={styles.imageIndex}>Image {index + 1}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            )}

            {/* Bank Documents */}
            {(bankDocuments.qrImage || bankDocuments.aadhaar || bankDocuments.pan || bankDocuments.passbook) && (
              <View style={styles.imageSection}>
                <Text style={styles.imageLabel}>Bank Documents</Text>
                <View style={styles.imageRow}>
                  {bankDocuments.qrImage && (
                    <TouchableOpacity 
                      onPress={() => openImageModal(bankDocuments.qrImage)}
                      style={styles.imageContainer}
                    >
                      <Image source={{ uri: bankDocuments.qrImage.uri }} style={styles.thumbnail} />
                      <Text style={styles.imageIndex}>QR Code</Text>
                    </TouchableOpacity>
                  )}
                  {bankDocuments.aadhaar && (
                    <TouchableOpacity 
                      onPress={() => openImageModal(bankDocuments.aadhaar)}
                      style={styles.imageContainer}
                    >
                      <Image source={{ uri: bankDocuments.aadhaar.uri }} style={styles.thumbnail} />
                      <Text style={styles.imageIndex}>Aadhaar</Text>
                    </TouchableOpacity>
                  )}
                  {bankDocuments.pan && (
                    <TouchableOpacity 
                      onPress={() => openImageModal(bankDocuments.pan)}
                      style={styles.imageContainer}
                    >
                      <Image source={{ uri: bankDocuments.pan.uri }} style={styles.thumbnail} />
                      <Text style={styles.imageIndex}>PAN Card</Text>
                    </TouchableOpacity>
                  )}
                  {bankDocuments.passbook && (
                    <TouchableOpacity 
                      onPress={() => openImageModal(bankDocuments.passbook)}
                      style={styles.imageContainer}
                    >
                      <Image source={{ uri: bankDocuments.passbook.uri }} style={styles.thumbnail} />
                      <Text style={styles.imageIndex}>Passbook</Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            )}
          </View>
        </View>

        {showDatePicker && (
          <>
            {Platform.OS === "ios" ? (
              <Modal
                transparent={true}
                animationType="slide"
                visible={showDatePicker}
                onRequestClose={handleIOSDateCancel}
              >
                <View style={styles.modalOverlay}>
                  <View style={styles.iosDatePickerContainer}>
                    <View style={styles.iosDatePickerHeader}>
                      <TouchableOpacity
                        onPress={handleIOSDateCancel}
                        style={styles.iosDatePickerButton}
                      >
                        <Text style={styles.iosDatePickerButtonText}>
                          Cancel
                        </Text>
                      </TouchableOpacity>
                      <Text style={styles.iosDatePickerTitle}>Select Date</Text>
                      <TouchableOpacity
                        onPress={handleIOSDateConfirm}
                        style={styles.iosDatePickerButton}
                      >
                        <Text
                          style={[
                            styles.iosDatePickerButtonText,
                            styles.iosDatePickerDoneText,
                          ]}
                        >
                          Done
                        </Text>
                      </TouchableOpacity>
                    </View>
                    <DateTimePicker
                      value={tempDate}
                      mode="date"
                      display="spinner"
                      onChange={handleDateChange}
                      maximumDate={new Date()}
                      style={styles.iosDatePicker}
                    />
                  </View>
                </View>
              </Modal>
            ) : (
              <DateTimePicker
                value={formData.dateOfBirth}
                mode="date"
                display="default"
                onChange={handleDateChange}
                maximumDate={new Date()}
              />
            )}
          </>
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

      <BankDetailsSection 
        onDataChange={handleBankDataChange} 
        onDocumentsChange={handleBankDocumentsChange}
        initialData={bankData || undefined}
        existingDocuments={bankDocuments}
      />

      <View style={styles.saveContainer}>
        <Button
          mode="contained"
          onPress={handleSaveProfile}
          style={styles.saveProfileButton}
          labelStyle={styles.saveProfileButtonText}
          loading={isLoading}
          disabled={isLoading}
        >
          {isLoading ? "Saving Profile..." : "Save Profile"}
        </Button>
      </View>
    </ScrollView>
  );
};

export default RestaurantProfile;