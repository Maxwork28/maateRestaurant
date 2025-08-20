import { StyleSheet } from 'react-native';
export const styles = StyleSheet.create({

  // Modal Styles
  modalContainer: {
    backgroundColor: '#ffffff',
    padding: 24,
    margin: 20,
    borderRadius: 16,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#2c3e50',
    marginBottom: 20,
    textAlign: 'center',
  },
  modalInput: {
    marginBottom: 16,
    backgroundColor: '#f8f9fa',
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
  imageUploadContainer: {
  marginBottom: 16,
  alignItems: "center",
},
uploadedImage: {
  width: 200,
  height: 120,
  borderRadius: 12,
},
imageOverlay: {
  position: "absolute",
  right: 8,
  top: 8,
},
uploadPlaceholder: {
  width: 200,
  height: 120,
  borderRadius: 12,
  backgroundColor: "#f0f0f0",
  justifyContent: "center",
  alignItems: "center",
  overflow: "hidden",
},
defaultImage: {
  width: "100%",
  height: "100%",
  resizeMode: "cover",
},
uploadOverlay: {
  position: "absolute",
  justifyContent: "center",
  alignItems: "center",
  width: "100%",
  height: "100%",
  backgroundColor: "rgba(0,0,0,0.4)",
},
uploadText: {
  color: "#fff",
  fontWeight: "600",
  marginTop: 4,
},
cameraIcon: {
  backgroundColor: "#ff6b35",
},
cameraIconLarge: {
  backgroundColor: "#ff6b35",
  marginBottom: 4,
},
imageContainer: {
  width: 200,
  height: 120,
  borderRadius: 12,
  overflow: "hidden",
  position: "relative",
  marginBottom: 16,
},

});