// React Native specific utilities for Restaurant App
import { Platform, Dimensions, StatusBar } from 'react-native';

// ===== PLATFORM UTILITIES =====

// Check if running on iOS
export const isIOS = Platform.OS === 'ios';

// Check if running on Android
export const isAndroid = Platform.OS === 'android';

// Check if running on web
export const isWeb = Platform.OS === 'web';

// Get platform-specific value
export const getPlatformValue = <T>(iosValue: T, androidValue: T, webValue?: T): T => {
  if (isIOS) return iosValue;
  if (isAndroid) return androidValue;
  return webValue || androidValue; // Default to Android value for web
};

// ===== DIMENSION UTILITIES =====

// Get screen dimensions
export const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Get status bar height
export const getStatusBarHeight = (): number => {
  if (isIOS) {
    return 44; // Default iOS status bar height
  }
  return StatusBar.currentHeight || 0;
};

// Get safe area height (for devices with notches)
export const getSafeAreaHeight = (): number => {
  return getStatusBarHeight() + 20; // Add some padding
};

// Check if device is in landscape mode
export const isLandscape = (): boolean => {
  return SCREEN_WIDTH > SCREEN_HEIGHT;
};

// Check if device is in portrait mode
export const isPortrait = (): boolean => {
  return SCREEN_WIDTH < SCREEN_HEIGHT;
};

// Get responsive dimensions
export const getResponsiveDimension = (
  baseDimension: number,
  scaleFactor: number = 1
): number => {
  const { width, height } = Dimensions.get('window');
  const baseWidth = 375; // iPhone X width as base
  const scale = Math.min(width, height) / baseWidth;
  return Math.round(baseDimension * scale * scaleFactor);
};

// ===== STORAGE UTILITIES =====

// Note: These are placeholder implementations
// In a real app, you'd use AsyncStorage or SecureStore

// Store data
export const storeData = async (key: string, value: any): Promise<void> => {
  try {
    // In React Native, you'd use:
    // await AsyncStorage.setItem(key, JSON.stringify(value));
    console.log(`Storing data for key: ${key}`, value);
  } catch (error) {
    console.error('Error storing data:', error);
    throw error;
  }
};

// Retrieve data
export const retrieveData = async <T>(key: string, fallback?: T): Promise<T | null> => {
  try {
    // In React Native, you'd use:
    // const value = await AsyncStorage.getItem(key);
    // return value ? JSON.parse(value) : fallback || null;
    console.log(`Retrieving data for key: ${key}`);
    return fallback || null;
  } catch (error) {
    console.error('Error retrieving data:', error);
    return fallback || null;
  }
};

// Remove data
export const removeData = async (key: string): Promise<void> => {
  try {
    // In React Native, you'd use:
    // await AsyncStorage.removeItem(key);
    console.log(`Removing data for key: ${key}`);
  } catch (error) {
    console.error('Error removing data:', error);
    throw error;
  }
};

// Clear all data
export const clearAllData = async (): Promise<void> => {
  try {
    // In React Native, you'd use:
    // await AsyncStorage.clear();
    console.log('Clearing all stored data');
  } catch (error) {
    console.error('Error clearing data:', error);
    throw error;
  }
};

// ===== PERMISSION UTILITIES =====

// Check camera permission
export const checkCameraPermission = async (): Promise<boolean> => {
  try {
    // In React Native, you'd use expo-camera or react-native-permissions
    // const { status } = await Camera.requestCameraPermissionsAsync();
    // return status === 'granted';
    console.log('Checking camera permission');
    return true; // Placeholder
  } catch (error) {
    console.error('Error checking camera permission:', error);
    return false;
  }
};

// Check media library permission
export const checkMediaLibraryPermission = async (): Promise<boolean> => {
  try {
    // In React Native, you'd use expo-media-library
    // const { status } = await MediaLibrary.requestPermissionsAsync();
    // return status === 'granted';
    console.log('Checking media library permission');
    return true; // Placeholder
  } catch (error) {
    console.error('Error checking media library permission:', error);
    return false;
  }
};

// ===== FILE UTILITIES =====

// Get file extension from filename
export const getFileExtension = (filename: string): string => {
  return filename.split('.').pop()?.toLowerCase() || '';
};

// Check if file is an image
export const isImageFile = (filename: string): boolean => {
  const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp'];
  const extension = getFileExtension(filename);
  return imageExtensions.includes(extension);
};

// Check if file is a document
export const isDocumentFile = (filename: string): boolean => {
  const documentExtensions = ['pdf', 'doc', 'docx', 'txt'];
  const extension = getFileExtension(filename);
  return documentExtensions.includes(extension);
};

// ===== NETWORK UTILITIES =====

// Check network connectivity
export const checkNetworkConnectivity = async (): Promise<boolean> => {
  try {
    // In React Native, you'd use @react-native-community/netinfo
    // const state = await NetInfo.fetch();
    // return state.isConnected && state.isInternetReachable;
    console.log('Checking network connectivity');
    return true; // Placeholder
  } catch (error) {
    console.error('Error checking network connectivity:', error);
    return false;
  }
};

// ===== DEVICE UTILITIES =====

// Get device model
export const getDeviceModel = (): string => {
  // In React Native, you'd use react-native-device-info
  // return DeviceInfo.getModel();
  return Platform.OS === 'ios' ? 'iPhone' : 'Android Device';
};

// Get app version
export const getAppVersion = (): string => {
  // In React Native, you'd use react-native-device-info
  // return DeviceInfo.getVersion();
  return '1.0.0'; // Placeholder
};

// Get build number
export const getBuildNumber = (): string => {
  // In React Native, you'd use react-native-device-info
  // return DeviceInfo.getBuildNumber();
  return '1'; // Placeholder
};

// ===== KEYBOARD UTILITIES =====

// Check if keyboard is visible
export const isKeyboardVisible = (): boolean => {
  // In React Native, you'd use react-native-keyboard-aware-scroll-view
  // or listen to keyboard events
  return false; // Placeholder
};

// ===== HAPTIC FEEDBACK =====

// Trigger haptic feedback
export const triggerHaptic = (type: 'light' | 'medium' | 'heavy' = 'light'): void => {
  try {
    // In React Native, you'd use expo-haptics
    // Haptics.impactAsync(Haptics.ImpactFeedbackStyle[type.toUpperCase()]);
    console.log(`Triggering ${type} haptic feedback`);
  } catch (error) {
    console.error('Error triggering haptic feedback:', error);
  }
};

// ===== ALERT UTILITIES =====

// Show confirmation dialog
export const showConfirmation = (
  title: string,
  message: string,
  confirmText: string = 'OK',
  cancelText: string = 'Cancel'
): Promise<boolean> => {
  return new Promise((resolve) => {
    // In React Native, you'd use Alert.alert
    // Alert.alert(title, message, [
    //   { text: cancelText, onPress: () => resolve(false) },
    //   { text: confirmText, onPress: () => resolve(true) }
    // ]);
    console.log(`Showing confirmation: ${title} - ${message}`);
    resolve(true); // Placeholder - always confirm
  });
};

// ===== VALIDATION UTILITIES =====

// Validate phone number for Indian format
export const validateIndianPhone = (phone: string): boolean => {
  const phoneRegex = /^[6-9]\d{9}$/;
  return phoneRegex.test(phone);
};

// Validate Indian pin code
export const validateIndianPinCode = (pinCode: string): boolean => {
  const pinCodeRegex = /^[1-9][0-9]{5}$/;
  return pinCodeRegex.test(pinCode);
};

// ===== FORMATTING UTILITIES =====

// Format Indian phone number
export const formatIndianPhone = (phone: string): string => {
  if (phone.length === 10) {
    return `+91 ${phone.slice(0, 5)} ${phone.slice(5, 10)}`;
  }
  return phone;
};

// Format Indian currency
export const formatIndianCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
};

// ===== ERROR HANDLING =====

// Handle API errors
export const handleApiError = (error: any): string => {
  if (error?.response?.data?.message) {
    return error.response.data.message;
  }
  if (error?.message) {
    return error.message;
  }
  return 'An unexpected error occurred';
};

// Log error with device info
export const logErrorWithDeviceInfo = (error: any, context: string = 'App'): void => {
  const deviceInfo = {
    platform: Platform.OS,
    version: Platform.Version,
    model: getDeviceModel(),
    appVersion: getAppVersion(),
    buildNumber: getBuildNumber(),
    screenDimensions: { width: SCREEN_WIDTH, height: SCREEN_HEIGHT },
  };
  
  console.error(`[${context}] Error:`, error);
  console.error(`[${context}] Device Info:`, deviceInfo);
};
