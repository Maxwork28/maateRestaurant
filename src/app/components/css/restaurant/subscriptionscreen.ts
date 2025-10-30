import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: "#FDF7F1",
  },
  searchContainer: {
    marginTop: 20,
    marginBottom: 20,
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
  tabsContainer: {
    flexDirection: "row",
    marginBottom: 10,
    flexWrap: "wrap",
    justifyContent: "center",
    alignItems: "center",
  },
  tabButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#6F32AB",
    marginRight: 8,
    marginBottom: 6,
  },
  activeTabButton: {
    backgroundColor: "#6F32AB",
  },
  tabText: {
    color: "#6F32AB",
    fontSize: 13,
    fontWeight: "600",
  },
  activeTabText: {
    color: "#FFFFFF",
    fontWeight: "bold",
  },
  itemContainer: {
    flexDirection: "row",
    backgroundColor: "#FDF7F1",
    borderRadius: 16,
    padding: 16,
    marginBottom: 15,
    justifyContent: "space-between",
    alignItems: "center",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  leftSection: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  itemId: {
    fontSize: 12,
    fontWeight: "500",
    color: "#434140",
  },
  itemName: {
    fontWeight: "bold",
    fontSize: 15,
    color: "#434140",
    maxWidth: 200,
    numberOfLines: 1,
    ellipsizeMode: "tail",
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
    color: "#6F32AB",
    fontWeight: "bold",
  },
  durationText: {
    color: "#434140",
    fontSize: 12,
    marginTop: 2,
    fontWeight: "500",
  },
  buttonGroup: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginTop: 4,
  },
  detailsButton: {
    borderWidth: 1,
    borderColor: "#6F32AB",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  detailsText: {
    color: "#6F32AB",
    fontSize: 12,
    fontWeight: "bold",
  },
  listContent: {
    paddingBottom: 20,
  },
  deleteButton: {
    backgroundColor: "#6F32AB",
    padding: 6,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
  },

});
