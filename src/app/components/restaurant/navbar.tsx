import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState, useEffect } from "react";
import {
  Image,
  LayoutAnimation,
  Platform,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  UIManager,
  View,
  Alert,
} from "react-native";
import { Text } from "react-native-paper";
import { styles } from "../css/restaurant/restaurantnavbar";
import { useAppSelector, useAppDispatch } from "../../../store/hooks";
import { apiConnector } from "../../../services/apiConnector";
import { updateUserProfile } from "../../../store/slices/authSlice";

if (Platform.OS === "android") {
  UIManager.setLayoutAnimationEnabledExperimental &&
    UIManager.setLayoutAnimationEnabledExperimental(true);
}

interface Props {
  children: React.ReactNode;
}
const menuItems = [
  { label: "Dashboard", icon: "chart-line", route: "/(restaurant)" },
  { label: "Menu", icon: "view-grid-outline", route: "/menu" },
  { label: "Plans", icon: "calendar-check-outline", route: "/plans" },
  { label: "Orders", icon: "calendar-blank", route: "/orders" },
  { label: "Reviews", icon: "message-draw", route: "/reviews" },
  { label: "Subscriptions", icon: "account-group", route: "/subscriptions" },
  {
    label: "Driver Details",
    icon: "account-tie",
    route: "/(restaurant)/drivers",
  },
];
const Navbar = ({ children }: Props) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();
  const [activeMenu, setActiveMenu] = useState("Dashboard");
  const [isLoading, setIsLoading] = useState(false);
  
  // Get user data and dispatch from Redux store
  const { user, token } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  
  // Use user's online status from Redux state
  const isOnline = user?.isOnline || false;

  const handleMenuToggle = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setIsMenuOpen(!isMenuOpen);
  };

  const handleGoOnline = async () => {
    if (isLoading) return; // Prevent multiple calls
    
    try {
      setIsLoading(true);
      console.log("🔄 [NAVBAR] Toggling online status...");
      
      // Call the API to toggle online status
      const response = await apiConnector.toggleOnlineStatus(token);
      
      if (response.success && response.data) {
        console.log("✅ [NAVBAR] Online status toggled successfully:", response.data);
        
        // Update Redux state with new online status
        if (user) {
          dispatch(updateUserProfile({
            ...user,
            isOnline: response.data.isOnline
          }));
        }
        
        // Show success message
        Alert.alert(
          "Status Updated",
          response.data.message || `Restaurant is now ${response.data.isOnline ? 'online' : 'offline'}`,
          [{ text: "OK" }]
        );
      } else {
        console.error("❌ [NAVBAR] Failed to toggle online status:", response.message);
        Alert.alert("Error", response.message || "Failed to update status");
      }
    } catch (error: any) {
      console.error("❌ [NAVBAR] Error toggling online status:", error);
      Alert.alert("Error", error.message || "Failed to update status");
    } finally {
      setIsLoading(false);
    }
  };

  const handleProfile = () => {
    console.log("Profile Clicked");
    router.push("/profile" as any);
  };

  const handleNotification = () => {
    console.log("Notification Clicked");
    router.push("/(restaurant)/notifications" as any);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar backgroundColor="#fff" />
      <View style={styles.navbar}>
        <Text style={styles.logoText}>MANGIEE</Text>
        <TouchableOpacity
          onPress={handleGoOnline}
          disabled={isLoading}
          style={[
            styles.goOnlineBtn,
            {
              backgroundColor: isOnline ? "#1AB760" : "#FA4A0C",
              borderWidth: isOnline ? 0 : 1,
              borderColor: isOnline ? "transparent" : "#FA4A0C",
              opacity: isLoading ? 0.6 : 1,
            },
          ]}
        >
          <Text
            style={[
              styles.goOnlineText,
              {
                color: isOnline ? "#FFFFFF" : "#FFFFFF",
                fontWeight: "bold",
              },
            ]}
          >
            {isLoading ? "UPDATING..." : (isOnline ? "GO OFFLINE" : "GO ONLINE")}
          </Text>
        </TouchableOpacity>

        <View style={styles.rightIcons}>
          <TouchableOpacity onPress={handleNotification} style={{ marginRight: 16 }}>
            <Feather name="bell" size={24} color="#000" />
          </TouchableOpacity>

          <TouchableOpacity onPress={handleProfile}>
            {user?.documents?.profileImage ? (
              <Image
                source={{ uri: user.documents.profileImage }}
                style={styles.avatar}
                defaultSource={{ uri: "https://randomuser.me/api/portraits/men/75.jpg" }}
                onError={() => console.log("Failed to load profile image")}
              />
            ) : (
              <View style={[styles.avatar, styles.avatarFallback]}>
                <Text style={styles.avatarText}>
                  {user?.firstName?.charAt(0) || "R"}{user?.lastName?.charAt(0) || "P"}
                </Text>
              </View>
            )}
          </TouchableOpacity>

          <TouchableOpacity onPress={handleMenuToggle}>
            <Feather name={isMenuOpen ? "x" : "menu"} size={24} color="#000" />
          </TouchableOpacity>
        </View>
      </View>

      {isMenuOpen && (
        <View style={styles.drawerContainer}>
          {menuItems.map((item: any) => {
            const isActive = activeMenu === item.label;
            return (
              <TouchableOpacity
                key={item.label}
                onPress={() => {
                  setActiveMenu(item.label);
                  router.push(item.route);
                  handleMenuToggle();
                }}
              >
                <View
                  style={[
                    styles.menuItem,
                    isActive && {
                      backgroundColor: "#FA4A0C10",
                      borderRadius: 8,
                    },
                  ]}
                >
                  <MaterialCommunityIcons
                    name={item.icon as any}
                    size={20}
                    color={isActive ? "#FA4A0C" : "#333"}
                    style={{ width: 24 }}
                  />
                  <Text
                    style={[
                      styles.menuLabel,
                      isActive && { color: "#FA4A0C", fontWeight: "600" },
                    ]}
                  >
                    {item.label}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      )}

      {/* Content below Navbar and Drawer */}
      <View style={styles.childrenWrapper}>{children}</View>
    </SafeAreaView>
  );
};

export default Navbar;