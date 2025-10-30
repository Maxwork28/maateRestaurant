import { Platform, StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: "#FDF7F1",
    paddingTop: Platform.OS === "android" ? 30 : 0,
    flex: 1,
  },
  navbar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: "#FDF7F1",
    borderBottomWidth: 0,
    borderBottomColor: "transparent",
  },
  logoText: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#6F32AB",
    letterSpacing: 1,
  },
  goOnlineBtn: {
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  goOnlineText: {
    fontSize: 12,
    fontWeight: "bold",
  },
  rightIcons: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatar: {
    width: 34,
    height: 34,
    borderRadius: 17,
    marginRight: 10,
  },
  avatarFallback: {
    backgroundColor: "#6F32AB",
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
  },
  drawerContainer: {
    backgroundColor: "#FDF7F1",
    width: "100%",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomColor: "transparent",
    borderBottomWidth: 0,
    elevation: 0,
    maxHeight: 400,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 0,
    borderBottomColor: "transparent",
  },
  menuLabel: {
    fontSize: 16,
    marginLeft: 10,
    color: "#434140",
    fontWeight: "500",
  },
  childrenWrapper: {
    flex: 1,
  },
});
