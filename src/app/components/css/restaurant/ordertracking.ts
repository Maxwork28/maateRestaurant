import { StyleSheet } from 'react-native';


export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  // Content Styles
  content: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },

  // Tab Styles
  tabContainer: {
    flexDirection: 'row',
    margin: 20,
    backgroundColor: '#ffffff',
    borderRadius: 25,
    padding: 5,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 20,
    alignItems: 'center',
  },
  activeTab: {
    backgroundColor: '#FF4500',
  },
  inactiveTab: {
    backgroundColor: 'transparent',
  },
  tabText: {
    fontSize: 16,
    fontWeight: '600',
  },
  activeTabText: {
    color: '#ffffff',
  },
  inactiveTabText: {
    color: '#666666',
  },

  // Order List Styles
  orderList: {
    paddingHorizontal: 20,
  },
  orderItem: {
    backgroundColor: '#ffffff',
    borderRadius: 15,
    padding: 20,
    marginBottom: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  orderHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  orderTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333333',
    flex: 1,
  },
  orderPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FF4500',
    marginRight: 10,
  },
  arrow: {
    fontSize: 20,
    color: '#cccccc',
  },
  orderDate: {
    fontSize: 14,
    color: '#999999',
  },

  // Order Details Styles
  orderDetailsSection: {
    backgroundColor: '#ffffff',
    margin: 20,
    borderRadius: 15,
    padding: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 20,
  },
  orderInfo: {
    marginBottom: 20,
  },
  orderNumber: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 5,
  },
  orderDateTime: {
    fontSize: 14,
    color: '#999999',
  },

  // User Info Styles
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 25,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eeeeee',
  },
  userDetails: {
    marginLeft: 15,
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 3,
  },
  userSince: {
    fontSize: 14,
    color: '#999999',
  },

  // Delivery Address Styles
  deliverySection: {
    marginBottom: 25,
  },
  deliveryTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 10,
  },
  addressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationIcon: {
    marginRight: 10,
  },
  address: {
    fontSize: 16,
    color: '#333333',
    fontWeight: '500',
  },

  // Info Row Styles
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  infoItem: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 14,
    color: '#999999',
    marginBottom: 5,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
  },

  // Description Styles
  description: {
    fontSize: 14,
    color: '#666666',
    lineHeight: 20,
    marginBottom: 25,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eeeeee',
  },

  // Order Menu Styles
  orderMenuSection: {
    marginTop: 10,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
    padding: 15,
    borderRadius: 10,
    marginTop: 10,
  },
  menuItemImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
  },
  menuItemName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333333',
    flex: 1,
  },
  menuItemPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FF4500',
  },
  // Add these to your styles object in ordertracking.js
menuItemInfo: {
  flex: 1,
  marginLeft: 10,
},
menuItemQuantity: {
  fontSize: 14,
  color: '#666',
  marginTop: 2,
},
noOrderText: {
  textAlign: "center",
  color: "#999",
  fontSize: 16,
  marginTop: 20,
  fontWeight: "500",
},
noOrderDetails: {
  padding: 20,
  alignItems: "center",
  justifyContent: "center",
},
selectedOrderItem: {
  backgroundColor: '#FFF4EC',  
  borderColor: '#FF4500', 
  borderWidth: 1,
},

});