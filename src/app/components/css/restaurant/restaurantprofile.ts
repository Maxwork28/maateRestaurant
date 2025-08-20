import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  surface: {
    margin: 16,
    padding: 16,
    borderRadius: 12,
    backgroundColor: '#fff',
    elevation: 2,
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
  },
  cameraIcon: {
    position: 'absolute',
    bottom: -5,
    right: -5,
    backgroundColor: '#ff5722',
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
    color: '#333',
    marginBottom: 8,
    fontWeight: '500',
  },
  input: {
    backgroundColor: '#fff',
    fontSize: 14,
  },
  focusedInput: {
    backgroundColor: '#fff',
  },
  inputOutline: {
    borderColor: '#e0e0e0',
    borderWidth: 1,
  },
  focusedOutline: {
    borderColor: '#ff5722',
    borderWidth: 2,
  },
  uploadButton: {
    borderColor: '#e0e0e0',
    borderWidth: 1,
    backgroundColor: '#f9f9f9',
    marginTop: 8,
  },
  uploadButtonText: {
    color: '#666',
    fontSize: 12,
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
    alignItems: 'center',
    paddingVertical: 20,
  },
  qrContainer: {
    alignItems: 'center',
  },
  qrIcon: {
    backgroundColor: '#fff2f0',
    margin: 0,
  },
  qrText: {
    marginTop: 8,
    fontSize: 14,
    color: '#ff5722',
    fontWeight: '500',
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
    backgroundColor: '#ff5722',
    borderRadius: 25,
    paddingVertical: 8,
  },
  saveProfileButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
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
  backgroundColor: '#fff',
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
  backgroundColor: '#fff',
  height: 200,
},
});