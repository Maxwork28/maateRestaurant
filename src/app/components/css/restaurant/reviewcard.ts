import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  listContainer: {
    padding: 10,
  },
  cardContainer: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 10,
    marginBottom: 15,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
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
    color: "#FF4500",
  },
  location: {
    fontSize: 12,
    color: "#666",
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 2,
  },
  rating: {
    fontSize: 12,
    color: "#666",
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
  },
  userLocation: {
    fontSize: 10,
    color: "#999",
  },
 descriptionContainer: {
  backgroundColor: "#F9F9F9",
  borderRadius: 10,
  padding: 15,
  marginVertical: 8,
  position: "relative",
},

descriptionText: {
  color: "#333",
  fontSize: 13,
  lineHeight: 18,
  textAlign: "center",
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
    color: "#999",
    marginTop: 2,
  },
});
