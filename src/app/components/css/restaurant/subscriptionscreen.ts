import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: "#F8F8F8",
  },
  searchContainer: {
    marginTop: 20,
    marginBottom: 20,
  },
  searchBar: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  tabsContainer: {
    flexDirection: "row",
    marginBottom: 10,
    flexWrap: "wrap",
  },
  tabButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#FF4500",
    marginRight: 8,
    marginBottom: 6,
  },
  activeTabButton: {
    backgroundColor: "#FF4500",
  },
  tabText: {
    color: "#FF4500",
    fontSize: 13,
  },
  activeTabText: {
    color: "#fff",
  },
  itemContainer: {
    flexDirection: "row",
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 10,
    marginBottom: 10,
    justifyContent: "space-between",
    alignItems: "center",
  },
  leftSection: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  itemId: {
    fontSize: 12,
    fontWeight: "500",
    color: "#333",
  },
  itemName: {
    fontWeight: "600",
    fontSize: 15,
    color: "#000",
  },
  statusContainer: {
    marginTop: 4,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: "flex-start",
  },
  statusText: {
    fontSize: 11,
    fontWeight: "500",
  },
  activeStatus: {
    backgroundColor: "#DFF5E3",
  },
  activeStatusText: {
    color: "#3BB54A",
  },
  cancelledStatus: {
    backgroundColor: "#FFD5D2",
  },
  cancelledStatusText: {
    color: "#FF4C4C",
  },
  pausedStatus: {
    backgroundColor: "#FFF4CC",
  },
  pausedStatusText: {
    color: "#FF9F00",
  },
  rightSection: {
    alignItems: "flex-end",
    gap: 6,
  },
  planContainer: {
    alignItems: "flex-end",
  },
  planText: {
    fontSize: 13,
    color: "#333",
    fontWeight: "500",
  },
  durationText: {
    color: "#999",
    fontSize: 12,
    marginTop: 2,
  },
  buttonGroup: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginTop: 4,
  },
  detailsButton: {
    borderWidth: 1,
    borderColor: "#FF4500",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  detailsText: {
    color: "#FF4500",
    fontSize: 12,
    fontWeight: "600",
  },
  listContent: {
    paddingBottom: 20,
  },
  deleteButton: {
  backgroundColor: "#FF4500",
  padding: 6,
  borderRadius: 50,
  justifyContent: "center",
  alignItems: "center",
},

});
