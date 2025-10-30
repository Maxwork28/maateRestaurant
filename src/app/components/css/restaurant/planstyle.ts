// styles/planStyles.js
import { StyleSheet } from 'react-native';


export const planStyles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#FDF7F1',
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
    color: '#434140',
  },
  createButton: {
    backgroundColor: '#6F32AB',
    borderRadius: 8,
  },
  planCard: {
    backgroundColor: '#FDF7F1',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  planHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  planName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#434140',
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
    color: '#434140',
  },
  period: {
    fontSize: 16,
    color: '#434140',
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
    color: '#434140',
    flex: 1,
  },
  setMenuButton: {
    backgroundColor: '#6F32AB',
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
    backgroundColor: '#6F32AB',
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
    backgroundColor: '#FDF7F1',
    margin: 20,
    borderRadius: 16,
    padding: 20,
  },
  modalHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#434140',
  },


closeIcon: {
  alignSelf: 'flex-end',
  borderColor:'#6F32AB'
},

  inputContainer: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
    color: '#434140',
  },
  textInput: {
    backgroundColor: '#FDF7F1',
    borderRadius: 35,
    height: 40,
    borderTopLeftRadius: 35,
    borderTopRightRadius: 35,
    borderBottomLeftRadius: 35,
    borderBottomRightRadius: 35,
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
    color: '#434140',
  },
  addFeatureButton: {
    backgroundColor: '#6F32AB',
    borderRadius: 8,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: 5,
    padding: 5,
  },
  featureInput: {
    flex: 1,
    marginRight: 12,
    backgroundColor: '#FDF7F1',
    borderRadius: 35,
    height: 40,
    borderTopLeftRadius: 35,
    borderTopRightRadius: 35,
    borderBottomLeftRadius: 35,
    borderBottomRightRadius: 35,
  },
  deleteFeatureButton: {
    borderColor:'#6F32AB',
    display:'flex',
    justifyContent:'center',
    alignItems:'center',
    marginBottom: 0,
    height: 40,
    width: 40,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  deleteButton: {
    backgroundColor: '#6F32AB',
    borderRadius: 8,
  },
  saveButton: {
    backgroundColor: '#6F32AB',
    borderRadius: 8
  },
  scrollView: {
    maxHeight: 250,
  },
});