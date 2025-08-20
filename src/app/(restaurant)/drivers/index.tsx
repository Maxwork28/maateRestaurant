// app/(restaurant)/drivers.tsx
import { useLocalSearchParams } from 'expo-router';
import React, { useContext, useMemo } from 'react';
import DeliveryGuyList from '../../components/restaurant/delivery-guys-list';
import { OrderContext } from '../../providers/OrderResProvider';

const Drivers = () => {
  const { orderIds } = useLocalSearchParams<{ orderIds?: string }>();
  const orderContext = useContext(OrderContext);
  
  if (!orderContext) {
    throw new Error('Drivers must be used within an OrderProvider');
  }

  const { completedOrders } = orderContext;

  // Convert string IDs back to actual order objects
  const selectedOrders = useMemo(() => {
    if (!orderIds) return [];
    
    const orderIdArray = orderIds.split(',').map(id => parseInt(id.trim()));
    
    // Find the actual order objects that match the IDs
    return completedOrders.filter(order => orderIdArray.includes(order.id));
  }, [orderIds, completedOrders]);

  console.log('Received orderIds:', orderIds);
  console.log('Selected orders:', selectedOrders);

  return (
    <DeliveryGuyList completedOrders={selectedOrders} />
  );
};

export default Drivers;