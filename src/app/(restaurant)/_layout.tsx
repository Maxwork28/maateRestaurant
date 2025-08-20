import { Slot } from "expo-router";
import React from "react";
import Navbar from "../components/restaurant/navbar";
import { OrderCompletionTooltip } from "../components/restaurant/order-completion-msg";
import { OrderProvider } from "../providers/OrderResProvider";

export default function RestaurantLayout() {
  return (
    <OrderProvider>
      <Navbar>
        <Slot />
      </Navbar>
      <OrderCompletionTooltip />
    </OrderProvider>
  );
}
