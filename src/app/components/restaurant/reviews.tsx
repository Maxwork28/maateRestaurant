import { MaterialIcons } from "@expo/vector-icons";
import React from "react";
import { FlatList, Image, Text, View, Alert, RefreshControl, ActivityIndicator } from "react-native";
import { Avatar } from "react-native-paper";
import { styles } from "../css/restaurant/reviewcard";
import { apiConnector } from "../../../services/apiConnector";
import { Review, ReviewStats } from "../../../services/apiConfig";
import { useAppSelector } from "../../../store/hooks";
import { selectToken, selectIsAuthenticated } from "../../../store/slices/authSlice";

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
const ReviewCard = () => {
  // Get authentication state from Redux
  const token = useAppSelector(selectToken);
  const isAuthenticated = useAppSelector(selectIsAuthenticated);

  // State variables
  const [reviews, setReviews] = React.useState<Review[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [refreshing, setRefreshing] = React.useState(false);
  const [stats, setStats] = React.useState<ReviewStats | null>(null);
  const [currentPage, setCurrentPage] = React.useState(1);
  const [hasNextPage, setHasNextPage] = React.useState(false);

  // Fetch reviews from API
  const fetchReviews = async (page: number = 1, refresh: boolean = false) => {
    try {
      if (!token || !isAuthenticated) {
        console.warn("No token available for fetching reviews");
        return;
      }

      setLoading(true);
      const response = await apiConnector.getRestaurantReviews(token, page, 10);
      
      if (response.success && response.data) {
        const { reviews: fetchedReviews, pagination } = response.data;
        
        if (refresh || page === 1) {
          setReviews(fetchedReviews);
        } else {
          setReviews(prev => [...prev, ...fetchedReviews]);
        }
        
        setCurrentPage(page);
        setHasNextPage(pagination.hasNextPage);
        
        console.log("⭐ [REVIEWS] Reviews fetched:", fetchedReviews.length);
      } else {
        Alert.alert("Error", response.message || "Failed to fetch reviews");
      }
    } catch (error: any) {
      console.error("Error fetching reviews:", error);
      Alert.alert("Error", error.message || "Failed to fetch reviews");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Fetch review statistics
  const fetchReviewStats = async () => {
    try {
      if (!token || !isAuthenticated) return;

      const response = await apiConnector.getReviewStats(token);
      if (response.success && response.data) {
        setStats(response.data);
      }
    } catch (error) {
      console.error("Error fetching review stats:", error);
    }
  };

  // Handle refresh
  const handleRefresh = () => {
    setRefreshing(true);
    fetchReviews(1, true);
    fetchReviewStats();
  };

  // Load more reviews
  const loadMoreReviews = () => {
    if (hasNextPage && !loading) {
      fetchReviews(currentPage + 1);
    }
  };

  // Initial load
  React.useEffect(() => {
    if (token && isAuthenticated) {
      fetchReviews(1, true);
      fetchReviewStats();
    }
  }, [token, isAuthenticated]);

  // Show authentication message if not logged in
  if (!isAuthenticated || !token) {
    return (
      <View style={styles.listContainer}>
        <View style={{ padding: 20, alignItems: 'center', justifyContent: 'center', flex: 1 }}>
          <Text style={{ fontSize: 18, textAlign: 'center', marginBottom: 10 }}>
            Please login to view reviews
          </Text>
          <Text style={{ fontSize: 14, textAlign: 'center', color: '#666' }}>
            You need to be authenticated to access review management
          </Text>
        </View>
      </View>
    );
  }

  const renderItem = ({ item }: { item: Review }) => (
    <View style={styles.cardContainer}>
      {/* Header */}
      <View style={styles.header}>
        <Image
          source={
            item.customerImage ? 
            { uri: item.customerImage } : 
            require("../../../../assets/images/burger.jpg")
          }
          style={styles.restaurantImage}
        />
        <View style={styles.headerInfo}>
          <Text style={styles.restaurantName}>{item.restaurantName}</Text>
          <Text style={styles.location}>{item.restaurantLocation || 'Location not specified'}</Text>
          <View style={styles.ratingContainer}>
            <MaterialIcons name="star" size={14} color="#FFB400" />
            <Text style={styles.rating}>{item.rating} Rating</Text>
          </View>
        </View>
        <View style={styles.userInfo}>
          <Avatar.Image 
            size={40} 
            source={
              item.customer?.profileImage ? 
              { uri: item.customer.profileImage } : 
              require("../../../../assets/images/burger.jpg")
            } 
          />
          <Text style={styles.userName}>{item.customerName}</Text>
          <Text style={styles.userLocation}>{item.customer?.email || 'Email not specified'}</Text>
        </View>
      </View>

      {/* Description */}
      <View style={styles.descriptionContainer}>
        <MaterialIcons
          name="format-quote"
          size={24}
          color="#FF4500"
          style={styles.openQuote}
        />
        <Text style={styles.descriptionText}>{item.review}</Text>
        <MaterialIcons
          name="format-quote"
          size={24}
          color="#FF4500"
          style={styles.closeQuote}
        />
      </View>

      {/* Footer */}
      <Text style={styles.footerText}>Ordered : {new Date(item.orderDate).toLocaleDateString()}</Text>
      
      {/* Review metadata */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 10, paddingHorizontal: 15 }}>
        <Text style={{ fontSize: 12, color: '#666' }}>
          Review Date: {new Date(item.reviewDate).toLocaleDateString()}
        </Text>
        <Text style={{ fontSize: 12, color: '#666' }}>
          Order: #{item.orderNumber}
        </Text>
      </View>
    </View>
  );

  return (
    <View style={{ flex: 1 }}>
      {/* Review Statistics Header */}
      {stats && (
        <View style={{ padding: 15, backgroundColor: '#f8f9fa', margin: 10, borderRadius: 8 }}>
          <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 10, textAlign: 'center' }}>
            Review Summary
          </Text>
          <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
            <View style={{ alignItems: 'center' }}>
              <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#FF4500' }}>
                {stats.averageRating.toFixed(1)}
              </Text>
              <Text style={{ fontSize: 12, color: '#666' }}>Average Rating</Text>
            </View>
            <View style={{ alignItems: 'center' }}>
              <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#FF4500' }}>
                {stats.totalReviews}
              </Text>
              <Text style={{ fontSize: 12, color: '#666' }}>Total Reviews</Text>
            </View>
          </View>
        </View>
      )}

      {/* Reviews List */}
      <FlatList
        data={reviews}
        renderItem={renderItem}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.listContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
        onEndReached={loadMoreReviews}
        onEndReachedThreshold={0.1}
        ListEmptyComponent={
          loading ? (
            <View style={{ padding: 20, alignItems: 'center' }}>
              <ActivityIndicator size="large" color="#FF4500" />
              <Text style={{ marginTop: 10 }}>Loading reviews...</Text>
            </View>
          ) : (
            <View style={{ padding: 20, alignItems: 'center' }}>
              <Text style={{ fontSize: 16, color: '#666' }}>No reviews found</Text>
            </View>
          )
        }
        ListFooterComponent={
          hasNextPage ? (
            <View style={{ padding: 20, alignItems: 'center' }}>
              {loading ? (
                <ActivityIndicator size="small" color="#FF4500" />
              ) : (
                <Text style={{ color: '#FF4500' }}>Load More Reviews</Text>
              )}
            </View>
          ) : null
        }
      />
    </View>
  );
};

export default ReviewCard;
