import React, { useState } from "react";
import {
  FlatList,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
  TextInput,
} from "react-native";
import {
  Button,
  Card,
  Chip,
  Icon,
  Modal,
  Portal,
  Text,
  ToggleButton,
} from "react-native-paper";
import { MaterialIcons } from "@expo/vector-icons";

const deliveryGuys = Array.from({ length: 10 }).map((_, index) => ({
  id: index + 1,
  name: "Jordan's" + index,
  code: "XYZ5678" + index,
  phone: "(91) 87654-3210",
  email: "jordan@example.com",
  currentOrders: Math.floor(Math.random() * 3), // Random current orders for demo
  isAvailable: true,
  isFavorite: index % 3 === 0,
}));

const DeliveryGuyList = ({ completedOrders = [] }: any) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDriver, setSelectedDriver] = useState<any>(null);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedOrders, setSelectedOrders] = useState<string[]>([]);
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [favoriteDrivers, setFavoriteDrivers] = useState<number[]>(
    deliveryGuys.filter((guy) => guy.isFavorite).map((guy) => guy.id)
  );

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const toggleFavorite = (driverId: number) => {
    setFavoriteDrivers((prev) =>
      prev.includes(driverId)
        ? prev.filter((id) => id !== driverId)
        : [...prev, driverId]
    );
  };

  const filteredItems = deliveryGuys.filter((guy) => {
    const matchesSearch =
      guy.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      guy.code.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesFavoriteFilter = showFavoritesOnly
      ? favoriteDrivers.includes(guy.id)
      : true;

    return matchesSearch && matchesFavoriteFilter;
  });

  const handleAssignPress = (driver: any) => {
    setSelectedDriver(driver);
    setSelectedOrders([]); // Reset selected orders
    setShowAssignModal(true);
  };

  const toggleOrderSelection = (orderId: string) => {
    setSelectedOrders((prev) =>
      prev.includes(orderId)
        ? prev.filter((id) => id !== orderId)
        : [...prev, orderId]
    );
  };

  const handleConfirmAssignment = () => {
    if (selectedOrders.length > 0 && selectedDriver) {
      console.log(
        `Assigning orders ${selectedOrders.join(", ")} to ${
          selectedDriver.name
        }`
      );
      // Here you would typically call your API to assign orders
      setShowAssignModal(false);
      setSelectedDriver(null);
      setSelectedOrders([]);
    }
  };

  const getDriverStatusColor = (driver: any) => {
    if (!driver.isAvailable) return "#FF6B6B";
    if (driver.currentOrders === 0) return "#51CF66";
    if (driver.currentOrders <= 2) return "#FFD43B";
    return "#FF8C69";
  };

  const getDriverStatusText = (driver: any) => {
    if (!driver.isAvailable) return "Offline";
    if (driver.currentOrders === 0) return "Available";
    return `${driver.currentOrders} orders`;
  };

  const favoriteCount = favoriteDrivers.length;

  return (
    <View style={styles.container}>
      {/* Orders Summary Header */}
      {completedOrders.length > 0 && (
        <Card style={styles.ordersSummaryCard}>
          <Card.Content>
            <View style={styles.ordersSummaryHeader}>
              <Icon source="package-variant" size={24} color="#6F32AB" />
              <Text style={styles.ordersSummaryTitle}>
                {completedOrders.length} Order
                {completedOrders.length > 1 ? "s" : ""} Ready for Pickup
              </Text>
            </View>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.ordersScroll}
            >
              {completedOrders.map((order: any, index: number) => (
                <Chip
                  key={order.id}
                  style={[styles.orderChip, { backgroundColor: "#E8F5E9" }]}
                  textStyle={styles.orderChipText}
                  compact
                >
                  #{order.id}
                </Chip>
              ))}
            </ScrollView>
          </Card.Content>
        </Card>
      )}

      {/* Search Header */}
      <View style={styles.searchContainer}>
        <MaterialIcons 
          name="search" 
          size={20} 
          color="#6F32AB" 
          style={styles.searchIcon}
        />
        <TextInput
          placeholder="Search with name or ids"
          placeholderTextColor="#434140"
          value={searchQuery}
          onChangeText={handleSearch}
          style={styles.searchBar}
        />
      </View>

      {/* Filter Section */}
      <View style={styles.filterContainer}>
        <ToggleButton
          icon="heart"
          value="favorites"
          status={showFavoritesOnly ? "checked" : "unchecked"}
          onPress={() => setShowFavoritesOnly(!showFavoritesOnly)}
          style={[
            styles.favoriteToggle,
            showFavoritesOnly && styles.favoriteToggleActive,
          ]}
          iconColor={showFavoritesOnly ? "#fff" : "#6F32AB"}
        />
        <Text style={styles.filterText}>
          {showFavoritesOnly
            ? `Showing ${favoriteCount} favorite drivers`
            : "Show favorites only"}
        </Text>
        {favoriteCount > 0 && (
          <Chip
            style={styles.favoriteCountChip}
            textStyle={styles.favoriteCountText}
            compact
          >
            {favoriteCount} ⭐
          </Chip>
        )}
      </View>

      {/* Drivers List */}
      <FlatList
        data={filteredItems}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <Card
            style={[
              styles.card,
              !item.isAvailable && styles.unavailableCard,
              favoriteDrivers.includes(item.id) && styles.favoriteCard,
            ]}
          >
            <Card.Content style={styles.cardContent}>
              <View style={{ flex: 1 }}>
                <View style={styles.nameRow}>
                  <Text style={styles.index}>{item.id}</Text>
                  <Text
                    style={[
                      styles.name,
                      !item.isAvailable && styles.unavailableText,
                    ]}
                  >
                    {item.name}
                  </Text>
                  <TouchableOpacity
                    onPress={() => toggleFavorite(item.id)}
                    style={styles.favoriteButton}
                  >
                    <Icon
                      source={
                        favoriteDrivers.includes(item.id)
                          ? "heart"
                          : "heart-outline"
                      }
                      color={
                        favoriteDrivers.includes(item.id) ? "#6F32AB" : "#CCC"
                      }
                      size={20}
                    />
                  </TouchableOpacity>
                  <Icon
                    source={item.isAvailable ? "check-circle" : "clock-outline"}
                    color={getDriverStatusColor(item)}
                    size={18}
                  />
                </View>
                <Text style={styles.code}>{item.code}</Text>
                <View style={styles.statusRow}>
                  <Chip
                    style={[
                      styles.statusChip,
                      { backgroundColor: getDriverStatusColor(item) + "20" },
                    ]}
                    textStyle={[
                      styles.statusText,
                      { color: getDriverStatusColor(item) },
                    ]}
                    compact
                  >
                    {getDriverStatusText(item)}
                  </Chip>
                  {favoriteDrivers.includes(item.id) && (
                    <Chip
                      style={styles.favoriteLabel}
                      textStyle={styles.favoriteLabelText}
                      compact
                    >
                      ⭐ Favorite
                    </Chip>
                  )}
                </View>
              </View>
              <View style={styles.contactSection}>
                <Text style={styles.phone}>{item.phone}</Text>
                <Text style={styles.email}>{item.email}</Text>
                <Button
                  mode="contained"
                  style={[
                    styles.assignBtn,
                    !item.isAvailable && styles.disabledBtn,
                    completedOrders.length === 0 && styles.disabledBtn,
                    favoriteDrivers.includes(item.id) &&
                      styles.favoriteAssignBtn,
                  ]}
                  labelStyle={{ fontSize: 12 }}
                  textColor="white"
                  disabled={!item.isAvailable || completedOrders.length === 0}
                  onPress={() => handleAssignPress(item)}
                >
                  {completedOrders.length === 0 ? "No Orders" : "Assign"}
                </Button>
              </View>
            </Card.Content>
          </Card>
        )}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Icon source="account-search" size={48} color="#CCC" />
            <Text style={styles.emptyText}>
              {showFavoritesOnly
                ? favoriteCount === 0
                  ? "No favorite drivers yet"
                  : "No favorite drivers match your search"
                : "No drivers found"}
            </Text>
          </View>
        }
      />

      {/* Assignment Modal */}
      <Portal>
        <Modal
          visible={showAssignModal}
          onDismiss={() => setShowAssignModal(false)}
          contentContainerStyle={styles.modalContainer}
        >
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                Assign Orders to {selectedDriver?.name}
              </Text>
              {selectedDriver &&
                favoriteDrivers.includes(selectedDriver.id) && (
                  <Icon source="heart" color="#6F32AB" size={24} />
                )}
            </View>

            <View style={styles.driverInfo}>
              <Text style={styles.driverDetail}>
                ID: {selectedDriver?.code}
              </Text>
              <Text style={styles.driverDetail}>
                Current Orders: {selectedDriver?.currentOrders}
              </Text>
              {selectedDriver &&
                favoriteDrivers.includes(selectedDriver.id) && (
                  <Text style={[styles.driverDetail, styles.favoriteDetail]}>
                    ⭐ Favorite Driver
                  </Text>
                )}
            </View>

            <Text style={styles.selectOrdersTitle}>
              Select Orders to Assign:
            </Text>

            <ScrollView style={styles.ordersListModal}>
              {completedOrders.map((order: any) => (
                <TouchableOpacity
                  key={order.id}
                  style={[
                    styles.orderItem,
                    selectedOrders.includes(order.id) &&
                      styles.selectedOrderItem,
                  ]}
                  onPress={() => toggleOrderSelection(order.id)}
                >
                  <View style={styles.orderItemContent}>
                    <Text style={styles.orderItemId}>Order #{order.id}</Text>
                    {order.customerName && (
                      <Text style={styles.orderItemCustomer}>
                        {order.customerName}
                      </Text>
                    )}
                    {order.total && (
                      <Text style={styles.orderItemTotal}>${order.total}</Text>
                    )}
                  </View>
                  <Icon
                    source={
                      selectedOrders.includes(order.id)
                        ? "check-circle"
                        : "circle-outline"
                    }
                    color={
                      selectedOrders.includes(order.id) ? "#4CAF50" : "#CCC"
                    }
                    size={24}
                  />
                </TouchableOpacity>
              ))}
            </ScrollView>

            <View style={styles.modalActions}>
              <Button
                mode="outlined"
                onPress={() => setShowAssignModal(false)}
                style={styles.cancelBtn}
                textColor="#333"
              >
                Cancel
              </Button>
              <Button
                mode="contained"
                onPress={handleConfirmAssignment}
                style={styles.confirmBtn}
                disabled={selectedOrders.length === 0}
                textColor="white"
              >
                Assign ({selectedOrders.length})
              </Button>
            </View>
          </View>
        </Modal>
      </Portal>
    </View>
  );
};

export default DeliveryGuyList;

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: "#FDF7F1",
    flex: 1,
    width: "100%",
  },
  ordersSummaryCard: {
    marginBottom: 16,
    borderRadius: 16,
    elevation: 4,
    backgroundColor: "#FDF7F1",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  ordersSummaryHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  ordersSummaryTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 8,
    color: "#434140",
  },
  ordersScroll: {
    flexDirection: "row",
  },
  orderChip: {
    marginRight: 8,
    borderColor: "#4CAF50",
  },
  orderChipText: {
    fontSize: 12,
    color: "#2E7D32",
  },
  searchContainer: {
    marginBottom: 10,
    position: 'relative',
  },
  searchBar: {
    backgroundColor: '#FDF7F1',
    borderRadius: 25,
    height: 40,
    paddingLeft: 50,
    paddingRight: 20,
    paddingVertical: 10,
    fontSize: 14,
    color: '#434140',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  searchIcon: {
    position: 'absolute',
    left: 15,
    top: 10,
    zIndex: 1,
  },
  filterContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    paddingHorizontal: 4,
  },
  favoriteToggle: {
    marginRight: 12,
    backgroundColor: "#FDF7F1",
    borderWidth: 1,
    borderColor: "#6F32AB",
    borderRadius: 8,
  },
  favoriteToggleActive: {
    backgroundColor: "#6F32AB",
  },
  filterText: {
    flex: 1,
    fontSize: 14,
    color: "#434140",
    fontWeight: "500",
  },
  favoriteCountChip: {
    backgroundColor: "#F0E6FF",
    borderColor: "#6F32AB",
    borderWidth: 1,
  },
  favoriteCountText: {
    color: "#6F32AB",
    fontSize: 12,
    fontWeight: "bold",
  },
  card: {
    marginBottom: 15,
    borderRadius: 16,
    elevation: 4,
    backgroundColor: "#FDF7F1",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  unavailableCard: {
    opacity: 0.7,
    backgroundColor: "#F5F5F5",
  },
  favoriteCard: {
    borderColor: "#6F32AB",
    borderWidth: 2,
    elevation: 6,
  },
  cardContent: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  nameRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  index: {
    marginRight: 6,
    fontWeight: "bold",
    color: "#434140",
  },
  name: {
    fontSize: 16,
    fontWeight: "bold",
    flex: 1,
    color: "#434140",
    maxWidth: 200,
    numberOfLines: 1,
    ellipsizeMode: "tail",
  },
  unavailableText: {
    color: "#999",
  },
  favoriteButton: {
    marginHorizontal: 8,
    padding: 2,
  },
  code: {
    fontSize: 14,
    color: "#434140",
    fontWeight: "500",
  },
  statusRow: {
    marginTop: 8,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  statusChip: {
    alignSelf: "flex-start",
  },
  statusText: {
    fontSize: 11,
    fontWeight: "500",
  },
  favoriteLabel: {
    backgroundColor: "#F0E6FF",
    borderColor: "#6F32AB",
    borderWidth: 1,
  },
  favoriteLabelText: {
    color: "#6F32AB",
    fontSize: 10,
    fontWeight: "bold",
  },
  contactSection: {
    alignItems: "flex-end",
  },
  phone: {
    fontSize: 12,
    color: "#434140",
    fontWeight: "500",
  },
  email: {
    fontSize: 12,
    color: "#434140",
    marginBottom: 6,
    fontWeight: "500",
  },
  assignBtn: {
    backgroundColor: "#6F32AB",
    borderRadius: 12,
    paddingVertical: 2,
    paddingHorizontal: 12,
  },
  favoriteAssignBtn: {
    backgroundColor: "#6F32AB",
    elevation: 2,
  },
  disabledBtn: {
    backgroundColor: "#CCC",
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 16,
    color: "#434140",
    marginTop: 12,
    textAlign: "center",
    fontWeight: "bold",
  },
  modalContainer: {
    backgroundColor: "#FDF7F1",
    margin: 20,
    borderRadius: 16,
    padding: 0,
    elevation: 5,
  },
  modalContent: {
    padding: 20,
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
    gap: 8,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#434140",
  },
  driverInfo: {
    backgroundColor: "#F0E6FF",
    padding: 12,
    borderRadius: 12,
    marginBottom: 16,
  },
  driverDetail: {
    fontSize: 14,
    color: "#434140",
    marginBottom: 4,
    fontWeight: "500",
  },
  favoriteDetail: {
    color: "#6F32AB",
    fontWeight: "bold",
  },
  selectOrdersTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 12,
    color: "#434140",
  },
  ordersListModal: {
    maxHeight: 200,
    marginBottom: 20,
  },
  orderItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 12,
    borderRadius: 12,
    marginBottom: 8,
    backgroundColor: "#F0E6FF",
  },
  selectedOrderItem: {
    backgroundColor: "#E8F5E9",
    borderColor: "#6F32AB",
    borderWidth: 2,
  },
  orderItemContent: {
    flex: 1,
  },
  orderItemId: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#434140",
  },
  orderItemCustomer: {
    fontSize: 12,
    color: "#434140",
    marginTop: 2,
    fontWeight: "500",
  },
  orderItemTotal: {
    fontSize: 12,
    color: "#6F32AB",
    fontWeight: "bold",
    marginTop: 2,
  },
  modalActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
  },
  cancelBtn: {
    flex: 1,
    borderColor: "#6F32AB",
  },
  confirmBtn: {
    flex: 1,
    backgroundColor: "#6F32AB",
  },
});
