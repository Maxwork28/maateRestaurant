import { StyleSheet } from 'react-native';


export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FDF7F1',
  },
  // Content Styles
  content: {
    flex: 1,
    backgroundColor: '#FDF7F1',
  },

  // Tab Styles
  tabContainer: {
    flexDirection: 'row',
    margin: 20,
    backgroundColor: '#FDF7F1',
    borderRadius: 25,
    padding: 5,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 20,
    alignItems: 'center',
  },
  activeTab: {
    backgroundColor: '#6F32AB',
  },
  inactiveTab: {
    backgroundColor: 'transparent',
  },
  tabText: {
    fontSize: 16,
    fontWeight: '600',
  },
  activeTabText: {
    color: '#FFFFFF',
  },
  inactiveTabText: {
    color: '#434140',
  },

  // Order List Styles
  orderList: {
    paddingHorizontal: 20,
  },
  orderItem: {
    backgroundColor: '#FDF7F1',
    borderRadius: 16,
    padding: 20,
    marginBottom: 15,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  orderHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  orderTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#434140',
    flex: 1,
  },
  orderPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#6F32AB',
    marginRight: 10,
  },
  arrow: {
    fontSize: 20,
    color: '#6F32AB',
  },
  orderDate: {
    fontSize: 14,
    color: '#434140',
    fontWeight: '500',
  },

  // Order Details Styles
  orderDetailsSection: {
    backgroundColor: '#FDF7F1',
    margin: 20,
    borderRadius: 16,
    padding: 20,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#434140',
    marginBottom: 20,
  },
  orderInfo: {
    marginBottom: 20,
  },
  orderNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#434140',
    marginBottom: 5,
  },
  orderDateTime: {
    fontSize: 14,
    color: '#434140',
    fontWeight: '500',
  },

  // User Info Styles
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 25,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  userDetails: {
    marginLeft: 15,
  },
  userName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#434140',
    marginBottom: 3,
  },
  userSince: {
    fontSize: 14,
    color: '#434140',
    fontWeight: '500',
  },

  // Delivery Address Styles
  deliverySection: {
    marginBottom: 25,
  },
  deliveryTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#434140',
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
    color: '#434140',
    fontWeight: '600',
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
    color: '#434140',
    marginBottom: 5,
    fontWeight: '500',
  },
  infoValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#434140',
  },

  // Description Styles
  description: {
    fontSize: 14,
    color: '#434140',
    lineHeight: 20,
    marginBottom: 25,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    fontWeight: '500',
  },

  // Order Menu Styles
  orderMenuSection: {
    marginTop: 10,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 15,
    borderRadius: 12,
    marginTop: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  menuItemImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
  },
  menuItemName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#434140',
    flex: 1,
  },
  menuItemPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#6F32AB',
  },
  // Add these to your styles object in ordertracking.js
menuItemInfo: {
  flex: 1,
  marginLeft: 10,
},
menuItemQuantity: {
  fontSize: 14,
  color: '#434140',
  marginTop: 2,
  fontWeight: '500',
},
noOrderText: {
  textAlign: "center",
  color: "#434140",
  fontSize: 16,
  marginTop: 20,
  fontWeight: "bold",
},
noOrderDetails: {
  padding: 20,
  alignItems: "center",
  justifyContent: "center",
},
selectedOrderItem: {
  backgroundColor: '#F0E6FF',  
  borderColor: '#6F32AB', 
  borderWidth: 2,
},

});