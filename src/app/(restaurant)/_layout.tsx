import { Slot, usePathname } from "expo-router";
import React from "react";
import Navbar from "../components/restaurant/navbar";
import { OrderCompletionTooltip } from "../components/restaurant/order-completion-msg";
import { OrderProvider } from "../providers/OrderResProvider";

export default function RestaurantLayout() {
  const pathname = usePathname();
  
  // Only show order completion tooltip on relevant screens
  // Hide on profile creation/editing, plans, and subscriptions pages
  const shouldShowTooltip = !pathname.includes('/profile') && 
                           !pathname.includes('/plans') && 
                           !pathname.includes('/subscriptions') &&
                           pathname !== '/(restaurant)/profile' &&
                           pathname !== '/profile';

  console.log('🔍 [RESTAURANT_LAYOUT] Current pathname:', pathname, 'Should show tooltip:', shouldShowTooltip);

  return (
    <OrderProvider>
      <Navbar>
        <Slot />
      </Navbar>
      {shouldShowTooltip && <OrderCompletionTooltip />}
    </OrderProvider>
  );
}
