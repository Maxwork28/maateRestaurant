// styles/ModalStyles.js
import { Dimensions, StyleSheet } from 'react-native';

const { width } = Dimensions.get('window');

export const styles = StyleSheet.create({
  // Modal Container
  modalContainer: {
    backgroundColor: '#ffffff',
    padding: 24,
    margin: 20,
    borderRadius: 20,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 15,
  },
  // Modal Title
  modalTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#2c3e50',
    marginBottom: 24,
    textAlign: 'center',
  },

  // Image Upload Styles
  imageUploadContainer: {
    marginBottom: 20,
    alignItems: 'center',
  },

  imageContainer: {
    position: 'relative',
    borderRadius: 16,
    overflow: 'hidden',
  },

  uploadedImage: {
    width: width - 88,
    height: 200,
    borderRadius: 16,
    resizeMode: 'cover',
  },

  imageOverlay: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    borderRadius: 20,
  },

  uploadPlaceholder: {
    width: width - 88,
    height: 200,
    borderRadius: 16,
    position: 'relative',
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
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  cameraIcon: {
    backgroundColor: '#ff6b35',
    width: 40,
    height: 40,
  },

  cameraIconLarge: {
    backgroundColor: '#ff6b35',
    width: 60,
    height: 60,
    marginBottom: 8,
  },

  uploadText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
    letterSpacing: 1,
  },

  // Form Input Styles
    modalInput: {
    flex: 1,
    margin: 4,
    backgroundColor:'#ffffff'
    },


  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
 modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },

 cancelButton: {
    borderColor: '#ff6b35',
    borderRadius: 8,
    marginHorizontal: 12,
  },
  saveButton: {
    borderColor: '#ff6b35',
    borderRadius: 8,
    marginHorizontal: 12,
  },
});