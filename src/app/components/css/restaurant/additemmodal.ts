import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  // Modal Container
  modalContainer: {
    backgroundColor: '#FDF7F1',
    margin: 8,
    borderRadius: 16,
    padding: 0,
    maxHeight: '95%',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
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
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingBottom: 16,
  },
  uploadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    paddingLeft: 12,
    paddingRight: 6,
    paddingVertical: 1,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  cameraIconLarge: {
    backgroundColor: 'transparent',
    marginLeft: 6,
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
    borderTopLeftRadius: 35,
    borderTopRightRadius: 35,
    borderBottomLeftRadius: 35,
    borderBottomRightRadius: 35,
  },
  modalInputMultiline: {
    marginBottom: 8,
    backgroundColor: '#FDF7F1',
    borderRadius: 30,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    minHeight: 80,
  },
  modalText: {
    color: '#434140',
  },
  inputLabel: {
    color: '#434140',
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
    marginBottom: 8,
  },
  fullWidthInput: {
    marginBottom: 8,
  },

  // Button Styles
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 12,
    gap: 12,
  },
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