import { StyleSheet } from "react-native";

export const dashboardStyles = StyleSheet.create({
    container: {
    padding: 16,
    paddingBottom: 100,
    backgroundColor: "#FFFFFF",
    },
  totalIncomeCard: {
    backgroundColor: "#FFF",
    borderRadius: 10,
    marginBottom: 12,
    elevation: 2,
  },
  cardLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#555",
  },
  totalIncomeText: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#FA4A0C",
    marginTop: 8,
  },
  withdrawBtn: {
    backgroundColor: "#FA4A0C",
    borderRadius: 10,
    marginBottom: 20,
  },
  rowGap: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  infoCard: {
    flex: 1,
    padding: 12,
    borderRadius: 12,
  },
  greenCard: {
    backgroundColor: "#E9FFF2",
    marginRight: 8,
  },
  redCard: {
    backgroundColor: "#FFE9E9",
    marginLeft: 8,
  },
  infoLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: "#666",
    marginLeft: 6,
  },
  infoAmount: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
    marginVertical: 4,
  },
  trendRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },
  trendCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 6,
  },
  trendIcon: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
  },
  trendText: {
    fontSize: 14,
    fontWeight: "500",
  },
  iconRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  orderCard: {
    paddingBottom: 16,
    borderRadius: 12,
    backgroundColor: "white",
    marginTop: 10,
  },
  yearDropdown: {
    backgroundColor: "#F1F1F1",
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginRight: 16,
    justifyContent: "center",
  },
  yearText: {
    fontSize: 12,
    color: "#555",
  },
  orderRow: {
    marginBottom: 16,
  },
  orderMainCard: {
    borderRadius: 12,
    backgroundColor: "#fff",
    elevation: 2,
    paddingVertical: 6,
  },
  orderImage: {
    width: 50,
    height: 50,
    marginRight: 12,
    resizeMode: "contain",
  },
  totalOrderLabel: {
    fontSize: 12,
    color: "#999",
  },
  totalOrderValue: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
  },
  orderSmallCard: {
    flex: 1,
    marginHorizontal: 4,
    backgroundColor: "#fff",
    borderRadius: 10,
    elevation: 2,
  },
  smallCardLabel: {
    fontSize: 12,
    color: "#777",
    marginLeft: 4,
  },
  smallCardValue: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },
  progressContainer: {
    marginTop: 16,
    marginBottom:16,
  },
  progressHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  targetText: {
    fontSize: 14,
    color: "#555",
  },
  progressTrack: {
    height: 10,
    borderRadius: 6,
    backgroundColor: "#E0E0E0",
    width: "100%",
  },
  progressFill: {
    height: 10,
    borderRadius: 6,
    backgroundColor: "#FA4A0C",
  },
  progressValue: {
    fontSize: 14,
    color: "#888",
  },
  statusGrid: {
  flexDirection: "row",
  flexWrap: "wrap",
  justifyContent: "space-between",
  marginTop: 12,
},
statusItem: {
  width: "47%",
  marginBottom: 20,
  backgroundColor: "#F9F9F9",
  borderRadius: 12,
  padding: 12,
  alignItems: "center",
  elevation: 2,
},
statusIcon: {
  width: 40,
  height: 40,
  resizeMode: "contain",
  marginBottom: 8,
},
statusLabel: {
  textAlign: "center",
  fontSize: 12,
  color: "#777",
  marginBottom: 4,
},
statusValue: {
  fontSize: 20,
  fontWeight: "bold",
  color: "#333",
},
legendContainer: {
  width: "100%",
  marginTop: 16,
},
legendItem: {
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "space-between",
  marginBottom: 8,
  paddingHorizontal: 12,
},
legendDot: {
  width: 12,
  height: 12,
  borderRadius: 6,
  marginRight: 8,
},
legendLabel: {
  flex: 1,
  fontSize: 13,
  color: "#666",
},
legendValue: {
  fontSize: 13,
  fontWeight: "600",
  color: "#333",
},

});
