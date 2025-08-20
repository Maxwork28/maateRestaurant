import { StyleSheet } from 'react-native';


export const styles = StyleSheet.create({
  // Container Styles
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    paddingHorizontal: 16,
  },

  // Search Bar Styles
  searchContainer: {
    marginTop: 20,
    marginBottom: 20,
  },
  searchBar: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },

  // Section Styles
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#2c3e50',
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  seeAllText: {
    color: '#ff6b35',
    fontSize: 14,
    fontWeight: '600',
  },

  // Horizontal Scroll Styles
  horizontalScroll: {
    paddingVertical: 8,
  },

  // Add Card Styles
  addCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    minWidth: 170,
    minHeight: 140,
    borderWidth: 2,
    borderColor: '#e9ecef',
    borderStyle: 'dashed',
  },
  addIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#ff6b35',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  addIcon: {
    fontSize: 24,
    color: '#ffffff',
    fontWeight: 'bold',
  },
  addText: {
    fontSize: 14,
    color: '#6c757d',
    fontWeight: '600',
    textAlign: 'center',
  },
  itemCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    marginRight: 16,
    width: 180,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    overflow: 'hidden',
  },

  itemImage: {
    width: '100%',
    height: 120,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    resizeMode: 'cover',
  },
  
  itemContent: {
    padding: 12
  },
  restaurantName: {
    fontSize: 12,
    color: '#6c757d',
    marginBottom: 4,
  },
  itemName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 8,
    lineHeight: 20,
  },
  price: {
    fontSize: 16,
    fontWeight: '700',
    color: '#ff6b35',
  },

  // Categories Styles
  categoryCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 0,
    width: 180,
    height: 200,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    marginRight: 16,
    elevation: 3,
    shadowRadius: 6,
    overflow: 'hidden',
  },

categoryImageContainer: {
  width: '100%',
  alignItems: 'center',
},

categoryImage: {
  width: '100%',
  height: 100,
  borderTopLeftRadius: 16,
  borderTopRightRadius: 16,
},

categoryContentContainer: {
  flex: 1,
  alignItems: 'center', 
  justifyContent: 'center',
  padding: 12,
},

categoryName: {
  fontSize: 14,
  fontWeight: '600',
  color: '#2c3e50',
  textAlign: 'center',
},

  // Best Seller Styles
  bestSellerCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    marginRight: 16,
    width: 160,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    overflow: 'hidden',
  },
  bestSellerImage: {
    width: '100%',
    height: 100,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    resizeMode: 'cover',
  },
  bestSellerContent: {
    padding: 12,
  },
  bestSellerName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 6,
    lineHeight: 18,
  },
  bestSellerPrice: {
    fontSize: 16,
    fontWeight: '700',
    color: '#ff6b35',
    marginBottom: 4,
  },
  soldCount: {
    fontSize: 12,
    color: '#28a745',
    fontWeight: '500',
  },
  promoContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
  },
 promoCard: {
  backgroundColor: '#ff6b35',
  borderRadius: 16,
  padding: 0,
  elevation: 4,
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.2,
  shadowRadius: 8,
  marginRight: 12,
  width: 280, 
},

promoImage: {
  width: 80,
  height: 80,
  borderRadius: 12,
  marginRight: 16,
  resizeMode: 'cover',
},

  promoTextContainer: {
    flex: 1,
  },
  promoTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 8,
    lineHeight: 22,
  },
  promoPrice: {
    fontSize: 28,
    fontWeight: '900',
    color: '#ffffff',
  },
  offersHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  offersTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#2c3e50',
    flex: 1,
  },
  addOfferButton: {
    borderColor: '#ff6b35',
    borderRadius: 8,
    marginHorizontal: 12,
  },
  addOfferText: {
    color: '#ff6b35',
    fontSize: 12,
  },

  // Item Count Styles
  itemCount: {
    fontSize: 12,
    color: '#6c757d',
    fontWeight: '500',
    marginTop: 4,
  },

  // Loading Styles
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  loadingText: {
    fontSize: 14,
    color: '#6c757d',
    marginTop: 8,
    fontWeight: '500',
  },

  // No Data Styles
  noDataContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    marginHorizontal: 8,
  },
  noDataText: {
    fontSize: 16,
    color: '#6c757d',
    fontWeight: '600',
    marginBottom: 4,
  },
  noDataSubtext: {
    fontSize: 14,
    color: '#adb5bd',
    textAlign: 'center',
  },
  
});