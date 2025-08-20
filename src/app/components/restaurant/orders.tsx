import {
  orderData,
  orderDetails,
  timeInfo,
  userData,
} from "@/constant/restaurant/orderdata";
import React from "react";
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { Avatar, Icon } from "react-native-paper";
import { styles } from "../css/restaurant/ordertracking";

const OrderTracking = () => {
  const [activeTab, setActiveTab] = React.useState("Order in");
  const [selectedOrder, setSelectedOrder] = React.useState(
    orderData.orders.find((order) => order.status === activeTab) || orderData.orders[0]
  );

  const tabs = ["Order in", "Prepared", "Delivered"];

  // Filter orders by active tab
  const filteredOrders = orderData.orders.filter(
    (order) => order.status === activeTab
  );

  const renderTabButton = (tab: any) => (
    <TouchableOpacity
      key={tab}
      style={[
        styles.tabButton,
        activeTab === tab ? styles.activeTab : styles.inactiveTab,
      ]}
      onPress={() => {
        setActiveTab(tab);
        const firstOrder : any = orderData.orders.find(
          (order) => order.status === tab
        );
        setSelectedOrder(firstOrder);
      }}
    >
      <Text
        style={[
          styles.tabText,
          activeTab === tab ? styles.activeTabText : styles.inactiveTabText,
        ]}
      >
        {tab}
      </Text>
    </TouchableOpacity>
  );


const renderOrderItem = (order: any) => {
  const isSelected = selectedOrder?.id === order.id;

  return (
    <TouchableOpacity
      key={order.uniqueKey}
      style={[
        styles.orderItem,
        isSelected && styles.selectedOrderItem,
      ]}
      onPress={() => setSelectedOrder(order)}
    >
      <View style={styles.orderHeader}>
        <Text style={styles.orderTitle}>Order #{order.id}</Text>
        <Text style={styles.orderPrice}>₹{order.price}</Text>
        <Text style={styles.arrow}>›</Text>
      </View>
      <Text style={styles.orderDate}>
        {order.date}, {order.time}
      </Text>
    </TouchableOpacity>
  );
};


  return (
    <View style={styles.container}>
      <ScrollView style={styles.content}>
        <View style={styles.tabContainer}>{tabs.map(renderTabButton)}</View>

        <View style={styles.orderList}>
          {filteredOrders.length > 0 ? (
            filteredOrders.map(renderOrderItem)
          ) : (
            <Text style={styles.noOrderText}>No orders found</Text>
          )}
        </View>

        {/* Order Details Section */}
        {selectedOrder ? (
          <View style={styles.orderDetailsSection}>
            <Text style={styles.sectionTitle}>Order Details</Text>

            <View style={styles.orderInfo}>
              <Text style={styles.orderNumber}>Order #{selectedOrder.id}</Text>
              <Text style={styles.orderDateTime}>
                {selectedOrder.date}, {selectedOrder.time}
              </Text>
            </View>

            {/* User Info */}
            <View style={styles.userInfo}>
              <Avatar.Image
                size={50}
                source={{
                  uri: "https://randomuser.me/api/portraits/men/75.jpg",
                }}
              />
              <View style={styles.userDetails}>
                <Text style={styles.userName}>{userData.name}</Text>
                <Text style={styles.userSince}>
                  User since {userData.memberSince}
                </Text>
              </View>
            </View>

            {/* Delivery Address */}
            <View style={styles.deliverySection}>
              <Text style={styles.deliveryTitle}>Delivery Address</Text>
              <View style={styles.addressContainer}>
                <Icon source="map-marker-outline" size={20} color="#FF4500" />
                <Text style={styles.address}>{selectedOrder.address}</Text>
              </View>
            </View>

            {/* Time and Payment Info */}
            <View style={styles.infoRow}>
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>Estimation Time</Text>
                <Text style={styles.infoValue}>{timeInfo.estimationTime}</Text>
              </View>
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>Payment</Text>
                <Text style={styles.infoValue}>{timeInfo.paymentTime}</Text>
              </View>
            </View>

            {/* Description */}
            <Text style={styles.description}>{orderDetails.description}</Text>

            {/* Order Menu */}
            <View style={styles.orderMenuSection}>
              <Text style={styles.sectionTitle}>Order Menu</Text>
              {selectedOrder.menuItems.map((item: any) => (
                <View key={item.id} style={styles.menuItem}>
                  <Image
                    source={require("../../../../assets/images/burger.jpg")}
                    style={styles.menuItemImage}
                  />
                  <View style={styles.menuItemInfo}>
                    <Text style={styles.menuItemName}>{item.name}</Text>
                    <Text style={styles.menuItemQuantity}>
                      x {item.quantity || 1}
                    </Text>
                  </View>
                  <Text style={styles.menuItemPrice}>₹{item.price}</Text>
                </View>
              ))}
            </View>
          </View>
        ) : (
          <View style={styles.noOrderDetails}>
            <Text style={styles.noOrderText}>Select an order to view details</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

export default OrderTracking;
