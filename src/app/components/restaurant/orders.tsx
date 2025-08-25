import React from "react";
import { Image, ScrollView, Text, TouchableOpacity, View, Alert, RefreshControl } from "react-native";
import { Avatar, Icon, ActivityIndicator } from "react-native-paper";
import { styles } from "../css/restaurant/ordertracking";
import { apiConnector } from "../../../services/apiConnector";
import { Order, OrderStatus, PaginationInfo } from "../../../services/apiConfig";
import { useAppSelector } from "../../../store/hooks";
import { selectToken, selectIsAuthenticated } from "../../../store/slices/authSlice";

const OrderTracking = () => {
  const [activeTab, setActiveTab] = React.useState<OrderStatus>("pending");
  const [selectedOrder, setSelectedOrder] = React.useState<Order | null>(null);
  const [orders, setOrders] = React.useState<Order[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [refreshing, setRefreshing] = React.useState(false);
  const [pagination, setPagination] = React.useState<PaginationInfo | null>(null);
  const [currentPage, setCurrentPage] = React.useState(1);
  // Get authentication state from Redux
  const token = useAppSelector(selectToken);
  const isAuthenticated = useAppSelector(selectIsAuthenticated);

  // Define tabs based on order statuses
  const tabs: OrderStatus[] = ["pending", "confirmed", "preparing", "ready", "delivered", "cancelled"];

  // Filter orders by active tab
  const filteredOrders = orders.filter((order) => order.status === activeTab);

  // Fetch orders from API
  const fetchOrders = async (status?: OrderStatus, page: number = 1, refresh: boolean = false) => {
    try {
      console.log("🔐 [ORDERS] Fetching orders with token:", token ? `${token.substring(0, 20)}...` : 'null');
      console.log("🔐 [ORDERS] Authentication state:", { isAuthenticated, token: !!token });
      
      if (!token) {
        console.warn("No token available for fetching orders");
        return;
      }

      setLoading(true);
      const response = await apiConnector.getRestaurantOrders(token, status, page, 10);
      
      if (response.success && response.data) {
        const { orders: fetchedOrders, pagination: fetchedPagination } = response.data;
        
        // Debug: Log the first order to see the data structure
        if (fetchedOrders.length > 0) {
          console.log("🔍 [ORDERS] First order data structure:", {
            id: fetchedOrders[0]._id,
            orderNumber: fetchedOrders[0].orderNumber,
            totalAmount: fetchedOrders[0].totalAmount,
            orderDate: fetchedOrders[0].orderDate,
            orderTime: fetchedOrders[0].orderTime,
            customerName: fetchedOrders[0].customerName,
            customer: fetchedOrders[0].customer,
            status: fetchedOrders[0].status,
            items: fetchedOrders[0].items?.map(item => ({
              name: item.name,
              image: item.image,
              price: item.price
            }))
          });
        }
        
        if (refresh || page === 1) {
          setOrders(fetchedOrders);
        } else {
          setOrders(prev => [...prev, ...fetchedOrders]);
        }
        setPagination(fetchedPagination);
        setCurrentPage(page);
        
        // Set first order as selected if no order is selected
        if (!selectedOrder && fetchedOrders.length > 0) {
          setSelectedOrder(fetchedOrders[0]);
        }
      } else {
        Alert.alert("Error", response.message || "Failed to fetch orders");
      }
    } catch (error: any) {
      console.error("Error fetching orders:", error);
      Alert.alert("Error", error.message || "Failed to fetch orders");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Update order status
  const updateOrderStatus = async (orderId: string, newStatus: OrderStatus) => {
    try {
      if (!token) {
        Alert.alert("Error", "Authentication required");
        return;
      }

      setLoading(true);
      const response = await apiConnector.updateOrderStatus(orderId, newStatus, token);
      
      if (response.success) {
        // Update the order in the local state
        setOrders(prev => prev.map(order => 
          order._id === orderId 
            ? { ...order, status: newStatus }
            : order
        ));
        
        // Update selected order if it's the one being updated
        if (selectedOrder?._id === orderId) {
          setSelectedOrder(prev => prev ? { ...prev, status: newStatus } : null);
        }
        
        Alert.alert("Success", `Order status updated to ${newStatus}`);
        
        // Refresh orders to get updated data
        fetchOrders(activeTab, 1, true);
      } else {
        Alert.alert("Error", response.message || "Failed to update order status");
      }
    } catch (error: any) {
      console.error("Error updating order status:", error);
      Alert.alert("Error", error.message || "Failed to update order status");
    } finally {
      setLoading(false);
    }
  };

  // Cancel order
  const cancelOrder = async (orderId: string, reason: string) => {
    try {
      if (!token) {
        Alert.alert("Error", "Authentication required");
        return;
      }

      setLoading(true);
      const response = await apiConnector.cancelOrder(orderId, reason, token);
      
      if (response.success) {
        // Update the order in the local state
        setOrders(prev => prev.map(order => 
          order._id === orderId 
            ? { ...order, status: 'cancelled' }
            : order
        ));
        
        // Update selected order if it's the one being cancelled
        if (selectedOrder?._id === orderId) {
          setSelectedOrder(prev => prev ? { ...prev, status: 'cancelled' } : null);
        }
        
        Alert.alert("Success", "Order cancelled successfully");
        
        // Refresh orders to get updated data
        fetchOrders(activeTab, 1, true);
      } else {
        Alert.alert("Error", response.message || "Failed to cancel order");
      }
    } catch (error: any) {
      console.error("Error cancelling order:", error);
      Alert.alert("Error", error.message || "Failed to cancel order");
    } finally {
      setLoading(false);
    }
  };

  // Handle tab change
  const handleTabChange = (tab: OrderStatus) => {
    setActiveTab(tab);
    setSelectedOrder(null);
    fetchOrders(tab, 1, true);
  };

  // Handle order selection
  const handleOrderSelect = (order: Order) => {
    setSelectedOrder(order);
  };

  // Handle refresh
  const handleRefresh = () => {
    setRefreshing(true);
    fetchOrders(activeTab, 1, true);
  };

  // Load more orders
  const loadMoreOrders = () => {
    if (pagination && pagination.hasNextPage && !loading) {
      fetchOrders(activeTab, currentPage + 1);
    }
  };

  // Monitor authentication state changes
  React.useEffect(() => {
    console.log("🔐 [ORDERS] Auth state changed:", { isAuthenticated, token: !!token });
    
    // Check if we have a token but isAuthenticated is false (persistence issue)
    if (token && !isAuthenticated) {
      console.log("⚠️ [ORDERS] Potential persistence issue: token exists but not authenticated");
    }
  }, [isAuthenticated, token]);

  // Initial load
  React.useEffect(() => {
    console.log("🚀 [ORDERS] Initial load effect triggered:", { token: !!token, isAuthenticated });
    if (token && isAuthenticated) {
      console.log("✅ [ORDERS] Starting to fetch orders...");
      fetchOrders(activeTab, 1, true);
    } else {
      console.log("❌ [ORDERS] Cannot fetch orders - missing token or not authenticated");
    }
  }, [token, isAuthenticated, activeTab]);

  const renderTabButton = (tab: OrderStatus) => (
    <TouchableOpacity
      key={tab}
      style={[
        styles.tabButton,
        activeTab === tab ? styles.activeTab : styles.inactiveTab,
        { marginRight: 15, minWidth: 100, alignItems: 'center' }
      ]}
      onPress={() => handleTabChange(tab)}
    >
      <Text
        style={[
          styles.tabText,
          activeTab === tab ? styles.activeTabText : styles.inactiveTabText,
        ]}
        numberOfLines={1}
      >
        {tab.charAt(0).toUpperCase() + tab.slice(1)}
      </Text>
    </TouchableOpacity>
  );

  const renderOrderItem = (order: Order) => {
    const isSelected = selectedOrder?._id === order._id;

    // Debug: Log the order data to see what we're getting
    console.log("🔍 [ORDERS] Rendering order:", {
      id: order._id,
      orderNumber: order.orderNumber,
      totalAmount: order.totalAmount,
      orderDate: order.orderDate,
      orderTime: order.orderTime,
      status: order.status
    });

    // Safely extract values with fallbacks
    const orderNumber = typeof order.orderNumber === 'string' ? order.orderNumber : 
                       typeof order.orderNumber === 'object' ? 'N/A' : String(order.orderNumber || 'N/A');
    
    const totalAmount = typeof order.totalAmount === 'number' ? order.totalAmount : 
                       typeof order.totalAmount === 'object' ? 'N/A' : Number(order.totalAmount) || 'N/A';
    
    const orderDate = typeof order.orderDate === 'string' ? order.orderDate : 
                     typeof order.orderDate === 'object' ? 'N/A' : String(order.orderDate || 'N/A');
    
    const orderTime = typeof order.orderTime === 'string' ? order.orderTime : 
                     typeof order.orderTime === 'object' ? 'N/A' : String(order.orderTime || 'N/A');

    return (
      <TouchableOpacity
        key={order._id}
        style={[
          styles.orderItem,
          isSelected && styles.selectedOrderItem,
        ]}
        onPress={() => handleOrderSelect(order)}
      >
        <View style={styles.orderHeader}>
          <Text style={styles.orderTitle}>Order #{orderNumber}</Text>
          <Text style={styles.orderPrice}>₹{totalAmount}</Text>
          <Text style={styles.arrow}>›</Text>
        </View>
        <Text style={styles.orderDate}>
          {orderDate !== 'N/A' ? new Date(orderDate).toLocaleDateString() : 'N/A'}, {orderTime}
        </Text>
      </TouchableOpacity>
    );
  };

  const renderStatusActions = (order: Order) => {
    switch (order.status) {
      case 'pending':
        return (
          <View style={{ flexDirection: 'row', gap: 10, marginTop: 10 }}>
            <TouchableOpacity
              style={{ backgroundColor: '#4CAF50', padding: 8, borderRadius: 5 }}
              onPress={() => updateOrderStatus(order._id, 'confirmed')}
            >
              <Text style={{ color: 'white', textAlign: 'center' }}>Confirm</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{ backgroundColor: '#f44336', padding: 8, borderRadius: 5 }}
              onPress={() => {
                Alert.prompt(
                  "Cancel Order",
                  "Please provide a reason for cancellation:",
                  (reason) => {
                    if (reason && reason.trim()) {
                      cancelOrder(order._id, reason.trim());
                    }
                  }
                );
              }}
            >
              <Text style={{ color: 'white', textAlign: 'center' }}>Cancel</Text>
            </TouchableOpacity>
          </View>
        );
      case 'confirmed':
        return (
          <TouchableOpacity
            style={{ backgroundColor: '#2196F3', padding: 8, borderRadius: 5, marginTop: 10 }}
            onPress={() => updateOrderStatus(order._id, 'preparing')}
          >
            <Text style={{ color: 'white', textAlign: 'center' }}>Start Preparing</Text>
          </TouchableOpacity>
        );
      case 'preparing':
        return (
          <TouchableOpacity
            style={{ backgroundColor: '#FF9800', padding: 8, borderRadius: 5, marginTop: 10 }}
            onPress={() => updateOrderStatus(order._id, 'ready')}
          >
            <Text style={{ color: 'white', textAlign: 'center' }}>Mark Ready</Text>
          </TouchableOpacity>
        );
      case 'ready':
        return (
          <TouchableOpacity
            style={{ backgroundColor: '#9C27B0', padding: 8, borderRadius: 5, marginTop: 10 }}
            onPress={() => updateOrderStatus(order._id, 'delivered')}
          >
            <Text style={{ color: 'white', textAlign: 'center' }}>Mark Delivered</Text>
          </TouchableOpacity>
        );
      default:
        return null;
    }
  };

  // Show authentication message if not logged in
  if (!isAuthenticated || !token) {
    return (
      <View style={styles.container}>
        <View style={{ padding: 20, alignItems: 'center', justifyContent: 'center', flex: 1 }}>
          <Text style={{ fontSize: 18, textAlign: 'center', marginBottom: 10 }}>
            Please login to view orders
          </Text>
          <Text style={{ fontSize: 14, textAlign: 'center', color: '#666' }}>
            You need to be authenticated to access order management
          </Text>
          <Text style={{ fontSize: 12, textAlign: 'center', color: '#999', marginTop: 10 }}>
            Debug: isAuthenticated={String(isAuthenticated)}, token={token ? 'present' : 'missing'}
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView 
        style={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
        onScroll={({ nativeEvent }) => {
          const { layoutMeasurement, contentOffset, contentSize } = nativeEvent;
          const paddingToBottom = 20;
          if (layoutMeasurement.height + contentOffset.y >= contentSize.height - paddingToBottom) {
            loadMoreOrders();
          }
        }}
        scrollEventThrottle={400}
      >
        {/* Debug Info - Remove this in production */}
        <View style={{ padding: 10, backgroundColor: '#f0f0f0', margin: 10, borderRadius: 5 }}>
          <Text style={{ fontSize: 12, color: '#666' }}>
            🔐 Auth: {isAuthenticated ? 'Yes' : 'No'} | 
            📱 Token: {token ? 'Present' : 'Missing'} | 
            📦 Orders: {orders.length} | 
            🏷️ Active Tab: {activeTab}
          </Text>
          <Text style={{ fontSize: 10, color: '#999', marginTop: 5 }}>
            Token Preview: {token ? token.substring(0, 30) + '...' : 'None'}
          </Text>
          <TouchableOpacity 
            style={{ backgroundColor: '#007AFF', padding: 8, borderRadius: 5, marginTop: 5 }}
            onPress={() => {
              console.log("🔄 [ORDERS] Manual refresh triggered");
              if (token && isAuthenticated) {
                fetchOrders(activeTab, 1, true);
              } else {
                Alert.alert("Debug", `Token: ${!!token}, Auth: ${isAuthenticated}`);
              }
            }}
          >
            <Text style={{ color: 'white', textAlign: 'center', fontSize: 12 }}>
              🔄 Manual Refresh
            </Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={{ backgroundColor: '#FF6B35', padding: 8, borderRadius: 5, marginTop: 5 }}
            onPress={() => {
              console.log("🧪 [ORDERS] Test API call triggered");
              Alert.alert("Test API", `Token: ${token ? 'Present' : 'Missing'}\nAuth: ${isAuthenticated}\nToken Preview: ${token ? token.substring(0, 50) + '...' : 'None'}`);
            }}
          >
            <Text style={{ color: 'white', textAlign: 'center', fontSize: 12 }}>
              🧪 Test Auth State
            </Text>
          </TouchableOpacity>
        </View>

        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 20 }}
          style={styles.tabContainer}
        >
          {tabs.map(renderTabButton)}
        </ScrollView>

        {loading && orders.length === 0 ? (
          <View style={{ padding: 20, alignItems: 'center' }}>
            <ActivityIndicator size="large" color="#FF4500" />
            <Text style={{ marginTop: 10 }}>Loading orders...</Text>
          </View>
        ) : (
        <View style={styles.orderList}>
          {filteredOrders.length > 0 ? (
            filteredOrders.map(renderOrderItem)
          ) : (
              <Text style={styles.noOrderText}>No {activeTab} orders found</Text>
          )}
        </View>
        )}

        {/* Order Details Section */}
        {selectedOrder ? (
          <View style={styles.orderDetailsSection}>
            <Text style={styles.sectionTitle}>Order Details</Text>

            <View style={styles.orderInfo}>
              <Text style={styles.orderNumber}>
                Order #{typeof selectedOrder.orderNumber === 'string' ? selectedOrder.orderNumber : 'N/A'}
              </Text>
              <Text style={styles.orderDateTime}>
                {typeof selectedOrder.orderDate === 'string' ? 
                  new Date(selectedOrder.orderDate).toLocaleDateString() : 'N/A'}, 
                {typeof selectedOrder.orderTime === 'string' ? selectedOrder.orderTime : 'N/A'}
              </Text>
            </View>

                        {/* User Info */}
            <View style={styles.userInfo}>
              <Avatar.Image
                size={50}
                source={
                  typeof selectedOrder.customer === 'object' && selectedOrder.customer.profileImage ? 
                  { uri: selectedOrder.customer.profileImage } :
                  require("../../../../assets/images/burger.jpg")
                }
                onError={() => console.log("❌ [ORDERS] Failed to load customer profile image")}
              />
              <View style={styles.userDetails}>
                <Text style={styles.userName}>
                  {typeof selectedOrder.customerName === 'string' ? selectedOrder.customerName : 'N/A'}
                </Text>
                <Text style={styles.userSince}>
                  Customer ID: {typeof selectedOrder.customer === 'string' ? selectedOrder.customer : 
                    (typeof selectedOrder.customer === 'object' ? selectedOrder.customer._id : 'N/A')}
                </Text>
              </View>
            </View>

            {/* Delivery Address */}
            <View style={styles.deliverySection}>
              <Text style={styles.deliveryTitle}>Delivery Address</Text>
              <View style={styles.addressContainer}>
                <Icon source="map-marker-outline" size={20} color="#FF4500" />
                                 <Text style={styles.address}>
                   {typeof selectedOrder.deliveryAddress?.street === 'string' ? selectedOrder.deliveryAddress.street : 'N/A'}, 
                   {typeof selectedOrder.deliveryAddress?.city === 'string' ? selectedOrder.deliveryAddress.city : 'N/A'}
                   {typeof selectedOrder.deliveryAddress?.state === 'string' && selectedOrder.deliveryAddress.state ? 
                     `, ${selectedOrder.deliveryAddress.state}` : ''}
                   {typeof selectedOrder.deliveryAddress?.postalCode === 'string' && selectedOrder.deliveryAddress.postalCode ? 
                     ` ${selectedOrder.deliveryAddress.postalCode}` : ''}
                 </Text>
              </View>
            </View>

            {/* Time and Payment Info */}
            <View style={styles.infoRow}>
                             <View style={styles.infoItem}>
                 <Text style={styles.infoLabel}>Estimation Time</Text>
                 <Text style={styles.infoValue}>
                   {typeof selectedOrder.estimatedDelivery === 'string' ? selectedOrder.estimatedDelivery : 'N/A'}
                 </Text>
               </View>
               <View style={styles.infoItem}>
                 <Text style={styles.infoLabel}>Total Amount</Text>
                 <Text style={styles.infoValue}>
                   ₹{typeof selectedOrder.totalAmount === 'number' ? selectedOrder.totalAmount : 'N/A'}
                 </Text>
               </View>
            </View>

                         {/* Description */}
             {typeof selectedOrder.specialInstructions === 'string' && selectedOrder.specialInstructions && (
               <Text style={styles.description}>{selectedOrder.specialInstructions}</Text>
             )}

            {/* Order Menu */}
            <View style={styles.orderMenuSection}>
              <Text style={styles.sectionTitle}>Order Menu</Text>
                             {Array.isArray(selectedOrder.items) && selectedOrder.items.map((item, index) => (
                 <View key={item.itemId || `item-${index}`} style={styles.menuItem}>
                   <Image
                     source={
                       item.image ? 
                       { uri: item.image } : 
                       require("../../../../assets/images/burger.jpg")
                     }
                     style={styles.menuItemImage}
                     onError={() => console.log("❌ [ORDERS] Failed to load item image:", item.image)}
                     defaultSource={require("../../../../assets/images/burger.jpg")}
                   />
                   <View style={styles.menuItemInfo}>
                     <Text style={styles.menuItemName}>
                       {typeof item.name === 'string' ? item.name : 'Demo Item'}
                     </Text>
                     <Text style={styles.menuItemQuantity}>
                       x {typeof item.quantity === 'number' ? item.quantity : 1}
                     </Text>
                   </View>
                   <Text style={styles.menuItemPrice}>
                     ₹{typeof item.price === 'number' ? item.price : '99'}
                   </Text>
                 </View>
               ))}
            </View>

            {/* Status Actions */}
            {renderStatusActions(selectedOrder)}

            {/* Loading indicator for actions */}
            {loading && (
              <View style={{ padding: 10, alignItems: 'center' }}>
                <ActivityIndicator size="small" color="#FF4500" />
                <Text style={{ marginTop: 5, fontSize: 12 }}>Processing...</Text>
              </View>
            )}
          </View>
        ) : (
          <View style={styles.noOrderDetails}>
            <Text style={styles.noOrderText}>Select an order to view details</Text>
          </View>
        )}

        {/* Load more indicator */}
        {pagination && pagination.hasNextPage && (
          <View style={{ padding: 20, alignItems: 'center' }}>
            {loading ? (
              <ActivityIndicator size="small" color="#FF4500" />
            ) : (
              <TouchableOpacity onPress={loadMoreOrders}>
                <Text style={{ color: '#FF4500' }}>Load More Orders</Text>
              </TouchableOpacity>
            )}
          </View>
        )}
      </ScrollView>
    </View>
  );
};

export default OrderTracking;