import { filterTabs, subscriptionData } from "@/constant/restaurant/subscriptions";
import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { FlatList, Text, TouchableOpacity, View } from "react-native";
import { Searchbar } from "react-native-paper";
import { styles } from "../css/restaurant/subscriptionscreen";

const SubscriptionList = () => {
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("All");
  const router = useRouter();
  const filteredData = subscriptionData.filter(
    (item) =>
      (activeTab === "All" || item.status === activeTab) &&
      item.name.toLowerCase().includes(search.toLowerCase())
  );

  const renderTab = (tab: any) => (
    <TouchableOpacity
      key={tab}
      style={[styles.tabButton, activeTab === tab && styles.activeTabButton]}
      onPress={() => setActiveTab(tab)}
    >
      <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>
        {tab}
      </Text>
    </TouchableOpacity>
  );
  const redirectToMenu = (item: any) => {
    router.push(
      `/plans/${item.planid}/showmenu?userflag=true&userid=${item.id}`
    );
  };

  const renderItem = ({ item }: any) => (
    <View style={styles.itemContainer}>
      <View style={styles.leftSection}>
        <Text style={styles.itemId}>{item.id}</Text>
        <View>
          <Text style={styles.itemName}>{item.name}</Text>
          <View style={styles.statusContainer}>
            <View
              style={[
                styles.statusBadge,
                item.status === "Active" && styles.activeStatus,
                item.status === "Cancelled" && styles.cancelledStatus,
                item.status === "Paused" && styles.pausedStatus,
              ]}
            >
              <Text
                style={[
                  styles.statusText,
                  item.status === "Active" && styles.activeStatusText,
                  item.status === "Cancelled" && styles.cancelledStatusText,
                  item.status === "Paused" && styles.pausedStatusText,
                ]}
              >
                {item.status}
              </Text>
            </View>
          </View>
        </View>
      </View>

      <View style={styles.rightSection}>
        <View style={styles.planContainer}>
          <Text style={styles.planText}>{item.plan}</Text>
          <Text style={styles.durationText}>{item.duration}</Text>
        </View>
        <View style={styles.buttonGroup}>
          <TouchableOpacity style={styles.deleteButton}>
            <MaterialIcons name="delete" size={16} color="#fff" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.detailsButton}
            onPress={() => redirectToMenu(item)}
          >
            <Text style={styles.detailsText}>Details</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <Searchbar
          placeholder="Search with name"
          onChangeText={setSearch}
          value={search}
          iconColor="#FF6B35"
          placeholderTextColor="#999"
          style={styles.searchBar}
          inputStyle={{ color: "#333" }}
        />
      </View>
      <View style={styles.tabsContainer}>
        {filterTabs.map((tab) => renderTab(tab))}
      </View>

      <FlatList
        data={filteredData}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
};

export default SubscriptionList;
