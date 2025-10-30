import React, { useState, useEffect, useCallback } from "react";
import { Image, ScrollView, Text, TouchableOpacity, View, Alert, TextInput } from "react-native";
import {
  Button,
  Card,
  Provider as PaperProvider,
  Surface,
  ActivityIndicator,
  IconButton,
  Icon,
  SegmentedButtons,
} from "react-native-paper";
import { styles } from "../css/restaurant/restaurantmenu";
import { useAppSelector } from "../../../store/hooks";
import { apiConnector } from "../../../utils";
import AddItemModal from "./add-item-modal";
import AddCategoryModal from "./add-category-modal";
import AddOfferModal from "./add-offer-modal";

// Types (reusing from menuitems.tsx)
interface Category {
  id: string;
  name: string;
  image: string;
  description?: string;
  isActive?: boolean;
  itemCount?: number;
  createdAt?: string;
  updatedAt?: string;
}

interface ApiCategory {
  _id: string;
  id?: string;
  name: string;
  image: string;
  description?: string;
  isActive: boolean;
  itemCount: number;
  createdAt: string;
  updatedAt: string;
}

interface Item {
  id: string;
  name: string;
  category?: { name: string };
  price: number;
  image: string;
  totalOrder?: number;
  [key: string]: any;
}

interface Offer {
  _id?: string;
  id?: string;
  offerTitle: string;
  discountAmount: number;
  offerImage: string;
  startDate?: string;
  endDate?: string;
  isActive?: boolean;
  [key: string]: any;
}

interface ItemData {
  id: string;
  name: string;
  category: string;
  description: string;
  itemCategory: string;
  price: number;
  availability: string;
  isDietMeal: boolean;
  calories: number;
  image: string;
  restaurant: string;
  isVegetarian: boolean;
}

interface CategoryData {
  id: string;
  name: string;
  description: string;
  image: string;
}

interface OfferData {
  id: string;
  title: string;
  description: string;
  image: string;
  discountType: 'percentage' | 'flat';
  discountValue: string;
  minOrderValue: string;
  maxDiscountAmount: string;
  usageLimit: string;
  usagePerUser: string;
  validFrom: string;
  validTo: string;
  isActive: boolean;
  applicableCategories: string[];
  applicableItems: string[];
  termsAndConditions: string;
}

// Constants
const IMAGE_MAP: Record<string, any> = {
  "burger.jpg": require("../../../../assets/images/burger.jpg"),
  "veg.jpg": require("../../../../assets/images/veg.jpg"),
  "non-veg.jpg": require("../../../../assets/images/non-veg.jpg"),
  "beverages.jpg": require("../../../../assets/images/beverages.jpg"),
  "bestseller.png": require("../../../../assets/images/bestseller.png"),
  "spoffer2.jpg": require("../../../../assets/images/spoffer2.jpg"),
};

const DEFAULT_IMAGE = require("../../../../assets/images/burger.jpg");

// Utility functions
const resolveImage = (filename: string): any => {
  return IMAGE_MAP[filename] || DEFAULT_IMAGE;
};

const isImageUrl = (image: string): boolean => {
  return Boolean(image && (image.startsWith("http") || image.startsWith("file")));
};

// Card Components (reusing from menuitems.tsx)
const ItemCard = React.memo<{ 
  item: Item; 
  isSelected: boolean; 
  onSelect: () => void; 
  onView: () => void;
  onEdit: () => void; 
  onDelete: () => void; 
}>(({ item, isSelected, onSelect, onView, onEdit, onDelete }) => (
  <TouchableOpacity onPress={onSelect} activeOpacity={0.8}>
    <View style={[styles.itemCard, isSelected && styles.selectedCard]}>
      <Image
        source={
          isImageUrl(item.image) 
            ? { uri: item.image }
            : resolveImage("burger.jpg")
        }
        resizeMode="cover"
        style={styles.itemImage}
      />
      <View style={styles.itemContent}>
        <Text style={styles.itemName} numberOfLines={1}>
          {item.name}
        </Text>
        <Text style={styles.restaurantName} numberOfLines={1}>
          {item.category?.name || 'Uncategorized'}
        </Text>
        <Text style={styles.price} numberOfLines={1}>₹{item.price}</Text>
      </View>
      {isSelected && (
        <View style={styles.actionButtons}>
          <TouchableOpacity onPress={onView} style={styles.actionButton}>
            <IconButton
              icon="eye"
              size={16}
              iconColor="#fff"
              style={styles.eyeIcon}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={onEdit} style={styles.actionButton}>
            <IconButton
              icon="pencil"
              size={16}
              iconColor="#fff"
              style={[styles.actionIcon, { backgroundColor: '#4CAF50' }]}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={onDelete} style={styles.actionButton}>
            <IconButton
              icon="delete"
              size={16}
              iconColor="#fff"
              style={[styles.actionIcon, { backgroundColor: '#f44336' }]}
            />
          </TouchableOpacity>
        </View>
      )}
    </View>
  </TouchableOpacity>
));

const CategoryCard = React.memo<{ 
  category: Category; 
  isSelected: boolean; 
  onSelect: () => void; 
  onView: () => void;
  onEdit: () => void; 
  onDelete: () => void; 
}>(({ category, isSelected, onSelect, onView, onEdit, onDelete }) => (
  <TouchableOpacity onPress={onSelect} activeOpacity={0.8}>
    <View style={[styles.categoryCard, isSelected && styles.selectedCard]}>
      <Image
        source={
          isImageUrl(category.image) 
            ? { uri: category.image }
            : resolveImage("burger.jpg")
        }
        resizeMode="cover"
        style={styles.categoryImage}
      />
      <View style={styles.categoryContentContainer}>
        <Text style={styles.categoryName} numberOfLines={1}>
          {category.name}
        </Text>
        {category.itemCount !== undefined && (
          <Text style={styles.categoryDescription} numberOfLines={1}>
            {category.itemCount} items
          </Text>
        )}
        <Text style={styles.price} numberOfLines={1}>View Items</Text>
      </View>
      {isSelected && (
        <View style={styles.actionButtons}>
          <TouchableOpacity onPress={onView} style={styles.actionButton}>
            <IconButton
              icon="eye"
              size={16}
              iconColor="#fff"
              style={styles.eyeIcon}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={onEdit} style={styles.actionButton}>
            <IconButton
              icon="pencil"
              size={16}
              iconColor="#fff"
              style={[styles.actionIcon, { backgroundColor: '#4CAF50' }]}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={onDelete} style={styles.actionButton}>
            <IconButton
              icon="delete"
              size={16}
              iconColor="#fff"
              style={[styles.actionIcon, { backgroundColor: '#f44336' }]}
            />
          </TouchableOpacity>
        </View>
      )}
    </View>
  </TouchableOpacity>
));

const BestSellerCard = React.memo<{ 
  item: Item; 
  isSelected: boolean; 
  onSelect: () => void; 
  onView: () => void;
  onEdit: () => void; 
  onDelete: () => void; 
}>(({ item, isSelected, onSelect, onView, onEdit, onDelete }) => (
  <TouchableOpacity onPress={onSelect} activeOpacity={0.8}>
    <View style={[styles.bestSellerCard, isSelected && styles.selectedCard]}>
      <Image 
        source={
          isImageUrl(item.image) 
            ? { uri: item.image }
            : resolveImage("burger.jpg")
        } 
        style={styles.bestSellerImage} 
      />
      <View style={styles.bestSellerContent}>
        <Text style={styles.bestSellerName} numberOfLines={1}>
          {item.name}
        </Text>
        <Text style={styles.bestSellerPrice} numberOfLines={1}>₹{item.price}</Text>
        {item.totalOrder && item.totalOrder > 0 && (
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text style={styles.soldCount} numberOfLines={1}>
              Sold {item.totalOrder > 1000 ? `${(item.totalOrder / 1000).toFixed(1)}k` : item.totalOrder}
            </Text>
            <Text style={styles.soldCount} numberOfLines={1}> | </Text>
            <Text style={styles.soldTrend} numberOfLines={1}>
              +15% ↑
            </Text>
          </View>
        )}
      </View>
      {isSelected && (
        <View style={styles.actionButtons}>
          <TouchableOpacity onPress={onView} style={styles.actionButton}>
            <IconButton
              icon="eye"
              size={16}
              iconColor="#fff"
              style={styles.eyeIcon}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={onEdit} style={styles.actionButton}>
            <IconButton
              icon="pencil"
              size={16}
              iconColor="#fff"
              style={[styles.actionIcon, { backgroundColor: '#4CAF50' }]}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={onDelete} style={styles.actionButton}>
            <IconButton
              icon="delete"
              size={16}
              iconColor="#fff"
              style={[styles.actionIcon, { backgroundColor: '#f44336' }]}
            />
          </TouchableOpacity>
        </View>
      )}
    </View>
  </TouchableOpacity>
));

const OfferCard = React.memo<{ 
  offer: Offer; 
  isSelected: boolean; 
  onSelect: () => void; 
  onView: () => void;
  onEdit: () => void; 
  onDelete: () => void; 
}>(({ offer, isSelected, onSelect, onView, onEdit, onDelete }) => (
  <TouchableOpacity onPress={onSelect} activeOpacity={0.8}>
    <View style={[styles.promoCard, isSelected && styles.selectedCard]}>
      <Image
        source={
          isImageUrl(offer.offerImage)
            ? { uri: offer.offerImage }
            : resolveImage("spoffer2.jpg")
        }
        style={styles.promoImage}
      />
      <View style={styles.promoTextContainer}>
        <Text style={styles.promoTitle} numberOfLines={1}>
          {offer.offerTitle}
        </Text>
        <Text style={styles.promoPrice} numberOfLines={1}>₹{offer.discountAmount}</Text>
      </View>
      {isSelected && (
        <View style={styles.actionButtons}>
          <TouchableOpacity onPress={onView} style={styles.actionButton}>
            <IconButton
              icon="eye"
              size={16}
              iconColor="#fff"
              style={styles.eyeIcon}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={onEdit} style={styles.actionButton}>
            <IconButton
              icon="pencil"
              size={16}
              iconColor="#fff"
              style={[styles.actionIcon, { backgroundColor: '#4CAF50' }]}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={onDelete} style={styles.actionButton}>
            <IconButton
              icon="delete"
              size={16}
              iconColor="#fff"
              style={[styles.actionIcon, { backgroundColor: '#f44336' }]}
            />
          </TouchableOpacity>
        </View>
      )}
    </View>
  </TouchableOpacity>
));

// Main Component
interface SeeAllPageProps {
  initialTab?: 'items' | 'categories' | 'bestSellers' | 'offers';
  onBack?: () => void;
}

const SeeAllPage: React.FC<SeeAllPageProps> = ({ 
  initialTab = 'items', 
  onBack 
}) => {
  // State management
  const [activeTab, setActiveTab] = useState(initialTab);
  const [searchQuery, setSearchQuery] = useState("");
  
  // Selection states
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [selectedBestSellerId, setSelectedBestSellerId] = useState<string | null>(null);
  const [selectedOfferId, setSelectedOfferId] = useState<string | null>(null);
  
  // Data states
  const [offers, setOffers] = useState<Offer[]>([]);
  const [items, setItems] = useState<Item[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [bestSellers, setBestSellers] = useState<Item[]>([]);
  
  // Loading states
  const [isLoadingCategories, setIsLoadingCategories] = useState(false);
  const [isLoadingItems, setIsLoadingItems] = useState(false);
  const [isLoadingBestSellers, setIsLoadingBestSellers] = useState(false);
  const [isLoadingOffers, setIsLoadingOffers] = useState(false);
  
  // View modal states
  const [showViewItemModal, setShowViewItemModal] = useState(false);
  const [viewingItem, setViewingItem] = useState<ItemData | null>(null);
  
  // Edit modal states
  const [showEditItemModal, setShowEditItemModal] = useState(false);
  const [editingItem, setEditingItem] = useState<Item | null>(null);
  
  // Category modal states
  const [showViewCategoryModal, setShowViewCategoryModal] = useState(false);
  const [viewingCategory, setViewingCategory] = useState<CategoryData | null>(null);
  const [showEditCategoryModal, setShowEditCategoryModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<CategoryData | null>(null);
  
  // Offer modal states
  const [showViewOfferModal, setShowViewOfferModal] = useState(false);
  const [viewingOffer, setViewingOffer] = useState<OfferData | null>(null);
  const [showEditOfferModal, setShowEditOfferModal] = useState(false);
  const [editingOffer, setEditingOffer] = useState<OfferData | null>(null);
  
  // Loading states for edit operations
  const [isUpdatingItem, setIsUpdatingItem] = useState(false);
  const [isUpdatingCategory, setIsUpdatingCategory] = useState(false);
  const [isUpdatingOffer, setIsUpdatingOffer] = useState(false);

  // Redux state
  const { user, token } = useAppSelector((state) => state.auth);

  // Initialize data when authenticated
  useEffect(() => {
    if (user && token) {
      fetchCategories();
      fetchItems();
      fetchBestSellers();
      fetchOffers();
    }
  }, [user, token]);

  // API Functions
  const fetchOffers = useCallback(async () => {
    if (!user || !token) return;

    setIsLoadingOffers(true);
    try {
      const response = await apiConnector.getAllOffers(token);
      if (response.success && response.data) {
        setOffers(response.data);
      } else {
        setOffers([]);
      }
    } catch (error: any) {
      setOffers([]);
      if (!error.message?.includes('timeout')) {
        Alert.alert("Warning", "Failed to fetch offers.");
      }
    } finally {
      setIsLoadingOffers(false);
    }
  }, [user, token]);

  const fetchCategories = useCallback(async () => {
    if (!user || !token) return;

    setIsLoadingCategories(true);
    try {
      const response = await apiConnector.getAllCategories(token);
      if (response.success && response.data) {
        const transformedCategories: Category[] = response.data
          .map((apiCategory: ApiCategory) => {
            const categoryId = apiCategory._id || apiCategory.id;
            if (!categoryId) return null;
            
            return {
              id: categoryId,
              name: apiCategory.name,
              image: apiCategory.image || "",
              description: apiCategory.description,
              isActive: apiCategory.isActive,
              itemCount: apiCategory.itemCount,
              createdAt: apiCategory.createdAt,
              updatedAt: apiCategory.updatedAt
            };
          })
          .filter(Boolean) as Category[];
        
        setCategories(transformedCategories);
      } else {
        setCategories([]);
      }
    } catch (error: any) {
      Alert.alert("Error", "Failed to fetch categories. Please try again.");
      setCategories([]);
    } finally {
      setIsLoadingCategories(false);
    }
  }, [user, token]);

  const fetchItems = useCallback(async () => {
    if (!user || !token) return;

    setIsLoadingItems(true);
    try {
      const response = await apiConnector.getAllItems(token);
      if (response.success && response.data) {
        setItems(response.data);
      } else {
        setItems([]);
      }
    } catch (error: any) {
      Alert.alert("Error", "Failed to fetch items. Please try again.");
      setItems([]);
    } finally {
      setIsLoadingItems(false);
    }
  }, [user, token]);

  const fetchBestSellers = useCallback(async () => {
    if (!user || !token) return;

    setIsLoadingBestSellers(true);
    try {
      const response = await apiConnector.getBestSellers(token, 50); // Get more best sellers
      if (response.success && response.data) {
        setBestSellers(response.data);
      } else {
        setBestSellers([]);
      }
    } catch (error: any) {
      Alert.alert("Error", "Failed to fetch best sellers. Please try again.");
      setBestSellers([]);
    } finally {
      setIsLoadingBestSellers(false);
    }
  }, [user, token]);

  // Update item handler
  const handleUpdateItem = useCallback(async (itemData: ItemData): Promise<void> => {
    if (!user || !token || !editingItem) {
      Alert.alert("Error", "Please login to update items");
      return;
    }

    setIsUpdatingItem(true);
    try {
      const apiData = {
        name: itemData.name,
        description: itemData.description || "",
        category: itemData.category,
        itemCategory: itemData.itemCategory || 'Veg',
        price: parseFloat(itemData.price.toString()),
        availability: itemData.availability || 'in-stock',
        isDietMeal: itemData.isDietMeal || false,
        calories: itemData.calories ? parseInt(itemData.calories.toString()) : undefined
      };

      let response;
      if (itemData.image && 
          !itemData.image.includes('unsplash.com') && 
          !itemData.image.includes('default')) {
        const formData = new FormData();
        formData.append('name', itemData.name);
        formData.append('description', itemData.description || '');
        formData.append('category', itemData.category);
        formData.append('itemCategory', itemData.itemCategory || 'Veg');
        formData.append('price', itemData.price.toString());
        formData.append('availability', itemData.availability || 'in-stock');
        formData.append('isDietMeal', (itemData.isDietMeal || false).toString());
        if (itemData.calories) {
          formData.append('calories', itemData.calories.toString());
        }
        
        const imageFile = {
          uri: itemData.image,
          type: 'image/jpeg',
          name: 'item_image.jpg'
        } as any;
        
        formData.append('image', imageFile);
        response = await apiConnector.updateItemWithImage(editingItem.id, formData, token);
      } else {
        response = await apiConnector.updateItem(editingItem.id, apiData, token);
      }

      if (response.success && response.data) {
        const updatedItem: Item = {
          id: response.data._id || response.data.id,
          name: response.data.name,
          price: response.data.price,
          image: response.data.image || "",
          category: response.data.category,
          description: response.data.description,
          availability: response.data.availability,
          isDietMeal: response.data.isDietMeal,
          calories: response.data.calories,
          restaurant: response.data.restaurant,
          isVegetarian: response.data.isVegetarian
        };

        setItems(prev => prev.map(item => item.id === editingItem.id ? updatedItem : item));
        setBestSellers(prev => prev.map(item => item.id === editingItem.id ? updatedItem : item));
        setShowEditItemModal(false);
        setEditingItem(null);
        Alert.alert("Success", "Item updated successfully!");
      } else {
        Alert.alert("Error", response.message || "Failed to update item");
      }
    } catch (error: any) {
      Alert.alert("Error", "Failed to update item. Please try again.");
    } finally {
      setIsUpdatingItem(false);
    }
  }, [user, token, editingItem]);

  const handleUpdateCategory = useCallback(async (categoryData: CategoryData): Promise<void> => {
    if (!user || !token || !editingCategory) {
      Alert.alert("Error", "Please login to update categories");
      return;
    }

    setIsUpdatingCategory(true);
    try {
      const apiData = {
        name: categoryData.name,
        description: categoryData.description || "",
      };

      let response;
      if (categoryData.image && 
          categoryData.image !== editingCategory.image && 
          !categoryData.image.startsWith('http')) {
        // Image was changed, upload with image
        const formData = new FormData();
        formData.append('name', categoryData.name);
        formData.append('description', categoryData.description || "");
        formData.append('image', {
          uri: categoryData.image,
          type: 'image/jpeg',
          name: 'category.jpg',
        } as any);

        response = await apiConnector.updateCategoryWithImage(editingCategory.id, formData, token);
      } else {
        // No image change, update without image
        response = await apiConnector.updateCategory(editingCategory.id, apiData, token);
      }

      if (response.success && response.data) {
        const updatedCategory: Category = {
          id: response.data._id || response.data.id,
          name: response.data.name,
          description: response.data.description,
          image: response.data.image || "",
          itemCount: response.data.itemCount || 0,
          isActive: response.data.isActive !== false
        };

        setCategories(prev => prev.map(cat => cat.id === editingCategory.id ? updatedCategory : cat));
        setShowEditCategoryModal(false);
        setEditingCategory(null);
        Alert.alert("Success", "Category updated successfully!");
      } else {
        Alert.alert("Error", response.message || "Failed to update category");
      }
    } catch (error: any) {
      Alert.alert("Error", "Failed to update category. Please try again.");
    } finally {
      setIsUpdatingCategory(false);
    }
  }, [user, token, editingCategory]);

  const handleUpdateOffer = useCallback(async (offerData: OfferData): Promise<void> => {
    if (!user || !token || !editingOffer) {
      Alert.alert("Error", "Please login to update offers");
      return;
    }

    setIsUpdatingOffer(true);
    try {
      const apiData = {
        offerTitle: offerData.title,
        offerDescription: offerData.description,
        discountType: offerData.discountType,
        discountValue: parseFloat(offerData.discountValue),
        minOrderValue: parseFloat(offerData.minOrderValue),
        maxDiscountAmount: offerData.maxDiscountAmount ? parseFloat(offerData.maxDiscountAmount) : null,
        usageLimit: offerData.usageLimit ? parseInt(offerData.usageLimit) : null,
        usagePerUser: parseInt(offerData.usagePerUser),
        validFrom: offerData.validFrom,
        validTo: offerData.validTo,
        isActive: offerData.isActive,
        applicableCategories: offerData.applicableCategories,
        applicableItems: offerData.applicableItems,
        termsAndConditions: offerData.termsAndConditions,
      };

      let response;
      if (offerData.image && 
          offerData.image !== editingOffer.image && 
          !offerData.image.startsWith('http')) {
        // Image was changed, upload with image
        const formData = new FormData();
        formData.append('offerTitle', offerData.title);
        formData.append('offerDescription', offerData.description);
        formData.append('discountType', offerData.discountType);
        formData.append('discountValue', offerData.discountValue);
        formData.append('minOrderValue', offerData.minOrderValue);
        if (offerData.maxDiscountAmount) formData.append('maxDiscountAmount', offerData.maxDiscountAmount);
        if (offerData.usageLimit) formData.append('usageLimit', offerData.usageLimit);
        formData.append('usagePerUser', offerData.usagePerUser);
        formData.append('validFrom', offerData.validFrom);
        formData.append('validTo', offerData.validTo);
        formData.append('isActive', offerData.isActive.toString());
        formData.append('termsAndConditions', offerData.termsAndConditions);
        formData.append('offerImage', {
          uri: offerData.image,
          type: 'image/jpeg',
          name: 'offer.jpg',
        } as any);

        response = await apiConnector.updateOfferWithImage(editingOffer.id, formData, token);
      } else {
        // No image change, update without image
        response = await apiConnector.updateOffer(editingOffer.id, apiData, token);
      }

      if (response.success && response.data) {
        const updatedOffer: Offer = {
          id: response.data._id || response.data.id,
          offerTitle: response.data.offerTitle,
          discountAmount: response.data.discountValue || response.data.discountAmount,
          offerImage: response.data.offerImage || response.data.image || "",
          startDate: response.data.validFrom || response.data.startDate,
          endDate: response.data.validTo || response.data.endDate,
          isActive: response.data.isActive !== false
        };

        setOffers(prev => prev.map(offer => offer.id === editingOffer.id ? updatedOffer : offer));
        setShowEditOfferModal(false);
        setEditingOffer(null);
        Alert.alert("Success", "Offer updated successfully!");
      } else {
        Alert.alert("Error", response.message || "Failed to update offer");
      }
    } catch (error: any) {
      Alert.alert("Error", "Failed to update offer. Please try again.");
    } finally {
      setIsUpdatingOffer(false);
    }
  }, [user, token, editingOffer]);

  // Filter data based on search query
  const filteredItems = items.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.category?.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    category.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredBestSellers = bestSellers.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.category?.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredOffers = offers.filter(offer =>
    offer.offerTitle.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Selection handlers
  const handleItemSelect = useCallback((itemId: string) => {
    setSelectedItemId(selectedItemId === itemId ? null : itemId);
    setSelectedCategoryId(null);
    setSelectedBestSellerId(null);
    setSelectedOfferId(null);
  }, [selectedItemId]);

  const handleCategorySelect = useCallback((categoryId: string) => {
    setSelectedCategoryId(selectedCategoryId === categoryId ? null : categoryId);
    setSelectedItemId(null);
    setSelectedBestSellerId(null);
    setSelectedOfferId(null);
  }, [selectedCategoryId]);

  const handleBestSellerSelect = useCallback((itemId: string) => {
    setSelectedBestSellerId(selectedBestSellerId === itemId ? null : itemId);
    setSelectedItemId(null);
    setSelectedCategoryId(null);
    setSelectedOfferId(null);
  }, [selectedBestSellerId]);

  const handleOfferSelect = useCallback((offerId: string) => {
    setSelectedOfferId(selectedOfferId === offerId ? null : offerId);
    setSelectedItemId(null);
    setSelectedCategoryId(null);
    setSelectedBestSellerId(null);
  }, [selectedOfferId]);

  // View handlers
  const handleItemView = useCallback(async (item: Item) => {
    try {
      console.log("🔍 [SEE-ALL-VIEW] Starting view for item:", item);
      const response = await apiConnector.getItemById(item.id, token);
      console.log("🔍 [SEE-ALL-VIEW] API response:", response);
      
      if (response.success) {
        const itemData = response.data;
        console.log("🔍 [SEE-ALL-VIEW] Item data from API:", itemData);
        
        // Transform API data to match ItemData interface
        const viewItemData: ItemData = {
          id: itemData._id || itemData.id || item.id,
          name: itemData.name,
          description: itemData.description || "",
          category: itemData.category?._id || itemData.category?.id || "",
          itemCategory: itemData.itemCategory || "Veg",
          price: itemData.price,
          availability: itemData.availability || "in-stock",
          isDietMeal: itemData.isDietMeal || false,
          calories: itemData.calories,
          image: itemData.image || "",
          restaurant: itemData.restaurant || "",
          isVegetarian: itemData.isVegetarian || false
        };
        
        console.log("🔍 [SEE-ALL-VIEW] Transformed view data:", viewItemData);
        console.log("🔍 [SEE-ALL-VIEW] Setting viewing item and opening modal");
        
        setViewingItem(viewItemData);
        setShowViewItemModal(true);
        
        console.log("🔍 [SEE-ALL-VIEW] Modal state should be updated");
      } else {
        console.log("❌ [SEE-ALL-VIEW] API response failed:", response);
        Alert.alert("Error", "Failed to fetch item details");
      }
    } catch (error: any) {
      console.log("❌ [SEE-ALL-VIEW] Error occurred:", error);
      Alert.alert("Error", "Failed to fetch item details");
    }
  }, [token]);

  const handleCategoryView = useCallback(async (category: Category) => {
    try {
      console.log("🔍 [SEE-ALL-CATEGORY-VIEW] Opening category view for:", category.id);
      
      const response = await apiConnector.getCategoryById(category.id, token);
      if (response.success) {
        const categoryData = response.data;
        
        // Transform category data to match CategoryData interface
        const transformedData: CategoryData = {
          id: categoryData.id,
          name: categoryData.name,
          description: categoryData.description || "",
          image: categoryData.image || "",
        };
        
        console.log("🔍 [SEE-ALL-CATEGORY-VIEW] Transformed data:", transformedData);
        
        setViewingCategory(transformedData);
        setShowViewCategoryModal(true);
      } else {
        Alert.alert("Error", "Failed to fetch category details");
      }
    } catch (error: any) {
      console.error("❌ [SEE-ALL-CATEGORY-VIEW] Error opening category view:", error);
      Alert.alert("Error", "Failed to open category details");
    }
  }, [token]);

  const handleBestSellerView = useCallback(async (item: Item) => {
    try {
      console.log("🔍 [SEE-ALL-VIEW] Starting view for best seller:", item);
      const response = await apiConnector.getItemById(item.id, token);
      console.log("🔍 [SEE-ALL-VIEW] API response:", response);
      
      if (response.success) {
        const itemData = response.data;
        console.log("🔍 [SEE-ALL-VIEW] Item data from API:", itemData);
        
        // Transform API data to match ItemData interface
        const viewItemData: ItemData = {
          id: itemData._id || itemData.id || item.id,
          name: itemData.name,
          description: itemData.description || "",
          category: itemData.category?._id || itemData.category?.id || "",
          itemCategory: itemData.itemCategory || "Veg",
          price: itemData.price,
          availability: itemData.availability || "in-stock",
          isDietMeal: itemData.isDietMeal || false,
          calories: itemData.calories,
          image: itemData.image || "",
          restaurant: itemData.restaurant || "",
          isVegetarian: itemData.isVegetarian || false
        };
        
        console.log("🔍 [SEE-ALL-VIEW] Transformed view data:", viewItemData);
        console.log("🔍 [SEE-ALL-VIEW] Setting viewing item and opening modal");
        
        setViewingItem(viewItemData);
        setShowViewItemModal(true);
        
        console.log("🔍 [SEE-ALL-VIEW] Modal state should be updated");
      } else {
        console.log("❌ [SEE-ALL-VIEW] API response failed:", response);
        Alert.alert("Error", "Failed to fetch best seller details");
      }
    } catch (error: any) {
      console.log("❌ [SEE-ALL-VIEW] Error occurred:", error);
      Alert.alert("Error", "Failed to fetch best seller details");
    }
  }, [token]);

  const handleOfferView = useCallback(async (offer: Offer) => {
    try {
      console.log("🔍 [SEE-ALL-OFFER-VIEW] Opening offer view for:", offer.id);
      
      const offerId = offer._id || offer.id;
      if (!offerId) {
        Alert.alert("Error", "Invalid offer ID");
        return;
      }
      const response = await apiConnector.getOfferById(offerId, token);
      if (response.success) {
        const offerData = response.data;
        
        // Transform offer data to match OfferData interface
        const transformedData: OfferData = {
          id: offerData._id || offerData.id,
          title: offerData.offerTitle,
          description: offerData.offerDescription || "",
          image: offerData.offerImage || offerData.image || "",
          discountType: offerData.discountType || 'percentage',
          discountValue: offerData.discountValue?.toString() || offerData.discountAmount?.toString() || "",
          minOrderValue: offerData.minOrderValue?.toString() || "0",
          maxDiscountAmount: offerData.maxDiscountAmount?.toString() || "",
          usageLimit: offerData.usageLimit?.toString() || "",
          usagePerUser: offerData.usagePerUser?.toString() || "1",
          validFrom: offerData.validFrom || offerData.startDate,
          validTo: offerData.validTo || offerData.endDate,
          isActive: offerData.isActive !== false,
          applicableCategories: offerData.applicableCategories || [],
          applicableItems: offerData.applicableItems || [],
          termsAndConditions: offerData.termsAndConditions || "",
        };
        
        console.log("🔍 [SEE-ALL-OFFER-VIEW] Transformed data:", transformedData);
        
        setViewingOffer(transformedData);
        setShowViewOfferModal(true);
      } else {
        Alert.alert("Error", "Failed to fetch offer details");
      }
    } catch (error: any) {
      console.error("❌ [SEE-ALL-OFFER-VIEW] Error opening offer view:", error);
      Alert.alert("Error", "Failed to open offer details");
    }
  }, [token]);

  // Edit handlers
  const handleItemEdit = useCallback((item: Item) => {
    console.log("Edit item:", item);
    setEditingItem(item);
    setShowEditItemModal(true);
  }, []);

  const handleCategoryEdit = useCallback((category: Category) => {
    try {
      console.log("✏️ [SEE-ALL-CATEGORY-EDIT] Opening category edit for:", category.id);
      
      // Transform category data to match CategoryData interface
      const categoryData: CategoryData = {
        id: category.id,
        name: category.name,
        description: category.description || "",
        image: category.image || "",
      };
      
      setEditingCategory(categoryData);
      setShowEditCategoryModal(true);
    } catch (error) {
      console.error("❌ [SEE-ALL-CATEGORY-EDIT] Error opening category edit:", error);
      Alert.alert("Error", "Failed to open category editor");
    }
  }, []);

  const handleBestSellerEdit = useCallback((item: Item) => {
    console.log("Edit best seller:", item);
    setEditingItem(item);
    setShowEditItemModal(true);
  }, []);

  const handleOfferEdit = useCallback(async (offer: Offer) => {
    try {
      console.log("✏️ [SEE-ALL-OFFER-EDIT] Opening offer edit for:", offer.id);
      
      const offerId = offer._id || offer.id;
      if (!offerId) {
        Alert.alert("Error", "Invalid offer ID");
        return;
      }
      
      // Fetch complete offer data from API
      const response = await apiConnector.getOfferById(offerId, token);
      if (response.success) {
        const offerData = response.data;
        
        // Transform offer data to match OfferData interface
        const transformedData: OfferData = {
          id: offerData._id || offerData.id,
          title: offerData.offerTitle,
          description: offerData.offerDescription || "",
          image: offerData.offerImage || offerData.image || "",
          discountType: offerData.discountType || 'percentage',
          discountValue: offerData.discountValue?.toString() || offerData.discountAmount?.toString() || "",
          minOrderValue: offerData.minOrderValue?.toString() || "0",
          maxDiscountAmount: offerData.maxDiscountAmount?.toString() || "",
          usageLimit: offerData.usageLimit?.toString() || "",
          usagePerUser: offerData.usagePerUser?.toString() || "1",
          validFrom: offerData.validFrom || offerData.startDate,
          validTo: offerData.validTo || offerData.endDate,
          isActive: offerData.isActive !== false,
          applicableCategories: offerData.applicableCategories || [],
          applicableItems: offerData.applicableItems || [],
          termsAndConditions: offerData.termsAndConditions || "",
        };
        
        console.log("✏️ [SEE-ALL-OFFER-EDIT] Transformed data:", transformedData);
        
        setEditingOffer(transformedData);
        setShowEditOfferModal(true);
      } else {
        Alert.alert("Error", "Failed to fetch offer details for editing");
      }
    } catch (error) {
      console.error("❌ [SEE-ALL-OFFER-EDIT] Error opening offer edit:", error);
      Alert.alert("Error", "Failed to open offer editor");
    }
  }, [token]);

  // Delete handlers
  const handleItemDelete = useCallback(async (item: Item) => {
    Alert.alert(
      "Delete Item",
      `Are you sure you want to delete "${item.name}"?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              const response = await apiConnector.deleteItem(item.id, token);
              if (response.success) {
                setItems(prev => prev.filter(i => i.id !== item.id));
                setSelectedItemId(null);
                Alert.alert("Success", `Item "${item.name}" deleted successfully`);
              } else {
                Alert.alert("Error", response.message || "Failed to delete item");
              }
            } catch (error: any) {
              Alert.alert("Error", "Failed to delete item. Please try again.");
            }
          }
        }
      ]
    );
  }, [token]);

  const handleCategoryDelete = useCallback(async (category: Category) => {
    Alert.alert(
      "Delete Category",
      `Are you sure you want to delete "${category.name}"?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              const response = await apiConnector.deleteCategory(category.id, token);
              if (response.success) {
                setCategories(prev => prev.filter(c => c.id !== category.id));
                setSelectedCategoryId(null);
                Alert.alert("Success", `Category "${category.name}" deleted successfully`);
              } else {
                Alert.alert("Error", response.message || "Failed to delete category");
              }
            } catch (error: any) {
              Alert.alert("Error", "Failed to delete category. Please try again.");
            }
          }
        }
      ]
    );
  }, [token]);

  const handleBestSellerDelete = useCallback(async (item: Item) => {
    Alert.alert(
      "Delete Best Seller",
      `Are you sure you want to delete "${item.name}"?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              const response = await apiConnector.deleteItem(item.id, token);
              if (response.success) {
                setBestSellers(prev => prev.filter(i => i.id !== item.id));
                setItems(prev => prev.filter(i => i.id !== item.id));
                setSelectedBestSellerId(null);
                Alert.alert("Success", `Best seller "${item.name}" deleted successfully`);
              } else {
                Alert.alert("Error", response.message || "Failed to delete best seller");
              }
            } catch (error: any) {
              Alert.alert("Error", "Failed to delete best seller. Please try again.");
            }
          }
        }
      ]
    );
  }, [token]);

  const handleOfferDelete = useCallback(async (offer: Offer) => {
    Alert.alert(
      "Delete Offer",
      `Are you sure you want to delete "${offer.offerTitle}"?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              const offerId = offer._id || offer.id;
              if (!offerId) {
                Alert.alert("Error", "Invalid offer ID");
                return;
              }
              const response = await apiConnector.deleteOffer(offerId, token);
              if (response.success) {
                setOffers(prev => prev.filter(o => (o._id || o.id) !== offerId));
                setSelectedOfferId(null);
                Alert.alert("Success", `Offer "${offer.offerTitle}" deleted successfully`);
              } else {
                Alert.alert("Error", response.message || "Failed to delete offer");
              }
            } catch (error: any) {
              Alert.alert("Error", "Failed to delete offer. Please try again.");
            }
          }
        }
      ]
    );
  }, [token]);

  // Render content based on active tab
  const renderContent = () => {
    switch (activeTab) {
      case 'items':
        return (
          <View style={styles.section}>
            {isLoadingItems ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="small" color="#ff6b35" />
                <Text style={styles.loadingText}>Loading items...</Text>
              </View>
            ) : filteredItems.length > 0 ? (
              <View style={styles.gridContainer}>
                {filteredItems.map((item) => (
                  <View key={item.id} style={styles.cardWrapper}>
                    <ItemCard 
                      item={item} 
                      isSelected={selectedItemId === item.id}
                      onSelect={() => handleItemSelect(item.id)}
                      onView={() => handleItemView(item)}
                      onEdit={() => handleItemEdit(item)}
                      onDelete={() => handleItemDelete(item)}
                    />
                  </View>
                ))}
              </View>
            ) : (
              <View style={styles.noDataContainer}>
                <Text style={styles.noDataText}>No items found.</Text>
                <Text style={styles.noDataSubtext}>Try adjusting your search or add new items.</Text>
              </View>
            )}
          </View>
        );

      case 'categories':
        return (
          <View style={styles.section}>
            {isLoadingCategories ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="small" color="#ff6b35" />
                <Text style={styles.loadingText}>Loading categories...</Text>
              </View>
            ) : filteredCategories.length > 0 ? (
              <View style={styles.gridContainer}>
                {filteredCategories.map((category) => (
                  <View key={category.id} style={styles.cardWrapper}>
                    <CategoryCard 
                      category={category}
                      isSelected={selectedCategoryId === category.id}
                      onSelect={() => handleCategorySelect(category.id)}
                      onView={() => handleCategoryView(category)}
                      onEdit={() => handleCategoryEdit(category)}
                      onDelete={() => handleCategoryDelete(category)}
                    />
                  </View>
                ))}
              </View>
            ) : (
              <View style={styles.noDataContainer}>
                <Text style={styles.noDataText}>No categories found.</Text>
                <Text style={styles.noDataSubtext}>Try adjusting your search or add new categories.</Text>
              </View>
            )}
          </View>
        );

      case 'bestSellers':
        return (
          <View style={styles.section}>
            {isLoadingBestSellers ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="small" color="#ff6b35" />
                <Text style={styles.loadingText}>Loading best sellers...</Text>
              </View>
            ) : filteredBestSellers.length > 0 ? (
              <View style={styles.gridContainer}>
                {filteredBestSellers.map((item) => (
                  <View key={item.id} style={styles.cardWrapper}>
                    <BestSellerCard 
                      item={item}
                      isSelected={selectedBestSellerId === item.id}
                      onSelect={() => handleBestSellerSelect(item.id)}
                      onView={() => handleBestSellerView(item)}
                      onEdit={() => handleBestSellerEdit(item)}
                      onDelete={() => handleBestSellerDelete(item)}
                    />
                  </View>
                ))}
              </View>
            ) : (
              <View style={styles.noDataContainer}>
                <Text style={styles.noDataText}>No best sellers found.</Text>
                <Text style={styles.noDataSubtext}>Items will appear here based on order volume.</Text>
              </View>
            )}
          </View>
        );

      case 'offers':
        return (
          <View style={styles.section}>
            {isLoadingOffers ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="small" color="#ff6b35" />
                <Text style={styles.loadingText}>Loading offers...</Text>
              </View>
            ) : filteredOffers.length > 0 ? (
              <View style={styles.gridContainer}>
                {filteredOffers.map((offer) => (
                  <View key={offer._id || offer.id} style={styles.cardWrapper}>
                    <OfferCard 
                      offer={offer}
                      isSelected={selectedOfferId === (offer._id || offer.id)}
                      onSelect={() => handleOfferSelect(offer._id || offer.id || '')}
                      onView={() => handleOfferView(offer)}
                      onEdit={() => handleOfferEdit(offer)}
                      onDelete={() => handleOfferDelete(offer)}
                    />
                  </View>
                ))}
              </View>
            ) : (
              <View style={styles.noDataContainer}>
                <Text style={styles.noDataText}>No offers found.</Text>
                <Text style={styles.noDataSubtext}>Try adjusting your search or add new offers.</Text>
              </View>
            )}
          </View>
        );

      default:
        return null;
    }
  };

  return (
    <PaperProvider>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.offersHeader}>
          <TouchableOpacity onPress={onBack} style={styles.backButton}>
            <Icon source="arrow-left" size={24} color="#800080" />
          </TouchableOpacity>
          <Text style={styles.offersTitle}>All {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}</Text>
          <View style={{ width: 24 }} />
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <View style={styles.searchBar}>
            <View style={styles.searchIconContainer}>
              <Icon source="magnify" size={20} color="#800080" />
            </View>
            <TextInput
              placeholder={`Search ${activeTab}...`}
              placeholderTextColor="#696969"
              value={searchQuery}
              onChangeText={setSearchQuery}
              style={styles.searchInput}
            />
          </View>
        </View>

        {/* Tab Selector */}
        <View style={styles.tabContainer}>
          <SegmentedButtons
            value={activeTab}
            onValueChange={setActiveTab}
            buttons={[
              { value: 'items', label: 'Items' },
              { value: 'categories', label: 'Categories' },
              { value: 'bestSellers', label: 'Best Sellers' },
              { value: 'offers', label: 'Offers' },
            ]}
            style={styles.segmentedButtons}
          />
        </View>

        {/* Content */}
        {renderContent()}

        {/* View Item Modal */}
        <AddItemModal
          visible={showViewItemModal}
          onDismiss={() => {
            console.log("🔍 [SEE-ALL-VIEW] Modal dismissed");
            setShowViewItemModal(false);
            setViewingItem(null);
          }}
          onSave={() => {}} // Not used in view mode
          isLoading={false}
          categories={categories}
          editItem={viewingItem}
          isViewMode={true}
        />

        {/* Edit Item Modal */}
        <AddItemModal
          visible={showEditItemModal}
          onDismiss={() => {
            console.log("🔍 [SEE-ALL-EDIT] Modal dismissed");
            setShowEditItemModal(false);
            setEditingItem(null);
          }}
          onSave={() => {}} // Not used in edit mode
          onUpdate={handleUpdateItem}
          isLoading={isUpdatingItem}
          categories={categories}
          editItem={editingItem}
          isEditMode={true}
        />

        {/* Category Modals */}
        <AddCategoryModal
          visible={showViewCategoryModal}
          onDismiss={() => {
            console.log("🔍 [SEE-ALL-CATEGORY-VIEW] Modal dismissed");
            setShowViewCategoryModal(false);
            setViewingCategory(null);
          }}
          onSave={() => {}} // Not used in view mode
          isLoading={false}
          editCategory={viewingCategory}
          isViewMode={true}
        />

        <AddCategoryModal
          visible={showEditCategoryModal}
          onDismiss={() => {
            console.log("🔍 [SEE-ALL-CATEGORY-EDIT] Modal dismissed");
            setShowEditCategoryModal(false);
            setEditingCategory(null);
          }}
          onSave={() => {}} // Not used in edit mode
          onUpdate={handleUpdateCategory}
          isLoading={isUpdatingCategory}
          editCategory={editingCategory}
          isEditMode={true}
        />

        {/* Offer Modals */}
        <AddOfferModal
          visible={showViewOfferModal}
          onDismiss={() => {
            console.log("🔍 [SEE-ALL-OFFER-VIEW] Modal dismissed");
            setShowViewOfferModal(false);
            setViewingOffer(null);
          }}
          onSave={() => {}} // Not used in view mode
          isLoading={false}
          editOffer={viewingOffer}
          isViewMode={true}
        />

        <AddOfferModal
          visible={showEditOfferModal}
          onDismiss={() => {
            console.log("🔍 [SEE-ALL-OFFER-EDIT] Modal dismissed");
            setShowEditOfferModal(false);
            setEditingOffer(null);
          }}
          onSave={() => {}} // Not used in edit mode
          onUpdate={handleUpdateOffer}
          isLoading={isUpdatingOffer}
          editOffer={editingOffer}
          isEditMode={true}
        />
      </ScrollView>
    </PaperProvider>
  );
};

export default SeeAllPage;
