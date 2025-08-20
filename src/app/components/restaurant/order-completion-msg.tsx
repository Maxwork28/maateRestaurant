// src/components/OrderCompletionTooltip.tsx
import { useRouter } from "expo-router";
import React, { useEffect, useRef } from "react";
import {
    Animated,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { useOrder } from "../../hooks/useOrder";

export const OrderCompletionTooltip = () => {
  const {
    completedOrders,
    showTooltip,
    dismissTooltip,
    markOrdersAsProcessed,
  } = useOrder();
  const router = useRouter();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  useEffect(() => {
    if (showTooltip) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      fadeAnim.setValue(0);
      slideAnim.setValue(50);
    }
  }, [showTooltip]);

  const handleTooltipPress = () => {
    // When navigating to assign drivers, mark these orders as processed
    const orderIds = completedOrders.map((order) => order.id);

    // Navigate to drivers screen
    const orderIdsParam = orderIds.join(',');
    router.push(`/(restaurant)/drivers?orderIds=${orderIdsParam}`);

    console.log("Navigating to drivers with orders:", orderIdsParam);

    // Mark orders as processed so they don't show again
    markOrdersAsProcessed(orderIds);
  };

  const handleDismiss = () => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 50,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => {
      // Only dismiss (temporarily hide) without marking as processed
      dismissTooltip();
    });
  };

  if (!showTooltip) return null;

  return (
    <Animated.View
      style={[
        styles.tooltipContainer,
        {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
        },
      ]}
    >
      <TouchableOpacity
        style={styles.tooltip}
        onPress={handleTooltipPress}
        activeOpacity={0.8}
      >
        <View style={styles.tooltipContent}>
          <Text style={styles.tooltipTitle}>🎉 Orders Completed!</Text>
          <Text style={styles.tooltipMessage}>
            {completedOrders.length} order
            {completedOrders.length > 1 ? "s" : ""} ready for pickup
          </Text>
          <Text style={styles.tooltipAction}>Tap to view drivers →</Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity style={styles.closeButton} onPress={handleDismiss}>
        <Text style={styles.closeButtonText}>×</Text>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  tooltipContainer: {
    position: "absolute",
    bottom: 20,
    left: 20,
    right: 20,
    zIndex: 9999,
  },
  tooltip: {
    backgroundColor: "#4CAF50",
    borderRadius: 12,
    padding: 16,
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  tooltipContent: {
    alignItems: "center",
  },
  tooltipTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 4,
  },
  tooltipMessage: {
    fontSize: 14,
    color: "#fff",
    textAlign: "center",
    marginBottom: 8,
  },
  tooltipAction: {
    fontSize: 12,
    color: "#E8F5E8",
    fontStyle: "italic",
  },
  closeButton: {
    position: "absolute",
    top: 0,
    right: 0,
    backgroundColor: "#fff",
    borderRadius: 15,
    width: 30,
    height: 30,
    justifyContent: "center",
    alignItems: "center",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3,
  },
  closeButtonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#666",
  },
});
