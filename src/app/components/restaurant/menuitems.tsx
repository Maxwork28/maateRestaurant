import {
  bestSellers,
  categories,
  items,
  offers,
} from "@/constant/restaurant/restaurant-menu-item";
import React, { useState, useEffect } from "react";
import { Image, ScrollView, Text, TouchableOpacity, View, Alert } from "react-native";
import {
  Button,
  Card,
  Provider as PaperProvider,
  Searchbar,
  Surface,
  ActivityIndicator,
} from "react-native-paper";
import { styles } from "../css/restaurant/restaurantmenu";
import AddCategoryModal from "./add-category-modal";
import AddItemModal from "./add-item-modal";
import AddOfferModal from "./add-offer-modal";
import { useAppSelector } from "../../../store/hooks";
import { apiConnector } from "../../../utils";

interface Category {
  id: string | number;
  name: string;
  image: string;
  description?: string;
  isActive?: boolean;
  itemCount?: number;
  createdAt?: string;
  updatedAt?: string;
  [key: string]: any;
}

interface ApiCategory {
  _id: string;
  id?: string; // Add id as optional fallback
  name: string;
  image: string;
  description?: string;
  isActive: boolean;
  itemCount: number;
  createdAt: string;
  updatedAt: string;
}

const resolveImage = (filename: string): any => {
  switch (filename) {
    case "burger.jpg":
      return require("../../../../assets/images/burger.jpg");
    case "veg.jpg":
      return require("../../../../assets/images/veg.jpg");
    case "non-veg.jpg":
      return require("../../../../assets/images/non-veg.jpg");
    case "beverages.jpg":
      return require("../../../../assets/images/beverages.jpg");
    case "bestseller.png":
      return require("../../../../assets/images/bestseller.png");
    case "spoffer2.jpg":
      return require("../../../../assets/images/spoffer2.jpg");
    default:
      return require("../../../../assets/images/burger.jpg");
  }
};

// Component for Add Item/Category/Offer Cards
const AddItemCard = ({ onPress, title = "Add Items", icon = "+" }: any) => (
  <TouchableOpacity onPress={onPress} style={styles.addCard}>
    <View style={styles.addIconContainer}>
      <Text style={styles.addIcon}>{icon}</Text>
    </View>
    <Text style={styles.addText}>{title}</Text>
  </TouchableOpacity>
);

// Component for Individual Item Card
const ItemCard = ({ item }: any) => (
  <Card key={item.id} style={styles.itemCard}>
    <Image
      source={
        item.image && (item.image.startsWith("http") || item.image.startsWith("file"))
          ? { uri: item.image }
          : resolveImage("burger.jpg")
      }
      resizeMode="cover"
      style={styles.itemImage}
    />
    <Card.Content style={styles.itemContent}>
      <Text style={styles.restaurantName}>{item.category?.name || 'Uncategorized'}</Text>
      <Text style={styles.itemName} numberOfLines={2}>
        {item.name}
      </Text>
      <Text style={styles.price}>₹{item.price}</Text>
    </Card.Content>
  </Card>
);

const CategoryCard = ({ category }: any) => (
  <View style={styles.categoryCard}>
  <View style={styles.categoryImageContainer}>
    <Image
      source={
        category.image && (category.image.startsWith("http") || category.image.startsWith("file"))
          ? { uri: category.image }
          : resolveImage("burger.jpg")
      }
      resizeMode="cover"
      style={styles.categoryImage}
    />
  </View>
  <View style={styles.categoryContentContainer}>
    <Text style={styles.categoryName}>{category.name}</Text>
    {category.itemCount !== undefined && (
      <Text style={styles.itemCount}>{category.itemCount} items</Text>
    )}
  </View>
</View>
);

// Component for Best Seller Card
const BestSellerCard = ({ item }: any) => (
  <Card key={item.id} style={styles.bestSellerCard}>
    <Image 
      source={
        item.image && (item.image.startsWith("http") || item.image.startsWith("file"))
          ? { uri: item.image }
          : resolveImage("burger.jpg")
      } 
      style={styles.bestSellerImage} 
    />
    <Card.Content style={styles.bestSellerContent}>
      <Text style={styles.bestSellerName} numberOfLines={2}>
        {item.name}
      </Text>
      <Text style={styles.bestSellerPrice}>₹{item.price}</Text>
      {item.totalOrder && item.totalOrder > 0 && (
        <Text style={styles.soldCount}>Sold {item.totalOrder}</Text>
      )}
    </Card.Content>
  </Card>
);

// Component for Items Section
const ItemsSection = ({ onAddItem, dummyItems, isLoading, hasItems }: any) => (
  <View style={styles.section}>
    <Text style={styles.sectionTitle}>Items</Text>
    {isLoading ? (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="small" color="#ff6b35" />
        <Text style={styles.loadingText}>Loading items...</Text>
      </View>
    ) : hasItems ? (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={styles.horizontalScroll}
    >
      {dummyItems.map((item: any) => (
        <ItemCard key={item.id} item={item} />
      ))}
      <AddItemCard title="Add Items" onPress={onAddItem} />
    </ScrollView>
    ) : (
      <View style={styles.noDataContainer}>
        <Text style={styles.noDataText}>No items added yet.</Text>
        <AddItemCard title="Add Items" onPress={onAddItem} />
      </View>
    )}
  </View>
);

// Component for Categories Section
const CategoriesSection = ({ 
  categories, 
  onCategoryPress, 
  onAddCategory, 
  isLoading, 
  hasCategories 
}: any) => (
  <View style={styles.section}>
    <Text style={styles.sectionTitle}>Category</Text>
    {isLoading ? (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="small" color="#ff6b35" />
        <Text style={styles.loadingText}>Loading categories...</Text>
      </View>
    ) : (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={styles.horizontalScroll}
    >
        {categories.map((category: any) => (
        <CategoryCard
          key={category.id}
          category={category}
          onPress={onCategoryPress}
        />
      ))}
      <AddItemCard title="Add Category" onPress={onAddCategory} />
    </ScrollView>
    )}
  </View>
);

// Component for Best Seller Section
const BestSellerSection = ({ bestSellers, onSeeAll, isLoading, hasBestSellers }: any) => (
  <View style={styles.section}>
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>Best Seller</Text>
      <TouchableOpacity onPress={onSeeAll}>
        <Text style={styles.seeAllText}>See all</Text>
      </TouchableOpacity>
    </View>
    {isLoading ? (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="small" color="#ff6b35" />
        <Text style={styles.loadingText}>Loading best sellers...</Text>
      </View>
    ) : hasBestSellers ? (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={styles.horizontalScroll}
    >
      {bestSellers.map((item: any) => (
        <BestSellerCard key={item.id} item={item} />
      ))}
    </ScrollView>
    ) : (
      <View style={styles.noDataContainer}>
        <Text style={styles.noDataText}>No best sellers yet.</Text>
        <Text style={styles.noDataSubtext}>Items will appear here based on order volume.</Text>
      </View>
    )}
  </View>
);

// Component for Offers Section
const OffersSection = ({ onAddOffer, onSeeAllOffers, offers, isLoading, hasOffers }: any) => (
  <View style={styles.section}>
    <View style={styles.offersHeader}>
      <Text style={styles.offersTitle}>Offers</Text>
      <Button
        mode="outlined"
        onPress={onAddOffer}
        style={styles.addOfferButton}
        labelStyle={styles.addOfferText}
      >
        Add Offer +
      </Button>
      <TouchableOpacity onPress={onSeeAllOffers}>
        <Text style={styles.seeAllText}>See all</Text>
      </TouchableOpacity>
    </View>

    {isLoading ? (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="small" color="#ff6b35" />
        <Text style={styles.loadingText}>Loading offers...</Text>
      </View>
    ) : hasOffers ? (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={styles.horizontalScroll}
    >
        {offers.map((offer: any) => (
          <Surface key={offer._id || offer.id} style={styles.promoCard}>
          <View style={styles.promoContent}>
            <Image
              source={
                  offer.offerImage && (offer.offerImage.startsWith("http") || offer.offerImage.startsWith("file"))
                    ? { uri: offer.offerImage }
                    : resolveImage("spoffer2.jpg")
              }
              style={styles.promoImage}
            />

            <View style={styles.promoTextContainer}>
                <Text style={styles.promoTitle}>{offer.offerTitle}</Text>
                <Text style={styles.promoPrice}>₹{offer.discountAmount}</Text>
            </View>
          </View>
        </Surface>
      ))}
    </ScrollView>
    ) : (
      <View style={styles.noDataContainer}>
        <Text style={styles.noDataText}>No offers added yet.</Text>
        <Text style={styles.noDataSubtext}>Create your first offer to attract customers.</Text>
      </View>
    )}
  </View>
);

// Main App Component
const FoodDeliveryApp = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [showOfferModal, setShowOfferModal] = useState(false);
  const [filteredItems, setFilteredItems] = useState<any[]>([]);
  const [showItemModal, setShowItemModal] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState<boolean>(false);
  const [offers, setOffers] = useState<any[]>([]);
  const [items, setItems] = useState<any[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(false);
  const [isCreatingCategory, setIsCreatingCategory] = useState(false);
  const [isLoadingItems, setIsLoadingItems] = useState(false);
  const [isCreatingItem, setIsCreatingItem] = useState(false);
  const [bestSellers, setBestSellers] = useState<any[]>([]);
  const [isLoadingBestSellers, setIsLoadingBestSellers] = useState(false);
  const [isLoadingOffers, setIsLoadingOffers] = useState(false);
  const [isCreatingOffer, setIsCreatingOffer] = useState(false);

  // Get user and token from Redux
  const { user, token } = useAppSelector((state) => state.auth);

  // Debug authentication state changes
  useEffect(() => {
    console.log("🔍 [MENU_ITEMS] Authentication state changed:", {
      hasUser: !!user,
      hasToken: !!token,
      tokenLength: token?.length,
      userId: user?.id,
      userPhone: user?.phone
    });
  }, [user, token]);

  // Fetch categories and items on component mount
  useEffect(() => {
    if (user && token) {
      fetchCategories();
      fetchItems();
      fetchBestSellers();
      fetchOffers();
    }
  }, [user, token]);

  // Fetch all offers for restaurant
  const fetchOffers = async () => {
    if (!user || !token) {
      console.log("❌ [MENU_ITEMS] User not authenticated for offers");
      return;
    }

    console.log("🔄 [MENU_ITEMS] Fetching offers...");
    setIsLoadingOffers(true);

    try {
      const response = await apiConnector.getAllOffers(token);
      console.log("📥 [MENU_ITEMS] Offers API response:", response);

      if (response.success && response.data) {
        console.log("✅ [MENU_ITEMS] Offers fetched successfully:", response.data.length);
        setOffers(response.data);
      } else {
        console.log("❌ [MENU_ITEMS] Failed to fetch offers:", response.message);
        setOffers([]);
      }
    } catch (error: any) {
      console.error("❌ [MENU_ITEMS] Error fetching offers:", error);
      
      // Set empty offers array to prevent infinite loading
      setOffers([]);
      
      // Only show alert for non-timeout errors
      if (!error.message?.includes('timeout')) {
        Alert.alert(
          "Warning", 
          "Failed to fetch offers. Showing empty offers section."
        );
      } else {
        console.log("⏱️ [MENU_ITEMS] Offers API timed out, showing empty section");
      }
    } finally {
      setIsLoadingOffers(false);
    }
  };

  // Fetch all categories for restaurant
  const fetchCategories = async () => {
    if (!user || !token) {
      console.log("❌ [MENU_ITEMS] User not authenticated");
      console.log("🔍 [MENU_ITEMS] Auth state:", { hasUser: !!user, hasToken: !!token, tokenLength: token?.length });
      return;
    }

    console.log("🔄 [MENU_ITEMS] Fetching categories...");
    console.log("🔑 [MENU_ITEMS] Token available:", !!token, "Length:", token?.length);
    console.log("👤 [MENU_ITEMS] User ID:", user?.id);
    setIsLoadingCategories(true);

    try {
      const response = await apiConnector.getAllCategories(token);
      console.log("📥 [MENU_ITEMS] Categories API response:", response);

      if (response.success && response.data) {
        // Transform API data to match our Category interface
        console.log("🔍 [MENU_ITEMS] Raw API categories:", response.data);
        
        const transformedCategories: Category[] = response.data.map((apiCategory: ApiCategory) => {
          console.log("🔍 [MENU_ITEMS] Processing category:", apiCategory);
          console.log("🔍 [MENU_ITEMS] Category _id:", apiCategory._id);
          console.log("🔍 [MENU_ITEMS] Category id:", apiCategory.id);
          
          const categoryId = apiCategory._id || apiCategory.id;
          if (!categoryId) {
            console.error("❌ [MENU_ITEMS] Category missing ID:", apiCategory);
            return null;
          }
          
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
        }).filter(Boolean) as Category[]; // Filter out null values

        console.log("✅ [MENU_ITEMS] Categories transformed:", transformedCategories);
        setCategories(transformedCategories);
      } else {
        console.log("❌ [MENU_ITEMS] Failed to fetch categories:", response.message);
        setCategories([]);
      }
    } catch (error: any) {
      console.error("❌ [MENU_ITEMS] Error fetching categories:", error);
      Alert.alert(
        "Error", 
        "Failed to fetch categories. Please try again."
      );
      setCategories([]);
    } finally {
      setIsLoadingCategories(false);
    }
  };

  // Fetch all items for restaurant
  const fetchItems = async () => {
    if (!user || !token) {
      console.log("❌ [MENU_ITEMS] User not authenticated for items");
      return;
    }

    console.log("🔄 [MENU_ITEMS] Fetching items...");
    setIsLoadingItems(true);

    try {
      const response = await apiConnector.getAllItems(token);
      console.log("📥 [MENU_ITEMS] Items API response:", response);

      if (response.success && response.data) {
        console.log("✅ [MENU_ITEMS] Items fetched successfully:", response.data.length);
        setItems(response.data);
        setFilteredItems(response.data);
      } else {
        console.log("❌ [MENU_ITEMS] Failed to fetch items:", response.message);
        setItems([]);
        setFilteredItems([]);
      }
    } catch (error: any) {
      console.error("❌ [MENU_ITEMS] Error fetching items:", error);
      Alert.alert(
        "Error", 
        "Failed to fetch items. Please try again."
      );
      setItems([]);
      setFilteredItems([]);
    } finally {
      setIsLoadingItems(false);
    }
  };

  // Fetch best sellers for restaurant
  const fetchBestSellers = async () => {
    if (!user || !token) {
      console.log("❌ [MENU_ITEMS] User not authenticated for best sellers");
      return;
    }

    console.log("🔄 [MENU_ITEMS] Fetching best sellers...");
    setIsLoadingBestSellers(true);

    try {
      const response = await apiConnector.getBestSellers(token, 10); // Fetch top 10 best sellers
      console.log("📥 [MENU_ITEMS] Best Sellers API response:", response);

      if (response.success && response.data) {
        console.log("✅ [MENU_ITEMS] Best Sellers fetched successfully:", response.data.length);
        setBestSellers(response.data);
      } else {
        console.log("❌ [MENU_ITEMS] Failed to fetch best sellers:", response.message);
        setBestSellers([]);
      }
    } catch (error: any) {
      console.error("❌ [MENU_ITEMS] Error fetching best sellers:", error);
      Alert.alert(
        "Error", 
        "Failed to fetch best sellers. Please try again."
      );
      setBestSellers([]);
    } finally {
      setIsLoadingBestSellers(false);
    }
  };

  // Create new category
  const handleSaveCategory = async (categoryData: any): Promise<void> => {
    if (!user || !token) {
      console.log("❌ [MENU_ITEMS] User not authenticated for category creation");
      console.log("🔍 [MENU_ITEMS] Auth state:", { hasUser: !!user, hasToken: !!token, tokenLength: token?.length });
      Alert.alert("Error", "Please login to create categories");
      return;
    }

    console.log("🚀 [MENU_ITEMS] Creating new category:", categoryData);
    console.log("🔑 [MENU_ITEMS] Token available:", !!token, "Length:", token?.length);
    console.log("👤 [MENU_ITEMS] User ID:", user?.id);
    setIsCreatingCategory(true);

    try {
      // Prepare the data for API
      const apiData = {
        name: categoryData.name,
        description: categoryData.description || ""
      };

      console.log("📤 [MENU_ITEMS] Sending category data to API:", apiData);

      // Create FormData for multipart upload if image is selected
      let response;
      if (categoryData.image && 
          !categoryData.image.includes('unsplash.com') && 
          !categoryData.image.includes('default')) {
        // If custom image is selected, upload with image
        const formData = new FormData();
        formData.append('name', categoryData.name);
        formData.append('description', categoryData.description || '');
        
        // Create file object from image URI
        const imageFile = {
          uri: categoryData.image,
          type: 'image/jpeg',
          name: 'category_image.jpg'
        } as any;
        
        formData.append('image', imageFile);
        
        console.log("📸 [MENU_ITEMS] Uploading category with image:", categoryData.image);
        response = await apiConnector.createCategoryWithImage(formData, token);
      } else {
        // If no custom image, create without image
        console.log("📝 [MENU_ITEMS] Creating category without image (using default)");
        response = await apiConnector.createCategory(apiData, token);
      }

      console.log("📥 [MENU_ITEMS] Create category API response:", response);

      if (response.success && response.data) {
        console.log("✅ [MENU_ITEMS] Category created successfully");
        
        // Transform the new category data
        const newCategory: Category = {
          id: response.data._id, // Use _id directly
          name: response.data.name,
          image: response.data.image || "",
          description: response.data.description,
          isActive: response.data.isActive,
          itemCount: response.data.itemCount,
          createdAt: response.data.createdAt,
          updatedAt: response.data.updatedAt
        };

        // Add to local state
        setCategories(prev => [...prev, newCategory]);
        
        // Close modal
        setShowCategoryModal(false);
        
        Alert.alert("Success", "Category created successfully!");
      } else {
        console.log("❌ [MENU_ITEMS] Failed to create category:", response.message);
        Alert.alert("Error", response.message || "Failed to create category");
      }
    } catch (error: any) {
      console.error("❌ [MENU_ITEMS] Error creating category:", error);
      Alert.alert(
        "Error", 
        "Failed to create category. Please try again."
      );
    } finally {
      setIsCreatingCategory(false);
    }
  };

  // Create new item
  const handleSaveItem = async (itemData: any): Promise<void> => {
    if (!user || !token) {
      console.log("❌ [MENU_ITEMS] User not authenticated for item creation");
      Alert.alert("Error", "Please login to create items");
      return;
    }

    console.log("🚀 [MENU_ITEMS] Creating new item:", itemData);
    console.log("🔍 [MENU_ITEMS] Item data debug:", {
      category: itemData.category,
      categoryType: typeof itemData.category,
      itemCategory: itemData.itemCategory,
      itemCategoryType: typeof itemData.itemCategory
    });
    setIsCreatingItem(true);

    try {
      // Prepare the data for API
      const apiData = {
        name: itemData.name,
        description: itemData.description || "",
        category: itemData.category,
        itemCategory: itemData.itemCategory || 'Veg',
        price: parseFloat(itemData.price),
        availability: itemData.availability || 'in-stock',
        isDietMeal: itemData.isDietMeal || false,
        calories: itemData.calories ? parseInt(itemData.calories) : undefined
      };

      console.log("📤 [MENU_ITEMS] Sending item data to API:", apiData);

      // Create FormData for multipart upload if image is selected
      let response;
      if (itemData.image && 
          !itemData.image.includes('unsplash.com') && 
          !itemData.image.includes('default')) {
        // If custom image is selected, upload with image
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
        
        // Create file object from image URI
        const imageFile = {
          uri: itemData.image,
          type: 'image/jpeg',
          name: 'item_image.jpg'
        } as any;
        
        formData.append('image', imageFile);
        
        console.log("📸 [MENU_ITEMS] Uploading item with image:", itemData.image);
        response = await apiConnector.createItemWithImage(formData, token);
      } else {
        // If no custom image, create without image
        console.log("📝 [MENU_ITEMS] Creating item without image (using default)");
        response = await apiConnector.createItem(apiData, token);
      }

      console.log("📥 [MENU_ITEMS] Create item API response:", response);

      if (response.success && response.data) {
        console.log("✅ [MENU_ITEMS] Item created successfully");
        
        // Add to local state
        setItems(prev => [...prev, response.data]);
        setFilteredItems(prev => [...prev, response.data]);
        
        // Close modal
        setShowItemModal(false);
        
        Alert.alert("Success", "Item created successfully!");
      } else {
        console.log("❌ [MENU_ITEMS] Failed to create item:", response.message);
        Alert.alert("Error", response.message || "Failed to create item");
      }
    } catch (error: any) {
      console.error("❌ [MENU_ITEMS] Error creating item:", error);
      Alert.alert(
        "Error", 
        "Failed to create item. Please try again."
      );
    } finally {
      setIsCreatingItem(false);
    }
  };
  
  const handleAddCategory = (): void => {
    console.log("➕ [MENU_ITEMS] Add Category pressed");
    setShowCategoryModal(true);
  };
 
  const getItemsByCategory = (categoryName: any) => {
    return items.filter(
      (item) => item.category?.name?.toLowerCase() === categoryName.toLowerCase()
    );
  };

  const searchItems = (query: any) => {
    return items.filter(
      (item) =>
        item.name.toLowerCase().includes(query.toLowerCase()) ||
        item.category?.name?.toLowerCase().includes(query.toLowerCase())
    );
  };

  // Search handler
  const handleSearch = (query: any) => {
    setSearchQuery(query);
    if (query.trim() === "") {
      setFilteredItems(items);
    } else {
      const filtered = searchItems(query);
      setFilteredItems(filtered);
    }
  };

  // Handler functions
  const handleAddItem = () => {
    console.log("➕ [MENU_ITEMS] Add Item pressed");
    setShowItemModal(true);
  };

  const handleCategoryPress = (categoryName: any) => {
    const categoryItems = getItemsByCategory(categoryName);
    console.log("Items in category:", categoryItems);
  };

  const handleAddOffer = () => {
    setShowOfferModal(true);
  };

  const handleSeeAllBestSellers = () => {
    console.log("See all best sellers pressed");
  };

  const handleSeeAllOffers = () => {
    console.log("See all offers pressed");
  };

  const handleSaveOffer = async (offerData: any): Promise<void> => {
    if (!user || !token) {
      console.log("❌ [MENU_ITEMS] User not authenticated for offer creation");
      Alert.alert("Error", "Please login to create offers");
      return;
    }

    console.log("🚀 [MENU_ITEMS] Creating new offer:", offerData);
    setIsCreatingOffer(true);

    try {
      // Prepare the data for API
      const apiData = {
        offerTitle: offerData.title,
        discountAmount: parseFloat(offerData.discount),
        startDate: offerData.startDate,
        endDate: offerData.endDate
      };

      console.log("📤 [MENU_ITEMS] Sending offer data to API:", apiData);

      // Create FormData for multipart upload if image is selected
      let response;
      if (offerData.image && 
          !offerData.image.includes('unsplash.com') && 
          !offerData.image.includes('default')) {
        // If custom image is selected, upload with image
        const formData = new FormData();
        formData.append('offerTitle', offerData.title);
        formData.append('discountAmount', offerData.discount.toString());
        formData.append('startDate', offerData.startDate);
        formData.append('endDate', offerData.endDate);
        
        // Create file object from image URI
        const imageFile = {
          uri: offerData.image,
          type: 'image/jpeg',
          name: 'offer_image.jpg'
        } as any;
        
        formData.append('offerImage', imageFile);
        
        console.log("📸 [MENU_ITEMS] Uploading offer with image:", offerData.image);
        response = await apiConnector.createOfferWithImage(formData, token);
      } else {
        // If no custom image, create without image
        console.log("📝 [MENU_ITEMS] Creating offer without image (using default)");
        response = await apiConnector.createOffer(apiData, token);
      }

      console.log("📥 [MENU_ITEMS] Create offer API response:", response);

      if (response.success && response.data) {
        console.log("✅ [MENU_ITEMS] Offer created successfully");
        
        // Add to local state
        setOffers(prev => [...prev, response.data]);
        
        // Close modal
    setShowOfferModal(false);
        
        Alert.alert("Success", "Offer created successfully!");
      } else {
        console.log("❌ [MENU_ITEMS] Failed to create offer:", response.message);
        Alert.alert("Error", response.message || "Failed to create offer");
      }
    } catch (error: any) {
      console.error("❌ [MENU_ITEMS] Error creating offer:", error);
      Alert.alert(
        "Error", 
        "Failed to create offer. Please try again."
      );
    } finally {
      setIsCreatingOffer(false);
    }
  };

  return (
    <PaperProvider>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Searchbar
            placeholder="Search Items"
            onChangeText={handleSearch}
            value={searchQuery}
            style={styles.searchBar}
            iconColor="#ff6b35"
            placeholderTextColor="#999"
            inputStyle={{color:'#333'}}
          />
        </View>

        {/* Items Section */}
        <ItemsSection
          onAddItem={handleAddItem}
          dummyItems={searchQuery ? filteredItems : items}
          isLoading={isLoadingItems}
          hasItems={items.length > 0}
        />

        {/* Categories Section */}
        <CategoriesSection
          categories={categories}
          onCategoryPress={handleCategoryPress}
          onAddCategory={handleAddCategory}
          isLoading={isLoadingCategories}
          hasCategories={categories.length > 0}
        />

        {/* Best Seller Section */}
        <BestSellerSection
          bestSellers={bestSellers}
          onSeeAll={handleSeeAllBestSellers}
          isLoading={isLoadingBestSellers}
          hasBestSellers={bestSellers.length > 0}
        />

        {/* Offers Section */}
        <OffersSection
          onAddOffer={handleAddOffer}
          onSeeAllOffers={handleSeeAllOffers}
          offers={offers}
          isLoading={isLoadingOffers}
          hasOffers={offers.length > 0}
        />

        {/* Add Offer Modal */}
        <AddOfferModal
          visible={showOfferModal}
          onDismiss={() => setShowOfferModal(false)}
          onSave={handleSaveOffer}
          isLoading={isCreatingOffer}
        />
        <AddItemModal
          visible={showItemModal}
          onDismiss={() => setShowItemModal(false)}
          onSave={handleSaveItem}
          isLoading={isCreatingItem}
          categories={categories}
        />
        <AddCategoryModal
          visible={showCategoryModal}
          onDismiss={() => setShowCategoryModal(false)}
          onSave={handleSaveCategory}
          isLoading={isCreatingCategory}
        />
      </ScrollView>
    </PaperProvider>
  );
};

export default FoodDeliveryApp;
