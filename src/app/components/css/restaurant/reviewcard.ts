import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  listContainer: {
    padding: 10,
    backgroundColor: '#FDF7F1',
  },
  cardContainer: {
    backgroundColor: "#FDF7F1",
    borderRadius: 16,
    padding: 16,
    marginBottom: 15,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  restaurantImage: {
    width: 60,
    height: 60,
    borderRadius: 10,
    marginRight: 8,
  },
  headerInfo: {
    flex: 1,
  },
  restaurantName: {
    fontWeight: "bold",
    fontSize: 16,
    color: "#6F32AB",
  },
  location: {
    fontSize: 12,
    color: "#434140",
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 2,
  },
  rating: {
    fontSize: 12,
    color: "#434140",
    marginLeft: 3,
  },
  userInfo: {
    alignItems: "center",
    justifyContent: "center",
  },
  userName: {
    fontWeight: "bold",
    fontSize: 12,
    marginTop: 2,
    color: "#6F32AB",
  },
  userLocation: {
    fontSize: 10,
    color: "#434140",
  },
 descriptionContainer: {
  backgroundColor: "#FDF7F1",
  borderRadius: 12,
  padding: 15,
  marginVertical: 8,
  position: "relative",
},

descriptionText: {
  color: "#434140",
  fontSize: 13,
  lineHeight: 18,
  textAlign: "center",
  fontWeight: "500",
},

openQuote: {
  position: "absolute",
  top: 5,
  left: 5,
},

closeQuote: {
  position: "absolute",
  bottom: 5,
  right: 5,
},

  footerText: {
    fontSize: 12,
    color: "#434140",
    marginTop: 2,
    fontWeight: "500",
  },
});
