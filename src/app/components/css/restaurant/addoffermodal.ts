import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  // Modal Container
  modalContainer: {
    backgroundColor: '#FDF7F1',
    margin: 8,
    borderRadius: 16,
    padding: 0,
    height: '90%',
    maxHeight: '90%',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
  },

  // Tab Navigation Styles
  tabContainer: {
    backgroundColor: '#FDF7F1',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    paddingVertical: 8,
  },
  tabScrollView: {
    paddingHorizontal: 12,
  },
  tabButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    borderRadius: 20,
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  activeTab: {
    backgroundColor: '#6F32AB',
    borderColor: '#6F32AB',
  },
  tabText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#434140',
  },
  activeTabText: {
    color: '#ffffff',
  },

  // Tab Content Styles
  tabContent: {
    flex: 1,
    padding: 12,
  },

  // Image Upload Styles
  imageUploadContainer: {
    marginBottom: 12,
    borderRadius: 12,
    overflow: 'hidden',
  },
  imageContainer: {
    position: 'relative',
    width: '100%',
    height: 200,
  },
  uploadedImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  imageOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cameraIcon: {
    backgroundColor: 'rgba(255, 107, 53, 0.8)',
  },
  uploadPlaceholder: {
    width: '100%',
    height: 200,
    position: 'relative',
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    overflow: 'hidden',
  },
  defaultImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  uploadOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cameraIconLarge: {
    backgroundColor: 'rgba(255, 107, 53, 0.9)',
    marginBottom: 8,
  },
  uploadText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 1,
  },

  // Form Input Styles
  modalInput: {
    marginBottom: 8,
    backgroundColor: '#FDF7F1',
    borderRadius: 35,
    height: 40,
  },
  modalInputMultiline: {
    marginBottom: 8,
    backgroundColor: '#FDF7F1',
    borderRadius: 30,
    minHeight: 80,
  },
  inputLabel: {
    color: '#434140',
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  rowContainer: {
    marginBottom: 8,
  },

  // Close Button Styles
  closeButton: {
    position: 'absolute',
    top: 12,
    left: 12,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },

  // Button Styles
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
    gap: 12,
    paddingHorizontal: 12,
    paddingBottom: 12,
  },
  cancelButton: {
    flex: 1,
    borderColor: '#ff6b35',
    borderWidth: 1,
  },
  saveButton: {
    flex: 1,
    backgroundColor: '#6F32AB',
    opacity: 0.5,
  },
  saveButtonActive: {
    flex: 1,
    backgroundColor: '#6F32AB',
    opacity: 1,
  },
});