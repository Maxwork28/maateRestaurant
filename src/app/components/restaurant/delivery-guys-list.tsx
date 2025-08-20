import React, { useState } from "react";
import {
  FlatList,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import {
  Button,
  Card,
  Chip,
  Icon,
  Modal,
  Portal,
  Searchbar,
  Text,
  ToggleButton,
} from "react-native-paper";

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
              <Icon source="package-variant" size={24} color="#4CAF50" />
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
        <Searchbar
          placeholder="Search with name or ids"
          onChangeText={handleSearch}
          value={searchQuery}
          style={styles.searchBar}
          iconColor="#ff6b35"
          placeholderTextColor="#333"
          inputStyle={{ color: "#333" }}
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
          iconColor={showFavoritesOnly ? "#fff" : "#ff6b35"}
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
                        favoriteDrivers.includes(item.id) ? "#ff6b35" : "#CCC"
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
                  <Icon source="heart" color="#ff6b35" size={24} />
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
    backgroundColor: "#f8f9fa",
    flex: 1,
    width: "100%",
  },
  ordersSummaryCard: {
    marginBottom: 16,
    borderRadius: 10,
    elevation: 2,
    backgroundColor: "white",
  },
  ordersSummaryHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  ordersSummaryTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
    color: "#333",
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
  },
  searchBar: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  filterContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    paddingHorizontal: 4,
  },
  favoriteToggle: {
    marginRight: 12,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ff6b35",
    borderRadius: 8,
  },
  favoriteToggleActive: {
    backgroundColor: "#ff6b35",
  },
  filterText: {
    flex: 1,
    fontSize: 14,
    color: "#666",
  },
  favoriteCountChip: {
    backgroundColor: "#fff3cd",
    borderColor: "#ff6b35",
    borderWidth: 1,
  },
  favoriteCountText: {
    color: "#ff6b35",
    fontSize: 12,
  },
  card: {
    marginBottom: 10,
    borderRadius: 10,
    elevation: 2,
    backgroundColor: "white",
  },
  unavailableCard: {
    opacity: 0.7,
    backgroundColor: "#f5f5f5",
  },
  favoriteCard: {
    borderColor: "#ff6b35",
    borderWidth: 1,
    elevation: 3,
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
    color: "#333",
  },
  name: {
    fontSize: 16,
    fontWeight: "600",
    flex: 1,
    color: "#333",
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
    color: "#666",
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
    backgroundColor: "#fff3cd",
    borderColor: "#ff6b35",
    borderWidth: 1,
  },
  favoriteLabelText: {
    color: "#ff6b35",
    fontSize: 10,
  },
  contactSection: {
    alignItems: "flex-end",
  },
  phone: {
    fontSize: 12,
    color: "#333",
  },
  email: {
    fontSize: 12,
    color: "#999",
    marginBottom: 6,
  },
  assignBtn: {
    backgroundColor: "#FA4A0C",
    borderRadius: 6,
    paddingVertical: 2,
    paddingHorizontal: 12,
  },
  favoriteAssignBtn: {
    backgroundColor: "#ff6b35",
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
    color: "#999",
    marginTop: 12,
    textAlign: "center",
  },
  modalContainer: {
    backgroundColor: "white",
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
    color: "#333",
  },
  driverInfo: {
    backgroundColor: "#f8f9fa",
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  driverDetail: {
    fontSize: 14,
    color: "#666",
    marginBottom: 4,
  },
  favoriteDetail: {
    color: "#ff6b35",
    fontWeight: "500",
  },
  selectOrdersTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 12,
    color: "#333",
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
    borderRadius: 8,
    marginBottom: 8,
    backgroundColor: "#f8f9fa",
  },
  selectedOrderItem: {
    backgroundColor: "#E8F5E9",
    borderColor: "#4CAF50",
    borderWidth: 1,
  },
  orderItemContent: {
    flex: 1,
  },
  orderItemId: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
  },
  orderItemCustomer: {
    fontSize: 12,
    color: "#666",
    marginTop: 2,
  },
  orderItemTotal: {
    fontSize: 12,
    color: "#4CAF50",
    fontWeight: "500",
    marginTop: 2,
  },
  modalActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
  },
  cancelBtn: {
    flex: 1,
    borderColor: "#CCC",
  },
  confirmBtn: {
    flex: 1,
    backgroundColor: "#4CAF50",
  },
});
