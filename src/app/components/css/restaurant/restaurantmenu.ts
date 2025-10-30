import { StyleSheet } from 'react-native';


export const styles = StyleSheet.create({
  // Container Styles
  container: {
    flex: 1,
    backgroundColor: '#FDF7F1',
    paddingHorizontal: 16,
  },

  // Search Bar Styles
  searchContainer: {
    marginTop: 20,
    marginBottom: 20,
  },
  searchBar: {
    backgroundColor: '#FDF7F1',
    borderRadius: 25,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    borderWidth: 1,
    borderColor: '#D3D3D3',
    height: 45,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  searchIconContainer: {
    marginRight: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    paddingVertical: 0,
    includeFontPadding: false,
    textAlignVertical: 'center',
  },

  // Section Styles
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#434140',
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  seeAllText: {
    color: '#800080',
    fontSize: 14,
    fontWeight: '600',
    paddingVertical: 8,
  },

  // Grid Layout Styles
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
  },

  // Individual card wrapper for 2-column grid
  cardWrapper: {
    width: '48%',
    marginBottom: 12,
  },

  // Tab Styles
  tabContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },

  segmentedButtons: {
    backgroundColor: '#FDF7F1',
  },

  // Back Button
  backButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: '#FDF7F1',
  },

  // Horizontal Scroll Styles
  horizontalScroll: {
    paddingVertical: 8,
  },

  // Add Card Styles
  addCard: {
    backgroundColor: '#FDF7F1',
    borderRadius: 25,
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
    width: 150,
    height: 200,
    borderWidth: 1,
    borderColor: '#CECAC5',
    borderStyle: 'dashed',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 14 },
    shadowOpacity: 0.05,
    shadowRadius: 23,
    elevation: 8,
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
    backgroundColor: '#FDF7F1',
    borderRadius: 25,
    marginRight: 8,
    width: 150,
    height: 200,
    justifyContent: 'space-between',
    padding: 10,
    borderWidth: 1,
    borderColor: '#CECAC5',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 14 },
    shadowOpacity: 0.05,
    shadowRadius: 23,
    elevation: 8,
  },

  itemImage: {
    width: '100%',
    height: 120,
    borderRadius: 16,
    resizeMode: 'cover',
    marginBottom: 0
  },
  
  itemContent: {
    padding: 0,
    flex: 1,
    justifyContent: 'flex-end',
    flexDirection: 'column',
    marginTop: -12,
  },
  restaurantName: {
    fontSize: 10,
    color: '#434140',
    marginBottom: 2,
    fontWeight: '500',
  },
  itemName: {
    fontSize: 12,
    fontWeight: '700',
    color: '#434140',
    marginBottom: 2,
    lineHeight: 14,
  },
  price: {
    fontSize: 14,
    fontWeight: '900',
    color: '#434140',
  },

  // Categories Styles
  categoryCard: {
    backgroundColor: '#FDF7F1',
    borderRadius: 25,
    padding: 10,
    width: 150,
    height: 200,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#CECAC5',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 14 },
    shadowOpacity: 0.05,
    shadowRadius: 23,
    elevation: 8,
    justifyContent: 'space-between',
  },

categoryImageContainer: {
  width: '100%',
  alignItems: 'center',
},

categoryImage: {
  width: '100%',
  height: 120,
  borderRadius: 16,
  marginBottom: 4,
},

categoryContentContainer: {
  flex: 1,
  alignItems: 'flex-start', 
  justifyContent: 'flex-end',
  padding: 0,
  flexDirection: 'column',
  marginTop: -12,
},

categoryName: {
  fontSize: 12,
  fontWeight: '700',
  color: '#434140',
  textAlign: 'left',
  marginBottom: 2,
  lineHeight: 14,
},
categoryDescription: {
  fontSize: 10,
  color: '#434140',
  textAlign: 'left',
  marginBottom: 2,
  fontWeight: '500',
},

  // Best Seller Styles
  bestSellerCard: {
    backgroundColor: '#FDF7F1',
    borderRadius: 25,
    marginRight: 8,
    width: 150,
    height: 200,
    padding: 10,
    borderWidth: 1,
    borderColor: '#CECAC5',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 14 },
    shadowOpacity: 0.05,
    shadowRadius: 23,
    elevation: 8,
    justifyContent: 'space-between',
  },
  bestSellerImage: {
    width: '100%',
    height: 120,
    borderRadius: 16,
    resizeMode: 'cover',
    marginBottom: 4,
  },
  bestSellerContent: {
    padding: 0,
    flex: 1,
    justifyContent: 'flex-end',
    flexDirection: 'column',
    marginTop: -12,
  },
  bestSellerName: {
    fontSize: 12,
    fontWeight: '600',
    color: '#434140',
    marginBottom: 2,
    lineHeight: 14,
  },
  bestSellerPrice: {
    fontSize: 16,
    fontWeight: '900',
    color: '#800080',
    marginBottom: 2,
  },
  soldCount: {
    fontSize: 10,
    color: '#434140',
    fontWeight: '500',
  },
  soldTrend: {
    fontSize: 10,
    color: '#28a745',
    fontWeight: '500',
  },
  promoContent: {
    flexDirection: 'column',
    alignItems: 'center',
    padding: 0,
    flex: 1,
    justifyContent: 'space-between',
  },
 promoCard: {
  backgroundColor: '#FDF7F1',
  borderRadius: 25,
  padding: 10,
  borderWidth: 1,
  borderColor: '#CECAC5',
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 14 },
  shadowOpacity: 0.05,
  shadowRadius: 23,
  elevation: 8,
  marginRight: 8,
  width: 150,
  height: 200,
  justifyContent: 'space-between',
},

promoImage: {
  width: '100%',
  height: 120,
  borderRadius: 16,
  resizeMode: 'cover',
  marginBottom: 4,
},

  promoTextContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginTop: -12,
  },
  promoTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#434140',
    marginBottom: 2,
    lineHeight: 14,
    textAlign: 'center',
  },
  promoPrice: {
    fontSize: 14,
    fontWeight: '900',
    color: '#434140',
    textAlign: 'center',
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
    color: '#434140',
    flex: 1,
  },
  addOfferButton: {
    borderWidth: 0,
    marginHorizontal: 12,
    minWidth: 20,
    height: 32,
    backgroundColor: 'transparent',
    paddingHorizontal: 0,
    paddingVertical: 0,
    margin: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addOfferText: {
    color: '#800080',
    fontSize: 24,
    fontWeight: '900',
    lineHeight: 24,
    textAlign: 'center',
  },

  // Item Count Styles
  itemCount: {
    fontSize: 12,
    color: '#434140',
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
    color: '#434140',
    marginTop: 8,
    fontWeight: '500',
  },

  // No Data Styles
  noDataContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
    backgroundColor: '#FDF7F1',
    borderRadius: 12,
    marginHorizontal: 8,
  },
  noDataText: {
    fontSize: 16,
    color: '#434140',
    fontWeight: '600',
    marginBottom: 4,
  },
  noDataSubtext: {
    fontSize: 14,
    color: '#434140',
    textAlign: 'center',
  },

  // Selection and Action Button Styles
  selectedCard: {
    borderWidth: 2,
    borderColor: '#800080',
    elevation: 4,
    shadowColor: '#800080',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  actionButtons: {
    position: 'absolute',
    top: 8,
    right: 8,
    flexDirection: 'row',
    gap: 4,
  },
  actionButton: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  actionIcon: {
    margin: 0,
    width: 32,
    height: 32,
  },
  eyeIcon: {
    margin: 0,
    width: 32,
    height: 32,
    backgroundColor: '#800080',
  },
  
});