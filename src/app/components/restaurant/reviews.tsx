import { reviewData } from "@/constant/restaurant/reviewdata";
import { MaterialIcons } from "@expo/vector-icons";
import React from "react";
import { FlatList, Image, Text, View } from "react-native";
import { Avatar } from "react-native-paper";
import { styles } from "../css/restaurant/reviewcard";

const resolveImage = (filename: string): any => {
  switch (filename) {
    case "burger.jpg":
      return require("../../../../assets/images/burger.jpg");
    case "veg.jpg":
      return require("../../../../assets/images/veg.jpg");
    case "non-veg.jpg":
      return require("../../../../assets/images/non-veg.jpg");
    case "beverages.jpg":
      return require("../../../../assets/images/beverages.jpg");
    case "bestseller.png":
      return require("../../../../assets/images/bestseller.png");
    case "spoffer2.jpg":
      return require("../../../../assets/images/spoffer2.jpg");
    default:
      return require("../../../../assets/images/burger.jpg");
  }
};
const ReviewCard = () => {
  const renderItem = ({ item }: any) => (
    <View style={styles.cardContainer}>
      {/* Header */}
      <View style={styles.header}>
        <Image
          source={
            item.image.startsWith("http") || item.image.startsWith("file")
              ? { uri: item.image }
              : resolveImage(item.image)
          }
          style={styles.restaurantImage}
        />
        <View style={styles.headerInfo}>
          <Text style={styles.restaurantName}>{item.restaurantName}</Text>
          <Text style={styles.location}>{item.location}</Text>
          <View style={styles.ratingContainer}>
            <MaterialIcons name="star" size={14} color="#FFB400" />
            <Text style={styles.rating}>{item.rating} Rating</Text>
          </View>
        </View>
        <View style={styles.userInfo}>
          <Avatar.Image size={40} source={{ uri: item.user.avatar }} />
          <Text style={styles.userName}>{item.user.name}</Text>
          <Text style={styles.userLocation}>{item.user.location}</Text>
        </View>
      </View>

      {/* Description */}
      <View style={styles.descriptionContainer}>
        <MaterialIcons
          name="format-quote"
          size={24}
          color="#FF4500"
          style={styles.openQuote}
        />
        <Text style={styles.descriptionText}>{item.description}</Text>
        <MaterialIcons
          name="format-quote"
          size={24}
          color="#FF4500"
          style={styles.closeQuote}
        />
      </View>

      {/* Footer */}
      <Text style={styles.footerText}>Ordered : {item.orderDate}</Text>
    </View>
  );

  return (
    <FlatList
      data={reviewData}
      renderItem={renderItem}
      keyExtractor={(item) => item.id.toString()}
      contentContainerStyle={styles.listContainer}
    />
  );
};

export default ReviewCard;
