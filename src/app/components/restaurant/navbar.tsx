import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter, usePathname } from "expo-router";
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
  ScrollView,
} from "react-native";
import { Text } from "react-native-paper";
import { styles } from "../css/restaurant/restaurantnavbar";
import { useAppSelector, useAppDispatch } from "../../../store/hooks";
import { apiConnector } from "../../../services/apiConnector";
import { updateUserProfile, clearCredentials } from "../../../store/slices/authSlice";
import { useNavigationPersistence } from "../../hooks/useNavigationPersistence";

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
  { label: "Logout", icon: "exit-to-app", route: "logout", isLogout: true },
];
const Navbar = ({ children }: Props) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const [activeMenu, setActiveMenu] = useState("Dashboard");
  const [isLoading, setIsLoading] = useState(false);
  
  // Get user data and dispatch from Redux store
  const { user, token } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  
  // Use navigation persistence hook
  const { saveCurrentRoute, restoreRoute, isRestored, clearSavedRoute } = useNavigationPersistence();
  
  // Use user's online status from Redux state
  const isOnline = user?.isOnline || false;

  // Function to get menu label from route
  const getMenuLabelFromRoute = (route: string): string => {
    const menuItem = menuItems.find(item => item.route === route);
    return menuItem ? menuItem.label : "Dashboard";
  };

  // Debug: Log menu items
  useEffect(() => {
    console.log("🔍 [NAVBAR] Menu items:", menuItems);
  }, []);

  // Effect to handle route changes and update active menu
  useEffect(() => {
    if (pathname && isRestored) {
      const menuLabel = getMenuLabelFromRoute(pathname);
      setActiveMenu(menuLabel);
      console.log('🔄 [NAVBAR] Route changed to:', pathname, 'Menu:', menuLabel);
    }
  }, [pathname, isRestored]);

  // Effect to restore saved route on app start
  useEffect(() => {
    if (user && token && !isRestored) {
      console.log('🔄 [NAVBAR] Restoring route for authenticated user');
      restoreRoute();
    }
  }, [user, token, isRestored, restoreRoute]);

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

  const handleLogout = () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to logout?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Logout",
          style: "destructive",
          onPress: async () => {
            try {
              console.log("🚪 [NAVBAR] Logging out user...");
              
              // Clear saved route
              await clearSavedRoute();
              
              // Clear Redux state
              dispatch(clearCredentials());
              
              // Close menu first
              setIsMenuOpen(false);
              
              // Navigate to login screen and unmount current route
              router.dismissAll();
              router.replace("/(auth)" as any);
              
              console.log("✅ [NAVBAR] User logged out successfully");
            } catch (error) {
              console.error("❌ [NAVBAR] Error during logout:", error);
              Alert.alert("Error", "Failed to logout. Please try again.");
            }
          }
        }
      ]
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar backgroundColor="#FDF7F1" />
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
            <Feather name="bell" size={24} color="#434140" />
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
            <Feather name={isMenuOpen ? "x" : "menu"} size={24} color="#434140" />
          </TouchableOpacity>
        </View>
      </View>

      {isMenuOpen && (
        <ScrollView style={styles.drawerContainer} showsVerticalScrollIndicator={false}>
          {menuItems.map((item: any) => {
            const isActive = activeMenu === item.label;
            console.log("🔍 [NAVBAR] Rendering menu item:", item.label, "isLogout:", item.isLogout);
            return (
              <TouchableOpacity
                key={item.label}
                onPress={async () => {
                  if (item.isLogout) {
                    handleLogout();
                    handleMenuToggle();
                  } else {
                    setActiveMenu(item.label);
                    await saveCurrentRoute(item.route);
                    router.push(item.route);
                    handleMenuToggle();
                  }
                }}
              >
                <View
                  style={[
                    styles.menuItem,
                    isActive && {
                      backgroundColor: "#6F32AB10",
                      borderRadius: 8,
                    },
                    item.isLogout && {
                      borderTopWidth: 1,
                      borderTopColor: "#E0E0E0",
                      marginTop: 8,
                      paddingTop: 16,
                    },
                  ]}
                >
                  <MaterialCommunityIcons
                    name={item.icon as any}
                    size={20}
                    color={item.isLogout ? "#E43D3D" : (isActive ? "#6F32AB" : "#434140")}
                    style={{ width: 24 }}
                  />
                  <Text
                    style={[
                      styles.menuLabel,
                      isActive && { color: "#6F32AB", fontWeight: "bold" },
                      item.isLogout && { color: "#E43D3D", fontWeight: "bold" },
                    ]}
                  >
                    {item.label}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      )}

      {/* Content below Navbar and Drawer */}
      <View style={styles.childrenWrapper}>{children}</View>
    </SafeAreaView>
  );
};

export default Navbar;