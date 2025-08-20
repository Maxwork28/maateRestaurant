// styles/planStyles.js
import { StyleSheet } from 'react-native';


export const planStyles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  createButton: {
    backgroundColor: '#FF4500',
    borderRadius: 8,
  },
  planCard: {
    backgroundColor: '#FFF5F5',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#FFE4E1',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  planHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  planName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    flex: 1,
  },
  iconsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  editIcon: {
    padding: 4,
    margin: 0,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 16,
  },
  price: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
  },
  period: {
    fontSize: 16,
    color: '#666',
    marginLeft: 4,
  },
  featuresContainer: {
    marginBottom: 16,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  checkIcon: {
    marginRight: 8,
  },
  featureText: {
    fontSize: 14,
    color: '#555',
    flex: 1,
  },
  setMenuButton: {
    backgroundColor: '#FF4500',
    borderRadius: 8,
    paddingVertical: 12,
    flex: 1,
    marginRight: 8,
  },
  setMenuButtonText: {
    color: 'white',
    fontWeight: '600',
    textAlign: 'center',
  },
  setMenuButtonDisabled: {
    backgroundColor: '#cccccc',
    opacity: 0.6,
  },
  setMenuButtonTextDisabled: {
    color: '#666666',
  },
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  editButton: {
    backgroundColor: '#FF4500',
    borderRadius: 8,
    padding: 4,
    justifyContent: 'center',
    alignItems: 'center',
    width: 38,
    height: 38,
  },
});

export const modalStyles = StyleSheet.create({
  modalContainer: {
    backgroundColor: 'white',
    margin: 20,
    borderRadius: 16,
    padding: 20,
  },
  modalHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },


closeIcon: {

  alignSelf: 'flex-end',
  borderColor:'#FF4500'
},

  inputContainer: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333',
  },
  textInput: {
    backgroundColor: '#f8f8f8',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  featuresSection: {
    marginBottom: 20,
  },
  featuresHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  featuresTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  addFeatureButton: {
    backgroundColor: '#FF4500',
    borderRadius: 8,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
    padding: 5,
  },
  featureInput: {
    flex: 1,
    marginRight: 12,
    backgroundColor: 'white',
    borderRadius:18
  },
  deleteFeatureButton: {
    borderColor:'#FF4500',
    display:'flex',
    justifyContent:'center',
    alignItems:'center',
    marginTop:15
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  deleteButton: {
    backgroundColor: '#FF4500',
    borderRadius: 8,
  },
  saveButton: {
    backgroundColor: '#FF4500',
    borderRadius: 8
  },
  scrollView: {
    maxHeight: 250,
  },
});