import { View } from "react-native";
import RestaurantDashboard from "../components/restaurant/dashboard";

const RestaurantHome = () => {
  return (
    <View style={{ flex: 1 }}>
      <RestaurantDashboard />
    </View>
  );
};

export default RestaurantHome;
