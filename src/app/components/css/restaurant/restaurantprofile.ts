import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FDF7F1',
  },
  surface: {
    marginHorizontal: 0,
    paddingLeft: 24, // Increased left padding to shift content right
    paddingRight: 16, // Keep right padding as is
    paddingVertical: 16,
    borderRadius: 0,
    backgroundColor: 'transparent',
    elevation: 0,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 16,
  },
  avatar: {
    backgroundColor: '#9e9e9e',
    borderWidth: 3,
    borderColor: '#FF8C00',
  },
  cameraIcon: {
    position: 'absolute',
    bottom: -5,
    right: -5,
    backgroundColor: '#8A2BE2',
    width: 28,
    height: 28,
  },
  headerText: {
    flex: 1,
  },
  name: {
    fontWeight: 'bold',
    color: '#333',
  },
  fssaiText: {
    color: '#666',
    marginTop: 2,
  },
  divider: {
    marginBottom: 20,
  },
  formContainer: {
    gap: 16,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  fullWidth: {
    flex: 1,
  },
  halfWidth: {
    flex: 1,
  },
  thirdWidth: {
    flex: 1,
  },
  label: {
    fontSize: 14,
    color: '#333333',
    marginBottom: 8,
    fontWeight: '400',
  },
  input: {
    backgroundColor: '#FFFBF7',
    fontSize: 14,
    borderRadius: 15,
    paddingRight: 8,
    paddingLeft: 8,
    height: 48, // Explicitly set height to match uploadButton
    justifyContent: 'center', // Center text vertically
  },
  dateInput: {
    backgroundColor: '#FFFBF7',
    fontSize: 14,
    borderRadius: 15,
    paddingRight: 4, // Reduced padding to bring icon closer to text
    paddingLeft: 0, // Balanced left padding for proper text visibility
    height: 48,
    justifyContent: 'center',
    textAlign: 'left', // Ensure text is left-aligned
  },
  focusedInput: {
    backgroundColor: '#FFFBF7',
  },
  inputOutline: {
    borderColor: '#CCCCCC',
    borderWidth: 1,
    borderRadius: 15,
  },
  focusedOutline: {
    borderColor: '#8A2BE2',
    borderWidth: 1,
    borderRadius: 15,
  },
  uploadButton: {
    borderColor: '#CCCCCC',
    borderWidth: 1,
    backgroundColor: '#FFFBF7',
    borderRadius: 15,
    paddingRight: 8,
    paddingLeft: 8,
    height: 48,
    justifyContent: 'center',
  },
  uploadButtonText: {
    color: '#333333',
    fontSize: 14,
  },
  radioContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    gap: 20,
  },
  radioItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  menuScrollView: {
    maxHeight: 200,
  },
  qrSection: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 20,
    gap: 16,
  },
  qrContainer: {
    alignItems: 'center',
  },
  qrIcon: {
    backgroundColor: '#FF8C00',
    margin: 0,
    borderRadius: 50,
    width: 100,
    height: 100,
  },
  qrText: {
    fontSize: 16,
    color: '#333333',
    fontWeight: '600',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
    marginTop: 8,
  },
  saveButton: {
    backgroundColor: '#ff5722',
    borderRadius: 25,
    marginTop: 24,
    marginHorizontal: 20,
    paddingVertical: 8,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  saveContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  saveProfileButton: {
    backgroundColor: '#8A2BE2',
    borderRadius: 15,
    paddingVertical: 12,
    paddingRight: 8,
    paddingLeft: 8,
  },
  saveProfileButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  qrImageContainer: {
    alignItems: 'center',
  },
  qrUploadedText: {
    marginTop: 8,
    fontSize: 14,
    color: '#4CAF50',
    fontWeight: '500',
  },
  // Updated styles for iOS DatePicker
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  iosDatePickerContainer: {
    backgroundColor: '#FDF7F1',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 20,
  },
  iosDatePickerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  iosDatePickerButton: {
    paddingHorizontal: 15,
    paddingVertical: 8,
  },
  iosDatePickerButtonText: {
    fontSize: 16,
    color: '#007AFF',
  },
  iosDatePickerDoneText: {
    fontWeight: '600',
  },
  iosDatePickerTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
  iosDatePicker: {
    backgroundColor: '#FDF7F1',
    height: 200,
  },
  // Image display styles
  imageSection: {
    marginTop: 16,
    marginBottom: 8,
  },
  imageLabel: {
    fontSize: 14,
    color: '#333',
    marginBottom: 8,
    fontWeight: '500',
  },
  imageRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginTop: 8,
  },
  imageContainer: {
    alignItems: 'center',
    marginBottom: 8,
  },
  thumbnail: {
    width: 80,
    height: 80,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  imageIndex: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
    textAlign: 'center',
  },
  // Image modal styles
  imageModalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
  },
  imageModalContainer: {
    backgroundColor: '#FDF7F1',
    borderRadius: 12,
    padding: 20,
    margin: 20,
    maxWidth: '90%',
    maxHeight: '80%',
  },
  fullImage: {
    width: 300,
    height: 300,
    borderRadius: 8,
  },
  closeImageModalButton: {
    position: 'absolute',
    top: -10,
    right: -10,
    backgroundColor: '#ff5722',
  },
  // Remove button styles
  removeButton: {
    backgroundColor: '#ff4444',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginTop: 4,
  },
  removeButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '500',
  },
  // Debug info styles
  debugInfo: {
    marginTop: 16,
    padding: 12,
    backgroundColor: '#FDF7F1',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  debugText: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
});